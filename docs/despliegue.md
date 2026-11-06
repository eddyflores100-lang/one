# Despliegue — ONE

> Tres piezas desplegables y una carpeta de trabajo. Todo reproducible
> con comandos cortos.

## Mapa de despliegue

| Pieza | Dónde queda | Comando |
| --- | --- | --- |
| Página | GitHub Pages (`eddyflores100-lang.github.io/one/`) | `bash scripts/one_gh_deploy.sh` (en la máquina del operador) |
| MCP edge | Cloudflare Worker `one-mcp` | `cd mcp && CLOUDFLARE_API_TOKEN=<token> npx wrangler deploy` |
| Cerebro remoto | Cloudflare Worker `one-cerebro` | `cd cerebro && CLOUDFLARE_API_TOKEN=<token> npx wrangler deploy` |

## 1. Página (GitHub Pages)

El flujo del operador (máquina local, no CI):

```bash
python3 scripts/one_bundle_standalone.py   # regenera one-standalone.html
bash scripts/one_gh_deploy.sh              # clona, copia, commitea, fuerza push
```

El script de despliegue copia: `index.html`, `one-standalone.html`,
`PROJECT.md`, `LICENSE`, `CHANGELOG.md`, `SECURITY.md`, `robots.txt`,
`sitemap.xml`, `assets/`, `mcp/`, `cerebro/`, `agent/`, `docs/` y `.github/`.

Tras cada push, dos verificaciones obligatorias:

```bash
# 1) el MCP sigue intacto (regla del fundador)
git diff e953251 HEAD -- mcp/ | wc -l     # → 0

# 2) la página levanta sin errores JS (abrir con ?nocache=1)
```

## 2. Cerebro remoto (Workers AI)

```bash
cd cerebro
CLOUDFLARE_API_TOKEN=<token> npx wrangler deploy
# → https://one-cerebro.<subdominio>.workers.dev
```

Luego pega esa URL en `CEREBRO_URL` (línea 16 de `assets/app.js`) y
redespliega la página. Verificación:

```bash
curl -s https://one-cerebro.eddyflores100.workers.dev/          # estado JSON
curl -s -X POST https://one-cerebro.eddyflores100.workers.dev/api/chat \
  -H 'Content-Type: application/json' -H 'Origin: https://eddyflores100-lang.github.io' \
  -d '{"mensaje":"¿dónde estás?"}'
```

## 3. MCP (streamable HTTP en el edge)

```bash
cd mcp
CLOUDFLARE_API_TOKEN=<token> npx wrangler deploy
# → https://one-mcp.<subdominio>.workers.dev
```

Instalación en un cliente:

```bash
claude mcp add --transport http one https://one-mcp.eddyflores100.workers.dev/api/mcp
# o stdio local, cero dependencias:
bun mcp/server.ts
```

## Dominio propio (pendiente del fundador)

La zona `alicelabs.space` está activa en Cloudflare. Rutas previstas en
los `wrangler.toml` (descomentar cuando se decida):

- `mcp.alicelabs.space` → Worker `one-mcp`
- `cerebro.alicelabs.space` → Worker `one-cerebro`

Mientras tanto los endpoints oficiales son los `workers.dev` de arriba.

## Checklist post-despliegue

- [ ] `GET /` del cerebro responde JSON de estado.
- [ ] `POST /api/chat` responde con contenido de ONE (no genérico).
- [ ] CORS: preflight `OPTIONS` devuelve el origen de GitHub Pages.
- [ ] El canal de la página responde una pregunta de precio con números.
- [ ] `mcp/` sin diff (regla del fundador).
- [ ] Reloj de Guayaquil vivo en el pie de la página.
