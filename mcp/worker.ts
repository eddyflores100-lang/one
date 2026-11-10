/**
 * ONE MCP — Cloudflare Workers (streamable HTTP).
 * Despliegue permanente del agente en el edge de Cloudflare
 * (ej. mcp.alicelabs.space). Requiere API token de Cloudflare del fundador:
 *
 *   npx wrangler deploy
 *
 * Persistencia: binding KV `ONE_KV` (namespace one-libro) — el libro de
 * pagos/trueque sobrevive a reinicios y redeploys del isolate. Sin binding
 * cae a archivo (Node/Bun) y de último recurso a memoria.
 */
import { handleHttp, setKvBinding } from "./core";

export interface Env {
  ONE_KV?: KVNamespace;
}

export default {
  async fetch(req: Request, env: Env, _ctx: unknown): Promise<Response> {
    setKvBinding(env.ONE_KV ?? null);
    return handleHttp(req);
  },
};
