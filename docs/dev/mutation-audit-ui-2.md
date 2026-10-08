# Mutation audit — UI / shell wave 2 (burn-1008-mp-mutation-audit-ui-2)

Tests-only mutation measurement continuing draft **#579**
(`docs/dev/mutation-audit-ui.md`). This wave covers the next non-engine / non-AI
modules with the most surviving mutants. Distinct from the rules-engine audit
(#515 / `docs/mutation-audit-burn-1008.md`).

## Scope

**In (this wave):**
`src/ui/{hex-svg,die-faces,seat-labels,game-prefetch,pointer-hygiene,board-a11y}.ts`,
`src/pwa/idle-warm.ts`,
`src/core/dice/dice-selector.ts`,
`src/core/hex/coordinates.ts`,
`src/core/alignment/contiguous.ts`.

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
Modules already raised in **#579** (router, flags, storage, offline, PWA
register, coord-map, …) are not repeated.

## Harness

1. **Stryker probe (required attempt):**
   ```bash
   npx --yes @stryker-mutator/core@8.7.1 --version   # → 8.7.1
   npx --yes @stryker-mutator/core@8.7.1 run -c /tmp/mutation-ui-2/stryker.config.json --dryRunOnly
   ```
   Failed: npx sandbox cannot resolve workspace `typescript`; also ignored the
   mutate-file filter and instrumented hundreds of sources. **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `/tmp/mutation-ui-2/mutation-report-ui.mjs` (not committed; copy under
   `node_modules/.cache/mutation-ui-2/` for resolution). Same operators as
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1). Cap `--max=20` per module.

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-2/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-2/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --json=/tmp/mutation-ui-2/baseline-batch*.json

# After (with tests/unit/mutation-ui2-*.test.ts)
node node_modules/.cache/mutation-ui-2/mutation-report-ui.mjs \
  --modules=src/ui/hex-svg.ts,src/ui/die-faces.ts,src/ui/seat-labels.ts,src/ui/game-prefetch.ts,src/pwa/idle-warm.ts,src/ui/pointer-hygiene.ts,src/core/dice/dice-selector.ts,src/core/hex/coordinates.ts,src/ui/board-a11y.ts,src/core/alignment/contiguous.ts \
  --max=20 --timeout=90000 \
  --json=/tmp/mutation-ui-2/after.json

# Focused re-measure after follow-up kills
node node_modules/.cache/mutation-ui-2/mutation-report-ui.mjs \
  --modules=src/ui/seat-labels.ts,src/ui/pointer-hygiene.ts \
  --max=20 --timeout=90000 \
  --json=/tmp/mutation-ui-2/after-followup.json
```

Nothing added to `package.json`, lockfile, or CI.

## Before → after (score %)

| Module | Before % | After % | Δ pp | Killed after |
|--------|--------:|--------:|-----:|-------------:|
| `ui/hex-svg.ts` | 0.0 | **100.0** | +100.0 | 20/20 |
| `ui/die-faces.ts` | 0.0 | **100.0** | +100.0 | 5/5 |
| `ui/seat-labels.ts` | 0.0 | **100.0** | +100.0 | 9/9 |
| `ui/pointer-hygiene.ts` | 55.0 | **100.0** | +45.0 | 20/20 |
| `core/dice/dice-selector.ts` | 60.0 | **100.0** | +40.0 | 20/20 |
| `ui/game-prefetch.ts` | 30.0 | **55.0** | +25.0 | 11/20 |
| `pwa/idle-warm.ts` | 50.0 | **71.4** | +21.4 | 10/14 |
| `ui/board-a11y.ts` | 75.0 | **90.0** | +15.0 | 18/20 |
| `core/hex/coordinates.ts` | 70.0 | **80.0** | +10.0 | 16/20 |
| `core/alignment/contiguous.ts` | 80.0 | **85.0** | +5.0 | 17/20 |

**10 modules** with measurably higher scores (acceptance: 8+).

Skipped from after-focus (already ≥95% or 100% at baseline):
`player-colors` (100%), `graph/algorithms` (100%), `polyomino/transform` (95%),
`grid-alignment` (95%).

## Remaining survivors (not product bugs)

| Module | Survivor | Reason |
|--------|----------|--------|
| `game-prefetch` | private `allowPrefetchImportsForTests` default / early-return; idleHandle cancel branches under `MODE=test` sync path | Test seam is module-private (demoted); Vitest always takes the sync idle path so cancelIdle/timeout reset arms are unreachable without source export. |
| `idle-warm` | `enabled` default `window && document` → `\|\|`; `hidden \|\| saveData` → `&&` in a couple of sites | Requires one global missing / contradictory hidden+saveData pairs that still mark done via other arms; near-equivalent under jsdom. |
| `board-a11y` | `orphanCells.length > 0` → `>= 0`; SVG `namespaceURI \|\| instanceof` → `&&` | Empty-orphan entry is a no-op; HTML/SVG both sides agree under jsdom constructors. Pinned `it.skip` for `> vs >=`. |
| `hex/coordinates` | `(q+1)&1` → `(q-1)&1` (and matching offsetToAxial) | Equivalent: ±1 share parity so `& 1` is identical. Pinned `it.skip`. |
| `contiguous` | `row + offset` / `col + offset` → `-` | Undirected neighbor tables are centrally symmetric; flipped arithmetic yields the same set. Pinned `it.skip`. |

No production defects confirmed.

## New tests

All new files (did **not** edit #571 / #576 / #577 / #579 suites):

- `tests/unit/mutation-ui2-hex-svg.test.ts`
- `tests/unit/mutation-ui2-die-faces.test.ts`
- `tests/unit/mutation-ui2-seat-labels.test.ts`
- `tests/unit/mutation-ui2-game-prefetch.test.ts`
- `tests/unit/mutation-ui2-idle-warm.test.ts`
- `tests/unit/mutation-ui2-pointer-hygiene.test.ts`
- `tests/unit/mutation-ui2-dice-selector.test.ts`
- `tests/unit/mutation-ui2-hex-coordinates.test.ts`
- `tests/unit/mutation-ui2-board-a11y.test.ts`
- `tests/unit/mutation-ui2-contiguous.test.ts`

Rules: no player-facing copy assertions (seat-labels use cross-helper equality /
distinctness only); no AI move/timing assertions; hard-coded numeric
expectations (e.g. slop `16`, dieSize `60`, idle max `3`, hex corner count `6`)
so const ±1 mutants are detectable.

## Overlap

- **#579** — UI mutation wave 1; modules listed there are excluded here.
- **#571 / #577** — UI coverage characterization; different files (untouched).
- **#576** — type ratchet; untouched.
- **#515** (merged) — rules engines only.
