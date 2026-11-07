# PROJECT.md — ONE · agente operativo de AliceLabs LLC

> Brief único de proyecto (fuente de verdad). Lo leen todas las etapas (landing,
> consola, dashboard). Secretos NUNCA aquí: van en el entorno.

## Identidad
- **Nombre / dominio:** ONE — github.io/one (dominio propio pendiente)
- **One-liner:** agente que trabaja de madrugada, cobra en Monero y reporta a las 07:00
- **Tipo:** página-operativa viva (expediente impreso de un agente real), no SaaS

## Modelo de negocio
- Cobros por encargo en XMR vía MCP propio (7 herramientas); trueque de cómputo
- Cartelera de potencia (portada Nº 05): inferencia LLM, encargos de cómputo y
  trueque de unidades — precio en USD, liquidación en XMR a tasa Kraken viva
- Sin planes ni suscripciones: boleta por trabajo, tasa de mercado, libro auditable

## Diseño (v4.0 «teletipo que respira» · v4.4 «elementos modernos» · v4.5 «potencia a la venta»)
- **Adjetivos:** vigilante, nocturno, mecánico, impreso
- **Referencias:** teletipos y agencias de noticias (Reuters print), diarios de
  operaciones militares desclasificados, Braun/Dieter Rams para la caja de instrumentos.
  En v4.4 se incorporan patrones de 21st.dev (rotador de palabras, marquesina,
  bento, contadores, progreso, typing dots) SIEMPRE traducidos a tinta plana:
  si un patrón exige degradado o brillo, no entra.
- **Canon anti-IA (revisado tras rechazo del fundador a la v3.0 oscura):**
  prohibido neón-sobre-negro, terminal con semáforos, kickers mono espaciados,
  grids de tarjetas, gradientes, glassmorphism, cursor custom. El cliché IA de
  2024–2026 ES la landing oscura con acento verde — esta página es lo contrario.
- **Paleta:** papel cálido #EFEAD8 + tinta #14120C dominan el 95% de la página.
  Verde sello #00F299 — usos fijados por v4.4: sello EN VIVO, CTA, subrayado del
  rotador, rombo del nav, rombo de la marquesina, bloque actual del pulso y
  punto de estado del tablero. v4.5 añade: chip EN VIVO de la cartelera, regla
  verde que crece al pasar el cursor sobre una fila de la cartelera y sombra
  dura (offset plano, no difusa) de la calculadora. Rojo #D61E28 (tinta) — cuenta al ciclo, marcador
  AHORA, punto del rotador, rombo de la marquesina. Cian #0099C7 (tinta) —
  filete técnico del endpoint MCP, rombo de la marquesina, subrayado del
  enlace al tablero, flecha de conversión de la calculadora. Todo color plano:
  cero degradados, cero brillos.
- **Fuentes:** display = Fraunces (Black 900, óptico opsz 144, WONK) · cuerpo =
  Archivo · dato = IBM Plex Mono
- **Escala:** display despacho clamp(52–108px) · manifiesto clamp(34–72px) ·
  contacto clamp(46–104px) · h2 clamp(36–60px) · cuerpo 17/1.6 · mono 11–15px
- **Ritmo:** unidad 8px · bloques 96px arriba / 56 abajo (asimétrico) · cabeceras
  de periódico: filete de 3px bajo la marca, fecha con filete 1px
- **Artefactos de imprenta (obligatorios):** grano de papel multiplicado, filetes
  de 2px de tinta, reglas punteadas internas, sellos rotados con doble borde
  (sello EN VIVO verde + tinta, EMITIDA/ABIERTO en tinta pura), sello circular
  SVG del pie, formas de documento con doble marco
- **Motion (canon v4.4):** teletipo que escribe el despacho y las respuestas
  del canal · pulso 2s en los puntos de estado · revelado por palabra del
  manifiesto · rotador de palabras del despacho · contadores count-up del
  bento · marquesina continua (pausa al pasar el cursor) · progreso de lectura
  · indicador de escritura (3 puntos) en el canal. Todo con
  `prefers-reduced-motion` apagado y sin degradados en ningún caso.

## Datos vivos
- Hora Guayaquil (Intl, UTC−5) en cabecera, bento, tablero y canal · fecha larga es-EC ·
  número de despacho = día del año · cuenta al próximo 07:00 EC · línea de ciclo 24h con
  marcador AHORA (portada y tablero) · pulso del turno en 12 bloques (tablero) · canal
  directo con cerebro en dos pisos (Worker + 26 temas locales) y typing dots ·
  endpoint MCP: POST /api/mcp · 7 herramientas · tasa XMR/USD viva de Kraken
  (lectura cada 90 s, respaldo fijo 611,18, etiqueta honesta «respaldo fijo» si
  Kraken no responde) · calculadora dólar→XMR con esa tasa · boleta espécimen
  retasada en vivo · cobros reales: cartera XMR de ONE en producción
  (secret `ONE_XMR_ADDRESS`, `47SpGs…9DGM`), boletas `one_cobrar` con
  dirección completa y libro EMITIDA→PAGADA · semilla de la cartera solo en
  papel/fichero privado del fundador, jamás publicada · flota: one-forja
  (taller de operaciones, 6 tools, KV persistente,
  https://one-forja.eddyflores100.workers.dev/api/mcp) y gobernanza en
  docs/gobernanza/REGLAS-FLOTA.md · escaparate XmrBazaar: 3 listados vivos
  (ZMxB · UxmT · E3zp) · 70 repos propios instalados en el sandbox del agente

## Etapas
1. Landing v4.4 + Tablero público de operaciones — ESTA
2. Canal con backend propio consolidado (Worker one-cerebro, en producción)
3. Dashboard privado del fundador
