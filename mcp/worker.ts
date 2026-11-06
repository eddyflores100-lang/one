/**
 * ONE MCP — Cloudflare Workers (streamable HTTP).
 * Despliegue permanente del agente en el edge de Cloudflare
 * (ej. mcp.alicelabs.space). Requiere API token de Cloudflare del fundador:
 *
 *   npx wrangler deploy
 *
 * Sin disco: el libro de pagos/trueque vive en memoria del isolate.
 * Para persistencia real, conectar Cloudflare KV/D1 (siguiente iteración).
 */
import { handleHttp } from "./core";

export interface Env {}

export default {
  async fetch(req: Request, _env: Env, _ctx: unknown): Promise<Response> {
    return handleHttp(req);
  },
};
