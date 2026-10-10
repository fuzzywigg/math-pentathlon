# Mutation audit — UI / shell wave 17 (q-mp-507)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 15 (`docs/dev/mutation-audit-ui-15.md`) and open wave 16 draft
`#957` / `q-mp-478` (owl-component / graph-ui / pwa-register — not yet on tip).
This wave remeasures preferred disjoint hosts: `game-shell`, `highlight-ui`,
and `storage/sanitize`.

Remeasured on tip `cursor/mp-tip-post914` @ `e43a25d2` (hosts unchanged through
later tip folds to `f5d3d04a`). Spec LOC (**638** / **346** / **254**) match live
tip. Wave 7 game-shell after **75%** and wave 1 sanitize after **100%** are the
prior-wave stamps; highlight-ui had no prior mutation wave.

## Scope

**In (this wave):**
`src/ui/components/game-shell.ts`,
`src/core/alignment/highlight-ui.ts`,
`src/core/storage/sanitize.ts` (tests only — kill clear survivors / structural
re-pins; no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Wave 16 hosts (owl-component / graph-ui / pwa-register)
are not repeated. No board-3d layout product edits.

**Overlap avoided:**

- Open `#957` (`q-mp-478` mutation UI w16) — owl / graph-ui / register; hosts
  disjoint; left open.
- Open `#966` (`q-mp-503` highlight-ui soft-fail char) / `#964` (`q-mp-504`
  sanitize soft-fail char) — separate `q-mp-503-*` / `q-mp-504-*` files; this
  wave uses `mutation-ui17-*.test.ts` only (coordinate-by-avoidance).
- Open `#933` (`q-mp-457` mutation UI w15) — security-headers / hex-svg /
  dom-security; hosts disjoint; left open.
- Wave 7 (`#774` / game-shell) / wave 1 (sanitize) — intentional first-20
  remeasure + wave-17 kill / re-pins; did not edit those suites.

## Harness

1. **Stryker probe:** same failure mode as waves 1–16 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-17/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-17/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap; **wave-prefix
   suites outrank basename substring hits** only when they also import /
   name-match the host. Hold-path AI/bench/rules suites excluded unless they
   import the host.

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-17/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-17/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui17 \
  --prefer-prefix=mutation-ui17 \
  --json=docs/dev/mutation-audit-ui-17-baseline.json

# After (with tests/unit/mutation-ui17-*.test.ts)
node node_modules/.cache/mutation-ui-17/mutation-report-ui.mjs \
  --modules=src/ui/components/game-shell.ts,src/core/alignment/highlight-ui.ts,src/core/storage/sanitize.ts \
  --max=20 --timeout=90000 \
  --prefer-prefix=mutation-ui17 \
  --json=docs/dev/mutation-audit-ui-17-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                           |   Score % | Notes                                                                 |
| -------------------------------- | --------: | --------------------------------------------------------------------- |
| `ui/components/game-shell.ts`    |  **85.0** | up from wave-7 after **75%**; 3 `isDisplayedWithin` OR equivalents    |
| `core/alignment/highlight-ui.ts` |  **10.0** | first mutation wave; strokeWidth / threat+path animate / overlay math |
| `core/storage/sanitize.ts`       | **100.0** | wave-1 hold (first-20 still saturated)                                |

## Before → after (score %)

| Module                           | Before % |   After % |  Δ pp | Killed after |
| -------------------------------- | -------: | --------: | ----: | -----------: |
| `ui/components/game-shell.ts`    |     85.0 |  **85.0** |   0.0 |        17/20 |
| `core/alignment/highlight-ui.ts` |     10.0 | **100.0** | +90.0 |        20/20 |
| `core/storage/sanitize.ts`       |    100.0 | **100.0** |   0.0 |        20/20 |

**1 module** with a measurably higher first-20 score (highlight-ui). Game-shell
remains at the post914 hold with three documented equivalent survivors.
Sanitize stays saturated under prefer-prefix re-pins.

JSON artifacts: `docs/dev/mutation-audit-ui-17-baseline.json`,
`docs/dev/mutation-audit-ui-17-after.json`.

## Remaining survivors (not product bugs)

| Module       | Survivor                                                               | Reason                                                                                                                                                                                      |
| ------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `game-shell` | L109 `\|\|` → `&&` (×2) + L113 `false` → `true` in `isDisplayedWithin` | `getModalFocusables` pre-filters with `isKeyboardReachable`, which already rejects class-hidden / `hidden` / `inert` — matching OR arms are dead under exercised modal paths (wave-7 hold). |

Pinned `it.skip` in `tests/unit/mutation-ui17-game-shell.test.ts`.

No production defects confirmed. No `src/` product edits.

## New tests

All new files (did **not** edit wave 1–16 suites or open `#966`/`#964` chars):

- `tests/unit/mutation-ui17-game-shell.test.ts`
- `tests/unit/mutation-ui17-highlight-ui.test.ts`
- `tests/unit/mutation-ui17-storage-sanitize.test.ts`

Rules: no player-facing copy assertions; no AI move/timing policy asserts;
hard-coded numeric / boolean / DOM-shape expectations so equality / logical /
boolean / numeric mutants stay detectable. Highlight suite pins catalog
`strokeWidth` / threat+path `animate` and overlay center arithmetic
(`x - width/2`, `y - height/2`). Sanitize suite re-pins the first-20 window
(exported max lengths, plain-object gates, non-negative int / non-string
rejects). Game-shell suite re-pins `isKeyboardReachable` + modal Tab trap and
documents the three equivalent `isDisplayedWithin` survivors.

## Overlap

- **#774 / wave 7** — game-shell among hosts (65 → 75; remeasured here at 85 hold)
- **wave 1** — sanitize 35 → 100 (still 100% first-20)
- **#957 / wave 16** — owl / graph-ui / register — hosts disjoint
- **#933 / wave 15** — security-headers / hex-svg / dom-security — hosts disjoint
- **#966 / #964** — soft-fail characterization on highlight-ui / sanitize —
  orthogonal file names; not edited here
