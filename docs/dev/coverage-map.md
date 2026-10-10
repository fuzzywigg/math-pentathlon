# Unit coverage map (by directory)

Task: `q-mp-075`. Generated `2026-10-10T06:42:04.230Z` from `coverage/coverage-summary.json`.

Per-directory heat table of vitest unit coverage (`json-summary`). Rows are
parent directories under `src/` (for example `src/games/hex` for
`src/games/hex/rules.ts`), sorted by **lines %** ascending so cold spots
surface first. Does not change coverage thresholds or CI.

![Unit coverage by directory](./coverage-map.svg)

Wiki visual (coldest-directory heat table): [Unit coverage heat map](../wiki/coverage-map.md).

## Regenerate

```bash
npm run test:unit:coverage
npm run report:coverage-map
```

Or point at an existing summary:

```bash
node scripts/report-coverage-map.mjs path/to/coverage-summary.json
```

No network; reads local coverage JSON only. No new npm dependencies.

## Coldest directories (lines %)

| Directory | Lines % | Branches % | Files |
| --- | ---: | ---: | ---: |
| `src` | 87.25 | 69.64 | 1 |
| `src/games/queens-guards` | 93.42 | 91.17 | 9 |
| `src/games/pent-em-in` | 93.82 | 85.76 | 7 |
| `src/ui/three` | 94.26 | 80.02 | 13 |
| `src/games/hex` | 94.63 | 92.21 | 8 |
| `src/games/kings-quadraphages` | 94.80 | 88.59 | 11 |
| `src/games/fiar` | 94.86 | 86.04 | 10 |
| `src/core` | 95.26 | 87.96 | 12 |

Directories rendered: **38**. Full heat table is in the SVG above.

