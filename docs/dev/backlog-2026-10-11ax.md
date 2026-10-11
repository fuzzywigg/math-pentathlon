# Engineering backlog — 2026-10-11ax (tip refill after post0f72 cut / round-50)

**Task id:** `q-mp-090ax`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post0f72` @ `6ae10c13` (full `6ae10c1331068056d4ac6c4c2403e61140781360`; tip cut from `alpha` @ `0f726b65` after `#1384` fold of post99ba; living pointers set by `q-mp-026ad`)  
**Depends on:** tip `cursor/mp-tip-post0f72` @ `6ae10c13`. Round-49 backlog (`q-mp-090aw` / open `#1400` on old tip `post99ba`, ids `q-mp-1271`…`1291`) — leave with `contained`; open tip implementers `#1402`–`#1414` cover those surfaces — **do not** re-queue. Round-48 backlog (`q-mp-090av` / open `#1382` on `post2590`, ids `q-mp-1246`…`1270`) — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post0f72` @ `6ae10c13` measures unit files **3432**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 yes **0**. This doc lists **18 new** concrete engineering tasks (`q-mp-1292` … `q-mp-1309`) mined from the **live tip tree**, checked against prior refills through `q-mp-1291` (aw on post99ba + tip implementers `#1402`–`#1414`), av/au/at/as/ar/aq/ap/ao, and against the full open draft PR list (post0f72 `#1402`–`#1414`, post99ba `#1383`–`#1400`, post2590 `#1365`–`#1382`, older stacks). It is the **only** deliverable of `q-mp-090ax`.

**Honest count:** Only **18** tasks — not padded to 25. Id range starts at `q-mp-1292` per round-50 brief. Earlier reserved gaps stay unused. Round-49 already claimed (and tip-implementing) PATH_RE root configs, PLAYTEST\_\* env docs, hex mutation globs, flattenKnip issues, eslint probe path, fab/fraction/calibration env parse, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl 404, emit-identity minify, ratchet-history lint keys, queens fuzz wall — **do not** re-queue `1271`–`1291` (leave `#1400` + tip drafts `#1402`–`#1414` with `contained`). This refill **does not** re-queue exhausted families from the round-50 brief: `--help`/argv/empty-input theater, cli-help spawn speedups, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed, license-classifier prose, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache audits, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas, prototype-restore after direct assigns, engine-coverage-rank, report-coverage-map, ratchet-history ceilings, env-number, render-perf/runtime-perf, mobile-audit, console-sweep, mutation-report games, ratchet-history mergeHistory, check-dev-doc-links, probe-offline classify, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest end regexes, webkit-offline-probe, artifact-dir, README CI posture/lint-ratchet docs, PATH_RE root configs, PLAYTEST\_\* env docs, hex mutation globs, flattenKnip issues, eslint probe path, fab/fraction-pinball/calibration env parsing, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl, emit-identity minify, ratchet-history lint keys, queens fuzz wall. No NaN/null-coercion micro-fixes unless real data hits them.

**Fresh payoffs on this tip (re-measured @ `6ae10c13` after aw queue + open `#1402`–`#1414`):** **`runLighthouse` `JSON.parse` throws on truncated LH output** (skips the whole Lighthouse section via outer catch), **`runLighthouse` accepts a pre-existing score JSON when the child exits 0 without proving a fresh write** (stale `score: 99`), **`waitForGameReady` (scripts + e2e) treats `game-load-error` as ready** because loading hides and shell `h1`/`#new-game-btn` remain, **prod offline probe sets `hexBoard`/`pentBoard` true from `#board`/`h1` even when `*LoadError` is true**, **chunk-load retry `recovered` is true if shell `#board` exists**, **dev offline probe hardcodes `date: '2026-10-07'`** while prod uses `toISOString`, **`countByLicense` corrupts `__proto__` / `constructor` keys** via plain `{}`, **`isUsableLockPackages` accepts `{ 'node_modules/x': null }` then collects 0** (1233 residual), **`mapGameChunks` picks an arbitrary hash when two `game-<id>-*.js` exist** (readdir order), **`check-emit-identity --base does-not-exist` → `ok: true` empty** (git status ignored), **`withSeededRandom` restores RNG before an async callback resumes**, **`withThrowingLocalStorageAccess` leaks the throwing getter when no prior descriptor**, **`injectHexStyles` latches `stylesInjected` so removed style nodes never reinject**, **nine playtest harnesses still build `` `${BASE}/#/game/…` ``** (gotoGame fix does not help them), **stars/sum/par/calla/ramrod/hex-deep use host `Math.random` with no report seed**, **`queens-guards-playability.spec.ts` imports bare `@playwright/test`** (skips seeded fixture), **`type-ratchet-phase2-plan.md` Context/Totals still say demos/`main.ts` out of scope and Expected `433`/`564`** while live ratchet is **0 / 216** with demos+main IN_SCOPE, and **engine-property helper claims apply immutability but `void before`**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake/restore hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids (`1201`–`1204`/`1214`/`1220`) — do not sibling. Ratchet-history chart keys stay prior `1289`; mergeHistory / ceiling coerce stay prior ids.

## Duplicate check (do not re-queue)

| Topic family                                                                                                                                                                               | Why skipped                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| round-49 aw `1271`–`1291` (+ open `#1400` on post99ba; tip drafts `#1402`–`#1414`)                                                                                                         | leave with `contained`; this refill’s tickets are **new** surfaces only                |
| round-48 av `1246`–`1270` / au `1222`–`1245` / at–ao residuals                                                                                                                             | leave with `contained`                                                                 |
| gotoGame trailing-slash (`1280` / `#1411`)                                                                                                                                                 | harnesses that **bypass** `gotoGame` are new (`1305`); do not re-queue page-ready join |
| check-perf waitForUrl 404 (`1287` / `#1406`)                                                                                                                                               | malformed JSON + stale-file reuse are new rows in the same file                        |
| emit-identity minify (`1288` / `#1407`)                                                                                                                                                    | invalid-base false-pass is new                                                         |
| probe-offline **classify** / waitForUrl 2xx (`1251`/`1261`)                                                                                                                                | board/load-error predicates + hardcoded **dev date** are new                           |
| isUsableLockPackages root-only (`1233`)                                                                                                                                                    | null non-root entry residual is new (`1299`)                                           |
| CycloneDX / license-classifier / queens fuzz wall / fab-fraction Number env                                                                                                                | prompt hard-skip                                                                       |
| page-ready **adoptions** / mountPair / npm aliases / `--help` / cli-help spawn                                                                                                             | prompt hard-skip (`1294` is load-error readiness, not adoption)                        |
| classifyVitestRunResult / flake-rate / heap / prototype-restore / engine-coverage / coverage-map / env-number / render-perf / runtime-perf / mobile-audit / console-sweep / mutation games | prompt hard-skip                                                                       |
| boundaries `1201`–`1204`/`1220` / size soft `1214` / emit demotes `1110` / nav-away games `1070`                                                                                           | leave prior ids                                                                        |
| tip-name pointers / wiki counts / knip baseline drop / AI harness speed                                                                                                                    | prompt hard-skip / HOLD                                                                |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions                                                                                                      | hard-rule HOLD                                                                         |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `6ae10c13`)

| Id                                   | Title (short)                              | Verdict                        | Evidence @ `6ae10c13`                                        |
| ------------------------------------ | ------------------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| `q-mp-090aw` / `#1400`               | round-49 backlog                           | **open on old tip `post99ba`** | This refill starts at `1292`; do not re-queue `1271`–`1291`. |
| `#1402`–`#1414`                      | aw SAFE implementers into `post0f72`       | **open**                       | Leave with `contained`.                                      |
| `q-mp-090av` / `#1382`               | round-48 backlog                           | **open on `post2590`**         | leave with `contained`.                                      |
| `q-mp-1271`…`1291`                   | aw gaps                                    | **in-flight on tip**           | leave prior ids; do not sibling.                             |
| `q-mp-1201`…`1204` / `1220` / `1214` | boundaries + size soft-gate                | **still-valid; no tip PR yet** | Leave prior ids — **do not** re-queue.                       |
| `q-mp-1233`                          | isUsableLockPackages root-only             | **claimed**                    | This refill’s `1299` is null-entry residual only.            |
| `q-mp-1070` / `1110` / `879`         | nav-away games / emit demotes / dismissOwl | **still-valid**                | Leave prior ids.                                             |
| Dead-code Rank-2 yes                 | live dry-run                               | **0 yes**                      | No new Rank-2 demote queued.                                 |
| knip unusedExports                   | live `--json`                              | **3 LEAVE**                    | No SAFE demotes (AI / settings barrel).                      |

## Shared-file conflict flags

| Shared file                                                | Conflicting new ids                                              |
| ---------------------------------------------------------- | ---------------------------------------------------------------- |
| `scripts/check-perf.mjs`                                   | `1292` + `1293` — serialize; leave open `#1406` waitForUrl alone |
| `scripts/lib/page-ready.mjs` + `tests/e2e/helpers/page.ts` | `1294` only; **no** mountPair / gotoGame re-queue                |
| `scripts/probe-offline-resilience.mjs`                     | `1295` + `1296` — serialize; leave classify / waitForUrl alone   |
| `scripts/probe-offline-resilience-dev.mjs`                 | `1297` only                                                      |
| `scripts/report-licenses.mjs`                              | `1298` + `1299` — serialize; **no** CycloneDX / classifier       |
| `scripts/check-bundle-budgets.mjs`                         | `1300` only; **no** exit-code theater                            |
| `scripts/check-emit-identity.mjs`                          | `1301` only; leave minify `#1407` / demotes `1110` alone         |
| `tests/helpers/rng.ts`                                     | `1302` only                                                      |
| `tests/helpers/storage-stubs.ts`                           | `1303` only; not adoption `802`                                  |
| `tests/helpers/core-hex/hex-ui.ts`                         | `1304` only                                                      |
| deep-playtest / playtest harnesses (URL join)              | `1305` — one PR or serialize per file                            |
| deep-playtest harnesses (seed)                             | `1306` — serialize after or with `1305` per file                 |
| `tests/e2e/queens-guards-playability.spec.ts`              | `1307` only                                                      |
| `docs/dev/type-ratchet-phase2-plan.md`                     | `1308` only; **no** baseline JSON upward edits                   |
| `tests/unit/helpers/engine-property-invariants.ts`         | `1309` only; leave wall-trim `1071`/`1112` alone                 |

**Parallel-friendly:** `1292`, `1294`, `1297`, `1298`, `1300`, `1301`, `1302`, `1303`, `1304`, `1307`, `1308`, `1309`. Serialize `1292`→`1293`; `1295`→`1296`; `1298`→`1299`; `1305`→`1306` per harness file.

## Live tip measurements (evidence snapshot @ `6ae10c13`)

```text
$ git rev-parse HEAD
  6ae10c1331068056d4ac6c4c2403e61140781360

$ git branch --show-current
  cursor/mp-tip-post0f72 (audited) / cursor/backlog-2026-10-11ax-5acd (this PR)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3432

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ npm run report:dead-code -- --dry-run
  Safe-to-remove yes: 0

$ runLighthouse + readFileSync '{not-json' → throws SyntaxError (outer LH section skipped)
$ runLighthouse exit 0 + pre-existing score 0.99 JSON → { ok:true, score:99 } (no freshness)

$ waitForGameReady: hides game-loading; waits #new-game-btn|h1 — no game-load-error check
$ offlineNav.hexBoard = .hex-board|#board count; pentBoard = .pent-board|#board|h1
$ chunkLoadFailureRetry.recovered = .calla-wrapper|.calla-pit|#board count

$ probe-offline-resilience-dev findings.date = '2026-10-07' (literal)
$ probe-offline-resilience findings.date = new Date().toISOString().slice(0, 10)

$ countByLicense([{license:'__proto__'}]) → {}
$ countByLicense([{license:'constructor'},{license:'constructor'}]) → { constructor: 'function Object() { [native code] }11' }
$ isUsableLockPackages({'node_modules/bad':null}) → true; collect → 0

$ mapGameChunks(['game-hex-old.js','game-hex-new.js'],['hex']) → old
$ mapGameChunks(['game-hex-new.js','game-hex-old.js'],['hex']) → new

$ node scripts/check-emit-identity.mjs --base does-not-exist --json → ok:true, results:[]

$ withSeededRandom(1, async () => { await Promise.resolve(); return Math.random() })
  → native draw ≠ seeded first draw 0.6270… (finally restored early)

$ withThrowingLocalStorageAccess after delete globalThis.localStorage → getter descriptor remains
$ injectHexStyles after removing style nodes → 0 style tags (stylesInjected latched)

$ PLAYTEST_BASE='http://127.0.0.1:5173/' → //#/game/<id> in calla/ramrod/stars/sum/par/hex-deep/fab/fraction/star-track
$ stars/sum/par/calla/ramrod/hex-deep: Math.random() move picks; no seed field in results

$ queens-guards-playability.spec.ts: import { test } from '@playwright/test' (not ./fixtures)

$ npm run typecheck:ratchet → in-scope 0 ; out-of-scope 216
$ type-ratchet-phase2-plan.md L15 demos/main "out of scope"; L27 Expected 433; L39 comment 433

$ Open drafts into cursor/mp-tip-post0f72 at audit: #1402–#1414 (aw implementers)
$ Round-49 backlog still open on post99ba: #1400
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090ax-repros.log`.

## New tasks

### q-mp-1292 · Scripts: `runLighthouse` must not throw on malformed LH JSON

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** leave open `#1406` waitForUrl alone; serialize with `1293`
- **series:** script-tooling
- **verdict:** **SAFE** — one truncated report aborts the entire Lighthouse section
- **CI / package.json callers:** `package.json` → `check:perf` (report-only / local)
- **target files:** `scripts/check-perf.mjs` (`runLighthouse` JSON.parse path)
- **measured baseline:** Injected `readFileSync: () => '{not-json'` → `SyntaxError: Expected property name…`; outer `main` catch sets `lighthouse.skipped: true` and drops all targets.
- **acceptance criteria:** Malformed / non-object JSON → `{ ok:false, error:… }` for that row; remaining targets continue; valid LH fixtures unchanged; **no** scoring / AI timing edits; **no** waitForUrl edits.
- **verification commands:** hermetic `runLighthouse` unit (extend `tests/unit/check-perf-*.test.ts`); `rg -n 'JSON\\.parse' scripts/check-perf.mjs`
- **conflict notes:** not waitForUrl `1287`; serialize with stale-file `1293`.
- **screen:** SAFE.

### q-mp-1293 · Scripts: `runLighthouse` reject stale / non-fresh output JSON

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** serialize after `1292`
- **series:** script-tooling
- **verdict:** **SAFE** — exit 0 + pre-existing file green-washes yesterday’s score
- **CI / package.json callers:** `package.json` → `check:perf`
- **target files:** `scripts/check-perf.mjs` (`runLighthouse` pre-unlink / mtime / write token)
- **measured baseline:** Child exit 0 + `existsSync` true + score `0.99` fixture → `{ ok:true, score:99 }` with no proof the child wrote the file.
- **acceptance criteria:** Unlink (or otherwise invalidate) the output path before spawn **or** require a freshness token/mtime after spawn; missing fresh output → `ok:false`; valid new writes unchanged.
- **verification commands:** hermetic stale-vs-fresh unit; `rg -n 'outJson|existsSync|unlink|rmSync' scripts/check-perf.mjs`
- **conflict notes:** serialize after `1292`; not missing-score `1208` / out-of-range `1246`.
- **screen:** SAFE.

### q-mp-1294 · Scripts/tests: `waitForGameReady` must reject `game-load-error`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** none; **do not** re-queue mountPair / gotoGame URL
- **series:** script-tooling
- **verdict:** **SAFE** — failed lazy loads look “ready” across scripts + e2e
- **CI / package.json callers:** `scripts/lib/page-ready.mjs` (many harnesses); `tests/e2e/helpers/page.ts` (Chromium e2e / fullgame)
- **target files:** `scripts/lib/page-ready.mjs`, `tests/e2e/helpers/page.ts` (`waitForGameReady`)
- **measured baseline:** Both wait for `game-loading` hidden then `#new-game-btn, h1` visible; shell chrome persists when `data-testid="game-load-error"` is shown (`src/ui/game-loading.ts` / game-shell).
- **acceptance criteria:** Presence of `[data-testid="game-load-error"]` fails readiness (or waits until cleared); success requires a real game mount (tip-owner chooses selector); **no** product copy / shell UX edits beyond testids already present.
- **verification commands:** hermetic selector/state unit or small Playwright fixture; `rg -n 'game-load-error|waitForGameReady' scripts/lib/page-ready.mjs tests/e2e/helpers/page.ts`
- **conflict notes:** not page-ready **adoption** theater; not gotoGame `1280`.
- **screen:** SAFE.

### q-mp-1295 · Scripts: offline probe must not count shell `#board`/`h1` as game mounted when load-error

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** leave classify / waitForUrl alone; serialize with `1296`
- **series:** script-tooling
- **verdict:** **SAFE** — load-error + shell chrome reports boards loaded
- **CI / package.json callers:** `scripts/probe-offline-resilience.mjs` (local / report-only)
- **target files:** `scripts/probe-offline-resilience.mjs` (`offlineNav.hexBoard` / `pentBoard` / slow3g `hexOk`/`hagOk`)
- **measured baseline:** `hexBoard` = `.hex-board, #board`; `pentBoard` = `.pent-board, #board, h1`; load-error flags recorded separately but board predicates ignore them. `h1` is shell-persistent.
- **acceptance criteria:** Board-ok requires game-specific mounts and `!*LoadError`; shell-only `#board`/`h1` must not count; findings JSON + any derived markdown stay consistent; **no** classify URL edits.
- **verification commands:** hermetic predicate unit if extracted; `rg -n 'hexBoard|pentBoard|hexOk|hagOk' scripts/probe-offline-resilience.mjs`
- **conflict notes:** not classify `1251`/`1252`; serialize with retry `1296`.
- **screen:** SAFE.

### q-mp-1296 · Scripts: offline chunk-load retry `recovered` must not use shell `#board`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** serialize after `1295`
- **series:** script-tooling
- **verdict:** **SAFE** — retry looks recovered while Calla never mounted
- **CI / package.json callers:** `scripts/probe-offline-resilience.mjs` (`chunkLoadFailureRetry`)
- **target files:** `scripts/probe-offline-resilience.mjs` (`recovered` selector)
- **measured baseline:** `recovered = locator('.calla-wrapper, .calla-pit, #board').count() > 0` — shell `#board` alone suffices.
- **acceptance criteria:** Recovery requires Calla-specific mounts (and no `game-load-error`); `#board` alone is insufficient; scenario fields stay report-only.
- **verification commands:** `rg -n 'recovered|calla-wrapper|game-load-error' scripts/probe-offline-resilience.mjs`
- **conflict notes:** serialize after `1295`; not webkit-offline-probe family.
- **screen:** SAFE.

### q-mp-1297 · Scripts: offline-dev probe stamp live `date` (not hardcoded 2026-10-07)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — every new run claims Oct 7 forever
- **CI / package.json callers:** `scripts/probe-offline-resilience-dev.mjs` (local)
- **target files:** `scripts/probe-offline-resilience-dev.mjs` (`findings.date`)
- **measured baseline:** `date: '2026-10-07'` literal; prod sibling uses `new Date().toISOString().slice(0, 10)`.
- **acceptance criteria:** Dev probe writes today’s UTC date like prod; no classify / waitForUrl edits; artifact path names may stay historical if tip-owner prefers.
- **verification commands:** `rg -n "date: '2026-10-07'|toISOString" scripts/probe-offline-resilience-dev.mjs scripts/probe-offline-resilience.mjs`
- **conflict notes:** not classify / waitForUrl; date metadata only.
- **screen:** SAFE.

### q-mp-1298 · Scripts: `countByLicense` must not use prototype-pollutable `{}`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** none; serialize with `1299`; **no** classifier / CycloneDX edits
- **series:** script-tooling
- **verdict:** **SAFE** — realistic odd SPDX-ish keys corrupt totals
- **CI / package.json callers:** `package.json` → `report:licenses` (report-only)
- **target files:** `scripts/report-licenses.mjs` (`countByLicense`)
- **measured baseline:** `__proto__` → `{}`; two `constructor` → `{ constructor: 'function Object() { [native code] }11' }`.
- **acceptance criteria:** Use `Object.create(null)` (or equivalent) so `__proto__`/`constructor` count as licenses; normal keys unchanged; markdown/CycloneDX consumers still get a plain object dump.
- **verification commands:** hermetic unit in `tests/unit/report-licenses-helpers.test.ts`; `rg -n 'countByLicense' scripts/report-licenses.mjs`
- **conflict notes:** not classifier prose; not CycloneDX `#1409`; serialize with `1299`.
- **screen:** SAFE.

### q-mp-1299 · Scripts: `isUsableLockPackages` reject null / non-object package entries

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** leave prior `1233` root-only alone; serialize after `1298`
- **series:** script-tooling
- **verdict:** **SAFE** — null metadata looks usable then yields empty inventory
- **CI / package.json callers:** `package.json` → `report:licenses`
- **target files:** `scripts/report-licenses.mjs` (`isUsableLockPackages` / collect gate)
- **measured baseline:** `{ 'node_modules/bad': null }` → `isUsableLockPackages` **true**, `collectPackagesFromLock` length **0**.
- **acceptance criteria:** Null/non-object non-root entries do not count as usable (or collect fails closed with emptyPackagesMessage); real lock entries unchanged.
- **verification commands:** hermetic lock fixture unit; `rg -n 'isUsableLockPackages' scripts/report-licenses.mjs`
- **conflict notes:** residual of `1233`, not a re-queue; not CycloneDX.
- **screen:** SAFE.

### q-mp-1300 · Scripts: `mapGameChunks` must not pick arbitrary duplicate hashes

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** none; **do not** change exit-code soft-gate policy
- **series:** script-tooling
- **verdict:** **SAFE** — gzip budget measures whichever file readdir returns first
- **CI / package.json callers:** `package.json` → `size:check` / `check-bundle-budgets` path (report-only / soft)
- **target files:** `scripts/check-bundle-budgets.mjs` (`mapGameChunks` / `measureGameChunks`)
- **measured baseline:** `['game-hex-old.js','game-hex-new.js']` → old; reversed → new. `measureGameChunks` feeds unsorted `readdirSync` results.
- **acceptance criteria:** Duplicate `game-<id>-*.js` → deterministic error/MISSING/duplicate status (tip-owner chooses) rather than silent arbitrary pick; single-hash games unchanged; hex vs hex-a-gone longest-id rule preserved; **no** exit-code theater.
- **verification commands:** hermetic `mapGameChunks` unit; `rg -n 'mapGameChunks|readdirSync' scripts/check-bundle-budgets.mjs`
- **conflict notes:** wrong measurement, not exit codes; not size soft MISSING `1214`.
- **screen:** SAFE.

### q-mp-1301 · Scripts: `check-emit-identity` fail closed on invalid git base

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** leave minify `#1407` / demotes `1110` alone; **no** AI source edits
- **series:** script-tooling
- **verdict:** **SAFE** — bad `--base` green-washes as “nothing to compare”
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local helper)
- **target files:** `scripts/check-emit-identity.mjs` (`defaultAiTouchedFiles` / `runEmitIdentityCheck`)
- **measured baseline:** `node scripts/check-emit-identity.mjs --base does-not-exist --json` → exit 0, `{ ok:true, results:[] }` (git diff failure ignored).
- **acceptance criteria:** Non-zero `git diff` / unknown ref → `ok:false` (or exit 2) with a clear message; true empty touched set may still be ok when git succeeds; minify/normalize paths unchanged.
- **verification commands:** hermetic spawn/unit with mocked `spawnSync`; `node scripts/check-emit-identity.mjs --base does-not-exist --json ; echo $?`
- **conflict notes:** not minify `1288`; not export demotes `1110`.
- **screen:** SAFE.

### q-mp-1302 · Tests: `withSeededRandom` must not restore before async work finishes

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** none; **no** AI RNG / scoring edits in `src/`
- **series:** test-hygiene
- **verdict:** **SAFE** — helper silently desyncs async callers
- **CI / package.json callers:** imported by unit suites via `tests/helpers/rng.ts`
- **target files:** `tests/helpers/rng.ts` (`withSeededRandom`)
- **measured baseline:** `withSeededRandom(1, () => Math.random())` → `0.6270…`; `await withSeededRandom(1, async () => { await Promise.resolve(); return Math.random() })` → native draw (mismatch).
- **acceptance criteria:** Reject thenables with a clear TypeError **or** document/implement an async-safe API that restores only after the promise settles; sync path unchanged; no overlapping global RNG holds across tests.
- **verification commands:** hermetic vitest covering sync + async rejection/behavior; `rg -n 'withSeededRandom' tests/helpers/rng.ts`
- **conflict notes:** not mulberry adoption `953`; helper contract only.
- **screen:** SAFE.

### q-mp-1303 · Tests: `withThrowingLocalStorageAccess` restore when no prior descriptor

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** leave adoption `802` alone
- **series:** test-hygiene
- **verdict:** **SAFE** — suites that delete `localStorage` first leak a throwing getter
- **CI / package.json callers:** `tests/helpers/storage-stubs.ts` (unit-isolated storage suites)
- **target files:** `tests/helpers/storage-stubs.ts` (`withThrowingLocalStorageAccess` `finally`)
- **measured baseline:** After `delete globalThis.localStorage`, helper leaves `{ get: [Function] }` configurable getter that still throws.
- **acceptance criteria:** When `original` is absent, `finally` deletes the temporary property; when present, restore descriptor as today; sync/async callbacks both covered.
- **verification commands:** hermetic vitest; `rg -n 'withThrowingLocalStorageAccess|original' tests/helpers/storage-stubs.ts`
- **conflict notes:** helper leak, not storage-stubs **adoption** `802`; not getContext/scrollIntoView restores.
- **screen:** SAFE.

### q-mp-1304 · Tests: `injectHexStyles` reinject after style node removed

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** none; **no** `src/` hex product edits
- **series:** test-hygiene
- **verdict:** **SAFE** — cleanup that removes `<style>` permanently disables styles
- **CI / package.json callers:** `tests/helpers/core-hex/hex-ui.ts` (overnight hex UI tests)
- **target files:** `tests/helpers/core-hex/hex-ui.ts` (`injectHexStyles` / `stylesInjected`)
- **measured baseline:** Inject → remove all `style` → reinject → **0** style tags (`stylesInjected` latched true). Existing idempotent test only covers double-inject without removal.
- **acceptance criteria:** Detect an existing tagged style node (data attribute / id) instead of a sticky boolean; reinject after removal; double-inject still does not stack duplicates.
- **verification commands:** extend `tests/unit/overnight-core-hex-ui-styles-idempotent.test.ts` (or sibling); `rg -n 'stylesInjected' tests/helpers/core-hex/hex-ui.ts`
- **conflict notes:** tests helper only; not product hex CSS.
- **screen:** SAFE.

### q-mp-1305 · Scripts: playtest harnesses join BASE without double slash (bypass gotoGame)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** leave open `#1411` gotoGame alone; **do not** force mountPair adoption
- **series:** script-tooling
- **verdict:** **SAFE** — trailing-slash env bases navigate to `//#/game/…`
- **CI / package.json callers:** `playtest:calla` / `playtest:ramrod` / `playtest:stars-bars` / `playtest:sum-dominoes` / `playtest:par-55`; plus `docs/playtest/hex-deep-probe.mjs`, `tests/playtest/fab-a-diffy-deep.mjs`, `docs/playtest/fraction-pinball-deep-playtest.mjs`, `tests/playtest/star-track-deep-playtest.mjs`
- **target files:** those harnesses’ `page.goto(\`${BASE}/#/game/…\`)`(or shared tiny join helper under`scripts/lib/` if tip-owner prefers)
- **measured baseline:** `BASE='http://127.0.0.1:5173/'` → `http://127.0.0.1:5173//#/game/<id>` for all nine listed builders.
- **acceptance criteria:** Trailing-slash and no-slash bases both produce a single `/` before `#`; env var **names** unchanged (leave docs ticket `1272` / `#1403`); no end-regex / owl / Number-env edits.
- **verification commands:** hermetic URL join unit(s); `rg -n 'goto\\(\\`\\$\\{BASE\\}/#' scripts/_deep-playtest.mjs docs/playtest/_.mjs tests/playtest/*.mjs`
- **conflict notes:** not gotoGame `1280`; harness-local builders only.
- **screen:** SAFE.

### q-mp-1306 · Scripts: deep-playtest harnesses seed move RNG + record seed

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** serialize with `1305` per file; **no** AI search/scoring/timing edits
- **series:** script-tooling
- **verdict:** **SAFE** — stalls cannot be replayed; host Math.random varies
- **CI / package.json callers:** `playtest:stars-bars` / `playtest:sum-dominoes` / `playtest:par-55` / `playtest:calla` / `playtest:ramrod`; `docs/playtest/hex-deep-probe.mjs`
- **target files:** those scripts’ move-pick `Math.random` sites + results writers
- **measured baseline:** Direct `Math.random()` for legal-move / value picks; no seed field in written JSON/markdown; Calla/Ramrod AI also consume host RNG in-page.
- **acceptance criteria:** Accept/derive a seed (env or default), install page/harness RNG (shared helper OK), write seed into results; coverage of difficulties/viewports unchanged; **no** end-regex / PAR55_QUICK / Number-env theater.
- **verification commands:** `rg -n 'Math\\.random|seed' scripts/*deep-playtest.mjs docs/playtest/hex-deep-probe.mjs` ; dry-run seed echo if exported
- **conflict notes:** not fab/fraction env Number tickets; not end-regex family.
- **screen:** SAFE.

### q-mp-1307 · Tests: queens-guards playability e2e must use seeded fixture

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** none; **no** product queens rules/AI edits
- **series:** test-hygiene
- **verdict:** **SAFE** — retries explore different random traces
- **CI / package.json callers:** `package.json` → `test:e2e:chromium` (blocking e2e)
- **target files:** `tests/e2e/queens-guards-playability.spec.ts` (+ `tests/e2e/fixtures.ts` if needed)
- **measured baseline:** `import { test, expect } from '@playwright/test'` — skips `installE2eStability`; in-page legal-move / piece-order selection uses native `Math.random()`.
- **acceptance criteria:** Use seeded fixture (or explicit `installE2eStability`) for fixture pages and any manually created contexts; assertions/coverage unchanged; no fake-clock retarget.
- **verification commands:** `rg -n "from '@playwright/test'|from '\\./fixtures'|installE2eStability|Math\\.random" tests/e2e/queens-guards-playability.spec.ts` ; `npm run test:e2e:chromium -- tests/e2e/queens-guards-playability.spec.ts`
- **conflict notes:** not queens fuzz **wall** `1291`; e2e seed wiring only.
- **screen:** SAFE.

### q-mp-1308 · Docs: type-ratchet phase2 plan active counts/scope match live gate

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** none; **do not** raise baseline JSON counts
- **series:** docs-accuracy
- **verdict:** **SAFE** — active “Expected/currently” text contradicts `npm run typecheck:ratchet`
- **CI / package.json callers:** none (docs); truth in `scripts/check-type-ratchet.mjs` + `docs/dev/type-ratchet-phase2-baseline.json`
- **target files:** `docs/dev/type-ratchet-phase2-plan.md` (Context / Single reproduce / Totals — keep historical numbers clearly dated)
- **measured baseline:** Header status already mentions Batch 9 → **216**; Context L15 still says demos/`main.ts` stay out of scope (but `IN_SCOPE` includes `^src/demos/` + `^src/main\\.ts$`); L27 Expected **433**; L39 comment **433**; live `typecheck:ratchet` → **0 / 216**.
- **acceptance criteria:** Active guidance shows current in-scope **0** / out-of-scope **216** and correct IN_SCOPE membership; historical 564/433 labeled as snapshots; no tip-name theater; no baseline upward edits.
- **verification commands:** `npm run typecheck:ratchet` ; `rg -n 'out of scope|Expected:|564|433|216|demos' docs/dev/type-ratchet-phase2-plan.md`
- **conflict notes:** not phase2-export `--check` `1266`; docs-only.
- **screen:** SAFE.

### q-mp-1309 · Tests: engine-property helper must fingerprint `before` for apply immutability

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post0f72`)
- **depends-on:** leave wall-trim `1071`/`1112` alone; **do not** edit `*/rules.ts` in this ticket
- **series:** test-hygiene
- **verdict:** **HOLD-CHECK** — helper claims immutability but never checks; fixing may surface real engine mutations (rules HOLD)
- **CI / package.json callers:** `package.json` → `test:unit` via `tests/unit/engine-property-invariants.test.ts`
- **target files:** `tests/unit/helpers/engine-property-invariants.ts` (`assertLegalMoveSound` / `assertApplyKeepsValid`)
- **measured baseline:** Comment: “Prior state must not be mutated by apply”; code fingerprints only `next` / `void before`. Adapter that mutates a hidden field still passes the helper.
- **acceptance criteria:** Fingerprint `before` prior to `apply` and fail if it changes; if live engines mutate, **stop and escalate** (do not “fix” rules in this ticket); wall/iteration budget unchanged.
- **verification commands:** hermetic adapter unit proving the helper fails on mutate-in-place; `CI=1 npx vitest run tests/unit/engine-property-invariants.test.ts` (report only — do not weaken if red for real mutations)
- **conflict notes:** not wall-trim HOLD-CHECK `1071`; immutability assert only.
- **screen:** HOLD-CHECK.

## Verdict summary

| Id          | Verdict        | Title (short)                                               |
| ----------- | -------------- | ----------------------------------------------------------- |
| `q-mp-1292` | **SAFE**       | check-perf: malformed LH JSON → row error                   |
| `q-mp-1293` | **SAFE**       | check-perf: reject stale LH output JSON                     |
| `q-mp-1294` | **SAFE**       | waitForGameReady: reject game-load-error                    |
| `q-mp-1295` | **SAFE**       | offline probe: board-ok ignores load-error / shell h1       |
| `q-mp-1296` | **SAFE**       | offline probe: chunk retry recovered ≠ shell #board         |
| `q-mp-1297` | **SAFE**       | offline-dev: live date stamp                                |
| `q-mp-1298` | **SAFE**       | licenses: countByLicense null-prototype map                 |
| `q-mp-1299` | **SAFE**       | licenses: isUsableLockPackages null entries (1233 residual) |
| `q-mp-1300` | **SAFE**       | bundle budgets: mapGameChunks duplicate hash determinism    |
| `q-mp-1301` | **SAFE**       | emit-identity: invalid git base fail-closed                 |
| `q-mp-1302` | **SAFE**       | tests: withSeededRandom async contract                      |
| `q-mp-1303` | **SAFE**       | tests: storage-stubs restore when no prior descriptor       |
| `q-mp-1304` | **SAFE**       | tests: hex-ui reinject after style removal                  |
| `q-mp-1305` | **SAFE**       | playtest harnesses: trailing-slash BASE URL join            |
| `q-mp-1306` | **SAFE**       | deep-playtest: seed move RNG + record seed                  |
| `q-mp-1307` | **SAFE**       | e2e: queens-guards playability seeded fixture               |
| `q-mp-1308` | **SAFE**       | docs: type-ratchet phase2 plan live counts/scope            |
| `q-mp-1309` | **HOLD-CHECK** | engine-property: fingerprint before for apply immutability  |

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic                                                        | Why not queued                                                   |
| ------------------------------------------------------------ | ---------------------------------------------------------------- |
| `check-lint-ratchet` string ceiling → FAIL status but exit 0 | CI-gating script live verdict (prior screened)                   |
| `check-type-ratchet` string / abs-path `IN_SCOPE` fail-open  | CI-gating type ratchet (prior screened)                          |
| `check-boundaries` UI_REEXPORT / classify abs paths          | prior `1201`–`1204`/`1220`                                       |
| `check-emit-identity` default merge-base still wave5 tip     | HOLD-CHECK tip-owner / AI-adjacent; `1110` demotes stay prior    |
| classifyVitest all-skipped → `survived`                      | exhausted `classifyVitestRunResult` family — leave prior posture |
| offline-probe-ready `res.ok` vs status mismatch              | synthetic Response mock; real fetch keeps ok↔status aligned      |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Out of scope / not used here

Already claimed / in-flight / HOLD / prompt-skipped families: aw `1271`–`1291` + `#1400`/`#1402`–`#1414`, av `1246`–`1270`, au `1222`–`1245`, at `1197`–`1220`, as–ao residuals, void/nnnull/nullish successors, eqeqeq product clear, lint-buckets **gate** fail-open, optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, tip-name pointers, UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e**, harness shards theater, demo coverage, page-ready / double-rAF / artifact-dir **adoptions** / mountPair / npm aliases / `--help`/`--dry-run`/argv / lib main-entry / empty-input / cli-help spawn, license-classifier, pwa-manifest-contract / check-pwa-manifest, check-workflows, precache parser, check-build asset/precache, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas, prototype-restore after direct assigns, engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep, mutation-report games/hex globs, deep-playtest end regexes, PATH_RE root configs, PLAYTEST\_\* env docs, flattenKnip, eslint probe path, fab/fraction/calibration env, gotoGame baseURL, CycloneDX, nav-away-sweep, check-perf waitForUrl, emit-identity minify, queens fuzz wall, overnight mountPair/router batches, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), nav-away games (`1070`), emit-identity export demotes (`1110`), AI timing / Hex Hard 450ms / Stars & Bars history cap, visual-baseline PNG refresh (`1050`), boundaries HOLD-CHECK (`1201`–`1204`/`1220`), size soft MISSING (`1214`).

Filled to **18** with measured wrong-results + docs mismatches only — **no filler** from exhausted families (honest shortfall vs 25).
