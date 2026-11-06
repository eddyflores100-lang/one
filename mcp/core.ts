/**
 * ONE — núcleo de herramientas MCP (cero dependencias externas).
 * AliceLabs LLC · 30 N Gould St, Ste R, Sheridan, WY 82801
 *
 * Un solo núcleo, tres transportes:
 *   · /api/mcp            → Next.js (streamable HTTP) — la página ya ES el agente
 *   · server.ts           → stdio local (bun server.ts / npx tsx server.ts)
 *   · worker.ts           → Cloudflare Workers (streamable HTTP permanente)
 *
 * Hora base del agente: Guayaquil (America/Guayaquil, UTC−5).
 * Pagos: Monero (XMR). Trueque: potencia de cálculo.
 * El MCP NO necesita token de LLM: el cliente (Claude, etc.) aporta el modelo.
 */

export const ONE_VERSION = "0.2.0";

type AnyRec = Record<string, any>;
type JsonRpcId = string | number | null;

export interface JsonRpcMsg {
  jsonrpc: "2.0";
  id?: JsonRpcId;
  method?: string;
  params?: any;
  result?: any;
  error?: any;
}

interface Factura {
  id: string;
  tipo: "cobro" | "pago";
  concepto: string;
  monto_usd: number;
  moneda: string;
  monto_moneda?: string | null;
  tasa_xmr_usd?: number | null;
  direccion?: string | null;
  link?: string | null;
  contraparte?: string | null;
  estado: string;
  tx?: string | null;
  creado: string;
}

interface Trueque {
  id: string;
  tipo: "ofrezco" | "busco";
  recurso: string;
  cantidad: number;
  cambio: string;
  peer?: string | null;
  valida_h: number;
  estado: "abierta" | "cerrada";
  contraparte?: string | null;
  creado: string;
  cerrado?: string | null;
}

/* ── Entorno portable (Node / Bun / Workers) ─────────────────────────── */

function E(): AnyRec {
  return (globalThis as any).process?.env || {};
}
function cwd(): string {
  return (globalThis as any).process?.cwd?.() || ".";
}

/* ── Persistencia: archivo si hay disco; memoria si no (Workers) ─────── */

let fsMod: any = false;
async function fs(): Promise<any> {
  if (fsMod !== false) return fsMod;
  try {
    fsMod = await import("node:fs/promises");
  } catch {
    fsMod = null;
  }
  return fsMod;
}

const memStore = new Map<string, any>();

function dataDir(): string {
  return E().ONE_DATA_DIR || `${cwd()}/data/one`;
}

async function loadJson<T>(name: string, fallback: T): Promise<T> {
  const f = await fs();
  if (!f) return (memStore.get(name) as T) ?? fallback;
  try {
    return JSON.parse(await f.readFile(`${dataDir()}/${name}`, "utf8"));
  } catch {
    return fallback;
  }
}

async function saveJson(name: string, val: any): Promise<void> {
  const f = await fs();
  if (!f) {
    memStore.set(name, val);
    return;
  }
  try {
    await f.mkdir(dataDir(), { recursive: true });
    await f.writeFile(`${dataDir()}/${name}`, JSON.stringify(val, null, 2), "utf8");
  } catch {
    memStore.set(name, val);
  }
}

async function modoPersistencia(): Promise<string> {
  const f = await fs();
  return f ? "archivo (data/one) con respaldo en memoria" : "memoria (sin disco)";
}

/* ── Tiempo: siempre Ecuador ─────────────────────────────────────────── */

const TZ = "America/Guayaquil";

export function horaGuayaquil(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("es-EC", {
    timeZone: TZ,
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(d);
}

function hoyGye(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

export function segsHastaCiclo07(): number {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const [h, m, s] = f.format(new Date()).split(":").map(Number);
  let r = 7 * 3600 - (h * 3600 + m * 60 + s);
  if (r <= 0) r += 86400;
  return r;
}

export function fmtCountdown(seg: number): string {
  const h = Math.floor(seg / 3600);
  const m = Math.floor((seg % 3600) / 60);
  const s = seg % 60;
  return `EN ${String(h).padStart(2, "0")}H ${String(m).padStart(2, "0")}M ${String(s).padStart(2, "0")}S`;
}

function nuevoId(pref: string): string {
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${pref}-${hoyGye().replace(/-/g, "")}-${r}`;
}

/* ── Tasa XMR/USD (Kraken público, caché 60 s, sin API key) ──────────── */

let tasaCache: { tasa: number; ts: number } | null = null;

export async function tasaXmr(): Promise<{ tasa: number | null; fuente: string }> {
  if (tasaCache && Date.now() - tasaCache.ts < 60_000) {
    return { tasa: tasaCache.tasa, fuente: "kraken (caché 60 s)" };
  }
  try {
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), 5000);
    const r = await fetch("https://api.kraken.com/0/public/Ticker?pair=XMRUSD", {
      signal: ctl.signal,
    });
    clearTimeout(to);
    const j: any = await r.json();
    const tasa = parseFloat(j?.result?.XMRUSD?.c?.[0]);
    if (!isFinite(tasa) || tasa <= 0) throw new Error("tasa inválida");
    tasaCache = { tasa, ts: Date.now() };
    return { tasa, fuente: "kraken en vivo" };
  } catch {
    const fb = parseFloat(E().ONE_XMR_FALLBACK_RATE || "");
    if (isFinite(fb) && fb > 0) {
      return { tasa: fb, fuente: "tasa fija ONE_XMR_FALLBACK_RATE" };
    }
    return { tasa: null, fuente: "no disponible" };
  }
}

/* ── Tool: one_estado ────────────────────────────────────────────────── */

async function tEstado(): Promise<string> {
  const t = await tasaXmr();
  const dir = E().ONE_XMR_ADDRESS;
  const dirMask = dir ? `${String(dir).slice(0, 6)}…${String(dir).slice(-4)}` : null;
  return [
    `ONE v${ONE_VERSION} — AGENTE AUTÓNOMO · AliceLabs LLC`,
    `Hora Guayaquil   : ${horaGuayaquil()} (UTC−5)`,
    `Próximo ciclo    : 07:00 EC · ${fmtCountdown(segsHastaCiclo07())}`,
    `Herramientas MCP : ${TOOLS.length}`,
    `Persistencia     : ${await modoPersistencia()}`,
    `Cobros XMR       : ${dirMask ? `dirección lista ✓ (${dirMask})` : "sin dirección — falta ONE_XMR_ADDRESS"}`,
    `Link de pago     : ${E().ONE_PAYMENT_LINK ? "configurado ✓" : "sin link (opcional ONE_PAYMENT_LINK)"}`,
    `Tasa XMR/USD     : ${t.tasa ? `${t.tasa} USD/XMR (${t.fuente})` : "no disponible"}`,
    `Legal            : AliceLabs LLC · 30 N Gould St, Ste R, Sheridan, WY 82801`,
  ].join("\n");
}

/* ── Tool: one_cobrar (facturas) ─────────────────────────────────────── */

async function facturas(): Promise<Factura[]> {
  return loadJson<Factura[]>("pagos.json", []);
}

async function tCobrar(a: AnyRec): Promise<string> {
  const concepto = String(a.concepto || "").trim();
  const monto = Number(a.monto_usd);
  const moneda = String(a.moneda || "XMR").toUpperCase();
  if (!concepto) throw new Error("Falta 'concepto'.");
  if (!isFinite(monto) || monto <= 0) throw new Error("'monto_usd' debe ser un número > 0.");
  if (!["XMR", "USD"].includes(moneda)) throw new Error("'moneda' debe ser XMR o USD.");

  const f = nuevoId("INV");
  let tasa: number | null = null;
  let fuente = "—";
  let montoXmr: number | null = null;
  if (moneda === "XMR") {
    const t = await tasaXmr();
    tasa = t.tasa;
    fuente = t.fuente;
    if (tasa) montoXmr = Math.round((monto / tasa) * 1e4) / 1e4;
  }
  const direccion = E().ONE_XMR_ADDRESS || null;
  const link = E().ONE_PAYMENT_LINK || null;

  const fact: Factura = {
    id: f,
    tipo: "cobro",
    concepto,
    monto_usd: monto,
    moneda,
    monto_moneda: montoXmr !== null ? String(montoXmr) : null,
    tasa_xmr_usd: tasa,
    direccion,
    link,
    contraparte: a.cliente || null,
    estado: "pendiente",
    creado: new Date().toISOString(),
  };
  await saveJson("pagos.json", [...(await facturas()), fact]);

  const L: string[] = [];
  L.push(`FACTURA ${f}`);
  L.push(`Concepto : ${concepto}${a.cliente ? ` · Cliente: ${a.cliente}` : ""}`);
  L.push(`Monto    : ${monto.toFixed(2)} USD`);
  if (moneda === "XMR") {
    if (montoXmr !== null && tasa) {
      L.push(`Equival  : ${montoXmr} XMR (tasa ${fuente}: ${tasa} USD/XMR)`);
    } else {
      L.push(`Equival  : por definir — tasa XMR/USD no disponible ahora (fijable en ONE_XMR_FALLBACK_RATE)`);
    }
    L.push(`Cartera  : ${direccion ? direccion : "⚠ falta ONE_XMR_ADDRESS — configúrala para cobrar de verdad"}`);
  }
  if (link) L.push(`Link     : ${link}`);
  L.push(`Estado   : PENDIENTE · emitida ${horaGuayaquil()} (GYE)`);
  L.push(`Emisor   : AliceLabs LLC · Sheridan, WY`);
  return L.join("\n");
}

/* ── Tool: one_pagar ─────────────────────────────────────────────────── */

async function tPagar(a: AnyRec): Promise<string> {
  const destino = String(a.a_direccion || "").trim();
  const concepto = String(a.concepto || "").trim();
  const monto = Number(a.monto_usd);
  const moneda = String(a.moneda || "XMR").toUpperCase();
  if (!destino) throw new Error("Falta 'a_direccion' (dirección destino).");
  if (!concepto) throw new Error("Falta 'concepto'.");
  if (!isFinite(monto) || monto <= 0) throw new Error("'monto_usd' debe ser un número > 0.");

  const walletUrl = E().ONE_XMR_WALLET_URL || null;
  const p: Factura = {
    id: nuevoId("PAY"),
    tipo: "pago",
    concepto,
    monto_usd: monto,
    moneda,
    direccion: destino,
    contraparte: a.a_nombre || null,
    estado: walletUrl && moneda === "XMR" ? "procesando" : "intencion",
    creado: new Date().toISOString(),
  };

  let extra = "";
  if (walletUrl && moneda === "XMR") {
    const t = await tasaXmr();
    if (!t.tasa) throw new Error("No hay tasa XMR/USD para convertir el monto.");
    const atomic = String(Math.round((monto / t.tasa) * 1e12));
    try {
      const ctl = new AbortController();
      const to = setTimeout(() => ctl.abort(), 15000);
      const user = E().ONE_XMR_WALLET_USER;
      const pass = E().ONE_XMR_WALLET_PASS || "";
      const headers: AnyRec = { "content-type": "application/json" };
      if (user) headers["authorization"] = `Basic ${btoa(`${user}:${pass}`)}`;
      const r = await fetch(walletUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "one",
          method: "transfer",
          params: {
            destinations: [{ amount: atomic, address: destino }],
            account_index: 0,
          },
        }),
        signal: ctl.signal,
      });
      clearTimeout(to);
      const j: any = await r.json();
      if (j.error) throw new Error(j.error.message || "error RPC");
      p.estado = "enviado";
      p.tx = j.result?.tx_hash || null;
      extra = `Envío ejecutado ✓ · tx: ${p.tx || "(sin hash)"}`;
    } catch (e: any) {
      p.estado = "fallo";
      extra = `Fallo el envío vía wallet RPC: ${e?.message || e}. Queda registrado como intención.`;
    }
  } else if (moneda !== "XMR") {
    extra = "Pago en USD: ONE ejecuta XMR directo; este queda como intención para revisión humana.";
  } else {
    extra = "ONE_XMR_WALLET_URL sin configurar: queda como intención de pago (no se movieron fondos).";
  }
  await saveJson("pagos.json", [...(await facturas()), p]);

  return [
    `PAGO ${p.id}`,
    `Destino : ${destino}`,
    `Concepto: ${concepto}`,
    `Monto   : ${monto.toFixed(2)} USD (${moneda})`,
    `Estado  : ${p.estado.toUpperCase()}`,
    extra,
  ].join("\n");
}

/* ── Tool: one_pagos_listar ──────────────────────────────────────────── */

async function tPagosListar(): Promise<string> {
  const todas = await facturas();
  if (!todas.length) return "Sin facturas ni pagos registrados todavía. Usa one_cobrar o one_pagar.";
  const ult = todas.slice(-20).reverse();
  const L = ult.map(
    (f) =>
      `${f.id} · ${f.tipo.toUpperCase()} · ${f.monto_usd.toFixed(2)} USD · ${f.estado} · ${f.concepto}${
        f.contraparte ? ` · ${f.contraparte}` : ""
      }`
  );
  return [`REGISTRO DE PAGOS (${todas.length} en total, últimos ${ult.length}):`, ...L].join("\n");
}

/* ── Trueque de potencia de cálculo ──────────────────────────────────── */

async function trueques(): Promise<Trueque[]> {
  return loadJson<Trueque[]>("trueque.json", []);
}

async function tTruequeOfrecer(a: AnyRec): Promise<string> {
  const tipo = String(a.tipo || "");
  if (!["ofrezco", "busco"].includes(tipo))
    throw new Error("'tipo' debe ser 'ofrezco' o 'busco'.");
  const recurso = String(a.recurso || "").trim();
  if (!recurso)
    throw new Error("Falta 'recurso' (p. ej. GPU-h, CPU-h, RAM-GB-h, red-GB, almacenamiento-GB).");
  const cantidad = Number(a.cantidad);
  if (!isFinite(cantidad) || cantidad <= 0) throw new Error("'cantidad' debe ser un número > 0.");
  const cambio = String(a.cambio || "").trim();
  if (!cambio) throw new Error("Falta 'cambio' (qué pides a cambio: otro recurso, XMR, trabajo…).");
  const valida = Number(a.valida_h ?? 72);
  const t: Trueque = {
    id: nuevoId("TRQ"),
    tipo: tipo as Trueque["tipo"],
    recurso,
    cantidad,
    cambio,
    peer: a.peer || null,
    valida_h: isFinite(valida) && valida > 0 ? valida : 72,
    estado: "abierta",
    contraparte: null,
    creado: new Date().toISOString(),
  };
  await saveJson("trueque.json", [...(await trueques()), t]);
  return [
    `TRUEQUE PUBLICADO ${t.id}`,
    `${t.tipo.toUpperCase()} : ${t.cantidad} ${t.recurso}`,
    `A CAMBIO DE : ${t.cambio}`,
    t.peer ? `Contraparte sugerida : ${t.peer}` : `Abierto a cualquier peer`,
    `Vigencia : ${t.valida_h} h · Estado: ABIERTA`,
  ].join("\n");
}

async function tTruequeListar(a: AnyRec): Promise<string> {
  const ts = await trueques();
  const filtro = a.estado ? String(a.estado) : null;
  const vis = ts.filter((t) => !filtro || t.estado === filtro);
  if (!vis.length) return "No hay trueques que coincidan. Publica uno con one_trueque_ofrecer.";
  const L = vis
    .slice(-30)
    .reverse()
    .map(
      (t) =>
        `${t.id} · ${t.tipo} ${t.cantidad} ${t.recurso} ⇄ ${t.cambio} · ${t.estado.toUpperCase()}${
          t.contraparte ? ` · con ${t.contraparte}` : ""
        }${t.peer ? ` · peer:${t.peer}` : ""}`
    );
  return [`LIBRO DE TRUEQUE (${vis.length}):`, ...L].join("\n");
}

async function tTruequeCerrar(a: AnyRec): Promise<string> {
  const tid = String(a.id || "").trim();
  if (!tid) throw new Error("Falta 'id' del trueque.");
  const contra = String(a.contraparte || "").trim();
  if (!contra) throw new Error("Falta 'contraparte' (con quién se cierra el trueque).");
  const ts = await trueques();
  const t = ts.find((x) => x.id === tid);
  if (!t) throw new Error(`No existe el trueque ${tid}.`);
  if (t.estado !== "abierta") throw new Error(`El trueque ${tid} ya está ${t.estado}.`);
  t.estado = "cerrada";
  t.contraparte = contra;
  t.cerrado = new Date().toISOString();
  await saveJson("trueque.json", ts);
  return [
    `TRUEQUE CERRADO ${t.id}`,
    `${t.tipo} ${t.cantidad} ${t.recurso} ⇄ ${t.cambio}`,
    `Contraparte : ${contra}`,
    `Cerrado     : ${horaGuayaquil()} (GYE)`,
  ].join("\n");
}

/* ── Registro de herramientas (MCP) ──────────────────────────────────── */

export interface ToolDef {
  name: string;
  description: string;
  inputSchema: AnyRec;
  handler: (a: AnyRec) => Promise<string>;
}

export const TOOLS: ToolDef[] = [
  {
    name: "one_estado",
    description:
      "Estado vivo del agente ONE: hora de Guayaquil (UTC−5), cuenta regresiva al ciclo 07:00 EC, herramientas activas, configuración de pagos y tasa XMR/USD.",
    inputSchema: { type: "object", properties: {} },
    handler: () => tEstado(),
  },
  {
    name: "one_cobrar",
    description:
      "Crea una factura a nombre de ONE (AliceLabs LLC) y la registra. Por defecto en Monero (XMR) con tasa de mercado; también USD. Devuelve id, monto, dirección de pago y estado.",
    inputSchema: {
      type: "object",
      properties: {
        concepto: { type: "string", description: "Qué se está cobrando" },
        monto_usd: { type: "number", description: "Monto en USD" },
        cliente: { type: "string", description: "Nombre del cliente (opcional)" },
        moneda: { type: "string", enum: ["XMR", "USD"], description: "Moneda de pago (por defecto XMR)" },
      },
      required: ["concepto", "monto_usd"],
    },
    handler: (a) => tCobrar(a),
  },
  {
    name: "one_pagar",
    description:
      "Registra o ejecuta un pago a nombre de ONE. Si ONE_XMR_WALLET_URL está configurada (monero-wallet-rpc) envía XMR de verdad; si no, queda como intención auditada.",
    inputSchema: {
      type: "object",
      properties: {
        a_direccion: { type: "string", description: "Dirección destino (XMR)" },
        concepto: { type: "string", description: "Concepto del pago" },
        monto_usd: { type: "number", description: "Monto en USD a convertir" },
        a_nombre: { type: "string", description: "Nombre del receptor (opcional)" },
        moneda: { type: "string", enum: ["XMR", "USD"], description: "Moneda (por defecto XMR)" },
      },
      required: ["a_direccion", "concepto", "monto_usd"],
    },
    handler: (a) => tPagar(a),
  },
  {
    name: "one_pagos_listar",
    description: "Lista las últimas facturas y pagos registrados por ONE (auditoría).",
    inputSchema: { type: "object", properties: {} },
    handler: () => tPagosListar(),
  },
  {
    name: "one_trueque_ofrecer",
    description:
      "Publica en el libro de trueque una oferta o demanda de potencia de cálculo (GPU-h, CPU-h, RAM-GB-h, red-GB…) y qué se pide a cambio (otro recurso, XMR, trabajo).",
    inputSchema: {
      type: "object",
      properties: {
        tipo: { type: "string", enum: ["ofrezco", "busco"], description: "Ofrezco o busco" },
        recurso: { type: "string", description: "Recurso: GPU-h, CPU-h, RAM-GB-h, red-GB, almacenamiento-GB…" },
        cantidad: { type: "number", description: "Cantidad del recurso" },
        cambio: { type: "string", description: "Qué se pide a cambio" },
        peer: { type: "string", description: "Contraparte sugerida (opcional)" },
        valida_h: { type: "number", description: "Vigencia en horas (por defecto 72)" },
      },
      required: ["tipo", "recurso", "cantidad", "cambio"],
    },
    handler: (a) => tTruequeOfrecer(a),
  },
  {
    name: "one_trueque_listar",
    description: "Lista el libro de trueques de potencia de cálculo (abiertos por defecto).",
    inputSchema: {
      type: "object",
      properties: {
        estado: { type: "string", enum: ["abierta", "cerrada"], description: "Filtro por estado (opcional)" },
      },
    },
    handler: (a) => tTruequeListar(a),
  },
  {
    name: "one_trueque_cerrar",
    description: "Cierra un trueque del libro registrando la contraparte con la que se pactó.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Id del trueque (TRQ-…)" },
        contraparte: { type: "string", description: "Con quién se cierra" },
      },
      required: ["id", "contraparte"],
    },
    handler: (a) => tTruequeCerrar(a),
  },
];

export async function callTool(name: string, a: AnyRec): Promise<string> {
  const t = TOOLS.find((x) => x.name === name);
  if (!t) throw new Error(`Herramienta desconocida: ${name}`);
  return t.handler(a || {});
}

/* ── JSON-RPC / MCP ──────────────────────────────────────────────────── */

const VERSIONES = ["2025-06-18", "2025-03-26", "2024-11-05"];

function pickVersion(cliente: any): string {
  return VERSIONES.includes(cliente) ? cliente : "2025-06-18";
}

function errResp(id: JsonRpcId, code: number, message: string): JsonRpcMsg {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

export async function handleRpc(msg: any): Promise<JsonRpcMsg | null> {
  if (!msg || msg.jsonrpc !== "2.0") return errResp(null, -32600, "Solicitud no válida");
  if (typeof msg.method !== "string") return null; // respuesta de cliente: ignorar

  const esNotif = msg.id === undefined || msg.id === null;
  const id: JsonRpcId = esNotif ? null : msg.id;

  switch (msg.method) {
    case "initialize":
      return {
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          protocolVersion: pickVersion(msg.params?.protocolVersion),
          capabilities: { tools: { listChanged: false } },
          serverInfo: {
            name: "one-mcp",
            title: "ONE — Agente AliceLabs",
            version: ONE_VERSION,
          },
          instructions:
            "ONE: agente autónomo de AliceLabs LLC. Herramientas de cobro/pago en Monero (XMR) y trueque de potencia de cálculo. Hora base: Guayaquil (UTC−5). No requiere token de LLM: el modelo lo aporta el cliente MCP.",
        },
      };
    case "notifications/initialized":
    case "notifications/cancelled":
    case "notifications/roots/list_changed":
    case "logging/setLevel":
      return null;
    case "ping":
      return { jsonrpc: "2.0", id: msg.id, result: {} };
    case "tools/list":
      return {
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          tools: TOOLS.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
          })),
        },
      };
    case "tools/call": {
      const name = String(msg.params?.name || "");
      const args = msg.params?.arguments || {};
      try {
        const text = await callTool(name, args);
        return {
          jsonrpc: "2.0",
          id: msg.id,
          result: { content: [{ type: "text", text }], isError: false },
        };
      } catch (e: any) {
        return {
          jsonrpc: "2.0",
          id: msg.id,
          result: {
            content: [{ type: "text", text: `ERROR: ${e?.message || e}` }],
            isError: true,
          },
        };
      }
    }
    default:
      if (esNotif) return null;
      return errResp(id, -32601, `Método desconocido: ${msg.method}`);
  }
}

/* ── Transporte HTTP (streamable): /api/mcp y Cloudflare Worker ──────── */

const CORS: AnyRec = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, GET, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, mcp-session-id, mcp-protocol-version, authorization, accept",
  "access-control-expose-headers": "mcp-session-id",
};

function jsonRes(body: any, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...CORS },
  });
}

export async function handleHttp(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method === "GET" || req.method === "DELETE") {
    return jsonRes(
      { error: "Método no soportado: ONE MCP escucha por POST (streamable HTTP)." },
      405
    );
  }
  if (req.method !== "POST") {
    return jsonRes({ error: "Método no permitido" }, 405);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return jsonRes({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "JSON inválido" } }, 400);
  }

  const lote = Array.isArray(body) ? body : [body];
  const outs: JsonRpcMsg[] = [];
  for (const m of lote) {
    const r = await handleRpc(m);
    if (r) outs.push(r);
  }
  if (!outs.length) return new Response(null, { status: 202, headers: CORS });
  if (Array.isArray(body)) return jsonRes(outs);
  return jsonRes(outs[0]);
}
