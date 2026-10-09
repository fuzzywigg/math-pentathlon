# Mutation audit — UI / shell wave 9 (q-mp-298)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 8 (`docs/dev/mutation-audit-ui-8.md`). This wave covers densest
residual hosts disjoint from wave 7 contig / game-shell / tutorial and wave 8
expression / polyomino / graph:
`attribute-ui`, `fraction-bar-ui`, and `dice-selector`.

## Scope

**In (this wave):**
`src/core/attributes/attribute-ui.ts`,
`src/core/fractions/fraction-bar-ui.ts`,
`src/core/dice/dice-selector.ts` (tests only — kill clear survivors; no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Waves 1–8 modules are not repeated as primary hosts
except `dice-selector` (wave-2 host) which is remeasured here per backlog and
already at 100% in the first-20 window.

**Overlap avoided:**

- Open tip-post748 draft `#774` (`q-mp-251` wave 7) — contig / game-shell /
  tutorial — hosts disjoint; left open.
- Open `#778` wave 8 (expression/polyomino/graph) — orthogonal file set; tip
  already has wave-8 artifacts.
- `#727` nullish HELD / `q-mp-300` dice-selector characterization — untouched
  (no product nullish edits; wave-9 dice file is a thin structural re-pin only).

## Harness

1. **Stryker probe:** same failure mode as waves 1–8 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-9/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-9/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap preferring
   `mutation-ui9` / module-precise import needles
   (`attributes/attribute-ui`, `fractions/fraction-bar-ui`, `dice/dice-selector`).

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-9/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-9/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui9 \
  --json=docs/dev/mutation-audit-ui-9-baseline.json

# After (with tests/unit/mutation-ui9-*.test.ts)
node node_modules/.cache/mutation-ui-9/mutation-report-ui.mjs \
  --modules=src/core/attributes/attribute-ui.ts,src/core/fractions/fraction-bar-ui.ts,src/core/dice/dice-selector.ts \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-9-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                              |   Score % | Notes                                                          |
| ----------------------------------- | --------: | -------------------------------------------------------------- |
| `core/attributes/attribute-ui.ts`   |  **90.0** | first-20 mostly label-bump height/viewBox; 2 viewBox survivors |
| `core/fractions/fraction-bar-ui.ts` |  **45.0** | DEFAULT height/showLabel + bg rect inset geometry under-pinned |
| `core/dice/dice-selector.ts`        | **100.0** | first-20 already fully killed by wave-2 + overnight suites     |

## Before → after (score %)

| Module                              | Before % |   After % |  Δ pp | Killed after |
| ----------------------------------- | -------: | --------: | ----: | -----------: |
| `core/attributes/attribute-ui.ts`   |     90.0 | **100.0** | +10.0 |        20/20 |
| `core/fractions/fraction-bar-ui.ts` |     45.0 |  **95.0** | +50.0 |        19/20 |
| `core/dice/dice-selector.ts`        |    100.0 | **100.0** |   0.0 |        20/20 |

**2 modules** with measurably higher scores (acceptance: ≥2). Dice first-20
window was already saturated.

JSON artifacts: `docs/dev/mutation-audit-ui-9-baseline.json`,
`docs/dev/mutation-audit-ui-9-after.json`.

## Remaining survivors (not product bugs)

| Module     | Survivor                          | Reason                                                                                       |
| ---------- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| `fraction` | L23 `interactive: false` → `true` | `DEFAULT_CONFIG.interactive` is never read by render / `createInteractiveFractionBar` paths. |

No production defects confirmed.

## New tests

All new files (did **not** edit wave 1–8 suites):

- `tests/unit/mutation-ui9-attribute-ui.test.ts`
- `tests/unit/mutation-ui9-fraction-bar-ui.test.ts`
- `tests/unit/mutation-ui9-dice-selector.test.ts`

Rules: no player-facing copy assertions; hard-coded numeric / class /
attribute / viewBox expectations so const ±1 / boolean / equality / arithmetic
mutants are detectable.

## Overlap

- **#579 / wave 1** — router, flags, storage, offline, PWA register, …
- **#584 / wave 2** — hex-svg, die-faces, seat-labels, prefetch, idle-warm,
  dice-selector (remeasured here; already 100%)
- **#654 / wave 3** — route-generation, bootstrap, bootstrap-owl, stats-dashboard
- **#668 / wave 4** — game-selector, compat, tutorial (prior measurement)
- **#726 / wave 5** — dice-ui, roller, owl-component
- **#745 / wave 6** — juggle / fiar / kwatro board-ui
- **#774 / wave 7** — contig board-ui / game-shell / tutorial
- **#778 / wave 8** — expression-ui / polyomino-ui / graph-ui
