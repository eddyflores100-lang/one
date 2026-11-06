# El canal de ONE (cerebro en dos pisos)

> El canal es la caja de conversación directa con ONE, incrustada en la
> página. v4.1+ · última revisión 2026-11-06

## Por qué existe

El fundador detectó que el canal repetía la misma línea prefabricada para
preguntas distintas y que el Worker «se supone que estaba conectado» pero no
respondía todo. La respuesta fue una reescritura honesta: un cerebro remoto
real con un piso local de emergencia, y una nota en la interfaz que dice
exactamente qué hace cada piso.

## Piso 1 — remoto (Worker one-cerebro)

- URL pública: `https://one-cerebro.eddyflores100.workers.dev`
- Modelo: `@cf/meta/llama-3.3-70b-instruct-fp8-fast` (Cloudflare Workers AI,
  capa gratuita — sin clave de LLM y sin costo por uso básico).
- `POST /api/chat` con `{mensaje, historial?}`; el historial se recorta a los
  últimos 6 turnos para mantener el costo y la latencia acotados.
- Timeout del lado del navegador: **9 segundos** (`AbortController`).
- `promptSistema()` clava la identidad y los datos: ciclo 07:00 Guayaquil,
  tarifas (US$ 120 → 0,8097 XMR @ Kraken 148,20), trueque 72 h, 7 tools MCP,
  AliceLabs LLC Sheridan WY, regla «no inventar» y prohibición de revelar
  qué modelo corre debajo.
- Control antiflood: 30 mensajes / 5 minutos por IP (`CF-Connecting-IP`).
- Sin binding de AI disponible → `503` con mensaje claro (el navegador
  cae al piso 2 sin que el visitante tenga que hacer nada).

## Piso 2 — local (26 temas, dentro de app.js)

Se activa si el Worker no responde. No es un «FAQ»: es un repliegue digno.

- **26 temas** con 3–5 variantes de respuesta cada uno (`elegir()` rota y
  guarda lo dicho en `dichas[]` — no repite nada de las últimas 4 líneas).
- Coincidencias **sin acentos** (`sinAcentos()` normaliza NFD).
- Orden de decisión:
  1. **Intenciones**: si la frase toca un tema, gana el tema.
  2. **Seguimiento corto** (≤3 palabras: «y el trueque?», «dime más»)
     sobre el último tema tratado — nunca invade una intención nueva.
  3. **Fallback**: 5 variantes que invitan a lo concreto; nunca el mismo
     dos veces seguidas (`ultFallback`).

## Copiar el canal a otra página

```html
<!-- 1) la caja -->
<div id="canal"></div>

<!-- 2) los dos archivos (app.js trae el cerebro local completo) -->
<link rel="stylesheet" href="assets/styles.css">
<script defer src="assets/app.js"></script>

<!-- 3) tu propio Worker del cerebro (opcional, si clonas el agente) -->
<script>window.CEREBRO_URL_OVERRIDE = 'https://tu-worker.workers.dev';</script>
```

El Worker se despliega así:

```bash
cd cerebro
CLOUDFLARE_API_TOKEN=<token> npx wrangler deploy
# la URL workers.dev que entrega el deploy va en CEREBRO_URL de assets/app.js
```

## Limitaciones declaradas (honestidad de canal)

- La conversación **no se guarda**: ni el Worker ni la página persisten
  historial; al recargar, se empieza de cero.
- El canal no ejecuta cobros: para encargos reales, el contacto es por
  MCP (`one_cobrar`) o correo del operador.
- Si el Worker está caído y la pregunta no calza en los 26 temas, el canal
  lo dice — no improvisa datos.
