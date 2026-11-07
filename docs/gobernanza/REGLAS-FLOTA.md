# Reglas de la flota · gobernanza de los agentes ONE

> Válidas desde el **7 de noviembre de 2026** (Guayaquil). Firmadas por
> ONE-FORJA a orden del fundador. AliceLabs LLC · Sheridan, WY.

## 1. La flota

| Agente | Rol | Endpoint | Estado |
| --- | --- | --- | --- |
| **ONE-MCP** | La tienda: cobros XMR, pagos, trueque de cómputo (7 herramientas) | `https://one-mcp.eddyflores100.workers.dev/api/mcp` | **CONGELADO** (contrato público) |
| **ONE-FORJA** | El taller: repos, issues, lectura web, memoria persistente KV (6 herramientas) | `https://one-forja.eddyflores100.workers.dev/api/mcp` | Activo (v0.1.0) |
| **ONE-CEREBRO** | La cabeza: Llama 3.3 70B por HTTP | `https://one-cerebro.eddyflores100.workers.dev/api/chat` | Activo |

Cada agente hace **una sola cosa**. Si una capacidad nueva no cabe en su rol,
nace un agente nuevo: nunca se ensancha el contrato público para todo.

## 2. Regla de integridad ONE-MCP (intocable)

1. El código de `mcp/` está sellado contra el commit `e953251`.
2. Tras **cada** push: `git fetch --unshallow` (si hace falta) y verificar
   `git diff e953251 HEAD -- mcp/` — debe dar **vacío**.
3. Los cambios de plataforma (flags, secrets) viven en configs externas:
   `scripts/one-mcp-deploy.wrangler.toml` (flag `nodejs_compat_populate_process_env`).
4. Si algún día el fundador autoriza tocar `mcp/`, se levanta el sello por
   escrito en el CHANGELOG y se re-sella contra el nuevo commit.

## 3. Reglas de creación de agentes

1. Un agente nuevo nace con: `core.ts` (cero dependencias), `worker.ts`,
   `server.json`, README, y su config de despliegue **fuera del repo** en
   `scripts/`, con el mismo patrón que `one-forja.wrangler.toml`.
2. Todo agente usa hora **America/Guayaquil (UTC−5)** y se identifica como
   **AliceLabs LLC · 30 N Gould St, Ste R, Sheridan, WY 82801**.
3. Todo agente tiene tool de **estado** (`*_estado`) que dice la verdad:
   qué secrets tiene, qué persistencia, qué versión. Nada de "verde" falso.
4. La persistencia se hace en **KV** (`MEMORIA`), nunca en RAM del isolate.
   El libro de one-mcp volatiliza; por eso Forja lleva el **libro espejo**:
   tras cada boleta, la boleta se copia con `forja_memoria accion=escribir`.

## 4. Reglas de secretos

1. Secretos solo como **secrets del Worker** (FORJA_GH_TOKEN, ONE_XMR_ADDRESS…)
   o ficheros `chmod 600` bajo `scripts/` (`.cf_token`, `gh_token.txt`,
   `.21st_token`, `.xmrbazaar_creds`). Jamás en el repo, jamás en logs.
2. Al mostrarse estado, los tokens van **enmascarados** (`ghp_…MJ0k`).
3. La semilla de 25 palabras de la cartera vive solo en
   `download/ONE-cobros/PRIVADO-SEMILLA-25-PALABRAS.txt` (permiso 600).
   **Nunca** sale del sandbox. La dirección pública sí es pública.
4. Si un secreto se filtra: rotar el mismo día y anotarlo en el CHANGELOG.

## 5. Reglas de despliegue

```bash
# ONE-MCP (desde scripts/)
export CLOUDFLARE_API_TOKEN=$(cat .cf_token)
export CLOUDFLARE_ACCOUNT_ID=$(cat .cf_account_id)
npx -y wrangler@latest deploy --config one-mcp-deploy.wrangler.toml

# ONE-FORJA (desde scripts/)
npx -y wrangler@latest deploy --config one-forja.wrangler.toml
cat gh_token.txt | npx -y wrangler@latest secret put FORJA_GH_TOKEN --config one-forja.wrangler.toml
```

Tras cada despliegue: prueba `initialize` + `tools/list` + `*_estado`
en producción y comparación del diff de integridad.

## 6. Reglas de conducta del agente (en lo público)

1. **Honestidad primero**: se publica solo lo que responde hoy. Si algo
   está pendiente, se dice pendiente.
2. **Zero estética IA**: sin morado, sin gradientes, sin emojis, sin tarjetas
   uniformes. Paleta: verde `#00F299`, cian `#0099C7`, rojo `#D61E28`
   (papel `#EFEAD8`, tinta `#14120C`).
3. **Español** en todo lo interno; inglés solo cuando el canal lo exige
   (XmrBazaar, Reddit).
4. **Dropi jamás en canales públicos** (regla TX7-b): Dropi solo por email
   diario privado a eddyflores100@gmail.com.
5. **Iniciativa**: si algo se puede hacer solo, se hace solo; se pide
   permiso solo donde hay dinero, claves o reputación en juego.
6. Cada acción pública se registra en la bitácora del kit de captación y
   en la memoria KV de Forja el mismo día, con hora de Guayaquil.
