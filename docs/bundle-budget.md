# Bundle size budgets (gzip + known-OVER ratchet)

Gzip size budgets for the **menu critical path** and each **game lazy chunk**.
This complements the existing hard CI rule that every `dist/assets/*.js` file stay
under **250 kB** (uncompressed).

The gzip check is primarily **report-only**: known overages warn, and the hard
build path is not blocked. A committed **`knownOvers` allowlist** distinguishes
expected OVER rows from **new** regressions so a newly oversized game is flagged
loudly.

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
| `bundle-budgets.json` | Committed budgets (gzip bytes) plus `knownOvers` allowlist. Headroom was **current size + 10%** when introduced |
| `scripts/check-bundle-budgets.mjs` | Measurement + table printer + known-vs-new OVER classifier |
| npm script `size:check` | Runs the checker (expects `dist/` from a prior `build`) |

## Local usage

```bash
npm run build
npm run size:check
# Optional: exit non-zero when a NEW (non-allowlisted) OVER appears
npm run size:check -- --fail-on-new-over
```

The script prints a table: Bundle · Gzip · Budget · Delta · Status (`OK` / `OVER` /
`MISSING` / `NO BUDGET`).

### Exit codes

| Mode | Exit code |
| --- | --- |
| Default (`npm run size:check`) | Always **0** (including known OVER, new OVER, and gaps) — safe for local scripts and does not fail the hard build path |
| `--fail-on-new-over` | **1** only when at least one OVER label is **not** listed in `knownOvers`; otherwise **0** |

Measurement errors (missing `dist/`, parse failures) still exit **0** with a
usage message so a broken local tree does not look like a budget regression.

## Known OVER allowlist (`knownOvers`)

`bundle-budgets.json` may include:

```json
"knownOvers": ["game-example"]
```

| Classification | Meaning | Annotation |
| --- | --- | --- |
| **Known OVER** | Label is in `knownOvers` and currently OVER | `::warning::` |
| **NEW OVER** | Label is OVER but **not** in `knownOvers` | `::error::` (loud) |
| **Stale allowlist** | Label is in `knownOvers` but no longer OVER | `::notice::` — remove it (ratchet only goes down) |

Tip measurement after the ramrod CSS trim (q-mp-110) is **0 OVER**, so
`knownOvers` is currently `[]`. Do not grow the allowlist to hide accidental
regressions — trim the chunk or raise the specific budget with tip-owner
approval. Shrinking `knownOvers` when a game returns under budget is required.

## CI

In `.github/workflows/ci.yml`, the **build** job runs
`npm run size:check -- --fail-on-new-over` after the hard 250 kB assets check,
with `continue-on-error: true`. That means:

- Known OVER → warnings; step succeeds
- NEW OVER → `::error::` annotations and a failed step, but the **build job
  stays green** (report-only / continue-on-error)
- The hard 250 kB uncompressed check remains a hard failure

Workflow permissions stay `contents: read` with `persist-credentials: false`.

## Updating budgets

When an intentional growth lands (new UI on the shell, larger game chunk):

1. `npm run build && npm run size:check` — note the new gzip sizes
2. Set each changed entry in `bundle-budgets.json` to `Math.ceil(actualGzipBytes * 1.1)`
3. Keep `"headroom": 0.1` accurate in the JSON description
4. If a temporary OVER must remain, add **only that** id to `knownOvers` (tip
   owner approval). Prefer trim over growing the allowlist
5. Remove ids from `knownOvers` as soon as they are under budget again
6. Mention the budget / allowlist change in the PR

Do **not** raise budgets or grow `knownOvers` to hide accidental menu regressions
(e.g. pulling a game or Three.js onto the critical path). Fix the chunk graph
instead (`vite.config.ts` / `vite.shell-chunks.ts`).
