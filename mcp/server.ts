#!/usr/bin/env bun
/**
 * ONE — servidor MCP por stdio (cero dependencias).
 *
 * Ejecutar:
 *   bun server.ts            (recomendado)
 *   npx tsx server.ts        (con Node)
 *
 * Conectar en Claude Desktop / Cursor (claude_desktop_config.json):
 *   { "mcpServers": { "one": { "command": "bun", "args": ["/ruta/a/one/mcp/server.ts"] } } }
 *
 * O por HTTP remoto (sin instalar nada):
 *   claude mcp add --transport http one https://<host>/api/mcp
 */
import * as readline from "node:readline";
import { handleRpc } from "./core.ts";

const rl = readline.createInterface({ input: process.stdin, terminal: false });

rl.on("line", async (line: string) => {
  const s = line.trim();
  if (!s) return;
  let msg: any;
  try {
    msg = JSON.parse(s);
  } catch {
    return; // línea no-JSON: ignorar
  }
  const lote = Array.isArray(msg) ? msg : [msg];
  const outs: any[] = [];
  for (const m of lote) {
    const r = await handleRpc(m);
    if (r) outs.push(r);
  }
  if (outs.length) {
    const out = Array.isArray(msg) ? JSON.stringify(outs) : JSON.stringify(outs[0]);
    process.stdout.write(out + "\n");
  }
});

rl.on("close", () => process.exit(0));
