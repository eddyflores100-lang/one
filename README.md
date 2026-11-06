# ONE — agente operativo autónomo

**Trabaja de madrugada, cobra en Monero y reporta a las 07:00 hora de Guayaquil.**

[![Estado](https://img.shields.io/badge/estado-OPERATIVO-00F299?style=flat-square)](https://eddyflores100-lang.github.io/one/)
[![Versión](https://img.shields.io/badge/versi%C3%B3n-4.3-14120C?style=flat-square)](CHANGELOG.md)
[![Licencia](https://img.shields.io/badge/licencia-Apache--2.0-14120C?style=flat-square)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-7%20herramientas-0099C7?style=flat-square)](mcp/README.md)

ONE es el agente operativo de **AliceLabs LLC**: un expediente impreso y vivo
— manifiesto, ciclo, tarifas, canal de conversación y un servidor MCP propio
para cobrar en XMR y traba r potencia de cómputo. Sin planes, sin
suscripciones: boleta por encargo, libro auditable.

- **Página en vivo** → https://eddyflores100-lang.github.io/one/
- **Canal** → caja de conversación directa en la propia página
- **MCP** → `one-mcp` en el edge, `one_cobrar` / `one_pagar` / trueque de cómputo

---

## Índice

1. [Qué hace ONE](#qué-hace-one)
2. [Arquitectura](#arquitectura)
3. [Uso rápido del MCP](#uso-rápido-del-mcp)
4. [El canal (cerebro en dos pisos)](#el-canal-cerebro-en-dos-pisos)
5. [El ciclo 07:00](#el-ciclo-0700)
6. [Tarifas](#tarifas)
7. [Estructura del repositorio](#estructura-del-repositorio)
8. [Despliegue](#despliegue)
9. [Documentación completa](#documentación-completa)
10. [Seguridad](#seguridad)
11. [Legal](#legal)

## Qué hace ONE

| Capacidad | Cómo funciona |
| --- | --- |
| **Informe diario 07:00** | Cada despacho sale a las 07:00 `America/Guayaquil`; el trabajo nocturno queda listo para leer, no interrumpe. |
| **Radar de nichos** | Vigilancias programadas sobre nichos acordados; el radar cruza lo visto en la madrugada. |
| **Investigación en fuente viva** | Por encargo: fuentes primarias (correo del operador + web), con citas. |
| **Memoria persistente** | El ciclo recuerda lo trabajado entre días; nada se re-lee dos veces. |
| **Cobros en Monero** | Facturas XMR a tasa de mercado (Kraken público) vía MCP propio. |
| **Trueque de cómputo** | Libro abierto de GPU-h / CPU-h / RAM-GB-h / red-GB ⇄ XMR; ventana estándar 72 h. |
| **Canal con cerebro** | Conversación directa en la página: Llama 3.3 70B en el edge con repliegue local de 26 temas. |

## Arquitectura

```
   Página (GitHub Pages) ── canal #canal
        │  POST /api/chat (timeout 9 s)
        ▼
   PISO 1 · Worker one-cerebro (Cloudflare Workers AI, Llama 3.3 70B)
        │  si falla
        ▼
   PISO 2 · cerebro local (26 temas + fallbacks rotativos, en el navegador)

   Cliente MCP (Claude / Cursor / el tuyo — el cliente aporta el LLM)
        ▼
   mcp/core.ts ── 7 herramientas: cobrar · pagar · auditar · trueque
        ▼
   data/one/{pagos.json, trueque.json}  ← libro auditable
```

Detalles en [`docs/arquitectura.md`](docs/arquitectura.md).

## Uso rápido del MCP

```bash
# HTTP remoto (sin instalar nada) — servidor vivo
claude mcp add --transport http one https://one-mcp.eddyflores100.workers.dev/api/mcp

# stdio local (cero dependencias)
bun mcp/server.ts
```

| Tool | Qué hace |
| --- | --- |
| `one_estado` | Hora Guayaquil, cuenta regresiva al ciclo 07:00, tasa XMR/USD |
| `one_cobrar` | Crea y registra una factura (XMR a tasa de mercado, o USD) |
| `one_pagar` | Registra o ejecuta un pago (real solo con `ONE_XMR_WALLET_URL`) |
| `one_pagos_listar` | Auditoría de facturas y pagos |
| `one_trueque_ofrecer` | Publica oferta/demanda de potencia de cálculo |
| `one_trueque_listar` | Libro de trueques abiertos y cerrados |
| `one_trueque_cerrar` | Cierra un trueque con la contraparte registrada |

El núcleo es un solo archivo TypeScript **sin `node_modules`**: detalle en
[`mcp/README.md`](mcp/README.md).

## El canal (cerebro en dos pisos)

El canal conversa en la página. Piso 1: Worker `one-cerebro` (Workers AI,
sin clave de LLM, CORS por lista blanca, 30 mensajes/5 min por IP, no guarda
conversaciones). Piso 2: si el Worker falla, un cerebro local de 26 temas
responde sin repetir líneas. Guía completa: [`docs/canal.md`](docs/canal.md).

```bash
# desplegar tu propio cerebro
cd cerebro && CLOUDFLARE_API_TOKEN=<token> npx wrangler deploy
```

## El ciclo 07:00

| Hora (EC) | Fase |
| --- | --- |
| 02:00 | Ventana nocturna: vigilancia y recopilación |
| 05:30 | Consolidación del radar |
| **07:00** | **Despacho del informe** |
| 07:00–19:00 | Canal abierto: encargos y facturación MCP |
| 19:00 | Última pasada del radar |

Detalle en [`docs/ciclo.md`](docs/ciclo.md).

## Tarifas

Boleta por encargo — sin planes ni suscripciones. Moneda de cobro XMR,
tasa pública Kraken.

| Servicio | USD |
| --- | ---: |
| Informe diario de nichos (ciclo 07:00) | 120 |
| Investigación en fuente viva (por encargo) | 85 |
| Integración MCP en tu cliente | 60 |
| Trueque de cómputo | libro abierto (GPU-h / CPU-h / RAM-GB-h / red-GB ⇄ XMR) |

Ejemplo tasado: US$ 120 → **0,8097 XMR** a tasa 148,20.

## Estructura del repositorio

```
one/
├── index.html                  página operativa (v4.3, teletipo que respira)
├── one-standalone.html         la página completa en un solo archivo portable
├── assets/
│   ├── app.js                  cerebro local (26 temas) + teletipo + reloj
│   ├── styles.css              canon visual (papel y tinta)
│   └── og.png                  imagen social
├── agent/
│   └── one.json                manifiesto completo del agente (legible por máquina)
├── mcp/                        servidor MCP — 3 transportes, núcleo único
│   ├── core.ts                 herramientas de cobro/pago/trueque (sin node_modules)
│   ├── server.ts               transporte stdio
│   ├── worker.ts + wrangler.toml  transporte Cloudflare Workers
│   ├── claude_desktop_example.json
│   └── README.md
├── cerebro/                    Worker del cerebro remoto (Workers AI)
│   ├── worker.ts · wrangler.toml · README.md
├── docs/
│   ├── arquitectura.md         cómo está armado, pieza por pieza
│   ├── ciclo.md                el ciclo 07:00, tabla horaria y entregables
│   ├── canal.md                cerebro en dos pisos, guía del canal
│   ├── pagos-y-trueque.md      XMR, libro auditable, trueque de cómputo
│   ├── despliegue.md           tres piezas desplegables + checklist
│   └── estilo-canon.md         la ley visual (cero estética IA)
├── .github/
│   ├── workflows/estado.yml    chequeo diario de salud (página, cerebro, MCP)
│   └── ISSUE_TEMPLATE/         reporte de fallas (hora Guayaquil obligatoria)
├── PROJECT.md                  brief único del proyecto (fuente de verdad)
├── CHANGELOG.md                historial de versiones
├── SECURITY.md                 política de reporte de vulnerabilidades
├── robots.txt · sitemap.xml
└── LICENSE                     Apache-2.0
```

## Despliegue

Tres piezas, tres comandos — guía completa en [`docs/despliegue.md`](docs/despliegue.md):

```bash
# 1) página
bash scripts/one_gh_deploy.sh                 # (en la máquina del operador)

# 2) cerebro remoto
cd cerebro && CLOUDFLARE_API_TOKEN=<token> npx wrangler deploy

# 3) MCP en el edge
cd mcp && CLOUDFLARE_API_TOKEN=<token> npx wrangler deploy
```

Después de cada push: `git diff e953251 HEAD -- mcp/ | wc -l` → **0**
(el MCP no se toca sin decisión explícita del fundador).

## Documentación completa

- [`docs/arquitectura.md`](docs/arquitectura.md) — piezas, flujos, principios
- [`docs/ciclo.md`](docs/ciclo.md) — el ciclo, el trueque, los entregables
- [`docs/canal.md`](docs/canal.md) — cerebro en dos pisos, cómo clonar el canal
- [`docs/pagos-y-trueque.md`](docs/pagos-y-trueque.md) — XMR, boletas, auditoría
- [`docs/despliegue.md`](docs/despliegue.md) — despliegues y checklist post-push
- [`docs/estilo-canon.md`](docs/estilo-canon.md) — canon visual (prohibiciones incluidas)
- [`agent/one.json`](agent/one.json) — manifiesto del agente legible por máquina
- [`CHANGELOG.md`](CHANGELOG.md) · [`SECURITY.md`](SECURITY.md) · [`PROJECT.md`](PROJECT.md)

## Seguridad

Los reportes van **por correo privado**, nunca en issues públicos:
ver [`SECURITY.md`](SECURITY.md). ONE nunca pide tokens de LLM; las
variables de cobro viven solo en el entorno del operador.

## Legal

**AliceLabs LLC** · 30 N Gould St, Ste R, Sheridan, WY 82801, USA
Toda correspondencia incluye la dirección física (CAN-SPAM). Hora base del
agente: Guayaquil (America/Guayaquil, UTC−5). Código bajo
[Apache-2.0](LICENSE) · © 2026 AliceLabs LLC.
