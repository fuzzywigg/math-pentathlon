# q-mp-571 — attribute-ui soft-fail residuals (tests-only)

Characterization for `src/core/attributes/attribute-ui.ts` soft-fail residuals
after tip-folded `#403` / engine r12 / `#1002` (engine r19). Structural asserts
only — no player-facing copy / aria pins. No `src/` edits. No ratchet JSON.

## Live tip re-measure (`cursor/mp-tip-post1012` @ `dcdc0bf4`)

| Metric                                              | Value                                      |
| --------------------------------------------------- | ------------------------------------------ |
| LOC                                                 | **542** (matches backlog stamp)            |
| Files mentioning `attribute-ui`                     | **37** (backlog “35 test-name matches”)    |
| Files importing `attributes/attribute-ui`           | **31**                                     |
| Dedicated soft-fail residual suites before this PR  | **1** (`q-mp-403`)                         |
| Branch coverage (focused include; tip-folded r19)   | **100%** (saturated — contract ownership)  |

## Overlap / leave alone

| Prior owner                                         | Action                                      |
| --------------------------------------------------- | ------------------------------------------- |
| Tip-folded `#1002` / `q-mp-547` SET `''` + leave    | **Do not duplicate** — source keep-sites only |
| Tip-folded `#893` / `q-mp-403` empty-def / sparse   | Leave — this suite owns absent/null / claimed-id |
| Tip-folded engine r12 missing-attr / glossy / hover | Leave                                       |
| Undrafted `q-mp-466` attributes/logic nnnull        | Leave **contained**                         |
| Mutation `569` host coordination                    | Tests-only soft-fail residuals here         |

## Residuals owned here

- Source keep-sites for `||` quartet, undefined-continue, color/includes bg,
  shape/shading defaults, inject skip, selected enter/leave guards
- Absent-attr SET soft-defaults (undefined keys — not `#1002` empty strings)
- `number: null` falsy soft-default; absent shading → solid
- colorMap-miss raw stroke under empty/striped; no-colorMap leave `#e0e0e0`
- Non-hex contrast soft-parse → light text fill
- Primary-present / value-absent String coerce (structural; no copy body pin)
- Claimed-id inject soft-skip; reduced-motion selector keep-sites
- Default empty `selectedIds` shell; square empty-attrs below-label soft-fail

## Tests

`tests/unit/q-mp-571-attribute-ui-soft-fail-residuals.test.ts`. Default
`unit-shared` discovery — not registered in `vitest.config.ts`.
