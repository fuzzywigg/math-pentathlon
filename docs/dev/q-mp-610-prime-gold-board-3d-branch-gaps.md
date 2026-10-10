# q-mp-610 — `prime-gold-board-3d` branch gaps

**Series:** board3d-branch-coverage  
**Tip:** `cursor/mp-tip-post1012`  
**Scope:** tests + this note only (no product `src/`, no ratchet JSON, no visual baselines).

## Overlap

Open drafts into `cursor/mp-tip-post1012` checked before coding. `#1043` / `q-mp-596` covers prime-gold **UI** residuals (`board-ui` / `game-controller` / `board-3d-loader`), not `src/ui/three/prime-gold-board-3d.ts` branch arms — left open (**contained**; no comment). No open draft owned this board-3d branch-gap task.

## Remeasure (post1012 head)

Lifecycle coverage filter (matches backlog verification glob once shell-expanded; `mp3d-*` lives in `unit-isolated`):

| Slice                                                    |                Lines |             Branches |
| -------------------------------------------------------- | -------------------: | -------------------: |
| Baseline (`lifecycle` + `board-select` only)             | **80.05%** (309/386) |  **52.03%** (64/123) |
| After (+ `mp3d-prime-gold-board-3d-branch-gaps.test.ts`) |   **100%** (386/386) | **98.37%** (121/123) |

Δ branches: **+46.34 pp** (64→121 of 123). Residual uncovered lines **479** / **493** are the `focus`/`lastState` false arm and the `void firstFocusable` no-op when `activeElement === body` (defensive / effectively unreachable under normal update ordering).

Uncovered clusters called out in backlog (~660, 676, 688, 725) are exercised by the new residual file (OOB / missing-value hooks, update-after-dispose, sparse unmount child hole), plus additional soft-fail arms (getContext fallback, non-Error mount, short/sparse veins, a11y chrome, visibility paint, disposed resize/contextlost, pointer placing, highlight/vein/chip).

## Files

- `tests/unit/mp3d-prime-gold-board-3d-branch-gaps.test.ts`
- `docs/dev/q-mp-610-prime-gold-board-3d-branch-gaps.md`
