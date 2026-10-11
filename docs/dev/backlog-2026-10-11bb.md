# Engineering backlog — 2026-10-11bb (tip refill after ba queue / round-54)

**Task id:** `q-mp-090bb`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post38d2` @ `b6afb7ab` (full `b6afb7ab374ff6a182b98ca0edc0fb45ad7abe3f`; tip cut from `alpha` @ `38d22ce0`; living pointers set by `q-mp-026ag`; ba backlog `#1471` still open as draft; ba SAFE implementers `#1472`–`#1487` open drafts)  
**Depends on:** tip `cursor/mp-tip-post38d2` @ `b6afb7ab`. Round-53 backlog (`q-mp-090ba` / open `#1471`, ids `q-mp-1356`…`1377`) — leave with `contained`; do **not** re-queue ba families or siblings. Round-52 az (`1331`…`1355`) and earlier — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post38d2` @ `b6afb7ab` measures unit files **3458**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **18 new** concrete engineering tasks (`q-mp-1378` … `q-mp-1395`) mined from the **live tip tree**, checked against prior refills through `q-mp-1377` (ba `#1471` + implementers `#1472`–`#1487`), and against the full open draft PR list. It is the **only** deliverable of `q-mp-090bb`.

**Honest count:** **18** tasks with measured wrong-results — not padded from exhausted families. Id range starts at `q-mp-1378` per round-54 brief. Round-53 already claimed `scanEnvLeakage` `.mjs`, emit wave5 merge-base, mutation dup/flag-like `--json=`, lint-buckets dup `--top`/`--rule`, LH/heap BOM, burn-1007 + residual hidden/visibilityState/serviceWorker restores, polyomino/fab/pent/fiar shards, collectHtml poster/srcset, measureAllChunks `.mjs`, ai-typeonly `npx tsc`, memory-leak prepareMenu trailing slash, emit dup `--base`/`--head`, calla `PLAYTEST_BASE`, shapeLh numeric strings, `isHttpResponseReady` status, emit wave5 comment — **do not** re-queue `1356`–`1377`. This refill **does not** re-queue exhausted families from the round-54 brief (including ba’s list and the brief’s round-54 exhausted block): `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-name pointers, knip remeasure, AI harness speed, license-classifier, pwa-manifest-contract, check-pwa-manifest (contract/icon theater), check-workflows parsing, precache parser, check-build asset/precache audits, menu-critical-ref (attribute regex theater), md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas, prototype-restore, engine-coverage-rank (metric/TypeError theater), report-coverage-map (heat/aggregate theater), ratchet-history ceilings/mergeHistory, env-number, render-perf/runtime-perf (harness/date theater), mobile-audit, console-sweep, mutation-report games, check-dev-doc-links, probe-offline classify, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest end regexes, webkit-offline-probe, artifact-dir, README CI posture, PATH_RE, PLAYTEST\_\* env docs, hex mutation globs, flattenKnip, eslint probe path, fab/fraction-pinball/calibration env parsing, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl, emit-identity minify, ratchet-history lint keys, queens fuzz wall, runLighthouse JSON, waitForGameReady load-error, offline probe board/recovered, offline-dev date, report-licenses maps, mapGameChunks, emit-identity base (except wave5 already queued), withSeededRandom, storage-stubs, hex-ui styles, playtest BASE join/seed, queens e2e seed, type-ratchet phase2 docs, engine-property immutability, heap self_size, typePhase2 coercion, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty stdout, mutation ARITH/infra-error/dead export, playtest OUT date, reporter BOM, mutation --max sci-notation, matchMedia restore, queens seed-B shard, emit ++/-- spacing, ai-calibration unknown winners, lint/type-ratchet fail-open, heap truncated nodes, console-sweep summary, emit-identity parseArgs value-slot, check-build chunk/html/health, probe browsers, offline mount ints, flake-loop corrupt JSON/failed/duplicate flags, CONTRIBUTING PR base, queens/fab/engine-property shards, PLAYTEST_SEED_ENV, document.hidden/requestIdleCallback/innerWidth/visibilityState/navigator.onLine restores, withSeededRandom/withOracleRandom thenables, ai-calibration OUT date, env-leak `.mjs`, html poster/srcset, emit default merge-base/duplicate `--base`/`--head`, mutation/lint-buckets duplicate flags, LH/heap BOM ingest, check-perf `.mjs` chunks/numeric scores, burn-1007/residual hidden + serviceWorker, polyomino/fab/pent/fiar shards, ai-typeonly docs, memory-leak baseURL join, calla `PLAYTEST_BASE`, `isHttpResponseReady` status. No NaN/null-coercion micro-fixes unless real data hits them. No trailing-slash URL mash siblings of `1372`. No offline-classify `.mjs` siblings. No `mapGameChunks` `.mjs` siblings.

**Fresh payoffs on this tip (re-measured @ `b6afb7ab` after ba queue + open `#1472`–`#1487`):** **`parseArgs` silently last-wins duplicate `--files-from`**, **`--files-from --json` accepted as a path (path-not-found vs flag-like honesty peers `--base`)**, **`collectHtmlNonRootAssetRefs` false-positives `data-src` / `ng-src` / `xsrc` / `datasrc` (no word-boundary; menu-critical already has one)**, **same helper misses `.webp` / `.jpg`**, **`parseMenuCriticalRefs` misses `.mjs` while peers already track module chunks**, **`check-lint-ratchet` rejects BOM eslint JSON while `parseEslintJsonReport` trims/accepts**, **coverage-map / engine-coverage-rank / knip-baseline / lint ceilings / boundaries / type-phase2 / bundle-budgets / lock / webmanifest / render-prior JSON readers reject UTF-8 BOM**, **`docs/wiki/development.md` CI posture omits soft `check:copy-pins` that AGENTS/CONTRIBUTING/`ci.yml` document**, **wiki Branches table still says only “Target PRs here” for `alpha` after CONTRIBUTING tip-draft clarification**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes or **docs-only** accuracy. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Ay/az/ba lint/type fail-open + Phase-2 string ceiling stay prior.

## Duplicate check (do not re-queue)

| Topic family                                                                          | Why skipped                                                             |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| round-53 ba `1356`–`1377` (+ `#1471`; tip drafts `#1472`–`#1487`)                     | leave with `contained`; this refill’s tickets are **new** surfaces only |
| round-52 az `1331`–`1355` / ay `1310`–`1330` / earlier                                | leave with `contained`                                                  |
| collectHtml **poster/srcset** (`1369` / `#1482`)                                      | `data-src` word-boundary FP + webp/jpg ext FN are new                   |
| menu-critical-ref **attribute** regex theater                                         | `.mjs` extension gap in `parseMenuCriticalRefs` is new                  |
| measureAllChunks / scanEnvLeakage `.mjs` (`1370` / `1356`)                            | size:check menu-critical `.mjs` is a different audit helper             |
| emit dup `--base`/`--head` (`1373`) / value-slot (`1333`) / wave5 (`1357`/`1377`)    | `--files-from` dup + flag-like path honesty are new                     |
| LH/heap/reporter BOM (`1361`/`1362`/`1321`)                                           | other JSON readers’ BOM ingest residuals are new                        |
| CONTRIBUTING vs AGENTS PR base (`1342`)                                               | wiki Branches / CI posture residuals are new                            |
| memory-leak trailing-slash (`1372`)                                                   | **do not** sibling other harness `//#/` mashes in this refill           |
| probe-offline classify / mapGameChunks `.mjs`                                         | leave exhausted                                                         |
| knip unusedExports LEAVE trio                                                         | no new SAFE demote                                                      |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions | hard-rule HOLD                                                          |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `b6afb7ab`)

| Id                                   | Title (short)                        | Verdict                        | Evidence @ `b6afb7ab`                                        |
| ------------------------------------ | ------------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| `q-mp-090ba` / `#1471`               | round-53 backlog                     | **open draft on tip**          | This refill starts at `1378`; do not re-queue `1356`–`1377`. |
| `#1472`–`#1487`                      | ba SAFE implementers                 | **open drafts**                | Leave with `contained`.                                      |
| `q-mp-090az` / `#1448`               | round-52 backlog                     | **open on old tip `postc4a7`** | leave with `contained`.                                      |
| `q-mp-1201`…`1204` / `1220` / `1214` | boundaries + size soft-gate          | **still-valid; no tip PR yet** | Leave prior ids — **do not** re-queue.                       |
| `q-mp-1309` / `1328`…`1330` / `1341` | HOLD-CHECK residuals                 | **still-valid**                | Leave prior ids — do not sibling.                            |
| knip unusedExports                   | live `--json`                        | **3 LEAVE**                    | No new SAFE demote.                                          |

## Shared-file conflict flags

| Shared file                               | Conflicting new ids                              |
| ----------------------------------------- | ------------------------------------------------ |
| `scripts/check-emit-identity.mjs`         | `1378` + `1379` — serialize; leave ba emit alone |
| `scripts/check-build.mjs`                 | `1380` + `1381` — serialize; leave `#1482` alone |
| `scripts/check-bundle-budgets.mjs`        | `1382` + `1390` — serialize                      |
| `scripts/check-lint-ratchet.mjs`          | `1383` + `1387` — serialize                      |
| `scripts/report-coverage-map.mjs`         | `1384` only                                      |
| `scripts/engine-coverage-rank.mjs`        | `1385` only                                      |
| `scripts/report-knip.mjs`                 | `1386` only                                      |
| `scripts/report-lint-buckets.mjs`         | `1387` — ceilings file BOM; leave `#1481` alone  |
| `scripts/check-boundaries.mjs`            | `1388` only                                      |
| `scripts/check-type-ratchet.mjs`          | `1389` only                                      |
| `scripts/report-licenses.mjs`             | `1391` only                                      |
| `scripts/check-pwa-manifest.mjs`          | `1392` — BOM ingest only; not contract theater   |
| `scripts/check-build.mjs` (manifest parse)| `1393` — serialize after `1380`/`1381`           |
| `scripts/render-perf-mode.mjs`            | `1394` only; **not** runtime-perf date theater   |
| `docs/wiki/development.md`                | `1395` only; **not** README CI posture / counts  |

**Parallel-friendly:** `1382`, `1383`, `1384`, `1385`, `1386`, `1388`, `1389`, `1390`, `1391`, `1392`, `1394`, `1395`. Serialize `1378`→`1379`; `1380`→`1381`→`1393`; `1383`↔`1387` if same ceilings helper preferred.

## Live tip measurements (evidence snapshot @ `b6afb7ab`)

```text
$ git rev-parse HEAD
  b6afb7ab374ff6a182b98ca0edc0fb45ad7abe3f

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3458

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ parseArgs(['--base','HEAD','--files-from',a,'--files-from',b]) → files from b only (last-win)
$ parseArgs(['--base','HEAD','--files-from','--json']) → exit 2 “path not found: --json” (not flag-like)
$ collectHtmlNonRootAssetRefs('<img data-src=… src=…>') → both paths; menu-critical word-boundary keeps only real src
$ collectHtmlNonRootAssetRefs('<img src="assets/a.webp|jpg">') → []
$ parseMenuCriticalRefs('<script src="/assets/app.mjs">…css…') → ['assets/a.css'] only
$ parseEslintJsonReport(BOM + '[]') → ok:true; check-lint-ratchet JSON.parse(BOM+'[]') throws
$ report-coverage-map / engine-coverage-rank on BOM summary → exit 1 / 2 malformed
$ JSON.parse(BOM + knip-baseline|ceilings|boundaries|phase2|budgets|lock|manifest) → throw
$ docs/wiki/development.md CI posture (public) — no copy-pins; Branches — “Target PRs here” on alpha only

$ Open drafts into cursor/mp-tip-post38d2 at audit: #1471–#1487 (ba backlog + implementers)
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090bb-repros.log`.

## New tasks

### q-mp-1378 · Scripts: emit-identity must reject duplicate `--files-from`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1379`; leave ba `#1478` / `1373` `--base`/`--head` alone
- **series:** script-tooling
- **verdict:** **SAFE** — second `--files-from` silently last-wins the file list
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local / report-only)
- **target files:** `scripts/check-emit-identity.mjs` (`parseArgs`)
- **measured baseline:** `parseArgs(['--base','HEAD','--files-from',a,'--files-from',b])` with `a`→`hex/ai.ts`, `b`→`fiar/ai.ts` → `{ files: ['src/games/fiar/ai.ts'] }` (a discarded).
- **acceptance criteria:** Duplicate `--files-from` → exit 2 / clear message; single `--files-from` unchanged; `--base`/`--head` dup behavior left to ba `1373`.
- **verification commands:** hermetic unit; `rg -n 'files-from|sawFilesFrom' scripts/check-emit-identity.mjs`
- **conflict notes:** value-flag duplicate honesty for `--files-from` only; not `--base`/`--head` (`1373`).
- **screen:** SAFE.

### q-mp-1379 · Scripts: emit `--files-from` must not treat flag-like tokens as paths

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize after `1378`; leave `#1455`/`1333` `--base`/`--head` value-slot alone
- **series:** script-tooling
- **verdict:** **SAFE** — `--files-from --json` is consumed as a path then fails “not found” instead of flag-like honesty
- **CI / package.json callers:** `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (`parseArgs` / `loadFilesFromList`)
- **measured baseline:** `parseArgs(['--base','HEAD','--files-from','--json'])` → exit 2 `error: --files-from path not found: --json`; peer `--base --json` → `error: --base requires a git ref (missing or flag-like value)`.
- **acceptance criteria:** Values that are missing / empty / start with `-` → flag-like error (reuse `isMissingOrFlagLikeRef` or twin); real paths unchanged.
- **verification commands:** hermetic unit; `rg -n 'files-from|isMissingOrFlagLikeRef' scripts/check-emit-identity.mjs`
- **conflict notes:** flag-like value slot for `--files-from`; not duplicate `--files-from` (`1378`).
- **screen:** SAFE.

### q-mp-1380 · Scripts: `collectHtmlNonRootAssetRefs` must not match `data-src` / `*-src` suffixes

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1381`/`1393`; leave ba `#1482` / `1369` poster/srcset alone
- **series:** script-tooling
- **verdict:** **SAFE** — lazy-load / framework attrs false-positive the non-root asset audit
- **CI / package.json callers:** `package.json` → `check:build` (report-only)
- **target files:** `scripts/check-build.mjs` (`collectHtmlNonRootAssetRefs`)
- **measured baseline:** `<img data-src="assets/lazy.png" src="assets/ok.png">` → `['assets/lazy.png','assets/ok.png']`; also matches `ng-src`, `xsrc`, `datasrc`. `parseMenuCriticalRefs` already uses `(?<![A-Za-z0-9_-])` and keeps only real `src`.
- **acceptance criteria:** Word-boundary (or equivalent) so only real `src`/`href` attributes match; true `src`/`href` unchanged; poster/srcset left to `1369`.
- **verification commands:** hermetic unit; `rg -n 'collectHtmlNonRootAssetRefs|src\\|href' scripts/check-build.mjs`
- **conflict notes:** false-positive attribute matching; not poster/srcset false-negatives (`1369`).
- **screen:** SAFE.

### q-mp-1381 · Scripts: `collectHtmlNonRootAssetRefs` must see common image types (webp/jpg/gif)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1380`; leave `#1482` poster/srcset alone
- **series:** script-tooling
- **verdict:** **SAFE** — relative photographic assets false-negative the base-path audit
- **CI / package.json callers:** `check:build`
- **target files:** `scripts/check-build.mjs` (`collectHtmlNonRootAssetRefs`)
- **measured baseline:** `<img src="assets/a.webp">` → `[]`; `<img src="assets/a.jpg">` → `[]`; `png`/`svg` still match via `/\.(js|css|webmanifest|ico|svg|png|woff2?)$/`.
- **acceptance criteria:** Include at least `webp`/`jpg`/`jpeg`/`gif` (and optionally `avif`); existing png/svg/js/css unchanged; not a poster/srcset attribute rewrite.
- **verification commands:** hermetic unit; `rg -n 'webmanifest\\|ico\\|svg\\|png' scripts/check-build.mjs`
- **conflict notes:** extension filter only; not `data-src` word-boundary (`1380`) or poster/srcset (`1369`).
- **screen:** SAFE.

### q-mp-1382 · Scripts: `parseMenuCriticalRefs` must include `.mjs` module assets

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave ba `1370` measureAllChunks / `1356` scanEnvLeakage alone; serialize with `1390` if same file
- **series:** script-tooling
- **verdict:** **SAFE** — size:check menu critical path under-counts ESM entry/preload chunks
- **CI / package.json callers:** `package.json` → `size:check` / `check:perf` (via `measureMenuCriticalPath`)
- **target files:** `scripts/check-bundle-budgets.mjs` (`parseMenuCriticalRefs`)
- **measured baseline:** `<script type="module" src="/assets/app.mjs"></script><link href="/assets/a.css" rel="stylesheet">` → `['assets/a.css']` only; filter is `\.(?:js|css)`.
- **acceptance criteria:** Accept `.mjs` (and `.cjs` if ever linked); quoted `src`/`href` word-boundary behavior unchanged; not a re-open of attribute-regex theater.
- **verification commands:** hermetic unit; `rg -n 'parseMenuCriticalRefs|js\\|css' scripts/check-bundle-budgets.mjs`
- **conflict notes:** menu-critical **extension** gap; not measureAllChunks (`1370`) / scanEnvLeakage (`1356`) / mapGameChunks.
- **screen:** SAFE.

### q-mp-1383 · Scripts: `check-lint-ratchet` must accept UTF-8 BOM on eslint JSON stdout

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1387` if sharing a strip helper; leave lint-buckets empty-stdout `1317` / dup flags `1360` alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM-prefixed eslint JSON fails the ratchet while lint-buckets already trims/accepts
- **CI / package.json callers:** `package.json` → `lint:ratchet` (blocking CI)
- **target files:** `scripts/check-lint-ratchet.mjs` (eslint JSON parse ~L125)
- **measured baseline:** `JSON.parse('\uFEFF[]')` throws; `parseEslintJsonReport({status:0,stdout:'\uFEFF[]',...})` → `{ok:true}` via `.trim()`.
- **acceptance criteria:** Strip leading U+FEFF (or trim) before parse; valid BOM+array proceeds to counts; truly malformed still fails closed.
- **verification commands:** hermetic unit or small fixture; `rg -n 'JSON\\.parse\\(result\\.stdout' scripts/check-lint-ratchet.mjs`
- **conflict notes:** eslint **stdout** BOM; not ceilings **file** BOM (`1387`).
- **screen:** SAFE.

### q-mp-1384 · Scripts: `report-coverage-map` must accept UTF-8 BOM coverage summaries

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave coverage heat/aggregate theater alone; not LH/heap BOM
- **series:** script-tooling
- **verdict:** **SAFE** — editor/tool BOM on `coverage-summary.json` becomes a hard fail
- **CI / package.json callers:** `package.json` → `report:coverage-map` (local / report-only)
- **target files:** `scripts/report-coverage-map.mjs` (summary `JSON.parse`)
- **measured baseline:** BOM + valid summary → exit **1** `report:coverage-map — malformed JSON… Unexpected token '﻿'`.
- **acceptance criteria:** Strip BOM; valid summary → dry-run/write succeeds; truly malformed still uses `malformedJsonMessage`.
- **verification commands:** hermetic unit / CLI dry-run; `rg -n 'JSON\\.parse\\(raw' scripts/report-coverage-map.mjs`
- **conflict notes:** BOM ingest only; not pct-heat / normalizeRepoPath theater.
- **screen:** SAFE.

### q-mp-1385 · Scripts: `engine-coverage-rank` must accept UTF-8 BOM coverage summaries

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave engine metric/TypeError theater alone
- **series:** script-tooling
- **verdict:** **SAFE** — same BOM class as coverage-map; rank CLI exits 2 on valid BOM JSON
- **CI / package.json callers:** `package.json` → `report:engine-coverage-rank`
- **target files:** `scripts/engine-coverage-rank.mjs` (`main` summary parse)
- **measured baseline:** BOM + valid engine row summary → exit **2** `error: failed to read coverage summary… Unexpected token '﻿'`.
- **acceptance criteria:** Strip BOM; valid summary ranks; invalid metric / empty-engine paths unchanged.
- **verification commands:** hermetic unit / CLI; `rg -n 'JSON\\.parse\\(readFileSync' scripts/engine-coverage-rank.mjs`
- **conflict notes:** BOM ingest only; not resolveMetric / InvalidCoverageMetricError theater.
- **screen:** SAFE.

### q-mp-1386 · Scripts: `report-knip` baseline load must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave knip.error / summarizeKnip / baseline schema theater alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM on `docs/dev/knip-baseline.json` is classified corrupt
- **CI / package.json callers:** `package.json` → `report:knip` (CI report-only)
- **target files:** `scripts/report-knip.mjs` (`loadBaseline`)
- **measured baseline:** `JSON.parse('\uFEFF'+baselineText)` throws → `kind: 'corrupt'`; `.trim()` would accept. Runner stdout already `.trim()`s before parse.
- **acceptance criteria:** Strip BOM before parse; valid baseline compares; truly corrupt still `corrupt`.
- **verification commands:** hermetic unit with injected io if present, or fixture; `rg -n 'loadBaseline|JSON\\.parse\\(fs\\.readFileSync\\(BASELINE' scripts/report-knip.mjs`
- **conflict notes:** baseline **file** BOM; not knip runner stdout / metrics schema.
- **screen:** SAFE.

### q-mp-1387 · Scripts: lint ceiling JSON loads must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1383` if sharing helper; leave `#1481` dup `--top`/`--rule` alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM on `lint-ratchet-ceilings.json` crashes lint-ratchet / lint-buckets before probe
- **CI / package.json callers:** `lint:ratchet` (blocking); `report:lint-buckets` (report-only)
- **target files:** `scripts/check-lint-ratchet.mjs`, `scripts/report-lint-buckets.mjs` (ceilings `JSON.parse`); optionally `scripts/report-ratchet-history.mjs` live file read
- **measured baseline:** `JSON.parse('\uFEFF'+ceilingsText)` throws (uncaught in both mains).
- **acceptance criteria:** Strip BOM in both readers (and ratchet-history if touched); valid ceilings proceed; malformed still fails closed without stack dump preferred.
- **verification commands:** hermetic unit; `rg -n 'CEILINGS_PATH|JSON\\.parse\\(fs\\.readFileSync' scripts/check-lint-ratchet.mjs scripts/report-lint-buckets.mjs`
- **conflict notes:** ceilings **file** BOM; not eslint stdout BOM (`1383`) / empty stdout (`1317`).
- **screen:** SAFE.

### q-mp-1388 · Scripts: `check-boundaries` ceiling load must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave boundaries stripComments / typeof-import HOLD ids alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM on `module-boundaries-ceilings.json` throws before compare
- **CI / package.json callers:** `package.json` → `check:boundaries` (blocking via `verify`)
- **target files:** `scripts/check-boundaries.mjs` (ceiling `JSON.parse`)
- **measured baseline:** `JSON.parse('\uFEFF'+boundariesText)` throws.
- **acceptance criteria:** Strip BOM; valid ceilings compare; leave layering/DOM probe logic unchanged.
- **verification commands:** hermetic unit or fixture; `rg -n 'CEILING_PATH|JSON\\.parse' scripts/check-boundaries.mjs`
- **conflict notes:** BOM ingest only; not `1201`–`1204`/`1220` schema theater.
- **screen:** SAFE.

### q-mp-1389 · Scripts: `check-type-ratchet` Phase-2 baseline must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave Phase-2 string-ceiling fail-open `1341` / type fail-open `1330` alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM on `type-ratchet-phase2-baseline.json` throws before ceiling check
- **CI / package.json callers:** `package.json` → `typecheck:ratchet` (blocking via `verify`)
- **target files:** `scripts/check-type-ratchet.mjs` (baseline `JSON.parse`)
- **measured baseline:** `JSON.parse('\uFEFF'+phase2Text)` throws.
- **acceptance criteria:** Strip BOM; numeric/string ceiling behavior unchanged (leave `1341` alone).
- **verification commands:** hermetic unit; `rg -n 'PHASE2_BASELINE|JSON\\.parse' scripts/check-type-ratchet.mjs`
- **conflict notes:** BOM ingest only; not fail-open / string coercion HOLD residuals.
- **screen:** SAFE.

### q-mp-1390 · Scripts: `size:check` budgets JSON must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave size:check flags / exit-code theater alone; serialize with `1382` if same PR preferred
- **series:** script-tooling
- **verdict:** **SAFE** — BOM on `bundle-budgets.json` throws after dist/ exists
- **CI / package.json callers:** `package.json` → `size:check` (CI soft via `--fail-on-new-over`)
- **target files:** `scripts/check-bundle-budgets.mjs` (budgets `JSON.parse`)
- **measured baseline:** `JSON.parse('\uFEFF'+budgetsText)` throws.
- **acceptance criteria:** Strip BOM; budget compare unchanged; unknown flags / missing dist/ exit 2 unchanged.
- **verification commands:** hermetic unit; `rg -n 'BUDGETS_PATH|JSON\\.parse' scripts/check-bundle-budgets.mjs`
- **conflict notes:** BOM ingest only; not `--fail-on-new-over` / partitionOvers theater.
- **screen:** SAFE.

### q-mp-1391 · Scripts: `report-licenses` lock / package.json reads must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave CycloneDX / license-classifier / maps theater alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM on `package-lock.json` or per-pkg `package.json` fails closed as malformed
- **CI / package.json callers:** `package.json` → `report:licenses` (local / report-only)
- **target files:** `scripts/report-licenses.mjs` (lock parse + `collectPackagesFromLock` pkg.json parse)
- **measured baseline:** `JSON.parse('\uFEFF{"packages":{"":{}}}')` throws → `malformedLockMessage` path; same for per-package license reads.
- **acceptance criteria:** Strip BOM on lock + pkg.json reads; usable-lock / empty-packages paths unchanged.
- **verification commands:** hermetic unit; `rg -n 'JSON\\.parse\\(fs\\.readFileSync' scripts/report-licenses.mjs`
- **conflict notes:** BOM ingest only; not SBOM schema / license maps.
- **screen:** SAFE.

### q-mp-1392 · Scripts: `check-pwa-manifest` must accept UTF-8 BOM manifests

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave pwa-manifest-contract / icon theater alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM on built `site.webmanifest` fails JSON parse before `validateManifest`
- **CI / package.json callers:** `package.json` → `check:pwa-manifest` (CI soft / report-only)
- **target files:** `scripts/check-pwa-manifest.mjs` (manifest `JSON.parse`)
- **measured baseline:** `JSON.parse('\uFEFF{"name":"x","start_url":"/"}')` throws.
- **acceptance criteria:** Strip BOM then validate; contract rules unchanged.
- **verification commands:** hermetic unit; `rg -n 'JSON\\.parse\\(fs\\.readFileSync\\(manifestPath' scripts/check-pwa-manifest.mjs`
- **conflict notes:** BOM ingest only; not REQUIRED_MANIFEST / icon purpose theater.
- **screen:** SAFE.

### q-mp-1393 · Scripts: `check-build` webmanifest parse must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize after `1380`/`1381`; leave folded check-build chunk/html/health alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM on `dist/site.webmanifest` marks manifestOk false via parse throw path
- **CI / package.json callers:** `check:build` (report-only)
- **target files:** `scripts/check-build.mjs` (`auditSourcemapsAndBase` manifest `JSON.parse`)
- **measured baseline:** `JSON.parse('\uFEFF{"start_url":"/"}')` throws inside try → manifest issues.
- **acceptance criteria:** Strip BOM before parse; `start_url` checks unchanged; not a precache-parser rewrite.
- **verification commands:** hermetic unit; `rg -n 'site\\.webmanifest|JSON\\.parse\\(manifest' scripts/check-build.mjs`
- **conflict notes:** build-audit manifest BOM; not `check-pwa-manifest` (`1392`) contract path.
- **screen:** SAFE.

### q-mp-1394 · Scripts: render-perf prior JSON merge must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave render-perf/runtime-perf date/harness theater alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM on prior `render-perf-*-*.json` drops merge history (parse catch → null prior)
- **CI / package.json callers:** `package.json` → `perf:render` / render-perf-mode writers (local)
- **target files:** `scripts/render-perf-mode.mjs` (`writeRenderReport` prior `JSON.parse`); optionally `scripts/render-perf.mjs` twin reader
- **measured baseline:** `JSON.parse('\uFEFF{"results":[]}')` throws → prior treated absent.
- **acceptance criteria:** Strip BOM; prior results merge when schema valid; corrupt still ignored/fails soft as today.
- **verification commands:** hermetic unit; `rg -n 'JSON\\.parse\\(await readFile' scripts/render-perf-mode.mjs scripts/render-perf.mjs`
- **conflict notes:** BOM ingest on prior artifact; not PERF_DATE hardcoded / CPU throttle theater.
- **screen:** SAFE.

### q-mp-1395 · Docs: wiki development CI posture must mention soft `check:copy-pins`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave README CI posture / tip-count remasure alone; leave `#1457`/`1342` CONTRIBUTING alone except optional one-line Branches cross-link
- **series:** docs-accuracy
- **verdict:** **SAFE** — living wiki disagrees with AGENTS / CONTRIBUTING / `ci.yml` soft copy-pins step
- **CI / package.json callers:** docs only (no runtime)
- **target files:** `docs/wiki/development.md` (CI posture public bullet; optional Branches note that agent drafts target tip)
- **measured baseline:** `## CI posture (public)` block has **no** `copy-pins`; CONTRIBUTING L22 and AGENTS document `npm run check:copy-pins -- --fail` with `continue-on-error: true` after `verify`; Branches table still says `alpha` “Target PRs here” without agent-draft tip pointer (CONTRIBUTING already clarified).
- **acceptance criteria:** CI posture mentions soft copy-pins after verify (outside `package.json` `verify`); optional one-line Branches clarification for agent drafts→tip; no count-cell remasure; no README rewrite.
- **verification commands:** `rg -n 'copy-pins|Target PRs|CI posture' docs/wiki/development.md CONTRIBUTING.md AGENTS.md`
- **conflict notes:** wiki accuracy vs package.json/ci.yml; not README CI posture theater / unit-count stamps.
- **screen:** SAFE.

## Out of scope this refill (measured but skipped)

| Surface | Why skipped |
| --- | --- |
| `runtime-perf` / `console-sweep` / `nav-away` `` `${base}/#/` `` trailing-slash mash | sibling of ba `1372` memory-leak prepareMenu |
| `isOfflineProbeLazyGameChunk('…game-hex-x.mjs')` → false | probe-offline classify exhausted |
| `mapGameChunks([game-hex-x.mjs])` → unmapped | mapGameChunks exhausted |
| `maxLongTaskMs([{duration:'12'}])` → `0` | render-perf/runtime-perf exhausted |
| `readMetric({pct:'90'})` → absent | report-coverage-map exhausted |
| `isDeepPlaytestEndStatus('You win!')` → false | deep-playtest end regexes exhausted |
| `isHttpResponseReady({ok:true,status:0\|404})` | ba `1376` |
| knip unusedExports LEAVE trio in `src/` | intentional LEAVE; not scripts demote |
| `defaultAiTouchedFiles` zero importers | prior HOLD-CHECK demote; leave contained |

## Next action

Next action: fold into tip by the tip owner.
