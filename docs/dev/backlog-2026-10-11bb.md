# Engineering backlog — 2026-10-11bb (tip refill after ba queue / round-54)

**Task id:** `q-mp-090bb`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post38d2` @ `b6afb7ab` (full `b6afb7ab374ff6a182b98ca0edc0fb45ad7abe3f`; tip cut from `alpha` @ `38d22ce0`; living pointers set by `q-mp-026ag`; ba backlog `#1471` still open as draft; ba SAFE implementers `#1472`–`#1487` open drafts)  
**Depends on:** tip `cursor/mp-tip-post38d2` @ `b6afb7ab`. Round-53 backlog (`q-mp-090ba` / open `#1471`, ids `q-mp-1356`…`1377`) — leave with `contained`; do **not** re-queue ba families or siblings. Round-52 az (`1331`…`1355`) and earlier — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post38d2` @ `b6afb7ab` measures unit files **3458**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **22 new** concrete engineering tasks (`q-mp-1381` … `q-mp-1402`) mined from the **live tip tree**, checked against prior refills through `q-mp-1377` (ba `#1471` + implementers `#1472`–`#1487`), and against the full open draft PR list. It is the **only** deliverable of `q-mp-090bb`.

**Honest count:** **22** tasks (not 25) with measured wrong-results / A/B leaks / docs drift — not padded from exhausted families. Id range starts at `q-mp-1381` per round-54 brief. Round-53 already claimed `scanEnvLeakage` `.mjs`, emit wave5 merge-base, mutation dup/flag-like `--json=`, lint-buckets dup `--top`/`--rule`, LH/heap BOM, burn-1007 + residual hidden/visibilityState/serviceWorker restores (ba file lists), polyomino/fab/pent/fiar shards, collectHtml poster/srcset, measureAllChunks `.mjs`, ai-typeonly `npx tsc`, memory-leak prepareMenu trailing slash, emit dup `--base`/`--head`, calla `PLAYTEST_BASE`, shapeLh numeric strings, `isHttpResponseReady` status, emit wave5 comment — **do not** re-queue `1356`–`1377`. This refill **does not** re-queue exhausted families from the round-54 brief (including ba’s list): `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-name pointers, knip remeasure, AI harness speed, license-classifier, pwa-manifest-contract, check-pwa-manifest (contract/icon theater), check-workflows parsing, precache parser, check-build asset/precache audits, menu-critical-ref (attribute regex theater), md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas, prototype-restore, engine-coverage-rank (metric/TypeError theater), report-coverage-map (heat/aggregate theater), ratchet-history ceilings/mergeHistory, env-number, render-perf/runtime-perf, mobile-audit, console-sweep, mutation-report games, check-dev-doc-links, probe-offline classify, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest end regexes, webkit-offline-probe, artifact-dir, README CI posture, PATH_RE, PLAYTEST\_\* env docs, hex mutation globs, flattenKnip, eslint probe path, fab/fraction-pinball/calibration env parsing, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl, emit-identity minify, ratchet-history lint keys, queens fuzz wall, runLighthouse JSON, waitForGameReady load-error, offline probe board/recovered, offline-dev date, report-licenses maps, mapGameChunks, emit-identity base (except wave5 already queued), withSeededRandom, storage-stubs, hex-ui styles, playtest BASE join/seed, queens e2e seed, type-ratchet phase2 docs, engine-property immutability, heap self_size, typePhase2 coercion, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty stdout, mutation ARITH/infra-error/dead export, playtest OUT date, reporter BOM, mutation --max sci-notation, matchMedia restore, queens seed-B shard, emit ++/-- spacing, ai-calibration unknown winners, lint/type-ratchet fail-open, heap truncated nodes, console-sweep summary, emit-identity parseArgs value-slot, check-build chunk/html/health, probe browsers, offline mount ints, flake-loop corrupt JSON/failed/duplicate flags, CONTRIBUTING PR base, queens/fab/engine-property shards, PLAYTEST_SEED_ENV, document.hidden/requestIdleCallback/innerWidth/visibilityState/navigator.onLine restores (ba/az file sets), withSeededRandom/withOracleRandom thenables, ai-calibration OUT date, env-leak `.mjs`, html poster/srcset, emit default merge-base/duplicate `--base`/`--head`, mutation/lint-buckets duplicate flags, LH/heap BOM ingest, check-perf `.mjs` chunks/numeric scores, burn-1007/residual hidden + serviceWorker (ba lists), polyomino/fab/pent/fiar shards, ai-typeonly docs, memory-leak baseURL join, calla `PLAYTEST_BASE`, `isHttpResponseReady` status. No NaN/null-coercion micro-fixes unless real data hits them. No trailing-slash URL mash siblings of `1372`. No offline-classify / mapGameChunks `.mjs` siblings. No webp/jpg HTML ext theater (public ships png/svg only; check-build comment intentionally omits webp until shipped).

**Fresh payoffs on this tip (re-measured @ `b6afb7ab` after ba queue + open `#1472`–`#1487`):** **`parseArgs` silently last-wins duplicate `--files-from`**, **`--files-from --json` accepted as a path (“path not found”) while `--base --json` is flag-like**, **`collectHtmlNonRootAssetRefs` false-positives `data-src` / `ng-src` (no word-boundary; menu-critical already has one)**, **same helper misses `.mjs` script refs while `listChunkNames` already tracks module chunks**, **`parseMenuCriticalRefs` misses `.mjs`**, **`check-lint-ratchet` rejects BOM eslint JSON while `parseEslintJsonReport` trims/accepts**, **knip baseline / coverage-map / engine-coverage-rank / lint ceilings / boundaries ceilings / type phase2 / bundle-budgets JSON readers reject UTF-8 BOM**, **burn-1008 suites leak `document.hidden` / `visibilityState` / `navigator.serviceWorker` / `navigator.onLine` outside ba `1363`–`1365` file sets (A/B)**, **`docs/wiki/development.md` Branches still says only “Target PRs here” for `alpha` after CONTRIBUTING tip-draft clarification**, **wiki CI posture (public) omits soft `check:copy-pins` that AGENTS/CONTRIBUTING/`ci.yml` document**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake/restore hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Ay/az/ba lint/type fail-open + Phase-2 string ceiling stay prior.

## Duplicate check (do not re-queue)

| Topic family                                                                          | Why skipped                                                             |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| round-53 ba `1356`–`1377` (+ `#1471`; tip drafts `#1472`–`#1487`)                     | leave with `contained`; this refill’s tickets are **new** surfaces only |
| round-52 az `1331`–`1355` / ay `1310`–`1330` / earlier                                | leave with `contained`                                                  |
| collectHtml **poster/srcset** (`1369` / `#1482`)                                      | `data-src` word-boundary FP + `.mjs` ext FN are new                     |
| menu-critical-ref **attribute** regex theater                                         | `.mjs` extension gap in `parseMenuCriticalRefs` is new                  |
| measureAllChunks / scanEnvLeakage `.mjs` (`1370` / `1356`)                            | size:check menu-critical `.mjs` is a different audit helper             |
| emit dup `--base`/`--head` (`1373`) / value-slot (`1333`) / wave5 (`1357`/`1377`)     | `--files-from` dup + flag-like path honesty are new                     |
| LH/heap/reporter BOM (`1361`/`1362`/`1321`)                                           | other JSON readers’ BOM ingest residuals are new                        |
| burn-1007 / ba residual hidden+sw (`1363`–`1365`)                                     | burn-1008 + offline onLine residuals are new file sets                  |
| CONTRIBUTING vs AGENTS PR base (`1342`)                                               | wiki Branches / CI posture residuals are new                            |
| memory-leak trailing-slash (`1372`)                                                   | **do not** sibling other harness `//#/` mashes in this refill           |
| probe-offline classify / mapGameChunks `.mjs`                                         | leave exhausted                                                         |
| knip unusedExports LEAVE trio                                                         | no new SAFE demote                                                      |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions | hard-rule HOLD                                                          |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `b6afb7ab`)

| Id                                   | Title (short)               | Verdict                        | Evidence @ `b6afb7ab`                                        |
| ------------------------------------ | --------------------------- | ------------------------------ | ------------------------------------------------------------ |
| `q-mp-090ba` / `#1471`               | round-53 backlog            | **open draft on tip**          | This refill starts at `1381`; do not re-queue `1356`–`1377`. |
| `#1472`–`#1487`                      | ba SAFE implementers        | **open drafts**                | Leave with `contained`.                                      |
| `q-mp-090az` / `#1448`               | round-52 backlog            | **open on old tip `postc4a7`** | leave with `contained`.                                      |
| `q-mp-1201`…`1204` / `1220` / `1214` | boundaries + size soft-gate | **still-valid; no tip PR yet** | Leave prior ids — **do not** re-queue.                       |
| `q-mp-1309` / `1328`…`1330` / `1341` | HOLD-CHECK residuals        | **still-valid**                | Leave prior ids — do not sibling.                            |
| knip unusedExports                   | live `--json`               | **3 LEAVE**                    | No new SAFE demote.                                          |

## Shared-file conflict flags

| Shared file                        | Conflicting new ids                                       |
| ---------------------------------- | --------------------------------------------------------- |
| `scripts/check-emit-identity.mjs`  | `1381` + `1382` — serialize; leave ba emit alone          |
| `scripts/check-build.mjs`          | `1383` + `1384` + `1402` — serialize; leave `#1482` alone |
| `scripts/check-bundle-budgets.mjs` | `1385` + `1401` — serialize                               |
| `scripts/check-lint-ratchet.mjs`   | `1386` + `1390` — serialize                               |
| `scripts/report-knip.mjs`          | `1387` only                                               |
| `scripts/report-coverage-map.mjs`  | `1388` only                                               |
| `scripts/engine-coverage-rank.mjs` | `1389` only                                               |
| `scripts/report-lint-buckets.mjs`  | `1390` — ceilings file BOM; leave `#1481` alone           |
| `scripts/check-boundaries.mjs`     | `1391` only                                               |
| `scripts/check-type-ratchet.mjs`   | `1392` only                                               |
| burn-1008 hidden suites            | `1393` + `1394` — one PR or serialize                     |
| burn-1008 sw / visibility suites   | `1395` + `1396` — one PR or serialize                     |
| residual `navigator.onLine` suites | `1397` — one PR or serialize; leave `#1466`/`1355` alone  |
| `docs/wiki/development.md`         | `1398` + `1399` — serialize; **not** README CI posture    |

**Parallel-friendly:** `1385`, `1386`, `1387`, `1388`, `1389`, `1391`, `1392`, `1393`, `1394`, `1395`, `1396`, `1397`, `1401`. Serialize `1381`→`1382`; `1383`→`1384`→`1402`; `1386`↔`1390`; `1398`→`1399`.

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
$ parseArgs(['--base','--json']) → exit 2 “requires a git ref (missing or flag-like value)”
$ collectHtmlNonRootAssetRefs('<img data-src=… src=…>') → both paths; menu-critical word-boundary keeps only real src
$ collectHtmlNonRootAssetRefs('<script src="assets/a.mjs">') → []; '.js' still works
$ parseMenuCriticalRefs('<script src="/assets/app.mjs">…css…') → ['assets/a.css'] only
$ parseEslintJsonReport({status:1, stdout: BOM+'[…]'}) → ok:true; JSON.parse(BOM+'[…]') throws
$ JSON.parse(BOM + knip-baseline|ceilings|boundaries|phase2|budgets) → throw
$ A/B unit-shared: burn-1008-r3/r2-owl → ownH; r5 → ownV+swOwn; r4 → swOwn; r2-shell + mutation-ui offline + 430 → onLineOwn
$ docs/wiki/development.md Branches — “Target PRs here” on alpha only; CI posture (public) — no copy-pins

$ Open drafts into cursor/mp-tip-post38d2 at audit: #1471–#1487 (ba backlog + implementers); #1451–#1470 (az)
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090bb-repros.log`.

## New tasks

### q-mp-1381 · Scripts: emit-identity must reject duplicate `--files-from`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1382`; leave ba `#1478` / `1373` `--base`/`--head` alone
- **series:** script-tooling
- **verdict:** **SAFE** — second `--files-from` silently last-wins the file list
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local / report-only)
- **target files:** `scripts/check-emit-identity.mjs` (`parseArgs`)
- **measured baseline:** `parseArgs(['--base','HEAD','--files-from',a,'--files-from',b])` with `a`→`hex/ai.ts`, `b`→`fiar/ai.ts` → `{ files: ['src/games/fiar/ai.ts'] }` (a discarded).
- **acceptance criteria:** Duplicate `--files-from` → exit 2 / clear message; single `--files-from` unchanged; `--base`/`--head` dup behavior left to ba `1373`.
- **verification commands:** hermetic unit; `rg -n 'files-from|sawFilesFrom' scripts/check-emit-identity.mjs`
- **conflict notes:** value-flag duplicate honesty for `--files-from` only; not `--base`/`--head` (`1373`).
- **screen:** SAFE.

### q-mp-1382 · Scripts: emit `--files-from` must reject flag-like paths

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize after `1381`; leave ba value-slot `#1455`/`1333` alone
- **series:** script-tooling
- **verdict:** **SAFE** — `--files-from --json` is reported as “path not found” instead of flag-like honesty peers `--base`
- **CI / package.json callers:** `package.json` → `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (`parseArgs` / `isMissingOrFlagLikeRef` reuse)
- **measured baseline:** `parseArgs(['--base','HEAD','--files-from','--json'])` → exit 2 `path not found: --json`; `isMissingOrFlagLikeRef('--json')` → `true`; `--base --json` → flag-like ref error.
- **acceptance criteria:** Flag-like / missing `--files-from` values → clear flag-like/missing message (peer `--base`); real missing files still “path not found”; normal list paths unchanged.
- **verification commands:** hermetic unit via spawn; `rg -n 'files-from|isMissingOrFlagLikeRef' scripts/check-emit-identity.mjs`
- **conflict notes:** flag-like value-slot for `--files-from` only; not duplicate `--files-from` (`1381`).
- **screen:** SAFE.

### q-mp-1383 · Scripts: `collectHtmlNonRootAssetRefs` must use word-boundary (no `data-src` FP)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1384`/`1402`; leave ba poster/srcset `#1482`/`1369` alone
- **series:** script-tooling
- **verdict:** **SAFE** — `data-src` / `ng-src` false-positive as `src` (menu-critical already has `(?<![A-Za-z0-9_-])`)
- **CI / package.json callers:** `package.json` → `check:build` (report-only)
- **target files:** `scripts/check-build.mjs` (`collectHtmlNonRootAssetRefs`)
- **measured baseline:** `<img data-src="assets/x.png" src="assets/y.png">` → `['assets/x.png','assets/y.png']`; `<img ng-src="assets/x.png" src="assets/y.png">` → both; menu-critical on `data-src` keeps only real `src`.
- **acceptance criteria:** Require attribute word-boundary so `data-src` / `ng-src` / `xsrc` are ignored; real `src`/`href` unchanged; poster/srcset left to ba `1369`.
- **verification commands:** hermetic unit; `rg -n 'collectHtmlNonRootAssetRefs|src\\|href' scripts/check-build.mjs`
- **conflict notes:** word-boundary FP fix only; **not** menu-critical-ref attribute theater rewrite; not poster/srcset.
- **screen:** SAFE.

### q-mp-1384 · Scripts: `collectHtmlNonRootAssetRefs` must include `.mjs`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize after `1383`; leave ba scanEnvLeakage `#1482`/`1356` alone
- **series:** script-tooling
- **verdict:** **SAFE** — module script refs false-negative the base-path audit while chunk listing already tracks `.mjs`
- **CI / package.json callers:** `package.json` → `check:build`
- **target files:** `scripts/check-build.mjs` (`collectHtmlNonRootAssetRefs` extension filter)
- **measured baseline:** `<script src="assets/a.mjs">` → `[]`; `<script src="assets/a.js">` → `['assets/a.js']`; filter is `/\.(js|css|webmanifest|ico|svg|png|woff2?)$/`.
- **acceptance criteria:** Include `.mjs` (and `.cjs` if desired for parity with env-leak); `.js`/`.css` unchanged; do **not** add webp/jpg until a tip build ships them (existing comment).
- **verification commands:** hermetic unit; `rg -n 'js\\|css\\|webmanifest|mjs' scripts/check-build.mjs`
- **conflict notes:** HTML asset extension set only; not env-leak filter (`1356`); not poster/srcset.
- **screen:** SAFE.

### q-mp-1385 · Scripts: `parseMenuCriticalRefs` must include `.mjs`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1401`; leave measureAllChunks ba `1370` alone
- **series:** script-tooling
- **verdict:** **SAFE** — menu-critical gzip path omits module chunks the build may emit
- **CI / package.json callers:** `package.json` → `size:check` / `check:bundle-budgets` (report-only; soft gate in CI build)
- **target files:** `scripts/check-bundle-budgets.mjs` (`parseMenuCriticalRefs`)
- **measured baseline:** `<script src="/assets/app.mjs">` + css → `['assets/a.css']` only; `.js`+css → both; regex is `\\.(?:js|css)`.
- **acceptance criteria:** Accept `/assets|vendor/….(js|mjs|css)`; word-boundary keep; hermetic unit; **not** a menu-critical attribute-regex theater rewrite.
- **verification commands:** hermetic unit; `rg -n 'parseMenuCriticalRefs|js\\|css' scripts/check-bundle-budgets.mjs`
- **conflict notes:** extension parity with folded check-build `listChunkNames` / ba measureAllChunks; not check-bundle-budgets exit-code theater.
- **screen:** SAFE.

### q-mp-1386 · Scripts: `check-lint-ratchet` must accept UTF-8 BOM on eslint stdout

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1390`; leave lint-buckets empty-stdout `1317` / dup flags `1360` alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM-prefixed eslint JSON throws while `parseEslintJsonReport` trims/accepts
- **CI / package.json callers:** `package.json` → `lint:ratchet` (blocking verify / CI lint)
- **target files:** `scripts/check-lint-ratchet.mjs` (eslint stdout `JSON.parse`)
- **measured baseline:** `JSON.parse('\uFEFF'+'[{…}]')` throws; `parseEslintJsonReport({status:1, stdout:'\uFEFF'+body})` → `{ok:true}`.
- **acceptance criteria:** Strip/trim BOM before parse (peer lint-buckets); valid BOM+JSON report still counts; truly malformed still fails; **HOLD-CHECK posture:** do not change live ceiling verdicts / fail-open behavior (`1328`–`1330`).
- **verification commands:** hermetic unit or fixture spawn; `rg -n 'JSON\\.parse\\(result\\.stdout|FEFF|trim' scripts/check-lint-ratchet.mjs`
- **conflict notes:** eslint **stdout** BOM ingest only; ceilings **file** BOM is `1390`. Touching a CI-gating script → keep parse-only; no ceiling number edits.
- **screen:** **HOLD-CHECK** (lint:ratchet is a CI-gating script — BOM strip must not alter totals on non-BOM input).

### q-mp-1387 · Scripts: knip baseline loader must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave knip.error `1313` / summarizeKnip / baseline remasure alone
- **series:** script-tooling
- **verdict:** **SAFE** — editor-saved BOM baseline becomes “unparseable”
- **CI / package.json callers:** `package.json` → `report:knip` (report-only CI)
- **target files:** `scripts/report-knip.mjs` (`loadBaseline`)
- **measured baseline:** `JSON.parse('\uFEFF'+fs.readFileSync('docs/dev/knip-baseline.json'))` throws; non-BOM baseline loads.
- **acceptance criteria:** Strip BOM before parse; schema validation unchanged; no baseline metric rewrite / remasure theater.
- **verification commands:** hermetic unit; `rg -n 'loadBaseline|JSON\\.parse|FEFF' scripts/report-knip.mjs`
- **conflict notes:** BOM ingest only; not knip.error fail / unusedTypes drop.
- **screen:** SAFE.

### q-mp-1388 · Scripts: coverage-map must accept UTF-8 BOM on summary JSON

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave coverage-map heat/weight theater alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM summary exits malformed while reporter already strips BOM
- **CI / package.json callers:** `package.json` → `report:coverage-map` (local / report-only)
- **target files:** `scripts/report-coverage-map.mjs` (summary `JSON.parse`)
- **measured baseline:** `node scripts/report-coverage-map.mjs` on BOM summary → exit 1 `malformed JSON` / Unexpected token BOM.
- **acceptance criteria:** Strip BOM; valid BOM+summary produces the same map as non-BOM; truly malformed still fails.
- **verification commands:** hermetic fixture; `rg -n 'JSON\\.parse|FEFF|malformed' scripts/report-coverage-map.mjs`
- **conflict notes:** BOM ingest residual; not heat/aggregate / line-weight theater.
- **screen:** SAFE.

### q-mp-1389 · Scripts: engine-coverage-rank must accept UTF-8 BOM on summary JSON

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave engine-coverage-rank missing-metrics theater alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM summary exits 2 before rank
- **CI / package.json callers:** `package.json` → `report:engine-coverage-rank` (local)
- **target files:** `scripts/engine-coverage-rank.mjs`
- **measured baseline:** `node scripts/engine-coverage-rank.mjs` on BOM summary → exit 2 `failed to read coverage summary` / Unexpected token BOM.
- **acceptance criteria:** Strip BOM; ranking math unchanged on non-BOM; empty-engine / missing-metrics semantics unchanged.
- **verification commands:** hermetic fixture; `rg -n 'JSON\\.parse|FEFF' scripts/engine-coverage-rank.mjs`
- **conflict notes:** BOM ingest only; not metric/TypeError theater.
- **screen:** SAFE.

### q-mp-1390 · Scripts: lint ceilings file readers must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1386` if same PR; leave `#1481`/`1360` dup flags alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM `lint-ratchet-ceilings.json` throws in both ratchet + buckets readers
- **CI / package.json callers:** `lint:ratchet` (gating) + `report:lint-buckets` (report-only)
- **target files:** `scripts/check-lint-ratchet.mjs`, `scripts/report-lint-buckets.mjs` (ceilings `JSON.parse`)
- **measured baseline:** `JSON.parse('\uFEFF'+ceilings)` throws in both paths.
- **acceptance criteria:** Shared strip or twin strips; non-BOM ceilings unchanged; **no** ceiling value edits; lint:ratchet totals on non-BOM input identical.
- **verification commands:** hermetic unit; `rg -n 'CEILINGS_PATH|JSON\\.parse|FEFF' scripts/check-lint-ratchet.mjs scripts/report-lint-buckets.mjs`
- **conflict notes:** ceilings **file** BOM; eslint stdout BOM is `1386`.
- **screen:** **HOLD-CHECK** (touches lint:ratchet ceilings load — parse-only).

### q-mp-1391 · Scripts: boundaries ceilings loader must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave stripComments HOLD-CHECK `1201`–`1204`/`1220` alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM `module-boundaries-ceilings.json` throws before boundary probe
- **CI / package.json callers:** `package.json` → `check:boundaries` (blocking verify)
- **target files:** `scripts/check-boundaries.mjs`
- **measured baseline:** `JSON.parse('\uFEFF'+boundariesCeilings)` throws.
- **acceptance criteria:** Strip BOM; non-BOM ceilings + probe totals unchanged; **no** stripComments / schema sibling of `1201`–`1220`.
- **verification commands:** hermetic unit; `rg -n 'CEILING_PATH|JSON\\.parse' scripts/check-boundaries.mjs`
- **conflict notes:** BOM ingest only; not boundaries schema HOLD ids.
- **screen:** **HOLD-CHECK** (CI-gating `check:boundaries` — parse-only).

### q-mp-1392 · Scripts: type-ratchet Phase-2 baseline must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave fail-open `1328`–`1330` / Phase-2 string ceiling `1341` alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM phase2 baseline throws before compare
- **CI / package.json callers:** `package.json` → `typecheck:ratchet` (blocking verify)
- **target files:** `scripts/check-type-ratchet.mjs`
- **measured baseline:** `JSON.parse('\uFEFF'+phase2Baseline)` throws.
- **acceptance criteria:** Strip BOM; non-BOM baseline compare unchanged; no Phase-2 coercion / fail-open sibling.
- **verification commands:** hermetic unit; `rg -n 'PHASE2_BASELINE|JSON\\.parse' scripts/check-type-ratchet.mjs`
- **conflict notes:** BOM ingest only; not Phase-2 docs / string ceiling.
- **screen:** **HOLD-CHECK** (CI-gating type ratchet — parse-only).

### q-mp-1393 · Tests: restore `document.hidden` after burn-1008 tablet-gl loaders stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave ba `#1477`/`1363` burn-1007 alone; serialize with `1394`
- **series:** test-hygiene
- **verdict:** **SAFE** — unit-shared isolate:false leak
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/burn-1008-ui-cov-r3-tablet-gl-loaders.test.ts`
- **measured baseline:** A/B `--project unit-shared --maxWorkers=1 --no-file-parallelism`: alone `hasOwnH:false`; after this file `hasOwnH:true`.
- **acceptance criteria:** Save/restore `document.hidden` descriptor in `afterEach`; no product tablet-gl behavior change.
- **verification commands:** A/B as above; `rg -n 'hidden|afterEach' tests/unit/burn-1008-ui-cov-r3-tablet-gl-loaders.test.ts`
- **conflict notes:** burn-1008 residual; not ba burn-1007 / 1364 file list.
- **screen:** SAFE.

### q-mp-1394 · Tests: restore `document.hidden` after burn-1008 owl-idle stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1393`; leave az `#1460`/`1346` alone
- **series:** test-hygiene
- **verdict:** **SAFE** — measured A/B leak
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/burn-1008-ui-cov-r2-owl-idle.test.ts`
- **measured baseline:** alone `hasOwnH:false`; after file `hasOwnH:true`.
- **acceptance criteria:** Save/restore `document.hidden` in `afterEach`; happy-path asserts unchanged.
- **verification commands:** A/B; `rg -n 'hidden|afterEach' tests/unit/burn-1008-ui-cov-r2-owl-idle.test.ts`
- **conflict notes:** not idle-warm-bootstrap-owl (already clean on tip).
- **screen:** SAFE.

### q-mp-1395 · Tests: restore `visibilityState` + `serviceWorker` after burn-1008 PWA flags stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave ba `#1486`/`1365` alone; serialize with `1396`
- **series:** test-hygiene
- **verdict:** **SAFE** — sticky visibilityState + serviceWorker under isolate:false
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/burn-1008-ui-cov-r5-pwa-flags-pointer.test.ts`
- **measured baseline:** alone `{hasOwnV:false,hasOwnSw:false}`; after file both `true`.
- **acceptance criteria:** Save/restore both descriptors in `afterEach`; no product PWA flag behavior change.
- **verification commands:** A/B; `rg -n 'visibilityState|serviceWorker|afterEach' tests/unit/burn-1008-ui-cov-r5-pwa-flags-pointer.test.ts`
- **conflict notes:** burn-1008 residual; not ba 484/burn-1009/256 list.
- **screen:** SAFE.

### q-mp-1396 · Tests: restore `navigator.serviceWorker` after burn-1008 offline-motion stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1395`
- **series:** test-hygiene
- **verdict:** **SAFE** — sticky serviceWorker object
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/burn-1008-ui-cov-r4-offline-motion-demos.test.ts`
- **measured baseline:** alone `hasOwnSw:false`; after file `hasOwnSw:true`.
- **acceptance criteria:** Save/restore `navigator.serviceWorker` in `afterEach`.
- **verification commands:** A/B; `rg -n 'serviceWorker|afterEach' tests/unit/burn-1008-ui-cov-r4-offline-motion-demos.test.ts`
- **conflict notes:** not ba `1365` file set.
- **screen:** SAFE.

### q-mp-1397 · Tests: restore `navigator.onLine` after residual offline / shell stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** leave az `#1466`/`1355` offline-helpers alone; one PR for listed files
- **series:** test-hygiene
- **verdict:** **SAFE** — measured A/B onLine leaks outside the az 1355 file
- **CI / package.json callers:** `package.json` → `test:unit` (unit-shared)
- **target files:** `tests/unit/burn-1008-ui-cov-r2-shell-helpers.test.ts`, `tests/unit/mutation-ui11-offline.test.ts`, `tests/unit/mutation-ui-offline.test.ts`, `tests/unit/q-mp-430-game-error-boundary-offline-residuals.test.ts`
- **measured baseline:** alone `hasOwnOnLine:false`; after each listed offender `hasOwnOnLine:true`.
- **acceptance criteria:** Save/restore `navigator.onLine` descriptor in `afterEach` for each offender; no product offline behavior change.
- **verification commands:** A/B per file; `rg -n 'onLine|afterEach' tests/unit/mutation-ui-offline.test.ts tests/unit/burn-1008-ui-cov-r2-shell-helpers.test.ts`
- **conflict notes:** residual of `1355`; do not re-edit offline-helpers.test.ts.
- **screen:** SAFE.

### q-mp-1398 · Docs: wiki Branches must distinguish human `alpha` vs agent tip drafts

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1399`; leave folded `#1457`/`1342` CONTRIBUTING alone
- **series:** docs
- **verdict:** **SAFE** — wiki still says alpha “Target PRs here” after CONTRIBUTING tip-draft clarification
- **CI / package.json callers:** none (docs-only)
- **target files:** `docs/wiki/development.md` (Branches table)
- **measured baseline:** `| alpha | Trunk. Target PRs here. |` with no tip-draft row; CONTRIBUTING: humans → `alpha`, cloud agents → living `cursor/mp-tip-*` draft.
- **acceptance criteria:** Branches table (or adjacent sentence) matches CONTRIBUTING/AGENTS: human/trunk PRs → `alpha`; agent drafts → living tip; no tip SHA / unit-count remasure theater.
- **verification commands:** `rg -n 'Branches|Target PRs|mp-tip|draft' docs/wiki/development.md CONTRIBUTING.md`
- **conflict notes:** wiki residual of `1342`; not README CI posture / tip-name count stamps.
- **screen:** SAFE.

### q-mp-1399 · Docs: wiki CI posture must mention soft `check:copy-pins`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize after `1398`; **not** check-copy-pins scanner theater
- **series:** docs
- **verdict:** **SAFE** — public CI posture bullet omits soft copy-pins step that AGENTS/CONTRIBUTING/`ci.yml` document
- **CI / package.json callers:** none (docs-only)
- **target files:** `docs/wiki/development.md` (`## CI posture (public)`)
- **measured baseline:** CI posture bullet lists lint→boundaries, audit, build soft size:check, unit, e2e, report-only knip/…/visual-baseline — **no** `copy-pins`; AGENTS table + CONTRIBUTING + `ci.yml` soft `check:copy-pins -- --fail` (`continue-on-error: true`) after verify.
- **acceptance criteria:** Mention soft copy-pins after verify (outside `package.json` `verify`); no findings-total remasure; no README rewrite.
- **verification commands:** `rg -n 'copy-pins|CI posture' docs/wiki/development.md AGENTS.md .github/workflows/ci.yml`
- **conflict notes:** docs accuracy only; not check-copy-pins implementation / pin counts.
- **screen:** SAFE.

### q-mp-1400 · Scripts: size:check budgets JSON must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize with `1385` if same file PR preferred; leave size:check flags `1312` / exit-code theater alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM `bundle-budgets.json` throws before measurement
- **CI / package.json callers:** `package.json` → `size:check` (soft in CI build)
- **target files:** `scripts/check-bundle-budgets.mjs`
- **measured baseline:** `JSON.parse('\uFEFF'+budgets)` throws.
- **acceptance criteria:** Strip BOM; non-BOM budgets + OVER partition unchanged; no knownOvers rewrite.
- **verification commands:** hermetic unit; `rg -n 'BUDGETS_PATH|JSON\\.parse' scripts/check-bundle-budgets.mjs`
- **conflict notes:** BOM ingest only; not `--fail-on-new-over` exit theater.
- **screen:** SAFE.

### q-mp-1401 · Scripts: check-build webmanifest JSON.parse must accept UTF-8 BOM

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** serialize after `1383`/`1384`; leave pwa-manifest-contract / check-pwa-manifest theater alone
- **series:** script-tooling
- **verdict:** **SAFE** — BOM `manifest.webmanifest` body throws mid audit
- **CI / package.json callers:** `package.json` → `check:build`
- **target files:** `scripts/check-build.mjs` (manifest `JSON.parse`)
- **measured baseline:** `JSON.parse('\uFEFF'+'{"start_url":"/","scope":"/"}')` throws; audit path uses `JSON.parse(manifest || '{}')` with no BOM strip.
- **acceptance criteria:** Strip BOM before parse; start_url/scope checks unchanged on non-BOM; not a precache-parser rewrite.
- **verification commands:** hermetic unit; `rg -n 'JSON\\.parse\\(manifest|start_url' scripts/check-build.mjs`
- **conflict notes:** webmanifest BOM ingest in check-build; not check-pwa-manifest contract/icon theater.
- **screen:** SAFE.

### q-mp-1402 · Scripts: check-build HTML asset audit — document `.mjs` parity note in conflict with `1384`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post38d2`)
- **depends-on:** prefer **merge into `1384`** (same filter); listed only if tip-owner wants a separate acceptance ping for `measureGameChunks` peer
- **series:** script-tooling
- **verdict:** **SAFE** — `measureGameChunks` still filters `endsWith('.js')` only while menu-critical/`listChunkNames` gain `.mjs`
- **CI / package.json callers:** `size:check` via `measureGameChunks`
- **target files:** `scripts/check-bundle-budgets.mjs` (`measureGameChunks`) — **or** fold acceptance into `1385` if same PR
- **measured baseline:** `measureGameChunks` `filter((f) => f.startsWith('game-') && f.endsWith('.js'))`; vite `entryFileNames` currently `.js`, but peers already track `.mjs`.
- **acceptance criteria:** Include `game-*.mjs` (or `/\.m?js$/`) in the asset filter; missing-game rows unchanged when only `.js` exists; **not** mapGameChunks rewrite theater.
- **verification commands:** hermetic unit or `rg -n 'endsWith\\('\\.js'\\)|measureGameChunks' scripts/check-bundle-budgets.mjs`
- **conflict notes:** can merge into `1385`; keep separate only if tip-owner wants menu-critical vs game-chunk split. Prefer implementing with `1385`.
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict        | Title (short)                                                 |
| ----------- | -------------- | ------------------------------------------------------------- |
| `q-mp-1381` | **SAFE**       | emit-identity: reject duplicate `--files-from`                |
| `q-mp-1382` | **SAFE**       | emit-identity: `--files-from` flag-like honesty               |
| `q-mp-1383` | **SAFE**       | check-build: collectHtml word-boundary (no data-src FP)       |
| `q-mp-1384` | **SAFE**       | check-build: collectHtml include `.mjs`                       |
| `q-mp-1385` | **SAFE**       | size:check: parseMenuCriticalRefs include `.mjs`              |
| `q-mp-1386` | **HOLD-CHECK** | lint-ratchet: eslint stdout UTF-8 BOM                         |
| `q-mp-1387` | **SAFE**       | report-knip: baseline UTF-8 BOM                               |
| `q-mp-1388` | **SAFE**       | coverage-map: summary UTF-8 BOM                               |
| `q-mp-1389` | **SAFE**       | engine-coverage-rank: summary UTF-8 BOM                       |
| `q-mp-1390` | **HOLD-CHECK** | lint ceilings file UTF-8 BOM (ratchet + buckets)              |
| `q-mp-1391` | **HOLD-CHECK** | boundaries ceilings UTF-8 BOM                                 |
| `q-mp-1392` | **HOLD-CHECK** | type-ratchet Phase-2 baseline UTF-8 BOM                       |
| `q-mp-1393` | **SAFE**       | tests: burn-1008-r3 restore document.hidden                   |
| `q-mp-1394` | **SAFE**       | tests: burn-1008-r2-owl-idle restore document.hidden          |
| `q-mp-1395` | **SAFE**       | tests: burn-1008-r5 restore visibilityState + serviceWorker   |
| `q-mp-1396` | **SAFE**       | tests: burn-1008-r4 restore serviceWorker                     |
| `q-mp-1397` | **SAFE**       | tests: residual navigator.onLine restores (non-1355 files)    |
| `q-mp-1398` | **SAFE**       | docs: wiki Branches human alpha vs agent tip drafts           |
| `q-mp-1399` | **SAFE**       | docs: wiki CI posture soft check:copy-pins                    |
| `q-mp-1400` | **SAFE**       | size:check: bundle-budgets.json UTF-8 BOM                     |
| `q-mp-1401` | **SAFE**       | check-build: webmanifest JSON UTF-8 BOM                       |
| `q-mp-1402` | **SAFE**       | size:check: measureGameChunks include `.mjs` (prefer w/ 1385) |

**Screened HOLD-CHECK (queued with parse-only acceptance — CI-gating readers):** `1386`, `1390`, `1391`, `1392`.

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic                                                        | Why not queued                                         |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| `check-boundaries` `stripComments` truncates `//` in regexes | prior HOLD-CHECK `1201`–`1204`/`1220` — do not sibling |
| `check-type-ratchet` Phase-2 string ceiling (`1341`)         | az HOLD-CHECK — leave prior                            |
| lint/type ratchet fail-open (`1328`–`1330`)                  | ay HOLD-CHECK — leave prior                            |
| engine-property fingerprint before (`1309`)                  | leave prior HOLD-CHECK id                              |
| CC-BY-NC → `ok` in `classifyLicense`                         | license-classifier family exhausted                    |
| queens-a3 (~2.6s) / queens-b2 (~3.8s) further shards         | queens shard family exhausted this round               |
| knip LEAVE trio demote                                       | no SAFE demote                                         |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Out of scope / not used here

- No `memory/` files
- No CI workflow / permissions edits
- No player-facing copy, rules, scoring, AI search/difficulty/timing
- No Stars & Bars history cap; Hex Hard stays 450ms
- Honest underfill: **22** tasks (ids `1381`–`1402`), not padded to 25
