# q-mp-355 — board-a11y soft-fail residuals (tests-only)

Characterization for `src/ui/board-a11y.ts` focus / keyboard / empty-board /
deep-rowgroup soft-fail edges. Structural asserts only — no player-facing copy
pins. No `src/` edits.

## Overlap

- `#832` / `q-mp-325` — mutation audit UI wave 10 on the same host (scores /
  survivors). Orthogonal: this ticket is characterization, not mutation JSON.
- `#813` owl UI cov r16 / `#822` no-shadow controllers — disjoint.

## Coverage (`board-a11y.ts`, related a11y unit suite)

| Metric     | Before           | After                | Δ        |
| ---------- | ---------------- | -------------------- | -------- |
| Statements | 91.94% (194/211) | **99.05%** (209/211) | +7.11 pp |
| Branches   | 86.45% (134/155) | **92.90%** (144/155) | +6.45 pp |
| Lines      | 92.38% (194/210) | **99.04%** (208/210) | +6.66 pp |
| Functions  | 100%             | 100%                 | 0        |

Residuals closed: deep `ensureRowgroupAncestors` rowgroup/presentation chain;
detached `parentElement` orphan skip; `bindGridNavigation` non-focusable /
out-of-board soft returns; `captureFocusedCell` null `activeElement`; empty-board
`restoreGridFocus` / `ensureAriaGridRows`; `labelBoardFromGameTitle` absent /
already-labelled soft no-ops; missing-coords `restoreFocusedCell`.

## Documented defensive residuals (not observable)

| Line | Arm                                       | Note                                                    |
| ---- | ----------------------------------------- | ------------------------------------------------------- |
| 193  | `rowCells.length === 0`                   | Map lists only grow via `push`; empty list never stored |
| 245  | `from === grid \|\| !grid.contains(from)` | Public callers only pass parents of in-grid orphans     |

## Tests

`tests/unit/q-mp-355-board-a11y-soft-fail.test.ts` (12 cases).
