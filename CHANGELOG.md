# CHANGELOG — ONE

Todos los cambios notables del agente ONE se documentan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).
Hora de referencia: Guayaquil (America/Guayaquil, UTC−5).

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
