# Engineering backlog — 2026-10-16bh (tip refill after bg fold / round-60)

**Task id:** `q-mp-090bh`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post500b548` @ `b6fa7b7a` (full `b6fa7b7a2e0d0b8dd3e8471a1602f431807cc372`; living tip cut from `alpha` @ `500b5482` after #1526; tip-owner folded `#1527` + `#1528`–`#1532` = bg backlog + SAFE implementers `1471`–`1477`; treat every bg id `q-mp-1471`…`1477` as already queued; bf/be/bd/bc/bb leave with `contained`)  
**Depends on:** tip `cursor/mp-tip-post500b548` @ `b6fa7b7a`. Round-59 backlog (`q-mp-090bg`, ids `q-mp-1471`…`1477`) — leave with `contained`; do **not** re-queue bg families or siblings. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post500b548` @ `b6fa7b7a` measures unit files **3473**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **8 new** concrete engineering tasks (`q-mp-1478` … `q-mp-1485`) mined from the **live tip tree after the #1527–#1532 fold**, checked against prior refills through `q-mp-1477` (bg + folded `#1528`–`#1532`), bf (`1463`…`1470`), be (`1453`…`1462`), bd (`1428`…`1433`), bc (`1403`…`1412`), bb (`1381`…`1402`), and the open draft PR list (stale implementers `#1528`–`#1532` into `post500b548` already folded — leave `contained`; `#1527` bg backlog still open against prior tip `post7a9d`). It is the **only** deliverable of `q-mp-090bh`.

**Honest count:** **8** tasks (not 25) with measured wrong-results / UX-metric bugs — not padded from exhausted families. Id range starts at `q-mp-1478` per round-60 brief. Round-59 already claimed emit-identity `//` comments / directory EISDIR / ADS/`%`/`&`/`*`, stars-bars New Game race wait, star-track `confusing_turn_copy`, deep-playtest-end non-banner `No tie yet` / `Who wins` / `Please draw` / `thinking about Draw`, check-copy-pins mid-fragment debris — **do not** re-queue `1471`–`1477` (tip now carries those fixes from `#1528`–`#1532`). This refill **does not** re-queue exhausted families from the round-59 / round-58 purpose sections: `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed / CI-skipped latency benches, license-classifier, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache/chunk/html/health, menu-critical-ref, md-link regex, check-copy-pins **argv/totals remasure theater**, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas/self_size/truncated/BOM/baseURL, prototype-restore (scrollIntoView/offsetWidth/getContext/ResizeObserver/elementFromPoint), engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep summary **or** `BASE_URL`, mutation-report games/ARITH/infra/dead/`--max`/dup/flag-like, check-dev-doc-links, probe-offline classify/board/recovered/mount, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest / calla **end matchers** (Draw-chains / hyphen / calla banners / 1476 residual phrases — live product status harvest shows **0** further non-banner false+; do not pad synthetic-only phrases), webkit-offline-probe, artifact-dir, README CI posture/Status counts/lint-ratchet docs / Branches, PATH_RE, PLAYTEST\_\* env docs, testing-layers doc rows, hex mutation, flattenKnip, eslint probe, fab/fraction/calibration env parsing, calibration-date whitespace, playtest-seed parse, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep **BASE_URL / game-list** (wait-for-thinking residual is **new**), check-perf waitForUrl/`.mjs`/numeric/BOM, emit-identity minify/base/parseArgs/`++`/`--files-from` **flag** dup/flag-like/merge-base/**empty-list fallthrough**/abs/dedupe/**backslash**/`?`/`#`/NUL/`//`/dirs/ADS/`%&*`, queens fuzz/shards/seed, runLighthouse JSON, waitForGameReady load-error, offline-dev date, report-licenses maps, mapGameChunks, withSeededRandom/oracle thenables, storage-stubs, hex-ui, playtest BASE join/seed URL, type-ratchet phase2/coercion/fail-open, engine-property immutability/shards, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty/dup, playtest OUT date harness stems, reporter BOM, matchMedia restore, ai-calibration winners/OUT, lint/type-ratchet fail-open, env-leak `.mjs`, html poster/srcset, ai-typeonly docs, burn-1007/1008/residual hidden+serviceWorker+visibilityState+onLine+innerWidth restores, polyomino/fab/pent/fiar shards, calla PLAYTEST_BASE, isHttpResponseReady status, ai-move-time bench OUT date, UTF-8 BOM ingest siblings, wiki Branches/CI posture / Commands fence, CONTRIBUTING PR base **or** audit gate, check-copy-pins WINDOW_LINES/line-map/wins!/`remaining)`/leading `'s `/`: `/mid-fragment, navigator.connection owl-idle/prefetch restore, calla `blueDuringHva`, AI determinism-a/c/d/e + calibration-difficulty-order shards, par-55/sum-dominoes/ramrod illicit sampling, stars-bars New Game race, star-track confusing_turn_copy. No NaN/null-coercion micro-fixes unless real data hits them. No tip-stamp **count** remasure of wiki/testing-layers/README Status / copy-pins findings totals. No knip unusedTypes baseline drop. No `partitionOvers` trim theater while live `bundle-budgets.json` `knownOvers` is `[]`.

**Fresh payoffs on this tip (re-measured @ `b6fa7b7a` after `#1527`–`#1532` fold):** **`normalizeRepoRelativePath('…ai.ts|x'|'<x'|';rm'|'$HOME'|\"'x\"|\`x\`)`stays`{ok:true}`→ CLI`MISSING-BASE` / exit 1** (ADS/`%`/`&`/`_`/`?`/`#`/NUL correctly rejected after `1464`/`1473`), **ZWSP / ZWNJ / soft-hyphen / RLO suffixes also `{ok:true}`then`MISSING-BASE`**, **`…ai.ts\\extra`remaps via 1463 backslash normalize to`…ai.ts/extra`→`MISSING-BASE`** (real `src\\games\\…` relatives still OK), **`scanSource`softRe`[^'"\`]_`stops at apostrophe so live`"Blue's turn - Draw chains…"`/`"…Select a shield…"`miss registry-string while junk`"debug: Draw chains…"` soft-hits**, **`nav-away-sweep`still`waitForTimeout(100)`before mid-AI leave** (stars-bars sibling now polls thinking chrome via`1474`), **`star-track-deep-playtest`status end regex`/You Win!/`misses live HvA banner`"… You Wins! …"`** (`board-ui.ts` builds `` `${winnerName} Wins!` `` with `You`/`AI`), **`fab-a-diffy-deep`waits / samples`.fab-status.status-ai-thinking`but tip`src/games/fab-a-diffy/**`has zero such class** (stall/lock/think metrics dead; open`#422`wants product chrome on stale base — leave`contained`; this ticket is harness-only), **`fab-a-diffy-deep` `ok`is true whenever`history > 0 || claims+passes > 0`without a winner**. Knip unusedExports still exactly the LEAVE trio (no new zero-importer SAFE demote). Live product status harvest vs`isDeepPlaytestEndStatus`after`1476`: **0** further non-banner false+ — do not pad synthetic “Almost a draw” theater.

**Preference:** SAFE **scripts/** wrong-results fixes, tests-only harness honesty. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings **totals**, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`. AI determinism **further shards** are HOLD-CHECK (tests-only walls; do not thin asserts or change AI). Held ids stay held — **do not sibling**: `q-mp-1309`, `1328`/`1329`/`1330`, `1341`, `1386`/`1390`/`1391`/`1392`, `1460`/`1461`/`1462`, `1469`/`1470`, boundaries / size soft-gate `1201`–`1204` / `1220`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Bb lint/type/boundaries BOM HOLD-CHECK (`1386`/`1390`/`1391`/`1392`) stay prior — **do not** sibling.

## Duplicate check (do not re-queue)

| Topic family                                                                                      | Why skipped                                                              |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| round-59 bg `1471`–`1477` (+ folded `#1527`–`#1532`)                                              | leave with `contained`; this refill’s tickets are **new** surfaces only  |
| round-58 bf `1463`–`1470`                                                                         | leave with `contained`                                                   |
| emit `?`/`#`/NUL / ADS/`%&*` / `//` / dirs (`1464`/`1473`/`1471`/`1472`)                          | shell metachar / unicode format / junk `\extra` after `.ts` are **new**  |
| check-copy-pins leading / mid-fragment (`1465`/`1477`)                                            | softRe apostrophe break on live `Blue's …` is **new** classifier honesty |
| stars-bars New Game race (`1474`)                                                                 | nav-away mid-AI `waitForTimeout(100)` is a different harness             |
| star-track `confusing_turn_copy` (`1475`)                                                         | HvA `You Wins!` status end regex miss is different                       |
| deep-playtest-end / calla end matchers (`1403`–`1405` / `1476`)                                   | live product false+ count **0** after fold — do not pad synthetic-only   |
| fab product AI-thinking chrome (`#422` stale)                                                     | product chrome is HOLD / leave `contained`; harness-only tickets below   |
| queens fuzz / fab / pent / fiar / polyomino / engine-property shards; AI determinism-a/c/d/e      | bf/be HOLD-CHECK `1469`/`1470` / `1460`–`1462` — **do not** sibling      |
| document.hidden / visibilityState / serviceWorker / onLine / matchMedia / innerWidth / connection | already queued / restored                                                |
| knip unusedExports LEAVE trio                                                                     | no new SAFE demote                                                       |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions             | hard-rule HOLD                                                           |
| CI-skipped AI latency benches                                                                     | skip under `CI=1` — less valuable                                        |
| nav-away BASE_URL / game-list                                                                     | exhausted; wait-for-thinking residual only                               |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `b6fa7b7a`)

| Id                                   | Title (short)                        | Verdict                                         | Evidence @ `b6fa7b7a`                                        |
| ------------------------------------ | ------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------ |
| `q-mp-090bg` / `#1527`               | round-59 backlog                     | **folded on tip** (PR still open vs `post7a9d`) | This refill starts at `1478`; do not re-queue `1471`–`1477`. |
| `#1528`–`#1532`                      | bg SAFE implementers                 | **folded on tip** (PRs still open)              | Leave with `contained`.                                      |
| `#1515`–`#1519`                      | be SAFE implementers into `postcde8` | **open drafts (not into tip)**                  | Leave with `contained`.                                      |
| `q-mp-1469`/`1470`                   | bf HOLD-CHECK AI shards              | **queued in bf; do not sibling**                | Leave prior ids.                                             |
| `q-mp-1460`/`1461`/`1462`            | be HOLD-CHECK AI shards              | **queued in be; do not sibling**                | Leave prior ids.                                             |
| `q-mp-1386`/`1390`/`1391`/`1392`     | bb HOLD-CHECK ratchet BOM            | **queued in bb; no tip PR yet**                 | Leave prior ids — **do not** sibling.                        |
| `q-mp-1201`…`1204` / `1220`          | boundaries + size soft-gate          | **still-valid; no tip PR yet**                  | Leave prior ids — **do not** re-queue.                       |
| `q-mp-1309` / `1328`–`1330` / `1341` | held ids                             | **still held**                                  | Do not sibling.                                              |
| knip unusedExports                   | live `--json`                        | **3 LEAVE**                                     | No new SAFE demote.                                          |
| Open drafts into `post500b548`       | `gh pr list`                         | **5 stale implementers** (`#1528`–`#1532`)      | Already folded; no competing backlog draft.                  |

## Shared-file conflict flags

| Shared file                                   | Conflicting new ids                                                |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `scripts/check-emit-identity.mjs`             | `1478`→`1479`→`1480` — serialize; leave folded `1463`–`1473` alone |
| `scripts/check-copy-pins.mjs`                 | `1481` only; leave folded `1465` / `1477` alone                    |
| `scripts/nav-away-sweep.mjs`                  | `1482` only; leave BASE_URL / game-list alone                      |
| `tests/playtest/star-track-deep-playtest.mjs` | `1483` only; leave `1475` confusing_turn alone                     |
| `tests/playtest/fab-a-diffy-deep.mjs`         | `1484`→`1485` — serialize; no product chrome                       |

**Parallel-friendly:** `1481`, `1482`, `1483`. Serialize `1478`→`1479`→`1480`; `1484`→`1485`.

## Live tip measurements (evidence snapshot @ `b6fa7b7a`)

```text
$ git rev-parse HEAD
  b6fa7b7a2e0d0b8dd3e8471a1602f431807cc372

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3473

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ # folded bg surfaces still green
$ normalizeRepoRelativePath('src\\games\\hex\\ai.ts') → { ok: true, path: 'src/games/hex/ai.ts' }
$ …ai.ts?x / #frag / ADS / %2F / & / * / // comments / dirs → rejected (1463–1473)
$ isDeepPlaytestEndStatus('No tie yet'|'Who wins the round?'|'Please draw a card'|'thinking about Draw') → false
$ harvestCopyRegistry mid-fragments "is distributing…" / "block(s) selected…" → absent (size 13)

$ normalizeRepoRelativePath('src/games/hex/ai.ts|x'|'…<x'|';rm'|'$HOME'|"'x"|'`x`')
  { ok: true, path: '<junk>' } then CLI MISSING-BASE exit 1
$ normalizeRepoRelativePath('…ai.ts\u200b'|'\u200c'|'\u00ad'|'\u202e')
  { ok: true, invisibles retained } then CLI MISSING-BASE exit 1
$ normalizeRepoRelativePath('src/games/hex/ai.ts\\extra')
  { ok: true, path: 'src/games/hex/ai.ts/extra' } then CLI MISSING-BASE exit 1
$ clean twin src/games/hex/ai.ts → OK exit 0

$ scanSource toBe("Blue's turn - Draw chains from the bucket") → (none)
$ scanSource toBe("Blue's turn - Select a shield to distribute") → (none)
$ scanSource toBe("debug: Draw chains from the bucket") → registry-string
$ scanSource toBe("Blue: Choose a chain to move") → registry-string

$ rg -n 'waitForTimeout\(100\)' scripts/nav-away-sweep.mjs
  75: await page.waitForTimeout(100); // mid-AI

$ live board-ui HvA win: `🎉 … You Wins! 🎉` (winnerName + " Wins!")
$ harness status re /(You Win!|AI Wins!|Blue Wins!|Red Wins!)/i.test("🎉 You Wins! 🎉") → false
$ same re.test("🎉 AI Wins! 🎉"|"🎉 Blue Wins! 🎉") → true
$ winner banner /reaches the star/ usually covers; status arm still wrong

$ rg -c 'status-ai-thinking' src/games/fab-a-diffy/ → 0
$ rg -c 'status-ai-thinking' tests/playtest/fab-a-diffy-deep.mjs → 3
$ fab ok(history=3, winnerVisible=false, claims=2) → true

$ Open drafts into cursor/mp-tip-post500b548 at audit: #1528–#1532 (folded; leave contained)
$ Live product status harvest vs isDeepPlaytestEndStatus: 0 non-banner false+
```

Baselines also under `/opt/cursor/artifacts/r60-*.log` / `r60-summary.txt`.

## New tasks

### q-mp-1478 · Scripts: emit-identity must reject shell metachar path junk (`\|<>;"'\`$`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post500b548`)
- **depends-on:** serialize before `1479`/`1480`; leave folded `1464`/`1473` alone
- **series:** script-tooling
- **verdict:** **SAFE** — same false-missing-base class as pre-`1473` junk, new characters
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local / optional CI helper)
- **target files:** `scripts/check-emit-identity.mjs` (`PATH_JUNK_RE` / `pathHasInvalidCharacters` / `normalizeRepoRelativePath`); unit under `tests/unit/*emit-identity*`
- **measured baseline:** `…ai.ts|x`, `…ai.ts<x`, `…ai.ts;rm`, `…ai.ts$HOME`, `…ai.ts'x`, `…ai.ts\`x`all`{ok:true}`then CLI **MISSING-BASE** / exit **1**.`?`/`#`/NUL/`%`/`&`/`*`/ADS already `{ok:false}`after`1464`/`1473`. Clean twin exit **0**.
- **acceptance criteria:** Reject at normalize with clear invalid-characters (exit **2**), not false missing-base; leave unicode format junk to `1479` and `\extra` to `1480`; hermetic unit; no product edits.
- **verification commands:** hermetic unit; `rg -n 'PATH_JUNK_RE|invalid characters' scripts/check-emit-identity.mjs`; CLI `--files-from` with `|` line exits **2**
- **conflict notes:** extends junk class beyond `1473`; serialize before unicode / backslash-extra.
- **screen:** SAFE.

### q-mp-1479 · Scripts: emit-identity must reject unicode format / invisible path junk

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post500b548`)
- **depends-on:** serialize after `1478`
- **series:** script-tooling
- **verdict:** **SAFE** — invisible/format chars normalize as ok paths that cannot exist in git
- **CI / package.json callers:** `package.json` → `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (`PATH_JUNK_RE` / normalize); unit under `tests/unit/*emit-identity*`
- **measured baseline:** `…ai.ts` + U+200B / U+200C / U+00AD / U+202E → `{ok:true}` with invisibles retained → CLI **MISSING-BASE** / exit **1**. Clean twin → OK exit **0**.
- **acceptance criteria:** Reject format/invisible characters at normalize with clear invalid-characters / exit **2**; leave ASCII shell metachar to `1478`; hermetic unit.
- **verification commands:** hermetic unit; CLI `--files-from` with ZWSP suffix exits **2** (not MISSING-BASE)
- **conflict notes:** serialize with shell-metachar ticket on `PATH_JUNK_RE`.
- **screen:** SAFE.

### q-mp-1480 · Scripts: emit-identity must not turn junk `\` into a fake `/` path

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post500b548`)
- **depends-on:** serialize after `1479`; leave folded `1463` backslash-accept alone
- **series:** script-tooling
- **verdict:** **SAFE** — residual of Windows `\` normalize remaps `file.ts\extra` → `file.ts/extra` → false MISSING-BASE
- **CI / package.json callers:** `package.json` → `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (Windows `\` normalize after `1463`); unit under `tests/unit/*emit-identity*`
- **measured baseline:** `src\\games\\hex\\ai.ts` → `{ok:true, path:'src/games/hex/ai.ts'}` (1463 OK). `src/games/hex/ai.ts\\extra` → `{ok:true, path:'src/games/hex/ai.ts/extra'}` → CLI **MISSING-BASE** / exit **1**.
- **acceptance criteria:** Junk `\segment` after a file path rejects as invalid / usage (exit **2**), not silent remap + MISSING-BASE; keep real `src\games\…` relative separators; hermetic unit.
- **verification commands:** hermetic unit; CLI `--files-from` with `ai.ts\extra` exits **2**; forward-slash twin still OK
- **conflict notes:** residual after `1463` accept — do not reopen backslash-accept for real relatives.
- **screen:** SAFE.

### q-mp-1481 · Scripts: check-copy-pins soft-match must not break on `Blue's` (while junk `debug:` still hits)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post500b548`)
- **depends-on:** leave folded `1465` / `1477` alone
- **series:** script-tooling
- **verdict:** **SAFE** — softRe `[^'"\`]*` stops at apostrophe; live seat-status pins miss while junk prefixes still soft-match
- **CI / package.json callers:** `package.json` → `check:copy-pins` (CI lint soft `--fail` + `continue-on-error`)
- **target files:** `scripts/check-copy-pins.mjs` (softRe in registry-string scan); unit under `tests/unit/*copy-pins*`
- **measured baseline:** Registry size **13** (mid-fragments gone after `1477`). `scanSource(…, "expect(t).toBe(\"Blue's turn - Draw chains from the bucket\");", registry)` → **no** registry-string. Same for `"Blue's turn - Select a shield to distribute"`. `"debug: Draw chains from the bucket"` → **registry-string** soft hit. `"Blue: Choose a chain to move"` (no apostrophe) → registry-string hit.
- **acceptance criteria:** Live seat-label pins containing `Blue's` / `Red's` soft-match distinctive registry needles; junk `debug:` prefixes do not win (or require a stronger phrase gate); real `Player 2: Place a Quadraphage` / `message-api` pins unchanged; hermetic unit; no `src/games/**/rules.ts` edits; no findings-total remasure theater.
- **verification commands:** hermetic unit; `rg -n 'softRe|harvestCopyRegistry' scripts/check-copy-pins.mjs`
- **conflict notes:** softRe honesty after debris drops — not mid-fragment harvest (`1477`); not leading `'s `/`: ` (`1465`).
- **screen:** SAFE.

### q-mp-1482 · Scripts: nav-away mid-AI leave must wait for thinking chrome (not `waitForTimeout(100)`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post500b548`)
- **depends-on:** leave nav-away BASE_URL / game-list alone; prefer reuse of `scripts/lib/stars-bars-new-game-race.mjs` helper from `1474`
- **series:** script-tooling
- **verdict:** **SAFE** — probe honesty; fixed 100ms sleep is racey vs AI think flash (same class as pre-`1474` stars-bars)
- **CI / package.json callers:** nav-away-sweep harness (report-only local)
- **target files:** `scripts/nav-away-sweep.mjs`; optional shared helper under `scripts/lib/`
- **measured baseline:** After a quick human click, harness does `await page.waitForTimeout(100); // mid-AI` then `page.goto(BASE/#/)`. Stars-bars sibling (folded `1474`) polls thinking chrome up to ~3s; par-55 loops 3000ms for `/computer|thinking/i`.
- **acceptance criteria:** Wait until thinking chrome (or explicit short-circuit when AI finished instantly) before leave; align with stars-bars / par-55 shape; hermetic stub sequence; no product timing / Hex 450ms / rules edits.
- **verification commands:** hermetic unit with stubbed visibility sequence; `rg -n 'waitForTimeout\\(100\\)|mid-AI' scripts/nav-away-sweep.mjs`
- **conflict notes:** wait-for-thinking only — not BASE_URL / game-list theater; not stars-bars New Game (`1474`).
- **screen:** SAFE.

### q-mp-1483 · Scripts: star-track deep-playtest status end must match live HvA `You Wins!`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post500b548`)
- **depends-on:** leave folded `1475` confusing_turn alone; no `src/games/star-track/rules.ts` / board-ui product edits
- **series:** script-tooling
- **verdict:** **SAFE** — harness status regex is wrong on live product HvA human-win banner
- **CI / package.json callers:** star-track deep-playtest harness (report-only local; under `tests/playtest/`)
- **target files:** `tests/playtest/star-track-deep-playtest.mjs` (status end regex ~L149 / ~L288)
- **measured baseline:** Live `board-ui.ts` builds `` `🎉 ${seatIcon} ${winnerName} Wins! 🎉` `` with HvA `winnerName` = `You` / `AI`. Harness `/(You Win!|AI Wins!|Blue Wins!|Red Wins!)/i.test("🎉 You Wins! 🎉")` → **false**; `AI Wins!` / `Blue Wins!` → **true**. Winner banner `/reaches the star/` often covers completion; status-only / stall-wait arms still miss human HvA wins.
- **acceptance criteria:** Status end matcher accepts live `You Wins!` (and keeps `AI Wins!` / `Blue Wins!` / `Red Wins!`); hermetic unit with stubbed status strings; **no** player-facing copy / rules edits.
- **verification commands:** hermetic unit; `rg -n 'You Win|You Wins|reaches the star' tests/playtest/star-track-deep-playtest.mjs`
- **conflict notes:** status end regex — not confusing_turn (`1475`); not deep-playtest-end helper (`1476`).
- **screen:** SAFE.

### q-mp-1484 · Scripts: fab-a-diffy deep harness must not depend on missing `.status-ai-thinking`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post500b548`)
- **depends-on:** serialize before `1485`; leave open `#422` product chrome alone (`contained` / HOLD)
- **series:** script-tooling
- **verdict:** **SAFE** — harness metrics are dead because tip product never emits the sampled class
- **CI / package.json callers:** fab-a-diffy deep harness (report-only local; under `tests/playtest/`)
- **target files:** `tests/playtest/fab-a-diffy-deep.mjs` (`waitNotThinking` / AI-seat lock / stall sample)
- **measured baseline:** `rg -c 'status-ai-thinking' src/games/fab-a-diffy/` → **0**. Harness references `.fab-status.status-ai-thinking` **3** times for wait / lock / stall. `allowInput` never passed from tip controller. Think/stall/lock findings cannot fire; `humanClaim` does not actually wait for AI.
- **acceptance criteria:** Detect AI seat via tip-real signals (disabled bars / status text / history growth) **or** explicitly document + skip dead metrics; hermetic stub coverage; **no** product chrome / rules / AI edits (do not implement `#422` product `status-ai-thinking`).
- **verification commands:** hermetic unit; `rg -n 'status-ai-thinking|waitNotThinking' tests/playtest/fab-a-diffy-deep.mjs src/games/fab-a-diffy`
- **conflict notes:** harness-only — not product chrome `#422`; serialize before soft-`ok` (`1485`).
- **screen:** SAFE.

### q-mp-1485 · Scripts: fab-a-diffy deep `ok` must not soft-pass incomplete games

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post500b548`)
- **depends-on:** serialize after `1484`
- **series:** script-tooling
- **verdict:** **SAFE** — summary honesty; any progress currently counts as OK without a winner
- **CI / package.json callers:** fab-a-diffy deep harness (report-only local)
- **target files:** `tests/playtest/fab-a-diffy-deep.mjs` (`playOneGame` `ok` predicate)
- **measured baseline:** `ok` is `stalls===0 && !pageErrors && !stall/lock errors && (winnerVisible || history > 0 || claims + passes > 0)`. Incomplete game with `history=3`, `claims=2`, `winnerVisible=false` → **ok true**. Zero-progress case correctly false.
- **acceptance criteria:** `ok` requires a real end (winner banner / explicit end status) or an explicit incomplete outcome flag; progress-only games must not inflate pass rate; hermetic unit; no product edits.
- **verification commands:** hermetic unit with stubbed result shapes; `rg -n 'winnerVisible|claims \\+ passes|\\bok:' tests/playtest/fab-a-diffy-deep.mjs`
- **conflict notes:** soft-`ok` predicate — serialize after thinking-chrome harness honesty (`1484`).
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict  | Title (short)                                                   |
| ----------- | -------- | --------------------------------------------------------------- |
| `q-mp-1478` | **SAFE** | emit-identity: reject shell metachar path junk                  |
| `q-mp-1479` | **SAFE** | emit-identity: reject unicode format / invisible path junk      |
| `q-mp-1480` | **SAFE** | emit-identity: do not remap junk `\` into fake `/` path         |
| `q-mp-1481` | **SAFE** | check-copy-pins: softRe must not break on `Blue's`              |
| `q-mp-1482` | **SAFE** | nav-away: mid-AI leave wait for thinking chrome                 |
| `q-mp-1483` | **SAFE** | star-track: status end must match live HvA `You Wins!`          |
| `q-mp-1484` | **SAFE** | fab-a-diffy: harness must not depend on missing thinking chrome |
| `q-mp-1485` | **SAFE** | fab-a-diffy: `ok` must not soft-pass incomplete games           |

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic                                                     | Why not queued                                         |
| --------------------------------------------------------- | ------------------------------------------------------ |
| bf AI shards `1469`/`1470`                                | queued in bf — do not sibling                          |
| be AI shards `1460`/`1461`/`1462`                         | queued in be — do not sibling                          |
| bb ratchet BOM HOLD-CHECK `1386`/`1390`/`1391`/`1392`     | queued in bb — do not sibling                          |
| `check-boundaries` `stripComments` / typeOnly / DOM_IDENT | prior HOLD-CHECK `1201`–`1204`/`1220` — do not sibling |
| lint/type ratchet fail-open (`1328`–`1330`)               | ay HOLD-CHECK — leave prior                            |
| fab product `status-ai-thinking` chrome (`#422`)          | product chrome HOLD / stale base — leave `contained`   |
| deep-playtest-end synthetic “Almost a draw” theater       | 0 live product false+ after `1476` — do not pad        |
| knip LEAVE trio demote / unusedTypes baseline 36→29       | no SAFE demote / knip remasure theater                 |
| `partitionOvers` allowlist trim                           | live `knownOvers: []` — no real data hit               |
| copy-pins.md / tip-name remasure                          | tip-stamp / tip-name exhausted                         |
| wiki unit count cells / README Status counts              | tip-stamp count remasure — exhausted                   |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Knip unusedExports (round-60)

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
- Honest underfill: **8** tasks (ids `1478`–`1485`), not padded to 25
