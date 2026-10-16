# Engineering backlog — 2026-10-16bf (tip refill after be queue / round-58)

**Task id:** `q-mp-090bf`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post7a9d` @ `83d72fcb` (full `83d72fcbc6bd4af6941602d3dc634f73d6037965`; living tip cut from `alpha` @ `7a9d6540` after #1517; be backlog on tip tree + be SAFE implementers `#1515`–`#1519` drafting into prior tip `postcde8` — treat every be id `q-mp-1453`…`1462` as already queued; bd/bc/bb leave with `contained`)  
**Depends on:** tip `cursor/mp-tip-post7a9d` @ `83d72fcb`. Round-57 backlog (`q-mp-090be`, ids `q-mp-1453`…`1462`) — leave with `contained`; do **not** re-queue be families or siblings. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post7a9d` @ `83d72fcb` measures unit files **3467**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **8 new** concrete engineering tasks (`q-mp-1463` … `q-mp-1470`) mined from the **live tip tree**, checked against prior refills through `q-mp-1462` (be + open `#1515`–`#1519`), bd (`1428`…`1433`), bc (`1403`…`1412`), bb (`1381`…`1402`), and the open draft PR list (0 open drafts into `post7a9d` at audit; be implementers target `postcde8`). It is the **only** deliverable of `q-mp-090bf`.

**Honest count:** **8** tasks (not 25) with measured wrong-results / UX-metric bugs / slow walls — not padded from exhausted families. Id range starts at `q-mp-1463` per round-58 brief. Round-57 already claimed check-copy-pins WINDOW_LINES / line-map / wins! / `remaining)` debris, hermetic `--fail` tip-scan cases, `navigator.connection` restore on burn-1008-r2 owl-idle/prefetch, calla `blueDuringHva` mid-loop latch, AI determinism-d queens / determinism-e `options.seed` / calibration-difficulty-order shards — **do not** re-queue `1453`–`1462` (tip already carries WINDOW_LINES=8 + wins! keep + `remaining)` filter from the #1517 fold; open `#1515`–`#1519` leave with `contained`). This refill **does not** re-queue exhausted families from the round-57 brief / be purpose section: `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed / CI-skipped latency benches, license-classifier, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache/chunk/html/health, menu-critical-ref, md-link regex, check-copy-pins **argv/totals remasure theater**, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas/self_size/truncated/BOM/baseURL, prototype-restore (scrollIntoView/offsetWidth/getContext/ResizeObserver/elementFromPoint), engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep summary **or** `BASE_URL`, mutation-report games/ARITH/infra/dead/`--max`/dup/flag-like, check-dev-doc-links, probe-offline classify/board/recovered/mount, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest / calla **end matchers**, webkit-offline-probe, artifact-dir, README CI posture/Status counts/lint-ratchet docs / Branches, PATH_RE, PLAYTEST\_\* env docs, testing-layers doc rows, hex mutation, flattenKnip, eslint probe, fab/fraction/calibration env parsing, calibration-date whitespace, playtest-seed parse, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl/`.mjs`/numeric/BOM, emit-identity minify/base/parseArgs/`++`/`--files-from` **flag** dup/flag-like/merge-base/**empty-list fallthrough**/abs/dedupe, queens fuzz/shards/seed, runLighthouse JSON, waitForGameReady load-error, offline-dev date, report-licenses maps, mapGameChunks, withSeededRandom/oracle thenables, storage-stubs, hex-ui, playtest BASE join/seed URL, type-ratchet phase2/coercion/fail-open, engine-property immutability/shards, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty/dup, playtest OUT date harness stems, reporter BOM, matchMedia restore, ai-calibration winners/OUT, lint/type-ratchet fail-open, env-leak `.mjs`, html poster/srcset, ai-typeonly docs, burn-1007/1008/residual hidden+serviceWorker+visibilityState+onLine+innerWidth restores, polyomino/fab/pent/fiar shards, calla PLAYTEST_BASE, isHttpResponseReady status, ai-move-time bench OUT date, UTF-8 BOM ingest siblings, wiki Branches/CI posture / Commands fence, CONTRIBUTING PR base **or** audit gate, check-copy-pins WINDOW_LINES/line-map/wins!/`remaining)`, navigator.connection owl-idle/prefetch restore, calla `blueDuringHva`, AI determinism-d/e + calibration-difficulty-order shards. No NaN/null-coercion micro-fixes unless real data hits them. No tip-stamp **count** remasure of wiki/testing-layers/README Status / copy-pins findings totals. No knip unusedTypes baseline drop. No `partitionOvers` trim theater while live `bundle-budgets.json` `knownOvers` is `[]`.

**Fresh payoffs on this tip (re-measured @ `83d72fcb` after #1517 fold + open be `#1515`–`#1519`):** **`normalizeRepoRelativePath('src\\games\\hex\\ai.ts')` stays `{ok:true}` with backslashes intact → CLI `MISSING-BASE` / exit 1** (forward-slash twin is `identical` / exit 0), **`…ai.ts?x` / `…ai.ts#frag` also normalize as ok then `MISSING-HEAD` / `MISSING-BASE`**, **live `harvestCopyRegistry` still holds 7 leading `'s ` / `: ` template-split debris keys** (`"'s turn - Select a shield…"`, `": Place a Quadraphage"`, …) that exact-match junk and soft-match `"debug: someone's turn - …"` (paren `remaining)` correctly empty after `1456`), **tip scan cites debris in 3 findings**, **`par-55-deep-playtest` `illicitPass` is declared + returned + summarized but never incremented** (comment “Detect illicit AI pass…” with no `illicitPass++`), **`sum-dominoes-deep-playtest` illicit roll gates on `before.roll` sampled before `waitForHumanOrEnd`** (stale during AI think), **`ramrod-deep-playtest` illicit pass gates on `beforePlayer.blueSelect` sampled before the same wait**, **`ai-determinism-shard-a` fab-a-diffy quality ~33.2s under `CI=1`**, **`ai-determinism-shard-c` pent-em-in determinism ~12.7s + quality ~8.2s**. Knip unusedExports still exactly the LEAVE trio (no new zero-importer SAFE demote).

**Preference:** SAFE **scripts/** wrong-results fixes, tests-only speed/hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings **totals**, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`. AI determinism **further shards** are HOLD-CHECK (tests-only walls; do not thin asserts or change AI). Held ids stay held — **do not sibling**: `q-mp-1309`, `1328`/`1329`/`1330`, `1341`, `1386`/`1390`/`1391`/`1392`, `1460`/`1461`/`1462`, boundaries / size soft-gate `1201`–`1204` / `1220`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Bb lint/type/boundaries BOM HOLD-CHECK (`1386`/`1390`/`1391`/`1392`) stay prior — **do not** sibling.

## Duplicate check (do not re-queue)

| Topic family                                                                                      | Why skipped                                                                                           |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| round-57 be `1453`–`1462` (+ tip drafts `#1515`–`#1519` into `postcde8`)                          | leave with `contained`; this refill’s tickets are **new** surfaces only                               |
| round-56 bd `1428`–`1433`                                                                         | leave with `contained`                                                                                |
| round-55 bc `1403`–`1412`                                                                         | leave with `contained`                                                                                |
| emit `--files-from` empty-list fallthrough / abs / `./` dedupe (`1428`–`1430`)                    | backslash + `?`/`#` junk are **new** list-content surfaces                                            |
| check-copy-pins WINDOW_LINES / line-map / wins! / `remaining)` (`1453`–`1456`)                    | leading `'s ` / `: ` template debris is **new** after those fixes                                     |
| calla / deep-playtest **end matchers** (`1403`–`1405`) / `blueDuringHva` (`1459`)                 | par-55 / sum-dominoes / ramrod illicit **sampling** bugs are different metrics                        |
| queens fuzz / fab / pent / fiar / polyomino / engine-property shards; AI determinism-d/e / calib  | this refill’s walls are shard-**a** fab + shard-**c** pent only                                       |
| document.hidden / visibilityState / serviceWorker / onLine / matchMedia / innerWidth / connection | already queued / restored; no new unrestored connection offender queued here                          |
| knip unusedExports LEAVE trio                                                                     | no new SAFE demote (`cancelFabAiRequests` still zero product importers; storage pair used internally) |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions             | hard-rule HOLD                                                                                        |
| CI-skipped AI latency benches (`tablet-ai-hard-latency`, `ai-move-time-midgame`)                  | skip under `CI=1` — less valuable                                                                     |
| CONTRIBUTING audit / README Branches / wiki Commands fence                                        | bd — leave with `contained`                                                                           |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `83d72fcb`)

| Id                                   | Title (short)                        | Verdict                               | Evidence @ `83d72fcb`                                                             |
| ------------------------------------ | ------------------------------------ | ------------------------------------- | --------------------------------------------------------------------------------- |
| `q-mp-090be` / `#1514`               | round-57 backlog                     | **prior tip draft; ids queued**       | This refill starts at `1463`; do not re-queue `1453`–`1462`.                      |
| `#1515`–`#1519`                      | be SAFE implementers into `postcde8` | **open drafts (not into `post7a9d`)** | Leave with `contained`. Tip already folded structural copy-pins pieces via #1517. |
| `q-mp-1460`/`1461`/`1462`            | be HOLD-CHECK AI shards              | **queued in be; do not sibling**      | Leave prior ids.                                                                  |
| `q-mp-1386`/`1390`/`1391`/`1392`     | bb HOLD-CHECK ratchet BOM            | **queued in bb; no tip PR yet**       | Leave prior ids — **do not** sibling.                                             |
| `q-mp-1201`…`1204` / `1220`          | boundaries + size soft-gate          | **still-valid; no tip PR yet**        | Leave prior ids — **do not** re-queue.                                            |
| `q-mp-1309` / `1328`–`1330` / `1341` | held ids                             | **still held**                        | Do not sibling.                                                                   |
| knip unusedExports                   | live `--json`                        | **3 LEAVE**                           | No new SAFE demote.                                                               |
| Open drafts into `post7a9d`          | `gh pr list --base …`                | **0**                                 | This backlog is the first draft into the living tip.                              |

## Shared-file conflict flags

| Shared file                                             | Conflicting new ids                                       |
| ------------------------------------------------------- | --------------------------------------------------------- |
| `scripts/check-emit-identity.mjs`                       | `1463`→`1464` — serialize; leave bd `#1511`–`#1513` alone |
| `scripts/check-copy-pins.mjs`                           | `1465` only; leave be `#1519` / `1453`–`1456` alone       |
| `scripts/par-55-deep-playtest.mjs`                      | `1466` only                                               |
| `scripts/sum-dominoes-deep-playtest.mjs`                | `1467` only                                               |
| `scripts/ramrod-deep-playtest.mjs`                      | `1468` only                                               |
| `tests/unit/ai-determinism-shard-a.test.ts` (+ helpers) | `1469` only; leave fab fuzz shards alone                  |
| `tests/unit/ai-determinism-shard-c.test.ts` (+ helpers) | `1470` only; leave pent fuzz / `1460` alone               |

**Parallel-friendly:** `1465`, `1466`, `1467`, `1468`, `1469`, `1470`. Serialize `1463`→`1464`.

## Live tip measurements (evidence snapshot @ `83d72fcb`)

```text
$ git rev-parse HEAD
  83d72fcbc6bd4af6941602d3dc634f73d6037965

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3467

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ node -e "normalizeRepoRelativePath('src\\\\games\\\\hex\\\\ai.ts')"
  { ok: true, path: 'src\\games\\hex\\ai.ts' }
$ node scripts/check-emit-identity.mjs --base HEAD --files-from backslash.txt
  MISSING-BASE src\games\hex\ai.ts ; exit 1
$ forward-slash twin → OK / identical ; exit 0
$ …ai.ts?x → MISSING-HEAD exit 1 ; …ai.ts#frag → MISSING-BASE exit 1

$ harvestCopyRegistry()
  size 15 ; leading 's / : debris 7 ; remaining)-like []
  scanSource toBe("'s turn - Select a shield…") → registry-string
  scanSource toBe(": Place a Quadraphage") → registry-string
  scanSource toBe("debug: someone's turn - …") → registry-string soft false+
$ node scripts/check-copy-pins.mjs --json
  findingCount: 227 ; debris-cited findings: 3

$ par-55 illicitPass++ count = 0 (let + return only; comment at L471)

$ sum-dominoes: before.roll sampled then waitForHumanOrEnd; illicit uses before.roll
$ ramrod: beforePlayer.blueSelect sampled then waitForHumanOrEnd; illicit uses beforePlayer.blueSelect

$ CI=1 npx vitest run --reporter=verbose --maxWorkers=1 \
    tests/unit/ai-determinism-shard-a.test.ts -t 'fab-a-diffy'
  quality … 33163ms ; Duration 34.63s

$ CI=1 npx vitest run --reporter=verbose --maxWorkers=1 \
    tests/unit/ai-determinism-shard-c.test.ts -t 'pent-em-in'
  determinism … 12672ms ; quality … 8207ms ; Duration 23.53s

$ Open drafts into cursor/mp-tip-post7a9d at audit: 0
$ Open be implementers into postcde8: #1515–#1519 (leave contained)
```

Baselines also under `/opt/cursor/artifacts/q-mp-090bf-*.log` and `/opt/cursor/artifacts/r58-backlog-mine-evidence.log`.

## New tasks

### q-mp-1463 · Scripts: emit-identity must normalize `\` in relative `--files-from` paths

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** serialize with `1464`; leave bd empty-list/abs/`./` tickets alone
- **series:** script-tooling
- **verdict:** **SAFE** — Windows-style relative separators are accepted as ok then fail as missing
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local / agent; not blocking CI lint)
- **target files:** `scripts/check-emit-identity.mjs` (`normalizeRepoRelativePath` / `loadFilesFromList`); unit under `tests/unit/*emit-identity*`
- **measured baseline:** `normalizeRepoRelativePath('src\\games\\hex\\ai.ts')` → `{ok:true, path:'src\\games\\hex\\ai.ts'}`. CLI `--files-from` that list → `MISSING-BASE` / **exit 1**. Same file with forward slashes → `OK` / identical / **exit 0**. Mixed list → 1 OK + 1 FAIL.
- **acceptance criteria:** Relative paths with `\` normalize to repo-relative forward-slash form (or are rejected as invalid); hermetic unit; no AI/src product edits; not abs-path or empty-list theater.
- **verification commands:** hermetic unit; `node scripts/check-emit-identity.mjs --base HEAD --files-from <backslash-list>` → exit 0 when the file exists
- **conflict notes:** path-separator honesty — not `?`/`#` junk (`1464`); not abs/`./` dedupe (`1429`/`1430`).
- **screen:** SAFE.

### q-mp-1464 · Scripts: emit-identity must reject `?` / `#` (and similar) path junk

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** serialize after `1463`
- **series:** script-tooling
- **verdict:** **SAFE** — query/hash suffixes normalize as ok paths that cannot exist in git
- **CI / package.json callers:** `package.json` → `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (`normalizeRepoRelativePath`)
- **measured baseline:** `normalizeRepoRelativePath('src/games/hex/ai.ts?x')` → `{ok:true, path:'…ai.ts?x'}` → CLI `MISSING-HEAD` / exit 1. `…ai.ts#frag` → `MISSING-BASE` / exit 1. Clean twin → identical.
- **acceptance criteria:** Paths containing `?`, `#`, NUL, or other non-path junk are rejected at normalize/load time with a clear error (not a false missing-base/head); hermetic unit; leave backslash handling to `1463`.
- **verification commands:** hermetic unit; CLI `--files-from` with junk line exits non-zero **before** pretending the path is a real repo file
- **conflict notes:** junk rejection — not `\` normalize (`1463`).
- **screen:** SAFE.

### q-mp-1465 · Scripts: check-copy-pins must reject leading `'s ` / `: ` template-split registry debris

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** leave be `#1519` / `1453`–`1456` alone (tip already has WINDOW_LINES=8, wins!, `remaining)` filter)
- **series:** script-tooling
- **verdict:** **SAFE** — name/prefix template splits remain live registry keys and false-positive
- **CI / package.json callers:** `package.json` → `check:copy-pins` (CI lint soft `--fail` + `continue-on-error`)
- **target files:** `scripts/check-copy-pins.mjs` (`harvestCopyRegistry` segment filter); unit under `tests/unit/*copy-pins*`
- **measured baseline:** Live registry size **15** with **7** debris entries starting `'s ` or `: ` (e.g. `"'s turn - Select a shield to distribute"`, `": Place a Quadraphage"`). `scanSource` exact `toBe` of those strings → `registry-string`. Soft-match also flags `"debug: someone's turn - Select a shield…"`. Paren `remaining)` correctly **absent**. Tip `--json` debris-cited findings: **3**.
- **acceptance criteria:** Leading `'s ` / `: ` (and similar name/prefix split debris) are not registry keys **or** exact/soft match requires a stronger phrase gate; hermetic unit; real phrases like `"Coming Soon"` / `wins!` / full mid-game sentences still match when intentional; no `src/games/**/rules.ts` edits; no findings-total remasure theater.
- **verification commands:** hermetic unit; `rg -n "\\'s |^: |harvestCopyRegistry" scripts/check-copy-pins.mjs`
- **conflict notes:** prefix debris — not `remaining)` (`1456`); not wins! keep (`1455`).
- **screen:** SAFE.

### q-mp-1466 · Scripts: par-55-deep-playtest illicitPass must actually detect illicit passes

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** leave calla `blueDuringHva` `#1516` / end-matcher tickets alone
- **series:** script-tooling
- **verdict:** **SAFE** — UX metric is always zero because the counter is never written
- **CI / package.json callers:** deep-playtest / par-55 harness scripts (report-only local)
- **target files:** `scripts/par-55-deep-playtest.mjs` (`illicitPass` sampling)
- **measured baseline:** `let illicitPass = 0` at L348; returned at L522; summary prints illicit passes. Comment at L471 “Detect illicit AI pass of Blue…” only reads status / end — **`illicitPass++` count = 0** across the file. Summary always reports zero illicit passes even when the detection intent fires.
- **acceptance criteria:** Implement the documented illicit-pass detection (or remove the dead metric from results/summary with an explicit note); if kept, increment when the illicit condition is observed; hermetic unit with stubbed history/status sequence; no player-facing copy / rules / AI edits.
- **verification commands:** hermetic unit; `rg -n 'illicitPass' scripts/par-55-deep-playtest.mjs`
- **conflict notes:** UX metric wiring — not end-matcher grammar; not calla `blueDuringHva`.
- **screen:** SAFE.

### q-mp-1467 · Scripts: sum-dominoes-deep-playtest illicit roll must sample after human-seat wait

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** leave end-matcher / `blueDuringHva` alone
- **series:** script-tooling
- **verdict:** **SAFE** — illicit gate uses pre-wait `before.roll`, undercounting after AI handoff
- **CI / package.json callers:** sum-dominoes deep-playtest harness (report-only local)
- **target files:** `scripts/sum-dominoes-deep-playtest.mjs` (illicit roll sampling around `waitForHumanOrEnd`)
- **measured baseline:** Loop samples `before` (incl. `roll: !!…sd-roll-btn:not([disabled])`) **then** `waitForHumanOrEnd`. Illicit check after failed human play is `before.roll && after.dice && !after.roll`. At loop entry during AI think, `before.roll` is typically false → metric **undercounts** once the wait establishes the Roll affordance.
- **acceptance criteria:** Sample roll affordance **after** the human-seat wait (or equivalent mid-loop latch) before the illicit comparison; hermetic unit with stubbed before/after sequences; no product/rules edits.
- **verification commands:** hermetic unit; `rg -n 'before\\.roll|illicitHumanRollSkip|waitForHumanOrEnd' scripts/sum-dominoes-deep-playtest.mjs`
- **conflict notes:** mid-loop illicit sampling — not end matchers; not ramrod (`1468`).
- **screen:** SAFE.

### q-mp-1468 · Scripts: ramrod-deep-playtest illicit pass must sample after human-seat wait

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** leave `1467` alone (parallel OK — different file)
- **series:** script-tooling
- **verdict:** **SAFE** — illicit gate uses pre-wait `beforePlayer.blueSelect`
- **CI / package.json callers:** ramrod deep-playtest harness (report-only local)
- **target files:** `scripts/ramrod-deep-playtest.mjs` (`illicitPassSkip` sampling)
- **measured baseline:** `beforePlayer.blueSelect` from `/Blue's turn - Select a rod/` is sampled **before** `waitForHumanOrEnd`. Illicit gate requires `beforePlayer.blueSelect && /computer|thinking/i.test(after.status)`. Same stale-before-wait pattern as `1467`.
- **acceptance criteria:** Sample Blue select affordance **after** the human-seat wait (or latch during/after the wait) before the illicit comparison; hermetic unit; no product/rules edits.
- **verification commands:** hermetic unit; `rg -n 'beforePlayer|illicitPassSkip|waitForHumanOrEnd' scripts/ramrod-deep-playtest.mjs`
- **conflict notes:** sibling of `1467`, different game/metric.
- **screen:** SAFE.

### q-mp-1469 · Tests: further shard ai-determinism-shard-a fab-a-diffy quality (~33s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 wall
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** leave be `1460`/`1461` alone; leave fab **fuzz** shards alone
- **series:** test-speed
- **verdict:** **HOLD-CHECK** — tests-only shard; do not thin determinism/quality asserts or touch `src/` AI
- **CI / package.json callers:** `package.json` → `test:unit` (blocking; these run under `CI=1`)
- **target files:** `tests/unit/ai-determinism-shard-a.test.ts` (+ optional `ai-determinism-shard-a-fab*.test.ts` / helper windows)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-a.test.ts -t 'fab-a-diffy'` → quality **33163ms**, duration **34.63s** (fab dominates).
- **acceptance criteria:** Fab quality (and optionally determinism) move to parallel-friendly shard file(s) with identical coverage; remaining shard-a games unchanged; no AI/search/scoring edits.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-a*.test.ts`
- **conflict notes:** not be queens-d / options.seed-e / calibration shards; not CI-skipped latency benches.
- **screen:** HOLD-CHECK.

### q-mp-1470 · Tests: further shard ai-determinism-shard-c pent-em-in (~12.7s + ~8.2s)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 wall
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** leave `1469` alone; leave pent fuzz / engine-property shards alone
- **series:** test-speed
- **verdict:** **HOLD-CHECK** — tests-only; no AI product edits
- **CI / package.json callers:** `package.json` → `test:unit`
- **target files:** `tests/unit/ai-determinism-shard-c.test.ts` (+ optional shard file)
- **measured baseline:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-c.test.ts -t 'pent-em-in'` → determinism **12672ms**, quality **8207ms**, duration **23.53s**.
- **acceptance criteria:** Pent-em-in determinism + quality can run as their own file/shard; coverage identical; no `src/` edits; Hex Hard **450ms** product pin untouched.
- **verification commands:** `CI=1 npx vitest run --reporter=verbose --maxWorkers=1 tests/unit/ai-determinism-shard-c*.test.ts`
- **conflict notes:** not be `1460` queens-d; not prior pent fuzz shards.
- **screen:** HOLD-CHECK.

## Verdict summary

| Id          | Verdict        | Title (short)                                                |
| ----------- | -------------- | ------------------------------------------------------------ |
| `q-mp-1463` | **SAFE**       | emit-identity: normalize `\` in `--files-from` paths         |
| `q-mp-1464` | **SAFE**       | emit-identity: reject `?` / `#` path junk                    |
| `q-mp-1465` | **SAFE**       | check-copy-pins: reject leading `'s ` / `: ` registry debris |
| `q-mp-1466` | **SAFE**       | par-55-deep-playtest: wire illicitPass detection             |
| `q-mp-1467` | **SAFE**       | sum-dominoes-deep-playtest: illicit roll after human wait    |
| `q-mp-1468` | **SAFE**       | ramrod-deep-playtest: illicit pass after human wait          |
| `q-mp-1469` | **HOLD-CHECK** | tests: shard ai-determinism-a fab quality (~33s)             |
| `q-mp-1470` | **HOLD-CHECK** | tests: shard ai-determinism-c pent-em-in (~12.7s+8.2s)       |

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic                                                     | Why not queued                                         |
| --------------------------------------------------------- | ------------------------------------------------------ |
| be AI shards `1460`/`1461`/`1462`                         | queued in be — do not sibling                          |
| bb ratchet BOM HOLD-CHECK `1386`/`1390`/`1391`/`1392`     | queued in bb — do not sibling                          |
| `check-boundaries` `stripComments` / typeOnly / DOM_IDENT | prior HOLD-CHECK `1201`–`1204`/`1220` — do not sibling |
| lint/type ratchet fail-open (`1328`–`1330`)               | ay HOLD-CHECK — leave prior                            |
| knip LEAVE trio demote / unusedTypes baseline 36→29       | no SAFE demote / knip remasure theater                 |
| `partitionOvers` allowlist trim                           | live `knownOvers: []` — no real data hit               |
| copy-pins.md / tip-name remasure                          | tip-stamp / tip-name exhausted                         |
| wiki unit count cells                                     | tip-stamp count remasure — exhausted                   |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Knip unusedExports (round-58)

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
- Honest underfill: **8** tasks (ids `1463`–`1470`), not padded to 25
