# Engineering backlog — 2026-10-11av (tip refill after post2590 cut / round-48)

**Task id:** `q-mp-090av`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post2590` @ `27812efe` (full `27812efe3d5675dbd9961ebb770121c26cc9c362`; tip cut from `alpha` @ `2590f354` after `#1353` fold of post6066; living pointers set by `q-mp-026ab`)  
**Depends on:** tip `cursor/mp-tip-post2590` @ `27812efe`. Round-47 backlog (`q-mp-090au` / open `#1364` on old tip `post6066`, ids `q-mp-1222`…`1245`) — leave with `contained`; one SAFE implementer already retargeted here (`#1365` / `q-mp-1232`). Round-46 backlog (`q-mp-090at` / open `#1349` on `postc75f`, ids `q-mp-1197`…`1220`) — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post2590` @ `27812efe` measures unit files **3419**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 yes **0**. This doc lists **25 new** concrete engineering tasks (`q-mp-1246` … `q-mp-1270`) mined from the **live tip tree**, checked against prior refills through `q-mp-1245` (au on tip + `#1364`), at/as/ar/aq/ap/ao, and against the full open draft PR list (post2590 `#1365`, post6066 leftovers `#1350`–`#1364`, postc75f `#1337`–`#1349`, older stacks). It is the **only** deliverable of `q-mp-090av`.

**Honest count:** **25** tasks (`1246`–`1270`). Id range starts at `q-mp-1246` per round-48 brief. Earlier reserved gaps (`1221`, `1192`–`1196`, `1164`–`1171`, `1138`–`1146`, etc.) stay unused. Round-47 already claimed resolveMetric fake `0/0`, formatRankOutput rules-branch label, summarizeSamples NaN `durationMs`, auditPrecache `orderOk`, offlineNeededPaths `.mjs`, collectHtmlNonRoot query/hash + `//`, aggregateByDirectory equal-weight, extractMetric/extractLintMetrics **string** ceilings, resolveMutationReportGames dedupe (open `#1365`), isUsableLockPackages root-only, parseEnvNumber non-integer, diffMetrics NaN baseline, unit-flakes selector isolation docs, backlog path hygiene shards, `__mpRenderStats`, runtime-perf `PERF_DATE` H1, mobile-audit `smallTapTargetCount`, console-sweep load vs play, render-perf hover 12 vs 16, mutateGame `no-tests` baseline, `clickFirst` swallow, `readPerf` empty `longTaskMaxMs` — **do not** re-queue `1222`–`1245` (leave `#1364` + `#1365` with `contained`). This refill **does not** re-queue exhausted families from the round-48 brief: `--help`/argv/empty-input theater, cli-help spawn speedups, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed, license-classifier prose, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache audits, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas, prototype-restore after direct assigns, engine-coverage-rank, report-coverage-map, ratchet-history **ceilings**, env-number, render-perf/runtime-perf, mobile-audit, console-sweep, mutation-report **games**. Nav-away 8-game omission stays prior id `1070`. Emit-identity export demotes stay prior id `1110`. Boundaries HOLD-CHECK gaps `1201`–`1204`/`1220` and size soft-gate `1214` stay prior ids — leave with `contained`.

**Fresh payoffs on this tip (re-measured @ `27812efe`):** **`shapeLhPerformanceScore` accepts out-of-range LH scores** (`1.2` → `score: 120`; `-0.1` → `-10`; distinct from open `#1355`/`1208` missing score), **`extractMetric('typePhase2')` ignores nested `totals.outOfScopeErrors`** while `check-type-ratchet` reads nested (distinct from string-ceiling `1230`/`1231`), **`mergeHistory` null-overwrites prior lint metrics for the same sha**, **`symbolInSource` misses bare `export default Foo` / `export namespace`**, **`PATH_RE` never matches `` `.github/…` `` backtick paths** (~49 docs cite them), **offline prod `classify` buckets Vite `game-<id>-*.js` as `js` not lazy**, **prod vs dev offline `classify` disagree on `*.worker-*.js`**, **`resolveSizeCheckExitCode` fail-opens on non-finite / negative `novelCount`** (distinct from `1214` MISSING), **`report-lint-buckets` prints silent wrong headroom when a ceiling is a non-numeric string**, **`flattenKnip` throws on `files: [null]`**, **`verifyCandidate` treats `hex ⊂ hex-a-gone` dynamic imports as hits**, **`scanTestHelpers` records the local name of `export { a as b }` not the public export**, **Calla deep-playtest `/win|tie/i` false-ends on “Drawing” / “patience”**, **Stars/Ramrod/Par-55/Sum-Dominoes end regexes false-end on substring `tie`/`draw`**, **`PAR55_QUICK='0'|'false'` still forces 1 game**, **offline `waitForUrl` treats HTTP 404 as ready**, **`PROBE_BROWSERS=webkit, firefox` throws on untrimmed `" firefox"`**, **`resolveArtifactDir` keeps leading/trailing spaces from `MP_ARTIFACT_DIR`**, **`testGlobsForGame('frac-fact')` includes a `*difficulty*` overnight suite despite the “excludes difficulty” header**, **`size:check` catch sets exit 0 even under `--fail-on-new-over`**, **phase-2 export `--check` fail-opens when baseline omits `outOfScopeErrors`**, **README CI posture omits soft copy-pins / soft PWA / report-only knip+zoom+forced-colors**, **`lint:ratchet` still documented as curly-only** while ceilings list **12** rules, **`eslint-off-rules-inventory.md` still claims `return-await` / `eqeqeq` unceilinged** with stale totals, and **`tip-vs-alpha` counts table `PLAYER_FACING_COPY` 32 vs section header (38)**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake hygiene / wall trim. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, emit-identity inventory remasure, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, more cli-help spawn speedups, or more license-classifier / pwa-manifest-contract / workflows-bool / summarizeKnip / md-link / precache / menu-critical / copy-pins / flake-rate / classifyVitest / heap / engine-coverage / coverage-map / env-number / render-perf / runtime-perf / mobile-audit / console-sweep / mutation-games theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids (`1201`–`1204`/`1214`/`1220`) — do not sibling. Ratchet-history **ceiling** coerce tickets stay prior `1230`/`1231` — this refill only queues non-ceiling ratchet-history bugs (`typePhase2` nesting, `mergeHistory`).

## Duplicate check (do not re-queue)

| Topic family                                                                                                                                                              | Why skipped                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| round-47 au `1222`–`1245` (+ open `#1364` on post6066; `#1365`/`1232` on this tip)                                                                                       | leave with `contained`; this refill’s tickets are **new** surfaces only                                                                         |
| round-46 at `1197`–`1220` / as `1172`–`1191` / ar `1147`–`1163` / aq `1122`–`1137` / ap–ao residuals                                                                      | leave with `contained`                                                                                                                          |
| page-ready / double-rAF / artifact-dir **adoptions** / mountPair / npm aliases / `--help`/`--dry-run`/argv / lib main-entry / empty-input / cli-help spawn                 | prompt hard-skip (artifact-dir **space trim** is a new wrong-result, not an adoption)                                                           |
| license-classifier / pwa-manifest-**contract** / check-pwa-manifest / check-workflows / precache parser / menu-critical-ref / md-link regex / check-copy-pins / summarizeKnip | prompt hard-skip                                                                                                                                |
| classifyVitestRunResult / flake-rate loops / heap-memory deltas / prototype-restore after direct assigns                                                                  | prompt hard-skip                                                                                                                                |
| engine-coverage-rank / report-coverage-map / ratchet-history **ceilings** / env-number / render-perf / runtime-perf / mobile-audit / console-sweep / mutation-report games | prompt hard-skip (au claimed; brief exhausted)                                                                                                  |
| check-build asset/precache audits (`1225`–`1228`)                                                                                                                         | prompt hard-skip / leave prior ids                                                                                                              |
| nav-away 8-game omission (`1070`) / emit-identity export demotes (`1110`) / scrollIntoView (`1180`) / getContext (`1181`) / offsetWidth (`1135`) / flake `flaky` (`1183`) | leave prior ids / open drafts                                                                                                                   |
| CI `e2e-cross-browser` named script (`800`) / dismissOwl (`879`) / visual-baseline (`1050`)                                                                               | leave prior ids                                                                                                                                 |
| tip-name pointers / wiki **count** remasure / knip unusedTypes baseline drop / Rank-3 demotes / AI harness speed                                                          | prompt hard-skip / HOLD                                                                                                                         |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions                                                                                     | hard-rule HOLD                                                                                                                                  |
| boundaries stripComments/typeOnly/classify-tutorial/DOM_IDENT/template (`1201`–`1204`/`1220`)                                                                            | leave prior HOLD-CHECK — do not sibling abs-path / UI_REEXPORT here                                                                             |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `27812efe`)

| Id                                 | Title (short)                           | Verdict                        | Evidence @ `27812efe`                                              |
| ---------------------------------- | --------------------------------------- | ------------------------------ | ------------------------------------------------------------------ |
| `q-mp-090au` / `#1364`             | round-47 backlog                        | **open on old tip `post6066`** | This refill starts at `1246`; do not re-queue `1222`–`1245`.       |
| `#1365`                            | `1232` mutation games dedupe            | **open on this tip**           | Leave with `contained`; do not sibling.                            |
| `#1350`–`#1363`                    | at SAFE implementers into `post6066`    | **open on old tip**            | Leave with `contained`.                                            |
| `q-mp-090at` / `#1349`             | round-46 backlog                        | **open on `postc75f`**         | leave with `contained`.                                            |
| `q-mp-090as` / `#1335`             | round-45 backlog                        | **open on `post04d5`**         | leave with `contained`.                                            |
| `q-mp-1222`…`1245`                 | au gaps                                 | **still-valid or in-flight**   | leave prior ids; do not sibling.                                   |
| `q-mp-1201`…`1204` / `1220` / `1214` | boundaries + size soft-gate           | **still-valid; no tip PR yet** | Leave prior ids — **do not** re-queue.                             |
| `q-mp-1070`                        | nav-away expand/document 8 games        | **still-valid; no open PR**    | Leave prior id — **do not** re-queue.                              |
| `q-mp-1110`                        | emit-identity demote exports            | **still-valid HOLD-CHECK**     | Leave prior id.                                                    |
| `q-mp-800` / `879` / `1050`        | cross-browser / dismissOwl / visual     | **still-valid**                | Leave prior ids.                                                   |
| Dead-code Rank-2 yes               | live dry-run                            | **0 yes**                      | No new Rank-2 demote queued.                                       |
| knip unusedExports                 | live `--json`                           | **3 LEAVE**                    | No SAFE demotes (AI / settings barrel).                            |

## Shared-file conflict flags

| Shared file                                                              | Conflicting new ids                                                         |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `scripts/check-perf.mjs`                                                 | `1246` only; leave open `#1355`/`1208` alone                                |
| `scripts/report-ratchet-history.mjs`                                     | `1247` + `1248` — serialize; leave au `1230`/`1231` alone                   |
| `scripts/check-dev-doc-links.mjs`                                        | `1249` + `1250` — serialize; leave open `#1337`/`1177` alone                |
| `scripts/probe-offline-resilience.mjs`                                   | `1251` + `1252` — serialize                                                 |
| `scripts/probe-offline-resilience-dev.mjs`                               | `1252` only (dev `classify`)                                                |
| `scripts/check-bundle-budgets.mjs`                                       | `1253` + `1265` — serialize; leave prior `1214` alone; **no** menu-critical |
| `scripts/report-lint-buckets.mjs`                                        | `1254` only; leave lint-ratchet gate alone                                  |
| `scripts/report-dead-code.mjs`                                           | `1255` + `1256` + `1257` — serialize; leave open `#1339`/`1191` alone       |
| `scripts/calla-deep-playtest.mjs`                                        | `1258` only                                                                 |
| `scripts/stars-bars-deep-playtest.mjs` / `ramrod-…` / `par-55-…` / `sum-dominoes-…` | `1259` (shared end-regex family) — one PR or serialize            |
| `scripts/par-55-deep-playtest.mjs`                                       | `1259` + `1260` — serialize                                                 |
| `scripts/webkit-offline-probe.mjs` (+ shared wait helpers in probe-*)    | `1261` + `1262` — serialize                                                 |
| `scripts/lib/artifact-dir.mjs`                                           | `1263` only; **no** mountPair / adopter rewires                             |
| `scripts/mutation-report.mjs`                                            | `1264` only; leave `#1365`/`1232` + `#1351` alone                           |
| `docs/dev/type-ratchet-phase2-export.mjs`                                | `1266` only                                                                 |
| `README.md`                                                              | `1267` + `1268` — serialize                                                 |
| `docs/wiki/development.md` / `docs/dev/ci-gates-mermaid-q-mp-073.md`     | `1268` only                                                                 |
| `docs/dev/eslint-off-rules-inventory.md`                                 | `1269` only; leave open `#740` as `superseded` on implement               |
| `docs/dev/tip-vs-alpha-audit-2026-10-08.md` (+ JSON if present)          | `1270` only                                                                 |

**Parallel-friendly:** `1246`, `1247`, `1249`, `1251`, `1253`, `1254`, `1255`, `1258`, `1261`, `1263`, `1264`, `1266`, `1267`, `1269`, `1270`. Serialize `1247`→`1248`; `1249`→`1250`; `1251`→`1252`; `1253`→`1265`; `1255`→`1256`→`1257`; `1259`→`1260`; `1261`→`1262`; `1267`→`1268`.

## Live tip measurements (evidence snapshot @ `27812efe`)

```text
$ git rev-parse HEAD
  27812efe3d5675dbd9961ebb770121c26cc9c362

$ git branch --show-current
  cursor/mp-tip-post2590 (audited) / cursor/backlog-2026-10-11av-aa2b (this PR)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3419

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0
  (NOTICE unusedTypes 36→29 shrink vs committed baseline 36 — baseline write NOT queued)

$ npm run report:dead-code -- --dry-run
  Safe-to-remove yes: 0

$ npm run check:dev-docs
  problems: 6 (missing-path)
  af no-such-game (intentional negative)
  u + as: tests/unit/existing-games-controllers.test.ts (sharded away — owned by au 1237)
  at: tests/unit/q-mp-685-main-residual-branches.test.ts (sharded — owned by au 1237)

$ shapeLhPerformanceScore({categories:{performance:{score:1.2}}})
  → { ok: true, score: 120 }
$ shapeLhPerformanceScore({categories:{performance:{score:-0.1}}})
  → { ok: true, score: -10 }
$ shapeLhPerformanceScore({categories:{performance:{score:null}}})
  → { ok: false, error: 'missing Lighthouse performance score' }  # 1208 surface

$ extractMetric('typePhase2', { totals: { outOfScopeErrors: 216 } }) → null
$ extractMetric('typePhase2', { outOfScopeErrors: 216 }) → 216

$ mergeHistory(same sha curly:12 then curly:null) → row.curly null (wipes 12)

$ symbolInSource('export default Foo;\n','Foo') → false
$ symbolInSource('export namespace Foo {}\n','Foo') → false
$ symbolInSource('export function Foo(){}\n','Foo') → true

$ '`.github/workflows/ci.yml`'.match(PATH_RE) → null
$ '`scripts/check-build.mjs`'.match(PATH_RE) → match
$ rg -l '`\.github/' docs --glob '*.md' | wc -l → 49

$ classifyProd('http://x/assets/game-hex-Ba7.js') → 'js'   # wants lazy-game-chunk
$ classifyProd('http://x/assets/hex-ai.worker-Ab.js') → 'lazy-game-chunk'
$ classifyDev('http://x/assets/hex-ai.worker-Ab.js') → 'js'  # prod/dev disagree

$ resolveSizeCheckExitCode({ novelCount: NaN, failOnNewOver: true }) → 0
$ resolveSizeCheckExitCode({ novelCount: -1, failOnNewOver: true }) → 0
$ resolveSizeCheckExitCode({ novelCount: 2, failOnNewOver: true }) → 1

$ 'abc' - 3 → NaN  # lint-buckets headroom silent branch miss

$ flattenKnip({ files: [null] }) → TypeError reading 'file'

$ d.includes('hex') for '../games/hex-a-gone/index' → true  # verifyCandidate dynamicHit

$ export { helper as usefulHelper } scan → tracks 'helper' not 'usefulHelper'

$ /win|tie/i.test('Drawing card') → true
$ /win|tie/i.test('patience') → true
$ /wins!|draw|tie/i.test('Drawing card') → true

$ PAR55_QUICK='0' → GAMES_PER_DIFF = 1 (truthy string)
$ PAR55_QUICK='false' → 1

$ waitForUrl: res.ok || res.status === 404 → 404 treated ready

$ 'webkit, firefox'.split(',') → ['webkit', ' firefox']  # map miss → throw

$ resolveArtifactDir({ env: { MP_ARTIFACT_DIR: '  spaced  ' }, … })
  → '…/  spaced  ' (spaces kept; trim used only for emptiness)

$ ls tests/unit/overnight-wave54-frac-rules-*.test.ts
  … includes overnight-wave54-frac-rules-difficulty-operand-denoms.test.ts

$ check-bundle-budgets main catch → process.exitCode = 0  # even with --fail-on-new-over

$ phase2-export --check: 216 > undefined → false → no FAIL

$ README.md lint:ratchet line: "curly:all ceiling" ; ceilings.json has 12 keys
$ README CI bullet omits knip / zoom-reflow / forced-colors / soft copy-pins / soft pwa-manifest
$ eslint-off inventory: return-await "not yet ceilinged"; live return-await: 3, eqeqeq: 1
$ tip-vs-alpha counts table PLAYER_FACING_COPY 32; section header (38)

$ Open drafts into cursor/mp-tip-post2590 at audit: #1365 only
$ Round-47 backlog still open on post6066: #1364
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090av-repros.log` and `q-mp-090av-repros2.log`.

## New tasks

### q-mp-1246 · Scripts: `shapeLhPerformanceScore` reject out-of-range LH scores

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** leave open `#1355`/`1208` missing-score alone
- **series:** script-tooling
- **verdict:** **SAFE** — inflated/negative “performance” scores green-wash budgets
- **CI / package.json callers:** `package.json` → `check:perf` (report-only / local)
- **target files:** `scripts/check-perf.mjs` (`shapeLhPerformanceScore`); unit fixtures
- **measured baseline:** `score: 1.2` → `{ ok: true, score: 120 }`; `score: -0.1` → `{ ok: true, score: -10 }`; valid `0.85` → `85`; `null` already rejected (`1208`).
- **acceptance criteria:** Scores outside `[0, 1]` → `{ ok: false, … }`; in-range unchanged; missing/null path unchanged.
- **verification commands:** `node --input-type=module -e 'import { shapeLhPerformanceScore } from "./scripts/check-perf.mjs"; …'` ; `CI=1 npx vitest run tests/unit/*check-perf*.test.ts` (or focused hermetic)
- **conflict notes:** not missing-score `1208`; not AI timing.
- **screen:** SAFE.

### q-mp-1247 · Scripts: `extractMetric('typePhase2')` honor nested `totals.outOfScopeErrors`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** leave au `1230`/`1231` string-ceiling tickets alone
- **series:** script-tooling
- **verdict:** **SAFE** — history chart drops commits that `check-type-ratchet` accepts
- **CI / package.json callers:** `package.json` → `report:ratchet-history` (report-only)
- **target files:** `scripts/report-ratchet-history.mjs` (`extractMetric` typePhase2 case); unit fixtures
- **measured baseline:** `{ totals: { outOfScopeErrors: 216 } }` → `null`; top-level `{ outOfScopeErrors: 216 }` → `216`. Live `check-type-ratchet.mjs` reads `prev.totals?.outOfScopeErrors`.
- **acceptance criteria:** Nested numeric totals accepted (same as check-type-ratchet); top-level still works; non-numeric still ignored/null.
- **verification commands:** `CI=1 npx vitest run tests/unit/*ratchet-history*.test.ts` ; hermetic `extractMetric` import
- **conflict notes:** not string-ceiling coerce (`1230`/`1231`); serialize with `1248`.
- **screen:** SAFE.

### q-mp-1248 · Scripts: `mergeHistory` must not null-overwrite prior metrics for same sha

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** serialize after `1247`
- **series:** script-tooling
- **verdict:** **SAFE** — later null wipe erases real lint points; forward-fill cannot recover
- **CI / package.json callers:** `package.json` → `report:ratchet-history`
- **target files:** `scripts/report-ratchet-history.mjs` (`mergeHistory`); unit fixtures
- **measured baseline:** same sha with `curly: 12` then `curly: null` → row `curly: null` (void/nnnull/dup also wiped).
- **acceptance criteria:** Prefer non-null prior value when merging same sha (or skip null overwrites); distinct shas unchanged; good histories unchanged.
- **verification commands:** hermetic `mergeHistory` unit
- **conflict notes:** serialize after `1247`; not ceiling coerce.
- **screen:** SAFE.

### q-mp-1249 · Scripts: `symbolInSource` accept bare `export default Foo` / `export namespace`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** leave open `#1337`/`1177` PATH_RE `.mts` alone; leave `#1340`/`1176` `export type {}` alone
- **series:** script-tooling
- **verdict:** **SAFE** — docs symbol checks false-miss on default/namespace exports
- **CI / package.json callers:** `package.json` → `check:dev-docs` (report-only)
- **target files:** `scripts/check-dev-doc-links.mjs` (`symbolInSource`); unit fixtures
- **measured baseline:** `export default Foo;` → false; `export namespace Foo {}` → false; `export function Foo(){}` → true; `export default class/function` already true.
- **acceptance criteria:** Bare default identifier + namespace exports recognized; existing function/class/type paths unchanged; **no** md-link regex edits.
- **verification commands:** `CI=1 npx vitest run tests/unit/*dev-doc*.test.ts` (or hermetic import)
- **conflict notes:** not md-link family; serialize with `1250`.
- **screen:** SAFE.

### q-mp-1250 · Scripts: `PATH_RE` include `.github/` backtick paths

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** serialize after `1249`; leave `#1337` `.mts` alone
- **series:** script-tooling
- **verdict:** **SAFE** — ~49 docs cite `` `.github/…` `` with zero path checks
- **CI / package.json callers:** `package.json` → `check:dev-docs`
- **target files:** `scripts/check-dev-doc-links.mjs` (`PATH_RE`)
- **measured baseline:** `` `.github/workflows/ci.yml` `` → no match; `` `scripts/check-build.mjs` `` matches; `rg -l '\`\\.github/' docs --glob '*.md' | wc -l` → **49**.
- **acceptance criteria:** Backtick paths under `.github/` are checked like `scripts/`/`docs/`; missing workflow paths surface as `missing-path`; existing allowlist entries unchanged.
- **verification commands:** hermetic `PATH_RE` tests; `npm run check:dev-docs`
- **conflict notes:** not md-link destination parsing; not tip-name theater.
- **screen:** SAFE.

### q-mp-1251 · Scripts: offline prod `classify` recognize Vite `game-<id>-*.js` chunks

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** none; **do not** edit check-build `offlineNeededPaths` (`1226`)
- **series:** script-tooling
- **verdict:** **SAFE** — lazy game chunk failures mis-bucketed as menu `js`
- **CI / package.json callers:** local `node scripts/probe-offline-resilience.mjs` (report-only; not a CI job step)
- **target files:** `scripts/probe-offline-resilience.mjs` (`classify`)
- **measured baseline:** `http://x/assets/game-hex-Ba7.js` → `js` (pattern wants `game-controller|\.worker|/games/`, not Vite `game-<id>-*.js`).
- **acceptance criteria:** Built `game-<id>-*.js` (and tip-owner-approved siblings) → `lazy-game-chunk`; true menu/vendor `.js` stay `js`; no wait-clear / mountPair edits.
- **verification commands:** hermetic classify extract / unit; leave e2e alone
- **conflict notes:** not `1226` needed-paths list; serialize with `1252`.
- **screen:** SAFE.

### q-mp-1252 · Scripts: align offline prod vs dev `classify` for `*.worker*`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** serialize after `1251`
- **series:** script-tooling
- **verdict:** **SAFE** — same worker URL → prod `lazy-game-chunk`, dev `js`
- **CI / package.json callers:** `probe-offline-resilience.mjs` / `probe-offline-resilience-dev.mjs` (local report-only)
- **target files:** `scripts/probe-offline-resilience.mjs`, `scripts/probe-offline-resilience-dev.mjs` (`classify`)
- **measured baseline:** `hex-ai.worker-Ab.js` → prod `lazy-game-chunk`, dev `js` (dev omits `\.worker`).
- **acceptance criteria:** Shared kind for worker URLs (extract shared helper or mirror regex); game-controller paths unchanged.
- **verification commands:** hermetic both classifiers on the same URL set
- **conflict notes:** serialize after `1251`; not wait clears.
- **screen:** SAFE.

### q-mp-1253 · Scripts: `resolveSizeCheckExitCode` fail closed on non-finite / negative `novelCount`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** leave prior `1214` MISSING-as-novel alone; **no** `parseMenuCriticalRefs` edits
- **series:** script-tooling
- **verdict:** **SAFE** — NaN/`-1` novelCount green-washes `--fail-on-new-over`
- **CI / package.json callers:** `package.json` → `size:check` (CI soft via `continue-on-error`)
- **target files:** `scripts/check-bundle-budgets.mjs` (`resolveSizeCheckExitCode`); unit fixtures
- **measured baseline:** `{ novelCount: NaN, failOnNewOver: true }` → `0`; `{ novelCount: -1, … }` → `0`; `{ novelCount: 2, … }` → `1`.
- **acceptance criteria:** Non-finite or negative `novelCount` with `failOnNewOver` → non-zero (or schema error); finite positives unchanged; `failOnNewOver: false` still `0`.
- **verification commands:** `CI=1 npx vitest run tests/unit/*bundle-budget*.test.ts` (or hermetic)
- **conflict notes:** not `1214` MISSING; not menu-critical; serialize with `1265`.
- **screen:** SAFE.

### q-mp-1254 · Scripts: `report-lint-buckets` coerce or reject non-numeric ceilings in headroom

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** none; **do not** edit `check-lint-ratchet.mjs` gate (`1190` / HOLD-CHECK siblings)
- **series:** script-tooling
- **verdict:** **SAFE** — non-numeric ceiling → `NaN` headroom → silent wrong note
- **CI / package.json callers:** `package.json` → `report:lint-buckets` (report-only; not CI)
- **target files:** `scripts/report-lint-buckets.mjs` (headroom print / JSON); unit fixtures
- **measured baseline:** `'abc' - 3` → `NaN`; `headroom > 0` / `< 0` both false → blank note while printing `ceiling abc`.
- **acceptance criteria:** Non-numeric ceilings → explicit error/skip for that rule; numeric ceilings unchanged; **no** ceiling file writes.
- **verification commands:** hermetic headroom helper / fixture ceilings; `npm run report:lint-buckets` on live file still OK
- **conflict notes:** not CI lint-ratchet gate fail-open (screened HOLD-CHECK below).
- **screen:** SAFE.

### q-mp-1255 · Scripts: `flattenKnip` tolerate null / non-object `files` entries

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** leave open `#1339`/`1191` header exit-docs alone; **no** `report-knip` summarizeKnip/diffMetrics edits
- **series:** script-tooling
- **verdict:** **SAFE** — malformed knip `files` aborts the whole inventory
- **CI / package.json callers:** `package.json` → `report:dead-code` (report-only)
- **target files:** `scripts/report-dead-code.mjs` (`flattenKnip`); unit fixtures
- **measured baseline:** `files: [null]` → `TypeError: Cannot read properties of null (reading 'file')`; string entries already OK.
- **acceptance criteria:** Null/non-object entries skipped (or schema error without throw); string + `{file}` shapes unchanged; no knip baseline rewrite.
- **verification commands:** hermetic flatten / export-for-test; `npm run report:dead-code -- --dry-run`
- **conflict notes:** not summarizeKnip family; serialize with `1256`/`1257`.
- **screen:** SAFE.

### q-mp-1256 · Scripts: `verifyCandidate` dynamicHit must not treat `hex ⊂ hex-a-gone`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** serialize after `1255`
- **series:** script-tooling
- **verdict:** **SAFE** — substring `includes(gameId)` false-keeps candidates
- **CI / package.json callers:** `package.json` → `report:dead-code`
- **target files:** `scripts/report-dead-code.mjs` (`verifyCandidate` dynamic-import check)
- **measured baseline:** `gameId='hex'` + dyn `../games/hex-a-gone/index` → `d.includes('hex')` → **true** dynamicHit.
- **acceptance criteria:** Match game id on path segment boundaries (e.g. `/games/hex/` or `games/hex` end); real `../games/hex/…` still hits; no Rank-3 demote theater.
- **verification commands:** hermetic verifyCandidate / unit with fixture dyn list
- **conflict notes:** serialize after `1255`; not knip baseline.
- **screen:** SAFE.

### q-mp-1257 · Scripts: `scanTestHelpers` track public name of `export { a as b }`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** serialize after `1256`
- **series:** script-tooling
- **verdict:** **SAFE** — importers use `b` but scanner greps `a` → false unused / missed public symbol
- **CI / package.json callers:** `package.json` → `report:dead-code`
- **target files:** `scripts/report-dead-code.mjs` (`scanTestHelpers` export `{…}` parse)
- **measured baseline:** `export { helper as usefulHelper }` → `split(/\s+as\s+/)[0]` → tracks `helper` only.
- **acceptance criteria:** Record the exported public name (`usefulHelper`); tip-owner may also keep local for internal use checks; `export { foo }` unchanged.
- **verification commands:** hermetic parse fixture; dry-run inventory still completes
- **conflict notes:** serialize after `1256`.
- **screen:** SAFE.

### q-mp-1258 · Scripts: Calla deep-playtest end regex must not match “Drawing” / “patience”

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** none; **do not** expand nav-away game list (`1070`); no AI timing changes
- **series:** script-tooling
- **verdict:** **SAFE** — harness false-ends mid-hand
- **CI / package.json callers:** `package.json` → `playtest:calla` (local; not blocking CI)
- **target files:** `scripts/calla-deep-playtest.mjs` (end / phase text matchers using `/win|tie/i`)
- **measured baseline:** `/win|tie/i.test('Drawing card')` → true; `/win|tie/i.test('patience')` → true; real “You win!” / “tie” still true.
- **acceptance criteria:** Word-boundary / phrase matchers (tip-owner wording) so Drawing/patience no longer end the run; true win/tie copy still detected; no rules/AI edits.
- **verification commands:** hermetic regex unit; optional short `playtest:calla` smoke if env allows
- **conflict notes:** not deep-playtest-cli-help spawn (`1062`); not waitForTimeout clears.
- **screen:** SAFE.

### q-mp-1259 · Scripts: Stars/Ramrod/Par-55/Sum-Dominoes end regexes need word boundaries

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** none; serialize with `1260` if both touch `par-55-deep-playtest.mjs`
- **series:** script-tooling
- **verdict:** **SAFE** — substring `tie`/`draw` ends games early
- **CI / package.json callers:** `playtest:stars-bars` / `playtest:ramrod` / `playtest:par-55` / `playtest:sum-dominoes` (local)
- **target files:** `scripts/stars-bars-deep-playtest.mjs`, `scripts/ramrod-deep-playtest.mjs`, `scripts/par-55-deep-playtest.mjs`, `scripts/sum-dominoes-deep-playtest.mjs` (end detectors)
- **measured baseline:** patterns include `/tie|draw/i`, `/wins!|draw|tie/i`; `'patience'` / `'Drawing card'` → true.
- **acceptance criteria:** Word-boundary or phrase matchers; real win/tie/draw banners still match; no product copy / rules edits.
- **verification commands:** hermetic regex unit per harness; no AI search changes
- **conflict notes:** serialize with `1260` on par-55 file; not `1070` game-list expansion.
- **screen:** SAFE.

### q-mp-1260 · Scripts: `PAR55_QUICK` must not treat `'0'` / `'false'` as enabled

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** serialize after `1259` if shared file
- **series:** script-tooling
- **verdict:** **SAFE** — env disable strings still force 1-game quick mode
- **CI / package.json callers:** `package.json` → `playtest:par-55`
- **target files:** `scripts/par-55-deep-playtest.mjs` (`GAMES_PER_DIFF` / `PAR55_QUICK`)
- **measured baseline:** `PAR55_QUICK='0'` / `'false'` → truthy → `GAMES_PER_DIFF = 1`; unset uses `PAR55_GAMES` path.
- **acceptance criteria:** Only clear truthy enables (`1`/`true`/`yes` — tip-owner chooses); `'0'`/`'false'`/`''` fall through to `PAR55_GAMES`; no `--help` theater.
- **verification commands:** hermetic env matrix; `rg -n 'PAR55_QUICK' scripts/par-55-deep-playtest.mjs`
- **conflict notes:** not env-number lib (`1234`); serialize after `1259`.
- **screen:** SAFE.

### q-mp-1261 · Scripts: offline `waitForUrl` must not treat HTTP 404 as ready

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — preview not up yet / wrong port looks “ready”
- **CI / package.json callers:** `scripts/webkit-offline-probe.mjs` (+ probe-offline\* if shared pattern)
- **target files:** `scripts/webkit-offline-probe.mjs` (`waitForUrl`); align siblings if identical
- **measured baseline:** `res.ok || res.status === 404` → 404 returns success.
- **acceptance criteria:** Ready only on 2xx (or tip-owner-approved SPA fallback that is not bare 404); timeout still throws; no product SW logic edits.
- **verification commands:** hermetic wait helper with mocked fetch; `rg -n 'status === 404' scripts/*offline*`
- **conflict notes:** serialize with `1262`; not classify tickets `1251`/`1252`.
- **screen:** SAFE.

### q-mp-1262 · Scripts: `PROBE_BROWSERS` must trim comma-separated names

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** serialize after `1261`
- **series:** script-tooling
- **verdict:** **SAFE** — `webkit, firefox` throws `unknown browser  firefox`
- **CI / package.json callers:** `scripts/webkit-offline-probe.mjs` (`PROBE_BROWSERS`)
- **target files:** `scripts/webkit-offline-probe.mjs` (browser list parse); share helper if probe-offline\* copies the pattern
- **measured baseline:** `'webkit, firefox'.split(',')` → `['webkit', ' firefox']`; `" firefox" in map` → false → throw.
- **acceptance criteria:** Trim (+ optional lower-case) before map lookup; unknown names still error clearly; default `webkit` unchanged.
- **verification commands:** hermetic parse; `rg -n 'PROBE_BROWSERS|split' scripts/webkit-offline-probe.mjs`
- **conflict notes:** serialize after `1261`; not e2e-cross-browser yaml (`800`).
- **screen:** SAFE.

### q-mp-1263 · Scripts: `resolveArtifactDir` trim `MP_ARTIFACT_DIR` before mkdir

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** none; **do not** adopt mountPair / rewire harness defaults
- **series:** script-tooling
- **verdict:** **SAFE** — spaced env creates awkward roots / confused artifact paths
- **CI / package.json callers:** imported by console-sweep / flake-rate / offline probes / etc. via `scripts/lib/artifact-dir.mjs`
- **target files:** `scripts/lib/artifact-dir.mjs` (`resolveArtifactDir`)
- **measured baseline:** `env.MP_ARTIFACT_DIR = '  spaced  '` → mkdir `'…/  spaced  '` (trim used only for non-empty check).
- **acceptance criteria:** Use trimmed value for path resolution; empty-after-trim falls through; cloud/local fallbacks unchanged; no `--help` theater.
- **verification commands:** `CI=1 npx vitest run tests/unit/*artifact-dir*.test.ts` (or hermetic with fake mkdirSync)
- **conflict notes:** not mountPair adoption family.
- **screen:** SAFE.

### q-mp-1264 · Scripts: `testGlobsForGame('frac-fact')` must exclude difficulty overnight suites

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** leave `#1365`/`1232` games dedupe + `#1351` classifyVitest/`1217` alone; leave `1243` no-tests alone
- **series:** script-tooling
- **verdict:** **SAFE** — header claims difficulty suites excluded; glob pulls one in
- **CI / package.json callers:** `package.json` → `mutation:report` (report-only)
- **target files:** `scripts/mutation-report.mjs` (`testGlobsForGame` frac-fact branch / filter)
- **measured baseline:** `overnight-wave54-frac-rules-*.test.ts` expands to include `…-difficulty-operand-denoms.test.ts` (4 files total).
- **acceptance criteria:** Difficulty-named suites excluded (filter or tighter glob); other wave54 frac rules files remain; no `*/rules.ts` logic edits; no games-list dedupe sibling.
- **verification commands:** hermetic expandExistingTests / glob list assert; `rg -n 'frac-fact|difficulty' scripts/mutation-report.mjs`
- **conflict notes:** not mutation **games** dedupe (`1232`); not classifyVitest.
- **screen:** SAFE.

### q-mp-1265 · Scripts: `size:check` catch must not force exit 0 under `--fail-on-new-over`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** serialize after `1253`; leave `1214` alone
- **series:** script-tooling
- **verdict:** **SAFE** — measurement throws → greenwash even when soft gate requested
- **CI / package.json callers:** `package.json` → `size:check` (CI soft `--fail-on-new-over`)
- **target files:** `scripts/check-bundle-budgets.mjs` (`main` catch)
- **measured baseline:** `catch` sets `process.exitCode = 0` unconditionally after logging the error.
- **acceptance criteria:** With `--fail-on-new-over`, catch → non-zero (2 or 1 — tip-owner chooses); without flag, tip-owner may keep report-only 0; usage/missing-dist paths unchanged.
- **verification commands:** hermetic main with injected throw; `rg -n 'catch|exitCode' scripts/check-bundle-budgets.mjs`
- **conflict notes:** serialize after `1253`; not menu-critical; not hard 250 kB budget.
- **screen:** SAFE.

### q-mp-1266 · Scripts: phase-2 export `--check` fail closed when baseline omits `outOfScopeErrors`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** none; leave `check-type-ratchet` string/nested HOLD-CHECK screened
- **series:** script-tooling
- **verdict:** **SAFE** — `216 > undefined` is false → silent pass
- **CI / package.json callers:** `docs/dev/type-ratchet-phase2-export.mjs --check` (local helper; not a CI job step)
- **target files:** `docs/dev/type-ratchet-phase2-export.mjs` (`--check` block / `prevTotal`)
- **measured baseline:** `prevTotal = prev.outOfScopeErrors` (no nested/`typeof` guard); `outOfScope.length > undefined` → false → no FAIL.
- **acceptance criteria:** Missing/non-numeric baseline field → explicit FAIL or schema error; numeric baseline still ratchets down-only; nested `totals` optional if tip-owner aligns with check-type-ratchet.
- **verification commands:** hermetic fixture baseline JSON; `rg -n 'prevTotal|outOfScopeErrors' docs/dev/type-ratchet-phase2-export.mjs`
- **conflict notes:** not live `typecheck:ratchet` gate edits (HOLD-CHECK if attempted).
- **screen:** SAFE.

### q-mp-1267 · Docs: README CI posture match live soft + report-only jobs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** none; leave tip-name pointer theater alone
- **series:** docs-accuracy
- **verdict:** **SAFE** — front-door README understates CI
- **CI / package.json callers:** none (docs); truth in `.github/workflows/ci.yml` + `AGENTS.md`
- **target files:** `README.md` (Status / CI bullet + lint:ratchet one-liner if not owned by `1268`)
- **measured baseline:** README CI bullet lists lint/build/unit/e2e + mobile/cross/fullgame/visual; omits report-only `knip`, `zoom-reflow`, `forced-colors`; omits soft `check:copy-pins -- --fail` and soft `check:pwa-manifest`. Live `ci.yml` + `AGENTS.md` / `development.md` L130 already name the report-only set (soft pins/PWA still under-documented in README).
- **acceptance criteria:** README CI posture matches AGENTS/ci.yml for soft + report-only jobs (brief); no suite **count** remasure; no tip-name edits.
- **verification commands:** `rg -n 'knip|zoom-reflow|forced-colors|copy-pins|pwa-manifest' README.md .github/workflows/ci.yml`
- **conflict notes:** serialize with `1268`; not wiki count remasure.
- **screen:** SAFE.

### q-mp-1268 · Docs: `lint:ratchet` is a 12-rule ceiling set, not curly-only

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** serialize after `1267` if both touch README
- **series:** docs-accuracy
- **verdict:** **SAFE** — contributors think only curly is ratcheted
- **CI / package.json callers:** docs only; gate owned by CI `lint` via `npm run lint:ratchet`
- **target files:** `README.md`, `docs/wiki/development.md` (lint:ratchet one-liner), `docs/dev/ci-gates-mermaid-q-mp-073.md` (“catches” curly-only row)
- **measured baseline:** README L90 + development.md L41 say “curly:all ceiling”; mermaid L71 “curly `all` ratchet ceiling”; live `docs/dev/lint-ratchet-ceilings.json` has **12** rules including `eqeqeq: 1`, `return-await: 3`.
- **acceptance criteria:** Docs state multi-rule ceilings (point at ceilings JSON); no ceiling value remasure / no key clears; CI permissions untouched.
- **verification commands:** `rg -n 'curly:all|lint:ratchet' README.md docs/wiki/development.md docs/dev/ci-gates-mermaid-q-mp-073.md` ; `node -e 'console.log(Object.keys(require("./docs/dev/lint-ratchet-ceilings.json").rules).length)'`
- **conflict notes:** serialize after `1267`; not inventory remasure theater beyond wording.
- **screen:** SAFE.

### q-mp-1269 · Docs: `eslint-off-rules-inventory.md` match live ceilings (`eqeqeq` / `return-await`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** none; on implement leave open `#740` with `superseded` / `contained` comment (do not close)
- **series:** docs-accuracy
- **verdict:** **SAFE** — inventory contradicts `lint-ratchet-ceilings.json`
- **CI / package.json callers:** none (docs)
- **target files:** `docs/dev/eslint-off-rules-inventory.md` (+ cross-link `eslint-non-ceilinged-residuals-*.md` if it still lists them as non-ceilinged)
- **measured baseline:** L34 `return-await` “not yet ceilinged”; L90 lists `eqeqeq` / `return-await` as non-ceilinged; table still shows nnnull **254** / void **132** / dup **105** / shadow **13** vs live ceilings **237 / 47 / 42 / 3**; live `eqeqeq: 1`, `return-await: 3`.
- **acceptance criteria:** Ceilinged rules listed under ratchets with live ceilings (or clearly marked historical + pointer to ceilings JSON); non-ceilinged addendum no longer claims `eqeqeq`/`return-await`; no product lint clears.
- **verification commands:** `rg -n 'not yet ceilinged|return-await|eqeqeq' docs/dev/eslint-off-rules-inventory.md` ; compare to ceilings JSON
- **conflict notes:** not new ceiling-key clears; not tip-name stamps.
- **screen:** SAFE.

### q-mp-1270 · Docs: tip-vs-alpha `PLAYER_FACING_COPY` 32 vs 38 label primary vs any

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2590`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — counts table disagrees with section header / JSON
- **CI / package.json callers:** none (docs)
- **target files:** `docs/dev/tip-vs-alpha-audit-2026-10-08.md` (+ companion JSON if present)
- **measured baseline:** counts table `PLAYER_FACING_COPY` **32**; section header `(38)`; JSON `by_primary_classification: 32`, `by_any_classification: 38` (6 secondary-only).
- **acceptance criteria:** Counts table labels primary vs any (or shows both); section header matches the metric it enumerates; no tip-name pointer edits; no player-facing copy product changes.
- **verification commands:** `rg -n 'PLAYER_FACING_COPY' docs/dev/tip-vs-alpha-audit-2026-10-08.md`
- **conflict notes:** not wiki **count** remasure; docs consistency only.
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict  | Title (short)                                                    |
| ----------- | -------- | ---------------------------------------------------------------- |
| `q-mp-1246` | **SAFE** | check-perf: reject out-of-range LH scores                        |
| `q-mp-1247` | **SAFE** | ratchet-history: typePhase2 nested totals                        |
| `q-mp-1248` | **SAFE** | ratchet-history: mergeHistory null-overwrite                     |
| `q-mp-1249` | **SAFE** | check-dev-docs: symbolInSource default/namespace                 |
| `q-mp-1250` | **SAFE** | check-dev-docs: PATH_RE include `.github/`                       |
| `q-mp-1251` | **SAFE** | offline prod classify: Vite `game-*.js` lazy                     |
| `q-mp-1252` | **SAFE** | offline classify: prod vs dev worker parity                      |
| `q-mp-1253` | **SAFE** | size:check: fail-closed non-finite novelCount                    |
| `q-mp-1254` | **SAFE** | lint-buckets: non-numeric ceiling headroom                       |
| `q-mp-1255` | **SAFE** | dead-code: flattenKnip null files entries                        |
| `q-mp-1256` | **SAFE** | dead-code: verifyCandidate hex⊂hex-a-gone                        |
| `q-mp-1257` | **SAFE** | dead-code: scanTestHelpers export `{ a as b }`                   |
| `q-mp-1258` | **SAFE** | calla deep-playtest: end regex false positives                   |
| `q-mp-1259` | **SAFE** | multi deep-playtest: tie/draw word boundaries                    |
| `q-mp-1260` | **SAFE** | par-55: PAR55_QUICK `'0'`/`'false'`                              |
| `q-mp-1261` | **SAFE** | offline waitForUrl: 404 ≠ ready                                  |
| `q-mp-1262` | **SAFE** | webkit-offline: PROBE_BROWSERS trim                              |
| `q-mp-1263` | **SAFE** | artifact-dir: trim MP_ARTIFACT_DIR                               |
| `q-mp-1264` | **SAFE** | mutation-report: frac-fact exclude difficulty glob               |
| `q-mp-1265` | **SAFE** | size:check: catch must not exit 0 under fail-on-new-over         |
| `q-mp-1266` | **SAFE** | phase2-export --check: missing outOfScopeErrors fail-closed      |
| `q-mp-1267` | **SAFE** | docs: README CI soft + report-only posture                       |
| `q-mp-1268` | **SAFE** | docs: lint:ratchet 12-rule ceilings wording                      |
| `q-mp-1269` | **SAFE** | docs: eslint-off inventory match live ceilings                   |
| `q-mp-1270` | **SAFE** | docs: tip-vs-alpha PLAYER_FACING_COPY 32 vs 38                   |

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic | Why not queued |
| ----- | -------------- |
| `check-lint-ratchet` non-numeric string ceiling → status FAIL but exit 0 | CI-gating script live verdict |
| `check-type-ratchet` string / abs-path `IN_SCOPE` fail-open | CI-gating type ratchet |
| `check-boundaries` `UI_REEXPORT` misses named / `export * as`; `classify` abs paths → `other` | CI-gating boundaries; abs/tutorial siblings of `1201`–`1204`/`1220` |
| `check-emit-identity` default merge-base still `integration-fold-wave5-tip-4af0`; `missing-base` → `ok: false` for new ai files | HOLD-CHECK tip-owner / AI-adjacent; `1110` demotes stay prior |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Out of scope / not used here

Already claimed / in-flight / HOLD / no headroom / prompt-skipped families: au `1222`–`1245` + `#1364`/`#1365`, at `1197`–`1220`, as `1172`–`1191`, ar `1147`–`1163`, aq `1122`–`1137`, ap/ao residuals, void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets **gate** fail-open (screened), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, tip-name pointers, UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e** wait clears, harness shards, demo coverage, page-ready / double-rAF / artifact-dir **adoptions** / mountPair / npm aliases / `--help`/`--dry-run`/argv / empty-input / lib main-entry / cli-help spawn speedups, license-classifier siblings, pwa-manifest-contract / check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas, prototype-restore after direct assigns, engine-coverage-rank, report-coverage-map, ratchet-history **ceilings** (`1230`/`1231`), env-number, render-perf/runtime-perf, mobile-audit, console-sweep, mutation-report **games**, deep-playtest `waitForTimeout`, overnight mountPair/router batches, rounds ≤47 through `q-mp-1245`, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), nav-away games (`1070`), emit-identity export demotes (`1110`), stars-bars / memory-leak / runtime-perf / webkit-offline / probe-offline **wait** clears (prior HOLD/skip), AI timing / Hex Hard 450ms / Stars & Bars history cap, cancelFabAiRequests knip LEAVE (AI HOLD), visual-baseline PNG refresh (`1050`), canvas-dpr WebKit skip (`1051`), offsetWidth (`1135`), scrollIntoView (`1180`), getContext (`1181`), flake `flaky` (`1183`), FUZZ_PLAY_SEEDS / formatSummaryMarkdown (`1185`/`1186`), boundaries HOLD-CHECK (`1201`–`1204`/`1220`), size soft MISSING (`1214`), offlineNeededPaths `.mjs` (`1226` — distinct from classify kind; not re-queued).

Filled to **25** with measured wrong-results + docs mismatches only — no filler from exhausted families.
