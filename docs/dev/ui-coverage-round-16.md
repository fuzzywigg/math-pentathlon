# UI coverage round 16 (`q-mp-295`)

Characterization tests for residual **branch / lifecycle** arms under
`src/ui/owl` after round 9 + the layout-read cut (`q-mp-197`).

**Base:** `cursor/mp-tip-post755` @ `02af5c56`. Draft only — tip owner folds.

## Scope

Included: mouse secondary-button ignore; minimized-handle drag + post-drag
expand skip; zero-size rect → 64px cache; pointercancel without capture;
reduced-motion coast snap; horizontal edge clamp; resting eye-center path;
docked eye-center cache hit; minimized eye skip + resize invalidate;
bounce-timer re-click + destroy cancels pending eye rAF; destroy mid-coast;
ResizeObserver absent / empty entry / contentRect / borderBoxSize arms;
`innerWidth`/`innerHeight` zero fallbacks on reduced-motion coast.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms untouched),
`rules.ts` / scoring, player-facing copy body asserts, product `src/` edits.

## Overlap with open drafts

| Draft                          | Action                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------- |
| #715 q-mp-196 UI cov r9 owl    | Contained on tip (`burn-1009-ui-cov-r9-owl.test.ts`); leave open with `contained` |
| #795 q-mp-270 UI cov r15 three | Orthogonal — not edited                                                           |
| #723 q-mp-197 owl layout reads | Already on tip; r16 covers post-cut branch residuals                              |

## Metrics

Measured with `npm run test:unit:coverage` then `npm run report:coverage-map`.

| Metric                    | Before (tip map `2026-10-09T18:44:58Z`) |      After |             Δ |
| ------------------------- | --------------------------------------: | ---------: | ------------: |
| **`src/ui/owl` lines**    |                              **91.88%** | **96.07%** |  **+4.19 pp** |
| **`src/ui/owl` branches** |                              **73.87%** | **84.42%** | **+10.55 pp** |

Acceptance (≥+2 pp directory branches) **met**.

| File                          | After lines | After branches |
| ----------------------------- | ----------: | -------------: |
| `src/ui/owl/owl-component.ts` |      96.07% |         84.42% |
| `src/ui/owl/index.ts`         |        100% |           100% |

## Tests added

- `tests/unit/burn-1010-ui-cov-r16-owl-branches.test.ts`

## Constraints honored

- Tests-only (+ short round doc; coverage-map regenerated after measure)
- No AI / rules / copy / Hex Hard / product `src/` edits
- No new copy-string asserts
