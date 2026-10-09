# Mutation audit — UI / shell wave 8 (q-mp-272)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 7 (`docs/dev/mutation-audit-ui-7.md`). This wave covers core UI helpers
disjoint from wave 7’s contig / game-shell / tutorial hosts:
`expression-ui`, `polyomino-ui`, and `graph-ui`.

## Scope

**In (this wave):**
`src/core/expressions/expression-ui.ts`,
`src/core/polyomino/polyomino-ui.ts`,
`src/core/graph/graph-ui.ts` (tests only — kill clear survivors; no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Waves 1–7 modules are not repeated as primary hosts.

**Overlap avoided:**

- Open tip-post748 draft `#774` (`q-mp-251` wave 7) — contig / game-shell /
  tutorial — hosts disjoint; left open.
- Open `#745` wave 6 (juggle/fiar/kwatro board-ui) — orthogonal file set.
- `#727` nullish HELD — untouched.

## Harness

1. **Stryker probe:** same failure mode as waves 1–7 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-8/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-8/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap preferring
   `mutation-ui8` / module-precise import needles
   (`expressions/expression-ui`, `polyomino/polyomino-ui`, `graph/graph-ui`).

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-8/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-8/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui8 \
  --json=docs/dev/mutation-audit-ui-8-baseline.json

# After (with tests/unit/mutation-ui8-*.test.ts)
node node_modules/.cache/mutation-ui-8/mutation-report-ui.mjs \
  --modules=src/core/expressions/expression-ui.ts,src/core/polyomino/polyomino-ui.ts,src/core/graph/graph-ui.ts \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-8-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                              |  Score % | Notes                                                         |
| ----------------------------------- | -------: | ------------------------------------------------------------- |
| `core/expressions/expression-ui.ts` | **50.0** | stylesInjected init + SVG text centering arith                |
| `core/polyomino/polyomino-ui.ts`    | **50.0** | DEFAULT_CONFIG numerics / flip default / cell x arith         |
| `core/graph/graph-ui.ts`            | **70.0** | first-6 = `graphPrefersReducedMotion` guards; rest SVG bounds |

## Before → after (score %)

| Module                              | Before % |   After % |  Δ pp | Killed after |
| ----------------------------------- | -------: | --------: | ----: | -----------: |
| `core/expressions/expression-ui.ts` |     50.0 | **100.0** | +50.0 |        20/20 |
| `core/polyomino/polyomino-ui.ts`    |     50.0 |  **85.0** | +35.0 |        17/20 |
| `core/graph/graph-ui.ts`            |     70.0 |  **95.0** | +25.0 |        19/20 |

**3 modules** with measurably higher scores (acceptance: ≥2).

JSON artifacts: `docs/dev/mutation-audit-ui-8-baseline.json`,
`docs/dev/mutation-audit-ui-8-after.json`.

## Remaining survivors (not product bugs)

| Module      | Survivor                         | Reason                                                                                                               |
| ----------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `polyomino` | L22 `showGrid: true` → `false`   | `showGrid` is stored in `DEFAULT_CONFIG` but never read by render paths.                                             |
| `polyomino` | L43 rotation default `0` → `1`   | `rotateCells` `default` branch returns cells unchanged for non-90/180/270 — equivalent to `0`.                       |
| `polyomino` | L60 `(col - minCol)` → `+`       | `getTransformedCells` always `normalizeCells` so `minCol === 0`; `col - 0` ≡ `col + 0`.                              |
| `graph`     | L21 `\|\|` → `&&` on typeof gate | In jsdom, both sides false → same; when `matchMedia` missing both paths still return `false` (catch/`return false`). |

No production defects confirmed.

## New tests

All new files (did **not** edit wave 1–7 suites):

- `tests/unit/mutation-ui8-expression-ui.test.ts`
- `tests/unit/mutation-ui8-polyomino-ui.test.ts`
- `tests/unit/mutation-ui8-graph-ui.test.ts`

Rules: no player-facing copy assertions; no AI move/timing policy asserts
(`animateMove` duration pins are decorative UI motion under reduced-motion
guards only); hard-coded numeric / class / attribute expectations so const ±1 /
boolean / equality / arithmetic mutants are detectable.

## Overlap

- **#579 / wave 1** — router, flags, storage, offline, PWA register, …
- **#584 / wave 2** — hex-svg, die-faces, seat-labels, prefetch, idle-warm, …
- **#654 / wave 3** — route-generation, bootstrap, bootstrap-owl, stats-dashboard
- **#668 / wave 4** — game-selector, compat, tutorial (prior measurement)
- **#726 / wave 5** — dice-ui, roller, owl-component
- **#745 / wave 6** — juggle / fiar / kwatro board-ui
- **#774 / wave 7** — contig board-ui / game-shell / tutorial
