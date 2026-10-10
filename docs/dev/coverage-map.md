# Unit coverage map (by directory)

Task: `q-mp-075`. Generated `2026-10-10T13:54:59.795Z` from `coverage/coverage-summary.json`.

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

| Directory                 | Lines % | Branches % | Files |
| ------------------------- | ------: | ---------: | ----: |
| `src`                     |   87.25 |      69.64 |     1 |
| `src/games/queens-guards` |   93.42 |      91.17 |     9 |
| `src/games/fiar`          |   94.28 |      86.34 |    10 |
| `src/games/hex`           |   94.63 |      92.21 |     8 |
| `src/games/ramrod`        |   95.47 |      90.00 |     6 |
| `src/ui/three`            |   95.90 |      83.10 |    13 |
| `src/games/star-track`    |   95.91 |      90.36 |     7 |
| `src/ui/owl`              |   96.10 |      84.42 |     2 |

Directories rendered: **38**. Full heat table is in the SVG above.
