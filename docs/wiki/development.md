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
npm run test:e2e:firefox-webkit  # full Firefox + WebKit suite (CI report-only)
npm run test:e2e:cross      # Firefox + WebKit + iPad WebKit
npm run test:e2e:mobile     # phone + tablet touch smoke (report-only)
npm run test:visual          # opt-in 2D screenshot suite (separate config)
npm run test:visual:update   # refresh separate-config baselines
npm run test:e2e:visual         # start + openings baselines (desktop + phone)
npm run test:e2e:visual:update  # rewrite committed PNG baselines
npm run build
npm run lint
npm run format:check
```

Cross-browser notes: [`docs/cross-browser-2026-10-07.md`](../cross-browser-2026-10-07.md).
Mobile touch notes: [`docs/mobile-2026-10-07.md`](../mobile-2026-10-07.md).

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

- **CI** (`ci.yml`) — lint, Prettier `format:check`, TypeScript check, `npm audit --audit-level=high`, build (JS chunk budget 250 kB), unit, Chromium e2e; report-only `mobile-touch`, `e2e-cross-browser` (Firefox + WebKit), and `visual-baseline` (`continue-on-error`)
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
- Architecture map: [Architecture](./architecture.md) · registry: [Game registry](./game-registry.md) · new modules: [How to add a game](./adding-a-game.md)

## Testing layers

Stack of checks builders should know. Required CI paths stay green on Chromium unit + e2e; several layers are opt-in or report-only.

| Layer | Runner | What it covers | Command / entry |
| ----- | ------ | -------------- | --------------- |
| Unit | Vitest + jsdom | Pure rules/state, shell helpers | `npm run test:unit` |
| E2E smoke / play | Playwright Chromium (+ mobile projects on tip) | Menu, game mounts, playability | `npm run test:e2e:chromium` |
| Cross-browser | Playwright Firefox / WebKit / iPad | Opt-in shell smoke | `npm run test:e2e:cross` — [`docs/cross-browser-2026-10-07.md`](../cross-browser-2026-10-07.md) |
| **Axe a11y sweep** | `@axe-core/playwright` | Menu, progress, Help, every available New Game modal — serious/critical only | On tip: `tests/e2e/a11y-sweep.spec.ts`. Run: `npm run test:e2e -- --project=chromium tests/e2e/a11y-sweep.spec.ts` — [`docs/a11y-sweep-2026-10-07.md`](../a11y-sweep-2026-10-07.md) |
| **Visual baseline** | Playwright screenshots | Landing + each available game 2D start/board (seeded, motion off) | On tip: `npm run test:visual` / `test:visual:update` (`tests/visual/`) — [`docs/visual-regression.md`](../visual-regression.md). Related fold may also add report-only `test:e2e:visual` + CI job. |
| **Round-trip fuzz** | Vitest property tests | Random legal play → serialize/deserialize → equal state, legal moves, seeded AI | Suite documented in [`docs/state-roundtrip-2026-10-07.md`](../state-roundtrip-2026-10-07.md) (PR `#465`); harness `tests/unit/state-roundtrip-fuzz.test.ts` lands via related folds. |
| **Undo / move-log audit** | Vitest property tests | Undo stacks / history-complete replay vs applied moves | Suite documented in [`docs/undo-audit-2026-10-07.md`](../undo-audit-2026-10-07.md) (PR `#473`); harness `tests/unit/undo-audit-*.test.ts` lands via related folds. |

### Axe (shell)

Automated sweep over shared chrome only; board interiors stay with per-game playtests. Findings and shell fixes are recorded in the a11y sweep doc. Public posture: [Accessibility](./accessibility.md).

### Visual baseline

Deterministic Chromium captures with Mulberry32 seed, reduced motion, owl hidden, `board3d=0`. **Not** a required CI gate on this tip (`npm run test:visual` is opt-in). Related fold work may add a report-only `visual-baseline` CI job and `test:e2e:visual` scripts — prefer the scripts present in `package.json` on your branch.

### Round-trip fuzz

Plays capped random legal moves for every registered game, then checks:

1. Dedicated Kings codec **or** Map/Set-aware JSON revive (mid-game save stand-in)
2. `structuredClone` spot-check
3. Identical legal-move sets and seeded AI choice

On-device storage today persists stats/profile, not in-progress boards — see the findings doc.

### Undo / move-log audit

Property coverage for surfaces with undo or a move log. Most games have **no** player-facing undo UI; tests treat undo/redo as deterministic reapply of the recorded action prefix/suffix. Ambiguities (unlogged passes, truncated hex-a-gone selections, etc.) stay in the audit doc.

Live captures used in the wiki (local Vite):

![Landing menu under test](./images/landing.png)

![Shared shell + Hex board](./images/hex-board.png)

## Escalations

Do not self-serve production promotions (`alpha` → `main`), scoring/schema changes, or student-facing records changes without human review (`AGENTS.md`).
