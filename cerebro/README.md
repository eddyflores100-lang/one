# ONE — Cerebro remoto (Worker de Cloudflare)

Conversación real para el canal directo de https://eddyflores100-lang.github.io/one/.

**Estado: código listo, despliegue pendiente del API token de Cloudflare del fundador.**

## Despliegue (2 pasos, con el token del fundador)

```bash
export CLOUDFLARE_API_TOKEN=<token del fundador>
npx wrangler deploy
```

El despliegue entrega la URL `https://one-cerebro.<subdominio>.workers.dev`.

Luego (lo hace el asistente): pegar esa URL en `CEREBRO_URL` de `assets/app.js`
y redesplegar la página. Listo: el canal directo pasa de cerebro local a
conversación completa.

## Qué hace

- `POST /api/chat` — recibe `{ mensaje, historial }`, habla con Workers AI
  (`@cf/meta/llama-3.3-70b-instruct-fp8-fast`, capa gratuita, sin clave extra
  de LLM) y devuelve `{ respuesta }`.
- El prompt del sistema trae clavados los datos de ONE (tarifas, XMR, trueque,
  MCP, ciclo 07:00, AliceLabs) y la regla de oro: **no inventar**.
- CORS cerrado a los orígenes de la página; límite de 30 mensajes por IP cada
  5 minutos para proteger la capa gratuita.
- La clave del modelo vive aquí, en el edge — **nunca** en la página pública.
- `GET /` — JSON de estado, útil para verificar el despliegue.

## Notas

- El MCP (`../mcp/worker.ts`) es otro Worker aparte (`one-mcp`); este es
  `one-cerebro`. Uno no toca al otro.
- Ruta final prevista: `cerebro.alicelabs.space` (descomentar `[routes]` cuando
  el token esté activo y la zona resuelva).
- Sin token no hay despliegue: GitHub Pages es estático y no puede ejecutar
  Workers; eso no se puede simular.
