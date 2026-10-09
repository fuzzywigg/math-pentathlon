# Mutation audit — UI / shell wave 3 (q-mp-112)

Tests-only mutation measurement continuing wave 1 (**#579** /
`docs/dev/mutation-audit-ui.md`) and wave 2 (**#584** /
`docs/dev/mutation-audit-ui-2.md`). This wave covers the next non-engine /
non-AI modules with surviving mutants **outside** wave 2’s pinned remainder
(prefetch / idle-warm / board-a11y / hex coordinates / contiguous).

## Scope

**In (this wave):**
`src/core/route-generation.ts`,
`src/pwa/bootstrap.ts`,
`src/pwa/bootstrap-owl.ts`,
`src/ui/stats-dashboard.ts`.

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
Wave 1 modules (router, flags, storage, offline, PWA register, coord-map,
timeout-handle, dom-security, game-error-boundary, …) and wave 2 modules
(hex-svg, die-faces, seat-labels, game-prefetch, pointer-hygiene, board-a11y,
idle-warm, dice-selector, hex/coordinates, contiguous) are not repeated.
Wave 2 remaining survivors stay pinned skips.

**Overlap avoided:** open draft **#637** (home error boundary) and **#635**
(soft-fail `#app` boot) touch `src/main.ts` / error-path suites — we did **not**
retarget `game-error-boundary`. **#632** covers `inject-styles` characterization
(0 AST mutants anyway). **#648** is UI coverage round 6 (different suites).

## Harness

1. **Stryker probe:** same failure mode as waves 1–2 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-3/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-3/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module.

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-3/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-3/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-3-baseline.json

# After (with tests/unit/mutation-ui3-*.test.ts)
node node_modules/.cache/mutation-ui-3/mutation-report-ui.mjs \
  --modules=src/core/route-generation.ts,src/pwa/bootstrap.ts,src/pwa/bootstrap-owl.ts,src/ui/stats-dashboard.ts \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-3-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline rank (candidate pool)

| Module | Score % | Notes |
|--------|--------:|-------|
| `ui/game-loading.ts` | n/a | 0 AST mutants (DOM/string only) |
| `ui/inject-styles.ts` | n/a | 0 AST mutants |
| `core/seats.ts` | 100.0 | already saturated |
| `core/security-headers.ts` | 100.0 | already saturated |
| `core/route-generation.ts` | **50.0** | selected |
| `pwa/bootstrap.ts` | **0.0** | selected (existing suites did not hit this file) |
| `pwa/bootstrap-owl.ts` | **60.0** | selected |
| `ui/stats-dashboard.ts` | **50.0** | selected |
| `ui/game-selector.ts` | 35.0 | deferred (larger; enough modules already) |
| `core/dice/roller.ts` | 0.0* | *wrong test glob match — deferred |
| `core/dice/dice-ui.ts` | 65.0 | deferred |
| `core/alignment/compat.ts` | 25.0 | deferred |
| `core/hex/hex-ui.ts` | 90.0 | skip (high) |
| `core/polyomino/placement.ts` | 0.0* | *broad unrelated globs — deferred |

## Before → after (score %)

| Module | Before % | After % | Δ pp | Killed after |
|--------|--------:|--------:|-----:|-------------:|
| `core/route-generation.ts` | 50.0 | **100.0** | +50.0 | 4/4 |
| `pwa/bootstrap.ts` | 0.0 | **80.0** | +80.0 | 4/5 |
| `pwa/bootstrap-owl.ts` | 60.0 | **80.0** | +20.0 | 4/5 |
| `ui/stats-dashboard.ts` | 50.0 | **75.0** | +25.0 | 15/20 |

**4 modules** with measurably higher scores (acceptance: ≥2).

JSON artifacts: `docs/dev/mutation-audit-ui-3-baseline.json`,
`docs/dev/mutation-audit-ui-3-after.json`.

## Remaining survivors (not product bugs)

| Module | Survivor | Reason |
|--------|----------|--------|
| `bootstrap` / `bootstrap-owl` | `window && document` → `\|\|` in default `enabled` | Under jsdom both globals exist; `\|\|` stays true. Requires one global missing. |
| `stats-dashboard` | `ms <= 0` → `<`; numeric `0 → 1` on that guard | Non-positive and tiny positive ms both floor to `0 min`. |
| `stats-dashboard` | hours divisor `60 → 59` | Near-equivalent for the exercised hour/minute pairs. |
| `stats-dashboard` | `rate <= 0` → `<` | `rate === 0` still formats as `0%` via the round path. |
| `stats-dashboard` | sort `b.lastPlayed - a.lastPlayed` → `+` | Ascending vs descending order not asserted by current suites (pinned skip). |

No production defects confirmed.

## New tests

All new files (did **not** edit wave 1 / wave 2 suites):

- `tests/unit/mutation-ui3-route-generation.test.ts`
- `tests/unit/mutation-ui3-bootstrap.test.ts`
- `tests/unit/mutation-ui3-bootstrap-owl.test.ts`
- `tests/unit/mutation-ui3-stats-dashboard.test.ts`

Rules: no player-facing game/tutorial copy assertions; no AI move/timing
assertions; hard-coded numeric expectations (generation `0`/`1`, minute
threshold `60`, win-rate `0%` / `50%`) so const ±1 mutants are detectable.

## Overlap

- **#579 / #584** — UI mutation waves 1–2; modules listed there excluded.
- **#637 / #635** — error-boundary / boot soft-fail; avoided.
- **#632 / #648** — inject-styles / UI coverage r6; different files.
