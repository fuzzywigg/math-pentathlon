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
npm run test:visual          # opt-in 2D screenshot suite (separate config)
npm run test:visual:update   # refresh separate-config baselines
npm run test:e2e:visual         # start + openings baselines (desktop + phone)
npm run test:e2e:visual:update  # rewrite committed PNG baselines
npm run build
npm run lint
npm run format:check
```

Cross-browser notes: [`docs/cross-browser-2026-10-07.md`](../cross-browser-2026-10-07.md).

Opt-in visual regression via separate config (chromium, fixed viewport, seeded, animations off): see [`docs/visual-regression.md`](../visual-regression.md).

## Visual regression baselines

Playwright `toHaveScreenshot` covers the **start screen** and the **opening position** of every available game at two viewports:

| Project | Viewport |
| ------- | -------- |
| `visual-desktop` | 1280×720 Desktop Chrome |
| `visual-phone` | iPhone 12 size (Chromium; WebKit not required) |

Baselines live in-repo under `tests/e2e/visual-baselines/{project}/visual-baseline.spec.ts/`. Stability knobs (no production behavior change):

- Deterministic `Math.random` via Mulberry32 seed `0xC0FFEE` (init script)
- `prefers-reduced-motion: reduce` + CSS animation/transition zeroing
- Local storage: owl off, reduced motion on (avoids idle mascot paint)

### Updating baselines

Run on **Linux** (matches CI / Cloud Agent) so PNG pixels align:

```bash
npm run test:e2e:visual:update
```

Or: `npx playwright test --project=visual-desktop --project=visual-phone --update-snapshots`

Commit the changed PNGs under `tests/e2e/visual-baselines/`. Do not commit `test-results/` or `playwright-report/`.

### CI posture

Job `visual-baseline` in `.github/workflows/ci.yml` is **report-only** (`continue-on-error: true`). Diffs upload as the `visual-baseline-report` artifact but do not fail the workflow until the job is promoted to required.

## Branches

| Branch  | Role                          |
| ------- | ----------------------------- |
| `alpha` | Trunk. Target PRs here.       |
| `main`  | Not the default for new work. |

## CI posture (public)

Workflows under `.github/workflows/`:

- **CI** (`ci.yml`) — lint, Prettier `format:check`, TypeScript check, `npm audit --audit-level=high`, build (JS chunk budget 250 kB), unit, Chromium e2e, visual-baseline (**report-only**); optional `e2e-cross-browser` via workflow_dispatch or `CROSS_BROWSER_E2E`
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
