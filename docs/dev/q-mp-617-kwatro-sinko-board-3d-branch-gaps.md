# q-mp-617 — Close `kwatro-sinko-board-3d` branch gaps

**Base tip:** `cursor/mp-tip-post1012` @ `780db960`  
**Host:** `src/ui/three/kwatro-sinko-board-3d.ts` (**850** LOC)  
**Suite:** `tests/unit/mp3d-kwatro-sinko-board-3d-branch-gaps.test.ts` (tests-only; zero `src/`)

## Open-draft check

| Draft         | Topic                                  | Disposition                   |
| ------------- | -------------------------------------- | ----------------------------- |
| `#1040`/`582` | kwatro board-ui / controller residuals | **contained** (disjoint host) |
| `#835`/`352`  | board-3d layout-read batch (src)       | **contained** (product HOLD)  |
| `#1020`       | backlog r20 inventory                  | **contained**                 |
| `#1041`       | backlog r21 (this ticket source)       | backlog only                  |

No open draft already closed `kwatro-sinko-board-3d` branch gaps.

## Measured coverage (`tests/unit/*kwatro*board*`)

| Metric     |         Before (tip) |                After |             Δ |
| ---------- | -------------------: | -------------------: | ------------: |
| Lines      | **77.11%** (337/437) | **97.94%** (428/437) | **+20.83 pp** |
| Branches   | **67.93%** (125/184) | **94.56%** (174/184) | **+26.63 pp** |
| Statements |     76.68% (342/446) |     97.75% (436/446) |     +21.07 pp |
| Functions  |       83.87% (26/31) |       93.54% (29/31) |      +9.67 pp |

Backlog baseline stamp (77.1%L / 67.9%B) matches the tip re-measure.

## Arms covered (characterization)

- Pure helpers: `parseKwatroNodeId` null / valid, `nodeToWorld`, `collectPathwayEdgeKeys` with malformed connection ids
- Texture 2d path (wood grain + chip numbers) + optional `SRGBColorSpace`
- WebGL soft-fail: missing `renderer.getContext`, `experimental-webgl` fallback, non-Error constructor wrap
- Pointer/pick: chip-prefer, parent-walk node hit, nearest-node fallback, far miss, zero-size CSS box, no-handler / post-dispose soft-return
- Update chrome: winning / selected / valid pads, p2 class presence, focus restore, missing-node skip, reduced-motion vs emphasize
- A11y activate via class presence only (no aria/label string pins)
- Dispose idempotence: double unmount, detached canvas/a11y, deleted `__mp3dKwatroSinko`, context-lost after dispose, `buildEdgesOnce` early-return

## Intentional residual

Dead / unreachable after `clearChip` in unmount (`:802`–`:805`, `:812`) and a thin `chipBody`/`chipLabel` null guard — left alone (no product edit).

## Constraints honored

- Zero `src/` edits; AI stubbed (not invoked); `rules.ts` for state setup only
- No AI move-choice / timing / scoring / legal-move outcome asserts
- No player-facing copy or aria/label string pins
- No visual-baseline updates; no ratchet JSON

## Verification

```bash
npm run test:unit:coverage -- --coverage.include=src/ui/three/kwatro-sinko-board-3d.ts tests/unit/*kwatro*board*
npx vitest run --project unit-isolated tests/unit/mp3d-kwatro-sinko-board-3d-branch-gaps.test.ts
npm run verify
npm run test:unit
```
