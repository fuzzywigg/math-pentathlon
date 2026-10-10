# Mutation audit — UI / shell wave 11 (q-mp-350)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 10 (`docs/dev/mutation-audit-ui-10.md`). This wave remeasures residual
hosts disjoint from wave 10 (board-a11y / storage / router) and from parallel
wave 12 hosts (player-colors / game-error-boundary / die-faces):
`offline`, `timeout-handle`, and `coord-map`.

## Scope

**In (this wave):**
`src/ui/offline.ts`,
`src/ui/timeout-handle.ts`,
`src/ui/coord-map.ts` (tests only — kill clear survivors; no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Wave 10 modules and wave 12 hosts are not repeated.

**Overlap avoided:**

- Tip `cursor/mp-tip-post830` already has waves 1–10 artifacts (incl. wave 10
  from tip fold / `#832` content).
- Open tip drafts `#853` / `#854` are unrelated (CI pin / bundle headroom).
- Open `#832` wave 10 left open (hosts disjoint).
- Parallel `q-mp-373` wave 12 owns player-colors / game-error-boundary /
  die-faces — not touched here.
- Wave 1 already raised timeout-handle to 100% and offline / coord-map to
  85.7% / 80%. This wave remeasures the same trio per backlog q-mp-350.

## Harness

1. **Stryker probe:** same failure mode as waves 1–10 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-11/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-11/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap preferring
   `mutation-ui11` / module-precise import needles
   (`ui/offline`, `ui/timeout-handle`, `ui/coord-map`).

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-11/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-11/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui11 \
  --json=docs/dev/mutation-audit-ui-11-baseline.json

# After (with tests/unit/mutation-ui11-*.test.ts)
node node_modules/.cache/mutation-ui-11/mutation-report-ui.mjs \
  --modules=src/ui/offline.ts,src/ui/timeout-handle.ts,src/ui/coord-map.ts \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-11-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                     |   Score % | Notes                                                         |
| -------------------------- | --------: | ------------------------------------------------------------- |
| `ui/offline.ts`            | **100.0** | all 7 mutants already killed (wave-1 residual closed by tip)  |
| `ui/timeout-handle.ts`     | **100.0** | all 6 mutants already killed                                  |
| `ui/coord-map.ts`          |  **80.0** | 4× first-20 `0 → 1` survivors on `clientToSvgUser` `> 0` arms |

## Before → after (score %)

| Module                 | Before % |   After % | Δ pp | Killed after |
| ---------------------- | -------: | --------: | ---: | -----------: |
| `ui/offline.ts`        |    100.0 | **100.0** |  0.0 |          7/7 |
| `ui/timeout-handle.ts` |    100.0 | **100.0** |  0.0 |          6/6 |
| `ui/coord-map.ts`      |     80.0 | **100.0** | +20.0 |        20/20 |

**1 module** with a measurably higher score (coord-map). Offline / timeout-handle
first windows were already saturated (remeasured + structural re-pins).

JSON artifacts: `docs/dev/mutation-audit-ui-11-baseline.json`,
`docs/dev/mutation-audit-ui-11-after.json`.

## Remaining survivors (not product bugs)

None in the first-20 window after wave 11. The four coord-map `0 → 1` survivors
(`viewBoxWidth > 0`, `rect.width > 0`, `viewBoxHeight > 0`, `rect.height > 0`)
were killed by pinning CSS/viewBox width/height exactly `1` so `> 0` ≠ `> 1`.

No production defects confirmed.

## New tests

All new files (did **not** edit wave 1–10 suites):

- `tests/unit/mutation-ui11-offline.test.ts`
- `tests/unit/mutation-ui11-timeout-handle.test.ts`
- `tests/unit/mutation-ui11-coord-map.test.ts`

Rules: no player-facing copy assertions; hard-coded numeric / boolean /
attribute expectations so equality / logical / numeric mutants are detectable.

## Overlap

- **#579 / wave 1** — router, flags, storage, offline, PWA register, coord-map,
  timeout-handle, … (offline / timeout-handle / coord-map remeasured here)
- **#584 / wave 2** — hex-svg, die-faces, seat-labels, prefetch, idle-warm,
  dice-selector, board-a11y
- **#654 / wave 3** — route-generation, bootstrap, bootstrap-owl, stats-dashboard
- **#668 / wave 4** — game-selector, compat, tutorial
- **#726 / wave 5** — dice-ui, roller, owl-component
- **#745 / wave 6** — juggle / fiar / kwatro board-ui
- **#774 / wave 7** — contig board-ui / game-shell / tutorial
- **#778 / wave 8** — expression-ui / polyomino-ui / graph-ui
- **#814 / wave 9** — attribute-ui / fraction-bar-ui / dice-selector
- **#832 / wave 10** — board-a11y / safe-web-storage / router (hosts disjoint)
