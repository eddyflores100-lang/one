# CHANGELOG — ONE

Todos los cambios notables del agente ONE se documentan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).
Hora de referencia: Guayaquil (America/Guayaquil, UTC−5).

## [4.6.0] — 2026-11-07

### Añadido
- **ONE-FORJA, el segundo agente de la flota** (`forja/core.ts` + `forja/worker.ts`,
  v0.1.0, cero dependencias): 6 herramientas MCP — `forja_estado`,
  `forja_repos`, `forja_repo_readme`, `forja_issue_crear`, `forja_web_leer`,
  `forja_memoria` (KV persistente). Desplegado en
  `https://one-forja.eddyflores100.workers.dev/api/mcp` con secret
  `FORJA_GH_TOKEN` y namespace KV `one-forja-memoria`. El libro espejo de
  boletas y la bitácora de captación viven ahora en KV: **sobrevive al
  reciclado del isolate** (lo que one-mcp no puede hacer sin tocar mcp/).
- **Gobernanza de la flota** (`docs/gobernanza/REGLAS-FLOTA.md`): rol de
  cada agente, regla de integridad ONE-MCP (sello e953251), reglas de
  creación de agentes, de secretos, de despliegue y de conducta pública.
- **Inventario de repos** (`docs/gobernanza/REPOS-INVENTARIO.md`): 149
  repos (70 propios + 79 forks) descritos; los 70 propios instalados en el
  sandbox del agente (clones parciales `--filter=blob:none`) — ONE trabaja
  sobre ellos sin red.
- **Sección «La flota y cómo trabaja»** en la portada (Nº 06): los tres
  agentes con sus endpoints y el flujo del encargo en 4 pasos
  (pedido → boleta → pago XMR → ejecución y registro). Canal pasa a Nº 07
  y contacto a Nº 08.
- **Escaparate XmrBazaar ampliado a 3 listados** (cuenta one_alicelabs):
  ZMxB (IT, US$ 25, existente), **UxmT** (Business, US$ 25, precio
  flexible) y **E3zp** (Assistance, LLM API desde US$ 2) — ambos nuevos,
  publicados por ONE-FORJA vía Playwright. El listado de prueba pHAc se
  eliminó el mismo día. Recon de demanda en vivo: 28 listados en Consulting,
  XMR $607.84 en el ticker del sitio, slots Boosted identificados.

### Cambiado
- `agent/one.json` v4.3 → flota: endpoints y herramientas de forja
  documentados junto a las 7 de one-mcp.
- Marquesina de portada anuncia la flota; pie de página v4.5 → v4.6.

## [4.5.2] — 2026-11-07

### Añadido
- **XmrBazaar PUBLICADO** — primer escaparate comercial vivo de ONE:
  `https://xmrbazaar.com/listing/ZMxB` («Compute power & agent services —
  paid in Monero», IT, US$ 25, pago directo + escrow, online, stock ilimitado).
  Para lograrlo se configuró la dirección XMR de cobro en la cuenta, se
  completó el perfil profesional (about/selling) y se generaron las claves del
  mensajero cifrado (respaldo privado en `scripts/.xmrbazaar_mensaje_claves`).
- Evidencia de demanda con fecha 7 nov 2026 en el dossier: ~40 servicios
  destacados pagados en XMR en XmrBazaar (con vendedores de agentes IA
  privacy-first), mercado GPUaaS $7,36 MM→$26,4 MM dominado por inferencia,
  y H100 on-demand $4,50–5,50/h coherente con nuestro índice.
- NOSTR re-verificado en vivo: el evento de captación sigue vivo en
  relay.damus.io y relay.primal.net.

## [4.5.1] — 2026-11-07

### Añadido
- **Cartera de cobros XMR de ONE** creada offline y verificada con dos
  implementaciones independientes (monero-python + derivación propia
  ed25519/keccak/CNBase58); semilla de 25 palabras entregada al fundador en
  fichero privado (`download/ONE-cobros/`) — no se publica.
- Secret `ONE_XMR_ADDRESS` cargado en el Worker `one-mcp`: las boletas reales
  (`one_cobrar`) ya emiten la dirección de pago. Verificado end-to-end con la
  boleta de prueba INV-20261106-4OD2 (PENDIENTE, etiquetada como prueba).
- Config externa de despliegue `scripts/one-mcp-deploy.wrangler.toml`
  (flag `nodejs_compat_populate_process_env`): los secrets llegan a
  `process.env` sin tocar `mcp/` — el código desplegado es idéntico al repo
  (diff de integridad = 0).

### Corregido
- `ONE_XMR_FALLBACK_RATE` ahora sí aplica: `one_estado` muestra
  «611 USD/XMR (tasa fija)» con etiqueta honesta. Causa raíz: el runtime de
  Workers no poblaba `process.env` sin el flag de compatibilidad.

### Cambiado
- Boleta espécimen (Nº 04): nueva línea «Cartera de cobro» con la dirección
  real (enmascarada, completa al pasar el cursor) y nota de cobro actualizada.

## [4.5] — 2026-11-07

### Añadido
- **Sección Nº 05 «Potencia a la venta»** en la portada: cartelera de tres
  productos (cerebro remoto EN VIVO, cómputo por encargo 72 h, trueque de
  unidades del libro MCP), línea de tasa XMR/USD viva (Kraken público,
  lectura cada 90 s, respaldo fijo 611,18 con etiqueta honesta) y
  calculadora dólar→Monero con la tasa del momento.
- Instrucción de compra agente-a-agente dentro de la sección:
  `claude mcp add --transport http one https://one-mcp.eddyflores100.workers.dev/api/mcp`.
- Boleta espécimen (Nº 04) retasada en vivo: tasa e importe se actualizan con
  la lectura de Kraken; sin JS quedan los valores de respaldo.
- **Workers desplegados en producción** (`*.eddyflores100.workers.dev`):
  `one-cerebro` (inferencia llama-3.3-70b de Workers AI, verificado) y
  `one-mcp` (7 herramientas por HTTP, `tools/list` y `one_estado`
  verificados). Secret `ONE_XMR_FALLBACK_RATE=611` cargado en `one-mcp`.
- Docs comerciales: `docs/comercial/mercado-potencia.md` (dossier: demanda
  en r/Monero, XmrBazaar, benchmarks GPU/Workers AI, canales y bloqueos) y
  `docs/comercial/kit-captacion.md` (textos listos: XmrBazaar, r/Monero en
  inglés, NOSTR, directorios MCP, correo frío CAN-SPAM).

### Cambiado
- Numeración de la portada: 04 Cobros · **05 Potencia** · 06 Canal · 07 Contacto.
- Marquesina: chip «POTENCIA A LA VENTA».
- Canon (PROJECT.md): paleta y datos vivos registran la cartelera, la regla
  verde al hover, la sombra dura de la calculadora y la tasa viva.
- Versión v4.4 → v4.5 (pie, cache-bust `?v=45`).

## [4.4] — 2026-11-07

### Añadido
- Elementos modernos (patrones de 21st.dev traducidos a la tinta editorial,
  sin degradados ni morado): rotador de palabras en el despacho, marquesina
  continua de términos, bento «El tablero» con contadores animados,
  progreso de lectura e indicador de escritura en el canal.
- **Página nueva `tablero.html`** — tablero de operaciones en vivo: reloj
  gigante de Guayaquil, cuenta al informe, pulso del turno en 12 bloques
  planos de 2 h, ciclo con marcador AHORA, endpoint MCP, libro de trueque,
  tasa XMR de referencia y despacho del día.
- Nav de páginas (Portada / Tablero) en la cabecera; `tablero.html` en sitemap.
- Contadores accesibles: el HTML trae el valor final (sin JS no hay ceros),
  el JS anima de 0 al valor con easeOutCubic; `prefers-reduced-motion` lo
  apaga junto con marquesina, rotador y dots.

### Cambiado
- Numeración de secciones de la portada: 01 Lo que hace · 02 El ciclo ·
  03 El tablero · 04 Cobros · 05 Canal · 06 Contacto.
- Presupuesto de movimiento ampliado en el canon (ver PROJECT.md): se
  documentan los patrones nuevos y su regla de color plano.

## [4.3] — 2026-11-06

### Corregido
- Cerebro remoto conectado en producción: `CEREBRO_URL` apunta al Worker
  `one-cerebro` en Cloudflare (`one-cerebro.eddyflores100.workers.dev`).
- El canal ya responde cualquier pregunta vía Llama 3.3 70B (Workers AI)
  con fallback local si el Worker no responde en 9 s.
- CORS verificado contra el origen de GitHub Pages; control de golpes
  30 mensajes / 5 min por IP.

## [4.1] — 2026-11-06

### Corregido
- El canal repetía la misma línea prefabricada ante preguntas distintas
  («¿Dónde estás?», «¿por qué no respondes todo?»). Causa raíz: 14
  intenciones regex con respuesta fija y fallback único.
- Reescritura completa del cerebro local: 26 temas con variantes de
  respuesta, memoria de lo ya dicho (no repite las últimas 4 líneas),
  5 fallbacks rotativos que nunca salen dos veces seguidas.
- Orden de decisión corregido: primero intenciones, luego seguimiento
  corto (máx. 3 palabras) sobre el último tema, después fallback.
- Normalización sin acentos en todas las coincidencias.

### Añadido
- Cerebro en dos pisos: `responderRemoto()` (Worker + Workers AI,
  timeout 9 s, historial de 6 turnos) con `responderLocal()` como piso 2.
- Worker `cerebro/worker.ts` — Cloudflare Workers AI
  `@cf/meta/llama-3.3-70b-instruct-fp8-fast` (capa gratuita, sin clave
  extra de LLM), CORS por lista blanca, límite de golpes por IP,
  prompt del sistema con los datos fijos de ONE y prohibición de
  revelar el modelo.
- Pistas nuevas en el canal: «¿Dónde estás?» y «¿Por qué no respondes todo?».
- Nota honesta del canal: qué es local, qué es remoto, qué no se guarda.

## [4.0] — 2026-11-06

### Añadido
- Diseño «teletipo que respira»: papel cálido `#EFEAD8` + tinta `#14120C`,
  tipografías Fraunces (display), Archivo (cuerpo), IBM Plex Mono (dato).
- Canal directo de conversación con ONE en la propia página
  (`#canal`), con pistas de arranque y teletipo de escritura.
- Grano de papel, filetes de imprenta, sellos con doble borde,
  despacho de las 07:00 escrito por teletipo, reloj vivo de Guayaquil.

### Cambiado
- Rediseño total respecto a v3.0 tras rechazo del fundador
  (v3.0 caía en el cliché IA de landing oscura con acento verde).

## [3.0] — 2026-11-06

### Añadido
- Primer rediseño nocturno («canon 2027», Syne). Rechazado por el
  fundador: «la misma mierda de IA de siempre». Lección registrada en
  `docs/estilo-canon.md`.

## [1.0] — 2026-11-06

### Añadido
- Primera versión pública: manifiesto, capacidades, tarifas,
  el ciclo 07:00 y el servidor MCP de 7 herramientas
  (cobros y pagos en Monero + trueque de cómputo).
- MCP en tres transportes: streamable HTTP, stdio local y
  Cloudflare Workers (`one-mcp`).
- Núcleo único `mcp/core.ts` sin `node_modules`.
- Página autocontenida `one-standalone.html` (una sola pieza portable).

## Convenciones

- Las versiones de la página se llevan en el pie de `index.html`.
- Nada en `mcp/` cambia sin verificación posterior: `git diff` del
  directorio debe quedar vacío respecto al commit e953251 salvo
  decisión explícita del fundador.
