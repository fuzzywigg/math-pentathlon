# Engineering backlog — 2026-10-11ba (tip refill after az fold / round-53)

**Task id:** `q-mp-090ba`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post38d2` @ `b6afb7ab` (full `b6afb7ab374ff6a182b98ca0edc0fb45ad7abe3f`; tip cut from `alpha` @ `38d22ce0`; living pointers set by `q-mp-026ag`; az backlog already on tip; round-52 SAFE implementers largely folded into this tip)  
**Depends on:** tip `cursor/mp-tip-post38d2` @ `b6afb7ab`. Round-52 backlog (`q-mp-090az` / open `#1448` on old tip `postc4a7`, ids `q-mp-1331`…`1355`) — leave with `contained`; tip-folding az SAFE implementers (`#1451`–`#1470` still listed open as drafts while tip already carries their commits) — **do not** re-queue. Round-51 (`q-mp-090ay` / `#1432`, ids `1310`…`1330`) and earlier — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post38d2` @ `b6afb7ab` measures unit files **3458**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**. This doc lists **22 new** concrete engineering tasks (`q-mp-1356` … `q-mp-1377`) mined from the **live tip tree**, checked against prior refills through `q-mp-1355` (az on tip + implementers `#1451`–`#1470`), and against the full open draft PR list. It is the **only** deliverable of `q-mp-090ba`.

**Honest count:** **22** tasks (not 25) with measured wrong-results / A/B leaks / slow-test shards — not padded from exhausted families. Id range starts at `q-mp-1356` per round-53 brief. Round-52 already claimed heap truncated nodes, console-sweep summary, emit parseArgs value-slot, check-build chunk/html/health, probe browsers, offline mount ints, flake-loop corrupt/failed/dup flags, type Phase-2 string ceiling, CONTRIBUTING/AGENTS PR base, queens-a2 / fab / engine-property shards, `PLAYTEST_SEED_ENV`, document.hidden / ric / viewport / visibilityState / onLine restores, withSeededRandom/withOracleRandom thenables, ai-calibration OUT date — **do not** re-queue `1331`–`1355`. This refill **does not** re-queue exhausted families from the round-53 brief (including az’s list): `--help`/argv/empty-input theater, cli-help spawn speedups, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed, license-classifier prose, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache audits, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas, prototype-restore after direct assigns, engine-coverage-rank, report-coverage-map, ratchet-history ceilings, env-number, render-perf/runtime-perf, mobile-audit, console-sweep, mutation-report games, ratchet-history mergeHistory, check-dev-doc-links, probe-offline classify, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest end regexes, webkit-offline-probe, artifact-dir, README CI posture/lint-ratchet docs, PATH_RE root configs, PLAYTEST\_\* env docs, hex mutation globs, flattenKnip issues, eslint probe path, fab/fraction-pinball/calibration env parsing, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl, emit-identity minify, ratchet-history lint keys, queens fuzz wall, runLighthouse JSON, waitForGameReady load-error, offline probe board/recovered, offline-dev date, report-licenses maps, mapGameChunks, emit-identity base, withSeededRandom, storage-stubs, hex-ui styles, playtest BASE join/seed, queens e2e seed, type-ratchet phase2 docs, engine-property immutability, heap self_size, typePhase2 coercion, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty stdout, mutation ARITH/infra-error/dead export, playtest OUT date, reporter BOM, mutation --max sci-notation, matchMedia restore, queens seed-B shard, emit ++/-- spacing, ai-calibration unknown winners, lint/type-ratchet fail-open, heap truncated nodes, console-sweep summary, emit-identity parseArgs, check-build chunk/html/health, probe browsers, offline mount ints, flake-loop corrupt JSON/failed/duplicate flags, CONTRIBUTING PR base, queens/fab/engine-property shards, PLAYTEST_SEED_ENV, document.hidden/requestIdleCallback/innerWidth/visibilityState/navigator.onLine restores, withSeededRandom/withOracleRandom thenables, ai-calibration OUT date. No NaN/null-coercion micro-fixes unless real data hits them.

**Fresh payoffs on this tip (re-measured @ `b6afb7ab` after az queue + tip folds of `#1451`–`#1470`):** **`scanEnvLeakage` still skips `.mjs` (and `.cjs`/`.json`) while offline path list includes `.mjs`**, **emit-identity default merge-base still targets dead `origin/cursor/integration-fold-wave5-tip-4af0` → 21 AI files vs `HEAD` → 0**, **mutation CLI silently last-wins on duplicate `--max`/`--timeout`/`--games`/`--json=`**, **`--json=--dry-run` accepted as a path**, **`report-lint-buckets` duplicate `--top`/`--rule` last-wins**, **`parseLhReportJson` / `analyzeHeapSnapshot` reject UTF-8 BOM** (reporter BOM already fixed), **burn-1007 + residual suites still leak `document.hidden` / `visibilityState` / `navigator.serviceWorker`** (A/B; not the az 1346/1354 file sets), **`undo-audit-polyomino-props` ~605ms**, **fab fuzz file still ~1186ms after 1344 shard**, **games fuzz pent/fiar/juggle ~417–562ms**, **`ai-typeonly-option.md` still shows bare `npx tsc` for ratchet**, **`collectHtmlNonRootAssetRefs` misses `poster`/`srcset`**, **`check-perf` `measureAllChunks` skips `.mjs`**, **memory-leak `prepareMenu` mashing `baseURL/` → `//?board3d=1`**, **calla deep-playtest still uses `PLAYTEST_BASE_URL`/`localhost` while peers use `PLAYTEST_BASE`/`127.0.0.1`**, **emit `parseArgs` duplicate `--base`/`--head` last-wins**, **`isHttpResponseReady({ok:true,status:404})` → true**, **`shapeLhPerformanceScore` rejects numeric string scores as “missing”**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake/restore hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids (`1201`–`1204`/`1214`/`1220`) — do not sibling. Ratchet-history chart keys stay prior; mergeHistory stay prior. Ay/az lint/type fail-open + Phase-2 string ceiling (`1328`–`1330` / `1341`) stay prior — **do not** sibling.

## Duplicate check (do not re-queue)

| Topic family                                                                          | Why skipped                                                             |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| round-52 az `1331`–`1355` (+ `#1448`; tip drafts `#1451`–`#1470`, many folded on tip) | leave with `contained`; this refill’s tickets are **new** surfaces only |
| round-51 ay `1310`–`1330` / ax `1292`–`1309` / aw–ao residuals                        | leave with `contained`                                                  |
| check-build listChunk `.mjs` / unquoted `src`/`href` / `health.txt` (`1334`–`1336`)   | folded on tip (`8d67403a`); poster/srcset + env-leak ext set are new    |
| flake dup `--runs`/`--out` (`1353` / `#1470` folded)                                  | unit `VALUE_FLAGS` already includes `--shuffle`; do not sibling         |
| document.hidden idle-warm/burn-r5/tablet-gl (`1346`)                                  | residual offenders outside that file set are new (`1364`)               |
| mutation-ui pwa-register `visibilityState` (`1354`)                                   | `q-mp-484` / burn-1007 / serviceWorker residuals are new                |
| fab shard out of games (`1344`)                                                       | fab **file** still ~1.2s — further shard is new (`1367`)                |
| emit parseArgs value-slot (`1333`) / invalid-base (`1301`) / `++` (`1326`)            | stale default merge-base + duplicate `--base`/`--head` are new          |
| heap truncated / self_size (`1331`/`1310`) / reporter BOM (`1321`)                    | heap/LH **BOM ingest** residuals are new                                |
| CONTRIBUTING vs AGENTS (`1342`)                                                       | folded on tip — do not re-queue                                         |
| boundaries `1201`–`1204`/`1220` stripComments/`typeof import`                         | leave prior ids — **do not** sibling                                    |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions | hard-rule HOLD                                                          |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `b6afb7ab`)

| Id                                   | Title (short)                        | Verdict                        | Evidence @ `b6afb7ab`                                        |
| ------------------------------------ | ------------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| `q-mp-090az` / `#1448`               | round-52 backlog                     | **open on old tip `postc4a7`** | This refill starts at `1356`; do not re-queue `1331`–`1355`. |
| `#1451`–`#1470`                      | az SAFE implementers into `post38d2` | **open drafts; tip has folds** | Leave with `contained`.                                      |
| `q-mp-090ay` / `#1432`               | round-51 backlog                     | **open on `postc4a7`**         | leave with `contained`.                                      |
| `q-mp-1201`…`1204` / `1220` / `1214` | boundaries + size soft-gate          | **still-valid; no tip PR yet** | Leave prior ids — **do not** re-queue.                       |
| `q-mp-1309`                          | engine-property fingerprint before   | **still-valid HOLD-CHECK**     | Leave prior id — do not sibling.                             |
| `q-mp-1328`…`1330` / `1341`          | lint/type ratchet fail-open / string | **still-valid HOLD-CHECK**     | Leave prior ids — do not sibling.                            |
| knip unusedExports                   | live `--json`                        | **3 LEAVE**                    | No new SAFE demote (az demoted `PLAYTEST_SEED_ENV`).         |

## Shared-file conflict flags

| Shared file                                     | Conflicting new ids                                |
| ----------------------------------------------- | -------------------------------------------------- |
| `scripts/check-build.mjs`                       | `1356` + `1369` — serialize                        |
| `scripts/check-emit-identity.mjs`               | `1357` + `1373` — serialize; leave `#1455` alone   |
| `scripts/lib/mutation-report-args.mjs`          | `1358` + `1359` — serialize                        |
| `scripts/report-lint-buckets.mjs`               | `1360` only                                        |
| `scripts/check-perf.mjs`                        | `1361` + `1370` + `1375` — serialize               |
| `scripts/lib/memory-leak-heap.mjs`              | `1362` — leave folded `1331`/`1310` alone          |
| `tests/unit/burn-1007-pwa-shell-ui.test.ts`     | `1363` only                                        |
| residual `document.hidden` suites               | `1364` — one PR or serialize                       |
| `navigator.serviceWorker` / `q-mp-484` suites   | `1365` — one PR or serialize                       |
| `tests/unit/undo-audit-polyomino-props.test.ts` | `1366` only                                        |
| `tests/unit/state-roundtrip-fuzz-fab.test.ts`   | `1367` — leave games-file `1344` alone             |
| `tests/unit/state-roundtrip-fuzz-games.test.ts` | `1368` only                                        |
| `docs/dev/ai-typeonly-option.md`                | `1371` only; **not** tip-name pointer remasure     |
| `scripts/memory-leak-audit.mjs`                 | `1372` only; **not** heap delta theater            |
| `scripts/calla-deep-playtest.mjs`               | `1374` only; **not** PLAYTEST\_\* env docs theater |
| `scripts/lib/offline-probe-ready.mjs`           | `1376` — leave folded `1337` alone                 |

**Parallel-friendly:** `1356`, `1360`, `1361`, `1362`, `1363`, `1366`, `1367`, `1368`, `1369`, `1370`, `1371`, `1372`, `1374`, `1375`, `1364`, `1365`, `1376`. Serialize `1357`→`1373`; `1358`→`1359`; `1361`→`1370`→`1375` if same PR preferred.

## Live tip measurements (evidence snapshot @ `b6afb7ab`)

```text
$ git rev-parse HEAD
  b6afb7ab374ff6a182b98ca0edc0fb45ad7abe3f

$ git branch --show-current
  cursor/mp-tip-post38d2 (audited) / cursor/backlog-2026-10-11ba-83f6 (this PR)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3458

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ scanEnvLeakage(dist with a.js + b.mjs leaks) → only assets/a.js
$ parseArgs([]) emit default base → eec2b327… (wave5 merge-base); listAiTouchedFiles → 21 vs HEAD → 0
$ parseMutationReportArgs(['--max=10','--max=20']) → max:20 ok
$ parseMutationReportArgs(['--json=--dry-run']) → jsonOut:'--dry-run' ok
$ parseLintBuckets(['--top','2','--top','9']) → top:9
$ parseLhReportJson('\uFEFF{…}') → ok:false; analyzeHeapSnapshot(BOM) throws
$ A/B unit-shared: burn-1007 → ownH+ownV; q-mp-615/256 → ownH; q-mp-484 → ownV+swOwn; burn-1009 → swOwn
$ polyomino undo-audit ~605ms; fab fuzz file ~1186ms; games pent ~562ms / fiar ~489ms / juggle ~417ms
$ collectHtmlNonRootAssetRefs(poster|srcset) → []; measureAllChunks filter omits .mjs
$ prepareMenu mash: http://127.0.0.1:4173//?board3d=1#/
$ calla: PLAYTEST_BASE_URL / localhost; peers: PLAYTEST_BASE / 127.0.0.1
$ isHttpResponseReady({ok:true,status:404}) → true
$ shapeLhPerformanceScore({score:'0.91'}) → missing score

$ Open drafts into cursor/mp-tip-post38d2 at audit: #1451–#1470 (az implementers; tip already folded most)
$ Round-52 backlog still open on postc4a7: #1448
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090ba-repros.log`.

## New tasks

### q-mp-1356 · Scripts: `scanEnvLeakage` must scan `.mjs` (and `.cjs`) assets

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave folded `1334`–`1336` alone; serialize with `1369` if same file
- **series:** script-tooling
- **verdict:** **SAFE** — env-leak audit false-negatives module chunks the offline list already tracks
- **CI / package.json callers:** `package.json` → `check:build` (report-only)
- **target files:** `scripts/check-build.mjs` (`scanEnvLeakage`)
- **measured baseline:** planted `/workspace` in `assets/a.js` + `assets/b.mjs` → only `a.js` reported; filter is `/\.(js|css|html|webmanifest|txt)$/`.
- **acceptance criteria:** Include `.mjs` (and `.cjs` if shipped); hermetic unit; not a precache-parser rewrite; optional `.json` only if tip-owner wants (offlineNeeded omits bare `.json` today).
- **verification commands:** hermetic unit; `rg -n 'scanEnvLeakage|js\\|css\\|html' scripts/check-build.mjs`
- **conflict notes:** beyond folded chunk-name/html/health; env-leak extension set only.
- **screen:** SAFE.

### q-mp-1357 · Scripts: emit-identity default merge-base must not use dead wave5 tip

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1373`; leave folded `#1455`/`1333` value-slot alone; **not** tip-name pointer docs remasure
- **series:** script-tooling
- **verdict:** **SAFE** — default `check:emit-identity` diffs against a stale remote tip and invents AI DIFFs
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local / report-only; not CI.yml)
- **target files:** `scripts/check-emit-identity.mjs` (default merge-base fallback ~L677–680)
- **measured baseline:** `parseArgs([])` → base `eec2b327…` via `origin/cursor/integration-fold-wave5-tip-4af0`; `listAiTouchedFiles(stale)` → **21** files; `listAiTouchedFiles('HEAD')` → **0** on clean tip WT.
- **acceptance criteria:** Default base follows living tip name from `AGENTS.md` / `origin/cursor/mp-tip-post38d2` (or `origin/alpha`) with clear fallback; no docs tip-pointer table rewrite; explicit `--base` unchanged.
- **verification commands:** hermetic `parseArgs([])` unit; `rg -n 'integration-fold-wave5|merge-base' scripts/check-emit-identity.mjs`
- **conflict notes:** wrong default ref in code (wrong AI file set), not living tip-pointer markdown theater.
- **screen:** SAFE.

### q-mp-1358 · Scripts: mutation-report args must reject duplicate value flags

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1359`; leave sci-notation `--max` / ARITH alone
- **series:** script-tooling
- **verdict:** **SAFE** — `--max=10 --max=20` / duplicate `--games` / `--json=` silently last-wins
- **CI / package.json callers:** `package.json` → mutation-report scripts via `scripts/lib/mutation-report-args.mjs`
- **target files:** `scripts/lib/mutation-report-args.mjs` (`parseMutationReportArgs`)
- **measured baseline:** `['--max=10','--max=20']` → `{ok:true, max:20}`; `['--games=hex','--games=pent']` → `games:['pent']`; `['--json=a.json','--json=b.json']` → `jsonOut:'b.json'`.
- **acceptance criteria:** Duplicate `--max` / `--timeout` / `--games` / `--json` → `ok:false` / usage; single valid flag unchanged.
- **verification commands:** hermetic unit; `rg -n 'parseMutationReportArgs|max|jsonOut' scripts/lib/mutation-report-args.mjs`
- **conflict notes:** duplicate-flag honesty; not mutation games dedupe / ARITH / sci-notation.
- **screen:** SAFE.

### q-mp-1359 · Scripts: mutation `--json=` must not accept flag-like paths

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize after `1358`
- **series:** script-tooling
- **verdict:** **SAFE** — `--json=--dry-run` stores a non-path and can confuse later writes
- **CI / package.json callers:** mutation-report via `parseMutationReportArgs`
- **target files:** `scripts/lib/mutation-report-args.mjs`
- **measured baseline:** `['--json=--dry-run']` → `{ok:true, jsonOut:'--dry-run'}`.
- **acceptance criteria:** Values starting with `-` (or empty) → error; normal paths unchanged; peer of emit value-slot honesty.
- **verification commands:** hermetic unit; `rg -n 'jsonOut|--json=' scripts/lib/mutation-report-args.mjs`
- **conflict notes:** flag-like value slot only; not duplicate `--json` (`1358`).
- **screen:** SAFE.

### q-mp-1360 · Scripts: lint-buckets must reject duplicate `--top` / `--rule`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave empty-stdout `1317` alone
- **series:** script-tooling
- **verdict:** **SAFE** — `--top 2 --top 9` silently keeps `9`
- **CI / package.json callers:** `package.json` → `report:lint-buckets` (report-only)
- **target files:** `scripts/report-lint-buckets.mjs` (`parseArgs`)
- **measured baseline:** `parseArgs(['--top','2','--top','9'])` → `{ok:true, top:9}`; `['--rule','a','--rule','b']` → `rule:'b'`.
- **acceptance criteria:** Second `--top` / `--rule` → `ok:false` with clear message; single flags unchanged.
- **verification commands:** hermetic unit; `rg -n 'function parseArgs|--top|--rule' scripts/report-lint-buckets.mjs`
- **conflict notes:** duplicate value flags only; not empty eslint stdout / ceiling headroom.
- **screen:** SAFE.

### q-mp-1361 · Scripts: `parseLhReportJson` must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1370`/`1375`; leave runLighthouse malformed/stale (`1292`/`1293`) alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM-prefixed LH JSON becomes a row error while vitest reporter already strips BOM
- **CI / package.json callers:** `package.json` → `check:perf` (report-only)
- **target files:** `scripts/check-perf.mjs` (`parseLhReportJson`)
- **measured baseline:** `parseLhReportJson('\uFEFF{"categories":{"performance":{"score":0.5}}}')` → `{ok:false, error: 'malformed Lighthouse JSON: …'}`.
- **acceptance criteria:** Strip leading U+FEFF before `JSON.parse`; valid BOM+JSON → `ok:true`; truly malformed still fails.
- **verification commands:** hermetic unit; `rg -n 'parseLhReportJson|FEFF|BOM' scripts/check-perf.mjs`
- **conflict notes:** BOM ingest parity with `readReporterJson` (`1321`); not LH score-range / missing-score.
- **screen:** SAFE.

### q-mp-1362 · Scripts: `analyzeHeapSnapshot` must accept UTF-8 BOM JSON

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave folded `1331` truncated-nodes / `1310` self_size alone
- **series:** script-tooling
- **verdict:** **SAFE** — CDP / editor-saved snapshots with BOM throw before analysis
- **CI / package.json callers:** `package.json` → `audit:memory` (local / report-only)
- **target files:** `scripts/lib/memory-leak-heap.mjs` (`analyzeHeapSnapshot`)
- **measured baseline:** `analyzeHeapSnapshot('\uFEFF'+JSON.stringify({snapshot:{meta:{node_fields:['name','self_size']}},strings:[],nodes:[]}))` throws `Unexpected token '﻿'…`.
- **acceptance criteria:** Strip BOM; empty valid snapshot still returns finite zeros; truncated-node / self_size behavior unchanged.
- **verification commands:** hermetic unit; `rg -n 'JSON\.parse|FEFF|BOM' scripts/lib/memory-leak-heap.mjs`
- **conflict notes:** BOM ingest only; not truncated-array / self_size / metricDelta.
- **screen:** SAFE.

### q-mp-1363 · Tests: restore `document.hidden` + `visibilityState` after burn-1007 PWA stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave folded `1346` / `1354` file sets alone
- **series:** test-hygiene
- **verdict:** **SAFE** — unit-shared isolate:false leak after burn-1007
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/burn-1007-pwa-shell-ui.test.ts`
- **measured baseline:** A/B `--project unit-shared --maxWorkers=1 --no-file-parallelism`: alone `{ownH:false,ownV:false}`; after burn-1007 `{ownH:true,ownV:true}`.
- **acceptance criteria:** Save/restore both descriptors in `afterEach`; no product PWA behavior change.
- **verification commands:** A/B as above; `rg -n 'hidden|visibilityState|afterEach' tests/unit/burn-1007-pwa-shell-ui.test.ts`
- **conflict notes:** not matchMedia; not az 1346 idle-warm/burn-r5/tablet-gl list.
- **screen:** SAFE.

### q-mp-1364 · Tests: restore `document.hidden` after residual board-3d / idle-warm / PWA soft-fail stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave `#1460`/`1346` alone; serialize file group
- **series:** test-hygiene
- **verdict:** **SAFE** — measured A/B leaks outside the az 1346 file list
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/q-mp-615-queens-guards-board-3d-branch-residuals.test.ts`, `tests/unit/q-mp-358-tablet-gl-soft-fail-residuals.test.ts`, `tests/unit/mutation-ui13-idle-warm.test.ts`, `tests/unit/mutation-ui2-idle-warm.test.ts`, `tests/unit/q-mp-631-idle-warm-residuals.test.ts`, `tests/unit/q-mp-404-idle-warm-pwa-bootstrap-residuals.test.ts`, `tests/unit/q-mp-256-pwa-soft-fail.test.ts`
- **measured baseline:** A/B: alone `ownH:false`; after each listed offender `ownH:true` (q-mp-256 also leaves `swOwn` — see `1365`).
- **acceptance criteria:** Save/restore `document.hidden` descriptor in `afterEach` for each offender; no product behavior change.
- **verification commands:** A/B per file; `rg -n 'document\\.hidden|afterEach' tests/unit/q-mp-615*.test.ts tests/unit/mutation-ui13-idle-warm.test.ts`
- **conflict notes:** residual of `1346`; do not re-edit idle-warm-bootstrap-owl / burn-r5 / tablet-gl.
- **screen:** SAFE.

### q-mp-1365 · Tests: restore `navigator.serviceWorker` (+ `q-mp-484` `visibilityState`) after PWA stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave folded `#1467`/`1354` mutation-ui pwa-register alone
- **series:** test-hygiene
- **verdict:** **SAFE** — sticky `serviceWorker` object / `visibilityState` under isolate:false
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/q-mp-484-pwa-register-soft-fail-residuals.test.ts`, `tests/unit/burn-1009-ui-cov-r6-demos-owl-pwa.test.ts`, `tests/unit/q-mp-256-pwa-soft-fail.test.ts`
- **measured baseline:** A/B: alone `{swOwn:false,ownV:false}`; after 484 `{swOwn:true,ownV:true}`; after burn-1009 `{swOwn:true}`; after 256 `{swOwn:true,ownH:true}`.
- **acceptance criteria:** Save/restore `navigator.serviceWorker` (and 484 `visibilityState`) in `afterEach`; happy-path assertions unchanged; no product SW reload change.
- **verification commands:** A/B as above; `rg -n 'serviceWorker|visibilityState|afterEach' tests/unit/q-mp-484-pwa-register-soft-fail-residuals.test.ts`
- **conflict notes:** not mutation-ui16/pwa-register (`1354`); not matchMedia.
- **screen:** SAFE.

### q-mp-1366 · Tests: shard `undo-audit-polyomino-props` (~605ms case)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** none; **not** queens/fab/engine-property (already queued/folded)
- **series:** test-hygiene
- **verdict:** **SAFE** — measured ~605ms single case
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/undo-audit-polyomino-props.test.ts` (+ optional shard file)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/undo-audit-polyomino-props.test.ts` → case **~605ms**.
- **acceptance criteria:** Split early/late (or equivalent) without dropping coverage; no product undo semantics change.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/undo-audit-polyomino-props*.test.ts`
- **conflict notes:** wall trim only; not AI harness speed.
- **screen:** SAFE.

### q-mp-1367 · Tests: further shard fab fuzz file (~1186ms after 1344)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave folded `#1456`/`1344` games-file move alone
- **series:** test-hygiene
- **verdict:** **SAFE** — fab case still ~1.2s in its own file
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/state-roundtrip-fuzz-fab.test.ts` (+ optional mid/final shards)
- **measured baseline:** same verbose run → fab **~1186ms**.
- **acceptance criteria:** Split seed windows / early-late without dropping fab coverage; no AI/search timing asserts.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/state-roundtrip-fuzz-fab*.test.ts`
- **conflict notes:** residual of `1344`; not queens wall/seed tickets.
- **screen:** SAFE.

### q-mp-1368 · Tests: shard pent / fiar (and optionally juggle) out of fuzz games file

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave folded fab `1344` alone
- **series:** test-hygiene
- **verdict:** **SAFE** — next heaviest non-queens fuzz cases after fab extraction
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/state-roundtrip-fuzz-games.test.ts` (+ optional `state-roundtrip-fuzz-pent*.test.ts` / `fiar*`)
- **measured baseline:** pent **~562ms**, fiar **~489ms**, juggle **~417ms**.
- **acceptance criteria:** Move ≥1 heaviest remaining engine to its own file/shard with identical coverage; games file still covers the rest.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/state-roundtrip-fuzz-games.test.ts tests/unit/state-roundtrip-fuzz-{pent,fiar,juggle}*.test.ts`
- **conflict notes:** not fab file (`1367`); not queens.
- **screen:** SAFE.

### q-mp-1369 · Scripts: `collectHtmlNonRootAssetRefs` must see `poster` / `srcset`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize after `1356` if same PR; leave folded unquoted `src`/`href` (`1335`) alone
- **series:** script-tooling
- **verdict:** **SAFE** — relative poster/srcset assets false-negative the base-path audit
- **CI / package.json callers:** `package.json` → `check:build`
- **target files:** `scripts/check-build.mjs` (`collectHtmlNonRootAssetRefs`)
- **measured baseline:** `<video poster="assets/p.png">` → `[]`; `<img srcset="assets/a.png 1x">` → `[]`; quoted `src` still works.
- **acceptance criteria:** Collect relative `poster` and `srcset` candidate URLs (tokenizer-lite OK); quoted `src`/`href` unchanged; protocol-relative / root-absolute rules unchanged.
- **verification commands:** hermetic unit; `rg -n 'collectHtmlNonRootAssetRefs|poster|srcset' scripts/check-build.mjs`
- **conflict notes:** attribute-set residual beyond folded unquoted `src`/`href`.
- **screen:** SAFE.

### q-mp-1370 · Scripts: `check-perf` `measureAllChunks` must include `.mjs`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1361`/`1375`; leave check-perf `waitForUrl` / runLighthouse alone
- **series:** script-tooling
- **verdict:** **SAFE** — perf chunk table omits ESM/module assets after build
- **CI / package.json callers:** `package.json` → `check:perf` (report-only)
- **target files:** `scripts/check-perf.mjs` (`measureAllChunks`)
- **measured baseline:** filter `/\.(js|css)$/` — `['a.js','b.mjs','c.css']` → `a.js`+`c.css` only; tip `listChunkNames` already includes `.mjs`.
- **acceptance criteria:** Include `.mjs` alongside `.js`/`.css`; hermetic unit or fixture table; map files still skipped.
- **verification commands:** hermetic unit or `rg -n 'measureAllChunks|\\\\.\\(js\\|css\\)' scripts/check-perf.mjs`
- **conflict notes:** check-perf chunk table parity with folded check-build `listChunkNames`; not waitForUrl / LH JSON theater.
- **screen:** SAFE.

### q-mp-1371 · Docs: `ai-typeonly-option.md` must prefer `npm run typecheck:ratchet`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** none; **not** tip-name pointer count stamps / living tip-pointer tables
- **series:** docs
- **verdict:** **SAFE** — living helper doc disagrees with AGENTS / package.json script preference
- **CI / package.json callers:** none (docs-only)
- **target files:** `docs/dev/ai-typeonly-option.md` (verify / ratchet command section ~L155)
- **measured baseline:** doc shows `npx tsc --noEmit -p tsconfig.ratchet.json …` beside `npm run typecheck:ratchet`; AGENTS / CONTRIBUTING prefer package scripts over bare `npx tsc`.
- **acceptance criteria:** Primary verify command is `npm run typecheck:ratchet`; bare `npx tsc` demoted to optional footnote or removed; no tip SHA remasure theater.
- **verification commands:** `rg -n 'npx tsc|typecheck:ratchet' docs/dev/ai-typeonly-option.md`
- **conflict notes:** docs accuracy only; not README CI posture / lint-ratchet docs theater.
- **screen:** SAFE.

### q-mp-1372 · Scripts: memory-leak `prepareMenu` must not mash trailing-slash baseURL

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** none; **not** heap/memory-leak delta theater; leave gotoGame alone
- **series:** script-tooling
- **verdict:** **SAFE** — Vite `baseURL` with trailing `/` becomes `//?board3d=1#/`
- **CI / package.json callers:** `package.json` → `audit:memory`
- **target files:** `scripts/memory-leak-audit.mjs` (`prepareMenu`)
- **measured baseline:** `` `${'http://127.0.0.1:4173/'}/${'?board3d=1'}#/` `` → `http://127.0.0.1:4173//?board3d=1#/`; peers in `gotoGame` already strip trailing slashes.
- **acceptance criteria:** Strip trailing slashes before join (peer `gotoGame`); board3d query still applied; no CDP/heap metric changes.
- **verification commands:** hermetic unit or `rg -n 'prepareMenu|board3d|replace\\(/\\\\/+\\$' scripts/memory-leak-audit.mjs scripts/lib/page-ready.mjs`
- **conflict notes:** URL join hygiene only; not memory delta / heap snapshot math.
- **screen:** SAFE.

### q-mp-1373 · Scripts: emit-identity `parseArgs` must reject duplicate `--base` / `--head`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize after `1357`; leave folded `#1455`/`1333` alone
- **series:** script-tooling
- **verdict:** **SAFE** — `--base aaa --base bbb` silently keeps `bbb`
- **CI / package.json callers:** `package.json` → `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (`parseArgs`)
- **measured baseline:** `parseArgs(['--base','aaa','--base','bbb'])` → `base:'bbb'`; same for `--head`.
- **acceptance criteria:** Duplicate `--base` / `--head` → usage / exit 2; single valid refs unchanged; boolean flags may stay last-wins or also reject (tip-owner chooses — prefer reject for consistency).
- **verification commands:** hermetic `parseArgs` unit; `rg -n "a === '--base'|seen|duplicate" scripts/check-emit-identity.mjs`
- **conflict notes:** duplicate-flag honesty; not value-slot / invalid-base / minify / default tip (`1357`).
- **screen:** SAFE.

### q-mp-1374 · Scripts: calla deep-playtest must honor `PLAYTEST_BASE` like peer harnesses

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave playtest BASE join/seed (`1305`/`1306`) alone; **not** PLAYTEST\_\* env **docs** theater
- **series:** script-tooling
- **verdict:** **SAFE** — operators setting `PLAYTEST_BASE` for all deep playtests silently miss calla
- **CI / package.json callers:** `package.json` → `playtest:calla` (local; not CI)
- **target files:** `scripts/calla-deep-playtest.mjs` (BASE env + default host)
- **measured baseline:** calla: `PLAYTEST_BASE_URL` default `http://localhost:5173`; ramrod/par-55/stars-bars/sum-dominoes: `PLAYTEST_BASE` default `http://127.0.0.1:5173`.
- **acceptance criteria:** Read `PLAYTEST_BASE` (keep `PLAYTEST_BASE_URL` as alias if desired); default host aligns with peers (`127.0.0.1`); usage text matches; no end-regex / seed changes.
- **verification commands:** `rg -n 'PLAYTEST_BASE' scripts/calla-deep-playtest.mjs scripts/ramrod-deep-playtest.mjs`
- **conflict notes:** code env-name / host parity; not PLAYTEST\_\* documentation remasure; not BASE URL join.
- **screen:** SAFE.

### q-mp-1375 · Scripts: `shapeLhPerformanceScore` must coerce finite numeric strings

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize after `1361`; leave out-of-range (`1246`) / missing-score (`1208`) semantics intact for non-numeric
- **series:** script-tooling
- **verdict:** **SAFE** — stringified LH scores (hand-edited / cross-tool JSON) report as “missing”
- **CI / package.json callers:** `package.json` → `check:perf`
- **target files:** `scripts/check-perf.mjs` (`shapeLhPerformanceScore`)
- **measured baseline:** `shapeLhPerformanceScore({categories:{performance:{score:'0.91'}}})` → `{ok:false, error:'missing Lighthouse performance score'}`; numeric `0.91` → `{ok:true, score:91}`.
- **acceptance criteria:** Coerce finite numeric strings in `[0,1]` (peer typePhase2 coerce); non-numeric still “missing”; out-of-range still rejected.
- **verification commands:** hermetic unit; `rg -n 'shapeLhPerformanceScore|typeof raw' scripts/check-perf.mjs`
- **conflict notes:** not runLighthouse malformed/stale JSON; score shaping only.
- **screen:** SAFE.

### q-mp-1376 · Scripts: `isHttpResponseReady` must not trust `ok` when status contradicts 2xx

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave folded `1337` parseProbeBrowsers alone; **not** check-perf waitForUrl rewrite
- **series:** script-tooling
- **verdict:** **SAFE** — JSDoc promises 2xx-only; mock `{ok:true,status:404}` is treated ready
- **CI / package.json callers:** offline / webkit probes via `scripts/lib/offline-probe-ready.mjs` (`waitForUrl`)
- **target files:** `scripts/lib/offline-probe-ready.mjs` (`isHttpResponseReady`)
- **measured baseline:** `isHttpResponseReady({ok:true,status:404})` → `true`; `{ok:true,status:200}` → `true`; `{ok:false,status:200}` → `false`.
- **acceptance criteria:** When `status` is a finite number, require 2xx (and prefer aligning `ok`); when status absent, keep `ok === true` for real `Response` objects; hermetic units cover contradicting mocks.
- **verification commands:** extend `tests/unit/offline-probe-ready.test.ts`; `rg -n 'isHttpResponseReady' scripts/lib/offline-probe-ready.mjs`
- **conflict notes:** ready-predicate honesty; not browser allowlist / board / classify / waitForUrl polling redesign.
- **screen:** SAFE.

### q-mp-1377 · Scripts: emit-identity + docs cross-check — default tip comment must not advertise wave5

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs/tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1357` (prefer same PR); **not** tip-pointer **count** stamps
- **series:** docs
- **verdict:** **SAFE** — comment + fallback string still name a retired tip while AGENTS points at `post38d2`
- **CI / package.json callers:** `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (comment near merge-base); optional one-line note in `docs/dev/ai-typeonly-option.md` only if it still claims wave5 as **current** base (historical inventory stamps may remain)
- **measured baseline:** code comment “preferred tip branch name” + `origin/cursor/integration-fold-wave5-tip-4af0`; `AGENTS.md` living tip is `cursor/mp-tip-post38d2`.
- **acceptance criteria:** Comment/default ref agree with living tip (or `alpha`); historical inventory filenames/dates may stay; no open-draft triage remasure.
- **verification commands:** `rg -n 'integration-fold-wave5|preferred tip|mp-tip-post38d2' scripts/check-emit-identity.mjs AGENTS.md`
- **conflict notes:** can merge into `1357`; listed separately only if tip-owner wants docs/comment split. Prefer implementing with `1357`.
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict  | Title (short)                                             |
| ----------- | -------- | --------------------------------------------------------- |
| `q-mp-1356` | **SAFE** | check-build: scanEnvLeakage include .mjs                  |
| `q-mp-1357` | **SAFE** | emit-identity: default merge-base leave dead wave5 tip    |
| `q-mp-1358` | **SAFE** | mutation-report-args: reject duplicate value flags        |
| `q-mp-1359` | **SAFE** | mutation-report-args: reject flag-like --json= values     |
| `q-mp-1360` | **SAFE** | lint-buckets: reject duplicate --top/--rule               |
| `q-mp-1361` | **SAFE** | check-perf: parseLhReportJson accept UTF-8 BOM            |
| `q-mp-1362` | **SAFE** | memory-leak-heap: analyzeHeapSnapshot accept UTF-8 BOM    |
| `q-mp-1363` | **SAFE** | tests: burn-1007 restore hidden + visibilityState         |
| `q-mp-1364` | **SAFE** | tests: residual document.hidden restores (non-1346 files) |
| `q-mp-1365` | **SAFE** | tests: restore serviceWorker (+484 visibilityState)       |
| `q-mp-1366` | **SAFE** | tests: shard undo-audit-polyomino-props (~605ms)          |
| `q-mp-1367` | **SAFE** | tests: further shard fab fuzz file (~1186ms)              |
| `q-mp-1368` | **SAFE** | tests: shard pent/fiar from fuzz games file               |
| `q-mp-1369` | **SAFE** | check-build: HTML poster/srcset asset refs                |
| `q-mp-1370` | **SAFE** | check-perf: measureAllChunks include .mjs                 |
| `q-mp-1371` | **SAFE** | docs: ai-typeonly-option prefer npm run typecheck:ratchet |
| `q-mp-1372` | **SAFE** | memory-leak: prepareMenu strip trailing-slash baseURL     |
| `q-mp-1373` | **SAFE** | emit-identity: reject duplicate --base/--head             |
| `q-mp-1374` | **SAFE** | calla deep-playtest: PLAYTEST_BASE parity with peers      |
| `q-mp-1375` | **SAFE** | check-perf: shapeLh coerce numeric string scores          |
| `q-mp-1376` | **SAFE** | offline-probe-ready: isHttpResponseReady honor 2xx status |
| `q-mp-1377` | **SAFE** | emit-identity: align default-tip comment with living tip  |

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic                                                        | Why not queued                                         |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| `check-boundaries` `stripComments` truncates `//` in regexes | prior HOLD-CHECK `1201`–`1204`/`1220` — do not sibling |
| `check-type-ratchet` Phase-2 string ceiling (`1341`)         | az HOLD-CHECK — leave prior                            |
| lint/type ratchet fail-open (`1328`–`1330`)                  | ay HOLD-CHECK — leave prior                            |
| engine-property fingerprint before (`1309`)                  | leave prior HOLD-CHECK id                              |
| CC-BY-NC → `ok` in `classifyLicense`                         | license-classifier family exhausted                    |
| runtime-perf / mobile-audit hardcoded `2026-10-07` stamps    | exhausted families — do not sibling ai-calibration OUT |
| flake `--shuffle` duplicate                                  | covered by folded `#1470` VALUE_FLAGS set — contained  |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Out of scope / not used here

- No `memory/` files
- No CI workflow / permissions edits
- No player-facing copy, rules, scoring, AI search/difficulty/timing
- No Stars & Bars history cap; Hex Hard stays 450ms
- Honest underfill: **22** tasks (ids `1356`–`1377`), not padded to 25
