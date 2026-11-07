/**
 * ONE-FORJA — Cloudflare Workers (streamable HTTP).
 * Agente de operaciones de la flota ONE (AliceLabs LLC).
 *
 * Depende del binding KV "MEMORIA" (persistencia real, sobrevive reciclado)
 * y del secret FORJA_GH_TOKEN (GitHub). Despliegue con config externa:
 *
 *   cd scripts && npx wrangler@latest deploy --config one-forja.wrangler.toml
 */
import { handleForjaHttp, setForjaEnv, type ForjaEnv } from "./core";

export default {
  async fetch(req: Request, env: ForjaEnv, _ctx: unknown): Promise<Response> {
    setForjaEnv(env);
    return handleForjaHttp(req);
  },
};
