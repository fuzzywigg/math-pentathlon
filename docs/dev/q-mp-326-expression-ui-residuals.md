# q-mp-326 — expression-ui soft-fail residuals (tests-only)

Characterization for `src/core/expressions/expression-ui.ts` soft-fail /
enable-disable / render edges. Structural asserts only — no player-facing copy
pins. No `src/` edits.

## Overlap

- `#778` / tip `mutation-ui8-expression-ui` — SVG text-centering mutation pins
  (orthogonal).
- `#814` wave 9 — attribute / fraction / dice hosts (disjoint).
- Void/nnnull product clears stay with `#799` / `q-mp-283`.

## Coverage (`expression-ui.ts`, focused `*expression*` / `*expr-ui*` /

`mutation-ui8-expression*` suite)

| Metric     | Before           | After              | Δ       |
| ---------- | ---------------- | ------------------ | ------- |
| Statements | 99.14% (232/234) | **100%** (234/234) | +0.86pp |
| Branches   | 95.83% (92/96)   | **100%** (96/96)   | +4.17pp |
| Lines      | 99.13% (229/231) | **100%** (231/231) | +0.87pp |
| Functions  | 100%             | 100%               | 0       |

Residuals closed: L481–482 empty-build neutral chrome; empty `errors[0]`
invalid fallback; empty-slot soft no-op; `getResult` `?? null` when evaluate
succeeds without value; locked/draggable/usedIds enable-disable edges.

## Tests

`tests/unit/q-mp-326-expression-ui-residuals.test.ts` (11 cases). Not registered
in `vitest.config.ts` (default `unit-shared`).
