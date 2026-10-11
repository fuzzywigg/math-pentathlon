# Engineering backlog — 2026-10-11be (tip refill after bd queue / round-57)

**Task id:** `q-mp-090be`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-postf759` @ `a6b26716` (full `a6b26716e5097fda7f1013b37440a28baa8e180f`; living tip cut from `alpha` @ `f759dc12`; bd backlog folded on tip + bd SAFE implementers `#1511`–`#1513` drafting — treat every bd id `q-mp-1428`…`1433` as already queued; bc `#1500`–`#1508` / bb `#1490`–`#1499` / ba `#1472`–`#1487` leave with `contained`)  
**Depends on:** tip `cursor/mp-tip-postf759` @ `a6b26716`. Round-56 backlog (`q-mp-090bd`, ids `q-mp-1428`…`1433`) — leave with `contained`; do **not** re-queue bd families or siblings. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-postf759` @ `a6b26716` measures unit files **3465**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **10 new** concrete engineering tasks (`q-mp-1453` … `q-mp-1462`) mined from the **live tip tree**, checked against prior refills through `q-mp-1433` (bd + open `#1511`–`#1513`), bc (`1403`…`1412`), bb (`1381`…`1402`), ba (`1356`…`1377`), and the open draft PR list into this tip. It is the **only** deliverable of `q-mp-090be`.

**Honest count:** **10** tasks (not 25) with measured wrong-results / A/B leaks / slow walls — not padded from exhausted families. Id range starts at `q-mp-1453` per round-57 brief (gap `1434`–`1452` left unused). Round-56 already claimed emit-identity empty/abs/dedupe `--files-from` list honesty, CONTRIBUTING audit gate, README Branches wording, wiki Commands fence — **do not** re-queue `1428`–`1433`. This refill **does not** re-queue exhausted families from the round-57 brief / bd purpose section: `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed / CI-skipped latency benches, license-classifier, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache/chunk/html/health, menu-critical-ref, md-link regex, check-copy-pins **argv/totals remasure theater**, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas/self_size/truncated/BOM/baseURL, prototype-restore (scrollIntoView/offsetWidth/getContext/ResizeObserver/elementFromPoint), engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep summary **or** `BASE_URL`, mutation-report games/ARITH/infra/dead/`--max`/dup/flag-like, check-dev-doc-links, probe-offline classify/board/recovered/mount, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest / calla **end matchers**, webkit-offline-probe, artifact-dir, README CI posture/Status counts/lint-ratchet docs / Branches, PATH_RE, PLAYTEST\_\* env docs, testing-layers doc rows, hex mutation, flattenKnip, eslint probe, fab/fraction/calibration env parsing, calibration-date whitespace, playtest-seed parse, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl/`.mjs`/numeric/BOM, emit-identity minify/base/parseArgs/`++`/`--files-from` **flag** dup/flag-like/merge-base/**empty-list fallthrough**/abs/dedupe, queens fuzz/shards/seed, runLighthouse JSON, waitForGameReady load-error, offline-dev date, report-licenses maps, mapGameChunks, withSeededRandom/oracle thenables, storage-stubs, hex-ui, playtest BASE join/seed URL, type-ratchet phase2/coercion/fail-open, engine-property immutability/shards, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty/dup, playtest OUT date harness stems, reporter BOM, matchMedia restore, ai-calibration winners/OUT, lint/type-ratchet fail-open, env-leak `.mjs`, html poster/srcset, ai-typeonly docs, burn-1007/1008/residual hidden+serviceWorker+visibilityState+onLine+innerWidth restores, polyomino/fab/pent/fiar shards, calla PLAYTEST_BASE, isHttpResponseReady status, ai-move-time bench OUT date, UTF-8 BOM ingest siblings, wiki Branches/CI posture / Commands fence, CONTRIBUTING PR base **or** audit gate. No NaN/null-coercion micro-fixes unless real data hits them. No tip-stamp **count** remasure of wiki/testing-layers/README Status / copy-pins findings totals. No knip unusedTypes baseline drop. No `partitionOvers` trim theater while live `bundle-budgets.json` `knownOvers` is `[]`.

**Fresh payoffs on this tip (re-measured @ `a6b26716` after bd fold + open `#1511`–`#1513`):** **`check-copy-pins` `WINDOW_LINES=6` undercounts multiline `expect(getCurrentPhaseMessage…)` pins** (tip overnight-wave55: 4 expect starts → 1 finding; extract at L16/24/31 fails at w6, succeeds at w8; **≥9 misses** across 4 tip files), **`stripComments` then scans stripped lines so `finding.line` points at pre-expect source lines** (block-comment header shifts line map), **`harvestCopyRegistry` drops `` `${winnerName} wins!` `` template suffixes** (`wins!` length &lt; 10) so registry has **zero** wins-like entries and DOM `toBe('Blue wins!')` is invisible, **template-split debris `"remaining)"` is a live registry entry** and exact-matches junk asserts as false `registry-string`, **`check-copy-pins-report-knip-args` two tip-scan cases alone ~1.5s each / file ~3.5s**, **`navigator.connection` stubs in burn-1008-r2 owl-idle / prefetch restore only via trailing `delete` (no `afterEach`) — A/B victim flips when that sole restore path is absent**, **`calla-deep-playtest` `uxFlags.blueDuringHva` samples status only after the game ends** (end banner `"You Wins!"` → false; mid-game `"Blue's turn - …"` never latched), **`ai-determinism-shard-d` queens cases ~70s + ~45s under `CI=1`**, **`ai-determinism-shard-e` `options.seed` same-move case ~54s**, **`ai-calibration-difficulty-order` hex/queens Hard≥Easy ~11.5s / ~12.1s**. Knip unusedExports still exactly the LEAVE trio (no new zero-importer SAFE demote).

**Preference:** SAFE **scripts/** wrong-results fixes, tests-only speed/hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings **totals**, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`. AI determinism/calibration **further shards** are HOLD-CHECK (tests-only walls; do not thin asserts or change AI).

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Bb lint/type/boundaries BOM HOLD-CHECK (`1386`/`1390`/`1391`/`1392`) stay prior — **do not** sibling.

## Duplicate check (do not re-queue)

| Topic family                                                                                        | Why skipped                                                                                           |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| round-56 bd `1428`–`1433` (+ tip drafts `#1511`–`#1513`)                                            | leave with `contained`; this refill’s tickets are **new** surfaces only                               |
| round-55 bc `1403`–`1412`                                                                           | leave with `contained`                                                                                |
| round-54 bb `1381`–`1402`                                                                           | leave with `contained`                                                                                |
| check-copy-pins argv / findings-total remasure                                                      | structural undercount / registry wrong-results are **new**                                            |
| calla / deep-playtest **end matchers** (`1403`–`1405`)                                              | `blueDuringHva` end-only **sampling** is a different UX-metric bug                                    |
| queens fuzz / fab / pent / fiar / polyomino / engine-property shards                                | prior shard tickets; this refill’s AI walls are **determinism/calibration** files only                |
| document.hidden / visibilityState / serviceWorker / onLine / matchMedia / innerWidth / localStorage | already queued / restored on prior file sets; **`navigator.connection`** is new                       |
| knip unusedExports LEAVE trio                                                                       | no new SAFE demote (`cancelFabAiRequests` still zero product importers; storage pair used internally) |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions               | hard-rule HOLD                                                                                        |
| CI-skipped AI latency benches (`tablet-ai-hard-latency`, `ai-move-time-midgame`)                    | skip under `CI=1` — less valuable                                                                     |
| CONTRIBUTING audit / README Branches / wiki Commands fence                                          | bd `#1511`–`#1513` — leave with `contained`                                                           |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `a6b26716`)

| Id                               | Title (short)                        | Verdict                         | Evidence @ `a6b26716`                                        |
| -------------------------------- | ------------------------------------ | ------------------------------- | ------------------------------------------------------------ |
| `q-mp-090bd`                     | round-56 backlog                     | **folded on tip**               | This refill starts at `1453`; do not re-queue `1428`–`1433`. |
| `#1511`–`#1513`                  | bd SAFE implementers into `postf759` | **open drafts on this tip**     | Leave with `contained`.                                      |
| `q-mp-1386`/`1390`/`1391`/`1392` | bb HOLD-CHECK ratchet BOM            | **queued in bb; no tip PR yet** | Leave prior ids — **do not** sibling.                        |
| `q-mp-1201`…`1204` / `1220`      | boundaries + size soft-gate          | **still-valid; no tip PR yet**  | Leave prior ids — **do not** re-queue.                       |
| knip unusedExports               | live `--json`                        | **3 LEAVE**                     | No new SAFE demote.                                          |

## Shared-file conflict flags

| Shared file                                             | Conflicting new ids                                 |
| ------------------------------------------------------- | --------------------------------------------------- |
| `scripts/check-copy-pins.mjs`                           | `1453`→`1454`→`1455`→`1456` — serialize             |
| `tests/unit/check-copy-pins-report-knip-args.test.ts`   | `1457` only; leave script tickets alone             |
| `tests/unit/burn-1008-ui-cov-r2-owl-idle.test.ts`       | `1458` — serialize with prefetch sibling            |
| `tests/unit/burn-1008-ui-cov-r2-prefetch.test.ts`       | `1458` — one PR or serialize                        |
| `scripts/calla-deep-playtest.mjs`                       | `1459` only; leave calla end-matcher `#1506` alone  |
| `tests/unit/ai-determinism-shard-d.test.ts` (+ helpers) | `1460` only; leave queens **fuzz** shards alone     |
| `tests/unit/ai-determinism-shard-e.test.ts` (+ helpers) | `1461` only                                         |
| `tests/unit/ai-calibration-difficulty-order.test.ts`    | `1462` only; leave OUT-date / winners tickets alone |

**Parallel-friendly:** `1457`, `1458`, `1459`, `1460`, `1461`, `1462`. Serialize `1453`→`1454`→`1455`→`1456`.

## Live tip measurements (evidence snapshot @ `a6b26716`)

```text
$ git rev-parse HEAD
  a6b26716e5097fda7f1013b37440a28baa8e180f

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3465

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ node scripts/check-copy-pins.mjs --json
  findingCount: 192  filesScanned: 3515  reportOnly: true  registry entries: 16

$ WINDOW_LINES=6 tip overnight-wave55-kings-phase-message-p2-gameover.test.ts
  expectStarts [13,16,24,31] → findings 1 (line 11 on stripped map)
  extract@13 w6 true; @16/@24/@31 w6 false w8 true
  tip miss inventory (≥4 files): total misses ≥9

$ harvestCopyRegistry()
  wins-like [] ; remaining-like ["remaining)"]
  scanSource DOM toBe('Blue wins!') → []
  scanSource toBe('remaining)') → registry-string false+

$ CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/check-copy-pins-report-knip-args.test.ts
  --fail --json … 1592ms
  --fail banner … 1499ms
  Duration 3.50s

$ A/B unit-shared --maxWorkers=1 --no-file-parallelism (navigator.connection):
  victim alone → PASS
  after owl-idle / prefetch with trailing delete removed → FAIL (conn denied / saveData stuck true)
  after tip originals (trailing delete present) → PASS
  afterEach never restores connection

$ calla-deep-playtest uxFlags.blueDuringHva
  sampled only at end via /Blue's turn/i.test(finalStatus); "You Wins!" → false

$ CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-d.test.ts -t 'queens-guards'
  determinism … 69903ms ; quality … 44522ms ; Duration 115.18s

$ CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-e.test.ts -t 'options.seed'
  same-seed case … 53942ms ; Duration 54.98s

$ CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-calibration-difficulty-order.test.ts -t 'hex|queens'
  hex … 11525ms ; queens-guards … 12067ms ; Duration 24.21s

$ Open drafts into cursor/mp-tip-postf759 at audit: #1511–#1513 (bd implementers)
```

Baselines also under `/opt/cursor/artifacts/q-mp-090be-*.log` and `/opt/cursor/artifacts/r57-*.log`.

## New tasks

### q-mp-1453 · Scripts: check-copy-pins WINDOW_LINES must cover multiline phase-message expects

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** serialize with `1454`–`1456`; leave check-copy-pins argv theater alone
- **series:** script-tooling
- **verdict:** **SAFE** — realistic multiline pins are undercounted (report-only wrong-results)
- **CI / package.json callers:** `package.json` → `check:copy-pins` (CI lint soft `--fail` + `continue-on-error`)
- **target files:** `scripts/check-copy-pins.mjs` (`WINDOW_LINES` / `extractExpectUnit` window); unit under `tests/unit/*copy-pins*`
- **measured baseline:** Tip `overnight-wave55-kings-phase-message-p2-gameover.test.ts`: 4 `expect(` starts → **1** finding; `extractExpectUnit` at L16/24/31 false with window 6, true with window 8. Across 4 tip files, **≥9** multiline pins missed at `WINDOW_LINES=6`.
- **acceptance criteria:** Multiline `expect(getCurrentPhaseMessage…)` / `expect(getPhaseMessage…)` spanning 7–8 lines are detected; hermetic unit with the wave55 shape; no player-facing copy edits; no findings-total remasure theater.
- **verification commands:** hermetic unit; `rg -n 'WINDOW_LINES|extractExpectUnit' scripts/check-copy-pins.mjs`
- **conflict notes:** structural window honesty — not argv/`--fail` theater; not tip findings-count stamp.
- **screen:** SAFE.

### q-mp-1454 · Scripts: check-copy-pins must map findings to original line numbers after stripComments

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** serialize after `1453`
- **series:** script-tooling
- **verdict:** **SAFE** — reported `line` points at non-expect source when a block comment precedes the pin
- **CI / package.json callers:** `package.json` → `check:copy-pins`
- **target files:** `scripts/check-copy-pins.mjs` (`stripComments` / `scanSource` line map)
- **measured baseline:** Source `/** header */` + `expect(getPhaseMessage(s)).toBe("hi")` → finding.line lands on a comment/header line in the original file (stripped line index ≠ original). Tip overnight-wave55 file header `/**…*/` shifts the sole finding to L11 (`it('…')`) while the expect opens at L13.
- **acceptance criteria:** Finding `line` is the original 1-based line of the `expect(` (or document a stable mapping); hermetic unit with a leading block comment; no behavior change to detection kinds.
- **verification commands:** hermetic unit; `rg -n 'stripComments|lineNo|finding.line' scripts/check-copy-pins.mjs`
- **conflict notes:** line-map honesty — not WINDOW_LINES span (`1453`).
- **screen:** SAFE.

### q-mp-1455 · Scripts: check-copy-pins registry must keep wins! template suffixes

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** serialize after `1454`
- **series:** script-tooling
- **verdict:** **SAFE** — live `` `${winnerName} wins!` `` (calla/hex/star/kings) never enters the registry; DOM exact pins are silent
- **CI / package.json callers:** `package.json` → `check:copy-pins`
- **target files:** `scripts/check-copy-pins.mjs` (`harvestCopyRegistry` / `add` length gate for template segments)
- **measured baseline:** `harvestCopyRegistry()` → registry size **16**, wins-like **[]**. `scanSource(..., "expect(el.textContent).toBe('Blue wins!');", registry)` → **[]**. Message-api still catches `getPhaseMessage` callers, but registry-string DOM pins of win banners are missed.
- **acceptance criteria:** Template segments like `wins!` (or reconstructed `${name} wins!` patterns) are retained when they are distinctive player-facing suffixes from phase-message returns; hermetic unit proves `Blue wins!` / `Red wins!` DOM pins flag; no `src/games/**/rules.ts` edits.
- **verification commands:** hermetic unit; `rg -n 'length < 10|wins!|harvestCopyRegistry' scripts/check-copy-pins.mjs`
- **conflict notes:** registry completeness — not fragment false-positives (`1456`).
- **screen:** SAFE.

### q-mp-1456 · Scripts: check-copy-pins must not registry-match template-split debris

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** serialize after `1455`
- **series:** script-tooling
- **verdict:** **SAFE** — `"remaining)"` from `Place…(${remaining} remaining)` is a live registry entry and exact-matches junk
- **CI / package.json callers:** `package.json` → `check:copy-pins`
- **target files:** `scripts/check-copy-pins.mjs` (`harvestCopyRegistry` segment filter and/or registry match gate)
- **measured baseline:** Live registry includes `"remaining)"` (and `": Place your blocks ("`). `scanSource(..., "expect(label).toBe('remaining)');", registry)` → `registry-string` false positive citing `src/games/hex-a-gone/rules.ts`.
- **acceptance criteria:** Punctuation-heavy / parenthesis-only debris segments are not registry keys **or** exact match requires a stronger phrase gate; hermetic unit; real phrases like `"Place a Quadraphage"` still match.
- **verification commands:** hermetic unit; `rg -n 'remaining\)|registry-string|split\\(/\\$\\{' scripts/check-copy-pins.mjs`
- **conflict notes:** false-positive debris — not wins! drop (`1455`).
- **screen:** SAFE.

### q-mp-1457 · Tests: hermeticize check-copy-pins --fail tip-scan cases (~1.5s × 2)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** leave `1453`–`1456` script fixes alone (may share fixtures after serialize)
- **series:** test-speed
- **verdict:** **SAFE** — coverage of `reportOnly:false` / fail banner can use a tiny fixture tree instead of spawning a full tip scan twice
- **CI / package.json callers:** `package.json` → `test:unit` (blocking `unit` job)
- **target files:** `tests/unit/check-copy-pins-report-knip-args.test.ts` (+ optional tiny fixture / script test-hook)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/check-copy-pins-report-knip-args.test.ts` → `--fail --json` **1592ms**, `--fail` banner **1499ms**, file **~3.50s**.
- **acceptance criteria:** Same assertions on exit code / `reportOnly` / banner; no tip-wide scan required; unknown-flag / `--help` cases stay fast; no `src/` edits.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/check-copy-pins-report-knip-args.test.ts` ; show both former tip-scan cases **&lt;300ms** (or document new ceiling if fixture still needs a mini scan).
- **conflict notes:** not check-copy-pins CLI flag theater; not knip `--fail` growth; not script structural tickets.
- **screen:** SAFE.

### q-mp-1458 · Tests: restore navigator.connection after burn-1008-r2 owl-idle / prefetch stubs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** leave ba/bb hidden/sw/onLine/matchMedia/innerWidth restores alone; leave `mutation-ui2-game-prefetch` (already restores connection in `afterEach`) alone
- **series:** test-hygiene
- **verdict:** **SAFE** — measured A/B: missing `afterEach` restore; trailing `delete` is the only cleanup
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/burn-1008-ui-cov-r2-owl-idle.test.ts`, `tests/unit/burn-1008-ui-cov-r2-prefetch.test.ts`
- **measured baseline:** `--project unit-shared --maxWorkers=1 --no-file-parallelism`: victim alone **PASS**; after owl-idle with trailing `delete` removed → **FAIL** (`Error: conn denied`); after prefetch with trailing `delete` removed → **FAIL** (`saveData` stuck `true`); tip originals with trailing deletes → **PASS**. Both offenders’ `afterEach` omit `navigator.connection` restore.
- **acceptance criteria:** Save/restore (or delete) `navigator.connection` in `afterEach` for each offender; happy-path asserts unchanged; A/B victim PASS after both files without relying on trailing deletes alone.
- **verification commands:** A/B per file; `rg -n 'connection|afterEach' tests/unit/burn-1008-ui-cov-r2-owl-idle.test.ts tests/unit/burn-1008-ui-cov-r2-prefetch.test.ts`
- **conflict notes:** not onLine/hidden/serviceWorker file sets; connection only.
- **screen:** SAFE.

### q-mp-1459 · Scripts: calla-deep-playtest blueDuringHva must sample during play

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** leave calla end-matcher `#1506` / `1405` alone
- **series:** script-tooling
- **verdict:** **SAFE** — UX flag is evaluated only on the end banner, so realistic finishes never set it
- **CI / package.json callers:** `package.json` → deep-playtest / calla harness scripts (report-only local)
- **target files:** `scripts/calla-deep-playtest.mjs` (`uxFlags.blueDuringHva` sampling)
- **measured baseline:** Flag set once at result assembly: `blueDuringHva: /Blue's turn/i.test(await statusText(page))` after the game ends. End status `"You Wins!"` → **false**. Mid-game `"Blue's turn - Select a shield"` would be **true** but is never sampled. Distinct from `isCallaEndStatus` end-matcher family.
- **acceptance criteria:** Latch `blueDuringHva` if `/Blue's turn/i` appears on status **during** the play loop (or equivalent mid-game sample); end-only grammar flags unchanged; hermetic unit or small harness test; no player-facing copy / rules edits.
- **verification commands:** hermetic unit with stubbed status sequence; `rg -n 'blueDuringHva|Blue.s turn' scripts/calla-deep-playtest.mjs`
- **conflict notes:** UX metric sampling — not `isCallaEndStatus` hyphen/banner tickets.
- **screen:** SAFE.

### q-mp-1460 · Tests: further shard ai-determinism-shard-d queens cases (~70s + ~45s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 wall
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** leave queens **state-roundtrip fuzz** shards alone
- **series:** test-speed
- **verdict:** **HOLD-CHECK** — tests-only shard; do not thin determinism/quality asserts or touch `src/` AI
- **CI / package.json callers:** `package.json` → `test:unit` (blocking; these run under `CI=1`)
- **target files:** `tests/unit/ai-determinism-shard-d.test.ts` (+ optional `ai-determinism-shard-d-queens*.test.ts` / helper windows)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-d.test.ts -t 'queens-guards'` → determinism **69903ms**, quality **44522ms**, duration **115.18s**.
- **acceptance criteria:** Queens determinism + quality move to parallel-friendly shard file(s) with identical coverage; remaining shard-d games unchanged; no AI/search/scoring edits.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-d*.test.ts`
- **conflict notes:** not queens fuzz `a2`/`b2`/seed shards; not CI-skipped latency benches.
- **screen:** HOLD-CHECK.

### q-mp-1461 · Tests: further shard ai-determinism-shard-e options.seed case (~54s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 wall
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** leave `1460` alone; leave withSeededRandom thenable tickets alone
- **series:** test-speed
- **verdict:** **HOLD-CHECK** — tests-only; no AI product edits
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/ai-determinism-shard-e.test.ts` (+ optional shard file)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-e.test.ts -t 'options.seed'` → same-seed case **53942ms**, duration **54.98s**.
- **acceptance criteria:** Heavy `options.seed` same-move case (and optionally the Math.random audit) can run as its own file/shard; coverage identical; no `src/` edits.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-e*.test.ts`
- **conflict notes:** not AI latency benches that `skipIf(CI)`.
- **screen:** HOLD-CHECK.

### q-mp-1462 · Tests: shard ai-calibration-difficulty-order by game (~11.5s / ~12.1s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 wall
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postf759`)
- **depends-on:** leave ai-calibration OUT-date / unknown-winners tickets alone
- **series:** test-speed
- **verdict:** **HOLD-CHECK** — tests-only shard of Hard≥Easy win-rate cases; no difficulty/scoring product edits
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/ai-calibration-difficulty-order.test.ts` (+ optional per-game shards)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-calibration-difficulty-order.test.ts -t 'hex|queens'` → hex **11525ms**, queens-guards **12067ms**, duration **24.21s**.
- **acceptance criteria:** Split by game (or heavy vs light) without dropping cases; identical win-rate asserts; Hex Hard **450ms** product pin untouched.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-calibration-difficulty-order*.test.ts`
- **conflict notes:** not OUT-date stamp; not CI-skipped move-time bench.
- **screen:** HOLD-CHECK.

## Verdict summary

| Id          | Verdict        | Title (short)                                            |
| ----------- | -------------- | -------------------------------------------------------- |
| `q-mp-1453` | **SAFE**       | check-copy-pins: WINDOW_LINES multiline undercount       |
| `q-mp-1454` | **SAFE**       | check-copy-pins: stripComments line-map honesty          |
| `q-mp-1455` | **SAFE**       | check-copy-pins: keep wins! template suffixes            |
| `q-mp-1456` | **SAFE**       | check-copy-pins: reject remaining) registry debris       |
| `q-mp-1457` | **SAFE**       | tests: hermeticize check-copy-pins --fail tip-scan cases |
| `q-mp-1458` | **SAFE**       | tests: restore navigator.connection after r2 stubs       |
| `q-mp-1459` | **SAFE**       | calla-deep-playtest: blueDuringHva sample during play    |
| `q-mp-1460` | **HOLD-CHECK** | tests: shard ai-determinism-d queens (~70s+45s)          |
| `q-mp-1461` | **HOLD-CHECK** | tests: shard ai-determinism-e options.seed (~54s)        |
| `q-mp-1462` | **HOLD-CHECK** | tests: shard ai-calibration-difficulty-order by game     |

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic                                                     | Why not queued                                         |
| --------------------------------------------------------- | ------------------------------------------------------ |
| bb ratchet BOM HOLD-CHECK `1386`/`1390`/`1391`/`1392`     | queued in bb — do not sibling                          |
| `check-boundaries` `stripComments` / typeOnly / DOM_IDENT | prior HOLD-CHECK `1201`–`1204`/`1220` — do not sibling |
| `check-workflows` scalar `on:` / job-level permissions    | prior `1122`/`1123` — check-workflows family           |
| lint/type ratchet fail-open (`1328`–`1330`)               | ay HOLD-CHECK — leave prior                            |
| knip LEAVE trio demote / unusedTypes baseline 36→29       | no SAFE demote / knip remasure theater                 |
| `partitionOvers` allowlist trim                           | live `knownOvers: []` — no real data hit               |
| copy-pins.md ~190 / tip-name remasure                     | tip-stamp / tip-name exhausted                         |
| wiki unit **3464** vs live **3465**                       | tip-stamp count remasure — exhausted                   |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Knip unusedExports (round-57)

Live `npm run report:knip -- --json`: **unusedExports: 3**. Beyond the LEAVE trio there are **no** additional knip-reported unused exports. Importer check:

| Export                  | Defining file                             | Product importers                      | Disposition      |
| ----------------------- | ----------------------------------------- | -------------------------------------- | ---------------- |
| `isPlainProgressObject` | `src/core/storage/migrate.ts` (+ barrel)  | `migrate.ts`, `storage.ts` (yes)       | LEAVE            |
| `sanitizeSettings`      | `src/core/storage/sanitize.ts` (+ barrel) | `migrate.ts`, `storage.ts` (yes)       | LEAVE            |
| `cancelFabAiRequests`   | `src/games/fab-a-diffy/ai-client.ts`      | **none** in `src/` (test comment only) | LEAVE / EXCLUDED |

**No new SAFE demote queued.**

## Out of scope / not used here

- No `memory/` files
- No CI workflow / permissions edits
- No player-facing copy, rules, scoring, AI search/difficulty/timing
- No Stars & Bars history cap; Hex Hard stays 450ms
- Honest underfill: **10** tasks (ids `1453`–`1462`), not padded to 25
