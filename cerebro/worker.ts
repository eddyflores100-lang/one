/**
 * ONE — Cerebro remoto (Cloudflare Worker + Workers AI).
 * Endpoint de conversación real para el canal directo de la página.
 *
 * ESTADO: código listo. Despliegue PENDIENTE del API token de Cloudflare
 * del fundador. Con el token, el despliegue completo son dos comandos
 * (ver README.md de esta carpeta).
 *
 * API:
 *   GET  /           → estado del cerebro (JSON)
 *   POST /api/chat   → { mensaje, historial?: [{q,a},...] } → { respuesta }
 *
 * Modelo: @cf/meta/llama-3.3-70b-instruct-fp8-fast (Workers AI, capa gratuita).
 * La clave del modelo vive AQUÍ, nunca en la página pública.
 */

export interface Env {
  AI?: { run: (modelo: string, entrada: unknown) => Promise<{ response?: string }> };
}

const MODELO = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

// Orígenes que pueden hablar con el cerebro
const ORIGENES_OK = new Set([
  'https://eddyflores100-lang.github.io',
  'http://localhost',
  'http://127.0.0.1',
]);

function cors(origin: string | null): Record<string, string> {
  const h: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
  if (origin && [...ORIGENES_OK].some((o) => origin === o || origin.startsWith(o + ':'))) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Vary'] = 'Origin';
  }
  return h;
}

function json(body: unknown, status = 200, origin: string | null = null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors(origin) },
  });
}

// ── Límite simple por IP: 30 mensajes / 5 min (protección de la capa gratis) ──
const golpeteo = new Map<string, { n: number; reset: number }>();
function permitido(ip: string): boolean {
  const ahora = Date.now();
  const v = golpeteo.get(ip);
  if (!v || ahora > v.reset) {
    golpeteo.set(ip, { n: 1, reset: ahora + 5 * 60 * 1000 });
    return true;
  }
  v.n += 1;
  return v.n <= 30;
}

// ── Identidad y datos de ONE: el sistema no inventa, los datos son los del sitio ──
function promptSistema(): string {
  return [
    'Eres ONE, agente operativo de AliceLabs LLC. Respondes en español (registro neutro-ecuatoriano, trato de usted).',
    'Personalidad: seco, directo, cero humo, cero emojis, cero marketing. "Datos o silencio". Respuestas de 2 a 6 frases; si no sabes algo, dices que no lo sabes y no inventas.',
    'Datos fijos que puedes usar:',
    '- Informe diario a las 07:00 en punto, hora de Guayaquil (UTC-5): cada madrugada lees el catálogo completo, puntúas candidatos por demanda, margen y competencia, solo apruebas nichos de competencia baja, y el correo privado sale antes de las 07:00 o no llega.',
    '- Tarifas: boleta por encargo, sin planes. Espécimen: informe de nichos del ciclo diario, US$ 120,00 → 0,8097 XMR a tasa Kraken 148,20.',
    '- Pagos en Monero (XMR) a tasa de mercado con referencia Kraken; con ONE_XMR_ADDRESS la boleta trae la dirección y el libro registra EMITIDA → PAGADA.',
    '- Por qué Monero: el monto, emisor y receptor no quedan en un libro público; la tasa es verificable.',
    '- Trueque de cómputo: potencia por potencia o potencia por XMR en libro abierto (ejemplos: 40 GPU-h A100 por 0,35 XMR; 600 CPU-h por 120 RAM-GB-h; 2 TB de tránsito por 50 GPU-h; ofertas vencen a 72 horas).',
    '- Servidor MCP con 7 herramientas: one_estado, one_cobrar, one_pagar, one_pagos_listar, one_trueque_ofrecer, one_trueque_listar, one_trueque_cerrar.',
    '- Empresa: AliceLabs LLC, 30 N Gould St, Ste R, Sheridan, WY 82801, EE. UU. El fundador opera desde Guayaquil, Ecuador.',
    '- Sitio: https://eddyflores100-lang.github.io/one/. Canal público: solo esta página. El informe viaja por correo privado, nunca en canales públicos.',
    '- No tienes acceso a datos privados, catálogos, correos ni claves desde este chat. Si preguntan por eso, lo dices y ofreces lo público.',
    'Nunca digas que eres GLM, Llama, ChatGPT ni ningún modelo: eres ONE. Si preguntan qué tecnología usas, dices "un modelo de lenguaje servido en el edge de Cloudflare".',
  ].join('\n');
}

interface MsgQ { role: 'system' | 'user' | 'assistant'; content: string }

function aMensajes(mensaje: string, historial: { q: string; a: string }[]): MsgQ[] {
  const msgs: MsgQ[] = [{ role: 'system', content: promptSistema() }];
  for (const h of (historial || []).slice(-6)) {
    if (h && typeof h.q === 'string' && typeof h.a === 'string') {
      msgs.push({ role: 'user', content: String(h.q).slice(0, 800) });
      msgs.push({ role: 'assistant', content: String(h.a).slice(0, 1200) });
    }
  }
  msgs.push({ role: 'user', content: String(mensaje || '').slice(0, 800) });
  return msgs;
}

export default {
  async fetch(req: Request, env: Env, _ctx: unknown): Promise<Response> {
    const url = new URL(req.url);
    const origin = req.headers.get('Origin');

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '')) {
      return json({ agente: 'ONE', servicio: 'cerebro-remoto', estado: 'OPERATIVO', modelo: MODELO, hora: 'America/Guayaquil' }, 200, origin);
    }

    if (req.method === 'POST' && url.pathname === '/api/chat') {
      if (!env.AI) {
        return json({ error: 'Workers AI no está enlazado en este despliegue. Revise el binding [ai] en wrangler.toml.' }, 503, origin);
      }
      const ip = req.headers.get('CF-Connecting-IP') || 'desconocida';
      if (!permitido(ip)) {
        return json({ error: 'Demasiados mensajes. Espere unos minutos.' }, 429, origin);
      }
      let cuerpo: { mensaje?: string; historial?: { q: string; a: string }[] } = {};
      try { cuerpo = await req.json(); } catch { return json({ error: 'JSON inválido' }, 400, origin); }
      const mensaje = (cuerpo.mensaje || '').trim();
      if (!mensaje) return json({ error: 'Mensaje vacío' }, 400, origin);
      if (mensaje.length > 800) return json({ error: 'Mensaje demasiado largo (máx. 800)' }, 413, origin);

      try {
        const salida = await env.AI.run(MODELO, {
          messages: aMensajes(mensaje, cuerpo.historial || []),
          max_tokens: 400,
          temperature: 0.4,
        });
        const respuesta = (salida && salida.response ? String(salida.response) : '').trim();
        if (!respuesta) return json({ error: 'El cerebro no devolvió texto' }, 502, origin);
        return json({ respuesta }, 200, origin);
      } catch (e) {
        return json({ error: 'Falla del cerebro: ' + (e instanceof Error ? e.message : 'desconocida') }, 502, origin);
      }
    }

    return json({ error: 'Ruta no encontrada' }, 404, origin);
  },
};
