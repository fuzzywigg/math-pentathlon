# Engineering backlog — 2026-10-11bd (tip refill after bc queue / round-56)

**Task id:** `q-mp-090bd`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post8f8a` @ `c9d67370` (full `c9d67370e8dcb9fc21c37b61a184efe5dc22334a`; tip cut from `alpha` @ `8f8a2122`; living pointers set by `q-mp-026ah`; bc backlog folded on tip + bc SAFE implementers `#1501`–`#1508` drafting — treat every bc id `q-mp-1403`…`1412` as already queued; bb `#1490`–`#1499` / ba `#1472`–`#1487` leave with `contained`)  
**Depends on:** tip `cursor/mp-tip-post8f8a` @ `c9d67370`. Round-55 backlog (`q-mp-090bc` / open `#1500`, ids `q-mp-1403`…`1412`) — leave with `contained`; do **not** re-queue bc families or siblings. Round-54 bb (`1381`…`1402`) and round-53 ba (`1356`…`1377`) — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post8f8a` @ `c9d67370` measures unit files **3464**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **6 new** concrete engineering tasks (`q-mp-1428` … `q-mp-1433`) mined from the **live tip tree**, checked against prior refills through `q-mp-1412` (bc `#1500` + implementers `#1501`–`#1508`), bb (`#1488`/`#1490`–`#1499`), ba (`#1471`/`#1472`–`#1487`), and the full open draft PR list. It is the **only** deliverable of `q-mp-090bd`.

**Honest count:** **6** tasks (not 25) with measured wrong-results / docs drift — not padded from exhausted families. Id range starts at `q-mp-1428` per round-56 brief (gap `1413`–`1427` left unused). Round-55 already claimed deep-playtest “Draw chains” / hyphen ends, calla hyphen/non-banner ends, README Status counts, ai-move-time bench OUT date, calibration-date whitespace, playtest-seed uint32 honesty, console-sweep `BASE_URL` host, testing-layers calla env row — **do not** re-queue `1403`–`1412`. This refill **does not** re-queue exhausted families from the round-56 brief / bc purpose section: `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-name pointers, knip remeasure/baselines, AI harness speed, license-classifier, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache/chunk/html/health, menu-critical-ref, md-link regex, check-copy-pins, summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas/self_size/truncated/BOM/baseURL, prototype-restore, engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep summary **or** `BASE_URL`, mutation-report games/ARITH/infra/dead/`--max`/dup/flag-like, check-dev-doc-links, probe-offline classify/board/recovered/mount, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest / calla end matchers, webkit-offline-probe, artifact-dir, README CI posture/Status counts/lint-ratchet docs, PATH_RE, PLAYTEST\_\* env docs, testing-layers doc rows, hex mutation, flattenKnip, eslint probe, fab/fraction/calibration env parsing, calibration-date whitespace, playtest-seed parse, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep, check-perf waitForUrl/`.mjs`/numeric/BOM, emit-identity minify/base/parseArgs/`++`/`--files-from` **flag** dup/flag-like/merge-base, queens fuzz/shards/seed, runLighthouse JSON, waitForGameReady load-error, offline-dev date, report-licenses maps, mapGameChunks, withSeededRandom/oracle thenables, storage-stubs, hex-ui, playtest BASE join/seed URL, type-ratchet phase2/coercion/fail-open, engine-property immutability/shards, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty/dup, playtest OUT date harness stems, reporter BOM, matchMedia restore, ai-calibration winners/OUT, lint/type-ratchet fail-open, env-leak `.mjs`, html poster/srcset, ai-typeonly docs, burn-1007/1008/residual hidden+serviceWorker+visibilityState+onLine+innerWidth restores, polyomino/fab/pent/fiar shards, calla PLAYTEST_BASE, isHttpResponseReady status, ai-move-time bench OUT date, UTF-8 BOM ingest siblings, wiki Branches/CI posture (bb `#1494` folded — **no** soft-pwa CI-posture sibling), CONTRIBUTING PR base. No NaN/null-coercion micro-fixes unless real data hits them. No tip-stamp **count** remasure of wiki/testing-layers tables. No knip unusedTypes baseline drop. No `partitionOvers` trim theater while live `bundle-budgets.json` `knownOvers` is `[]`.

**Fresh payoffs on this tip (re-measured @ `c9d67370` after bc fold + open `#1501`–`#1508`):** **`--files-from` comment-only list → `files: []` → `runEmitIdentityCheck` falls through to `listAiTouchedFiles` discovery** (same path as omitting `--files-from`), **absolute `--files-from` paths → `missing-base` while the file exists on disk**, **duplicate / `./`-prefixed list lines inflate compare rows**, **`CONTRIBUTING.md` Verify section still omits blocking `npm audit --audit-level=high`**, **`README.md` Branches still says `All development merges here` on `alpha` after wiki Branches tip-draft clarification**, **wiki Commands bash fence still omits `bench:engines` / bare `test:e2e` / `test:e2e:fullgame` that the testing-layers table and `package.json` cite**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes or **docs-only** accuracy. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, wiki **count** cells, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Bb lint/type/boundaries BOM HOLD-CHECK (`1386`/`1390`/`1391`/`1392`) stay prior — **do not** sibling.

## Duplicate check (do not re-queue)

| Topic family                                                                          | Why skipped                                                             |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| round-55 bc `1403`–`1412` (+ `#1500`; tip drafts `#1501`–`#1508`)                     | leave with `contained`; this refill’s tickets are **new** surfaces only |
| round-54 bb `1381`–`1402` (+ `#1488`; tip drafts `#1490`–`#1499`)                     | leave with `contained`                                                  |
| round-53 ba `1356`–`1377` (+ `#1471`; tip drafts `#1472`–`#1487`)                     | leave with `contained`                                                  |
| emit `--files-from` **flag** dup / flag-like (`1381`/`1382` / `#1496`)                | empty-list fallthrough + abs/dedupe **list contents** are new           |
| README Status counts (`1406`/`1407` / `#1502`)                                        | README **Branches** wording is new                                      |
| wiki Branches / CI soft copy-pins (`1398`/`1399` folded)                              | wiki **Commands** fence gaps are new; CI-posture soft-pwa sibling skipped |
| CONTRIBUTING PR base (`1342`)                                                         | CONTRIBUTING **audit** gate omission is new                             |
| knip unusedExports LEAVE trio                                                         | no new SAFE demote                                                      |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions | hard-rule HOLD                                                          |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `c9d67370`)

| Id                                   | Title (short)                        | Verdict                          | Evidence @ `c9d67370`                                          |
| ------------------------------------ | ------------------------------------ | -------------------------------- | -------------------------------------------------------------- |
| `q-mp-090bc` / `#1500`               | round-55 backlog                     | **folded on tip; PR still open** | This refill starts at `1428`; do not re-queue `1403`–`1412`.   |
| `#1501`–`#1508`                      | bc SAFE implementers into `post8f8a` | **open drafts on this tip**      | Leave with `contained`.                                        |
| `#1490`–`#1499`                      | bb SAFE implementers                 | **open drafts**                  | Leave with `contained`.                                        |
| `q-mp-1386`/`1390`/`1391`/`1392`     | bb HOLD-CHECK ratchet BOM            | **queued in bb; no tip PR yet**  | Leave prior ids — **do not** sibling.                          |
| `q-mp-1201`…`1204` / `1220` / `1214` | boundaries + size soft-gate          | **still-valid; no tip PR yet**   | Leave prior ids — **do not** re-queue.                         |
| knip unusedExports                   | live `--json`                        | **3 LEAVE**                      | No new SAFE demote.                                            |

## Shared-file conflict flags

| Shared file                        | Conflicting new ids                                      |
| ---------------------------------- | -------------------------------------------------------- |
| `scripts/check-emit-identity.mjs`  | `1428` + `1429` + `1430` — serialize; leave `#1496` alone |
| `CONTRIBUTING.md`                  | `1431` only                                              |
| `README.md`                        | `1432` only; serialize after `#1502` Status if needed    |
| `docs/wiki/development.md`         | `1433` only; **not** Branches / CI posture               |

**Parallel-friendly:** `1431`, `1432`, `1433`. Serialize `1428`→`1429`→`1430`.

## Live tip measurements (evidence snapshot @ `c9d67370`)

```text
$ git rev-parse HEAD
  c9d67370e8dcb9fc21c37b61a184efe5dc22334a

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3464

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ find tests/e2e -name '*.spec.ts' ! -path '*/fullgame/*' | wc -l
  31

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ parseArgs(['--base','HEAD','--files-from', commentOnlyList]).files → []
$ runEmitIdentityCheck(thatOpts, {listAiTouchedFiles → hex/ai.ts}) → discovers hex/ai.ts (fallthrough)
$ runEmitIdentityCheck({files:['/workspace/src/games/hex/ai.ts']}) → missing-base; relative → identical
$ loadFilesFromList(dup+./ list) → 3 entries; runEmitIdentityCheck → 3 result rows
$ CONTRIBUTING.md → no "npm audit"
$ README.md Branches → "All development merges here"
$ wiki Commands bash → no bench:engines / test:e2e / test:e2e:fullgame (table still cites them)

$ Open drafts into cursor/mp-tip-post8f8a at audit: #1490–#1508 (bb + bc implementers); #1500 (bc backlog)
```

Baselines also captured under `/opt/cursor/artifacts/q-mp-090bd-repros.log` and `/opt/cursor/artifacts/q-mp-090bd-emit-empty.log`.

## New tasks

### q-mp-1428 · Scripts: `--files-from` empty/comment-only must not fall through to AI discovery

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** serialize with `1429`/`1430`; leave bb `#1496` / `1381`/`1382` flag honesty alone
- **series:** script-tooling
- **verdict:** **SAFE** — explicit `--files-from` with zero paths silently becomes “discover all touched ai\*.ts”
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local / report-only)
- **target files:** `scripts/check-emit-identity.mjs` (`parseArgs` / `runEmitIdentityCheck`); unit tests under `tests/unit/*emit-identity*`
- **measured baseline:** Comment-only list → `loadFilesFromList` `{ok:true,files:[]}` → `parseArgs(…--files-from…)` `{files:[]}` → `runEmitIdentityCheck` calls `listAiTouchedFiles` and compares discovered files (same as omitting `--files-from`).
- **acceptance criteria:** When `--files-from` was supplied, empty/normalized list stays empty (print “no files” / exit 0) **or** exit 2 with a clear message — pick one and test; omitting `--files-from` still discovers; no AI product edits.
- **verification commands:** hermetic unit with comment-only list + mocked `listAiTouchedFiles`; `rg -n 'sawFilesFrom|files-from|listAiTouchedFiles' scripts/check-emit-identity.mjs`
- **conflict notes:** list **emptiness** honesty — not duplicate/flag-like `--files-from` **flags** (`1381`/`1382`).
- **screen:** SAFE.

### q-mp-1429 · Scripts: emit-identity must reject or normalize absolute `--files-from` paths

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** serialize after `1428`
- **series:** script-tooling
- **verdict:** **SAFE** — absolute path that exists on disk reports `missing-base` because `git show` / `path.join(ROOT, file)` treat it as a ref path
- **CI / package.json callers:** `package.json` → `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (`loadFilesFromList` and/or compare path resolve)
- **measured baseline:** `runEmitIdentityCheck({files:['/workspace/src/games/hex/ai.ts'], base:'HEAD', head:'WORKING_TREE'})` → `[{status:'missing-base'}]`; relative `src/games/hex/ai.ts` → `identical`.
- **acceptance criteria:** Absolute paths under repo root normalize to repo-relative **or** fail closed with a clear usage error; paths escaping the repo rejected; relative paths unchanged.
- **verification commands:** hermetic unit with `path.resolve('src/games/hex/ai.ts')`; `rg -n 'missing-base|loadFilesFromList|ROOT' scripts/check-emit-identity.mjs`
- **conflict notes:** path shape honesty — not flag-like values (`1382`); not empty-list fallthrough (`1428`).
- **screen:** SAFE.

### q-mp-1430 · Scripts: emit-identity must dedupe / strip `./` in file lists

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** serialize after `1429`
- **series:** script-tooling
- **verdict:** **SAFE** — duplicate lines and `./src/…` vs `src/…` inflate identical compare rows (and positional + `--files-from` can double the same path)
- **CI / package.json callers:** `package.json` → `check:emit-identity`
- **target files:** `scripts/check-emit-identity.mjs` (`loadFilesFromList` / `parseArgs` merge)
- **measured baseline:** List `src/games/hex/ai.ts` + `./src/games/hex/ai.ts` + dup → 3 files; `runEmitIdentityCheck` → 3 `identical` rows. `parseArgs(['--base','HEAD','--files-from',list,'src/games/hex/ai.ts'])` with list containing the same path → `files` length 2.
- **acceptance criteria:** Normalize leading `./`; dedupe after merge of positionals + `--files-from`; order stable (first wins); no change to compare semantics for a unique relative path.
- **verification commands:** hermetic unit; `rg -n 'loadFilesFromList|files.push' scripts/check-emit-identity.mjs`
- **conflict notes:** list **content** dedupe — not duplicate `--files-from` **flag** (`1381`).
- **screen:** SAFE.

### q-mp-1431 · Docs: CONTRIBUTING Verify must mention blocking `npm audit`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** none; leave CONTRIBUTING PR-base (`1342`) alone
- **series:** docs
- **verdict:** **SAFE** — human verify checklist omits a blocking CI job
- **CI / package.json callers:** none (docs-only); live gate is `.github/workflows/ci.yml` job `audit`
- **target files:** `CONTRIBUTING.md` (Verify before you push)
- **measured baseline:** `rg -n 'audit' CONTRIBUTING.md` → no matches; AGENTS.md + README + `ci.yml` document `npm audit --audit-level=high` as blocking.
- **acceptance criteria:** Verify section lists `npm audit --audit-level=high` (or points at the blocking audit job) alongside verify/unit/e2e/build; no PR-base rewrite; no workflow edits.
- **verification commands:** `rg -n 'npm audit|audit-level' CONTRIBUTING.md AGENTS.md .github/workflows/ci.yml`
- **conflict notes:** audit gate docs only — not CONTRIBUTING tip/PR-base wording.
- **screen:** SAFE.

### q-mp-1432 · Docs: README Branches must not claim all development merges to `alpha`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** serialize after `#1502` / `1406`/`1407` if that PR still touches `README.md`; **not** tip-name pointer remasure
- **series:** docs
- **verdict:** **SAFE** — public Branches line disagrees with CONTRIBUTING + folded wiki Branches (human→`alpha`, agents→living tip drafts)
- **CI / package.json callers:** none (docs-only)
- **target files:** `README.md` (Branches)
- **measured baseline:** `README.md` → `alpha -- trunk. All development merges here.`; wiki Branches (folded `#1494`) already documents tip drafts; CONTRIBUTING says cloud-agent workers draft into the tip.
- **acceptance criteria:** Branches wording matches human/trunk → `alpha` and agent drafts → living `cursor/mp-tip-*` (no tip SHA / unit-count stamps); Status bullet left to `1406`/`1407`.
- **verification commands:** `rg -n 'Branches|All development merges|mp-tip' README.md CONTRIBUTING.md docs/wiki/development.md`
- **conflict notes:** Branches **role** wording only — not Status counts (`1406`/`1407`); not tip-name living-pointer rewrite in AGENTS.
- **screen:** SAFE.

### q-mp-1433 · Docs: wiki Commands bash fence must include scripts the tables cite

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post8f8a`)
- **depends-on:** leave wiki Branches / CI posture alone (bb folded; no soft-pwa CI-posture sibling)
- **series:** docs
- **verdict:** **SAFE** — Commands fence omits real `package.json` scripts that the testing-layers table documents
- **CI / package.json callers:** none (docs-only)
- **target files:** `docs/wiki/development.md` (`## Commands` bash block)
- **measured baseline:** Fence lacks `bench:engines`, bare `test:e2e`, `test:e2e:fullgame`; table rows still cite `npm run bench:engines` and `npm run test:e2e:fullgame`; prose warns about bare `test:e2e` without showing the script; all three exist in `package.json`.
- **acceptance criteria:** Add the three scripts to the Commands fence (with short comments matching peers); no unit-count remasure; no Branches/CI posture rewrite.
- **verification commands:** `rg -n 'bench:engines|test:e2e:fullgame|^npm run test:e2e |^npm test' docs/wiki/development.md package.json`
- **conflict notes:** Commands fence completeness — **not** testing-layers count cells; not PLAYTEST\_\* env table (`1412`); not wiki CI posture.
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict  | Title (short)                                              |
| ----------- | -------- | ---------------------------------------------------------- |
| `q-mp-1428` | **SAFE** | emit-identity: empty `--files-from` must not discover      |
| `q-mp-1429` | **SAFE** | emit-identity: absolute `--files-from` paths               |
| `q-mp-1430` | **SAFE** | emit-identity: dedupe / strip `./` in file lists           |
| `q-mp-1431` | **SAFE** | docs: CONTRIBUTING Verify + blocking `npm audit`           |
| `q-mp-1432` | **SAFE** | docs: README Branches human/alpha vs agent tip             |
| `q-mp-1433` | **SAFE** | docs: wiki Commands fence + bench/e2e/fullgame scripts     |

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
| wiki CI soft `check:pwa-manifest` residual                | wiki Branches/CI posture family exhausted in bc        |
| `partitionOvers` allowlist trim                           | live `knownOvers: []` — no real data hit               |
| `parseMenuCriticalRefs` query-string drop                 | no tip `dist/` proof Vite emits `?v=` — HOLD-CHECK skip |
| runtime-perf / mobile-audit hardcoded `2026-10-07` paths  | exhausted families — do not sibling                    |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Out of scope / not used here

- No `memory/` files
- No CI workflow / permissions edits
- No player-facing copy, rules, scoring, AI search/difficulty/timing
- No Stars & Bars history cap; Hex Hard stays 450ms
- Honest underfill: **6** tasks (ids `1428`–`1433`), not padded to 25
