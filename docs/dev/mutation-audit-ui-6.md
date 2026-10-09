# Mutation audit — UI / shell wave 6 (q-mp-231)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`),
wave 2 (`docs/dev/mutation-audit-ui-2.md`), wave 3 (`docs/dev/mutation-audit-ui-3.md`),
wave 4 (`docs/dev/mutation-audit-ui-4.md`), and wave 5 (`docs/dev/mutation-audit-ui-5.md` /
open **#726**). This wave covers **board-ui cold spots** from games not already
targeted by waves 1–5: `juggle`, `fiar`, and `kwatro-sinko` (coldest game dirs on
the post728 coverage map after `ai-worker` / `ui/three` / `ui/owl`).

## Scope

**In (this wave):**
`src/games/juggle/board-ui.ts`,
`src/games/fiar/board-ui.ts`,
`src/games/kwatro-sinko/board-ui.ts`.

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Waves 1–5 modules are not repeated.

**Overlap avoided:**

- Open **#726** (`q-mp-202` wave 5) — dice-ui / roller / owl; artifacts already on
  tip `cursor/mp-tip-post728`. This wave does not retarget those modules.
- Open tip-post728 drafts #730–#735 — no-console, knip types, testing-layers,
  void game-controllers, coverage-map, backlog; orthogonal to mutation board-ui.

## Harness

1. **Stryker probe:** same failure mode as waves 1–5 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-6/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-6/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap preferring
   `board-ui` / `render` / `inject` / `mutation-ui6` basenames when a module has
   100+ importers (kwatro).

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-6/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-6/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-6-baseline.json

# After (with tests/unit/mutation-ui6-*.test.ts)
node node_modules/.cache/mutation-ui-6/mutation-report-ui.mjs \
  --modules=src/games/juggle/board-ui.ts,src/games/fiar/board-ui.ts,src/games/kwatro-sinko/board-ui.ts \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-6-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                           |  Score % | Notes                                            |
| -------------------------------- | -------: | ------------------------------------------------ |
| `games/juggle/board-ui.ts`       | **45.0** | first-20 window mostly in `syncJuggleBoardCells` |
| `games/fiar/board-ui.ts`         | **90.0** | padding/viewBox already strong; bg x/y open      |
| `games/kwatro-sinko/board-ui.ts` | **35.0** | radii / allowInput / click guards open           |

## Before → after (score %)

| Module                           | Before % |   After % |  Δ pp | Killed after |
| -------------------------------- | -------: | --------: | ----: | -----------: |
| `games/juggle/board-ui.ts`       |     45.0 |  **85.0** | +40.0 |        17/20 |
| `games/fiar/board-ui.ts`         |     90.0 | **100.0** | +10.0 |        20/20 |
| `games/kwatro-sinko/board-ui.ts` |     35.0 |  **95.0** | +60.0 |        19/20 |

**3 modules** with measurably higher scores (acceptance: ≥2).

JSON artifacts: `docs/dev/mutation-audit-ui-6-baseline.json`,
`docs/dev/mutation-audit-ui-6-after.json`.

## Remaining survivors (not product bugs)

| Module   | Survivor                                          | Reason                                                                                      |
| -------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `juggle` | L75 `isPreviewValid` `false → true` without hover | `previewSet` empty; class path never reads the flag. Equivalent under exercised paths.      |
| `juggle` | L112/L113 `row/col < GRID_SIZE` → `<=`            | Extra index has no cell in the cached map; loop body `continue`s. Equivalent for dense 9×9. |
| `kwatro` | L59 `connId > node.id` → `>=`                     | No self-loops on the opening graph; undirected half-sum line count unchanged.               |

No production defects confirmed. FIAR first-20 window is fully killed.

## New tests

All new files (did **not** edit wave 1–5 suites or #726 files):

- `tests/unit/mutation-ui6-juggle-board-ui.test.ts`
- `tests/unit/mutation-ui6-fiar-board-ui.test.ts`
- `tests/unit/mutation-ui6-kwatro-board-ui.test.ts`

Rules: no player-facing copy assertions; no AI move/timing assertions; hard-coded
numeric / geometry expectations (`NODE_RADIUS` 22, `CHIP_RADIUS` 18, padding 60,
coord tokens `A1`/`I9`, `data-row`/`data-col` parse) so const ±1 / boolean /
arithmetic mutants are detectable. Juggle suite exercises exported
`syncJuggleBoardCells` (previously untested).

## Overlap

- **#579 / wave 1** — router, flags, storage, offline, PWA register, …
- **#584 / wave 2** — hex-svg, die-faces, seat-labels, prefetch, idle-warm, …
- **#654 / wave 3** — route-generation, bootstrap, bootstrap-owl, stats-dashboard
- **#668 / wave 4** — game-selector, compat, tutorial
- **#726 / wave 5** — dice-ui, roller, owl-component
