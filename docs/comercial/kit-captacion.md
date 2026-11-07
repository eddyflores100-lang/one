# Kit de captación · potencia por Monero

> Textos listos para publicar. Ninguno promete lo que no está en vivo.
> Emisor legal en toda salida: **AliceLabs LLC · 30 N Gould St, Ste R,
> Sheridan, WY 82801, EE. UU.** (CAN-SPAM). Bajas: respuesta inmediata.

## 1. Anuncio para XmrBazaar (ES)

- Categoría: Servicios → Computación / Digital
- Precio: fijado en USD (el marketplace convierte a XMR)

**Título:** Potencia de cálculo y servicio de agente — pago en Monero

**Cuerpo:**

```
ONE es un agente operativo de AliceLabs LLC. Vende tres cosas concretas,
pagaderas en XMR a tasa de mercado (Kraken) al momento de la boleta:

1) INFERENCIA LLM POR HTTP
   Llama 3.3 70B servida en el edge de Cloudflare.
   US$ 0,35 por millón de tokens de entrada · US$ 2,70 por millón de salida.
   Mínimo US$ 2. Se entrega endpoint y llave de uso.

2) CÓMPUTO POR ENCARGO
   Scraping y monitoreo web, procesamiento de datos, documentos y gráficos,
   automatizaciones a medida. Cotización cerrada antes de empezar.
   Desde US$ 25 (simple) · US$ 60+ (complejo). Entrega en 72 horas.

3) TRUEQUE DE CÓMPUTO
   GPU-h, CPU-h, RAM-GB-h y tránsito de red, intercambiados por XMR u otros
   recursos, con oferta y cierre registradas en un libro auditable (MCP).

Cómo se cierra: usted pide, se emite boleta con one_cobrar (herramienta MCP
pública), paga la dirección XMR que aparece en la boleta y recibe el trabajo.
Sin cuentas, sin KYC.

Detalle y precios: https://eddyflores100-lang.github.io/one/#potencia
```

## 2. Respuesta para el hilo de r/Monero (EN)

> *Reddit en inglés: la comunidad que pregunta es angloparlante; traducir el
> mensaje la mataría. El resto del kit queda en español.*

**En el hilo** *«Can I pay for decentralised compute with Monero?»* (1kocqxe):

```
We run exactly that, two flavors:

- HTTP LLM inference (Llama 3.3 70B on Cloudflare's edge): $0.35/M input
  tokens, $2.70/M output, minimum $2 — billed in XMR at the Kraken rate
  when the invoice is issued.
- Compute jobs executed by an agent (scraping, data processing, docs,
  automation) from $25, 72h delivery, quoted before starting.

You also get a public MCP server: `claude mcp add --transport http one
https://one-mcp.eddyflores100.workers.dev/api/mcp` — invoice tool
(`one_cobrar`) included, so another agent can hire and pay without a human
in the loop. Details: https://eddyflores100-lang.github.io/one/#potencia

Full docker hosting we don't sell; if that's what you need, Akash is the
honest answer. If you need compute + an agent to run it, that's us.
```

## 3. Nota para NOSTR / X (ES)

```
ONE (agente de AliceLabs) vende potencia de cálculo por Monero:

— Inferencia LLM por HTTP: US$ 0,35/M tokens entrada · 2,70/M salida
— Encargos de cómputo (scraping, datos, automatización): desde US$ 25, 72 h
— Trueque GPU-h/CPU-h/RAM-GB-h con libro MCP auditable

Boleta en XMR a tasa Kraken. Sin KYC, sin cuentas.
Conecta su agente: https://one-mcp.eddyflores100.workers.dev/api/mcp
Precios y calculadora: https://eddyflores100-lang.github.io/one/#potencia
```

## 4. Alta en directorios MCP (pasos)

| Directorio | Acción | Costo |
| --- | --- | --- |
| Registro oficial (registry.modelcontextprotocol.io) | Publicar bajo namespace propio de dominio (server.json) | Gratis |
| Glama (glama.ai/mcp/servers) | Reclamar el listado del repo `eddyflores100-lang/one` | Gratis |
| Smithery (smithery.ai) | Enviar listado básico | Gratis |
| mcpservers.org · mcp.directory · ClaudePluginHub | Enviar URL del repo + endpoint HTTP | Gratis |
| PulseMCP | Altas pausadas (nov 2026) — revisar reapertura | — |

Ficha única para todos: nombre **ONE**, transporte HTTP
`https://one-mcp.eddyflores100.workers.dev/api/mcp`, 7 herramientas
(pagos y trueque de cómputo), repo `github.com/eddyflores100-lang/one`.

## 5. Correo frío (plantilla ES)

**Asunto:** Cómputo y trabajo de agente, pagadero en Monero

```
Buenas — vi que [Razón: usan agentes/automatizan/publican en XMR].

Vendo tres cosas, facturadas en XMR a tasa de mercado:
1. Inferencia LLM por HTTP (Llama 3.3 70B) — desde US$ 0,35 por millón de tokens.
2. Cómputo por encargo (scraping, datos, documentos, automatización) — desde US$ 25, entrega 72 h.
3. Trueque de unidades de cómputo vía MCP, con libro auditable.

Si su equipo quiere probar: un encargo simple de US$ 25, y si el trabajo
no llega en 72 h, no se cobra.

Precios y calculadora: https://eddyflores100-lang.github.io/one/#potencia
Servidor MCP: https://one-mcp.eddyflores100.workers.dev/api/mcp

— ONE · AliceLabs LLC
30 N Gould St, Ste R · Sheridan, WY 82801, EE. UU.
Si no desea más correos, responda «baja» y deja de recibirlos hoy.
```

## 6. Reglas de la salida

1. Publicar solo lo que responde hoy (inferencia, encargos, trueque).
2. Nunca prometer docker dedicado ni GPU desnuda.
3. Cada boleta: tasa impresa en la boleta; emitida no se retasa.
4. Toda respuesta de interés cae al libro y al correo del fundador el mismo
   día, con la hora de Guayaquil.
