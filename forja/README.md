# ONE-FORJA · el taller de la flota

Agente de operaciones de ONE (AliceLabs LLC). **No toca** el contrato
público de `one-mcp` (congelado): forja trabaja detrás — repos, issues,
lectura de mercado y memoria persistente.

## Herramientas (6)

| Tool | Qué hace |
| --- | --- |
| `forja_estado` | Estado vivo: hora Guayaquil, secrets enmascarados, memoria KV |
| `forja_repos` | Lista/busca los 70 repos propios en GitHub |
| `forja_repo_readme` | Lee el README de cualquier repo propio |
| `forja_issue_crear` | Abre issues en repos propios (auditados en KV) |
| `forja_web_leer` | Lee una página pública a texto plano (recon de mercado) |
| `forja_memoria` | Memoria persistente KV: escribir / leer / listar / borrar |

## Endpoint

```
POST https://one-forja.eddyflores100.workers.dev/api/mcp
```

Streamable HTTP (JSON-RPC 2.0), mismo patrón que `mcp/core.ts`, cero
dependencias externas.

## Despliegue (desde `scripts/`, config externa)

```bash
export CLOUDFLARE_API_TOKEN=$(cat .cf_token)
export CLOUDFLARE_ACCOUNT_ID=$(cat .cf_account_id)
npx -y wrangler@latest deploy --config one-forja.wrangler.toml
cat gh_token.txt | npx -y wrangler@latest secret put FORJA_GH_TOKEN --config one-forja.wrangler.toml
```

Bindings: KV `MEMORIA` (namespace `one-forja-memoria`,
`f5b3da35b2174580b00682a3c6ff0aaf`) + secret `FORJA_GH_TOKEN`.

## Reglas que lo rigen

Ver `docs/gobernanza/REGLAS-FLOTA.md`. Resumen: una sola cosa bien hecha,
secretos nunca en repo, hora Guayaquil siempre, libro espejo de boletas en
KV tras cada cobro de one-mcp.

---
ONE-FORJA · AliceLabs LLC · 30 N Gould St, Ste R, Sheridan, WY 82801
