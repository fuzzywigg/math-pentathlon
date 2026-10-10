# Mutation audit — UI / shell wave 12 (q-mp-373)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 10 (`docs/dev/mutation-audit-ui-10.md`). Wave 11 (`q-mp-350`,
offline / timeout-handle / coord-map) remains undrafted; this wave picks
disjoint hosts: `player-colors`, `game-error-boundary`, and `die-faces`.

## Scope

**In (this wave):**
`src/ui/player-colors.ts`,
`src/ui/game-error-boundary.ts`,
`src/ui/die-faces.ts` (tests only — remeasure + structural re-pins; no `src/`
edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Wave 11 hosts (offline / timeout-handle / coord-map)
are not repeated.

**Overlap avoided:**

- Tip drafts into `cursor/mp-tip-post830`: none open at start.
- `#852` (`q-mp-359` queens-guards harness) — orthogonal; left open.
- `#832` wave 10 — board-a11y / storage / router — hosts disjoint; left open.
- Wave 11 undrafted `q-mp-350` — offline / timeout / coord-map; disjoint.
- Characterization tickets `q-mp-376` (player-colors) and `q-mp-383`
  (seat-labels + die-faces) run in parallel — this wave uses **separate**
  `mutation-ui12-*.test.ts` files only.

## Harness

1. **Stryker probe:** same failure mode as waves 1–10 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-12/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-12/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap preferring
   `mutation-ui12` / module-precise import needles
   (`ui/player-colors`, `ui/game-error-boundary`, `ui/die-faces`).

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-12/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-12/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui12 \
  --json=docs/dev/mutation-audit-ui-12-baseline.json

# After (with tests/unit/mutation-ui12-*.test.ts)
node node_modules/.cache/mutation-ui-12/mutation-report-ui.mjs \
  --modules=src/ui/player-colors.ts,src/ui/game-error-boundary.ts,src/ui/die-faces.ts \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-12-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                      |   Score % | Notes                                                             |
| --------------------------- | --------: | ----------------------------------------------------------------- |
| `ui/player-colors.ts`       | **100.0** | all 12 mutants already killed (wave-4 saturation holds)           |
| `ui/game-error-boundary.ts` |  **62.5** | same 3 equivalent survivors as wave 1 (`\|\|→&&`, `active` flips) |
| `ui/die-faces.ts`           | **100.0** | all 5 mutants already killed (wave-2 saturation holds)            |

## Before → after (score %)

| Module                      | Before % |   After % | Δ pp | Killed after |
| --------------------------- | -------: | --------: | ---: | -----------: |
| `ui/player-colors.ts`       |    100.0 | **100.0** |  0.0 |        12/12 |
| `ui/game-error-boundary.ts` |     62.5 |  **62.5** |  0.0 |          5/8 |
| `ui/die-faces.ts`           |    100.0 | **100.0** |  0.0 |          5/5 |

First-20 windows for player-colors / die-faces were already saturated
(remeasured + structural re-pins). game-error-boundary residual survivors are
observationally equivalent under the public API (documented + `it.skip` pin).

JSON artifacts: `docs/dev/mutation-audit-ui-12-baseline.json`,
`docs/dev/mutation-audit-ui-12-after.json`.

## Remaining survivors (not product bugs)

| Module                | Survivor                                      | Reason                                                                   |
| --------------------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| `game-error-boundary` | L94 `!active \|\| didCatch` → `&&`            | Listeners always removed with the flag; not observable via window events |
| `game-error-boundary` | L98 `active = false` → `true` (in `show`)     | `removeListeners()` already ran; second catch cannot re-enter            |
| `game-error-boundary` | L145 `active = false` → `true` (in `dispose`) | `dispose` still removes listeners; events never reach `show`             |

Pinned `it.skip` in `tests/unit/mutation-ui12-game-error-boundary.test.ts`
(and historically in `mutation-ui-game-error-boundary.test.ts`).

No production defects confirmed.

## New tests

All new files (did **not** edit wave 1–10 suites; separate from `376` / `383`):

- `tests/unit/mutation-ui12-player-colors.test.ts`
- `tests/unit/mutation-ui12-game-error-boundary.test.ts`
- `tests/unit/mutation-ui12-die-faces.test.ts`

Rules: no player-facing copy assertions; hard-coded role / dataset / hex-color /
glyph / boolean expectations so equality / logical / boolean mutants stay
detectable.

## Overlap

- **#579 / wave 1** — game-error-boundary among hosts (62.5% residue remeasured)
- **#584 / wave 2** — die-faces raised to 100% (remeasured; still 100%)
- **#668 / wave 4** — player-colors already 100% at baseline (remeasured)
- **#832 / wave 10** — board-a11y / storage / router — hosts disjoint
- **`q-mp-350` wave 11** — offline / timeout / coord-map — undrafted; disjoint
- **`q-mp-376` / `q-mp-383`** — characterization tickets; separate test files
