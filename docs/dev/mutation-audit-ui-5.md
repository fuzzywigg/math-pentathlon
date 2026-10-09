# Mutation audit — UI / shell wave 5 (q-mp-202)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`),
wave 2 (`docs/dev/mutation-audit-ui-2.md`), wave 3 (`docs/dev/mutation-audit-ui-3.md`),
and wave 4 (`docs/dev/mutation-audit-ui-4.md`). This wave covers modules **deferred**
in wave 4 (`dice-ui` / `roller`) plus coldest non-three UI dir `src/ui/owl`
(`owl-component.ts`; see also open coverage draft **#715** / `q-mp-196`).

## Scope

**In (this wave):**
`src/core/dice/dice-ui.ts`,
`src/core/dice/roller.ts`,
`src/ui/owl/owl-component.ts`.

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Waves 1–4 modules are not repeated.

**Overlap avoided:**
- Open **#668** (`q-mp-144` wave 4) — already present on tip `cursor/mp-tip-post709`
  (tests + `docs/dev/mutation-audit-ui-4*`); this wave does not retarget those modules.
- Open **#715** (`q-mp-196` owl coverage) — coverage characterization + coverage-map;
  this wave is mutation scores + `mutation-ui5-*` suites only (orthogonal).

## Harness

1. **Stryker probe:** same failure mode as waves 1–4 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-5/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-5/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery (avoids wave-3 roller false-zero).

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-5/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-5/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-5-baseline.json

# After (with tests/unit/mutation-ui5-*.test.ts)
node node_modules/.cache/mutation-ui-5/mutation-report-ui.mjs \
  --modules=src/core/dice/dice-ui.ts,src/core/dice/roller.ts,src/ui/owl/owl-component.ts \
  --max=20 --timeout=90000 \
  --json=docs/dev/mutation-audit-ui-5-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                     |  Score % | Notes                                      |
| -------------------------- | -------: | ------------------------------------------ |
| `core/dice/dice-ui.ts`     | **65.0** | matches wave-4 deferred rank               |
| `core/dice/roller.ts`      | **75.0** | matches wave-4 deferred rank               |
| `ui/owl/owl-component.ts`  | **20.0** | coldest first-20 window (field inits)      |

## Before → after (score %)

| Module                     | Before % |   After % |  Δ pp |  Killed after |
| -------------------------- | -------: | --------: | ----: | ------------: |
| `core/dice/dice-ui.ts`     |     65.0 |  **85.0** | +20.0 |         17/20 |
| `core/dice/roller.ts`      |     75.0 | **100.0** | +25.0 |         20/20 |
| `ui/owl/owl-component.ts`  |     20.0 |  **60.0** | +40.0 |         12/20 |

**3 modules** with measurably higher scores (acceptance: ≥2).

JSON artifacts: `docs/dev/mutation-audit-ui-5-baseline.json`,
`docs/dev/mutation-audit-ui-5-after.json`.

## Remaining survivors (not product bugs)

| Module      | Survivor                                              | Reason                                                                                          |
| ----------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `dice-ui`   | L15 `window === undefined \|\|` → `&&` / `===` ↔ `!==` | Under jsdom `window` always exists; matchMedia typeof fence is dead.                            |
| `dice-ui`   | L16 `matchMedia !== 'function'` → `===`               | Same — jsdom always provides a defined `window` object.                                         |
| `owl`       | L26–L35 field inits `0 → 1` (offsets / velocity)      | Overwritten on every `pointerdown` before use; equivalent under exercised paths.                |

No production defects confirmed. Roller first-20 window is fully killed.

## New tests

All new files (did **not** edit wave 1–4 suites or #715 files):

- `tests/unit/mutation-ui5-dice-ui.test.ts`
- `tests/unit/mutation-ui5-roller.test.ts`
- `tests/unit/mutation-ui5-owl-component.test.ts`

Rules: no player-facing copy assertions; no AI move/timing assertions; hard-coded
numeric expectations (`DRAG_THRESHOLD_PX` 5 vs 6, d6 rect `x="5"`, id length `7`,
radix-36 `z`) so const ±1 / boolean mutants are detectable.

## Overlap

- **#579 / wave 1** — router, flags, storage, offline, PWA register, …
- **#584 / wave 2** — hex-svg, die-faces, seat-labels, prefetch, idle-warm, dice-selector, …
- **#654 / wave 3** — route-generation, bootstrap, bootstrap-owl, stats-dashboard
- **#668 / wave 4** — game-selector, compat, tutorial (on tip; deferred dice-ui/roller)
- **#715 / q-mp-196** — owl coverage lines/branches (orthogonal characterization)
