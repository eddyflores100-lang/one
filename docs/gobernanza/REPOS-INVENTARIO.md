# Inventario de repositorios · eddyflores100-lang (AliceLabs LLC)

> Levantado el 7 de noviembre de 2026 por ONE-FORJA. **149 repositorios:
> 70 propios + 79 forks.** Los 70 propios están clonados e instalados en el
> sandbox del agente (`/home/z/my-project/repos/`, clones parciales
> `--filter=blob:none` — árbol completo, blobs a demanda), más `duo`
> (ya en `download/duo/`). ONE puede leer, compilar y trabajar sobre todos
> sin volver a descargar nada.

## Núcleo de la flota (los que producen ahora)

| Repo | Qué es | Importancia |
| --- | --- | --- |
| `one` (este workspace) | Agente operativo: informe 07:00, MCP de cobros XMR, trueque | **El producto** — mcp/ congelado (e953251) |
| `marketnow` | Infraestructura de confianza para agentes IA: 71.198 skills MCP indexados, API MCP gratuita (10 tools) en marketnow.site | Mayor repo (279 MB) — escaparate técnico |
| `alethech` | Protocolo de continuidad verificable para agentes (memoria Ed25519, DAG hash-linked) | Tecnología propia flagship |
| `equastore-v2` | Dropshipping multi-país (Dropi EC/CO/MX/CL/PE) con dLocal, COD y checkout IA | **Dropi — SOLO canales privados (TX7-b)** |
| `duo` | Separación voz/música con Demucs + dueto sobre instrumental, 100% local | Producto terminado — pendiente subir a Gumroad |

## Los 70 repos propios

| Repo | Descripción | Lenguaje | Último push |
| --- | --- | --- | --- |
| [agent-bridge-relay](https://github.com/eddyflores100-lang/agent-bridge-relay) | Shim público de bootstrap del Agent Bridge: remote.json + patch.js (sin secretos). El relay real vive en alice | JavaScript | 2026-11-07 |
| [agent-world-map](https://github.com/eddyflores100-lang/agent-world-map) | Holographic 3D globe of every agent in the MCP Registry — points on Earth sphere, geographic origin inferred f | JavaScript | 2026-10-29 |
| [alethech](https://github.com/eddyflores100-lang/alethech) | Verifiable agent continuity protocol — Ed25519-signed memory, hash-linked DAG, key rotation with reachability | HTML | 2026-10-18 |
| [alethech-agent-vault](https://github.com/eddyflores100-lang/alethech-agent-vault) | Verifiable Agent Execution on Vultr — submitted to Vultr Agent Rush Hackathon (Nov 3-8, 2026). Every agent act | Python | 2026-10-24 |
| [alethech-tools](https://github.com/eddyflores100-lang/alethech-tools) | CLI tools for working with .aleth encrypted memory files — inspect, verify, search without Python | JavaScript | 2026-10-06 |
| [alicelabs-energy](https://github.com/eddyflores100-lang/alicelabs-energy) | AliceLabs Energy landing page - commercial energy auction platform | HTML | 2026-10-17 |
| [alicelabs-ops](https://github.com/eddyflores100-lang/alicelabs-ops) | Alice Labs operations: public run reports and evidence | — | 2026-10-23 |
| [alicelabs-shopify-apps](https://github.com/eddyflores100-lang/alicelabs-shopify-apps) | 4 Shopify apps: StoreGenie AI (ChatGPT for Shopify), TrustBoost AI (review replies), RecoveryMail AI (cart rec | Liquid | 2026-10-09 |
| [alicelabs-shopify-toolkit](https://github.com/eddyflores100-lang/alicelabs-shopify-toolkit) | Free Shopify merchant toolkit: 6 tools (calculators + AI). No install required. | JavaScript | 2026-10-07 |
| [alicelabs-space](https://github.com/eddyflores100-lang/alicelabs-space) | SENTINEL ARENA - el juego de AliceLabs (alicelabs.space). Verifica skills Ed25519, esquiva scams, gana USDC x4 | JavaScript | 2026-10-26 |
| [alicelabs-voxtutor](https://github.com/eddyflores100-lang/alicelabs-voxtutor) | VoxTutor - tutor personal de ingles por voz con memoria persistente. By AliceLabs | TypeScript | 2026-09-08 |
| [AliceLabsPage](https://github.com/eddyflores100-lang/AliceLabsPage) | AliceLabs LLC website — Figma design, bilingual EN/ES, legal pages, agent resources | HTML | 2026-11-06 |
| [alicemail](https://github.com/eddyflores100-lang/alicemail) | ALICE — ecosistema autónomo de cold email: warmup, CRM de leads (calientes/fríos/rechazados), agentes IA, MCP | TypeScript | 2026-10-26 |
| [angry-cactus-alicelabs](https://github.com/eddyflores100-lang/angry-cactus-alicelabs) | Angry Cactus 2026 - AliceLabs (Firebase Hosting) | TypeScript | 2026-10-08 |
| [atc-spec](https://github.com/eddyflores100-lang/atc-spec) | ⚠️ MOVED to alicelabs-llc/universal-trust-adapter. This repo is archived (read-only). | Shell | 2026-08-25 |
| [atc-verifier](https://github.com/eddyflores100-lang/atc-verifier) | ⚠️ MOVED to alicelabs-llc/universal-trust-adapter. This repo is archived (read-only). | — | 2026-08-25 |
| [bernaudio](https://github.com/eddyflores100-lang/bernaudio) | Medición y alineación de audio profesional en tiempo real — RTA, espectrograma, función de transferencia, IR y | JavaScript | 2026-10-23 |
| [boveda](https://github.com/eddyflores100-lang/boveda) | BÓVEDA — memoria de IA cifrada en navegador (PBKDF2+AES-GCM, cero-conocimiento) | TypeScript | 2026-09-03 |
| [context-pruner-mcp](https://github.com/eddyflores100-lang/context-pruner-mcp) | Context Pruner MCP - Save 50-80% on AI agent token costs by intercepting and compressing tool outputs before t | Python | 2026-10-23 |
| [dataset-joins](https://github.com/eddyflores100-lang/dataset-joins) | Cross-dataset join artifacts (hash-level) from MarketNow reconciliation work. First: MarketNow x Fetchgate MCP | — | 2026-10-03 |
| [Dropes](https://github.com/eddyflores100-lang/Dropes) | Dropes Tienda Online - Ecommerce Dropea (España y Portugal) con Firebase Hosting | TypeScript | 2026-09-16 |
| [dropes-v2](https://github.com/eddyflores100-lang/dropes-v2) | Dropes ecommerce - React 19 + Vite 6 + Tailwind 4. Dropshipping ES/PT | HTML | 2026-10-08 |
| [duo](https://github.com/eddyflores100-lang/duo) | Dúo — separa voz y música con Demucs, mezcla tu voz sobre la pista instrumental y exporta pantalla dividida. 1 | Python | 2026-11-05 |
| [eddyflores100-lang](https://github.com/eddyflores100-lang/eddyflores100-lang) | AliceLabs LLC — trust infrastructure for AI agents | — | 2026-10-23 |
| [emma-care-studio](https://github.com/eddyflores100-lang/emma-care-studio) | Emma Care Studio - juego de mascotas virtuales hecho por y para ninos: crea tu mundo, persigue, esconde, cuida | TypeScript | 2026-10-02 |
| [equastore-v2](https://github.com/eddyflores100-lang/equastore-v2) | Equastore v2 — multi-country dropshipping (Dropi EC/CO/MX/CL/PE) with dLocal payments, COD, and AI-powered che | TypeScript | 2026-11-07 |
| [gh-commander](https://github.com/eddyflores100-lang/gh-commander) | Cosecha autonoma de ofertas Lever/Ashby del agente gh_commander (AliceLabs) - GitHub Action diaria 08:00 Ecuad | Python | 2026-11-04 |
| [ghostguard](https://github.com/eddyflores100-lang/ghostguard) | — | Python | 2026-11-04 |
| [hotelmaldito](https://github.com/eddyflores100-lang/hotelmaldito) | Juegos únicos para niños en Roblox | TypeScript | 2026-09-07 |
| [informe-forense-cron-475808](https://github.com/eddyflores100-lang/informe-forense-cron-475808) | Auditoria forense: tarea programada 475808 creada por iniciativa del agente sin orden del usuario (OpenSAM, 26 | Python | 2026-11-02 |
| [landings-completas](https://github.com/eddyflores100-lang/landings-completas) | Suite de 7 Landing Pages completas (consulting, digital agency, education, health, real estate, saas, tech sta | HTML | 2026-10-08 |
| [lottery-predictor](https://github.com/eddyflores100-lang/lottery-predictor) | LotteryPredictor v4.0 — 49 loterías globales, 10 motores, Kelly Criterion, EV Calculator, MCP Server | HTML | 2026-09-27 |
| [lottery-predictor-web](https://github.com/eddyflores100-lang/lottery-predictor-web) | LotteryPredictor v4.0 — Landing Page | HTML | 2026-09-26 |
| [mailhand-aws-cds](https://github.com/eddyflores100-lang/mailhand-aws-cds) | Agentic email code review via AWS SES + Bedrock AgentCore. Submission for AWS CDS Agentic AI Partner Hackathon | Python | 2026-10-24 |
| [marketnow](https://github.com/eddyflores100-lang/marketnow) | MarketNow — security infrastructure for AI agents: 71,198 MCP skills indexed, Sentinel-scanned, evidence-based | JavaScript | 2026-11-07 |
| [marketnow-cursor-plugin](https://github.com/eddyflores100-lang/marketnow-cursor-plugin) | MarketNow — free trust layer for AI agents on MCP, as a Cursor plugin (ATC/1.0 verification, domain scam-check | — | 2026-09-21 |
| [marketnow-mcp](https://github.com/eddyflores100-lang/marketnow-mcp) | Free trust layer for AI agents using MCP: verify credentials (8 formats), scam-check domains, fingerprint tool | — | 2026-10-12 |
| [mcp-suite](https://github.com/eddyflores100-lang/mcp-suite) | 229 servidores MCP para dolores de agentes IA + integración MarketNow.site — 1035 tools, 349 pruebas funcional | TypeScript | 2026-10-11 |
| [memex-landing](https://github.com/eddyflores100-lang/memex-landing) | Memex landing page — memex.alicelabs.site | HTML | 2026-09-22 |
| [memex-legacy](https://github.com/eddyflores100-lang/memex-legacy) | Legacy Memex codebase (167 commits, AliceLabs Proprietary). Preserved for historical reference. Active develop | Python | 2026-11-02 |
| [mermail](https://github.com/eddyflores100-lang/mermail) | Mermail Agent Skill Demo | — | 2026-09-07 |
| [mermail-escrow-agent](https://github.com/eddyflores100-lang/mermail-escrow-agent) | Peer-to-peer deal escrow coordinated entirely over a Mermail email thread. Hold buyer funds in Agent Wallet, r | Python | 2026-09-08 |
| [NexusCold](https://github.com/eddyflores100-lang/NexusCold) | ==> Migrado a alicelabs-llc/NexusCold. Este repo queda como respaldo histórico. | Python | 2026-08-31 |
| [novaemu](https://github.com/eddyflores100-lang/novaemu) | Emulador unificado CHIP-8/S-CHIP/Game Boy en C99 puro — 0 dependencias, 38 KB, CPU SM83 certificada 11/11 cont | C | 2026-11-03 |
| [one](https://github.com/eddyflores100-lang/one) | ONE — agente operativo que cobra en Monero: informe 07:00 EC, 7 herramientas MCP (pagos XMR + trueque de compu | HTML | 2026-11-07 |
| [open-gravity-ui](https://github.com/eddyflores100-lang/open-gravity-ui) | OpenGravity UI - Frontend Next.js and Firebase project for OpenGravity | TypeScript | 2026-09-16 |
| [OpenGravity](https://github.com/eddyflores100-lang/OpenGravity) | Oracle de investigación algorítmica de empresas — triangulación de fuentes, RQI auditable, cero atribución sin | JavaScript | 2026-09-06 |
| [OpenSAM](https://github.com/eddyflores100-lang/OpenSAM) | Open-source autonomous agent for SAM.gov federal contracting | TypeScript | 2026-10-27 |
| [Orbita](https://github.com/eddyflores100-lang/Orbita) | Creación de Tours 3D Interactivos | TypeScript | 2026-09-03 |
| [orbita-boveda](https://github.com/eddyflores100-lang/orbita-boveda) | ÓRBITA + BÓVEDA — Property Content Engine y memoria IA cifrada (Next.js + Prisma + Tailwind) | TypeScript | 2026-08-31 |
| [orbita-landing](https://github.com/eddyflores100-lang/orbita-landing) | Órbita — Property Content Engine for US Hispanic real estate. AI video + 3D tours + bilingual microsites + MCP | TypeScript | 2026-10-08 |
| [PolySnap](https://github.com/eddyflores100-lang/PolySnap) | Polymarket Data Analysis | — | 2026-09-08 |
| [Prism-IDE](https://github.com/eddyflores100-lang/Prism-IDE) | Prism — your machine, every AI, one cockpit. Web IDE prototype with an MCP hub, multi-provider AI cockpit and | HTML | 2026-10-27 |
| [proyectos-completos](https://github.com/eddyflores100-lang/proyectos-completos) | Sistema completo de dashboards, landing pages y scraping B2B AliceLabs | HTML | 2026-10-08 |
| [proyectos-web](https://github.com/eddyflores100-lang/proyectos-web) | Proyectos Web - Landings SaaS y Ecommerce | HTML | 2026-10-08 |
| [recall-mcp](https://github.com/eddyflores100-lang/recall-mcp) | 🧠 Recall MCP — Long-term memory for AI agents. Cross-session, zero-dep, MCP-native. SQLite + FTS5. | Python | 2026-10-23 |
| [sg-turismo](https://github.com/eddyflores100-lang/sg-turismo) | SG-Turismo · Turismo en bus por Ecuador | Rutas, Flota y Destinos | HTML | 2026-10-09 |
| [sloth](https://github.com/eddyflores100-lang/sloth) | SLOTH — Sleepy Lazy Overnight Task Handler. An overnight chore agent with a 1B open-weight brain (Gemma 3 + ll | JavaScript | 2026-10-23 |
| [slothpay](https://github.com/eddyflores100-lang/slothpay) | SlothPay - the sloth that pays for you. Local, open-source AI gatekeeper for x402 agent payments with ATC/1.0 | Python | 2026-10-20 |
| [taiko-phish-agent-overreach-case-study](https://github.com/eddyflores100-lang/taiko-phish-agent-overreach-case-study) | — | — | 2026-10-06 |
| [taikotalent-phishing-iocs](https://github.com/eddyflores100-lang/taikotalent-phishing-iocs) | IoCs, attack chain & detection for the taikotalent.xyz fake-Taiko-recruiter campaign delivering a self-deletin | YARA | 2026-10-15 |
| [touch-grass](https://github.com/eddyflores100-lang/touch-grass) | Verified field notes from your hike — open-source AI + cryptographic sealing (Hacktoberfest 2026) | Python | 2026-10-09 |
| [transporte-2026-oriente](https://github.com/eddyflores100-lang/transporte-2026-oriente) | App de transporte para el oriente ecuatoriano - Firebase Hosting | TypeScript | 2026-09-16 |
| [typemeter](https://github.com/eddyflores100-lang/typemeter) | Compiler-level TypeScript type cost: load-time, complexity and attribution — VS Code plugin | TypeScript | 2026-10-08 |
| [universal-trust-adapter](https://github.com/eddyflores100-lang/universal-trust-adapter) | Mirror of alicelabs-llc/universal-trust-adapter (canonical, npm-linked) · production: marketnow.site | Python | 2026-10-14 |
| [uta-shield](https://github.com/eddyflores100-lang/uta-shield) | UTA Shield — provider-side firewall for MCP servers + PhishGuard threat-intel. Zero dependencies. https://wall | JavaScript | 2026-10-27 |
| [utalabs.tech](https://github.com/eddyflores100-lang/utalabs.tech) | utalabs.tech — UTA by AliceLabs: fail-closed spend authorization for AI agents. Landing hub. | HTML | 2026-10-23 |
| [vigia-ml](https://github.com/eddyflores100-lang/vigia-ml) | ==> Migrado a alicelabs-llc/vigia-ml. Este repo queda como respaldo histórico. | TypeScript | 2026-11-03 |
| [vrfkyc](https://github.com/eddyflores100-lang/vrfkyc) | Global AML, sanctions, PEP and adverse media screening API with MCP integration. By AliceLabs LLC. | HTML | 2026-10-24 |
| [vrfkyc-landing](https://github.com/eddyflores100-lang/vrfkyc-landing) | VRFKYC landing page | HTML | 2026-10-09 |

## Notas de la flota

1. **Forks (79)**: no se instalan por defecto — son material de lectura y
   PRs (awesome lists, SDKs, protocolos). Lista completa en
   `data/repos_mapa.json` del sandbox.
2. **Ciclo de autonomía**: cada sesión, ONE puede leer cualquier repo desde
   `/home/z/my-project/repos/` sin red. Para actualizar: re-ejecutar
   `scripts/forja_instalar_repos.sh`.
3. **Dropi (equastore-v2, dropes-v2, Dropes)**: por la regla TX7-b, el
   trabajo sobre esos repos NO se publica ni se menciona en canales
   públicos; solo va al email diario privado del fundador.
