# Engineering backlog — 2026-10-11bc (tip refill after bb queue / round-55)

**Task id:** `q-mp-090bc`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post8f8a` @ `ed3baf99` (full `ed3baf999ac55e6d4f9e2b03c9b1b5eaa9aa192b`; tip cut from `alpha` @ `8f8a2122`; living pointers set by `q-mp-026ah`; ba backlog `#1471` + ba SAFE implementers `#1472`–`#1487` open drafts — treat as done; bb backlog `#1488` + bb implementers `#1490`–`#1499` drafting on this tip — treat every bb id `q-mp-1381`…`1402` as already queued)  
**Depends on:** tip `cursor/mp-tip-post8f8a` @ `ed3baf99`. Round-54 backlog (`q-mp-090bb` / open `#1488`, ids `q-mp-1381`…`1402`) — leave with `contained`; do **not** re-queue bb families or siblings (including HOLD-CHECK `1386`/`1390`/`1391`/`1392`). Round-53 ba (`1356`…`1377`) and earlier — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post8f8a` @ `ed3baf99` measures unit files **3458**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **10 new** concrete engineering tasks (`q-mp-1403` … `q-mp-1412`) mined from the **live tip tree**, checked against prior refills through `q-mp-1402` (bb `#1488` + implementers `#1490`–`#1499`), ba (`#1471`/`#1472`–`#1487`), and the full open draft PR list. It is the **only** deliverable of `q-mp-090bc`.

**Honest count:** **10** tasks (not 25) with measured wrong-results / product-copy false ends / docs drift — not padded from exhausted families. Id range starts at `q-mp-1403` per round-55 brief. Round-54 already claimed emit `--files-from` dup/flag-like, collectHtml word-boundary/`data-src`/`.mjs`, menu-critical `.mjs`, BOM ingest wave (lint-ratchet stdout, knip baseline, coverage-map, engine-coverage-rank, lint/boundaries/type ceilings, budgets, webmanifest), burn-1008 + residual `hidden`/`visibilityState`/`serviceWorker`/`onLine` restores, wiki Branches + CI soft copy-pins, measureGameChunks `.mjs` — **do not** re-queue `1381`–`1402`. This refill **does not** re-queue exhausted families from the round-55 brief (including ba/bb lists): `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed, license-classifier, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache audits, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas, prototype-restore, engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory, env-number, render-perf/runtime-perf, mobile-audit, console-sweep **summary**, mutation-report games, check-dev-doc-links, probe-offline classify, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest end regexes **as theater** (patience/Drawing already fixed — this refill’s `1403`/`1404` are **only** the star-track “Draw chains” product-copy residual + hyphenated verb forms), webkit-offline-probe, artifact-dir, README CI posture/lint-ratchet docs, PATH_RE, PLAYTEST\_\* env docs, hex mutation, flattenKnip, eslint probe, fab/fraction/calibration env parsing, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl/`.mjs`/numeric, emit-identity minify/base/parseArgs/`++`/`--files-from`/merge-base/dup flags, queens fuzz/shards, runLighthouse JSON, waitForGameReady load-error, offline probe board/recovered/mount, offline-dev date, report-licenses maps, mapGameChunks, withSeededRandom/oracle thenables, storage-stubs, hex-ui, playtest BASE join/seed **URL**, queens e2e seed, type-ratchet phase2 docs/coercion/fail-open, engine-property immutability/shards, heap self_size/truncated/BOM, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty/dup, mutation ARITH/infra/dead/`--max`/dup/flag-like, playtest OUT date (harness stems), reporter BOM, matchMedia restore, queens seed-B, ai-calibration winners/OUT, lint/type-ratchet fail-open, console-sweep summary, check-build chunk/html/health, probe browsers, flake-loop corrupt/failed/dup, CONTRIBUTING PR base, queens/fab/engine-property/polyomino/pent/fiar shards, PLAYTEST_SEED_ENV demote, document.hidden/requestIdleCallback/innerWidth/visibilityState/navigator.onLine/serviceWorker restores (ba/bb file sets), env-leak `.mjs`, html poster/srcset/`data-src`/`.mjs`, any UTF-8 BOM ingest sibling, ai-typeonly docs, wiki Branches/CI posture, memory-leak baseURL, calla PLAYTEST_BASE, isHttpResponseReady, lint/type/boundaries ratchet parse items (HOLD-CHECK `1386`/`1390`/`1391`/`1392`). No NaN/null-coercion micro-fixes unless real data hits them. No tip-stamp **count** remasure of wiki/testing-layers tables. No knip unusedTypes baseline drop.

**Fresh payoffs on this tip (re-measured @ `ed3baf99` after ba done + bb queue `#1488`/`#1490`–`#1499`):** **`isDeepPlaytestEndStatus` / `isDeepPlaytestDrawStatus` return true on live star-track mid-game copy `"Blue's turn - Draw chains from the bucket"`** (`\bdraw\b` matches title-case “Draw”), **hyphenated forms `pre-tie` / `tie-breaker` / `re-draw` / `pre-wins` also false-end**, **`isCallaEndStatus` still true on `pre-tie` / `No tie yet` / `Who wins the round?`**, **`README.md` Status still claims Vitest **3083** files / **34** Playwright specs / Chromium **204** while tip measures **3458** / **31** specs / **249** cases**, **`ai-move-time-midgame.bench.test.ts` still writes `docs/ai-move-time-2026-10-07.md` with H1 date `2026-10-07`**, **`resolveCalibrationDate('   ')` returns `"   "`** (empty string already live-stamps), **`resolvePlaytestSeed({PLAYTEST_SEED:'   '})` → `0`** (not `DEFAULT_PLAYTEST_SEED`), **`console-sweep` default `BASE_URL` is still `http://localhost:5173` while `nav-away-sweep` / most deep-playtests default `http://127.0.0.1:5173`**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** OUT-date hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Bb lint/type/boundaries BOM HOLD-CHECK (`1386`/`1390`/`1391`/`1392`) stay prior — **do not** sibling.

## Duplicate check (do not re-queue)

| Topic family                                                                          | Why skipped                                                             |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| round-54 bb `1381`–`1402` (+ `#1488`; tip drafts `#1490`–`#1499`)                     | leave with `contained`; this refill’s tickets are **new** surfaces only |
| round-53 ba `1356`–`1377` (+ `#1471`; tip drafts `#1472`–`#1487`)                     | leave with `contained`                                                  |
| deep-playtest end **patience/Drawing** substring (`1258`/`1259`)                      | star-track **“Draw chains”** product copy + hyphen verbs are new        |
| calla end **Drawing/patience** (`1258` / `#1392` on old tip)                          | hyphen / “No tie yet” / “Who wins” residuals are new                    |
| playtest OUT date harness stems / ai-calibration OUT date                             | ai-move-time **bench** OUT path is a different writer                   |
| playtest BASE join/seed URL / PLAYTEST_SEED_ENV demote                                | `resolvePlaytestSeed` whitespace→`0` is new fail-closed honesty         |
| MEM_LEAK filter/date live stamp                                                       | calibration whitespace residual is different file; memleak date skipped |
| README CI posture / wiki Branches / wiki copy-pins                                    | README **Status** numeric counts are new                                |
| console-sweep **summary** invariants (`1332`)                                         | BASE_URL **default host** parity is new                                 |
| engine-coverage-rank BOM / metric theater                                             | leave bb `#1490` / prior — do not sibling `/ai` path or `layout.ts`     |
| UTF-8 BOM ingest siblings                                                             | leave bb wave — do not sibling                                          |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions | hard-rule HOLD                                                          |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `ed3baf99`)

| Id                                   | Title (short)                        | Verdict                          | Evidence @ `ed3baf99`                                          |
| ------------------------------------ | ------------------------------------ | -------------------------------- | -------------------------------------------------------------- |
| `q-mp-090bb` / `#1488`               | round-54 backlog                     | **open draft on old tip**        | This refill starts at `1403`; do not re-queue `1381`–`1402`.   |
| `#1490`–`#1499`                      | bb SAFE implementers into `post8f8a` | **open drafts on this tip**      | Leave with `contained`.                                        |
| `q-mp-090ba` / `#1471`               | round-53 backlog                     | **open draft on tip `post38d2`** | leave with `contained`.                                        |
| `#1472`–`#1487`                      | ba SAFE implementers                 | **open drafts**                  | Leave with `contained` (treat as done per round-55 brief).     |
| `q-mp-1386`/`1390`/`1391`/`1392`     | bb HOLD-CHECK ratchet BOM            | **queued in bb; no tip PR yet**  | Leave prior ids — **do not** sibling.                          |
| `q-mp-1201`…`1204` / `1220` / `1214` | boundaries + size soft-gate          | **still-valid; no tip PR yet**   | Leave prior ids — **do not** re-queue.                         |
| `q-mp-1122` / `1123`                 | workflows scalar `on:` / job perms   | **still-valid HOLD-CHECK**       | Leave prior — do not sibling (check-workflows parsing family). |
| knip unusedExports                   | live `--json`                        | **3 LEAVE**                      | No new SAFE demote.                                            |

## Shared-file conflict flags

| Shared file                                     | Conflicting new ids                             |
| ----------------------------------------------- | ----------------------------------------------- |
| `scripts/lib/deep-playtest-end.mjs`             | `1403` + `1404` — serialize; leave `1259` alone |
| `scripts/lib/calla-end-status.mjs`              | `1405` only; leave `1258` alone                 |
| `README.md`                                     | `1406` + `1407` — serialize; **not** CI posture |
| `tests/unit/ai-move-time-midgame.bench.test.ts` | `1408` only                                     |
| `scripts/lib/calibration-date.mjs`              | `1409` only; leave ba `#1464`/`1352` alone      |
| `scripts/lib/playtest-seed.mjs`                 | `1410` only; leave az seed URL/`1345` alone     |
| `scripts/console-sweep.mjs`                     | `1411` only; leave summary `1332` alone         |
| `scripts/lib/browser-harness-script-usage.mjs`  | `1411` if usage string updated                  |
| `docs/dev/testing-layers-2026-10-09.md`         | `1412` only; leave ba `#1484`/`1374` alone      |

**Parallel-friendly:** `1405`, `1408`, `1409`, `1410`, `1411`, `1412`. Serialize `1403`→`1404`; `1406`→`1407`.

## Live tip measurements (evidence snapshot @ `ed3baf99`)

```text
$ git rev-parse HEAD
  ed3baf999ac55e6d4f9e2b03c9b1b5eaa9aa192b

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3458

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ find tests/e2e -name '*.spec.ts' ! -path '*/fullgame/*' | wc -l
  31

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ isDeepPlaytestEndStatus("Blue's turn - Draw chains from the bucket") → true
$ isDeepPlaytestDrawStatus("Blue's turn - Draw chains from the bucket") → true
$ isDeepPlaytestEndStatus('pre-tie'|'re-draw'|'pre-wins') → true
$ isCallaEndStatus('pre-tie'|'No tie yet'|'Who wins the round?') → true
$ README Status → Vitest **3083** / Playwright **34** / Chromium **204**
$ ai-move-time writeFileSync → docs/ai-move-time-2026-10-07.md ; H1 '2026-10-07'
$ resolveCalibrationDate('   ') → "   "
$ resolvePlaytestSeed({PLAYTEST_SEED:'   '}) → 0 (DEFAULT 0x70a71e57)
$ console-sweep BASE default localhost:5173 ; nav-away-sweep 127.0.0.1:5173

$ Open drafts into cursor/mp-tip-post8f8a at audit: #1490–#1499 (bb implementers)
$ Open ba/bb backlogs: #1471 (ba), #1488 (bb) on prior tip bases
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090bc-repros.log`.

## New tasks

### q-mp-1403 · Scripts: deep-playtest end must not match star-track “Draw chains”

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** serialize with `1404`; leave patience/Drawing `1259` alone
- **series:** script-tooling
- **verdict:** **SAFE** — live product mid-game status false-ends any harness using `isDeepPlaytestEndStatus` / `isDeepPlaytestDrawStatus`
- **CI / package.json callers:** `package.json` → `playtest:stars-bars` / `playtest:ramrod` / `playtest:par-55` / `playtest:sum-dominoes` (local harnesses importing `scripts/lib/deep-playtest-end.mjs`)
- **target files:** `scripts/lib/deep-playtest-end.mjs` (`END_RE_SOURCE` / `DRAW_RE_SOURCE` / `isDeepPlaytestEndStatus` / `isDeepPlaytestDrawStatus`); unit tests under `tests/unit/*deep-playtest*`
- **measured baseline:** `getPhaseMessage` star-track `drawChains` → `"Blue's turn - Draw chains from the bucket"`; `isDeepPlaytestEndStatus(…)` → **true**; `isDeepPlaytestDrawStatus(…)` → **true**. Real ends `"Blue wins!"` / `"It's a draw! All chains exhausted."` still true.
- **acceptance criteria:** Mid-game “Draw chains …” / “Draw chains from the bucket” → **false** for end + draw detectors; `"It's a draw!"` / `"Blue wins!"` / `"It's a Tie!"` unchanged; keep browser `END_RE_SOURCE` in sync; no product copy edits.
- **verification commands:** hermetic unit with the live star-track string; `rg -n 'END_RE_SOURCE|Draw chains|isDeepPlaytestEndStatus' scripts/lib/deep-playtest-end.mjs tests/unit`
- **conflict notes:** product-copy residual of word-boundary end detectors — **not** patience/Drawing substring theater (`1259`); hyphen forms are `1404`.
- **screen:** SAFE.

### q-mp-1404 · Scripts: deep-playtest end must not match hyphenated `*-draw` / `*-tie` / `*-wins`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** serialize after `1403`
- **series:** script-tooling
- **verdict:** **SAFE** — `\b(draw|tie|wins?)\b` matches after `-` (`pre-tie`, `re-draw`, `pre-wins`)
- **CI / package.json callers:** deep-playtest harnesses (same as `1403`)
- **target files:** `scripts/lib/deep-playtest-end.mjs`
- **measured baseline:** `pre-tie` / `re-draw` / `pre-wins` → end **true**; `tie-breaker round` → end **true** + draw **true**.
- **acceptance criteria:** Hyphen-prefixed forms → false; space-bounded `"It's a tie"` / `"Blue wins!"` unchanged; prefer negative lookbehind `(?<![A-Za-z0-9_-])` or equivalent; keep `END_RE_SOURCE` page-callback sync.
- **verification commands:** hermetic unit; `rg -n 'END_RE_SOURCE|TIE_RE|DRAW_RE' scripts/lib/deep-playtest-end.mjs`
- **conflict notes:** hyphen residual only; “Draw chains” title-case verb is `1403`.
- **screen:** SAFE.

### q-mp-1405 · Scripts: calla end-status must reject hyphenated / non-banner `tie`/`wins`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** leave `1258` Drawing/patience alone; serialize with deep-playtest only if sharing a regex helper
- **series:** script-tooling
- **verdict:** **SAFE** — `CALLA_END_STATUS_RE` still false-ends on `pre-tie`, `No tie yet`, `Who wins the round?`
- **CI / package.json callers:** `package.json` → `playtest:calla`
- **target files:** `scripts/lib/calla-end-status.mjs`; `tests/unit/calla-deep-playtest-end-status.test.ts`
- **measured baseline:** `isCallaEndStatus('pre-tie'|'No tie yet'|'Who wins the round?')` → **true**; real banners `"It's a Tie!"` / `"Blue wins!"` / `"🤝 It's a Tie! 🤝"` → true.
- **acceptance criteria:** Hyphenated / interrogative / “No tie yet” → false; real calla banners unchanged; no `src/games/calla` copy edits.
- **verification commands:** hermetic unit; `rg -n 'CALLA_END_STATUS_RE|isCallaEndStatus' scripts/lib/calla-end-status.mjs tests/unit/calla-deep-playtest-end-status.test.ts`
- **conflict notes:** calla matcher residual; not deep-playtest-end.mjs (`1403`/`1404`); not calla `PLAYTEST_BASE` (`1374`).
- **screen:** SAFE.

### q-mp-1406 · Docs: README Status Vitest file count must match tip

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** serialize with `1407`; **not** README CI posture / tip-name pointer remasure
- **series:** docs
- **verdict:** **SAFE** — public README Status disagrees with `find tests/unit`
- **CI / package.json callers:** none (docs-only)
- **target files:** `README.md` (Status bullet)
- **measured baseline:** README `Tests: **3083** Vitest files`; `find tests/unit …` → **3458** (matches wiki tip sentence @ `post8f8a`).
- **acceptance criteria:** Status Vitest file count = live tip `find` (3458 at audit); do **not** rewrite CI posture / AGENTS tip name; no wiki/testing-layers table remasure theater.
- **verification commands:** `rg -n 'Vitest files|3083|3458' README.md` ; `find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l`
- **conflict notes:** Status **file count** only; e2e numbers are `1407`.
- **screen:** SAFE.

### q-mp-1407 · Docs: README Status e2e spec / Chromium case counts must match tip

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** serialize after `1406`
- **series:** docs
- **verdict:** **SAFE** — README claims **34** specs / **204** Chromium cases; tip has **31** specs excl. fullgame / **249** listed Chromium cases
- **CI / package.json callers:** none (docs-only)
- **target files:** `README.md` (Status bullet)
- **measured baseline:** `find tests/e2e -name '*.spec.ts' ! -path '*/fullgame/*'` → **31**; `npm run test:e2e:chromium -- --list` → **249 tests in 25 files**; fullgame **20** still matches README.
- **acceptance criteria:** Status Playwright excl-fullgame count + required Chromium case count match tip commands; fullgame “20” kept if still true; no CI posture rewrite.
- **verification commands:** `find tests/e2e -name '*.spec.ts' ! -path '*/fullgame/*' | wc -l` ; `npm run test:e2e:chromium -- --list` ; `rg -n 'Playwright|204|249|34' README.md`
- **conflict notes:** e2e numbers only; Vitest file count is `1406`.
- **screen:** SAFE.

### q-mp-1408 · Tests: ai-move-time bench must stamp live OUT date (not `2026-10-07`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** leave playtest harness OUT-date family / ai-calibration OUT (`1352`) alone; no AI timing/product edits
- **series:** test-hygiene
- **verdict:** **SAFE** — local (non-`CI`) runs always overwrite Oct 7 markdown
- **CI / package.json callers:** `package.json` → `test:unit` (file `describe.skipIf(!!process.env.CI)` — local writer only)
- **target files:** `tests/unit/ai-move-time-midgame.bench.test.ts`
- **measured baseline:** `writeFileSync(…, 'docs/ai-move-time-2026-10-07.md')`; H1 `# AI move think-time — 2026-10-07`.
- **acceptance criteria:** Path + H1 use live UTC `YYYY-MM-DD` (reuse `utcPlaytestDateStamp` or equivalent); historical Oct 7 doc may remain; **no** AI search/scoring/difficulty/timing changes; Hex Hard 450ms untouched; `CI=1` still skips.
- **verification commands:** `rg -n 'ai-move-time-2026-10-07|think-time' tests/unit/ai-move-time-midgame.bench.test.ts` ; `CI=1 npx vitest run --project unit-shared tests/unit/ai-move-time-midgame.bench.test.ts`
- **conflict notes:** bench OUT stamp only — **not** AI harness speed theater; not playtest harness OUT stems.
- **screen:** SAFE.

### q-mp-1409 · Scripts: `resolveCalibrationDate` must treat whitespace-only as unset

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** leave ba `#1464`/`1352` live UTC default alone
- **series:** script-tooling
- **verdict:** **SAFE** — `if (envDate)` is truthy for `"   "` → broken OUT/title stem
- **CI / package.json callers:** `package.json` → `run:ai-calibration` / calibration harness importing `scripts/lib/calibration-date.mjs`
- **target files:** `scripts/lib/calibration-date.mjs`
- **measured baseline:** `resolveCalibrationDate('   ')` → `"   "`；`resolveCalibrationDate('')` → live UTC date.
- **acceptance criteria:** Trim; whitespace-only / empty → live UTC; non-empty trimmed override unchanged; no OUT-path remasure theater.
- **verification commands:** hermetic unit; `rg -n 'resolveCalibrationDate|trim' scripts/lib/calibration-date.mjs`
- **conflict notes:** whitespace residual of OUT-date stamp — **not** unknown-winners aggregate (`1327`); not MEM_LEAK date.
- **screen:** SAFE.

### q-mp-1410 · Scripts: `resolvePlaytestSeed` must reject whitespace / non-uint32 seeds

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** leave az `PLAYTEST_SEED_ENV` demote `#1462`/`1345` and playtest BASE URL join alone
- **series:** script-tooling
- **verdict:** **SAFE** — whitespace → `0`; `1e3` → `1000`; `-1` → `4294967295` via `>>> 0`
- **CI / package.json callers:** deep-playtest harnesses importing `scripts/lib/playtest-seed.mjs`
- **target files:** `scripts/lib/playtest-seed.mjs`; unit tests under `tests/unit/playtest-seed*.test.ts`
- **measured baseline:** `resolvePlaytestSeed({PLAYTEST_SEED:'   '})` → `0`; `'1e3'` → `1000`; `'-1'` → `4294967295`; unset/empty → `DEFAULT_PLAYTEST_SEED` (`0x70a71e57`).
- **acceptance criteria:** Whitespace-only → default (or fail-closed with clear error — pick one and test); reject scientific notation / non-decimal / out-of-uint32 the same way mutation-report rejects `1e2`; valid decimal uint32 unchanged.
- **verification commands:** hermetic unit; `rg -n 'resolvePlaytestSeed|PLAYTEST_SEED' scripts/lib/playtest-seed.mjs tests/unit/playtest-seed.test.ts`
- **conflict notes:** seed **parse honesty** only — not BASE URL join (`1305`/`1372`); not dead-export demote (`1345`).
- **screen:** SAFE.

### q-mp-1411 · Scripts: console-sweep default `BASE_URL` must match nav-away (`127.0.0.1`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** leave console-sweep summary `1332` and nav-away BASE honor `#1408` alone
- **series:** script-tooling
- **verdict:** **SAFE** — same `BASE_URL` env, different defaults → one harness “ready”, the other connection-refused on typical Vite binds
- **CI / package.json callers:** `package.json` → `audit:console` / `audit:nav-away`
- **target files:** `scripts/console-sweep.mjs`; `scripts/lib/browser-harness-script-usage.mjs` (`CONSOLE_SWEEP_USAGE`)
- **measured baseline:** `console-sweep` → `process.env.BASE_URL || 'http://localhost:5173'`; `nav-away-sweep` → `… || 'http://127.0.0.1:5173'`; usage strings disagree the same way.
- **acceptance criteria:** Default host `127.0.0.1:5173` (peer nav-away / most playtests); env override unchanged; usage string updated; no console-sweep summary math edits.
- **verification commands:** `rg -n 'localhost:5173|127\\.0\\.0\\.1:5173' scripts/console-sweep.mjs scripts/nav-away-sweep.mjs scripts/lib/browser-harness-script-usage.mjs`
- **conflict notes:** default host parity only — **not** summary invariants; not nav-away BASE_URL honor / owl dismiss.
- **screen:** SAFE.

### q-mp-1412 · Docs: `docs/dev/testing-layers-2026-10-09.md` playtest env table must note calla `PLAYTEST_BASE` migration

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** prefer **after** ba `#1484`/`1374` folds calla onto `PLAYTEST_BASE`; until then document tip truth + pointer to peer env
- **series:** docs
- **verdict:** **SAFE** — testing-layers table still pins calla to `PLAYTEST_BASE_URL`/`localhost` while peers use `PLAYTEST_BASE`/`127.0.0.1`; ba `1374` fixes the script — docs must not stay wrong after fold
- **CI / package.json callers:** none (docs-only)
- **target files:** `docs/dev/testing-layers-2026-10-09.md` (playtest env table)
- **measured baseline:** table row `playtest:calla` → `PLAYTEST_BASE_URL` / `localhost:5173`; tip `scripts/calla-deep-playtest.mjs` still on `PLAYTEST_BASE_URL` until `#1484` folds; ramrod/stars/par-55/sum already `PLAYTEST_BASE` / `127.0.0.1`.
- **acceptance criteria:** After verifying tip script env name, table row matches code (either document current tip + “migrate with `1374`” note, or update to `PLAYTEST_BASE`/`127.0.0.1` once folded); **no** unit-count remasure; not PLAYTEST\_\* env docs theater rewrite of all harnesses.
- **verification commands:** `rg -n 'PLAYTEST_BASE|calla' docs/dev/testing-layers-2026-10-09.md scripts/calla-deep-playtest.mjs`
- **conflict notes:** docs accuracy for calla row — **not** tip-stamp file counts; not `1374` script change (leave `#1484`).
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict  | Title (short)                                         |
| ----------- | -------- | ----------------------------------------------------- |
| `q-mp-1403` | **SAFE** | deep-playtest-end: star-track “Draw chains” false end |
| `q-mp-1404` | **SAFE** | deep-playtest-end: hyphenated draw/tie/wins           |
| `q-mp-1405` | **SAFE** | calla-end: hyphen / non-banner tie\|wins              |
| `q-mp-1406` | **SAFE** | docs: README Status Vitest file count                 |
| `q-mp-1407` | **SAFE** | docs: README Status e2e spec/case counts              |
| `q-mp-1408` | **SAFE** | tests: ai-move-time bench live OUT date               |
| `q-mp-1409` | **SAFE** | calibration-date: whitespace-only → unset             |
| `q-mp-1410` | **SAFE** | playtest-seed: reject whitespace / non-uint32         |
| `q-mp-1411` | **SAFE** | console-sweep: default BASE_URL → 127.0.0.1           |
| `q-mp-1412` | **SAFE** | docs: testing-layers calla PLAYTEST_BASE row          |

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic                                                     | Why not queued                                         |
| --------------------------------------------------------- | ------------------------------------------------------ |
| bb ratchet BOM HOLD-CHECK `1386`/`1390`/`1391`/`1392`     | queued in bb — do not sibling                          |
| `check-boundaries` `stripComments` / typeOnly / DOM_IDENT | prior HOLD-CHECK `1201`–`1204`/`1220` — do not sibling |
| `check-workflows` scalar `on:` / job-level permissions    | prior `1122`/`1123` — check-workflows family           |
| `validateManifest` display REQUIRED vs installability     | prior `1056` HOLD-CHECK                                |
| lint/type ratchet fail-open (`1328`–`1330`)               | ay HOLD-CHECK — leave prior                            |
| engine-property fingerprint before (`1309`)               | leave prior HOLD-CHECK id                              |
| knip LEAVE trio demote / unusedTypes baseline 36→29       | no SAFE demote / knip remasure theater                 |
| runtime-perf / mobile-audit hardcoded `2026-10-07` paths  | exhausted families — do not sibling                    |
| `maxLongTaskMs` non-finite → `0`                          | runtime-perf-helpers residual — leave exhausted family |
| `resolveMemLeakDate` whitespace                           | MEM_LEAK filter/date family — leave exhausted          |
| engine-coverage-rank `/ai` path + `layout.ts` gap         | engine-coverage-rank family — leave exhausted          |
| wiki/testing-layers **unit count** cells                  | tip-stamp remasure theater — skipped                   |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Out of scope / not used here

- No `memory/` files
- No CI workflow / permissions edits
- No player-facing copy, rules, scoring, AI search/difficulty/timing
- No Stars & Bars history cap; Hex Hard stays 450ms
- Honest underfill: **10** tasks (ids `1403`–`1412`), not padded to 25
