/**
 * ONE-FORJA — núcleo de herramientas MCP del agente de operaciones.
 * AliceLabs LLC · 30 N Gould St, Ste R, Sheridan, WY 82801
 *
 * Forja NO reemplaza a one-mcp (congelado, 7 tools, contrato público).
 * Forja es el agente de taller: repos, issues, lectura web y memoria
 * persistente (KV) que sí sobrevive al reciclado del isolate.
 *
 * Cero dependencias externas, TypeScript puro, patrón idéntico a mcp/core.ts.
 * Hora base: Guayaquil (America/Guayaquil, UTC−5).
 */

export const FORJA_VERSION = "0.1.0";

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

export interface ForjaEnv {
  MEMORIA?: KVNamespace;
  FORJA_GH_TOKEN?: string;
}

let ENV: ForjaEnv = {};

export function setForjaEnv(env: ForjaEnv): void {
  ENV = env || {};
}

function ghToken(): string | null {
  return (ENV.FORJA_GH_TOKEN || (globalThis as any).process?.env?.FORJA_GH_TOKEN || "").trim() || null;
}

const TZ = "America/Guayaquil";

function horaGuayaquil(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("es-EC", {
    timeZone: TZ,
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(d);
}

function nuevoId(pref: string): string {
  const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date()).replace(/-/g, "");
  return `${pref}-${hoy}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function mask(s: string): string {
  return s.length > 10 ? `${s.slice(0, 4)}…${s.slice(-4)}` : "…";
}

/* ── GitHub ──────────────────────────────────────────────────────────── */

const GH_USER = "eddyflores100-lang";

function ghHeaders(extra: AnyRec = {}): AnyRec {
  const h: AnyRec = {
    "user-agent": "ONE-Forja (AliceLabs)",
    accept: "application/vnd.github+json",
    ...extra,
  };
  const t = ghToken();
  if (t) h["authorization"] = `Bearer ${t}`;
  return h;
}

async function ghFetch(path: string, init: AnyRec = {}): Promise<any> {
  const ctl = new AbortController();
  const to = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(`https://api.github.com${path}`, {
      ...init,
      headers: ghHeaders(init.headers || {}),
      signal: ctl.signal,
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j?.message || `GitHub HTTP ${r.status}`);
    return j;
  } finally {
    clearTimeout(to);
  }
}

/* ── Memoria persistente (KV) ────────────────────────────────────────── */

async function memEscribir(clave: string, valor: string): Promise<string> {
  const kv = ENV.MEMORIA;
  if (!kv) throw new Error("Binding KV 'MEMORIA' no disponible en este despliegue.");
  const rec = { v: valor, ts: new Date().toISOString() };
  await kv.put(`mem:${clave}`, JSON.stringify(rec));
  return `GUARDADO · clave "${clave}" (${valor.length} chars) · ${horaGuayaquil()} (GYE)`;
}

async function memLeer(clave: string): Promise<string> {
  const kv = ENV.MEMORIA;
  if (!kv) throw new Error("Binding KV 'MEMORIA' no disponible.");
  const raw = await kv.get(`mem:${clave}`);
  if (raw === null) return `VACÍO · no hay nada bajo "${clave}".`;
  try {
    const rec = JSON.parse(raw);
    return `CLAVE   : ${clave}\nGUARDADO: ${rec.ts}\nVALOR   :\n${rec.v}`;
  } catch {
    return `CLAVE   : ${clave}\nVALOR   :\n${raw}`;
  }
}

async function memListar(): Promise<string> {
  const kv = ENV.MEMORIA;
  if (!kv) throw new Error("Binding KV 'MEMORIA' no disponible.");
  const l = await kv.list({ prefix: "mem:" });
  if (!l.keys.length) return "Memoria vacía. Escribe con forja_memoria accion=escribir.";
  const L = l.keys.map((k) => `· ${k.name.slice(4)}`);
  return [`MEMORIA PERSISTENTE (${l.keys.length} claves):`, ...L].join("\n");
}

async function memBorrar(clave: string): Promise<string> {
  const kv = ENV.MEMORIA;
  if (!kv) throw new Error("Binding KV 'MEMORIA' no disponible.");
  await kv.delete(`mem:${clave}`);
  return `BORRADO · "${clave}"`;
}

/* ── Auditoría en KV (issues creados, eventos) ───────────────────────── */

async function auditar(evento: AnyRec): Promise<void> {
  const kv = ENV.MEMORIA;
  if (!kv) return;
  try {
    const raw = await kv.get("auditoria");
    const arr: AnyRec[] = raw ? JSON.parse(raw) : [];
    arr.push(evento);
    await kv.put("auditoria", JSON.stringify(arr.slice(-200)));
  } catch {
    /* la auditoría no debe romper la operación */
  }
}

/* ── Tools ───────────────────────────────────────────────────────────── */

async function tEstado(): Promise<string> {
  const t = ghToken();
  const kvOk = !!ENV.MEMORIA;
  let nClaves = 0;
  if (kvOk) {
    try {
      nClaves = (await ENV.MEMORIA!.list({ prefix: "mem:" })).keys.length;
    } catch {
      /* noop */
    }
  }
  return [
    `ONE-FORJA v${FORJA_VERSION} — AGENTE DE OPERACIONES · AliceLabs LLC`,
    `Hora Guayaquil   : ${horaGuayaquil()} (UTC−5)`,
    `Herramientas MCP : ${TOOLS.length}`,
    `GitHub           : ${t ? `token configurado ✓ (${mask(t)})` : "sin token — solo lectura anónima (limitada)"}`,
    `Memoria KV       : ${kvOk ? `persistente ✓ (${nClaves} claves)` : "no disponible"}`,
    `Repositorios     : ${GH_USER} (70 propios en GitHub)`,
    `Hermano público  : one-mcp (7 tools, congelado) · cerebro (Llama 3.3 70B)`,
    `Legal            : AliceLabs LLC · 30 N Gould St, Ste R, Sheridan, WY 82801`,
  ].join("\n");
}

async function tRepos(a: AnyRec): Promise<string> {
  const filtro = String(a.filtro || "").toLowerCase();
  const limite = Math.min(Number(a.limite || 20) || 20, 50);
  const repos: any[] = await ghFetch(`/users/${GH_USER}/repos?per_page=100&sort=pushed`);
  const vis = repos
    .filter((r) => !filtro || `${r.name} ${r.description || ""}`.toLowerCase().includes(filtro))
    .slice(0, limite);
  if (!vis.length) return `Sin repos que coincidan con "${filtro}".`;
  const L = vis.map(
    (r) =>
      `${r.name} · ${r.language || "—"} · push ${String(r.pushed_at).slice(0, 10)} · ${r.description || "(sin descripción)"}`
  );
  return [
    `REPOSITORIOS ${GH_USER} (${vis.length} de ${repos.length}${filtro ? ` · filtro: ${filtro}` : ""}):`,
    ...L,
  ].join("\n");
}

async function tReadme(a: AnyRec): Promise<string> {
  const repo = String(a.repo || "").trim();
  if (!/^[A-Za-z0-9_.-]+$/.test(repo)) throw new Error("'repo' inválido.");
  const ref = a.rama ? `?ref=${encodeURIComponent(String(a.rama))}` : "";
  const j: any = await ghFetch(`/repos/${GH_USER}/${repo}/readme${ref}`);
  const bytes = Uint8Array.from(atob(String(j.content || "").replace(/\n/g, "")), (c) => c.charCodeAt(0));
  const texto = new TextDecoder("utf-8").decode(bytes);
  const corta = texto.length > 4000 ? `${texto.slice(0, 4000)}\n[…truncado, ${texto.length} chars totales]` : texto;
  return `README ${GH_USER}/${repo}:\n\n${corta}`;
}

async function tIssueCrear(a: AnyRec): Promise<string> {
  const repo = String(a.repo || "").trim();
  if (!/^[A-Za-z0-9_.-]+$/.test(repo)) throw new Error("'repo' inválido.");
  if (!ghToken()) throw new Error("Falta FORJA_GH_TOKEN (secret del Worker) — no puedo crear issues.");
  const titulo = String(a.titulo || "").trim();
  if (!titulo) throw new Error("Falta 'titulo'.");
  const cuerpo = String(a.cuerpo || "").trim();
  if (!cuerpo) throw new Error("Falta 'cuerpo'.");
  const etiquetas = Array.isArray(a.etiquetas) && a.etiquetas.length ? a.etiquetas.map(String) : ["forja"];
  const j: any = await ghFetch(`/repos/${GH_USER}/${repo}/issues`, {
    method: "POST",
    body: JSON.stringify({ title: titulo, body: `${cuerpo}\n\n—\n_Creado por ONE-FORJA v${FORJA_VERSION} · AliceLabs LLC · ${horaGuayaquil()} (GYE)_`, labels: etiquetas }),
    headers: { "content-type": "application/json" },
  });
  await auditar({ id: nuevoId("AUI"), tipo: "issue", repo, url: j.html_url, ts: new Date().toISOString() });
  return [
    `ISSUE CREADO ✓`,
    `Repo : ${GH_USER}/${repo}`,
    `Título: ${titulo}`,
    `URL  : ${j.html_url}`,
    `Nº   : #${j.number}`,
  ].join("\n");
}

async function tWebLeer(a: AnyRec): Promise<string> {
  const url = String(a.url || "").trim();
  if (!/^https?:\/\//i.test(url)) throw new Error("'url' debe empezar por http:// o https://.");
  const ctl = new AbortController();
  const to = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(url, {
      headers: { "user-agent": "ONE-Forja (AliceLabs) recon" },
      signal: ctl.signal,
      redirect: "follow",
    });
    const html = await r.text();
    const limpio = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
    const corta = limpio.length > 4000 ? `${limpio.slice(0, 4000)}\n[…truncado, ${limpio.length} chars]` : limpio;
    return `URL     : ${url}\nHTTP    : ${r.status} · ${Math.round(html.length / 1024)} KB recibidos\nTEXTO   :\n\n${corta || "(página sin texto visible — probablemente JS puro)"}`;
  } finally {
    clearTimeout(to);
  }
}

async function tMemoria(a: AnyRec): Promise<string> {
  const accion = String(a.accion || "listar").toLowerCase();
  const clave = String(a.clave || "").trim();
  switch (accion) {
    case "escribir": {
      if (!clave) throw new Error("Falta 'clave'.");
      const valor = String(a.valor ?? "");
      if (!valor) throw new Error("Falta 'valor' para accion=escribir.");
      return memEscribir(clave, valor);
    }
    case "leer": {
      if (!clave) throw new Error("Falta 'clave'.");
      return memLeer(clave);
    }
    case "borrar": {
      if (!clave) throw new Error("Falta 'clave'.");
      return memBorrar(clave);
    }
    case "listar":
      return memListar();
    default:
      throw new Error("'accion' debe ser: escribir | leer | listar | borrar.");
  }
}

/* ── Registro de herramientas ────────────────────────────────────────── */

export interface ToolDef {
  name: string;
  description: string;
  inputSchema: AnyRec;
  handler: (a: AnyRec) => Promise<string>;
}

export const TOOLS: ToolDef[] = [
  {
    name: "forja_estado",
    description:
      "Estado vivo de ONE-FORJA: hora de Guayaquil (UTC−5), configuración de GitHub y memoria KV persistente, flota de agentes AliceLabs.",
    inputSchema: { type: "object", properties: {} },
    handler: () => tEstado(),
  },
  {
    name: "forja_repos",
    description:
      "Lista o busca los repositorios públicos de eddyflores100-lang (AliceLabs) en GitHub: descripción, lenguaje y último push.",
    inputSchema: {
      type: "object",
      properties: {
        filtro: { type: "string", description: "Texto a buscar en nombre/descripción (opcional)" },
        limite: { type: "number", description: "Máximo a listar (por defecto 20, máx 50)" },
      },
    },
    handler: (a) => tRepos(a),
  },
  {
    name: "forja_repo_readme",
    description: "Lee el README de un repositorio de eddyflores100-lang para saber de qué trata.",
    inputSchema: {
      type: "object",
      properties: {
        repo: { type: "string", description: "Nombre del repo (p. ej. one, marketnow, duo)" },
        rama: { type: "string", description: "Rama (opcional, por defecto la por defecto)" },
      },
      required: ["repo"],
    },
    handler: (a) => tReadme(a),
  },
  {
    name: "forja_issue_crear",
    description:
      "Crea un issue (tarea/aviso) en un repositorio de eddyflores100-lang y lo registra en la auditoría KV. Requiere FORJA_GH_TOKEN.",
    inputSchema: {
      type: "object",
      properties: {
        repo: { type: "string", description: "Nombre del repo destino" },
        titulo: { type: "string", description: "Título del issue" },
        cuerpo: { type: "string", description: "Cuerpo/detalle del issue" },
        etiquetas: { type: "array", items: { type: "string" }, description: "Etiquetas (por defecto ['forja'])" },
      },
      required: ["repo", "titulo", "cuerpo"],
    },
    handler: (a) => tIssueCrear(a),
  },
  {
    name: "forja_web_leer",
    description:
      "Lee una página web pública y devuelve su texto plano (recon de mercado: XmrBazaar, directorios MCP, precios, competidores).",
    inputSchema: {
      type: "object",
      properties: { url: { type: "string", description: "URL http(s) completa" } },
      required: ["url"],
    },
    handler: (a) => tWebLeer(a),
  },
  {
    name: "forja_memoria",
    description:
      "Memoria persistente de la flota (KV): escribir, leer, listar o borrar claves. Sobrevive al reciclado del isolate. Úsala como libro espejo de boletas y decisiones.",
    inputSchema: {
      type: "object",
      properties: {
        accion: { type: "string", enum: ["escribir", "leer", "listar", "borrar"], description: "Operación" },
        clave: { type: "string", description: "Clave (p. ej. boletas-2026-11-07)" },
        valor: { type: "string", description: "Contenido (solo para escribir)" },
      },
    },
    handler: (a) => tMemoria(a),
  },
];

export async function callTool(name: string, a: AnyRec): Promise<string> {
  const t = TOOLS.find((x) => x.name === name);
  if (!t) throw new Error(`Herramienta desconocida: ${name}`);
  return t.handler(a || {});
}

/* ── JSON-RPC / MCP ──────────────────────────────────────────────────── */

const VERSIONES = ["2025-06-18", "2025-03-26", "2024-11-05"];

function pickVersion(c: any): string {
  return VERSIONES.includes(c) ? c : "2025-06-18";
}

function errResp(id: JsonRpcId, code: number, message: string): JsonRpcMsg {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

export async function handleRpc(msg: any): Promise<JsonRpcMsg | null> {
  if (!msg || msg.jsonrpc !== "2.0") return errResp(null, -32600, "Solicitud no válida");
  if (typeof msg.method !== "string") return null;

  const esNotif = msg.id === undefined || msg.id === null;

  switch (msg.method) {
    case "initialize":
      return {
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          protocolVersion: pickVersion(msg.params?.protocolVersion),
          capabilities: { tools: { listChanged: false } },
          serverInfo: {
            name: "one-forja",
            title: "ONE-FORJA — Operaciones AliceLabs",
            version: FORJA_VERSION,
          },
          instructions:
            "ONE-FORJA: agente de operaciones de AliceLabs LLC. Repos, issues, lectura web y memoria persistente KV. El cobro público sigue en one-mcp (congelado). Hora base: Guayaquil (UTC−5).",
        },
      };
    case "notifications/initialized":
    case "notifications/cancelled":
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
      return errResp(msg.id ?? null, -32601, `Método desconocido: ${msg.method}`);
  }
}

/* ── Transporte HTTP ─────────────────────────────────────────────────── */

const CORS: AnyRec = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, GET, OPTIONS",
  "access-control-allow-headers": "content-type, mcp-session-id, mcp-protocol-version, authorization, accept",
};

function jsonRes(body: any, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...CORS },
  });
}

async function pageEstado(): Promise<Response> {
  const t = ghToken();
  let nClaves = "—";
  if (ENV.MEMORIA) {
    try {
      nClaves = String((await ENV.MEMORIA.list({ prefix: "mem:" })).keys.length);
    } catch {
      /* noop */
    }
  }
  const filas = TOOLS.map((t2) => `<tr><td class="mono">${t2.name}</td><td>${t2.description}</td></tr>`).join("");
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ONE-FORJA — AliceLabs</title>
<style>
:root{--verde:#00F299;--cian:#0099C7;--rojo:#D61E28;--papel:#EFEAD8;--tinta:#14120C}
body{background:var(--papel);color:var(--tinta);font:16px/1.6 Georgia,'Times New Roman',serif;margin:0;padding:4rem 1.5rem}
main{max-width:56rem;margin:0 auto}
h1{font-size:2rem;letter-spacing:.04em;margin:0 0 .25rem;border-bottom:3px solid var(--tinta);padding-bottom:.75rem}
h1 span{color:var(--cian)}
p.ley{margin:.5rem 0 2rem;font-style:italic}
.mono{font-family:'SF Mono',Consolas,monospace;font-size:.85em}
table{width:100%;border-collapse:collapse;font-size:.95rem}
th,td{text-align:left;padding:.6rem .5rem;border-bottom:1px solid #c9c3ae;vertical-align:top}
th{font-family:inherit;font-size:.8rem;text-transform:uppercase;letter-spacing:.12em}
footer{margin-top:3rem;border-top:1px solid #c9c3ae;padding-top:1rem;font-size:.8rem;color:#5c574a}
.viva{display:inline-block;background:var(--tinta);color:var(--verde);padding:.15rem .6rem;font-family:monospace;font-size:.85rem}
</style></head><body><main>
<h1>ONE-FORJA <span>/ forja de operaciones</span></h1>
<p class="ley">Agente de operaciones de ONE · repos, issues, lectura web y memoria persistente. El cobro público vive en one-mcp.</p>
<p class="viva">FORJA v${FORJA_VERSION} · ${horaGuayaquil()} (GYE, UTC−5)</p>
<p class="mono">MCP (streamable HTTP): POST /api/mcp · GitHub: ${t ? "token ✓" : "lectura anónima"} · Memoria KV: ${ENV.MEMORIA ? `persistente (${nClaves} claves)` : "no disponible"}</p>
<table><thead><tr><th>Herramienta</th><th>Qué hace</th></tr></thead><tbody>${filas}</tbody></table>
<footer>ONE-FORJA · AliceLabs LLC · 30 N Gould St, Ste R, Sheridan, WY 82801 · Hora base America/Guayaquil (UTC−5)</footer>
</main></body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", ...CORS } });
}

export async function handleForjaHttp(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method === "GET") return pageEstado();
  if (req.method !== "POST") return jsonRes({ error: "Método no permitido" }, 405);

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
