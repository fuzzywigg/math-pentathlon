# q-mp-611 — `fiar-board-3d` branch gaps

**Tip base:** `cursor/mp-tip-post1012`  
**Host:** `src/ui/three/fiar-board-3d.ts` (568 LOC)  
**Scope:** tests-only; ZERO `src/` edits; no ratchet / ceiling writes; no visual-baseline updates.

## Measured (verification glob)

Command:

```bash
npm run test:unit:coverage -- --coverage.include=src/ui/three/fiar-board-3d.ts tests/unit/*fiar*board*
```

| Metric    |   Before (tip head) |                After |             Δ |
| --------- | ------------------: | -------------------: | ------------: |
| Lines     |     87.1% (250/287) | **98.95%** (284/287) | **+11.85 pp** |
| Branches  | **59.61%** (62/104) |  **93.26%** (97/104) | **+33.65 pp** |
| Functions |      76.19% (16/21) |       95.23% (20/21) |     +19.04 pp |

## What the new tests cover

File: `tests/unit/mp3d-fiar-board-3d-branch-residuals.test.ts`

- WebGL `getContext` absent → canvas `webgl` / `experimental-webgl` fallback; non-`Error` mount throw
- Pointer pick: direct hit, parent walk, miss, zero CSS rect, no handler, post-dispose
- Update arms: selected / valid / placement hover pads; p1/p2 chips; mark→demark; winning emphasize; bad `parseNodeId` node/edge skips; missing-node continue; a11y tab-stop force; a11y click chrome
- Host `clientWidth`/`clientHeight` soft floor; double context-lost; post-dispose update/resize no-ops; double unmount

Asserts stay on element presence, class/attribute chrome, and handler call counts — no AI choice, timing, scoring, legal-move outcomes, or aria/label copy pins.

## Intentional residuals (7 branch arms)

Hard soft-fail / defensive arms left unforced (no product edits):

- `resize` / `onContextLost` disposed early-returns after layout + listener unbind
- `root.children[0] === undefined` while-loop guard
- Implicit else arms on optional parent / `__mp3dFiar` / canvas-parent removals

## Conflict notes

Leave layout-reads `#837` / `q-mp-351` alone (no product layout edits; this draft does not comment on those PRs). No ratchet JSON.
