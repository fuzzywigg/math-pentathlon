# Console sweep — 2026-10-07

Playwright Chromium pass over every available game route (`/#/game/:id`):
load shell → start vs-AI (Easy) → play ~2 human actions → capture
`console` error/warning, `pageerror`, and `unhandledrejection`.

Branch context: work against `cursor/overnight-polish-integration-0494`.
No rules / scoring / engine logic changed.

## Method

- Script: `scripts/console-sweep.mjs` (ad-hoc; not part of CI)
- Base URL: local Vite (`http://127.0.0.1:5173`)
- Follow-up: navigate-away mid-AI for games without prior `destroyGame`
  (`scripts/nav-away-sweep.mjs`) — also clean

## Summary

| Metric | Result |
| --- | --- |
| Games swept | 20 / 20 available |
| Load failures | 0 |
| Console **errors** | 0 |
| Console **warnings** | 0 |
| `pageerror` | 0 |
| Unhandled rejections | 0 |
| React key / `act` warnings | N/A (vanilla TypeScript DOM app) |

## Per-game

| Game id | Load | Play (≈2 moves) | Errors | Warnings | Rejections | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `kings-quadraphages` | ok | ok | 0 | 0 | 0 | — |
| `hex` | ok | ok | 0 | 0 | 0 | Added `destroyGame` (cancel AI worker on leave) |
| `star-track` | ok | ok | 0 | 0 | 0 | — |
| `hex-a-gone` | ok | ok | 0 | 0 | 0 | — |
| `calla` | ok | ok | 0 | 0 | 0 | Added AI generation + `destroyGame` |
| `sum-dominoes` | ok | ok | 0 | 0 | 0 | — |
| `par-55` | ok | ok | 0 | 0 | 0 | — |
| `ramrod` | ok | ok | 0 | 0 | 0 | — |
| `kwatro-sinko` | ok | ok | 0 | 0 | 0 | — |
| `fiar` | ok | ok | 0 | 0 | 0 | — |
| `juggle` | ok | ok | 0 | 0 | 0 | — |
| `contig-60` | ok | ok | 0 | 0 | 0 | — |
| `stars-bars` | ok | ok | 0 | 0 | 0 | — |
| `fab-a-diffy` | ok | ok | 0 | 0 | 0 | Wired `destroyGame` (dispose AI worker) |
| `queens-guards` | ok | ok | 0 | 0 | 0 | — |
| `prime-gold` | ok | ok | 0 | 0 | 0 | — |
| `remainder-islands` | ok | ok | 0 | 0 | 0 | — |
| `pent-em-in` | ok | ok | 0 | 0 | 0 | — |
| `frac-fact` | ok | ok | 0 | 0 | 0 | Added `destroyGame` (clear AI/result timers) |
| `fraction-pinball` | ok | ok | 0 | 0 | 0 | Added `destroyGame` (invalidate AI timeouts) |

## Fixes shipped with this sweep

1. **Per-game error boundary** — every `/game/:id` route installs
   `installGameErrorBoundary` (`src/ui/game-error-boundary.ts`) before the
   chunk mounts. Runtime `error` / `unhandledrejection` replace the shell with
   a friendly **Try again** / **Back to games** reset
   (`data-testid="game-error-boundary"`). Chunk-load failures still use
   `renderGameLoadError`.
2. **Missing cleanup** — Hex / Calla / Fab-a-Diffy / Frac Fact / Fraction Pinball
   now cancel AI work and drop mounts on route leave (and before the crash UI).
3. **E2E keeper** — `tests/e2e/console-clean-on-load.spec.ts` asserts zero
   console errors + pageerrors on load for every available game.

## Artifacts

- `/opt/cursor/artifacts/console-sweep-raw.json`
- `/opt/cursor/artifacts/console-sweep-run.log`
- `/opt/cursor/artifacts/nav-away-sweep.log`
