# Mutation audit — UI / shell wave 7 (q-mp-251)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`),
wave 2 (`docs/dev/mutation-audit-ui-2.md`), wave 3 (`docs/dev/mutation-audit-ui-3.md`),
wave 4 (`docs/dev/mutation-audit-ui-4.md`), wave 5 (`docs/dev/mutation-audit-ui-5.md`),
and wave 6 (`docs/dev/mutation-audit-ui-6.md`). This wave covers modules not targeted
by waves 1–6 board-ui cold spots: `contig-60/board-ui`, `game-shell`, and clear
`tutorial` survivors (no tutorial copy / product edits).

## Scope

**In (this wave):**
`src/games/contig-60/board-ui.ts`,
`src/ui/components/game-shell.ts`,
`src/core/tutorial.ts` (tests only — kill clear survivors; no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Waves 1–6 modules are not repeated as primary hosts.

**Overlap avoided:**

- Tip `cursor/mp-tip-post748` already has wave-6 artifacts (`mutation-audit-ui-6*`)
  from folded `#745` / `q-mp-231` (juggle / fiar / kwatro board-ui).
- Open tip-post748 drafts `#749`–`#753` — emit-identity / demos dup-imports /
  demos void / dismissOwl knip / backlog — orthogonal (no mutation UI files).
- `#727` nullish HELD — untouched.
- Wave 4 (`#668`) already measured `tutorial.ts`; this wave re-measures the
  first-20 window with `mutation-ui7-tutorial` pins for clear survivors only.

## Harness

1. **Stryker probe:** same failure mode as waves 1–6 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-7/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-7/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap preferring
   `mutation-ui7` / module-precise import needles (`contig-60/board-ui`,
   `components/game-shell`, `core/tutorial`).

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-7/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-7/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui7 \
  --json=docs/dev/mutation-audit-ui-7-baseline.json

# After (with tests/unit/mutation-ui7-*.test.ts)
node node_modules/.cache/mutation-ui-7/mutation-report-ui.mjs \
  --modules=src/games/contig-60/board-ui.ts,src/ui/components/game-shell.ts,src/core/tutorial.ts \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-7-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                        |  Score % | Notes                                                              |
| ----------------------------- | -------: | ------------------------------------------------------------------ |
| `games/contig-60/board-ui.ts` | **55.0** | sync path: cache / phase / owner / points / aria                   |
| `ui/components/game-shell.ts` | **65.0** | first-20 window mostly `isKeyboardReachable` + `isDisplayedWithin` |
| `core/tutorial.ts`            | **55.0** | first-20 = padding constants + start/step guards                   |

## Before → after (score %)

| Module                        | Before % |  After % |  Δ pp | Killed after |
| ----------------------------- | -------: | -------: | ----: | -----------: |
| `games/contig-60/board-ui.ts` |     55.0 | **90.0** | +35.0 |        18/20 |
| `ui/components/game-shell.ts` |     65.0 | **75.0** | +10.0 |        15/20 |
| `core/tutorial.ts`            |     55.0 | **75.0** | +20.0 |        15/20 |

**3 modules** with measurably higher scores (acceptance: ≥2).

JSON artifacts: `docs/dev/mutation-audit-ui-7-baseline.json`,
`docs/dev/mutation-audit-ui-7-after.json`.

## Remaining survivors (not product bugs)

| Module       | Survivor                                | Reason                                                                                                               |
| ------------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `contig`     | L142/L151 `row/col < GRID_*` → `<=`     | Dense `BOARD_NUMBERS`; extra index is `undefined` and `continue`s — cell count stays 60.                             |
| `game-shell` | `isDisplayedWithin` L107/L109/L113/L116 | Redundant with `isKeyboardReachable` pre-filter inside `getFocusableWithin`; equivalent under exercised modal paths. |
| `tutorial`   | `TOOLTIP_AVOID_GAP_PX` 12 ±1            | Often masked by `Math.max(margin=16, gap)`. Pinned `it.skip` (same class as wave 4).                                 |
| `tutorial`   | `TAP_CUE_AVOID_HEIGHT_PX` 36 ±1         | Razor `preferVerticalSide` geometry; left pinned.                                                                    |
| `tutorial`   | start() `overlay \|\| tooltip` → `&&`   | Needs half-built overlay private state. Documented; restart still single-overlay.                                    |

No production defects confirmed. Contig first-20 window killed except dense-grid fences.

## New tests

All new files (did **not** edit wave 1–6 suites):

- `tests/unit/mutation-ui7-contig-board-ui.test.ts`
- `tests/unit/mutation-ui7-game-shell.test.ts`
- `tests/unit/mutation-ui7-tutorial.test.ts`

Rules: no player-facing copy assertions (tutorial titles/messages only drive DOM
structure; contig aria uses seat token `Blue` as structural); no AI move/timing
assertions; hard-coded numeric / class / focus expectations (`DEFAULT_HIGHLIGHT`
8 → ring 56px, `data-points="+1"`, exact one `.contig-cell-p2`, start-btn focus)
so const ±1 / boolean / equality mutants are detectable.

## Overlap

- **#579 / wave 1** — router, flags, storage, offline, PWA register, …
- **#584 / wave 2** — hex-svg, die-faces, seat-labels, prefetch, idle-warm, …
- **#654 / wave 3** — route-generation, bootstrap, bootstrap-owl, stats-dashboard
- **#668 / wave 4** — game-selector, compat, tutorial (prior measurement)
- **#726 / wave 5** — dice-ui, roller, owl-component
- **#745 / wave 6** — juggle / fiar / kwatro board-ui
