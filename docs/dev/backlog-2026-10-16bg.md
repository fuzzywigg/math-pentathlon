# Engineering backlog — 2026-10-16bg (tip refill after bf fold / round-59)

**Task id:** `q-mp-090bg`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post7a9d` @ `7b0f5a8b` (full `7b0f5a8bdb2ea2406856e60c80bbbcc4007bb631`; living tip cut from `alpha` @ `7a9d6540` after #1517; tip-owner folded `#1520`–`#1525` = bf backlog + SAFE implementers `1463`–`1468`; treat every bf id `q-mp-1463`…`1470` as already queued; be `#1515`–`#1519` / bd/bc/bb leave with `contained`)  
**Depends on:** tip `cursor/mp-tip-post7a9d` @ `7b0f5a8b`. Round-58 backlog (`q-mp-090bf`, ids `q-mp-1463`…`1470`) — leave with `contained`; do **not** re-queue bf families or siblings. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post7a9d` @ `7b0f5a8b` measures unit files **3470**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **7 new** concrete engineering tasks (`q-mp-1471` … `q-mp-1477`) mined from the **live tip tree after the #1520–#1525 fold**, checked against prior refills through `q-mp-1470` (bf + folded `#1521`–`#1525`), be (`1453`…`1462`), bd (`1428`…`1433`), bc (`1403`…`1412`), bb (`1381`…`1402`), and the open draft PR list (0 open drafts into `post7a9d` at audit). It is the **only** deliverable of `q-mp-090bg`.

**Honest count:** **7** tasks (not 25) with measured wrong-results / UX-metric bugs — not padded from exhausted families. Id range starts at `q-mp-1471` per round-59 brief. Round-58 already claimed emit-identity backslash + `?`/`#`/NUL junk, check-copy-pins leading `'s `/`: ` debris, par-55 / sum-dominoes / ramrod illicit sampling, AI determinism-a fab / determinism-c pent shards — **do not** re-queue `1463`–`1470` (tip now carries backslash normalize, `PATH_JUNK_RE` for `?`/`#`/NUL, leading-debris reject, illicitPass wiring / post-wait illicit samples from `#1521`–`#1525`). This refill **does not** re-queue exhausted families from the round-58 / round-57 purpose sections: `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed / CI-skipped latency benches, license-classifier, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache/chunk/html/health, menu-critical-ref, md-link regex, check-copy-pins **argv/totals remasure theater**, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas/self_size/truncated/BOM/baseURL, prototype-restore (scrollIntoView/offsetWidth/getContext/ResizeObserver/elementFromPoint), engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep summary **or** `BASE_URL`, mutation-report games/ARITH/infra/dead/`--max`/dup/flag-like, check-dev-doc-links, probe-offline classify/board/recovered/mount, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest / calla **end matchers** (Draw-chains / hyphen / calla `No tie yet` tickets `1403`–`1405` — this refill’s residual is **non-banner** deep-helper phrases only), webkit-offline-probe, artifact-dir, README CI posture/Status counts/lint-ratchet docs / Branches, PATH_RE, PLAYTEST\_\* env docs, testing-layers doc rows, hex mutation, flattenKnip, eslint probe, fab/fraction/calibration env parsing, calibration-date whitespace, playtest-seed parse, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl/`.mjs`/numeric/BOM, emit-identity minify/base/parseArgs/`++`/`--files-from` **flag** dup/flag-like/merge-base/**empty-list fallthrough**/abs/dedupe/**backslash**/`?`/`#`/NUL, queens fuzz/shards/seed, runLighthouse JSON, waitForGameReady load-error, offline-dev date, report-licenses maps, mapGameChunks, withSeededRandom/oracle thenables, storage-stubs, hex-ui, playtest BASE join/seed URL, type-ratchet phase2/coercion/fail-open, engine-property immutability/shards, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty/dup, playtest OUT date harness stems, reporter BOM, matchMedia restore, ai-calibration winners/OUT, lint/type-ratchet fail-open, env-leak `.mjs`, html poster/srcset, ai-typeonly docs, burn-1007/1008/residual hidden+serviceWorker+visibilityState+onLine+innerWidth restores, polyomino/fab/pent/fiar shards, calla PLAYTEST_BASE, isHttpResponseReady status, ai-move-time bench OUT date, UTF-8 BOM ingest siblings, wiki Branches/CI posture / Commands fence, CONTRIBUTING PR base **or** audit gate, check-copy-pins WINDOW_LINES/line-map/wins!/`remaining)`/leading `'s `/`: `, navigator.connection owl-idle/prefetch restore, calla `blueDuringHva`, AI determinism-d/e + calibration-difficulty-order shards, par-55/sum-dominoes/ramrod illicit sampling. No NaN/null-coercion micro-fixes unless real data hits them. No tip-stamp **count** remasure of wiki/testing-layers/README Status / copy-pins findings totals. No knip unusedTypes baseline drop. No `partitionOvers` trim theater while live `bundle-budgets.json` `knownOvers` is `[]`.

**Fresh payoffs on this tip (re-measured @ `7b0f5a8b` after `#1520`–`#1525` fold):** **`loadFilesFromList` still treats full-line `// c-style` as a path → exit 2 “path escapes repository root”** (hash `#` comments already skipped), **`src/games/hex/ai.ts // trailing` normalizes to `src/games/hex/ai.ts / trailing` → CLI `MISSING-BASE` / exit 1**, **`normalizeRepoRelativePath('src/games/hex')` / `'src/games/hex/ai.ts/..'` stay `{ok:true}` then CLI throws uncaught `EISDIR` stack / exit 1** (`--files-from` pointing at a directory already exits 2 with usage — q-mp-869), **ADS / percent-encoded / `&` / `*` path junk still `{ok:true}` then `MISSING-BASE`** (`?`/`#`/NUL correctly rejected by `1464`), **live `harvestCopyRegistry` still holds mid-template fragments `"is distributing cubes..."` / `"block(s) selected. Select more or confirm."`** that soft-match junk `"debug: is distributing cubes..."` (leading `'s `/`: ` correctly empty after `1465`), **`stars-bars-deep-playtest` `probeNewGameRace` still `waitForTimeout(100)` then one-shot `.status-ai-thinking`** (par-55 sibling loops up to 3s for `/computer|thinking/i`), **`star-track-deep-playtest` flags every normal `"Blue's turn - Draw chains…"` / `"Blue: Choose a chain…"` as `confusing_turn_copy`**, **`isDeepPlaytestEndStatus` still true on `"No tie yet"` / `"Who wins the round?"` / `"Please draw a card"` / `"thinking about Draw"`** while `isCallaEndStatus` correctly returns false for the first two. Knip unusedExports still exactly the LEAVE trio (no new zero-importer SAFE demote).

**Preference:** SAFE **scripts/** wrong-results fixes, tests-only speed/hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings **totals**, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`. AI determinism **further shards** are HOLD-CHECK (tests-only walls; do not thin asserts or change AI). Held ids stay held — **do not sibling**: `q-mp-1309`, `1328`/`1329`/`1330`, `1341`, `1386`/`1390`/`1391`/`1392`, `1460`/`1461`/`1462`, `1469`/`1470`, boundaries / size soft-gate `1201`–`1204` / `1220`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Bb lint/type/boundaries BOM HOLD-CHECK (`1386`/`1390`/`1391`/`1392`) stay prior — **do not** sibling.

## Duplicate check (do not re-queue)

| Topic family                                                                                      | Why skipped                                                                                   |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| round-58 bf `1463`–`1470` (+ folded `#1520`–`#1525`)                                              | leave with `contained`; this refill’s tickets are **new** surfaces only                       |
| round-57 be `1453`–`1462` (+ tip drafts `#1515`–`#1519` into `postcde8`)                          | leave with `contained`                                                                        |
| emit backslash + `?`/`#`/NUL (`1463`–`1464`)                                                      | `//` list comments, directory `EISDIR`, ADS/`%2F`/`&`/`*` are **new**                         |
| check-copy-pins leading `'s `/`: ` (`1465`)                                                       | mid-template `is distributing…` / `block(s) selected…` remain after leading reject            |
| calla / deep-playtest **end matchers** `1403`–`1405` (Draw-chains / hyphen / calla banners)       | residual **deep-helper** false-ends on non-banner phrases; calla already rejects `No tie yet` |
| par-55 / sum-dominoes / ramrod illicit (`1466`–`1468`)                                            | folded; empty `histAfter` branches left screened (not siblinged)                              |
| queens fuzz / fab / pent / fiar / polyomino / engine-property shards; AI determinism-a/c/d/e      | bf HOLD-CHECK `1469`/`1470` + be `1460`–`1462` — **do not** sibling                           |
| document.hidden / visibilityState / serviceWorker / onLine / matchMedia / innerWidth / connection | already queued / restored                                                                     |
| knip unusedExports LEAVE trio                                                                     | no new SAFE demote                                                                            |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions             | hard-rule HOLD                                                                                |
| CI-skipped AI latency benches                                                                     | skip under `CI=1` — less valuable                                                             |
| `--files-from` list-file-is-dir EISDIR (`869`)                                                    | list **content** directory paths are a different surface                                      |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `7b0f5a8b`)

| Id                                   | Title (short)                        | Verdict                               | Evidence @ `7b0f5a8b`                                        |
| ------------------------------------ | ------------------------------------ | ------------------------------------- | ------------------------------------------------------------ |
| `q-mp-090bf` / `#1520`               | round-58 backlog                     | **folded on tip**                     | This refill starts at `1471`; do not re-queue `1463`–`1470`. |
| `#1521`–`#1525`                      | bf SAFE implementers                 | **folded on tip**                     | Leave with `contained`.                                      |
| `#1515`–`#1519`                      | be SAFE implementers into `postcde8` | **open drafts (not into `post7a9d`)** | Leave with `contained`.                                      |
| `q-mp-1469`/`1470`                   | bf HOLD-CHECK AI shards              | **queued in bf; do not sibling**      | Leave prior ids.                                             |
| `q-mp-1460`/`1461`/`1462`            | be HOLD-CHECK AI shards              | **queued in be; do not sibling**      | Leave prior ids.                                             |
| `q-mp-1386`/`1390`/`1391`/`1392`     | bb HOLD-CHECK ratchet BOM            | **queued in bb; no tip PR yet**       | Leave prior ids — **do not** sibling.                        |
| `q-mp-1201`…`1204` / `1220`          | boundaries + size soft-gate          | **still-valid; no tip PR yet**        | Leave prior ids — **do not** re-queue.                       |
| `q-mp-1309` / `1328`–`1330` / `1341` | held ids                             | **still held**                        | Do not sibling.                                              |
| knip unusedExports                   | live `--json`                        | **3 LEAVE**                           | No new SAFE demote.                                          |
| Open drafts into `post7a9d`          | `gh pr list`                         | **0**                                 | This backlog is the next draft into the living tip.          |

## Shared-file conflict flags

| Shared file                                   | Conflicting new ids                                                |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `scripts/check-emit-identity.mjs`             | `1471`→`1472`→`1473` — serialize; leave folded `1463`/`1464` alone |
| `scripts/check-copy-pins.mjs`                 | `1477` only; leave folded `1465` / be structural alone             |
| `scripts/stars-bars-deep-playtest.mjs`        | `1474` only                                                        |
| `tests/playtest/star-track-deep-playtest.mjs` | `1475` only                                                        |
| `scripts/lib/deep-playtest-end.mjs`           | `1476` only; leave calla-end-status / `1403`–`1405` alone          |

**Parallel-friendly:** `1474`, `1475`, `1476`, `1477`. Serialize `1471`→`1472`→`1473`.

## Live tip measurements (evidence snapshot @ `7b0f5a8b`)

```text
$ git rev-parse HEAD
  7b0f5a8bdb2ea2406856e60c80bbbcc4007bb631

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3470

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ normalizeRepoRelativePath('src\\games\\hex\\ai.ts') → { ok: true, path: 'src/games/hex/ai.ts' }  # 1463 folded
$ normalizeRepoRelativePath('…ai.ts?x'|'…ai.ts#frag'|NUL) → { ok: false, invalid characters }  # 1464 folded

$ loadFilesFromList('// c-style\nsrc/games/hex/ai.ts\n')
  { ok: false, message: 'path escapes repository root: // c-style' } ; CLI exit 2
$ loadFilesFromList('src/games/hex/ai.ts // trailing\n')
  { ok: true, files: ['src/games/hex/ai.ts / trailing'] } ; CLI MISSING-BASE exit 1
$ # twin → OK exit 0

$ normalizeRepoRelativePath('src/games/hex'|'src/games/hex/ai.ts/..')
  { ok: true, path: 'src/games/hex' }
$ node scripts/check-emit-identity.mjs --base HEAD --files-from <dir-path-list>
  Error: EISDIR … readWorkingTree ; exit 1 (stack, not usage)
$ --files-from /tmp (list file is dir) → exit 2 usage  # 869 already

$ normalizeRepoRelativePath('…ai.ts:Zone.Identifier'|'src%2F…'|'…ai.ts&x'|'…ai.ts*')
  { ok: true, … } then CLI MISSING-BASE exit 1

$ harvestCopyRegistry()
  size 15 ; leading 's / : debris 0 ; mid fragments 2
  ["is distributing cubes...", "block(s) selected. Select more or confirm."]
$ scanSource toBe('Blue is distributing cubes...') → registry-string (fragment)
$ scanSource toBe('debug: is distributing cubes...') → registry-string soft false+

$ stars-bars probeNewGameRace: waitForTimeout(100) then .status-ai-thinking isVisible once
$ par-55 probeNewGameRace: thinkDeadline loop 3000ms for /computer|thinking/i

$ star-track status "Blue's turn - Draw chains from the bucket" → confusing_turn_copy
$ star-track status "Blue: Choose a chain to move" → confusing_turn_copy

$ isDeepPlaytestEndStatus('No tie yet'|'Who wins the round?'|'Please draw a card'|'thinking about Draw') → true
$ isCallaEndStatus('No tie yet'|'Who wins the round?') → false

$ Open drafts into cursor/mp-tip-post7a9d at audit: 0
```

Baselines also under `/opt/cursor/artifacts/r59-*.log`.

## New tasks

### q-mp-1471 · Scripts: emit-identity `--files-from` must treat `//` like `#` (and not corrupt inline `//`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** serialize before `1472`/`1473`; leave folded `1463`/`1464` alone
- **series:** script-tooling
- **verdict:** **SAFE** — list-format wrong-results; hash comments work, C-style does not
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local / optional CI helper)
- **target files:** `scripts/check-emit-identity.mjs` (`loadFilesFromList` / `normalizeRepoRelativePath`); unit under `tests/unit/*emit-identity*`
- **measured baseline:** `# comment` lines skipped. Full-line `// c-style` → `{ok:false}` “path escapes repository root” / CLI exit **2**. `src/games/hex/ai.ts // trailing` → `{ok:true, path:'src/games/hex/ai.ts / trailing'}` / CLI **MISSING-BASE** exit **1**. Clean twin exit **0**.
- **acceptance criteria:** Full-line `//` skipped (like `#`) or rejected with a clear “comment/path” usage error that does not claim repo escape; inline `// …` must not path-normalize into `/ …`; hermetic unit; no product edits.
- **verification commands:** hermetic unit; `rg -n 'startsWith\\(''#''\\)|loadFilesFromList' scripts/check-emit-identity.mjs`
- **conflict notes:** list-format `//` — not `?`/`#`/NUL junk (`1464`); not directory `EISDIR` (`1472`).
- **screen:** SAFE.

### q-mp-1472 · Scripts: emit-identity must reject directory / `..`-collapsed directory paths before EISDIR

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** serialize after `1471`
- **series:** script-tooling
- **verdict:** **SAFE** — uncaught `EISDIR` stack is usage-error theater; list-file-is-dir already friendly (`869`)
- **CI / package.json callers:** `package.json` → `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (`normalizeRepoRelativePath` and/or `readWorkingTree` / CLI path gate)
- **measured baseline:** `normalizeRepoRelativePath('src/games/hex')` and `'src/games/hex/ai.ts/..'` → `{ok:true, path:'src/games/hex'}`. `--files-from` with that line → raw `Error: EISDIR: illegal operation on a directory, read` from `readWorkingTree` / exit **1**. Contrast: `--files-from /tmp` (list path is a directory) → exit **2** with usage (q-mp-869).
- **acceptance criteria:** Directory (or `..`-collapsed directory) paths reject at normalize/CLI with clear usage + exit **2** (or **1**) without a Node stack as primary UX; file twins unchanged; hermetic unit.
- **verification commands:** hermetic unit; `node scripts/check-emit-identity.mjs --base HEAD --files-from <dir-list> ; echo $?`
- **conflict notes:** list **content** directories — not list-file-is-dir (`869`); not `//` (`1471`).
- **screen:** SAFE.

### q-mp-1473 · Scripts: emit-identity must reject ADS / percent-encoded / `&*` path junk

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** serialize after `1472`; leave folded `1464` `?`/`#`/NUL alone
- **series:** script-tooling
- **verdict:** **SAFE** — same false-missing-base class as pre-`1464` `?`/`#`, new characters
- **CI / package.json callers:** `package.json` → `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (`PATH_JUNK_RE` / `normalizeRepoRelativePath`)
- **measured baseline:** `…ai.ts:Zone.Identifier`, `src%2Fgames%2Fhex%2Fai.ts`, `…ai.ts&x`, `…ai.ts*` all `{ok:true}` then CLI **MISSING-BASE** / exit **1**. `?`/`#`/NUL already `{ok:false}` invalid-characters after `1464`.
- **acceptance criteria:** Reject at normalize with clear invalid-characters (or dedicated) error / exit **2**, not false missing-base; leave `//` to `1471` and directories to `1472`; hermetic unit.
- **verification commands:** hermetic unit; `rg -n 'PATH_JUNK_RE|invalid characters' scripts/check-emit-identity.mjs`
- **conflict notes:** extends junk class beyond `1464`; serialize after directory gate.
- **screen:** SAFE.

### q-mp-1474 · Scripts: stars-bars New Game race must wait for AI-thinking chrome

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** leave end-matcher / illicit tickets alone
- **series:** script-tooling
- **verdict:** **SAFE** — probe honesty; fixed 100ms sleep is racey vs AI think flash
- **CI / package.json callers:** deep-playtest / stars-bars harness scripts (report-only local)
- **target files:** `scripts/stars-bars-deep-playtest.mjs` (`probeNewGameRace`)
- **measured baseline:** After one human place, probe does `waitForTimeout(100)` then a single `.status-ai-thinking` `isVisible` sample before clicking New Game. Par-55 sibling waits up to **3s** in a loop for `/computer|thinking/i` before the same race. Historic `docs/playtest/stars-bars-deep-2026-10-07/new-game-race.json` had `sawThinkingBefore: true` (lucky); the probe remains timing-dependent.
- **acceptance criteria:** Wait until thinking chrome (or explicit short-circuit when AI finished instantly) before New Game; align with par-55 shape; hermetic stub sequence; no rules/AI/product edits; Stars & Bars history cap untouched.
- **verification commands:** hermetic unit with stubbed visibility sequence; `rg -n 'probeNewGameRace|waitForTimeout\\(100\\)|sawThinkingBefore' scripts/stars-bars-deep-playtest.mjs`
- **conflict notes:** probe wait honesty — not end matchers; not illicitPass family.
- **screen:** SAFE.

### q-mp-1475 · Scripts: star-track `confusing_turn_copy` must not flag normal turn status

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** leave deep-playtest-end / calla end-matcher tickets alone
- **series:** script-tooling
- **verdict:** **SAFE** — UX finding is always true on every human seat
- **CI / package.json callers:** star-track deep-playtest harness (report-only local; under `tests/playtest/`)
- **target files:** `tests/playtest/star-track-deep-playtest.mjs` (findings loop ~L155–161)
- **measured baseline:** Live `getPhaseMessage` returns `"Blue's turn - Draw chains from the bucket"` / `"Blue: Choose a chain to move"`. Harness regex `/Blue's turn|Red's turn|^Blue:|^Red:/` matches both → every non-thinking human seat pushes `confusing_turn_copy`. Win/draw banners correctly excluded.
- **acceptance criteria:** Remove the metric or gate on real confusion (e.g. grammar / mid-AI seat / unexpected copy); normal drawChains/selectChain statuses must not inflate `withFindings`; hermetic unit with stubbed snaps; **no** `src/games/star-track/rules.ts` or player-facing copy edits.
- **verification commands:** hermetic unit; `rg -n 'confusing_turn_copy|Blue.s turn' tests/playtest/star-track-deep-playtest.mjs`
- **conflict notes:** harness finding honesty — not deep-playtest-end Draw-chains (`1403`); not product copy.
- **screen:** SAFE.

### q-mp-1476 · Scripts: deep-playtest-end must not false-end non-banner `tie`/`wins`/`draw` phrases

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** leave folded `1403`–`1405` / calla-end-status alone
- **series:** script-tooling
- **verdict:** **SAFE** — residual wrong-results after Draw-chains / hyphen / calla banner fixes
- **CI / package.json callers:** deep-playtest harnesses importing `scripts/lib/deep-playtest-end.mjs`
- **target files:** `scripts/lib/deep-playtest-end.mjs` (`END_RE_SOURCE` / `DRAW_RE_SOURCE` / `TIE_RE_SOURCE`); unit under `tests/unit/*deep-playtest*`
- **measured baseline:** `isDeepPlaytestEndStatus('No tie yet'|'Who wins the round?'|'Please draw a card'|'thinking about Draw')` → **true**; `isDeepPlaytestDrawStatus` / `isDeepPlaytestTieStatus` also true where applicable. `isCallaEndStatus('No tie yet'|'Who wins the round?')` → **false** (1405 folded). Real banners `"Blue wins!"` / `"It's a draw!"` / `"Game Over! Tie!"` still true.
- **acceptance criteria:** Interrogative / “No … yet” / “Please draw …” / “thinking about Draw” → false; real win/tie/draw banners unchanged; keep Draw-chains + hyphen lookarounds; hermetic unit; no player-facing copy edits.
- **verification commands:** hermetic unit; `rg -n 'END_RE_SOURCE|DRAW_RE_SOURCE|isDeepPlaytestEndStatus' scripts/lib/deep-playtest-end.mjs`
- **conflict notes:** deep-helper residual — not calla matcher; not star-track confusing (`1475`).
- **screen:** SAFE.

### q-mp-1477 · Scripts: check-copy-pins mid-fragment name-split debris must not soft-match junk

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post7a9d`)
- **depends-on:** leave folded `1465` leading `'s `/`: ` alone
- **series:** script-tooling
- **verdict:** **SAFE** — mid-template fragments remain after leading-debris reject and soft-match junk prefixes
- **CI / package.json callers:** `package.json` → `check:copy-pins` (CI lint soft `--fail` + `continue-on-error`)
- **target files:** `scripts/check-copy-pins.mjs` (`harvestCopyRegistry` / soft-match gate); unit under `tests/unit/*copy-pins*`
- **measured baseline:** After `1465`, leading `'s `/`: ` count **0**. Registry still has `"is distributing cubes..."` (calla `` `${playerName} is distributing cubes...` ``) and `"block(s) selected. Select more or confirm."` (hex-a-gone `` `${playerName}: ${count} block(s) selected…` ``). `scanSource(…, "expect(t).toBe('debug: is distributing cubes...');", registry)` → `registry-string` false+. Tip scan cites fragment in overnight-wave58 registry-string findings.
- **acceptance criteria:** Junk prefixes like `debug: is distributing…` do not soft-match **or** mid-template verb fragments are dropped/reconstructed so only full distinctive phrases match; real `message-api` pins of `getPhaseMessage` unchanged; hermetic unit; no `src/games/**/rules.ts` edits; no findings-total remasure theater.
- **verification commands:** hermetic unit; `rg -n 'is distributing|block\\(s\\) selected|softRe|harvestCopyRegistry' scripts/check-copy-pins.mjs`
- **conflict notes:** mid-fragment after leading reject — not `remaining)` (`1456`); not leading `'s `/`: ` (`1465`).
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict  | Title (short)                                                      |
| ----------- | -------- | ------------------------------------------------------------------ |
| `q-mp-1471` | **SAFE** | emit-identity: `//` list comments + inline `//` honesty            |
| `q-mp-1472` | **SAFE** | emit-identity: reject directory / `..`-collapse before EISDIR      |
| `q-mp-1473` | **SAFE** | emit-identity: reject ADS / `%2F` / `&*` path junk                 |
| `q-mp-1474` | **SAFE** | stars-bars: New Game race wait for AI-thinking chrome              |
| `q-mp-1475` | **SAFE** | star-track: `confusing_turn_copy` must not flag normal turn status |
| `q-mp-1476` | **SAFE** | deep-playtest-end: residual non-banner false-ends                  |
| `q-mp-1477` | **SAFE** | check-copy-pins: mid-fragment debris soft-match junk               |

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic                                                     | Why not queued                                         |
| --------------------------------------------------------- | ------------------------------------------------------ |
| bf AI shards `1469`/`1470`                                | queued in bf — do not sibling                          |
| be AI shards `1460`/`1461`/`1462`                         | queued in be — do not sibling                          |
| bb ratchet BOM HOLD-CHECK `1386`/`1390`/`1391`/`1392`     | queued in bb — do not sibling                          |
| `check-boundaries` `stripComments` / typeOnly / DOM_IDENT | prior HOLD-CHECK `1201`–`1204`/`1220` — do not sibling |
| lint/type ratchet fail-open (`1328`–`1330`)               | ay HOLD-CHECK — leave prior                            |
| par-55 empty `histAfter` branches                         | adjacent to folded `1466` — tip-owner may fold cleanup |
| knip LEAVE trio demote / unusedTypes baseline 36→29       | no SAFE demote / knip remasure theater                 |
| `partitionOvers` allowlist trim                           | live `knownOvers: []` — no real data hit               |
| copy-pins.md / tip-name remasure                          | tip-stamp / tip-name exhausted                         |
| wiki unit count cells                                     | tip-stamp count remasure — exhausted                   |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Knip unusedExports (round-59)

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
- Honest underfill: **7** tasks (ids `1471`–`1477`), not padded to 25
