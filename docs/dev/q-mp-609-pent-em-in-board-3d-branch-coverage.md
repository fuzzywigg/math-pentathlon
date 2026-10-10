# q-mp-609 — `pent-em-in-board-3d` branch coverage

Tip head re-measure: `cursor/mp-tip-post1012` @ `780db960`.

## Focused verification

```bash
npm run test:unit:coverage -- --coverage.include=src/ui/three/pent-em-in-board-3d.ts tests/unit/*pent-em*board*
```

| Metric                   | Before (lifecycle + board-select) | After (+ branch-residuals) |
| ------------------------ | --------------------------------: | -------------------------: |
| LOC                      |                               664 |                        664 |
| Lines                    |                  83.49% (263/315) |       **98.41%** (310/315) |
| Branches                 |               **46.49%** (53/114) |       **96.49%** (110/114) |
| Statements               |                  82.97% (268/323) |           98.14% (317/323) |
| Functions                |                    64.28% (18/28) |             92.85% (26/28) |
| Dedicated residual tests |          0 (`*branch-residuals*`) |                     **10** |

Uncovered residual arms after this suite are defensive dispose / sparse-`children` breaks (`~297`, `~356`, `~388`, `~638`) that need race or sparse-array injection; left as soft keep-sites.

## Constraints

- Tests + this doc only; zero `src/` edits
- No AI / rules / scoring / legal-move outcome asserts; placement path = chrome only
- No copy / aria / label text pins; no ratchet JSON; no visual-baseline updates
- Leave `#1035`/`583` UI-cov r56 and layout-reads `#838`/`330` **contained**
