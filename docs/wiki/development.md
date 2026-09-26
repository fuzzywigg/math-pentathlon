# Development

Public builder notes. Full agent/product guardrails: [`AGENTS.md`](../../AGENTS.md). Deeper coding patterns: [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md).

## Stack

- TypeScript + Vite
- Vitest (unit) + Playwright (e2e)
- Cloudflare Pages deploy from `alpha` (see `.github/workflows/deploy.yml`)

## Commands

```bash
npm install
npm run dev
npm test             # unit then e2e
npm run test:unit
npm run test:e2e
npm run build
npm run lint
npm run format:check
```

## Branches

| Branch  | Role                          |
| ------- | ----------------------------- |
| `alpha` | Trunk. Target PRs here.       |
| `main`  | Not the default for new work. |

## CI posture (public)

Workflows under `.github/workflows/`:

- **CI** (`ci.yml`) — lint, Prettier `format:check`, TypeScript check, `npm audit --audit-level=high`, build (JS chunk budget 250 kB), unit, Chromium e2e
- **Deploy** (`deploy.yml`) — build and publish to Cloudflare Pages on `alpha` pushes (trunk; not `main`)

### Unit job runtime (TOKENMAXX)

The Vitest unit suite under `tests/unit` is large (~5k files after TOKENMAXX). Healthy GitHub Actions runs take about **25–35 minutes** (p90 ≈ **30 min**) with little Vitest stdout after `npm ci`, which can look hung.

- Job `timeout-minutes: 45` and step `timeout-minutes: 40` so overrun fails loudly instead of burning the runner
- CI prints file count up front and emits heartbeat notices every 5 minutes while the suite runs
- Do not “speed up” CI by skipping or sharding unit files unless a human owns that change

README badges link those workflows. License is **ISC** (`package.json`).

## Layout conventions

- Domain logic: `src/core`, `src/games/*/game-state.ts`, `src/games/*/rules.ts` (no DOM)
- UI wiring: `src/games/*/board-ui.ts`, `src/games/*/game-controller.ts`, `src/ui`
- Tests: `tests/unit` (Vitest + jsdom), `tests/e2e` (Playwright)

## Escalations

Do not self-serve production promotions (`alpha` → `main`), scoring/schema changes, or student-facing records changes without human review (`AGENTS.md`).
