# Mutation audit — UI / shell wave 10 (q-mp-325)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 9 (`docs/dev/mutation-audit-ui-9.md`). This wave remeasures residual
hosts disjoint from waves 7–9 primary sets:
`board-a11y`, `safe-web-storage`, and `router`.

## Scope

**In (this wave):**
`src/ui/board-a11y.ts`,
`src/core/safe-web-storage.ts`,
`src/core/router.ts` (tests only — kill clear survivors; no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Waves 7–9 modules (contig / game-shell / tutorial /
expression / polyomino / graph / attribute / fraction / dice) are not repeated.

**Overlap avoided:**

- Tip already has wave 9 (`docs/dev/mutation-audit-ui-9.md` / q-mp-298 on alpha).
- Open tip drafts `#774` wave 7 / `#778` wave 8 / `#814` wave 9 — hosts disjoint;
  left open.
- Wave 1 already raised router + safe-web-storage to 100%; wave 2 raised
  board-a11y to 90%. This wave remeasures the same trio per backlog q-mp-325.

## Harness

1. **Stryker probe:** same failure mode as waves 1–9 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-10/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-10/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap preferring
   `mutation-ui10` / module-precise import needles
   (`ui/board-a11y`, `safe-web-storage`, `core/router`).

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-10/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-10/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui10 \
  --json=docs/dev/mutation-audit-ui-10-baseline.json

# After (with tests/unit/mutation-ui10-*.test.ts)
node node_modules/.cache/mutation-ui-10/mutation-report-ui.mjs \
  --modules=src/ui/board-a11y.ts,src/core/safe-web-storage.ts,src/core/router.ts \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-10-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                     |   Score % | Notes                                                          |
| -------------------------- | --------: | -------------------------------------------------------------- |
| `ui/board-a11y.ts`         |  **90.0** | same first-20 survivors as wave 2 (`>→>=`, SVG `\|\|→&&`)      |
| `core/safe-web-storage.ts` | **100.0** | first-20 fully killed (all 26 mutants also 100% when uncapped) |
| `core/router.ts`           | **100.0** | all 11 mutants already killed                                  |

## Before → after (score %)

| Module                     | Before % |   After % | Δ pp | Killed after |
| -------------------------- | -------: | --------: | ---: | -----------: |
| `ui/board-a11y.ts`         |     90.0 |  **95.0** | +5.0 |        19/20 |
| `core/safe-web-storage.ts` |    100.0 | **100.0** |  0.0 |        20/20 |
| `core/router.ts`           |    100.0 | **100.0** |  0.0 |        11/11 |

**1 module** with a measurably higher score (board-a11y). Storage / router
first-20 windows were already saturated (remeasured + structural re-pins).

JSON artifacts: `docs/dev/mutation-audit-ui-10-baseline.json`,
`docs/dev/mutation-audit-ui-10-after.json`.

## Remaining survivors (not product bugs)

| Module       | Survivor                               | Reason                                                                   |
| ------------ | -------------------------------------- | ------------------------------------------------------------------------ |
| `board-a11y` | L158 `orphanCells.length > 0` → `>= 0` | Empty-orphan entry is a no-op; group loops do nothing. Pinned `it.skip`. |

L179 SVG `namespaceURI || instanceof` → `&&` was killed by spoofing
`namespaceURI` alone on an HTML nest (jsdom constructors otherwise agree on
both sides).

No production defects confirmed.

## New tests

All new files (did **not** edit wave 1–9 suites):

- `tests/unit/mutation-ui10-board-a11y.test.ts`
- `tests/unit/mutation-ui10-safe-web-storage.test.ts`
- `tests/unit/mutation-ui10-router.test.ts`

Rules: no player-facing copy assertions; hard-coded role / namespaceURI /
boolean / path expectations so equality / logical / boolean mutants are
detectable.

## Overlap

- **#579 / wave 1** — router, flags, storage, offline, PWA register, … (router +
  safe-web-storage remeasured here; still 100%)
- **#584 / wave 2** — hex-svg, die-faces, seat-labels, prefetch, idle-warm,
  dice-selector, board-a11y (remeasured; 90 → 95)
- **#654 / wave 3** — route-generation, bootstrap, bootstrap-owl, stats-dashboard
- **#668 / wave 4** — game-selector, compat, tutorial
- **#726 / wave 5** — dice-ui, roller, owl-component
- **#745 / wave 6** — juggle / fiar / kwatro board-ui
- **#774 / wave 7** — contig board-ui / game-shell / tutorial
- **#778 / wave 8** — expression-ui / polyomino-ui / graph-ui
- **#814 / wave 9** — attribute-ui / fraction-bar-ui / dice-selector
