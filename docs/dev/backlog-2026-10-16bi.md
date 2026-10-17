# Engineering backlog — 2026-10-16bi (tip refill after bh queue / round-61)

**Task id:** `q-mp-090bi`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post2bfabdf` @ `2bfabdf1` (full `2bfabdf1898887e182fa6728fda5353cb1ac1753`; living tip cut from `alpha` @ `2bfabdf1` after #1533; tip-owner folded `#1527`–`#1532` = bg backlog + SAFE implementers `1471`–`1477`; round-60 bh ids `q-mp-1478`…`1485` live in open draft `#1534` / implementers `#1535`–`#1539` into this tip — treat every bh id as already queued; bf/be/bd/bc/bb leave with `contained`)  
**Depends on:** tip `cursor/mp-tip-post2bfabdf` @ `2bfabdf1`. Round-60 backlog (`q-mp-090bh`, ids `q-mp-1478`…`1485`) — leave with `contained`; do **not** re-queue bh families or siblings. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post2bfabdf` @ `2bfabdf1` measures unit files **3473**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **6 new** concrete engineering tasks (`q-mp-1486` … `q-mp-1491`) mined from the **live tip tree after the #1533 fold**, checked against prior refills through `q-mp-1485` (bh draft `#1534` + implementers `#1535`–`#1539`; bg folded `#1527`–`#1532`), bf (`1463`…`1470`), be (`1453`…`1462`), bd (`1428`…`1433`), bc (`1403`…`1412`), bb (`1381`…`1402`), and the open draft PR list (bh implementers `#1535`–`#1539` into `post2bfabdf` — leave `contained`; `#1534` bh backlog still open vs prior tip `post500b548`). It is the **only** deliverable of `q-mp-090bi`.

**Honest count:** **6** tasks (not 25) with measured wrong-results / UX-metric bugs — not padded from exhausted families. Id range starts at `q-mp-1486` per round-61 brief. Round-60 already claimed emit-identity shell metachar / unicode format / junk `\extra`, check-copy-pins softRe `Blue's`, nav-away mid-AI `waitForTimeout(100)`, star-track HvA `You Wins!` status end, fab-a-diffy missing `.status-ai-thinking` + soft-`ok` — **do not** re-queue `1478`–`1485` (open `#1535`–`#1539` are implementing them now). This refill **does not** re-queue exhausted families from the round-60 / round-59 purpose sections: `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed / CI-skipped latency benches, license-classifier, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache/chunk/html/health, menu-critical-ref, md-link regex, check-copy-pins **argv/totals remasure theater** / softRe apostrophe / mid-fragment / leading debris / WINDOW_LINES / wins! / `remaining)`, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas/self_size/truncated/BOM/baseURL, prototype-restore (scrollIntoView/offsetWidth/getContext/ResizeObserver/elementFromPoint), engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep summary **or** `BASE_URL` (settle thinking-selector residual for sum-dominoes is **new**), mutation-report games/ARITH/infra/dead/`--max`/dup/flag-like, check-dev-doc-links, probe-offline classify/board/recovered/mount, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest / calla **end matchers** (Draw-chains / hyphen / calla banners / 1476 residual phrases — live product status harvest shows **0** further non-banner false+; do not pad synthetic-only phrases), webkit-offline-probe, artifact-dir, README CI posture/Status counts/lint-ratchet docs / Branches, PATH_RE, PLAYTEST\_\* env docs, testing-layers doc rows, hex mutation, flattenKnip, eslint probe, fab/fraction/calibration env parsing, calibration-date whitespace, playtest-seed parse, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep **BASE_URL / game-list / wait-for-thinking** (`1482`), check-perf waitForUrl/`.mjs`/numeric/BOM, emit-identity minify/base/parseArgs/`++`/`--files-from` **flag** dup/flag-like/merge-base/**empty-list fallthrough**/abs/dedupe/**backslash**/`?`/`#`/NUL/`//`/dirs/ADS/`%&*`/shell/unicode/junk `\extra`, queens fuzz/shards/seed, runLighthouse JSON, waitForGameReady load-error, offline-dev date, report-licenses maps, mapGameChunks, withSeededRandom/oracle thenables, storage-stubs, hex-ui, playtest BASE join/seed URL, type-ratchet phase2/coercion/fail-open, engine-property immutability/shards, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty/dup, playtest OUT date harness stems, reporter BOM, matchMedia restore, ai-calibration winners/OUT, lint/type-ratchet fail-open, env-leak `.mjs`, html poster/srcset, ai-typeonly docs, burn-1007/1008/residual hidden+serviceWorker+visibilityState+onLine+innerWidth restores, polyomino/fab/pent/fiar shards, calla PLAYTEST_BASE, isHttpResponseReady status, ai-move-time bench OUT date, UTF-8 BOM ingest siblings, wiki Branches/CI posture / Commands fence, CONTRIBUTING PR base **or** audit gate, navigator.connection owl-idle/prefetch restore, calla `blueDuringHva`, AI determinism-a/c/d/e + calibration-difficulty-order shards, par-55/sum-dominoes/ramrod illicit sampling, stars-bars New Game race wait (`1474`), star-track confusing_turn_copy / `You Wins!` (`1475`/`1483`), fab-a-diffy thinking chrome + soft-`ok` (`1484`/`1485`). No NaN/null-coercion micro-fixes unless real data hits them. No tip-stamp **count** remasure of wiki/testing-layers/README Status / copy-pins findings totals. No knip unusedTypes baseline drop. No `partitionOvers` trim theater while live `bundle-budgets.json` `knownOvers` is `[]`.

**Fresh payoffs on this tip (re-measured @ `2bfabdf1` after #1533 fold; bh `1478`–`1485` still open/implementing — left alone):** **`stars-bars-deep-playtest` outcome arms still classify `"🔴 Red wins with N points!"` as `human-win`** because they gate on `/computer/i` while live `getPlayerName` is always `Blue`/`Red` (par-55 / ramrod / sum-dominoes siblings already use `/red/i` or `/Red wins/i`), **`ramrod-deep-playtest` samples `.ramrod-computer-thinking` 4× but tip product never adds the class** (CSS-only; controller sets `ramrod-status ${player}` + text `"Computer is thinking…"`), **`check-copy-pins` `extractExpectUnit` returns `null` on `toMatch(/It's a …/)`** so live `contig-60-end-rules` `/It's a draw!/` pins are invisible (softRe `Blue's` `1481` is a different gate after extract succeeds), **`extractExpectUnit` truncates `matcherArg` on `)` inside regex char classes** (live OWL residual `/\.get\([^)]+\)…/` → `matcherArg: "/\\.get\\([^)]+\\"`), **`stars-bars-deep-playtest` `measureTargets.thinking` still queries missing `.status-ai-thinking`** (product text-only; New Game race wait already rescued by `1474` status-text poll — residual dead **metric**), **`console-sweep` `settleAfterMove` waits only `.status-ai-thinking` while sum-dominoes product applies `.sd-computer-thinking`** (soft timeout → mid-AI next click). Knip unusedExports still exactly the LEAVE trio (no new zero-importer SAFE demote). Live product status harvest vs `isDeepPlaytestEndStatus` after `1476`: **0** further non-banner false+ — do not pad synthetic theater.

**Preference:** SAFE **scripts/** wrong-results fixes, tests-only harness honesty. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings **totals**, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`. AI determinism **further shards** are HOLD-CHECK (tests-only walls; do not thin asserts or change AI). Held ids stay held — **do not sibling**: `q-mp-1309`, `1328`/`1329`/`1330`, `1341`, `1386`/`1390`/`1391`/`1392`, `1460`/`1461`/`1462`, `1469`/`1470`, boundaries / size soft-gate `1201`–`1204` / `1220`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Bb lint/type/boundaries BOM HOLD-CHECK (`1386`/`1390`/`1391`/`1392`) stay prior — **do not** sibling.

## Duplicate check (do not re-queue)

| Topic family                                                                                      | Why skipped                                                                                   |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| round-60 bh `1478`–`1485` (+ `#1534` / implementers `#1535`–`#1539`)                              | leave with `contained`; this refill’s tickets are **new** surfaces only                       |
| round-59 bg `1471`–`1477` (+ folded `#1527`–`#1532`)                                              | leave with `contained`                                                                        |
| emit shell/unicode/junk `\` (`1478`–`1480`)                                                       | left alone; no further emit path-junk padded                                                  |
| check-copy-pins softRe `Blue's` (`1481`) / mid-fragment / leading                                 | extract-null apostrophe + char-class `)` truncate are **new** extract gates                   |
| nav-away wait-for-thinking (`1482`)                                                               | leave alone                                                                                   |
| star-track `You Wins!` / confusing_turn (`1483`/`1475`)                                           | leave alone                                                                                   |
| fab thinking chrome + soft-`ok` (`1484`/`1485`)                                                   | ramrod / stars-bars dead chrome are **different games**; do not sibling fab product `#422`    |
| stars-bars New Game race wait (`1474`)                                                            | outcome `/computer/i` misclass + residual dead `.status-ai-thinking` **metric** are different |
| deep-playtest-end / calla end matchers (`1403`–`1405` / `1476`)                                   | live product false+ count **0** after fold — do not pad synthetic-only                        |
| sum-dominoes deep-playtest `.sd-computer-thinking`                                                | product applies the class; console-sweep settle selector miss is a **different** harness      |
| queens fuzz / fab / pent / fiar / polyomino / engine-property shards; AI determinism-a/c/d/e      | bf/be HOLD-CHECK `1469`/`1470` / `1460`–`1462` — **do not** sibling                           |
| document.hidden / visibilityState / serviceWorker / onLine / matchMedia / innerWidth / connection | already queued / restored                                                                     |
| knip unusedExports LEAVE trio                                                                     | no new SAFE demote                                                                            |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions             | hard-rule HOLD                                                                                |
| CI-skipped AI latency benches                                                                     | skip under `CI=1` — less valuable                                                             |
| console-sweep BASE_URL / summary                                                                  | exhausted; settle thinking-selector for sum-dominoes residual only                            |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `2bfabdf1`)

| Id                                   | Title (short)                 | Verdict                                              | Evidence @ `2bfabdf1`                                        |
| ------------------------------------ | ----------------------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| `q-mp-090bh` / `#1534`               | round-60 backlog              | **open draft vs `post500b548`** (ids not on tip yet) | This refill starts at `1486`; do not re-queue `1478`–`1485`. |
| `#1535`–`#1539`                      | bh SAFE implementers into tip | **open drafts (implementing now)**                   | Leave with `contained`.                                      |
| `#1540`                              | tip fold vehicle to `alpha`   | **tip-owner**                                        | Leave alone.                                                 |
| `#1527`–`#1532`                      | bg backlog + implementers     | **folded on tip** (PRs may still show open)          | Leave with `contained`.                                      |
| `q-mp-1469`/`1470`                   | bf HOLD-CHECK AI shards       | **queued in bf; do not sibling**                     | Leave prior ids.                                             |
| `q-mp-1460`/`1461`/`1462`            | be HOLD-CHECK AI shards       | **queued in be; do not sibling**                     | Leave prior ids.                                             |
| `q-mp-1386`/`1390`/`1391`/`1392`     | bb HOLD-CHECK ratchet BOM     | **queued in bb; no tip PR yet**                      | Leave prior ids — **do not** sibling.                        |
| `q-mp-1201`…`1204` / `1220`          | boundaries + size soft-gate   | **still-valid; no tip PR yet**                       | Leave prior ids — **do not** re-queue.                       |
| `q-mp-1309` / `1328`–`1330` / `1341` | held ids                      | **still held**                                       | Do not sibling.                                              |
| knip unusedExports                   | live `--json`                 | **3 LEAVE**                                          | No new SAFE demote.                                          |
| Open drafts into `post2bfabdf`       | `gh pr list`                  | **bh implementers `#1535`–`#1539`**                  | Already covering `1478`–`1485`; this backlog is next refill. |

## Shared-file conflict flags

| Shared file                            | Conflicting new ids                                                       |
| -------------------------------------- | ------------------------------------------------------------------------- |
| `scripts/stars-bars-deep-playtest.mjs` | `1486`→`1490` — serialize; leave folded `1474` New Game race alone        |
| `scripts/ramrod-deep-playtest.mjs`     | `1487` only; leave illicit `1468` alone                                   |
| `scripts/check-copy-pins.mjs`          | `1488`→`1489` — serialize; leave open softRe `1481` / folded debris alone |
| `scripts/console-sweep.mjs`            | `1491` only; leave BASE_URL / summary alone                               |

**Parallel-friendly:** `1487`, `1491`. Serialize `1486`→`1490`; `1488`→`1489`. Prefer landing after bh implementers `#1535`–`#1539` fold if they touch the same harness files (they currently do not claim these surfaces).

## Live tip measurements (evidence snapshot @ `2bfabdf1`)

```text
$ git rev-parse HEAD
  2bfabdf1898887e182fa6728fda5353cb1ac1753

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3473

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ # bh surfaces still open (do not re-queue) — tip still has:
$ rg -n 'waitForTimeout\(100\)' scripts/nav-away-sweep.mjs → L75 mid-AI
$ softRe Blue's / emit |<>$\`' / ZWSP / ai.ts\extra / fab status-ai-thinking / You Win! → see #1534

$ # stars-bars product winner (getPlayerName = Blue|Red; no "Computer" in win banner):
$ #   `${icon} ${getPlayerName(winner)} wins with ${score} points!`
$ /computer/i.test("🔴 Red wins with 18 points!") → false → harness human-win
$ /red/i.test("🔴 Red wins with 18 points!") → true → par-55 sibling ai-win
$ /computer/i.test("🔵 Blue wins with 12 points!") → false → human-win (both)
$ # harness arms ~L333/L373/L404/L420 still use /computer/i

$ rg -c 'ramrod-computer-thinking' scripts/ramrod-deep-playtest.mjs → 4
$ rg -c 'ramrod-computer-thinking' src/games/ramrod/ → css:1 ; TS adds: 0
$ controller: status.className = `ramrod-status ${state.currentPlayer}` + text "Computer is thinking…"

$ extractExpectUnit("expect(msg).toMatch(/It's a tie!/i);") → null → findings 0
$ extractExpectUnit("expect(msg).toMatch(/Blue wins!/i);") → ok → registry-string
$ live contig-60-end-rules toMatch(/It's a draw!/) → extract null
$ tip toMatch(/…'…/) slices with apostrophe ≈ 58

$ extractExpectUnit("expect(OWL…).not.toMatch(/\\.get\\([^)]+\\)\\s*\\?\\?\\s*\\[\\]/);")
  → matcherArg "/\\.get\\([^)]+\\" (truncated; live q-mp-589 L138)

$ rg -c 'status-ai-thinking' src/games/stars-bars/ → 0
$ rg -c 'status-ai-thinking' scripts/stars-bars-deep-playtest.mjs → 3
$ measureTargets.thinking = !!querySelector('.status-ai-thinking')  # always false
$ # New Game race wait already polls status text via 1474 helper

$ settleAfterMove waits only .status-ai-thinking (visible 500ms / hidden 8s)
$ sum-dominoes product: wait.className = 'sd-computer-thinking' (no status-ai-thinking)
$ console-sweep case 'sum-dominoes' calls settleAfterMove after each scripted move

$ Open drafts into cursor/mp-tip-post2bfabdf at audit: #1535–#1539 (bh implementers)
$ Live product status harvest vs isDeepPlaytestEndStatus: 0 non-banner false+
```

Baselines also under `/opt/cursor/artifacts/r61-*.log` / `r61-summary.txt`.

## New tasks

### q-mp-1486 · Scripts: stars-bars deep-playtest must classify Red wins as `ai-win`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2bfabdf`)
- **depends-on:** serialize before `1490`; leave folded `1474` New Game race alone
- **series:** script-tooling
- **verdict:** **SAFE** — harness outcome honesty; product labels are Blue/Red, never “Computer wins”
- **CI / package.json callers:** deep-playtest / stars-bars harness scripts (report-only local)
- **target files:** `scripts/stars-bars-deep-playtest.mjs` (outcome arms ~L333 / L373 / L404 / L420)
- **measured baseline:** Live winner status is `` `${icon} ${getPlayerName(winner)} wins with ${score} points!` `` with `getPlayerName` → `Blue`/`Red`. Harness `/computer/i.test("🔴 Red wins with 18 points!")` → **false** → `human-win`. Par-55 / sum-dominoes siblings use `/red/i` → `ai-win`. Blue win / tie paths still classify correctly under both.
- **acceptance criteria:** Red win banners classify as `ai-win`; Blue win → `human-win`; tie/draw unchanged; hermetic unit with stubbed status strings; **no** rules / scoring / player-facing copy edits; Stars & Bars history cap untouched.
- **verification commands:** hermetic unit; `rg -n 'human-win|ai-win|/computer/i|/red/i' scripts/stars-bars-deep-playtest.mjs`
- **conflict notes:** outcome classifier — not New Game race wait (`1474`); not dead `.status-ai-thinking` metric (`1490`).
- **screen:** SAFE.

### q-mp-1487 · Scripts: ramrod deep harness must not depend on never-applied `.ramrod-computer-thinking`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2bfabdf`)
- **depends-on:** leave illicit sampling `1468` alone; **no** product chrome / rules / AI edits
- **series:** script-tooling
- **verdict:** **SAFE** — harness metrics / capture wait on a class tip product never sets (CSS-only)
- **CI / package.json callers:** ramrod deep-playtest harness (report-only local)
- **target files:** `scripts/ramrod-deep-playtest.mjs` (`measureTargets` / wait / think-flash / `captureAiThinkingShot`)
- **measured baseline:** Harness references `.ramrod-computer-thinking` **4** times. Tip `src/games/ramrod/**/*.ts` never adds the class; only `ramrod.css` defines it. Controller sets `status.className = \`ramrod-status ${state.currentPlayer}\``and text`"Computer is thinking…"`. Wait paths partly rescued by `/computer|thinking/i`on status text;`thinking` metric stays always false; capture shot waits for a class that never attaches.
- **acceptance criteria:** Detect AI seat via tip-real signals (status text / `.ramrod-status` / history growth) **or** explicitly document + skip dead class metrics; hermetic stub coverage; **do not** implement product `.ramrod-computer-thinking` chrome.
- **verification commands:** hermetic unit; `rg -n 'ramrod-computer-thinking|Computer is thinking' scripts/ramrod-deep-playtest.mjs src/games/ramrod`
- **conflict notes:** harness-only — not fab chrome (`1484`); not illicitPass (`1468`); not product `#422`-style HOLD.
- **screen:** SAFE.

### q-mp-1488 · Scripts: check-copy-pins `extractExpectUnit` must not null out regex literals with `'`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2bfabdf`)
- **depends-on:** serialize before `1489`; leave open softRe `1481` / folded mid-fragment / leading debris alone
- **series:** script-tooling
- **verdict:** **SAFE** — extract gate never reaches softRe; live apostrophe `toMatch` pins are invisible
- **CI / package.json callers:** `package.json` → `check:copy-pins` (CI lint soft `--fail` + `continue-on-error`)
- **target files:** `scripts/check-copy-pins.mjs` (`extractExpectUnit` / `closeParen` string vs regex state); unit under `tests/unit/*copy-pins*`
- **measured baseline:** `extractExpectUnit("expect(msg).toMatch(/It's a tie!/i);")` → **null** → `scanSource` findings **0**. Twin `/Blue wins!/i` extracts and can soft-hit. Live `tests/unit/contig-60-end-rules.test.ts` `toMatch(/It's a draw!/)` → extract null. Tip has ≈**58** `toMatch(/…'…/)` slices. Root cause: `closeParen` treats `'` inside `/It's…/` as a string open and never finds the matcher `)`.
- **acceptance criteria:** Regex literals with apostrophes extract a full `matcherArg`; string/`toBe` paths unchanged; hermetic unit covering `/It's a draw!/` + `/Blue wins!/`; no `src/games/**/rules.ts` / player-facing copy edits; no findings-total remasure theater.
- **verification commands:** hermetic unit; `rg -n 'extractExpectUnit|closeParen|softRe' scripts/check-copy-pins.mjs`
- **conflict notes:** extract-null before softRe — not softRe `Blue's` (`1481`); not char-class `)` truncate (`1489`).
- **screen:** SAFE.

### q-mp-1489 · Scripts: check-copy-pins `extractExpectUnit` must not truncate on `)` inside regex char classes

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2bfabdf`)
- **depends-on:** serialize after `1488`
- **series:** script-tooling
- **verdict:** **SAFE** — truncated `matcherArg` is wrong-results for char-class `)` patterns
- **CI / package.json callers:** `package.json` → `check:copy-pins` (CI lint soft `--fail` + `continue-on-error`)
- **target files:** `scripts/check-copy-pins.mjs` (`extractExpectUnit` / `closeParen` regex depth); unit under `tests/unit/*copy-pins*`
- **measured baseline:** `extractExpectUnit("expect(x).toMatch(/[^)]+/);")` → `matcherArg: "/[^"`. Live `tests/unit/q-mp-589-owl-events-soft-fail-residuals.test.ts:138` `not.toMatch(/\.get\([^)]+\)\s*\?\?\s*\[\]/)` → `matcherArg: "/\\.get\\([^)]+\\"`. Apostrophe-null (`1488`) is a different root cause (string-mode confusion).
- **acceptance criteria:** `)` inside `/[…]/` / escaped groups does not close the matcher early; full `matcherArg` retained; hermetic unit with OWL-shaped + `/[^)]+/` fixtures; leave apostrophe extract to `1488`; no findings-total remasure theater.
- **verification commands:** hermetic unit; CLI/self-test still green; `rg -n 'closeParen|extractExpectUnit' scripts/check-copy-pins.mjs`
- **conflict notes:** char-class / escaped-`(` depth — serialize after apostrophe extract (`1488`).
- **screen:** SAFE.

### q-mp-1490 · Scripts: stars-bars deep harness must not treat missing `.status-ai-thinking` as the thinking metric

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2bfabdf`)
- **depends-on:** serialize after `1486`; leave folded `1474` race wait alone (status-text poll already works)
- **series:** script-tooling
- **verdict:** **SAFE** — residual dead-chrome **metric** after race wait honesty
- **CI / package.json callers:** deep-playtest / stars-bars harness scripts (report-only local)
- **target files:** `scripts/stars-bars-deep-playtest.mjs` (`measureTargets.thinking` / wait thinking flag / race sample locator)
- **measured baseline:** `rg -c 'status-ai-thinking' src/games/stars-bars/` → **0**. Harness references `.status-ai-thinking` **3** times. Product only sets status text `"Computer is thinking…"`. New Game race wait already polls status via `1474` `sampleShowsAiThinking`; `thinking: !!querySelector('.status-ai-thinking')` metric stays always false.
- **acceptance criteria:** Thinking metric / samples use tip-real status-text (or shared helper) **or** explicitly drop the dead class flag; race wait behavior stays; hermetic stub coverage; **no** product `.status-ai-thinking` chrome; history cap untouched.
- **verification commands:** hermetic unit; `rg -n 'status-ai-thinking|computer is thinking|measureTargets' scripts/stars-bars-deep-playtest.mjs src/games/stars-bars`
- **conflict notes:** residual metric after `1474` wait — not outcome classifier (`1486`); not fab chrome (`1484`).
- **screen:** SAFE.

### q-mp-1491 · Scripts: console-sweep settle must honor sum-dominoes `.sd-computer-thinking`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post2bfabdf`)
- **depends-on:** leave console-sweep BASE_URL / summary alone; leave sum-dominoes deep-playtest alone
- **series:** script-tooling
- **verdict:** **SAFE** — settle wait uses the wrong selector for a game that **does** flash thinking chrome
- **CI / package.json callers:** `package.json` → console-sweep / related report-only local harness
- **target files:** `scripts/console-sweep.mjs` (`settleAfterMove`; sum-dominoes case ~L139)
- **measured baseline:** `settleAfterMove` waits only `.status-ai-thinking` (visible 500ms / hidden 8s) then double-rAF. Sum-dominoes product sets `wait.className = 'sd-computer-thinking'` and never uses `status-ai-thinking`. Soft timeouts make settle a no-op; the next human click in `playMoves` can run mid-AI. Sum-dominoes deep-playtest already queries `.sd-computer-thinking` correctly — this is sweep-only.
- **acceptance criteria:** After sum-dominoes (and any other scripted game with a tip-real thinking class) settle waits on that class and/or `/computer|thinking/i` status; games without chrome keep soft timeout; hermetic stub sequence; no product edits.
- **verification commands:** hermetic unit; `rg -n 'settleAfterMove|status-ai-thinking|sd-computer-thinking|sum-dominoes' scripts/console-sweep.mjs`
- **conflict notes:** sweep settle selector — not sum-dominoes deep-playtest; not BASE_URL theater; not fab/ramrod missing-chrome tickets.
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict  | Title (short)                                                          |
| ----------- | -------- | ---------------------------------------------------------------------- |
| `q-mp-1486` | **SAFE** | stars-bars: Red wins must classify as `ai-win`                         |
| `q-mp-1487` | **SAFE** | ramrod: harness must not depend on never-applied thinking class        |
| `q-mp-1488` | **SAFE** | check-copy-pins: extractExpectUnit must not null regex with `'`        |
| `q-mp-1489` | **SAFE** | check-copy-pins: extractExpectUnit must not truncate on char-class `)` |
| `q-mp-1490` | **SAFE** | stars-bars: thinking metric must not depend on missing chrome class    |
| `q-mp-1491` | **SAFE** | console-sweep: settle must honor sum-dominoes `.sd-computer-thinking`  |

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
| calla `youWinsGrammar` product-copy finding               | intentional product-copy latch — HOLD                  |
| fab / ramrod **product** thinking chrome                  | HOLD / leave `#422`-style alone                        |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Knip unusedExports (round-61)

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
- Honest underfill: **6** tasks (ids `1486`–`1491`), not padded to 25
