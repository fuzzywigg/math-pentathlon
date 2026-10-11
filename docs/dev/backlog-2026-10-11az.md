# Engineering backlog — 2026-10-11az (tip refill after ay fold / round-52)

**Task id:** `q-mp-090az`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-postc4a7` @ `11f1b259` (full `11f1b2594d968f8f15ecf5903e3f0a987ba3074d`; tip cut from `alpha` @ `c4a7fdbb`; living pointers set by `q-mp-026ae`; ay backlog already on tip)  
**Depends on:** tip `cursor/mp-tip-postc4a7` @ `11f1b259`. Round-51 backlog (`q-mp-090ay` / open `#1432`, ids `q-mp-1310`…`1330`) — leave with `contained`; tip-folding ay SAFE implementers (`#1433`–`#1447` still open as drafts) — **do not** re-queue. Round-50 backlog (`q-mp-090ax` / open `#1417` on old tip `post0f72`, ids `q-mp-1292`…`1309`) — leave with `contained`. Round-49 (`q-mp-090aw` / `#1400` on `post99ba`, ids `q-mp-1271`…`1291`) — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-postc4a7` @ `11f1b259` measures unit files **3445**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**. This doc lists **25 new** concrete engineering tasks (`q-mp-1331` … `q-mp-1355`) mined from the **live tip tree**, checked against prior refills through `q-mp-1330` (ay on tip + implementers `#1433`–`#1447`; ax `#1417`/`#1419`–`#1431`; aw/av/au/at/as/ar/aq/ap/ao), and against the full open draft PR list. It is the **only** deliverable of `q-mp-090az`.

**Honest count:** **25** tasks with measured wrong-results / A/B leaks / slow-test shards — not padded from exhausted families. Id range starts at `q-mp-1331` per round-52 brief. Round-51 already claimed heap `self_size`, typePhase2 coerce, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty stdout, mutation ARITH/infra-error/dead export, playtest OUT date, reporter BOM, mutation `--max` sci-notation, matchMedia restore, queens seed-B shard, emit `++`/`--` spacing, ai-calibration unknown winners, lint/type-ratchet fail-open — **do not** re-queue `1310`–`1330` (leave `#1432` + tip drafts `#1433`–`#1447` with `contained`). This refill **does not** re-queue exhausted families from the round-52 brief (including ay’s list): `--help`/argv/empty-input theater, cli-help spawn speedups, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed, license-classifier prose, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache audits, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas, prototype-restore after direct assigns, engine-coverage-rank, report-coverage-map, ratchet-history ceilings, env-number, render-perf/runtime-perf, mobile-audit, console-sweep, mutation-report games, ratchet-history mergeHistory, check-dev-doc-links, probe-offline classify, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest end regexes, webkit-offline-probe, artifact-dir, README CI posture/lint-ratchet docs, PATH_RE root configs, PLAYTEST\_\* env docs, hex mutation globs, flattenKnip issues, eslint probe path, fab/fraction-pinball/calibration env parsing, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl, emit-identity minify, ratchet-history lint keys, queens fuzz wall, runLighthouse JSON, waitForGameReady load-error, offline probe board/recovered, offline-dev date, report-licenses maps, mapGameChunks, emit-identity base, withSeededRandom, storage-stubs, hex-ui styles, playtest BASE join/seed, queens e2e seed, type-ratchet phase2 docs, engine-property immutability, heap self_size, typePhase2 coercion, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty stdout, mutation ARITH/infra-error/dead export, playtest OUT date, reporter BOM, mutation --max sci-notation, matchMedia restore, queens seed-B shard, emit ++/-- spacing, ai-calibration unknown winners, lint/type-ratchet fail-open. No NaN/null-coercion micro-fixes unless real data hits them.

**Fresh payoffs on this tip (re-measured @ `11f1b259` after ay queue + open `#1433`–`#1447`):** **`analyzeHeapSnapshot` truncated `nodes` → `totalSelfSize: NaN`** (distinct from `1310` string/`self_size`), **`summarizeConsoleSweepResult` can yield `loadErrors > totalErrors` / `loadWarnings > totalWarnings`** and **`formatConsoleSweepSummaryLine` hides load-only warnings**, **`parseArgs(['--base','--normalize'])` → `base:'--normalize'`** (emit-identity), **`listChunkNames` omits `.mjs` while `offlineNeededPaths` includes them**, **`collectHtmlNonRootAssetRefs` misses unquoted `src=`**, **`check:build` never asserts `dist/health.txt` (CI does)**, **`parseProbeBrowsers('chrome'|'bogus')` accepted**, **`isOfflineProbeMountOk({mountCount:true,loadErrorCount:false})` → `true`**, **flake loops exit 0 when every run’s reporter JSON is corrupt**, **unit flake summary `failed:0` when walked fails but `numFailedTests:0`**, **`typecheck:ratchet` Phase-2 string ceiling fail-open**, **`CONTRIBUTING.md` says PRs→`alpha` while `AGENTS.md` says drafts→tip**, **queens seed-A late (`queens-a2`) still ~4.3s**, **fab fuzz case ~1.1s in games file**, **`PLAYTEST_SEED_ENV` dead export**, **`document.hidden` / `requestIdleCallback` / `innerWidth` leaks across unit-shared** (A/B), **`undo-audit-helpers.withSeededRandom` lacks thenable reject** (canonical `1302` fixed), **`withOracleRandom` same**, **`engine-property-invariants` ~5.9s tests**, **`run-ai-calibration.ts` still stamps `2026-10-07`**, flake **`--runs` first-wins**, **visibilityState / navigator.onLine** stub restore gaps.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake/restore hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids (`1201`–`1204`/`1214`/`1220`) — do not sibling (including `stripComments` `//` in regex — leave prior). Ratchet-history chart keys stay prior; mergeHistory stay prior. Ay lint/type fail-open (`1328`–`1330`) stay prior — this refill queues only the Phase-2 **string ceiling** residual as HOLD-CHECK (`1341`).

## Duplicate check (do not re-queue)

| Topic family                                                                          | Why skipped                                                               |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| round-51 ay `1310`–`1330` (+ open `#1432`; tip drafts `#1433`–`#1447`)                | leave with `contained`; this refill’s tickets are **new** surfaces only   |
| round-50 ax `1292`–`1309` (+ open `#1417` on post0f72; tip drafts `#1419`–`#1431`)    | leave with `contained`                                                    |
| round-49 aw `1271`–`1291` / av `1246`–`1270` / au–ao residuals                        | leave with `contained`                                                    |
| heap **self_size** string/NaN (`1310` / `#1433`)                                      | truncated-node OOB residual is new (`1331`); serialize after `#1433`      |
| playtest OUT/date (`1320` / `#1446`)                                                  | ai-calibration OUT stamp is new (`1352`); not BASE/seed                   |
| emit minify (`1288`) / invalid base (`1301`) / `++` spacing (`1326`)                  | `--base` value-slot parse bug is new (`1333`)                             |
| matchMedia restore (`1324`)                                                           | `document.hidden` / ric / viewport / visibilityState / onLine are new     |
| queens seed-B (`1325`) / seed-A wall (`1291`)                                         | queens-a2 further shard is new (`1343`)                                   |
| withSeededRandom canonical (`1302` / `#1423`)                                         | undo-audit **local twin** residual only (`1349`); not re-open rng helper  |
| flake-rate **loops** / BOM (`1321`)                                                   | all-corrupt exit greenwash + failed-field honesty are new (`1339`/`1340`) |
| console-sweep harness                                                                 | pure `console-sweep-summary` math/format only (`1332`)                    |
| check-build asset/precache theater                                                    | chunk `.mjs` gap / unquoted HTML / health.txt CI parity are new           |
| boundaries `1201`–`1204`/`1220` stripComments/`typeof import`                         | leave prior ids — **do not** sibling                                      |
| license-classifier prose / report-licenses maps                                       | leave prior; no CC-BY-NC prose ticket                                     |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions | hard-rule HOLD                                                            |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `11f1b259`)

| Id                                   | Title (short)                        | Verdict                        | Evidence @ `11f1b259`                                         |
| ------------------------------------ | ------------------------------------ | ------------------------------ | ------------------------------------------------------------- |
| `q-mp-090ay` / `#1432`               | round-51 backlog                     | **open; already on tip**       | This refill starts at `1331`; do not re-queue `1310`–`1330`.  |
| `#1433`–`#1447`                      | ay SAFE implementers into `postc4a7` | **open**                       | Leave with `contained`.                                       |
| `q-mp-090ax` / `#1417`               | round-50 backlog                     | **open on old tip `post0f72`** | leave with `contained`.                                       |
| `#1419`–`#1431`                      | ax SAFE implementers                 | **open** (most folded on tip)  | Leave with `contained`.                                       |
| `q-mp-090aw` / `#1400`               | round-49 backlog                     | **open on `post99ba`**         | leave with `contained`.                                       |
| `q-mp-1201`…`1204` / `1220` / `1214` | boundaries + size soft-gate          | **still-valid; no tip PR yet** | Leave prior ids — **do not** re-queue.                        |
| `q-mp-1309`                          | engine-property fingerprint before   | **still-valid HOLD-CHECK**     | Leave prior id — do not sibling.                              |
| `q-mp-1328`…`1330`                   | lint/type ratchet fail-open          | **still-valid HOLD-CHECK**     | Leave prior ids; only Phase-2 string ceiling is new (`1341`). |
| knip unusedExports                   | live `--json`                        | **3 LEAVE**                    | Only demote `PLAYTEST_SEED_ENV` (scripts const).              |

## Shared-file conflict flags

| Shared file                                                       | Conflicting new ids                               |
| ----------------------------------------------------------------- | ------------------------------------------------- |
| `scripts/lib/memory-leak-heap.mjs`                                | `1331` — serialize after ay `#1433` / `1310`      |
| `scripts/lib/console-sweep-summary.mjs`                           | `1332` only                                       |
| `scripts/check-emit-identity.mjs`                                 | `1333` — leave `#1445`/`1326` alone               |
| `scripts/check-build.mjs`                                         | `1334` + `1335` + `1336` — serialize              |
| `scripts/lib/offline-probe-ready.mjs`                             | `1337` only                                       |
| `scripts/lib/offline-probe-board.mjs`                             | `1338` — leave `#1430` board/recovered alone      |
| `scripts/flake-rate-e2e-loop.mjs` / `flake-rate-unit-loop.mjs`    | `1339` + `1340` + `1353` — serialize              |
| `scripts/check-type-ratchet.mjs`                                  | `1341` HOLD-CHECK — leave `1330` alone            |
| `CONTRIBUTING.md` / `AGENTS.md`                                   | `1342` only                                       |
| `tests/unit/state-roundtrip-fuzz-queens-a2.test.ts` + fuzz helper | `1343` — leave seed-B `#1447` / wall `1291` alone |
| `tests/unit/state-roundtrip-fuzz-games.test.ts`                   | `1344` only                                       |
| `scripts/lib/playtest-seed.mjs`                                   | `1345` — leave `#1431` BASE/seed alone            |
| document.hidden suites                                            | `1346` — one PR or serialize                      |
| `tests/unit/game-prefetch.test.ts`                                | `1347` only                                       |
| viewport stub suites                                              | `1348` — one PR or serialize                      |
| `tests/unit/undo-audit-helpers.ts`                                | `1349` only                                       |
| `tests/unit/ai-determinism-helpers.ts`                            | `1350` only; **no** AI search/scoring/timing      |
| `tests/unit/engine-property-invariants.test.ts`                   | `1351` — leave `1309` fingerprint alone           |
| `scripts/run-ai-calibration.ts`                                   | `1352` only; **no** AI behavior                   |
| mutation-ui pwa-register suites                                   | `1354` only                                       |
| `tests/unit/offline-helpers.test.ts`                              | `1355` only                                       |

**Parallel-friendly:** `1332`, `1333`, `1337`, `1338`, `1342`, `1343`, `1344`, `1345`, `1347`, `1349`, `1350`, `1351`, `1352`, `1354`, `1355`. Serialize `1334`→`1335`→`1336`; `1339`→`1340`→`1353`; `1346` file group; `1348` file group; `1331` after `#1433`.

## Live tip measurements (evidence snapshot @ `11f1b259`)

```text
$ git rev-parse HEAD
  11f1b2594d968f8f15ecf5903e3f0a987ba3074d

$ git branch --show-current
  cursor/mp-tip-postc4a7 (audited) / cursor/backlog-2026-10-11az-d74f (this PR)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3445

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ analyzeHeapSnapshot(truncated nodes) → { totalSelfSize: NaN }
$ summarizeConsoleSweepResult(load 2 errors; play console warnings-only + 1 pageError)
    → loadErrors:2, totalErrors:1
$ summarize + format(load 2 warnings; console:[]) → loadWarnings:2, totalWarnings:0; line warnings=0
$ parseArgs(['--base','--normalize']) → { base:'--normalize', normalize:false }
$ listChunkNames({assets/w.mjs,…}) omits .mjs; offlineNeededPaths includes it
$ collectHtmlNonRootAssetRefs('<script src=assets/x.js>') → []
$ rg health scripts/check-build.mjs → none; CI test -f dist/health.txt
$ parseProbeBrowsers('chrome'|'bogus') → ['chrome'|'bogus']
$ isOfflineProbeMountOk({mountCount:true,loadErrorCount:false}) → true
$ flake: all corrupt JSON → failures=[] → exit 0
$ type-ratchet: prev.outOfScopeErrors='216' → ceiling undefined/string → rise not checked
$ CONTRIBUTING.md L3: PRs target alpha; AGENTS.md: Draft PR into tip
$ queens-a2: ~4327ms case; fab fuzz: ~1089ms; engine-property: ~5.92s tests / 6.45s file
$ PLAYTEST_SEED_ENV: only scripts/lib/playtest-seed.mjs
$ A/B unit-shared maxWorkers=1: hidden alone false; after idle-warm/burn-r5 → true
$ ric alone undefined; after game-prefetch → function
$ vw alone ~1024×768; after q-mp-705 → 0×0; after canvas-dpr → 800×600

$ Open drafts into cursor/mp-tip-postc4a7 at audit: #1419–#1447 (ax+ay implementers + ay backlog)
$ Round-50 backlog still open on post0f72: #1417
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090az-repros.log`.

## New tasks

### q-mp-1331 · Scripts: `analyzeHeapSnapshot` must not NaN on truncated `nodes`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize after `#1433` / `1310` (same file); leave metricDelta alone
- **series:** script-tooling
- **verdict:** **SAFE** — truncated CDP snapshots poison audit totals with NaN
- **CI / package.json callers:** `package.json` → `audit:memory` (local / report-only)
- **target files:** `scripts/lib/memory-leak-heap.mjs` (`analyzeHeapSnapshot`)
- **measured baseline:** incomplete last node (`nodes` length not multiple of `node_fields`) → `{ totalSelfSize: NaN }`.
- **acceptance criteria:** Skip incomplete trailing field groups (or fail closed with clear error); totals always finite; `1310` finite `self_size` coercion unchanged.
- **verification commands:** hermetic unit; `rg -n 'totalSelfSize|fieldCount' scripts/lib/memory-leak-heap.mjs`
- **conflict notes:** not self_size string concat (`1310`); truncated-array residual only.
- **screen:** SAFE.

### q-mp-1332 · Scripts: console-sweep summary must keep load ≤ total invariants

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; **not** console-sweep harness theater
- **series:** script-tooling
- **verdict:** **SAFE** — load-phase errors vanish from totals when play `console` is a later snapshot
- **CI / package.json callers:** `package.json` → `audit:console` (via summary helper)
- **target files:** `scripts/lib/console-sweep-summary.mjs` (`summarizeConsoleSweepResult`, `formatConsoleSweepSummaryLine`)
- **measured baseline:** load 2 errors + play pageError with warning-only `console` → `loadErrors:2, totalErrors:1`; load 2 warnings + empty `console` → `loadWarnings:2, totalWarnings:0`; format line shows `warnings=0`.
- **acceptance criteria:** Totals include load snapshots (or document + clamp so load ≤ total); format line surfaces load warnings; hermetic units cover both cases.
- **verification commands:** hermetic vitest on summary helper; `rg -n 'loadErrors|totalWarnings|formatConsoleSweepSummaryLine' scripts/lib/console-sweep-summary.mjs`
- **conflict notes:** pure summary math/format; not console-sweep driver / nav-away.
- **screen:** SAFE.

### q-mp-1333 · Scripts: emit-identity `parseArgs` must not eat flags as `--base`/`--head` values

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave `#1445`/`1326` normalize and `#1426`/`1301` invalid-base alone
- **series:** script-tooling
- **verdict:** **SAFE** — `node scripts/check-emit-identity.mjs --base --normalize` treats `--normalize` as a git ref
- **CI / package.json callers:** `package.json` → `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (`parseArgs`)
- **measured baseline:** `parseArgs(['--base','--normalize'])` → `{ base:'--normalize', normalize:false }`; `['--head','--json','--base','abc']` → `{ head:'--json', json:false }`.
- **acceptance criteria:** Value slots that start with `-` → usage / exit 2; bare `--base` without value → error (not silent merge-base); exact valid refs unchanged.
- **verification commands:** hermetic `parseArgs` unit; `rg -n "a === '--base'|argv\\[\\+\\+i\\]" scripts/check-emit-identity.mjs`
- **conflict notes:** value-slot honesty, not tip-name pointer / minify / invalid-base.
- **screen:** SAFE.

### q-mp-1334 · Scripts: `listChunkNames` must include `.mjs` assets

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize with `1335`/`1336`
- **series:** script-tooling
- **verdict:** **SAFE** — worker/chunk repro diffs miss `.mjs` while offline path list includes them
- **CI / package.json callers:** `package.json` → `check:build` (report-only)
- **target files:** `scripts/check-build.mjs` (`listChunkNames`)
- **measured baseline:** tree with `assets/w.mjs` → `listChunkNames` = `.js`/`.css` only; `offlineNeededPaths` includes `.mjs`.
- **acceptance criteria:** `listChunkNames` matches offline extension set for JS-like chunks (include `.mjs`); hermetic unit; not a precache-parser rewrite.
- **verification commands:** hermetic unit; `rg -n 'listChunkNames|\\\\.\\(js\\|css\\)' scripts/check-build.mjs`
- **conflict notes:** beyond precache/asset audit theater; chunk-name gap only.
- **screen:** SAFE.

### q-mp-1335 · Scripts: `collectHtmlNonRootAssetRefs` must see unquoted `src`/`href`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize after `1334`
- **series:** script-tooling
- **verdict:** **SAFE** — unquoted HTML refs false-negative the base-path audit
- **CI / package.json callers:** `package.json` → `check:build`
- **target files:** `scripts/check-build.mjs` (`collectHtmlNonRootAssetRefs`)
- **measured baseline:** `<script src=assets/x.js>` → `[]`; quoted → `['assets/x.js']`.
- **acceptance criteria:** Unquoted attribute values accepted (HTML tokenizer-lite or regex); quoted paths unchanged; protocol-relative / root-absolute rules unchanged.
- **verification commands:** hermetic unit; `rg -n 'collectHtmlNonRootAssetRefs|src\\|href' scripts/check-build.mjs`
- **conflict notes:** not precache parser; HTML ref collector honesty.
- **screen:** SAFE.

### q-mp-1336 · Scripts: `check:build` must assert `dist/health.txt` (CI parity)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize after `1335`
- **series:** script-tooling
- **verdict:** **SAFE** — local `check:build` can green while CI build job fails on missing health artifact
- **CI / package.json callers:** `package.json` → `check:build`; CI `build` job also `test -f dist/health.txt`
- **target files:** `scripts/check-build.mjs` (`main` / summary)
- **measured baseline:** `rg health scripts/check-build.mjs` → none; `.github/workflows/ci.yml` requires `dist/health.txt`.
- **acceptance criteria:** Missing `health.txt` → non-zero / explicit finding in summary; present → ok; no permissions / workflow edits.
- **verification commands:** `rg -n 'health\\.txt' scripts/check-build.mjs .github/workflows/ci.yml`
- **conflict notes:** CI parity artifact, not asset/precache audit theater.
- **screen:** SAFE.

### q-mp-1337 · Scripts: `parseProbeBrowsers` reject unknown / alias `chrome`→`chromium`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; **not** webkit-offline-probe harness rewrite
- **series:** script-tooling
- **verdict:** **SAFE** — `PROBE_BROWSERS=chrome` launches a non-Playwright project name
- **CI / package.json callers:** offline/webkit probes via `scripts/lib/offline-probe-ready.mjs`
- **target files:** `scripts/lib/offline-probe-ready.mjs` (`parseProbeBrowsers`)
- **measured baseline:** `'chrome'` → `['chrome']`; `'bogus'` → `['bogus']`; empty → `['webkit']`.
- **acceptance criteria:** Allowlist Playwright project names (`chromium`/`firefox`/`webkit`); alias `chrome`→`chromium` or reject; unknown → error / empty-with-message (tip-owner chooses); default unchanged.
- **verification commands:** extend `tests/unit/offline-probe-ready.test.ts`; `rg -n 'parseProbeBrowsers' scripts/lib/offline-probe-ready.mjs`
- **conflict notes:** browser-name validation only; not classify / board / recovered.
- **screen:** SAFE.

### q-mp-1338 · Scripts: `isOfflineProbeMountOk` require integer counts (no bool coerce)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave `#1430` board/recovered alone
- **series:** script-tooling
- **verdict:** **SAFE** — `Number(true)===1` marks a boolean payload as mounted
- **CI / package.json callers:** offline probes via `scripts/lib/offline-probe-board.mjs`
- **target files:** `scripts/lib/offline-probe-board.mjs` (`isOfflineProbeMountOk`)
- **measured baseline:** `{mountCount:true, loadErrorCount:false}` → `true`; `{mountCount:'1', loadErrorCount:'0'}` → `true`.
- **acceptance criteria:** Require `typeof === 'number'` + `Number.isFinite` / integer; bool/string → `false`; numeric `1`/`0` unchanged.
- **verification commands:** hermetic unit; `rg -n 'isOfflineProbeMountOk|Number\\(counts' scripts/lib/offline-probe-board.mjs`
- **conflict notes:** predicate type honesty; not board-ok/recovered chrome ignore.
- **screen:** SAFE.

### q-mp-1339 · Scripts: flake loops must not exit 0 when every run’s JSON is corrupt

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize with `1340`/`1353`; leave BOM `1321` alone
- **series:** script-tooling
- **verdict:** **SAFE** — total ingest failure looks like a clean flake audit
- **CI / package.json callers:** `package.json` → `flake:e2e` / `flake:unit`
- **target files:** `scripts/flake-rate-e2e-loop.mjs`, `scripts/flake-rate-unit-loop.mjs` (exit path)
- **measured baseline:** corrupt/empty JSON → `runSummaries[].ok=false` but `failures=[]` → `process.exit(0)`.
- **acceptance criteria:** If all runs fail ingest (or zero successful parses), exit ≠ 0 with clear message; real zero-failure green runs unchanged.
- **verification commands:** hermetic unit or dry fixture dir; `rg -n 'failures\\.length|runSummaries|process\\.exit' scripts/flake-rate-*-loop.mjs`
- **conflict notes:** exit greenwash on ingest failure; not loop-design / BOM theater.
- **screen:** SAFE.

### q-mp-1340 · Scripts: unit flake summary must not under-report `failed` when reporter lies

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize after `1339`
- **series:** script-tooling
- **verdict:** **SAFE** — walked failures with `numFailedTests: 0` store `failed: 0` while `ok:false`
- **CI / package.json callers:** `package.json` → `flake:unit`
- **target files:** `scripts/flake-rate-unit-loop.mjs` (`ingestJson`)
- **measured baseline:** `numFailedTests: 0` with walked `failed ≥ 1` → summary `failed: 0` (`??` does not coerce `0`).
- **acceptance criteria:** Summary `failed` uses `max(walked, reported)` (or prefers walked when reported is 0 and walked > 0); `ok` logic stays fail-closed.
- **verification commands:** hermetic ingest unit; `rg -n 'numFailedTests \\?\\? failed|failed: numFailedTests' scripts/flake-rate-unit-loop.mjs`
- **conflict notes:** summary field honesty; not flake loop redesign.
- **screen:** SAFE.

### q-mp-1341 · Scripts: `typecheck:ratchet` Phase-2 string ceiling must fail closed

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave `1330` config-fatal alone; **no** baseline upward edits
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — CI-gating type ratchet live verdict
- **CI / package.json callers:** `package.json` → `typecheck:ratchet` (blocking via `verify`)
- **target files:** `scripts/check-type-ratchet.mjs` (Phase-2 ceiling block)
- **measured baseline:** `{ outOfScopeErrors: '216' }` → `typeof ceiling === 'string'` path skipped / top-level string → `ceiling` undefined; rise not checked; exit 0 while printing `≤ baseline …`.
- **acceptance criteria:** Coerce finite numeric strings (peer of lint/history) **or** fail closed on non-number ceilings; numeric ceilings unchanged; Phase-2 may only go down.
- **verification commands:** hermetic unit with fixture baseline; `rg -n 'Phase-2 ceiling|outOfScopeErrors|typeof ceiling' scripts/check-type-ratchet.mjs`
- **conflict notes:** distinct from `1330` config-fatal and `1311` history extractMetric; CI gate.
- **screen:** HOLD-CHECK.

### q-mp-1342 · Docs: clarify human PRs→`alpha` vs agent drafts→tip

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; **not** tip-name pointer count stamps
- **series:** docs
- **verdict:** **SAFE** — CONTRIBUTING and AGENTS disagree on PR base
- **CI / package.json callers:** none (docs-only)
- **target files:** `CONTRIBUTING.md`, `AGENTS.md` (Draft PR / contributing sections)
- **measured baseline:** `CONTRIBUTING.md` L3 “PRs target **alpha**”; `AGENTS.md` “Draft PR into tip” (`cursor/mp-tip-postc4a7`).
- **acceptance criteria:** Docs state both paths without contradiction (humans/trunk vs cloud-agent draft-into-tip); no workflow permission edits; no tip SHA remasure theater.
- **verification commands:** `rg -n 'PRs target|Draft PR into tip|alpha' CONTRIBUTING.md AGENTS.md`
- **conflict notes:** policy clarity only; not living tip-pointer tables.
- **screen:** SAFE.

### q-mp-1343 · Tests: further shard queens-guards seed-A late (`queens-a2` ~4.3s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave seed-B `#1447`/`1325` and seed-A wall `1291` alone
- **series:** test-hygiene
- **verdict:** **SAFE** — measured ~4.3s single case after early/late split
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/state-roundtrip-fuzz-queens-a2.test.ts` (+ helper windows in `tests/unit/helpers/state-roundtrip-fuzz-run.ts`)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/state-roundtrip-fuzz-queens-a2.test.ts` → case **~4327ms**, file **~4.87s**.
- **acceptance criteria:** Split mid/final (or equivalent) without dropping seed-A late moves; no wall-budget weakening of other engines.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/state-roundtrip-fuzz-queens-a2*.test.ts`
- **conflict notes:** not seed-B; not queens fuzz **wall**.
- **screen:** SAFE.

### q-mp-1344 · Tests: shard `fab-a-diffy` out of non-queens fuzz games file

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — largest non-queens fuzz case ~1.1s
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/state-roundtrip-fuzz-games.test.ts` (+ optional `state-roundtrip-fuzz-fab*.test.ts`)
- **measured baseline:** same verbose run → fab-a-diffy **~1089ms** (next heaviest pent ~532ms / fiar ~441ms).
- **acceptance criteria:** Fab case moves to its own file (or shard) with identical coverage; games file still covers remaining non-queens engines.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/state-roundtrip-fuzz-games.test.ts tests/unit/state-roundtrip-fuzz-fab*.test.ts`
- **conflict notes:** not queens wall/seed tickets; not AI harness speed.
- **screen:** SAFE.

### q-mp-1345 · Chore: demote dead export `PLAYTEST_SEED_ENV`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 chore
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave `#1431` playtest BASE/seed alone; **no** knip AI LEAVE demotes
- **series:** dead-export
- **verdict:** **SAFE** — export has strictly zero external importers
- **CI / package.json callers:** none (internal default for `resolvePlaytestSeed`)
- **target files:** `scripts/lib/playtest-seed.mjs`
- **measured baseline:** `rg PLAYTEST_SEED_ENV` → only that file (param default @ L41); tests import `DEFAULT_PLAYTEST_SEED` only.
- **acceptance criteria:** Make const non-exported (or keep string literal at call site); behavior unchanged; `DEFAULT_PLAYTEST_SEED` export may remain (has test importers).
- **verification commands:** `rg -n 'PLAYTEST_SEED_ENV' -g '!node_modules'`; `npm run report:knip -- --json`
- **conflict notes:** scripts const only; not emit demotes `1110` / mutation glob `1323`.
- **screen:** SAFE.

### q-mp-1346 · Tests: restore `document.hidden` after idle-warm / burn-r5 / tablet-gl stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; **not** matchMedia `1324`
- **series:** test-hygiene
- **verdict:** **SAFE** — unit-shared isolate:false leak flips later suites
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/idle-warm-bootstrap-owl.test.ts`, `tests/unit/burn-1008-ui-cov-r5-pwa-flags-pointer.test.ts`, `tests/unit/tablet-gl.test.ts`
- **measured baseline:** A/B `--project unit-shared --maxWorkers=1 --no-file-parallelism`: probe alone `{hidden:false,ownDesc:false}`; after idle-warm / burn-r5 → `{hidden:true,ownDesc:true}`; after tablet-gl → own descriptor left behind.
- **acceptance criteria:** Save/restore original `document.hidden` descriptor in `afterEach`; no product PWA/hidden behavior change.
- **verification commands:** A/B probe as above; `rg -n 'document\\.hidden|afterEach' tests/unit/idle-warm-bootstrap-owl.test.ts tests/unit/tablet-gl.test.ts`
- **conflict notes:** not matchMedia; not setup.ts central rewrite (prefer per-file).
- **screen:** SAFE.

### q-mp-1347 · Tests: restore `requestIdleCallback` after game-prefetch defineProperty

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — `restoreAllMocks` does not undo `defineProperty`
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/game-prefetch.test.ts`
- **measured baseline:** A/B: alone `typeof ric === 'undefined'`; after offender → `'function'`.
- **acceptance criteria:** Delete or restore original descriptor in `afterEach` (peer suites already delete); no prefetch product change.
- **verification commands:** A/B as above; `rg -n 'requestIdleCallback|afterEach' tests/unit/game-prefetch.test.ts`
- **conflict notes:** ric only; not idle-warm hidden (`1346`).
- **screen:** SAFE.

### q-mp-1348 · Tests: restore `innerWidth`/`innerHeight` after tablet/canvas stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — sticky `0×0` / `800×600` poisons later layout suites
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/q-mp-705-tablet-gl-residual-branches.test.ts`, `tests/unit/canvas-dpr-resize-regression.test.ts`, `tests/unit/burn-1008-ui-cov-r3-tablet-gl-loaders.test.ts`
- **measured baseline:** A/B: alone ~1024×768; after q-mp-705 → **0×0**; after canvas-dpr → **800×600**.
- **acceptance criteria:** Restore original window dimension descriptors in `afterEach`; `unstubAllGlobals` alone is insufficient for `defineProperty`.
- **verification commands:** A/B as above; `rg -n 'innerWidth|innerHeight|afterEach' tests/unit/q-mp-705-tablet-gl-residual-branches.test.ts`
- **conflict notes:** not getContext/ResizeObserver; viewport stubs only.
- **screen:** SAFE.

### q-mp-1349 · Tests: `undo-audit-helpers.withSeededRandom` must reject thenables (parity with `1302`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave canonical `#1423`/`1302` `tests/helpers/rng.ts` alone unless re-exporting
- **series:** test-hygiene
- **verdict:** **SAFE** — local twin still restores in `finally` without rejecting async callbacks
- **CI / package.json callers:** undo-audit property suites via `tests/unit/undo-audit-helpers.ts`
- **target files:** `tests/unit/undo-audit-helpers.ts` (`withSeededRandom`)
- **measured baseline:** Local helper returns `fn()` inside `try/finally` with no thenable check; tip `tests/helpers/rng.ts` rejects async (ax `1302`).
- **acceptance criteria:** Same thenable reject + restore contract as canonical helper (or delete local and re-export); **no** product RNG / AI change.
- **verification commands:** hermetic vitest; `rg -n 'withSeededRandom|thenable|finally' tests/unit/undo-audit-helpers.ts tests/helpers/rng.ts`
- **conflict notes:** residual twin of `1302`; not re-open rng helper API design.
- **screen:** SAFE.

### q-mp-1350 · Tests: `withOracleRandom` must reject thenables / always restore

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; **no** AI search/scoring/difficulty/timing edits in `src/`
- **series:** test-hygiene
- **verdict:** **SAFE** — async callback leaves `Math.random` stuck at `() => 0` until finally races
- **CI / package.json callers:** ai-determinism shards via `tests/unit/ai-determinism-helpers.ts`
- **target files:** `tests/unit/ai-determinism-helpers.ts` (`withOracleRandom`)
- **measured baseline:** Same bare `try/finally` pattern as pre-`1302` seeded helper; re-exports fixed `withSeededRandom` but oracle twin does not reject thenables.
- **acceptance criteria:** Reject thenables (or document sync-only + assert); always restore `Math.random`; **no** product AI behavior change.
- **verification commands:** hermetic vitest; `rg -n 'withOracleRandom' tests/unit/ai-determinism-helpers.ts`
- **conflict notes:** helper restore hygiene only; not AI harness speed / unknown-winner aggregate.
- **screen:** SAFE.

### q-mp-1351 · Tests: shard `engine-property-invariants` by game groups (~5.9s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave HOLD-CHECK `1309` fingerprint-before alone
- **series:** test-hygiene
- **verdict:** **SAFE** — measured wall; shard without dropping cases
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/engine-property-invariants.test.ts` (+ optional shard files / helper)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/engine-property-invariants.test.ts` → tests **~5.92s**, file **~6.45s** (heaviest fab/fiar/pent/queens/ramrod ~500–700ms).
- **acceptance criteria:** Split into ≥2 files by game groups; every registered game still covered; no immutability/fingerprint semantic change (`1309` stays prior).
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/engine-property-invariants*.test.ts`
- **conflict notes:** wall trim only; not engine-property immutability HOLD-CHECK.
- **screen:** SAFE.

### q-mp-1352 · Scripts: `run-ai-calibration` stamp live OUT / title date

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** leave playtest OUT `#1446`/`1320` alone; **no** AI search/scoring/timing
- **series:** script-tooling
- **verdict:** **SAFE** — every run overwrites the Oct 7 calibration markdown twin
- **CI / package.json callers:** local calibration script `scripts/run-ai-calibration.ts`
- **target files:** `scripts/run-ai-calibration.ts` (`OUT` / title date)
- **measured baseline:** `OUT = …/ai-calibration-2026-10-07.md`; title `# AI Calibration — 2026-10-07`.
- **acceptance criteria:** Default stamp uses today’s UTC date (env override OK); historical markdown under old path may remain; **no** matrix/aggregate/AI behavior edits.
- **verification commands:** `rg -n '2026-10-07|OUT|toISOString' scripts/run-ai-calibration.ts`
- **conflict notes:** date metadata only; not AI harness speed / unknown winners (`1327`).
- **screen:** SAFE.

### q-mp-1353 · Scripts: flake `--runs` must reject duplicate value flags

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** serialize after `1339`/`1340`
- **series:** script-tooling
- **verdict:** **SAFE** — `--runs 2 --runs 9` silently keeps `2`
- **CI / package.json callers:** `package.json` → `flake:e2e` / `flake:unit`
- **target files:** `scripts/flake-rate-e2e-loop.mjs`, `scripts/flake-rate-unit-loop.mjs` (`flag` / argv parse)
- **measured baseline:** `indexOf` first-wins; later `--runs` ignored with no error.
- **acceptance criteria:** Duplicate `--runs` / `--out` → usage exit 2; single valid flag unchanged.
- **verification commands:** hermetic argv unit or spawn `--help` peer pattern; `rg -n 'function flag|indexOf' scripts/flake-rate-*-loop.mjs`
- **conflict notes:** duplicate-flag honesty; not loop redesign.
- **screen:** SAFE.

### q-mp-1354 · Tests: restore `visibilityState` after mutation-ui pwa-register stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none; peers `q-mp-484`/`658` already restore
- **series:** test-hygiene
- **verdict:** **SAFE** — mid-test failure leaves `visibilityState` getter sticky under isolate:false
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/mutation-ui-pwa-register.test.ts`, `tests/unit/mutation-ui16-pwa-register.test.ts`
- **measured baseline:** Tests `defineProperty(document, 'visibilityState', …)` to `'hidden'` then `'visible'` inline; `afterEach` does not restore original descriptor.
- **acceptance criteria:** Save/restore in `afterEach`; happy-path end state unchanged; no product SW reload behavior change.
- **verification commands:** `rg -n 'visibilityState|afterEach' tests/unit/mutation-ui-pwa-register.test.ts tests/unit/mutation-ui16-pwa-register.test.ts`
- **conflict notes:** not matchMedia; not document.hidden suites (`1346`) unless tip-owner merges.
- **screen:** SAFE.

### q-mp-1355 · Tests: restore `navigator.onLine` after offline-helpers stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc4a7`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — custom onLine getter can stick across shuffle/failure
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/offline-helpers.test.ts`
- **measured baseline:** Multiple `Object.defineProperty(navigator, 'onLine', …)` without saving/restoring the original descriptor; last test ends `true` so green A/B is quiet.
- **acceptance criteria:** Save/restore original descriptor in `afterEach`; assertions unchanged.
- **verification commands:** `rg -n 'onLine|afterEach|defineProperty' tests/unit/offline-helpers.test.ts`
- **conflict notes:** not offline probe board/classify; unit helper stub only.
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict        | Title (short)                                           |
| ----------- | -------------- | ------------------------------------------------------- |
| `q-mp-1331` | **SAFE**       | memory-leak-heap: truncated nodes ≠ NaN                 |
| `q-mp-1332` | **SAFE**       | console-sweep-summary: load ≤ total invariants          |
| `q-mp-1333` | **SAFE**       | emit-identity: parseArgs value-slot must not eat flags  |
| `q-mp-1334` | **SAFE**       | check-build: listChunkNames include .mjs                |
| `q-mp-1335` | **SAFE**       | check-build: unquoted HTML asset refs                   |
| `q-mp-1336` | **SAFE**       | check-build: assert dist/health.txt                     |
| `q-mp-1337` | **SAFE**       | offline-probe-ready: parseProbeBrowsers allowlist/alias |
| `q-mp-1338` | **SAFE**       | offline-probe-board: mountOk integer counts             |
| `q-mp-1339` | **SAFE**       | flake loops: fail closed when all JSON corrupt          |
| `q-mp-1340` | **SAFE**       | flake unit: summary failed vs lying numFailedTests      |
| `q-mp-1341` | **HOLD-CHECK** | typecheck:ratchet: Phase-2 string ceiling fail-closed   |
| `q-mp-1342` | **SAFE**       | docs: CONTRIBUTING alpha vs AGENTS tip PR targets       |
| `q-mp-1343` | **SAFE**       | tests: further shard queens-a2 (~4.3s)                  |
| `q-mp-1344` | **SAFE**       | tests: shard fab fuzz from games file                   |
| `q-mp-1345` | **SAFE**       | chore: demote PLAYTEST_SEED_ENV export                  |
| `q-mp-1346` | **SAFE**       | tests: restore document.hidden after stubs              |
| `q-mp-1347` | **SAFE**       | tests: restore requestIdleCallback after game-prefetch  |
| `q-mp-1348` | **SAFE**       | tests: restore innerWidth/Height after viewport stubs   |
| `q-mp-1349` | **SAFE**       | tests: undo-audit withSeededRandom thenable parity      |
| `q-mp-1350` | **SAFE**       | tests: withOracleRandom thenable reject                 |
| `q-mp-1351` | **SAFE**       | tests: shard engine-property-invariants (~5.9s)         |
| `q-mp-1352` | **SAFE**       | scripts: ai-calibration live OUT/date stamp             |
| `q-mp-1353` | **SAFE**       | flake: reject duplicate --runs/--out                    |
| `q-mp-1354` | **SAFE**       | tests: restore visibilityState in pwa-register suites   |
| `q-mp-1355` | **SAFE**       | tests: restore navigator.onLine in offline-helpers      |

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic                                                        | Why not queued                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `check-boundaries` `stripComments` truncates `//` in regexes | prior HOLD-CHECK `1201`–`1204`/`1220` — do not sibling       |
| `check-boundaries` `typeof import()` counted as value edge   | prior screened sibling                                       |
| `check-lint-ratchet` empty stdout / object ceilings          | ay `1328`/`1329` — leave prior                               |
| `check-type-ratchet` config fatals / abs-path IN_SCOPE       | ay `1330` + prior screened; this refill only string ceiling  |
| CC-BY-NC → `ok` in `classifyLicense`                         | license-classifier family exhausted — leave prior posture    |
| `setup.ts` central defineProperty restore                    | prefer per-file `1346`–`1348`; broader HOLD-CHECK if desired |
| engine-property fingerprint before (`1309`)                  | leave prior HOLD-CHECK id                                    |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Out of scope / not used here

Already claimed / in-flight / HOLD / prompt-skipped families: ay `1310`–`1330` + `#1432`/`#1433`–`#1447`, ax `1292`–`1309` + `#1417`/`#1419`–`#1431`, aw `1271`–`1291`, av `1246`–`1270`, au–ao residuals, void/nullish/eqeqeq product clears, lint-buckets **gate** fail-open (ay), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, tip-name pointers, UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e**, harness shards theater, demo coverage, page-ready / double-rAF / artifact-dir **adoptions** / mountPair / npm aliases / `--help`/`--dry-run`/argv empty-input / lib main-entry / cli-help spawn, license-classifier, pwa-manifest-contract / check-pwa-manifest, check-workflows, precache parser, check-build asset/precache theater, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate **loops**, heap/memory-leak **deltas** + self_size (`1310`), prototype-restore after direct assigns, engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep **harness**, mutation-report games/hex globs/ARITH/score/dead export/`--max`, deep-playtest end regexes, PATH_RE root configs, PLAYTEST\_\* env docs, flattenKnip, eslint probe path, fab/fraction/calibration env, gotoGame baseURL, CycloneDX, nav-away-sweep, check-perf waitForUrl + runLighthouse JSON/stale, emit-identity minify + invalid base + `++` spacing, queens fuzz wall + seed-B, waitForGameReady load-error, offline board/recovered/dev date, report-licenses maps, mapGameChunks, withSeededRandom canonical, storage-stubs, hex-ui styles, playtest BASE join/seed + OUT date, queens e2e seed, type-ratchet phase2 docs, engine-property immutability, matchMedia restore, ai-calibration unknown winners, help-only positionals, MEM_LEAK filter/date, knip.error, size:check flags, typePhase2 history coerce, lint/type fail-open ay trio, AI timing / Hex Hard 450ms / Stars & Bars history cap, boundaries HOLD-CHECK (`1201`–`1204`/`1220`), size soft MISSING (`1214`).

Filled to **25** with measured wrong-results + A/B hygiene + slow-test shards only — **no filler** from exhausted families.

## Next action

fold into tip by the tip owner
