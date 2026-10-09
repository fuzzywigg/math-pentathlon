# Mutation audit — UI / shell (burn-1008-mp-mutation-audit-ui)

Tests-only mutation measurement for **non-engine, non-AI** UI surface: routing,
settings flags, storage wrapper, sanitize/migrate, shell helpers, PWA register,
reduced-motion / offline glue. Distinct from the rules-engine audit (#515 /
`docs/mutation-audit-burn-1008.md`).

## Scope

**In:** `src/core/{router,safe-web-storage,settings-flags,url-flags,feature-flags,dom-security,storage/*}.ts`,
`src/ui/{offline,reduced-motion,timeout-handle,coord-map,game-error-boundary}.ts`,
`src/pwa/register.ts`.

**Out:** `ai/`, `*/rules.ts`, engine legal-move/scoring, tutorials/copy, player-facing
string assertions, AI move choice / timing.

## Harness

1. **Stryker probe (required attempt):**
   ```bash
   npx --yes @stryker-mutator/core@8.7.1 --version   # → 8.7.1
   npx --yes @stryker-mutator/core@8.7.1 run -c /tmp/mutation-ui/stryker.config.json --dryRunOnly
   ```
   Failed: npx sandbox cannot resolve workspace `typescript`; also ignored the
   mutate-file filter and instrumented hundreds of sources. **Not adopted.**

2. **Ephemeral AST harness (used for scores):** `/tmp/mutation-ui/mutation-report-ui.mjs`
   (not committed). Same operators as `scripts/mutation-report.mjs`
   (comparison/equality, arithmetic, logical, boolean literals, unary `!`,
   integer ±1). Cap `--max=20` per module.

Exact commands:

```bash
# Baseline (existing tests only)
node /tmp/mutation-ui/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui/modules-baseline.txt \
  --max=20 --timeout=90000 \
  --json=/tmp/mutation-ui/baseline.json

# After (with tests/unit/mutation-ui-*.test.ts)
node /tmp/mutation-ui/mutation-report-ui.mjs \
  --modules-file=/tmp/mutation-ui/modules-after.txt \
  --max=20 --timeout=90000 \
  --json=/tmp/mutation-ui/after.json

# Focused re-measure after follow-up kills
node /tmp/mutation-ui/mutation-report-ui.mjs \
  --modules=src/core/feature-flags.ts,src/core/storage/migrate.ts,src/core/storage/sanitize.ts,src/ui/timeout-handle.ts,src/core/storage/storage.ts,src/ui/reduced-motion.ts,src/ui/offline.ts,src/core/dom-security.ts \
  --max=20 --timeout=90000 \
  --json=/tmp/mutation-ui/after2.json
```

Nothing added to `package.json`, lockfile, or CI.

## Before → after (score %)

| Module | Before % | After % | Δ pp | Killed after |
|--------|--------:|--------:|-----:|-------------:|
| `core/feature-flags.ts` | 0.0 | **100.0** | +100.0 | 2/2 |
| `core/storage/sanitize.ts` | 35.0 | **100.0** | +65.0 | 20/20 |
| `core/storage/storage.ts` | 5.0 | **65.0** | +60.0 | 13/20 |
| `core/url-flags.ts` | 50.0 | **100.0** | +50.0 | 12/12 |
| `ui/timeout-handle.ts` | 50.0 | **100.0** | +50.0 | 6/6 |
| `ui/reduced-motion.ts` | 23.1 | **61.5** | +38.4 | 8/13 |
| `core/safe-web-storage.ts` | 65.0 | **100.0** | +35.0 | 20/20 |
| `pwa/register.ts` | 60.0 | **95.0** | +35.0 | 19/20 |
| `core/storage/migrate.ts` | 46.2 | **76.9** | +30.7 | 10/13 |
| `ui/coord-map.ts` | 50.0 | **80.0** | +30.0 | 16/20 |
| `core/router.ts` | 72.7 | **100.0** | +27.3 | 11/11 |
| `core/settings-flags.ts` | 76.5 | **100.0** | +23.5 | 17/17 |
| `core/dom-security.ts` | 76.9 | **92.3** | +15.4 | 12/13 |
| `ui/offline.ts` | 71.4 | **85.7** | +14.3 | 6/7 |
| `ui/game-error-boundary.ts` | 62.5 | 62.5 | 0.0 | 5/8 |

**14 modules** with measurably higher scores (acceptance: 8+).

`core/game-registry.ts` was measured at baseline **100%** (catalog `available: true`
literals) and excluded from after focus.

## Remaining survivors (not product bugs)

No production defects confirmed. Leftover survivors are equivalent / environment-gated:

| Module | Survivor | Reason |
|--------|----------|--------|
| `game-error-boundary` | `!active \|\| didCatch` → `&&`; `active = false` → `true` | Listeners always removed with the flag; not observable via public API. Pinned `it.skip` in `mutation-ui-game-error-boundary.test.ts`. |
| `migrate` | `version < CURRENT` → `<=`; compound `&&` on version | `migrateProgressData` vs `ensureProgressDefaults` both stamp to `CURRENT` when equal; remaining `&&` arms are near-equivalent under finite numbers. |
| `offline` / `reduced-motion` | `typeof x === 'undefined' \|\| typeof y === 'undefined'` → `&&` | Requires one global missing; not reachable under jsdom without breaking the runner. |
| `dom-security` | `i < values.length` → `<=` in `safeHtml` | Trailing out-of-range slot is a no-op (`values[i]` undefined → empty text). |
| `coord-map` | numeric `0 → 1` on scale fallbacks | Near-equivalent when the paired `> 0` guard already failed. |
| `storage` | constructor / cross-tab `=== true` / `!read.ok` | Tightly coupled to settings-flag side effects already covered elsewhere; remaining mutants need remount isolation beyond this suite. |
| `pwa/register` | `updateCheckInterval !== null` in reset | Interval cleared path already covered; boolean flip on null check is redundant with `clearInterval` safety. |

## New tests

All new files (did **not** edit #571 / #577 / #576 suites):

- `tests/unit/mutation-ui-router.test.ts`
- `tests/unit/mutation-ui-url-flags.test.ts`
- `tests/unit/mutation-ui-feature-flags.test.ts`
- `tests/unit/mutation-ui-settings-flags.test.ts`
- `tests/unit/mutation-ui-timeout-handle.test.ts`
- `tests/unit/mutation-ui-reduced-motion.test.ts`
- `tests/unit/mutation-ui-coord-map.test.ts`
- `tests/unit/mutation-ui-safe-web-storage.test.ts`
- `tests/unit/mutation-ui-offline.test.ts`
- `tests/unit/mutation-ui-storage-sanitize.test.ts`
- `tests/unit/mutation-ui-storage-migrate.test.ts`
- `tests/unit/mutation-ui-storage.test.ts`
- `tests/unit/mutation-ui-pwa-register.test.ts`
- `tests/unit/mutation-ui-dom-security.test.ts`
- `tests/unit/mutation-ui-game-error-boundary.test.ts`

Rules: no player-facing copy assertions; no AI move/timing assertions; hard-coded
length expectations (e.g. `64`, `50`) so const ±1 mutants are detectable.

## Overlap

- **#515** (merged) — rules engines only.
- **#571 / #577** — UI coverage characterization; different files.
- **#576** — type ratchet; untouched.
