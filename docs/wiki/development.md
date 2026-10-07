# Development

Public builder notes. Full agent/product guardrails: [`AGENTS.md`](../../AGENTS.md). Deeper coding patterns: [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md).

## Stack

- Node.js **>=20** (`package.json` `engines.node`; CI/deploy pin `node-version: '20'`)
- TypeScript + Vite
- Vitest (unit) + Playwright (e2e)
- Cloudflare Pages deploy from `alpha` (see `.github/workflows/deploy.yml`)

## Commands

```bash
npm install
npm run dev
npm test             # unit then e2e
npm run test:unit
npm run test:e2e:chromium   # required CI path
npm run test:e2e:cross      # opt-in Firefox + WebKit + iPad WebKit
npm run test:visual          # opt-in 2D screenshot suite (not in CI)
npm run test:visual:update   # refresh committed baselines
npm run build
npm run lint
npm run format:check
```

Cross-browser notes: [`docs/cross-browser-2026-10-07.md`](../cross-browser-2026-10-07.md).

Opt-in visual regression (chromium, fixed viewport, seeded, animations off): see [`docs/visual-regression.md`](../visual-regression.md).

## Branches

| Branch  | Role                          |
| ------- | ----------------------------- |
| `alpha` | Trunk. Target PRs here.       |
| `main`  | Not the default for new work. |

## CI posture (public)

Workflows under `.github/workflows/`:

- **CI** (`ci.yml`) — lint, Prettier `format:check`, TypeScript check, `npm audit --audit-level=high`, build (JS chunk budget 250 kB), unit, Chromium e2e; optional `e2e-cross-browser` via workflow_dispatch or `CROSS_BROWSER_E2E`
- **Deploy** (`deploy.yml`) — build and publish to Cloudflare Pages on `alpha` pushes (trunk; not `main`)

### Menu shell / offline load notes

- Games and demos are dynamic-imported; Three.js stays under `dist/vendor/`.
- `vite.shell-chunks.ts` keeps game-only core (dice/fractions/…) and owl off the menu `modulepreload` graph so cheap tablets download less before first paint.
- PWA Workbox still precaches the full build after the first online visit (`src/pwa/register.ts`).
- After first paint, `bootstrapOwl` + `scheduleIdleGameWarm` warm the mascot and a couple of popular game chunks on idle (skipped when Save-Data / hidden).

### Unit job runtime

The Vitest unit suite under `tests/unit` was pruned from ~5k TOKENMAXX-generated files down to roughly 2.7k keepers (handwritten + behavioral TOKENMAXX + FIAR leave-alone). Healthy GitHub Actions unit runs should finish in about **under 5 minutes**.

- Job `timeout-minutes: 10` and step `timeout-minutes: 8` so overrun fails loudly
- CI prints the unit file count up front

README badges link those workflows. License is **ISC** (`package.json`).

## Layout conventions

- Domain logic: `src/core`, `src/games/*/game-state.ts`, `src/games/*/rules.ts` (no DOM)
- UI wiring: `src/games/*/board-ui.ts`, `src/games/*/game-controller.ts`, `src/ui`
- Tests: `tests/unit` (Vitest + jsdom), `tests/e2e` (Playwright)

## Escalations

Do not self-serve production promotions (`alpha` → `main`), scoring/schema changes, or student-facing records changes without human review (`AGENTS.md`).
