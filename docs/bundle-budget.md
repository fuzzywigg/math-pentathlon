# Bundle size budgets (report-only)

Gzip size budgets for the **menu critical path** and each **game lazy chunk**.
This complements the existing hard CI rule that every `dist/assets/*.js` file stay
under **250 kB** (uncompressed). The gzip check is **report-only**: it never fails
the build or CI job.

## What is measured

| Row | How it is measured |
| --- | --- |
| `menu-critical-path` | Sum of gzip sizes of JS/CSS referenced from `dist/index.html` (`script`, `modulepreload`, `stylesheet`) — the shell download before first paint |
| `game-<id>` | Gzip size of `dist/assets/game-<id>-*.js` (Vite `manualChunks` lazy game bundle) |

Deferred core (`core-dice`, owl, three/mp3d, demos, workers) is **not** part of the
menu budget; those load on demand. See `vite.shell-chunks.ts` and
`docs/wiki/development.md`.

## Files

| Path | Role |
| --- | --- |
| `bundle-budgets.json` | Committed budgets (gzip bytes). Headroom was **current size + 10%** when introduced |
| `scripts/check-bundle-budgets.mjs` | Measurement + table printer |
| npm script `size:check` | Runs the checker (expects `dist/` from a prior `build`) |

## Local usage

```bash
npm run build
npm run size:check
```

The script prints a table: Bundle · Gzip · Budget · Delta · Status (`OK` / `OVER` /
`MISSING` / `NO BUDGET`). Exit code is always **0** (report-only).

## CI

In `.github/workflows/ci.yml`, the **build** job runs `npm run size:check` after the
hard 250 kB assets check, with `continue-on-error: true`. Overages emit
`::warning::` annotations but do not block merge.

## Updating budgets

When an intentional growth lands (new UI on the shell, larger game chunk):

1. `npm run build && npm run size:check` — note the new gzip sizes
2. Set each changed entry in `bundle-budgets.json` to `Math.ceil(actualGzipBytes * 1.1)`
3. Keep `"headroom": 0.1` accurate in the JSON description
4. Mention the budget bump in the PR

Do **not** raise budgets to hide accidental menu regressions (e.g. pulling a game
or Three.js onto the critical path). Fix the chunk graph instead
(`vite.config.ts` / `vite.shell-chunks.ts`).
