# q-mp-626 — `polyomino/placement` branch coverage

Tip head re-measure: `cursor/mp-tip-post1023` @ `fb0d0ec5`.

## Focused verification

Vitest positional filters are not shell globs — expand `tests/unit/*placement*`
before passing file paths (or invoke via a shell that expands them once):

```bash
npm run test:unit:coverage -- --project unit-shared \
  --coverage.include=src/core/polyomino/placement.ts \
  $(echo tests/unit/*placement*)
```

| Metric                   | Before (`*placement*` glob) | After (+ `q-mp-626` suite) |
| ------------------------ | --------------------------: | -------------------------: |
| LOC                      |                         703 |                        703 |
| Lines                    |             44.72% (89/199) |         **100%** (199/199) |
| Branches                 |             37.83% (42/111) |       **96.39%** (107/111) |
| Statements               |            45.29% (106/234) |         **100%** (234/234) |
| Functions                |              54.16% (26/48) |           **100%** (48/48) |
| Dedicated residual tests |                           0 |                     **24** |

Backlog stamp on post1012 (`51.8%`L / `45.0%`B) used a related-suite mix.
Under the ticket’s `*placement*` filename glob alone on post1023, wave28/37/1008
helpers that already cover ~521–536 / ~582–702 do not match, so this suite
re-anchors those clusters (plus Grid validity / remove / adjacent / canPlace
arms still cold under the glob).

Residual soft keep-sites (4 branch arms): `validation.reason \|\|` fallback (~162),
legacy `rowCells` miss on place (~167), `removePolyomino` rowCells miss (~197),
`createBoardWithBlockedCells` rowCells miss (~569).

### Documented quirks (NOT fixed — pin only)

1. **`createHexagonalBoard(1)` corner mask**: `abs(dr)+abs(dc)+abs(-dr-dc) > 2·r`
   blocks only `(0,0)` and `(2,2)` on the 3×3 embedding — not all four geometric
   corners — while still reporting **7** empty cells.

## Constraints

- Tests + this doc only; zero `src/` edits
- Pin CURRENT placement-helper outputs only; no legal-move / AI / scoring product edits
- No copy / aria / label text pins; no ratchet JSON; leave undrafted `449` nnnull **contained**
