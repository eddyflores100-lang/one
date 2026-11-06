# El ciclo de ONE

> Hora base: Guayaquil (America/Guayaquil, UTC−5). Sin horario de verano —
> la zona es estable todo el año.

## Tabla del ciclo

| Hora (EC) | Qué pasa |
| --- | --- |
| 02:00 | Ventana de trabajo nocturna abre: vigilancia de nichos y recopilación |
| 05:30 | Consolidación: el radar cruza lo visto en la madrugada |
| 07:00 | **Despacho**: informe del ciclo sale a la luz y queda en la página |
| 07:00–19:00 | Canal abierto: encargos, preguntas, facturación vía MCP |
| 19:00 | Última pasada del radar del día |
| 02:00 (+1) | El ciclo repite |

## Entregables de cada ciclo

1. **Informe de nichos** — hallazgos de la madrugada, con fuentes.
2. **Radar actualizado** — vigilancias programadas con su estado.
3. **Estado del libro** — cobros emitidos, pagos, trueques abiertos.

## Cómo se cobra

- Modelo boleta-por-encargo: sin planes, sin suscripciones.
- Informe diario del ciclo: **US$ 120** → XMR a tasa de mercado
  (referencia pública de Kraken). Ejemplo tasado: 0,8097 XMR a 148,20.
- Cobros y pagos se emiten y auditan con las herramientas MCP
  (`one_cobrar`, `one_pagar`, `one_pagos_listar`).
- Sin dirección XMR configurada, la factura se emite igual y queda
  marcada «configurar» — nunca se pierde un encargo por falta de config.

## Trueque de cómputo

ONE también acepta potencia de cálculo como forma de pago:

- Unidades que se tratan: GPU-h (A100/H100), CPU-h, RAM-GB-h, red-GB.
- Ventana estándar de ejecución acordada: **72 h** desde el cierre.
- Libro abierto en la página y vía `one_trueque_listar`.
- Ejemplos del libro: `40 GPU-h (A100) ⇄ 0,35 XMR`,
  `600 CPU-h ⇄ 120 RAM-GB-h`, `2 TB de tránsito ⇄ 50 GPU-h`.

## Cuenta regresiva en vivo

- En la página: el pie muestra el reloj de Guayaquil y la cuenta
  regresiva al próximo despacho de las 07:00.
- Por MCP: `one_estado` devuelve la misma información en JSON.

## Preguntas frecuentes del ciclo

**¿Por qué 07:00?** Es la hora en que el operador (Ecuador) lee antes de
empezar su día: el trabajo nocturno queda listo, no interrumpe.

**¿Qué pasa si un ciclo falla?** Se registra en el informe del día
siguiente con la causa. Nada falla en silencio.

**¿Se puede pedir un ciclo fuera de horario?** Sí — encargo vía MCP o
canal; se factura como encargo adicional, no cambia el ciclo base.
