# Arquitectura — ONE

> Última revisión: 2026-11-06 · v4.3 · hora base Guayaquil (UTC−5)

ONE es un agente operativo autónomo de AliceLabs LLC. Este documento describe
cómo está armado, pieza por pieza, y por qué cada decisión existe.

## Vista general

```
                        ┌────────────────────────────────┐
                        │   Página pública (GitHub Pages)│
                        │   index.html + assets/app.js   │
                        │   · manifiesto y tarifas       │
                        │   · canal #canal (conversación)│
                        │   · reloj vivo Guayaquil       │
                        └───────────┬────────────────────┘
                                    │ fetch POST /api/chat (timeout 9 s)
                                    ▼
                 ┌──────────────────────────────────────────┐
                 │  PISO 1 — Worker one-cerebro (Cloudflare)│
                 │  @cf/meta/llama-3.3-70b-instruct-fp8-fast│
                 │  CORS por lista blanca · 30 msg/5 min/IP │
                 │  stateless: no guarda conversaciones     │
                 └───────────┬──────────────────────────────┘
                             │ si falla (red, 5xx, timeout)
                             ▼
                 ┌──────────────────────────────────────────┐
                 │  PISO 2 — Cerebro local (en el navegador)│
                 │  26 temas regex · variantes sin repetir  │
                 │  seguimientos cortos · 5 fallbacks       │
                 └──────────────────────────────────────────┘

  Cliente MCP (Claude / Cursor / el tuyo)
        │  streamable HTTP          stdio local        Workers edge
        ▼                                ▼                    ▼
   ┌───────────────────────── mcp/core.ts (núcleo único) ────────────────┐
   │  7 herramientas: estado · cobrar · pagar · pagos_listar ·           │
   │  trueque_ofrecer · trueque_listar · trueque_cerrar                  │
   └──────────────┬──────────────────────────────────────────────────────┘
                  ▼
   data/one/{pagos.json, trueque.json}  ← libro auditable de cobros y trueques
   (en Workers: memoria del proceso; en producción real: KV/D1 o disco)
```

## Principios (no negociables)

1. **El cliente aporta el LLM.** El MCP de ONE nunca pide ni ve un token de
   modelo. En la página, el cerebro remoto corre en Workers AI pagado por la
   cuenta propia de Cloudflare (capa gratuita) — nunca con la clave del visitante.
2. **Nada silencioso.** Sin variables de cobro configuradas, las facturas se
   emiten igual pero marcadas «configurar». Todo queda en el libro auditable.
3. **Hora única: Guayaquil.** Todo ciclo, plazo y marca de tiempo usa
   `America/Guayaquil` (UTC−5), sin excepciones ni zonas ambiguas.
4. **Honestidad sobre lo que es.** La página dice qué es local, qué es remoto
   y qué no se guarda. El canal no finge capacidades que no tiene.
5. **Cero estética IA.** Sin morado, sin gradientes, sin tarjetas uniformes,
   sin emojis en la interfaz. Ver `docs/estilo-canon.md`.

## Piezas

| Pieza | Archivo | Rol |
| --- | --- | --- |
| Página | `index.html` + `assets/` | Manifiesto, capacidades, ciclo, tarifas, canal |
| Bundle portable | `one-standalone.html` | La página completa en un solo archivo |
| Cerebro local | `assets/app.js` | Piso 2 del canal: 26 temas + fallbacks |
| Cerebro remoto | `cerebro/worker.ts` | Piso 1: Workers AI Llama 3.3 70B |
| MCP núcleo | `mcp/core.ts` | Herramientas de cobro/pago/trueque |
| MCP stdio | `mcp/server.ts` | Transporte local (`bun mcp/server.ts`) |
| MCP Workers | `mcp/worker.ts` | Transporte edge (`one-mcp`) |
| Manifiesto | `agent/one.json` | Descriptor completo legible por máquina |

## Flujo del canal (#canal)

1. El visitante escribe → `responder(txt)`.
2. `responderRemoto` hace `POST {cerebro}/api/chat` con
   `{mensaje, historial.slice(-6)}` y `AbortController` de 9 s.
3. Si responde: se imprime por teletipo. Si falla: `responderLocal(txt)`.
4. Local: primero intenciones (26 temas), luego seguimientos cortos
   (≤3 palabras) sobre el último tema, luego 1 de 5 fallbacks (nunca el
   mismo dos veces seguidas, ni repetido contra las últimas 4 dichas).

## Flujo de cobro (MCP)

1. `one_estado` → hora, cuenta regresiva al ciclo, tasa XMR/USD (Kraken).
2. `one_cobrar` → factura con ítem, USD → XMR a tasa de mercado, estado
   `emitida` (o `configurar` si falta `ONE_XMR_ADDRESS`).
3. `one_pagar` → intención de pago; con `ONE_XMR_WALLET_URL` ejecuta vía
   `monero-wallet-rpc`, sin la variable queda `intencion` auditada.
4. `one_pagos_listar` → auditoría de las últimas operaciones.

## Qué NO guarda ONE

- El canal web no guarda conversaciones (ni en Worker ni en navegador
  más allá del historial en memoria de la pestaña).
- El repo no contiene secretos: GitHub token, tokens de Cloudflare,
  app passwords y la llave de Dropi viven fuera del repositorio.

## Verificación de integridad del MCP

Cualquier cambio en este repo debe dejar `mcp/` intacto salvo decisión
explícita del fundador:

```bash
git diff e953251 HEAD -- mcp/ | wc -l   # debe dar 0
```
