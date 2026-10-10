# q-mp-572 — ollie-inspect-map soft-fail residuals (tests-only)

Characterization for `src/core/owl/ollie-inspect-map.ts` soft-fail residuals
after tip-folded `#1002` / `#1010` / wave40. Structural asserts only — no
player-facing copy / aria pins. No `src/` edits. No ratchet JSON. No nullish
ceiling write (leave undrafted `q-mp-357`).

## Live tip re-measure (`cursor/mp-tip-post1012` @ `ed034b44`)

| Metric                                             | Value                                                          |
| -------------------------------------------------- | -------------------------------------------------------------- |
| LOC                                                | **180** (matches backlog stamp)                                |
| Dedicated `*ollie*` unit files before this PR      | **5** (backlog “3 test-name matches” stale after `#1010`)      |
| Dedicated soft-fail residual suites before this PR | **0**                                                          |
| Overlay nullish residual                           | **2** (`data-player \|\| 'unknown'` ×2 — untouched)            |
| Branch coverage (focused include)                  | **97.05%** (66/68; `never` defaults only — contract ownership) |

## Overlap / leave alone

| Prior owner                                                | Action                                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| Tip-folded `#1010` / `q-mp-548` finite-pair + piece `\|\|` | **Do not re-add** those pins                                             |
| Tip-folded `#1002` / `q-mp-547` empty-shape / omit player  | Leave — this suite owns empty-string / selector miss                     |
| Wave40 chrome / priority / stub-speech                     | Leave — this suite owns tutorial-in-row / back-in-header / row-in-header |
| Undrafted `q-mp-357` nullish ollie clear                   | Leave **contained**                                                      |
| Mutation `569` / engine `568` host coordination            | Tests-only soft-fail residuals here                                      |

## Residuals owned here

- Source keep-sites for nullish `||` pair, truthy shape/nodeId gates, finite
  pair gates, chrome closest order, exhaustive `never` arms
- Star-space empty-string `data-player` → `unknown` (orthogonal to `#1002` omit)
- Star-piece missing `data-player` attr → selector soft-miss → `unknown`
- Partial axial / row-col attr soft-miss → `unknown`
- Nested child walk-up (kings / fiar); empty-shape bank wrapping axial cell
  fallthrough-then-cell; finite zero axial soft-accept
- Chrome priority residuals: tutorial-in-row, back-in-header, button-row-in-header
- `inspectDropSpeech` STUB prefix on fallthrough (structural; no copy body pin)

## Tests

`tests/unit/q-mp-572-ollie-inspect-map-soft-fail-residuals.test.ts`. Default
`unit-shared` discovery — not registered in `vitest.config.ts`.
