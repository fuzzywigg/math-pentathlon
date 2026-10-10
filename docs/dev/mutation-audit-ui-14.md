# Mutation audit — UI / shell wave 14 (q-mp-429)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 12 (`docs/dev/mutation-audit-ui-12.md`). Wave 13 is open draft
`#896` (`q-mp-402`; report not yet on tip). This wave remeasures residual hosts
disjoint from wave 13’s pointer-hygiene claim: `stats-dashboard`, `storage`, and
`router`.

Remeasured on tip `cursor/mp-tip-post865` @ `7f8a7147` (baseline measurement SHA;
unit-file count **3211** then / **3216** after tip folds + this wave; knip unusedTypes tip note **35**). Spec preferred
`pointer-hygiene` as a third host — swapped to `router` because open `#896`
(`q-mp-402` wave 13) still owns pointer-hygiene for mutation scores.

## Scope

**In (this wave):**
`src/ui/stats-dashboard.ts`,
`src/core/storage/storage.ts`,
`src/core/router.ts` (tests only — kill clear survivors / structural re-pins;
no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Wave 13 hosts (idle-warm / reduced-motion /
pointer-hygiene) are not repeated.

**Overlap avoided:**

- Open `#896` (`q-mp-402` mutation UI w13) — pointer-hygiene / idle-warm /
  reduced-motion; third host swapped to `router`; left open.
- Parallel undrafted `q-mp-423` (void clear in `pointer-hygiene.ts`) — not
  touched (tests-only; different host).
- Parallel undrafted `q-mp-420` (storage soft-fail characterization) /
  `q-mp-422` (router characterization) — separate `mutation-ui14-*.test.ts`
  files only; left for those owners.
- Open `#806` (`q-mp-307` stats-dashboard char on older tip) — orthogonal
  characterization; tip already has `q-mp-307-stats-dashboard-residuals.test.ts`;
  this wave does not edit it.
- Waves 10–12 hosts — board-a11y / safe-web-storage / router remeasure is
  intentional for router saturation; storage here is `storage/storage.ts`
  (wave-1 residual), not `safe-web-storage.ts`.

## Harness

1. **Stryker probe:** same failure mode as waves 1–13 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-14/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-14/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap; **wave-prefix
   suites outrank basename substring hits** (so `mutation-ui14-storage` is not
   crowded out by `burn-wave*storage*`).

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-14/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-14/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui14 \
  --prefer-prefix=mutation-ui14 \
  --json=docs/dev/mutation-audit-ui-14-baseline.json

# After (with tests/unit/mutation-ui14-*.test.ts)
node node_modules/.cache/mutation-ui-14/mutation-report-ui.mjs \
  --modules=src/ui/stats-dashboard.ts,src/core/storage/storage.ts,src/core/router.ts \
  --max=20 --timeout=90000 \
  --prefer-prefix=mutation-ui14 \
  --json=docs/dev/mutation-audit-ui-14-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                    |   Score % | Notes                                                                   |
| ------------------------- | --------: | ----------------------------------------------------------------------- |
| `ui/stats-dashboard.ts`   |  **80.0** | up from wave-3 **75%**; 4 survivors (3 equivalent + hours-divisor)      |
| `core/storage/storage.ts` |  **55.0** | wave-1 residual first-20; cross-tab / `=== true` flag sync under-tested |
| `core/router.ts`          | **100.0** | all 11 mutants already killed (wave-10 / wave-1 hold)                   |

## Before → after (score %)

| Module                    | Before % |   After % |  Δ pp | Killed after |
| ------------------------- | -------: | --------: | ----: | -----------: |
| `ui/stats-dashboard.ts`   |     80.0 |  **85.0** |  +5.0 |        17/20 |
| `core/storage/storage.ts` |     55.0 |  **85.0** | +30.0 |        17/20 |
| `core/router.ts`          |    100.0 | **100.0** |   0.0 |        11/11 |

**2 modules** with measurably higher scores (stats-dashboard, storage). Router
first-20 window was already saturated (remeasured + structural re-pins).

JSON artifacts: `docs/dev/mutation-audit-ui-14-baseline.json`,
`docs/dev/mutation-audit-ui-14-after.json`.

## Remaining survivors (not product bugs)

| Module            | Survivor                                                  | Reason                                                                                       |
| ----------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `stats-dashboard` | L42 `ms <= 0` → `<`; numeric `0 → 1`                      | Non-positive and tiny positive ms both floor to `0 min`. Pinned `it.skip`.                   |
| `stats-dashboard` | L60 `rate <= 0` → `<`                                     | `rate === 0` still formats as `0%` via `Math.round`. Pinned `it.skip`.                       |
| `storage`         | L48 constructor `reducedMotion === true` / `true → false` | Needs fresh module graph; `resetAll`/`updateSettings` re-sync via later unmutated lines.     |
| `storage`         | L108 load() `!read.ok` remove `!`                         | Constructor `load()` path needs remount + blocked storage; not observable on live singleton. |

Pinned `it.skip` in `tests/unit/mutation-ui14-stats-dashboard.test.ts` and
`tests/unit/mutation-ui14-storage.test.ts`.

No production defects confirmed.

## New tests

All new files (did **not** edit wave 1–13 suites; separate from `420` / `422` /
`307`):

- `tests/unit/mutation-ui14-stats-dashboard.test.ts`
- `tests/unit/mutation-ui14-storage.test.ts`
- `tests/unit/mutation-ui14-router.test.ts`

Rules: no player-facing copy assertions; hard-coded role / dataset / numeric /
boolean expectations so equality / logical / boolean / numeric mutants stay
detectable.

## Overlap

- **#579 / wave 1** — storage among hosts (65% after; first-20 residual here)
- **#654 / wave 3** — stats-dashboard 50 → 75 (remeasured 80 → 85)
- **#832 / wave 10** — board-a11y / safe-web-storage / router (router still 100%)
- **#896 / wave 13** — idle-warm / reduced-motion / pointer-hygiene — hosts
  disjoint (router substituted for pointer-hygiene)
- **`q-mp-420` / `q-mp-422` / `q-mp-423`** — parallel; separate files / no `src/`
