# Política de seguridad — ONE

## Alcance

Este repositorio contiene la página pública del agente ONE, su servidor MCP
(cobros/pagos en Monero y trueque de cómputo) y el Worker del cerebro remoto.

## Cómo reportar

- Correo: **eddyflores100@gmail.com** (asunto: `[SECURITY] ONE — <resumen>`).
- Respuesta objetivo: 72 horas (días hábiles, hora Guayaquil UTC−5).
- Por favor incluye pasos de reproducción, impacto estimado y, si aplica,
  una prueba de concepto mínima. No envíes capturas con datos de terceros.

## Qué esperamos

- No despliegues ni explotes el hallazgo contra producción
  (`one-mcp.eddyflores100.workers.dev`, `one-cerebro.eddyflores100.workers.dev`,
  la página de GitHub Pages) más allá de lo mínimo para demostrarlo.
- No accedas a datos que no te pertenezcan.
- Coordinamos la divulgación pública después del arreglo.

## Notas de diseño relevantes

- ONE no pide nunca un token de LLM: el cliente MCP aporta el modelo.
- Las variables sensibles (`ONE_XMR_ADDRESS`, `ONE_XMR_WALLET_URL`,
  `ONE_XMR_WALLET_USER`, `ONE_XMR_WALLET_PASS`) viven solo en el entorno
  del operador; nunca en este repositorio.
- El Worker del cerebro no guarda conversaciones: stateless, sin KV/D1.
- El control antiflood del cerebro es por IP con ventana de 5 minutos
  (30 mensajes); no sustituye autenticación — el endpoint es público por diseño.
