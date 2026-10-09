# Mutation audit — UI / shell wave 4 (q-mp-144)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`),
wave 2 (`docs/dev/mutation-audit-ui-2.md`), and wave 3 (open draft **#654** /
`docs/dev/mutation-audit-ui-3.md`). This wave covers the next non-engine / non-AI
modules with surviving mutants **outside** waves 1–3.

## Scope

**In (this wave):**
`src/ui/game-selector.ts`,
`src/core/alignment/compat.ts`,
`src/core/tutorial.ts` (tests only — no `src/core/tutorial.ts` edits; a parallel
brace-only PR may touch that file).

**Documented but not selected (0 AST mutants / saturated / covered elsewhere):**
`src/ui/game-loading.ts` (0 AST mutants),
`src/pwa/*` (register / idle-warm in waves 1–2; bootstrap / bootstrap-owl in #654),
`src/ui/player-colors.ts` (100% at fresh baseline),
`tests/helpers/core-hex/hex-ui.ts` (90% — skipped; formerly `src/core/hex/hex-ui.ts (absent on tip)`, quarantined under q-mp-133),
`src/core/dice/dice-ui.ts` / `roller.ts` (65% / 75% — deferred; enough modules).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits.

## Harness

1. **Stryker probe:** same failure mode as waves 1–3 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-4/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-4/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Operators sourced from `npm run mutation:report` /
   `scripts/mutation-report.mjs`.

Exact commands:

```bash
# Fresh rank (candidate pool)
node node_modules/.cache/mutation-ui-4/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-4/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --json=/tmp/mutation-ui-4/baseline-rank.json

# Baseline (selected modules, existing tests only)
# → docs/dev/mutation-audit-ui-4-baseline.json

# After (with tests/unit/mutation-ui4-*.test.ts)
node node_modules/.cache/mutation-ui-4/mutation-report-ui.mjs \
  --modules=src/ui/game-loading.ts,src/core/tutorial.ts,src/ui/game-selector.ts,src/core/alignment/compat.ts \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-4-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline rank (candidate pool)

| Module                     |  Score % | Notes                           |
| -------------------------- | -------: | ------------------------------- |
| `ui/game-loading.ts`       |      n/a | 0 AST mutants (DOM/string only) |
| `core/tutorial.ts`         | **65.0** | selected (tests only)           |
| `ui/game-selector.ts`      | **35.0** | selected                        |
| `core/alignment/compat.ts` | **25.0** | selected                        |
| `core/dice/dice-ui.ts`     |     65.0 | deferred                        |
| `core/dice/roller.ts`      |     75.0 | deferred                        |
| `core/hex/hex-ui.ts`       |     90.0 | skip (high)                     |
| `ui/player-colors.ts`      |    100.0 | already saturated               |
| `pwa/*`                    |        — | all covered by waves 1–3 / #654 |

## Before → after (score %)

| Module                     | Before % |  After % |  Δ pp |  Killed after |
| -------------------------- | -------: | -------: | ----: | ------------: |
| `ui/game-selector.ts`      |     35.0 | **90.0** | +55.0 |         18/20 |
| `core/alignment/compat.ts` |     25.0 | **90.0** | +65.0 |         18/20 |
| `core/tutorial.ts`         |     65.0 | **75.0** | +10.0 |         15/20 |
| `ui/game-loading.ts`       |      n/a |      n/a |     — | 0 AST mutants |

**3 modules** with measurably higher scores (acceptance: ≥2).

JSON artifacts: `docs/dev/mutation-audit-ui-4-baseline.json`,
`docs/dev/mutation-audit-ui-4-after.json`.

## Remaining survivors (not product bugs)

| Module          | Survivor                                          | Reason                                                                                |
| --------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `game-selector` | `{ passive: true }` → `false` on pointerenter     | Not observable under jsdom listener options. Pinned `it.skip`.                        |
| `game-selector` | `!header \|\| !panel` → `&&` in `toggleAccordion` | Needs a half-missing accordion DOM; normal render always has both. Pinned `it.skip`.  |
| `compat`        | `grid.length > 0` → `>= 0`                        | Equivalent for non-negative lengths (empty still yields `cols: 0`). Pinned `it.skip`. |
| `compat`        | `col >= row.length` → `>`                         | Out-of-range index still reads `undefined` on plain arrays. Pinned `it.skip`.         |
| `tutorial`      | `TOOLTIP_AVOID_GAP_PX` 12 ±1                      | Often masked by `Math.max(margin=16, gap)`. Pinned `it.skip`.                         |
| `tutorial`      | `TAP_CUE_AVOID_HEIGHT_PX` 36 ±1                   | Razor `preferVerticalSide` geometry; left pinned.                                     |
| `tutorial`      | start() `overlay \|\| tooltip` → `&&`             | Needs half-built overlay private state. Pinned `it.skip`.                             |

No production defects confirmed.

## New tests

All new files (did **not** edit wave 1–3 suites or #654 files):

- `tests/unit/mutation-ui4-game-selector.test.ts`
- `tests/unit/mutation-ui4-compat.test.ts`
- `tests/unit/mutation-ui4-tutorial.test.ts`

Rules: no player-facing copy assertions (difficulty labels derived from
`difficulty-*` class tokens only); no AI move/timing assertions; hard-coded
numeric expectations (`max: 3`, cardinal reverse vectors `0`/`-1`, grid fence
lengths) so const ±1 mutants are detectable.

## Overlap

- **#579 / wave 1** — router, flags, storage, offline, PWA register, …
- **#584 / wave 2** — hex-svg, die-faces, seat-labels, prefetch, idle-warm, …
- **#654 / wave 3** — route-generation, bootstrap, bootstrap-owl, stats-dashboard
- Parallel brace-only PR may touch `src/core/tutorial.ts` — this wave is
  **tests-only** for tutorial (no source edits).
