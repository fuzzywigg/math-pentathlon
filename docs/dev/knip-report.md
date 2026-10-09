# Knip unused-export drift (report-only)

**Task id:** `q-mp-118`  
**Posture:** report-only CI job + local npm scripts. Never fails required lint/unit/build/e2e jobs.  
**Config:** committed [`knip.json`](../../knip.json)  
**Baseline:** [`knip-baseline.json`](./knip-baseline.json) (`enforce: false` until tip-owner approval)

## Commands

```bash
npm run report:knip              # knip vs baseline; exit 0; CI annotations on growth
npm run report:knip -- --json    # machine-readable metrics + diff
npm run report:knip -- --write-baseline  # refresh knip-baseline.json from current tip
npm run report:dead-code         # fuller inventory (knip + CSS + helpers → docs/dev/dead-code-inventory.*)
```

`report:knip` invokes pinned `knip@5.88.1` via `npx` (not a lockfile/`devDependencies` entry — knip’s transitive tree currently fails `npm audit`; keep the app lockfile at 0 vulnerabilities). No apt. No network inside unit/e2e tests.

## CI

Job `knip` in [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml):

- `permissions: contents: read` (workflow top-level)
- checkout `persist-credentials: false`
- `continue-on-error: true` on the job
- runs `npm run report:knip`
- emits `::warning::` when any tracked metric grows vs `knip-baseline.json`
- emits `::notice::` when within baseline or when a metric shrinks

Tracked metrics: `unusedFiles`, `unusedExports`, `unusedTypes`, `unusedDependencies`, `unusedDevDependencies`, `unlisted`, `duplicates`.

## Future ratchet (tip-owner only)

1. Lower counts in `knip-baseline.json` when tip unused surface shrinks (ratchets only go down).
2. Set `"enforce": true` (or run `npm run report:knip -- --fail`) only after tip-owner approval — then growth exits 1.
3. Do **not** promote this job to a required check until enforce is intentional.

## Related

- Full dead-code inventory (not a CI gate): `npm run report:dead-code` → [`dead-code-inventory.md`](./dead-code-inventory.md)
- Open draft `#591` orphan inventory is a one-shot tip cleanup, not this continuous knip report.
