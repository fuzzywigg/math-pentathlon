# Unit coverage map (by directory)

Task: `q-mp-075`. Generated `2026-10-09T10:38:58.267Z` from `coverage/coverage-summary.json`.

Per-directory heat table of vitest unit coverage (`json-summary`). Rows are
parent directories under `src/` (for example `src/games/hex` for
`src/games/hex/rules.ts`), sorted by **lines %** ascending so cold spots
surface first. Does not change coverage thresholds or CI.

![Unit coverage by directory](./coverage-map.svg)

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
| `src/ui/three` | 81.61 | 57.70 | 13 |
| `src/core/ai-worker` | 81.82 | 72.22 | 4 |
| `src/ui/owl` | 84.89 | 67.11 | 2 |
| `src` | 87.43 | 62.07 | 1 |
| `src/games/juggle` | 88.95 | 84.99 | 6 |
| `src/games/kwatro-sinko` | 90.65 | 84.29 | 7 |
| `src/games/hex` | 90.76 | 86.98 | 8 |
| `src/games/fiar` | 90.87 | 81.09 | 10 |

Directories rendered: **39**. Full heat table is in the SVG above.

