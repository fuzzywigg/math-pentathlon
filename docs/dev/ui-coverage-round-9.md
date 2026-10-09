# UI coverage round 9 (`q-mp-196`)

Characterization tests for the coldest **non-AI, non-`rules.ts`** directory
after round 8 (`src/ui/three`): residual arms under `src/ui/owl`.

**Base:** `cursor/mp-tip-post700` @ `cd33f89d`. Draft only — tip owner folds.

## Scope

Included: owl-component pointer steal / foreign pointerId / capture+release
throw paths / missing `elementFromPoint` / zero-velocity rest / vertical edge
clamp coast / mood class matrix / same-message `textContent` rewrite skip /
reduced-motion click+pupil skip / destroy clears click bounce timer / index
barrel re-export.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms untouched),
`rules.ts` / scoring, player-facing copy body asserts, product `src/` edits.
Avoids overlap with open #699 (r8 three).

## Overlap with open drafts

| Draft | Action |
|-------|--------|
| #699 UI cov r8 three | Orthogonal — not edited |
| #686 UI cov r7 | Already on tip; residuals only |
| #648 UI cov r6 | Already on tip; residuals only |

## Per-directory before → after

Measured with `npm run test:unit:coverage` on tip `cd33f89d` (map stamp
`2026-10-09T15:46:21Z`) and this branch (map stamp `2026-10-09T16:57:45Z`).

| Directory | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
|------|-------------:|----------------:|------------:|---------------:|-------------:|----------------:|
| `src/ui/owl` | 92.93% | 76.51% | 96.46% | 83.89% | **+3.53** | **+7.38** |

| File | After lines | After branches |
|------|------------:|---------------:|
| `src/ui/owl/owl-component.ts` | 96.46% | 83.89% |
| `src/ui/owl/index.ts` | 100% | 100% |

Acceptance (≥+2 pp directory lines) **met**.

## Overall (repo-wide unit coverage)

| Metric | After (this branch) |
|--------|--------------------:|
| **Lines** | **94.72%** (22309/23551) |
| **Branches** | **87.30%** (11015/12616) |
| Statements | 94.44% |
| Functions | 95.25% |

## Tests added

- `tests/unit/burn-1009-ui-cov-r9-owl.test.ts`

## Verification

```text
npx vitest run --project unit-shared tests/unit/burn-1009-ui-cov-r9-owl.test.ts
# Test Files  1 passed; Tests  12 passed; EXIT 0

npm run test:unit:coverage
# EXIT 0; src/ui/owl lines 92.93%→96.46%, branches 76.51%→83.89%

npm run report:coverage-map
# EXIT 0; rewrote docs/dev/coverage-map.md + .svg
```

## Constraints honored

- Tests-only (+ regenerated coverage-map + this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed pointer capture; no network)
- No player-facing copy body asserts (mood class / message length / mood id only)
