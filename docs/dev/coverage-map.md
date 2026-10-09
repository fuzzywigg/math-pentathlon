# Unit coverage map (by directory)

Task: `q-mp-075`. Generated `2026-10-09T18:44:58.521Z` from `coverage/coverage-summary.json`.

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
| `src/core/ai-worker` | 79.66 | 66.67 | 4 |
| `src` | 80.88 | 58.93 | 1 |
| `src/ui/three` | 89.00 | 68.98 | 13 |
| `src/games/juggle` | 91.17 | 86.08 | 6 |
| `src/ui/owl` | 91.88 | 73.87 | 2 |
| `src/games/kwatro-sinko` | 91.96 | 85.56 | 7 |
| `src/games/fiar` | 92.62 | 82.55 | 10 |
| `src/games/contig-60` | 92.82 | 86.10 | 6 |

Directories rendered: **38**. Full heat table is in the SVG above.

