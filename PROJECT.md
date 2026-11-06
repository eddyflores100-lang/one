# PROJECT.md — ONE · agente operativo de AliceLabs LLC

> Brief único de proyecto (fuente de verdad). Lo leen todas las etapas (landing v3.0,
> consola, dashboard). Secretos NUNCA aquí: van en el entorno.

## Identidad
- **Nombre / dominio:** ONE — github.io/one (dominio propio pendiente)
- **One-liner:** agente que trabaja de madrugada, cobra en Monero y reporta a las 07:00
- **Tipo:** página-operativa viva (expediente + instrumento), no SaaS

## Modelo de negocio
- Cobros por encargo en XMR vía MCP propio (7 herramientas); trueque de cómputo
- Sin planes ni suscripciones: boleta por trabajo, tasa de mercado, libro auditable

## Diseño (v3.0 «turno de noche»)
- **Adjetivos:** vigilante, nocturno, mecánico, preciso — un instrumento que respira
- **Canon 2027 aplicado:** tipo como héroe (80px+ en primer pantallazo), un solo
  acento saturado sobre casi-negro, motion con propósito y `prefers-reduced-motion`,
  composición distinta por sección, página legible por humanos Y agentes (H1 real,
  hechos como frases, JSON-LD)
- **Paleta:** fondo #0B0C0A · texto #F2F1E9 · acento verde #00F299 (SOLO: vivo, 07:00,
  CTA, prompt) · rojo #FB2C36 (SOLO pulso/alerta) · cian #00D1FF (SOLO marcador del
  ciclo y hover técnico) · filetes rgba(242,241,233,.12)
- **Tipos:** display = Syne (variable 400–800) · dato/mono = JetBrains Mono · 2 archivos
- **Escala:** reloj héroe clamp(64–176px) · H2 clamp(34–60px) · cuerpo 17/1.65 · mono 13–14
- **Ritmo:** unidad 8px · secciones 120px arriba / 72 abajo (asimétrico) · bordes rectos
- **Motion (3 y solo 3):** barra de ciclo 24h viva · revelado por palabra del manifiesto ·
  consola con máquina de escribir y caret. Nada más.
- **Prohibido:** glass/backdrop-filter, gradiente-banner, grid de tarjetas uniforme,
  kickers mono espaciados, testimonios falsos, cursor custom

## Datos vivos
- Hora Guayaquil (Intl, UTC−5) · ciclo: informe a las 07:00 EC · barra 24h desde el
  último 07:00 con marca a las 19:00 (inicio de turno) · consola local honesta
  (ayuda/estado/tarifas/trueques/mcp) · endpoint MCP: POST /api/mcp

## Etapas
1. Landing v3.0 (estática en este repo) — ESTA
2. Consola real con backend propio (Worker mcp.alicelabs.space)
3. Dashboard privado del fundador
