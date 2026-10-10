# UI coverage round 41 (`q-mp-470`)

Characterization tests for residual arms under `src/ui/three` (coldest UI
directory on tip post914). Prefer board-3d update / pointer / dispose /
tablet-gl layout-binder arms. No AI move-choice / timing asserts; no
player-facing copy body asserts; **no** product `src/ui/three/*` layout edits
(`getBoundingClientRect` / `clientWidth` paths stay with layout tickets).

**Base:** `cursor/mp-tip-post914` @ `753052a6`. Draft only — tip owner folds.

## Scope

Included: Prime Gold veins / focus / valid / last mats, chip reuse,
missing-cell arms, placing pointer parent-walk + invalid-value miss,
zero-rect NDC, non-placing / disposed guards, OOB hooks, double
context-lost, parseCssColor catch + null-2d / SRGB label soft paths;
FIAR marked-dot clear + parent-walk + zero-rect; Queens / Kwatro / Star
null hooks; Pent / Hex / Kings post-dispose no-ops; tablet-gl
`visualViewport` + `ResizeObserver` layout binder arms.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, board-3d layout product edits (owned by `#905` /
`#926` / `#440`).

## Overlap with open drafts

| Draft | Action |
| --- | --- |
| `#905` / `#415` board-3d layout-reads inventory (post865) | Contained — docs/layout; leave open |
| `#926` / `#440` board-3d layout inventory (post898) | Contained — docs only; leave open |
| `#921` backlog round 14 | Orthogonal backlog doc; leave open |
| `#935` engine cov r15 (post898) | Orthogonal engine series; leave open |
| `#699` / `#795` prior three UI cov rounds (older tips) | Prior rounds already on tip; leave open |
| No open draft into `cursor/mp-tip-post914` owns three UI r41 | — |

## Metrics

Focused three suite (`tests/unit/mp3d-*` + tablet-gl / soft-fail / loaders)
on tip post914 @ `753052a6`, then with this round’s tests. Same file set
before → after (fair delta). Coverage-map stamp on tip was **94.26%** /
**80.02%** lines/branches (full suite); focused baseline is slightly lower.

| Metric | Before (focused) | After | Δ |
| --- | ---: | ---: | ---: |
| **`src/ui/three` lines** | **94.12%** | **95.90%** | **+1.78 pp** |
| **`src/ui/three` branches** | **79.93%** | **83.10%** | **+3.17 pp** |
| `prime-gold-board-3d.ts` lines | 88.34% | **97.92%** | **+9.58 pp** |
| `prime-gold-board-3d.ts` branches | 65.85% | **86.99%** | **+21.14 pp** |
| `tablet-gl.ts` lines | 95.83% | **99.16%** | **+3.33 pp** |
| layout-read raw `rg` (board-3d + owl) | **31** | **31** | 0 (no product edits) |

Coldest residual after this round: `hex-a-gone-pieces.ts` (88.57% lines) —
defensive empty-polygon / exhaustive-default arms left intentional.

## Tests added

- `tests/unit/mp3d-ui-cov-r41-prime-gold-residuals.test.ts`
- `tests/unit/mp3d-ui-cov-r41-host-residuals.test.ts`
- `tests/unit/mp3d-ui-cov-r41-tablet-gl-layout-residuals.test.ts`

## Verification

```text
npx vitest run --project unit-isolated \
  tests/unit/mp3d-ui-cov-r41-*.test.ts
# Test Files  3 passed; Tests  7 passed; EXIT 0

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

rg -n 'getBoundingClientRect|clientWidth|clientHeight' \
  src/ui/three src/ui/owl/owl-component.ts | wc -l
# 31

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- Deterministic (mocked three.js, stubbed canvas 2d / layout binders; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline / bundle-budget edits
