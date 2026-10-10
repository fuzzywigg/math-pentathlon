# q-mp-403 — attribute-ui soft-fail / empty-board residuals (tests-only)

Characterization for `src/core/attributes/attribute-ui.ts` soft-fail /
empty-board / render edges. Structural asserts only — no player-facing copy
pins. No `src/` edits.

## Overlap

- Tip fold through `#876` / `engine-coverage-round-12` — pins missing-attr
  `continue`, glossy shading default, `custom`→card, hover borders (orthogonal;
  this suite owns remaining branch residuals).
- `#814` / wave 9 mutation pins — mutation arithmetic (orthogonal).
- Open `#877` owl void brace / `#878` hex UI cov r25 — disjoint hosts.
- No open draft into `cursor/mp-tip-post865` owns attribute-ui characterization.

## Live tip re-measure (`cursor/mp-tip-post865` @ `3908809d`)

Focused suite (`*attribute*` / `*attr-ui*` / mutation-ui9 / engine r12 /
overnight-wave54 attr / burn attr-ui hosts) **before** this PR:

| Metric     | Before         |
| ---------- | -------------- |
| Statements | 100% (236/236) |
| Branches   | 95.71% (67/70) |
| Lines      | 100% (235/235) |
| Functions  | 100% (13/13)   |

Uncovered branch residuals (v8):

| Line | Arm                              | Meaning                                      |
| ---- | -------------------------------- | -------------------------------------------- |
| L132 | `if (value !== undefined)` false | Secondary below-label skip when attr missing |
| L167 | `if (primaryAttr)` false         | Circle + empty definitions                   |
| L204 | `if (primaryAttr)` false         | Square + empty definitions                   |

## After this PR (same focused include)

| Metric     | Before         | After            | Δ           |
| ---------- | -------------- | ---------------- | ----------- |
| Statements | 100% (236/236) | **100%**         | 0           |
| Branches   | 95.71% (67/70) | **100%** (70/70) | **+4.29pp** |
| Lines      | 100% (235/235) | **100%**         | 0           |
| Functions  | 100%           | 100%             | 0           |

Residuals closed: empty-def circle/square soft-fail; sparse secondary label skip;
plus empty-board / SET soft-default / shapeColor / inject idempotent edges.

## Tests

`tests/unit/q-mp-403-attribute-ui-residuals.test.ts` (9 cases). Default
`unit-shared` discovery — not registered in `vitest.config.ts`.
