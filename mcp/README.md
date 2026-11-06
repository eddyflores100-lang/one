# ONE MCP

Servidor MCP (Model Context Protocol) del agente **ONE** — AliceLabs LLC.
Cero dependencias: solo TypeScript que corre con Bun, tsx o Wrangler.

## Herramientas (7)

| Tool | Qué hace |
| --- | --- |
| `one_estado` | Hora Guayaquil (UTC−5), cuenta regresiva al ciclo 07:00 EC, config de pagos, tasa XMR/USD. |
| `one_cobrar` | Crea y registra una factura (XMR con tasa de mercado, o USD). |
| `one_pagar` | Registra o ejecuta un pago (envío real solo con `ONE_XMR_WALLET_URL`). |
| `one_pagos_listar` | Auditoría: últimas facturas y pagos. |
| `one_trueque_ofrecer` | Publica oferta/demanda de potencia de cálculo (GPU-h, CPU-h, RAM-GB-h, red-GB…). |
| `one_trueque_listar` | Libro de trueques abiertos y cerrados. |
| `one_trueque_cerrar` | Cierra un trueque registrando la contraparte. |

## Tres transportes, un núcleo

1. **HTTP remoto** — `https://<host>/api/mcp` (streamable HTTP, CORS abierto):
   ```
   claude mcp add --transport http one https://<host>/api/mcp
   ```
2. **stdio local** — sin instalar nada:
   ```
   bun server.ts
   # o: npx tsx server.ts
   ```
   Claude Desktop (`claude_desktop_config.json`): ver `claude_desktop_example.json`.
3. **Cloudflare Workers** — despliegue permanente en el edge:
   ```
   npx wrangler deploy
   ```
   (requiere API token de Cloudflare; sin disco usa memoria — conectar KV/D1 para persistencia total).

## Tokens y claves: quién aporta qué

- **LLM**: nada que configurar. El cliente MCP (Claude, Cursor…) aporta el modelo; ONE nunca necesita ni ve tu token de LLM.
- **Pagos** (variables de entorno, todas opcionales):
  - `ONE_XMR_ADDRESS` — dirección Monero donde ONE cobra. Sin ella, las facturas se emiten marcadas "configurar".
  - `ONE_PAYMENT_LINK` — link alternativo de pago (Stripe/PayPal) que se adjunta a las facturas.
  - `ONE_XMR_WALLET_URL` (+ `ONE_XMR_WALLET_USER`, `ONE_XMR_WALLET_PASS`) — RPC de `monero-wallet-rpc` para que ONE pague de verdad. Sin ella, los pagos quedan como intención auditada.
  - `ONE_XMR_FALLBACK_RATE` — tasa USD/XMR fija por si Kraken está inaccesible.
- **Datos**: `ONE_DATA_DIR` (por defecto `./data/one`): `pagos.json` y `trueque.json`.

## Archivos

- `core.ts` — núcleo único (herramientas, JSON-RPC, HTTP). Sin `node_modules`.
- `server.ts` — transporte stdio.
- `worker.ts` + `wrangler.toml` — transporte Cloudflare Workers.

## Nota

Hora base del agente: Guayaquil (America/Guayaquil, UTC−5).
Emisor legal: AliceLabs LLC · 30 N Gould St, Ste R, Sheridan, WY 82801.
