# Knip unused-export drift (report-only)

**Task id:** `q-mp-118` (CI job) · triage `q-mp-170` (baseline + inventory)  
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

## q-mp-170 tip re-measure (2026-10-09)

Re-ran on live tip `cursor/mp-tip-post598` @ `7922f9af` (post-#598). Ticket evidence expected `unusedTypes` **95→96 (+1)**; live knip reported **91** (shrink vs prior baseline 95). No growth WARNING on tip. No AI public-surface type deleted (screening: report/hygiene only).

| Metric | Prior baseline | Live tip | Action |
| --- | --- | --- | --- |
| `unusedTypes` | 95 | 91 | baseline reconciled **downward** to 91 |
| `unusedExports` | 7 | 3 | `q-mp-188` rng alias + `q-mp-187` tablet-gl demote (BOARD_3D_LQ_*/MP3D_READY_ATTR) |
| `unlisted` | 3 | 3 | documented below (owners) |
| `duplicates` | 3 | 2 | `withSeededRandom` pair cleared in `q-mp-188` |
| `enforce` | `false` | `false` | **stays false** |

## Unlisted script dependencies (owners)

Knip flags packages imported by entry scripts that are not declared in `package.json` `dependencies` / `devDependencies`. Counts are stable at **3**; do not raise the baseline.

| Package | Script(s) | Owner / disposition |
| --- | --- | --- |
| `esbuild` | [`scripts/check-emit-identity.mjs`](../../scripts/check-emit-identity.mjs) | **Emit-identity / type-ratchet tooling** (`docs/dev/ai-typeonly-option.md`). Present only as a Vite transitive (`vite` → `esbuild`). Optional later: declare `esbuild` as a `devDependency`, or add to `knip.json` `ignoreDependencies` if tip owner prefers transitive-only. |
| `playwright` | [`scripts/probe-offline-resilience.mjs`](../../scripts/probe-offline-resilience.mjs), [`scripts/probe-offline-resilience-dev.mjs`](../../scripts/probe-offline-resilience-dev.mjs) | **Offline-resilience probe** (`docs/offline-resilience-2026-10-07.md`). Repo ships `@playwright/test` / `@axe-core/playwright`, not the bare `playwright` package name. Optional later: import from `@playwright/test`, or add `playwright` as a `devDependency`. |

## Duplicate export pairs (owners)

Knip reports **2** alias pairs (same binding under two export names). Cleanup is owner-scoped — do not widen this triage into helper rewrites.

| Pair | Module | Owner / disposition |
| --- | --- | --- |
| `dismissOwl` / `dismissOwlIfNeeded` | [`tests/e2e/helpers/page.ts`](../../tests/e2e/helpers/page.ts) | **e2e Owl helpers** — draft [`q-mp-166` #691](https://github.com/fuzzywigg/math-pentathlon/pull/691) consolidates callers onto the shared helper; alias may remain for call-site compatibility. |
| `createCustomGameState` / `createRulesState` | [`tests/unit/helpers/kings-board.ts`](../../tests/unit/helpers/kings-board.ts) | **Kings Quadraphages unit helpers** — intentional alias (`createRulesState = createCustomGameState`). Owner: kings unit-test maintainers / test-helper consolidation (`q-mp-084` / #656). |

Cleared in `q-mp-188`: `withSeededRandom` / `withSeededMathRandom` in [`tests/helpers/rng.ts`](../../tests/helpers/rng.ts) — callers migrated to canonical `withSeededRandom`.

## Future ratchet (tip-owner only)

1. Lower counts in `knip-baseline.json` when tip unused surface shrinks (ratchets only go down).
2. Set `"enforce": true` (or run `npm run report:knip -- --fail`) only after tip-owner approval — then growth exits 1.
3. Do **not** promote this job to a required check until enforce is intentional.

## Related

- Full dead-code inventory (not a CI gate): `npm run report:dead-code` → [`dead-code-inventory.md`](./dead-code-inventory.md)
- Open draft `#591` orphan inventory is a one-shot tip cleanup, not this continuous knip report.
- Complementary CI job: `q-mp-118` / draft `#646` (does not replace this triage).
