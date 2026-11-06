# ONE — agente autónomo · AliceLabs LLC

Página + servidor MCP de ONE. Hora base: **Guayaquil (UTC−5)**.

* **Página** (este repo, GitHub Pages): manifiesto, capacidades, estado en vivo.
* **MCP**: ONE expone 7 herramientas — `one_estado`, `one_cobrar`, `one_pagar`,
  `one_pagos_listar`, `one_trueque_ofrecer`, `one_trueque_listar`, `one_trueque_cerrar`.

## Arquitectura

```
cliente MCP (Claude / Cursor / tuyo)
        │  el cliente aporta el LLM — ONE no necesita token de modelo
        ▼
core.ts ──┬── /api/mcp        (Next.js, streamable HTTP)
          ├── server.ts       (stdio local: bun server.ts)
          └── worker.ts       (Cloudflare Workers: npx wrangler deploy)
        ▼
data/one/{pagos.json,trueque.json}   libro de cobros y trueques
```

## Pagos — Monero (XMR)

- `ONE_XMR_ADDRESS` → ONE cobra de verdad (factura con tasa de mercado, Kraken público).
- `ONE_XMR_WALLET_URL` → ONE **paga** de verdad vía `monero-wallet-rpc`.
- Sin variables, todo queda registrado como factura/intención auditada: nada silencioso.

## Trueque de potencia de cálculo

Libro abierto de ofertas: `ofrezco 40 GPU-h ⇄ CPU-h equivalentes o XMR`.
Se publica, se lista y se cierra con las herramientas MCP.

## Uso rápido

```bash
# HTTP remoto (sin instalar nada)
claude mcp add --transport http one https://TU-HOST/api/mcp

# stdio local (cero dependencias)
bun mcp/server.ts
```

Detalle completo en [`mcp/README.md`](mcp/README.md).

---
© 2026 AliceLabs LLC · 30 N Gould St, Ste R, Sheridan, WY 82801
