# Mercado de potencia · dónde se vende cómputo por Monero

> Investigación del 6 de noviembre de 2026 (hora Guayaquil). Datos verificados
> en fuente; nada inventado. Este dossier alimenta la cartelera de la portada
> (Nº 05 · Potencia a la venta) y el kit de captación que lo acompaña.

## 1. Demanda encontrada

| Señal | Dónde | Qué piden |
| --- | --- | --- |
| Hilo abierto en r/Monero — *«Can I pay for decentralised compute with Monero?»* | reddit.com/r/Monero/comments/1kocqxe | Cómputo que acepte XMR; piden correr imágenes docker o algo parecido |
| Consulta de consultoría pagada en XMR | reddit.com/r/Monero/comments/pdrj0y | Freelancers que cobren en XMR; el problema declarado es *encontrar clientes que paguen en XMR* — del otro lado estamos nosotros |
| XmrBazaar operando desde mayo 2024 | xmrbazaar.com | Marketplace P2P sin KYC con categoría de servicios y alquileres; permite precio fijado en dólar |
| Cierre de Monero Market (mayo 2025) | moneromarket.io (cerrado) | El mercado P2P anterior cerró — la demanda migró a XmrBazaar |

Conclusión: la demanda existe, es pequeña pero real, y el canal de venta
natural es donde esa demanda ya pregunta (r/Monero, XmrBazaar, NOSTR) más los
directorios donde los agentes buscan herramientas (MCP).

## 2. Benchmark de precios (octubre–noviembre 2026)

- Índice GPU (mediana por GPU-h): L40S **$1,62** · A100 80GB **$2,75** ·
  H100 SXM **$4,20** · B200 (Akash) **$5,00** · H200 **$5,70**.
- Workers AI de Cloudflare (nuestro costo de inferencia):
  llama-3.3-70b-instruct-fp8-fast = **$0,293 / M tokens de entrada** y
  **$2,253 / M de salida**. Gratis hasta 10.000 Neurons/día.
- Tasa XMR/USD (Kraken, 6 nov 2026): **≈ 611,18**.

Nuestra lista (cartelera de la portada): inferencia a $0,35 / $2,70 por
millón — ~20 % sobre costo. Encargos desde $25. Trueque anclado al libro
(40 GPU-h A100 ⇄ 0,35 XMR ≈ $5,35/GPU-h, dentro del rango A100 del índice).

## 3. Qué vendemos (y qué no)

| Producto | Estado | Límite honesto |
| --- | --- | --- |
| Cerebro remoto — inferencia LLM por HTTP | EN VIVO (`one-cerebro.eddyflores100.workers.dev`) | No stream; sin historial server-side |
| Cómputo por encargo (scraping, datos, documentos, automatización) | Operativo — lo ejecuta ONE | Entrega 72 h; cotización antes de empezar |
| Trueque de unidades (GPU-h, CPU-h, RAM-GB-h, red-GB) | Libro MCP en vivo (`one-mcp.eddyflores100.workers.dev/api/mcp`) | No vendemos GPU desnuda a escala; el trueque es por trabajo de máquina |
| Venta de hashrate de minado | **No** | Margen fino y fuera del foco: se vende cálculo, no minado |

## 4. Canales de captación (por orden de ejecución)

1. **XmrBazaar** — publicar el anuncio de servicios (texto listo en
   `kit-captacion.md`). Cuenta con correo del fundador; precio fijado en USD.
2. **r/Monero** — responder el hilo 1kocqxe con lo que ya funciona
   (respuesta en inglés, lista en el kit) + nuevo hilo «Services».
3. **Directorios MCP** — el comprador de potencia agente-a-agente busca
   herramientas aquí. Gratis en 2026: registro oficial
   (registry.modelcontextprotocol.io, namespace propio de dominio),
   Glama (glama.ai/mcp/servers), Smithery (listado básico),
   mcpservers.org, mcp.directory y ClaudePluginHub.
   **PulseMCP tiene altas pausadas** (nov 2026) — revisar reapertura.
4. **NOSTR** — comunidad XMR nativa; nota lista en el kit.
5. **Salida fría por correo** — plantilla CAN-SPAM con la dirección física de
   AliceLabs LLC y baja inmediata (ver kit).

## 5. Bloqueos honestos

| Bloqueo | Impacto | Camino |
| --- | --- | --- |
| ~~`ONE_XMR_ADDRESS` sin configurar~~ **RESUELTO 7-nov-2026** | Antes: boletas sin dirección de cobro real | Cartera creada y verificada con dos implementaciones independientes; secret cargado en `one-mcp`; boleta de prueba INV-20261106-4OD2 ya emite cartera real. La semilla (25 palabras) vive en papel/fichero privado del fundador — nunca se publica |
| Tasa Kraken falla en el Worker (`core.ts` busca `XMRUSD`; Kraken responde `XXMRZUSD`) | one_estado cae a tasa fija | Secret `ONE_XMR_FALLBACK_RATE=611` **ya funciona** (ver nota de despliegue); muestra «tasa fija» con etiqueta honesta. El arreglo real (tasa viva) es 1 línea en `core.ts` — requiere aprobar tocar `mcp/` |
| Libro MCP en memoria (sin KV/D1 en el Worker) | Los trueques del Worker se pierden al reciclar el aislado | Crear namespace KV y enlazarlo — toca `mcp/wrangler.toml` (misma regla de integridad) |

**Nota de despliegue (secrets):** el runtime de Cloudflare solo puebla `process.env`
(que lee `core.ts`) con los secrets cuando se activa el flag
`nodejs_compat_populate_process_env`. Se activa con la config externa
`scripts/one-mcp-deploy.wrangler.toml` — el código desplegado es exactamente el
de `mcp/` (diff de integridad = 0); solo cambia configuración de plataforma.
Redesplegar así: `cd scripts && npx wrangler@latest deploy --config one-mcp-deploy.wrangler.toml`.

## 6. Meta

Primer cobro XMR real de un tercero en 30 días (a más tardar el
6 de diciembre de 2026). Métrica que cuenta: boletas `EMITIDA → PAGADA`
en el libro, no visitas.
