# Mutation audit — UI / shell wave 20 (q-mp-569)

Tests-only mutation measurement continuing wave 1 (`docs/dev/mutation-audit-ui.md`)
through wave 19 (`docs/dev/mutation-audit-ui-19.md`). This wave remeasures preferred
hosts: `attribute-ui` (primary; not claimed by waves 18–19), plus residual
remeasure of `expression-ui` / `ollie-inspect-map` after wave 19 folded via
`#1010` / tip fold `#1012`.

Remeasured on tip `cursor/mp-tip-post1012` @ `ed034b44` (hosts unchanged from
`dcdc0bf4` fold base). Live LOC **542** / **815** / **180**. Prior stamps:
attribute-ui wave-9 after **100%**; expression-ui wave-19 after **95%** (L18
hold); ollie-inspect-map wave-19 after **100%**.

## Scope

**In (this wave):**
`src/core/attributes/attribute-ui.ts`,
`src/core/expressions/expression-ui.ts`,
`src/core/owl/ollie-inspect-map.ts` (tests only — kill clear survivors /
structural re-pins; no `src/` edits).

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy,
player-facing string assertions, AI move choice / timing.
No `src/` product edits. Wave 18 hosts (dice-selector / board-a11y /
pointer-hygiene) and wave 19 primary mounts host are not repeated. No board-3d
layout product edits. No nnnull expression-ui product clear (undrafted `396`).

**Overlap avoided:**

- Open `#1025` (`q-mp-571` attribute-ui soft-fail) / `#1027` (`q-mp-570`
  expression-ui DISPLAY soft-fail) / `#1029` (`q-mp-572` ollie soft-fail) —
  separate `q-mp-57*` files; this wave uses `mutation-ui20-*.test.ts` only and
  stays on happy-path / first-20 pins (coordinate-by-avoidance).
- Wave 18 (`#987`/`527`) — hosts disjoint; left open.
- Wave 19 (`#1010`/`548`) — folded into alpha; expression/ollie intentionally
  remasured here under wave-20 prefer-prefix; did not edit those suites.

## Harness

1. **Stryker probe:** same failure mode as waves 1–19 (npx sandbox / mutate-file
   filter). **Not adopted.**

2. **Ephemeral AST harness (used for scores):**
   `node_modules/.cache/mutation-ui-20/mutation-report-ui.mjs` (not committed;
   also under `/tmp/mutation-ui-20/`). Same operators as committed
   `scripts/mutation-report.mjs` (comparison/equality, arithmetic, logical,
   boolean literals, unary `!`, integer ±1 with `|v| ≤ 64`). Cap `--max=20`
   per module. Import-aware test discovery with a 35-file cap; **wave-prefix
   suites outrank basename substring hits** only when they also import /
   name-match the host. Hold-path AI/bench/rules suites excluded unless they
   import the host.

Exact commands:

```bash
# Baseline (existing tests only)
node node_modules/.cache/mutation-ui-20/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui-20/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --exclude-tests=mutation-ui20 \
  --prefer-prefix=mutation-ui20 \
  --json=docs/dev/mutation-audit-ui-20-baseline.json

# After (with tests/unit/mutation-ui20-*.test.ts)
node node_modules/.cache/mutation-ui-20/mutation-report-ui.mjs \
  --modules=src/core/attributes/attribute-ui.ts,src/core/expressions/expression-ui.ts,src/core/owl/ollie-inspect-map.ts \
  --max=20 --timeout=90000 \
  --prefer-prefix=mutation-ui20 \
  --json=docs/dev/mutation-audit-ui-20-after.json
```

Nothing added to `package.json`, lockfile, or CI.

### Fresh baseline (selected modules)

| Module                              |   Score % | Notes                                                     |
| ----------------------------------- | --------: | --------------------------------------------------------- |
| `core/attributes/attribute-ui.ts`   | **100.0** | wave-9 hold (first-20 still saturated)                    |
| `core/expressions/expression-ui.ts` |  **95.0** | same L18 `stylesInjected false→true` hold as waves 8 / 19 |
| `core/owl/ollie-inspect-map.ts`     | **100.0** | wave-19 hold (all 6 available mutants killed)             |

## Before → after (score %)

| Module                              | Before % |   After % | Δ pp | Killed after |
| ----------------------------------- | -------: | --------: | ---: | -----------: |
| `core/attributes/attribute-ui.ts`   |    100.0 | **100.0** |  0.0 |        20/20 |
| `core/expressions/expression-ui.ts` |     95.0 |  **95.0** |  0.0 |        19/20 |
| `core/owl/ollie-inspect-map.ts`     |    100.0 | **100.0** |  0.0 |          6/6 |

**0 modules** with a higher first-20 score (all three already at prior-wave hold /
documented equivalent survivor). Wave 20 commits structural re-pins + survivor
documentation so the trio stays covered under `mutation-ui20-*` prefer-prefix.
Primary host `attribute-ui` was the densest residual named in the backlog after
w19 claimed expression/ollie.

JSON artifacts: `docs/dev/mutation-audit-ui-20-baseline.json`,
`docs/dev/mutation-audit-ui-20-after.json`.

## Remaining survivors (not product bugs)

| Module       | Survivor                        | Reason                                                                                       |
| ------------ | ------------------------------- | -------------------------------------------------------------------------------------------- |
| `expression` | L18 `stylesInjected false→true` | Module flag + `tests/unit/setup.ts` clearing head styles each test → style-count pins flake. |

Pinned `it.skip` in `mutation-ui20-expression-ui.test.ts` (**dropped on tip fold** — wave-19 re-pin)`.

No production defects confirmed. No `src/` product edits.

## New tests

All new files (did **not** edit wave 1–19 suites or open `#1025`/`#1027`/`#1029` chars):

- `tests/unit/mutation-ui20-attribute-ui.test.ts`
- `mutation-ui20-expression-ui.test.ts` (**dropped on tip fold** — wave-19 re-pin)`
- `mutation-ui20-ollie-inspect-map.test.ts` (**dropped on tip fold** — #1002/#1010 re-pin)`

Rules: no player-facing copy / aria-label / stub-narration string assertions; no
AI move/timing policy asserts; hard-coded numeric / boolean / DOM-shape /
`resolveInspectTarget` kind expectations so equality / logical / boolean /
numeric mutants stay detectable. Attribute suite re-pins DEFAULT `showLabels`,
viewBox/height label-bump gates, card inset `size-4` / `rx`, color-name fill,
and missing-attr continue. Expression suite re-pins SVG defaults/centering,
`draggable`, slot drop/click gates. Ollie suite re-pins null guard, finite-pair
`&&` gates, and empty-player `||` fallbacks via structural kind asserts only.

## Overlap

- **#814 / wave 9** — attribute-ui among hosts (100% after; hold here)
- **#1010 / wave 19** — expression-ui / ollie-inspect-map (95% / 100%; hold here)
- **#987 / wave 18** — dice-selector / board-a11y / pointer-hygiene — hosts
  disjoint; left open
- Soft-fail chars `#1025` / `#1027` / `#1029` — orthogonal filenames; not edited
  here

## Tip-fold note (q-mp-026q)
On tip fold into `cursor/mp-tip-post1012`, dropped `mutation-ui20-expression-ui.test.ts` and `mutation-ui20-ollie-inspect-map.test.ts` as re-pins of wave-19 / tip-folded `#1002`/`#1010` (including the star-space L65 pin previously deduped). Kept `mutation-ui20-attribute-ui.test.ts` + audit JSON/docs.
