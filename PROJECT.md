# PROJECT.md — ONE · agente operativo de AliceLabs LLC

> Brief único de proyecto (fuente de verdad). Lo leen todas las etapas (landing,
> consola, dashboard). Secretos NUNCA aquí: van en el entorno.

## Identidad
- **Nombre / dominio:** ONE — github.io/one (dominio propio pendiente)
- **One-liner:** agente que trabaja de madrugada, cobra en Monero y reporta a las 07:00
- **Tipo:** página-operativa viva (expediente impreso de un agente real), no SaaS

## Modelo de negocio
- Cobros por encargo en XMR vía MCP propio (7 herramientas); trueque de cómputo
- Sin planes ni suscripciones: boleta por trabajo, tasa de mercado, libro auditable

## Diseño (v4.0 «teletipo que respira»)
- **Adjetivos:** vigilante, nocturno, mecánico, impreso
- **Referencias:** teletipos y agencias de noticias (Reuters print), diarios de
  operaciones militares desclasificados, Braun/Dieter Rams para la caja de instrumentos
- **Canon anti-IA (revisado tras rechazo del fundador a la v3.0 oscura):**
  prohibido neón-sobre-negro, terminal con semáforos, kickers mono espaciados,
  grids de tarjetas, gradientes, glassmorphism, cursor custom. El cliché IA de
  2024–2026 ES la landing oscura con acento verde — esta página es lo contrario.
- **Paleta:** papel cálido #EFEAD8 + tinta #14120C dominan el 95% de la página.
  Verde sello #00F299 — SOLO 2 usos: sello EN VIVO y CTA (con borde de tinta y
  sombra dura, nunca flotando). Rojo #D61E28 (tinta) — SOLO cuenta al ciclo y
  pulso/marcador AHORA. Cian #0099C7 (tinta) — SOLO filete técnico del endpoint MCP.
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
- **Motion (3 y solo 3):** teletipo que escribe el despacho (y las respuestas del
  canal) · pulso 2s en el punto rojo · revelado por palabra del manifiesto.
  `prefers-reduced-motion` lo apaga todo.

## Datos vivos
- Hora Guayaquil (Intl, UTC−5) en cabecera y canal · fecha larga es-EC · número de
  despacho = día del año · cuenta al próximo 07:00 EC · línea de ciclo 24h con
  marcador AHORA · canal directo que responde de verdad (motor local, 13+ intenciones
  en español, datos vivos en cada respuesta, atajos de pregunta) · endpoint MCP:
  POST /api/mcp · 7 herramientas (transporte HTTP remoto = etapa 2, Worker propio)

## Etapas
1. Landing v4.0 (estática en este repo) — ESTA
2. Canal con backend propio (Worker mcp.alicelabs.space; requiere token Cloudflare)
3. Dashboard privado del fundador
