# Engineering backlog — 2026-10-11be (tip refill after bd queue / round-57)

**Task id:** `q-mp-090be`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-postf759` @ `a6b26716` (full `a6b26716e5097fda7f1013b37440a28baa8e180f`; living tip after `post8f8a` cut; bd backlog folded on tip + bd SAFE implementers `#1511`–`#1513` drafting — treat every bd id `q-mp-1428`…`1433` as already queued; bc `#1500`–`#1508` / bb `#1490`–`#1499` leave with `contained`)  
**Depends on:** tip `cursor/mp-tip-postf759` @ `a6b26716`. Round-56 backlog (`q-mp-090bd`, ids `q-mp-1428`…`1433`) — leave with `contained`; do **not** re-queue bd families or siblings. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-postf759` @ `a6b26716` measures unit files **3465**; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **6 new** concrete engineering tasks (`q-mp-1434` … `q-mp-1439`) mined from the **live tip tree**, checked against prior refills through `q-mp-1433` (bd + open `#1511`–`#1513`), bc (`1403`…`1412`), bb (`1381`…`1402`), ba (`1356`…`1377`), and the open draft PR list into this tip. It is the **only** deliverable of `q-mp-090be`.

**Honest count:** **6** tasks (not 25) with measured slow walls / A/B leaks / docs drift — not padded from exhausted families. Id range starts at `q-mp-1434` per round-57 brief. Round-56 already claimed emit-identity empty/abs/dedupe `--files-from` list honesty, CONTRIBUTING audit gate, README Branches wording, wiki Commands fence — **do not** re-queue `1428`–`1433`. This refill **does not** re-queue exhausted families from the round-57 brief / bd purpose section: `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed / CI-skipped latency benches, license-classifier, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache/chunk/html/health, menu-critical-ref, md-link regex, check-copy-pins **script** argv theater, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas/self_size/truncated/BOM/baseURL, prototype-restore (scrollIntoView/offsetWidth/getContext/ResizeObserver/elementFromPoint), engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep summary **or** `BASE_URL`, mutation-report games/ARITH/infra/dead/`--max`/dup/flag-like, check-dev-doc-links, probe-offline classify/board/recovered/mount, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest / calla end matchers, webkit-offline-probe, artifact-dir, README CI posture/Status counts/lint-ratchet docs / Branches, PATH_RE, PLAYTEST\_\* env docs, testing-layers doc rows, hex mutation, flattenKnip, eslint probe, fab/fraction/calibration env parsing, calibration-date whitespace, playtest-seed parse, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl/`.mjs`/numeric/BOM, emit-identity minify/base/parseArgs/`++`/`--files-from` **flag** dup/flag-like/merge-base/**empty-list fallthrough**/abs/dedupe, queens fuzz/shards/seed, runLighthouse JSON, waitForGameReady load-error, offline-dev date, report-licenses maps, mapGameChunks, withSeededRandom/oracle thenables, storage-stubs, hex-ui, playtest BASE join/seed URL, type-ratchet phase2/coercion/fail-open, engine-property immutability/shards, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty/dup, playtest OUT date harness stems, reporter BOM, matchMedia restore, ai-calibration winners/OUT, lint/type-ratchet fail-open, env-leak `.mjs`, html poster/srcset, ai-typeonly docs, burn-1007/1008/residual hidden+serviceWorker+visibilityState+onLine+innerWidth restores, polyomino/fab/pent/fiar shards, calla PLAYTEST_BASE, isHttpResponseReady status, ai-move-time bench OUT date, UTF-8 BOM ingest siblings, wiki Branches/CI posture, CONTRIBUTING PR base **or** audit gate. No NaN/null-coercion micro-fixes unless real data hits them. No tip-stamp **count** remasure of wiki/testing-layers/README Status tables. No knip unusedTypes baseline drop. No `partitionOvers` trim theater while live `bundle-budgets.json` `knownOvers` is `[]`.

**Fresh payoffs on this tip (re-measured @ `a6b26716` after bd fold + open `#1511`–`#1513`):** **`check-copy-pins-report-knip-args` two tip-scan cases alone ~1.5s each / file ~3.5s** (spawn full tip scan just to assert `reportOnly`/banner), **`navigator.connection` stubs in `burn-1008-ui-cov-r2-owl-idle` / `burn-1008-ui-cov-r2-prefetch` restore only via trailing `delete` (no `afterEach`) — A/B victim flips when that sole restore path is absent**, **`ai-determinism-shard-d` queens cases ~65s + ~44s under `CI=1`** (not CI-skipped latency benches), **`ai-determinism-shard-e` `options.seed` same-move case ~54s**, **`ai-calibration-difficulty-order` hex/queens Hard≥Easy cases ~13s / ~12s**, **knip unusedExports still exactly the LEAVE trio (no new zero-importer SAFE demote)**.

**Preference:** SAFE tests-only speed/hygiene or docs-only accuracy. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals (except the one historical ~190 note below), boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`. AI determinism/calibration **further shards** are HOLD-CHECK (tests-only walls; do not thin asserts or change AI).

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Bb lint/type/boundaries BOM HOLD-CHECK (`1386`/`1390`/`1391`/`1392`) stay prior — **do not** sibling.

## Duplicate check (do not re-queue)

| Topic family                                                                                        | Why skipped                                                                                           |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| round-56 bd `1428`–`1433` (+ tip drafts `#1511`–`#1513`)                                            | leave with `contained`; this refill’s tickets are **new** surfaces only                               |
| round-55 bc `1403`–`1412`                                                                           | leave with `contained`                                                                                |
| round-54 bb `1381`–`1402`                                                                           | leave with `contained`                                                                                |
| queens fuzz / fab / pent / fiar / polyomino / engine-property shards                                | prior shard tickets; this refill’s AI walls are **determinism/calibration** files only                |
| document.hidden / visibilityState / serviceWorker / onLine / matchMedia / innerWidth / localStorage | already queued / restored on prior file sets; **`navigator.connection`** is new                       |
| knip unusedExports LEAVE trio                                                                       | no new SAFE demote (`cancelFabAiRequests` still zero product importers; storage pair used internally) |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions               | hard-rule HOLD                                                                                        |
| CI-skipped AI latency benches (`tablet-ai-hard-latency`, `ai-move-time-midgame`)                    | skip under `CI=1` — less valuable                                                                     |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `a6b26716`)

| Id                               | Title (short)                        | Verdict                         | Evidence @ `a6b26716`                                        |
| -------------------------------- | ------------------------------------ | ------------------------------- | ------------------------------------------------------------ |
| `q-mp-090bd`                     | round-56 backlog                     | **folded on tip**               | This refill starts at `1434`; do not re-queue `1428`–`1433`. |
| `#1511`–`#1513`                  | bd SAFE implementers into `postf759` | **open drafts on this tip**     | Leave with `contained`.                                      |
| `q-mp-1386`/`1390`/`1391`/`1392` | bb HOLD-CHECK ratchet BOM            | **queued in bb; no tip PR yet** | Leave prior ids — **do not** sibling.                        |
| knip unusedExports               | live `--json`                        | **3 LEAVE**                     | No new SAFE demote.                                          |

## Shared-file conflict flags

| Shared file                                             | Conflicting new ids                                 |
| ------------------------------------------------------- | --------------------------------------------------- |
| `tests/unit/check-copy-pins-report-knip-args.test.ts`   | `1434` only                                         |
| `tests/unit/burn-1008-ui-cov-r2-owl-idle.test.ts`       | `1435` — serialize with `1435` prefetch sibling     |
| `tests/unit/burn-1008-ui-cov-r2-prefetch.test.ts`       | `1435` — one PR or serialize                        |
| `tests/unit/ai-determinism-shard-d.test.ts` (+ helpers) | `1436` only; leave queens **fuzz** shards alone     |
| `tests/unit/ai-determinism-shard-e.test.ts` (+ helpers) | `1437` only                                         |
| `tests/unit/ai-calibration-difficulty-order.test.ts`    | `1438` only; leave OUT-date / winners tickets alone |
| `docs/dev/check-copy-pins.md`                           | `1439` only; **not** tip-name remasure              |

**Parallel-friendly:** `1434`, `1436`, `1437`, `1438`, `1439`. Serialize `1435` owl-idle → prefetch (or one PR).

## Live tip measurements (evidence snapshot @ `a6b26716`)

```text
$ git rev-parse HEAD
  a6b26716e5097fda7f1013b37440a28baa8e180f

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3465

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0
  # named exports (knip --reporter json): cancelFabAiRequests (+ barrel LEAVE pair)

$ node scripts/check-copy-pins.mjs --json
  findingCount: 192  filesScanned: 3515  reportOnly: true

$ CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/check-copy-pins-report-knip-args.test.ts
  --fail --json … 1592ms
  --fail banner … 1499ms
  Duration 3.50s (tests 3.23s)

$ CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-d.test.ts -t 'queens-guards'
  determinism … 65276ms
  quality … 44061ms
  Duration 110.07s

$ CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-e.test.ts -t 'options.seed'
  options.seed: same seed → same move … 53942ms
  Duration 54.98s

$ A/B unit-shared --maxWorkers=1 --no-file-parallelism (navigator.connection):
  victim alone → PASS (read connection does not throw / saveData not stuck true)
  after owl-idle / r2-prefetch with trailing delete removed → FAIL
  after same files with tip trailing delete restored → PASS
  (afterEach never restores connection; mutation-ui2 peer does)

$ Open drafts into cursor/mp-tip-postf759 at audit: #1511–#1513 (bd implementers)
```

Baselines also under `/opt/cursor/artifacts/r57-*.log`.

## New tasks

### q-mp-1434 · Tests: hermeticize `check-copy-pins --fail` tip-scan cases (~1.5s × 2)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** leave check-copy-pins **script** argv theater alone
- **series:** test-speed
- **verdict:** **SAFE** — coverage of `reportOnly:false` / fail banner can use a tiny fixture tree (or exported scan helper) instead of spawning a full tip scan twice
- **CI / package.json callers:** `package.json` → `test:unit` (blocking `unit` job)
- **target files:** `tests/unit/check-copy-pins-report-knip-args.test.ts` (+ optional tiny fixture under `tests/unit/fixtures/` or script test-hook)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/check-copy-pins-report-knip-args.test.ts` → `--fail --json` **1592ms**, `--fail` banner **1499ms**, file **~3.50s**.
- **acceptance criteria:** Same assertions on exit code / `reportOnly` / banner; no tip-wide scan required; unknown-flag / `--help` cases stay fast; no `src/` edits.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/check-copy-pins-report-knip-args.test.ts` ; show both former tip-scan cases **&lt;300ms** (or document new ceiling if fixture still needs a mini scan).
- **conflict notes:** not check-copy-pins CLI flag theater; not knip `--fail` growth.

### q-mp-1435 · Tests: restore `navigator.connection` after burn-1008-r2 owl-idle / prefetch stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** leave ba/bb hidden/sw/onLine/matchMedia/innerWidth restores alone; leave `mutation-ui2-game-prefetch` (already restores connection in `afterEach`) alone
- **series:** test-hygiene
- **verdict:** **SAFE** — measured A/B: missing `afterEach` restore; trailing `delete` is the only cleanup
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/burn-1008-ui-cov-r2-owl-idle.test.ts`, `tests/unit/burn-1008-ui-cov-r2-prefetch.test.ts`
- **measured baseline:** `--project unit-shared --maxWorkers=1 --no-file-parallelism`: victim alone PASS; after either file with trailing `delete` removed → FAIL (`conn denied` / stuck `saveData:true`); tip files restore only at end of `it` (no `afterEach` connection restore). Peer `mutation-ui2-game-prefetch.test.ts` already deletes `navigator.connection` in `afterEach`.
- **acceptance criteria:** Save/restore (or delete) `navigator.connection` in `afterEach` for each offender; happy-path asserts unchanged; A/B victim PASS after both files without relying on trailing deletes alone.
- **verification commands:** A/B per file; `rg -n 'connection|afterEach' tests/unit/burn-1008-ui-cov-r2-owl-idle.test.ts tests/unit/burn-1008-ui-cov-r2-prefetch.test.ts`
- **conflict notes:** not onLine/hidden/serviceWorker file sets; connection only.

### q-mp-1436 · Tests: further shard `ai-determinism-shard-d` queens cases (~65s + ~44s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 wall
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** leave queens **state-roundtrip fuzz** shards alone
- **series:** test-speed
- **verdict:** **HOLD-CHECK** — tests-only shard; do not thin determinism/quality asserts or touch `src/` AI
- **CI / package.json callers:** `package.json` → `test:unit` (blocking; these run under `CI=1`)
- **target files:** `tests/unit/ai-determinism-shard-d.test.ts` (+ optional `ai-determinism-shard-d-queens*.test.ts` / helper windows)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-d.test.ts -t 'queens-guards'` → determinism **65276ms**, quality **44061ms**, duration **110.07s**.
- **acceptance criteria:** Queens determinism + quality move to parallel-friendly shard file(s) with identical coverage; remaining shard-d games unchanged; no AI/search/scoring edits.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-d*.test.ts`
- **conflict notes:** not queens fuzz `a2`/`b2`/seed shards; not CI-skipped latency benches.

### q-mp-1437 · Tests: further shard `ai-determinism-shard-e` `options.seed` case (~54s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 wall
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** leave `1436` alone; leave withSeededRandom thenable tickets alone
- **series:** test-speed
- **verdict:** **HOLD-CHECK** — tests-only; no AI product edits
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/ai-determinism-shard-e.test.ts` (+ optional shard file)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-e.test.ts -t 'options.seed'` → same-seed case **53942ms**, duration **54.98s**.
- **acceptance criteria:** Heavy `options.seed` same-move case (and optionally the Math.random audit) can run as its own file/shard; coverage identical; no `src/` edits.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-e*.test.ts`
- **conflict notes:** not AI latency benches that `skipIf(CI)`.

### q-mp-1438 · Tests: shard `ai-calibration-difficulty-order` by game (~13s / ~12s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 wall
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** leave ai-calibration OUT-date / unknown-winners tickets alone
- **series:** test-speed
- **verdict:** **HOLD-CHECK** — tests-only shard of Hard≥Easy win-rate cases; no difficulty/scoring product edits
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/ai-calibration-difficulty-order.test.ts` (+ optional per-game shards)
- **measured baseline:** From `CI=1 npx vitest run --project unit-node --reporter=json` tip batch: hex Hard≥Easy **~13322ms**, queens-guards **~11697ms**; file wall **~29260ms** (20 tests).
- **acceptance criteria:** Split by game (or heavy vs light) without dropping cases; identical win-rate asserts; Hex Hard **450ms** product pin untouched.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-calibration-difficulty-order*.test.ts`
- **conflict notes:** not OUT-date stamp; not CI-skipped move-time bench.

### q-mp-1439 · Docs: `check-copy-pins.md` tip findings order-of-magnitude (~190 → live 192)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** leave tip-name pointer remasure alone; leave Status/wiki **count** remasure alone
- **series:** docs-accuracy
- **verdict:** **SAFE** — historical “~190” note vs live `findingCount: 192` (no tip-name rewrite required)
- **CI / package.json callers:** none (docs only)
- **target files:** `docs/dev/check-copy-pins.md` (Tip baseline note only)
- **measured baseline:** Doc: “on the order of ~190 findings”. Live: `node scripts/check-copy-pins.mjs --json` → `findingCount: 192`.
- **acceptance criteria:** Note matches live order-of-magnitude (e.g. “~190–200” or “192 as of &lt;date&gt;”) **without** changing tip branch name pointer; guidance table unchanged.
- **verification commands:** `node scripts/check-copy-pins.mjs --json` ; `rg -n '~190|findingCount|Tip baseline' docs/dev/check-copy-pins.md`
- **conflict notes:** not tip-name remasure; not copy-pins clearing theater.

## Summary table

| Id          | Verdict        | Title (short)                                            |
| ----------- | -------------- | -------------------------------------------------------- |
| `q-mp-1434` | **SAFE**       | tests: hermeticize check-copy-pins --fail tip-scan cases |
| `q-mp-1435` | **SAFE**       | tests: restore navigator.connection after r2 stubs       |
| `q-mp-1436` | **HOLD-CHECK** | tests: shard ai-determinism-d queens (~65s+44s)          |
| `q-mp-1437` | **HOLD-CHECK** | tests: shard ai-determinism-e options.seed (~54s)        |
| `q-mp-1438` | **HOLD-CHECK** | tests: shard ai-calibration-difficulty-order by game     |
| `q-mp-1439` | **SAFE**       | docs: check-copy-pins tip findings ~190 → live 192       |

## Knip unusedExports (round-57)

Live `npm run report:knip -- --json`: **unusedExports: 3**. Beyond the LEAVE trio there are **no** additional knip-reported unused exports. Importer check:

| Export                  | Defining file                             | Product importers                      | Disposition      |
| ----------------------- | ----------------------------------------- | -------------------------------------- | ---------------- |
| `isPlainProgressObject` | `src/core/storage/migrate.ts` (+ barrel)  | `migrate.ts`, `storage.ts` (yes)       | LEAVE            |
| `sanitizeSettings`      | `src/core/storage/sanitize.ts` (+ barrel) | `migrate.ts`, `storage.ts` (yes)       | LEAVE            |
| `cancelFabAiRequests`   | `src/games/fab-a-diffy/ai-client.ts`      | **none** in `src/` (test comment only) | LEAVE / EXCLUDED |

**No new SAFE demote queued.**

## Not queued (measured but skipped)

| Topic                                          | Why skipped                                        |
| ---------------------------------------------- | -------------------------------------------------- |
| queens / fab / pent / fiar fuzz further shards | prior shard tickets; alone walls now mostly &lt;1s |
| `queens-hex-ai-play-deadline` unlimited ~2.8s  | AI timing / Hex Hard surface — HOLD                |
| `fab-a-diffy-ai-play-deadline` ~0.7s cases     | under case threshold; AI timing                    |
| CI-skipped latency benches                     | skip under `CI=1`                                  |
| wiki unit file **3464** vs live **3465**       | tip-stamp count remasure — exhausted               |
| knip unusedTypes 32→29 doc drift               | knip remasure / baseline — exhausted               |
| `#1511`–`#1513` bd implementers                | leave with `contained`                             |
