# Engineering backlog — 2026-10-17bn (tip refill after bm fold / round-66)

**Task id:** `q-mp-090bn`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-postc84fb89` @ `c84fb89d` (full `c84fb89dd2777dc3d90592b9379f7762dfb7b2b6`; living tip cut from `alpha` @ `c84fb89d` after #1559 squash-merge of round-65 workers; tip-owner folded bm SAFE implementers `1501`…`1503` into this tip tree — treat every bm id as already queued; bl `1498`…`1500` / bk `1494`…`1497` / bj `1492`…`1493` already on tip via earlier folds — leave `contained`)  
**Depends on:** tip `cursor/mp-tip-postc84fb89` @ `c84fb89d`. Round-65 backlog (`q-mp-090bm`, ids `q-mp-1501`…`1503`) — leave with `contained` (folded on tip via #1559; open drafts `#1557`/`#1558` vs prior tip `post3c7bf5e` and `#1555` bm backlog vs `post4c24321` are stale — do **not** re-queue bm families or siblings). Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-postc84fb89` @ `c84fb89d` measures unit files **3481**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **4 new** concrete engineering tasks (`q-mp-1504` … `q-mp-1507`) mined from the **live tip tree after the #1559 fold**, checked against prior refills through `q-mp-1503` (bm folded via #1559 — leave `contained`; open `#1555`/`#1557`/`#1558` stale vs prior tip names), bl (`1498`…`1500`), bk (`1494`…`1497`), bj (`1492`…`1493`), bi (`1486`…`1491`), bh (`1478`…`1485`), and the open draft PR list (**none** into `postc84fb89` at audit). It is the **only** deliverable of `q-mp-090bn`.

**Honest count:** **4** tasks (not 25) with measured wrong-results / living-doc tip drift — not padded from exhausted families. Id range starts at `q-mp-1504` per round-66 brief. Round-65 already claimed fab-a-diffy / fraction-pinball `PLAYTEST_BASE` + `127.0.0.1` (`1501`/`1502`), emit OS/editor backups `.old`/`.save`/`.backup` (`1503`) — **do not** re-queue (tip carries those fixes from #1559; open `#1557`/`#1558` are stale). Rounds 62–65 found only 2, 4, 3 and 3 scripts/harness tasks, so this refill **widened** the audit to (a) tests-only gaps for settings/storage/routing/PWA/UI plumbing, (b) real script wrong-results beyond emit tip/backup and playtest host, (c) living-doc tip drift after the #1559 cut. Tests-only scan: settings/storage/routing/PWA/offline dense; scoped zero-name-match exports **0** — **0** tests-only queues. This refill **does not** re-queue exhausted families from the round-65 / round-64 purpose sections: `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-stamp **count** remasure theater, knip remeasure/baselines, AI harness speed / CI-skipped latency benches, license-classifier, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache/chunk/html/health, menu-critical-ref, md-link regex, check-copy-pins **argv/totals remasure theater** / softRe apostrophe / mid-fragment / leading debris / WINDOW_LINES / wins! **keep** / `remaining)` / extract apostrophe / char-class `)` / registry `.not.toMatch` polarity (`1494`), summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas/self_size/truncated/BOM/baseURL, prototype-restore (scrollIntoView/offsetWidth/getContext/ResizeObserver/elementFromPoint), engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep summary **or** `BASE_URL` **or** settle thinking-**class** list (`1491`) **or** multi-class attribute-suffix (`1492`/`1493`), mutation-report games/ARITH/infra/dead/`--max`/dup/flag-like, check-dev-doc-links, probe-offline classify/board/recovered/mount, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest / calla **end matchers** (live product status harvest shows **0** further non-banner false+; do not pad synthetic-only phrases), webkit-offline-probe, artifact-dir **extract/adopters/main-entry/env-trim** / path-**containment** (`1495`), README CI posture/Status counts/lint-ratchet docs / Branches, PATH_RE, PLAYTEST\_\* env docs theater, testing-layers doc **count** rows, hex mutation, flattenKnip, eslint probe, fab/fraction/calibration env parsing, calibration-date whitespace, playtest-seed parse, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep **BASE_URL / game-list / wait-for-thinking poll** (`1482`) / sample selector (`1493`), check-perf waitForUrl/`.mjs`/numeric/BOM, emit-identity minify/base/parseArgs/`++`/`--files-from` **flag** dup/flag-like/merge-base/**empty-list fallthrough**/abs/dedupe/**backslash**/`?`/`#`/NUL/`//`/dirs/ADS/`%&*`/shell/unicode/junk `\extra` / editor backup `~`/`.bak`/`.swp`/`.tmp`/`.orig`/`.rej` (`1497`) / vim secondary `.swo`/`.swn`/`.swx` (`1499`) / OS/editor `.old`/`.save`/`.backup` (`1503` — numbered tilde `~N` residual is **new**) / `DEFAULT_TIP_REMOTE` prior tips (`1500` pinned `post4c24321` then tip moved to `post3c7bf5e` then this cut — living tip **name** remasure after #1559 is **new**), queens fuzz/shards/seed, runLighthouse JSON, waitForGameReady load-error, offline-dev date, report-licenses maps, mapGameChunks, withSeededRandom/oracle thenables, storage-stubs, hex-ui, playtest BASE join/seed URL, type-ratchet phase2/coercion/fail-open, engine-property immutability/shards, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty/dup, playtest OUT date harness stems, reporter BOM, matchMedia restore, ai-calibration winners/OUT, lint/type-ratchet fail-open, env-leak `.mjs`, html poster/srcset, ai-typeonly docs, burn-1007/1008/residual hidden+serviceWorker+visibilityState+onLine+innerWidth restores, polyomino/fab/pent/fiar shards, calla PLAYTEST_BASE (`1374`), fab/fraction **host** (`1501`/`1502` — star-track **env-name** asymmetry is **new**), isHttpResponseReady status, ai-move-time bench OUT date, UTF-8 BOM ingest siblings, wiki Branches/CI posture / Commands fence, CONTRIBUTING PR base **or** audit gate, navigator.connection owl-idle/prefetch restore, calla `blueDuringHva`, AI determinism-a/c/d/e + calibration-difficulty-order shards, par-55/sum-dominoes/ramrod illicit sampling, stars-bars New Game race wait (`1474`), star-track confusing_turn_copy / `You Wins!` (`1475`/`1483`), fab-a-diffy thinking chrome + soft-`ok` (`1484`/`1485`), stars-bars Red→`ai-win` / dead `.status-ai-thinking` metric (`1486`/`1490`), ramrod never-applied thinking class (`1487`), check-copy-pins extractExpectUnit apostrophe / char-class `)` (`1488`/`1489`), console-sweep settle `.sd-computer-thinking` class list (`1491`), living tip pointer prior cuts (`1496`/`1498` — tip-name after #1559 cut to `postc84fb89` is **new**). No NaN/null-coercion micro-fixes unless real data hits them. No tip-stamp **count** remasure of wiki/testing-layers/README Status / copy-pins findings totals. No knip unusedTypes baseline drop. No `partitionOvers` trim theater while live `bundle-budgets.json` `knownOvers` is `[]`.

**Fresh payoffs on this tip (re-measured @ `c84fb89d` after #1559 fold; bm `1501`–`1503` on tip — left alone):** **living tip pointer in `AGENTS.md` + `docs/wiki/development.md` + `.github/copilot-instructions.md` still names `cursor/mp-tip-post3c7bf5e`** after the #1559 cut to `cursor/mp-tip-postc84fb89` @ `c84fb89d` (agents/wiki/copilot point at the prior tip; wiki still cites `3c7bf5e7` / #1556), **`DEFAULT_TIP_REMOTE` is still `origin/cursor/mp-tip-post3c7bf5e`** so `resolveDefaultMergeBase()` returns prior tip `3c7bf5e7…` instead of live tip `c84fb89d` (unit still pins `post3c7bf5e`; comments claim “Living tip”), **`tests/playtest/star-track-deep-playtest.mjs` still reads only `PLAYTEST_BASE_URL`** while calla / fab peers prefer `PLAYTEST_BASE` then `PLAYTEST_BASE_URL` alias (setting `PLAYTEST_BASE` alone is ignored — host already `127.0.0.1`), **`normalizeRepoRelativePath('…ai.ts~1'|~2'|~99')` stays `{ok:true}`** then CLI **MISSING-BASE** / exit **1** (numbered tilde backups; bare `~` already rejected by `1497`). Knip unusedExports still exactly the LEAVE trio (no new zero-importer SAFE demote). Live product status harvest vs `isDeepPlaytestEndStatus`: **0** further non-banner false+ — do not pad synthetic theater. Settings/storage/routing/PWA/UI plumbing already have dense unit + e2e coverage — no honest tests-only gap with measured wrong-results.

**Preference:** SAFE **scripts/** / playtest harness wrong-results fixes, living tip-pointer doc drift after tip cut. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings **totals**, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-stamp **count** cells, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`. AI determinism **further shards** are HOLD-CHECK (tests-only walls; do not thin asserts or change AI). Held ids stay held — **do not sibling**: `q-mp-1309`, `1328`/`1329`/`1330`, `1341`, `1386`/`1390`/`1391`/`1392`, `1460`/`1461`/`1462`, `1469`/`1470`, boundaries / size soft-gate `1201`–`1204` / `1220`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Bb lint/type/boundaries BOM HOLD-CHECK (`1386`/`1390`/`1391`/`1392`) stay prior — **do not** sibling.

## Duplicate check (do not re-queue)

| Topic family                                                                                 | Why skipped                                                                         |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| round-65 bm `1501`–`1503` (+ folded `#1559` / stale `#1555`/`#1557`/`#1558`)                 | leave with `contained`; this refill’s tickets are **new** surfaces only             |
| round-64 bl `1498`–`1500` (+ folded via #1556)                                               | leave with `contained`                                                              |
| round-63 bk `1494`–`1497` / round-62 bj `1492`–`1493`                                        | leave with `contained`                                                              |
| living tip pointer prior cuts (`1496`/`1498`)                                                | tip-name after #1559 cut to `postc84fb89` is **new** (not count remasure)           |
| emit `DEFAULT_TIP_REMOTE` prior tips (`1500`)                                                | living tip **name** remasure after #1559 — **new** target `postc84fb89`             |
| emit bare `~` / `.bak` / swaps / `.old`/`.save`/`.backup` (`1497`/`1499`/`1503`)             | numbered tilde `~N` residual is **new**                                             |
| fab/fraction **host** `localhost`→`127.0.0.1` (`1501`/`1502`)                                | star-track **env-name** (`PLAYTEST_BASE` ignore) is **new** peer-alignment leftover |
| calla `PLAYTEST_BASE` (`1374`) / console-sweep `BASE_URL` host (`1411`)                      | star-track env-name only — not host / not mobile-audit                              |
| mobile-audit `localhost` residual                                                            | exhausted `mobile-audit` / `BASE_URL` family — leave screened                       |
| tip-stamp **count** remasure (wiki unit cells / README Status / copy-pins totals)            | exhausted                                                                           |
| deep-playtest-end / calla end matchers                                                       | live product false+ count **0** — do not pad synthetic-only                         |
| queens fuzz / fab / pent / fiar / polyomino / engine-property shards; AI determinism-a/c/d/e | bf/be HOLD-CHECK `1469`/`1470` / `1460`–`1462` — **do not** sibling                 |
| knip unusedExports LEAVE trio                                                                | no new SAFE demote                                                                  |
| settings/storage/routing/PWA/UI thin-coverage theater                                        | dense coverage; zero-hit scoped exports **0**                                       |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions        | hard-rule HOLD                                                                      |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `c84fb89d`)

| Id                                   | Title (short)                                 | Verdict                                                | Evidence @ `c84fb89d`                                        |
| ------------------------------------ | --------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| `q-mp-090bm` / `#1555`               | round-65 backlog                              | **folded on tip** via #1559 (PR open vs prior tip)     | This refill starts at `1504`; do not re-queue `1501`–`1503`. |
| `#1557`/`#1558`                      | bm SAFE implementers (`1503` / `1501`+`1502`) | **folded on tip** (open drafts stale vs `post3c7bf5e`) | Leave with `contained` / `superseded`.                       |
| `q-mp-090bl` / `#1553` / `#1554`     | round-64 + emit implementer                   | **folded on tip** via #1556                            | Leave with `contained`.                                      |
| `q-mp-090bk` / `#1549`–`#1552`       | round-63 + implementers                       | **folded on tip** via #1548                            | Leave with `contained`.                                      |
| `q-mp-090bj` / `#1546` / `#1547`     | round-62 + implementer                        | **folded on tip** via #1548                            | Leave with `contained`.                                      |
| `q-mp-1469`/`1470`                   | bf HOLD-CHECK AI shards                       | **queued in bf; do not sibling**                       | Leave prior ids.                                             |
| `q-mp-1460`/`1461`/`1462`            | be HOLD-CHECK AI shards                       | **queued in be; do not sibling**                       | Leave prior ids.                                             |
| `q-mp-1386`/`1390`/`1391`/`1392`     | bb HOLD-CHECK ratchet BOM                     | **queued in bb; no tip PR yet**                        | Leave prior ids — **do not** sibling.                        |
| `q-mp-1201`…`1204` / `1220`          | boundaries + size soft-gate                   | **still-valid; no tip PR yet**                         | Leave prior ids — **do not** re-queue.                       |
| `q-mp-1309` / `1328`–`1330` / `1341` | held ids                                      | **still held**                                         | Do not sibling.                                              |
| knip unusedExports                   | live `--json`                                 | **3 LEAVE**                                            | No new SAFE demote.                                          |
| Open drafts into `postc84fb89`       | `gh pr list`                                  | **none**                                               | This backlog is the first postc84fb89 refill.                |

## Shared-file conflict flags

| Shared file                                                                  | Conflicting new ids                                                                        |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `AGENTS.md` + `docs/wiki/development.md` + `.github/copilot-instructions.md` | `1504` only; leave wiki **count** cells / Status remasure alone                            |
| `scripts/check-emit-identity.mjs` (`DEFAULT_TIP_REMOTE`)                     | `1505` only; serialize before `1507` if sharing emit-identity; leave path junk alone       |
| `tests/playtest/star-track-deep-playtest.mjs`                                | `1506` only; leave confusing_turn / `You Wins!` (`1475`/`1483`) alone                      |
| `docs/dev/testing-layers-2026-10-09.md` (env table)                          | update with `1506` (star-track row only); leave **count** rows alone                       |
| `scripts/check-emit-identity.mjs` (`EDITOR_BACKUP_SUFFIX_RE`)                | `1507` only; serialize after `1505` if sharing file; leave bare `~` / listed backups alone |

**Parallel-friendly:** `1504` ∥ `1506`. Serialize `1505`→`1507` if one worker owns emit-identity (shared file). Prefer landing `1504` tip-pointer early so later workers target the live tip name.

## Live tip measurements (evidence snapshot @ `c84fb89d`)

```text
$ git rev-parse HEAD
  c84fb89dd2777dc3d90592b9379f7762dfb7b2b6

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3481

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ # living tip pointer drift (after #1559 cut):
$ AGENTS.md tip → cursor/mp-tip-post3c7bf5e
$ docs/wiki/development.md Live tip → cursor/mp-tip-post3c7bf5e @ 3c7bf5e7
$ .github/copilot-instructions.md → cursor/mp-tip-post3c7bf5e
$ live branch / HEAD → cursor/mp-tip-postc84fb89 @ c84fb89d

$ # DEFAULT_TIP_REMOTE (resolveDefaultMergeBase):
$ DEFAULT_TIP_REMOTE → origin/cursor/mp-tip-post3c7bf5e
$ resolveDefaultMergeBase() → 3c7bf5e7dbad19e5e633ce1183d8e7a8f9de4504
$ resolveDefaultMergeBase({ tipRemote: 'origin/cursor/mp-tip-postc84fb89' }) → c84fb89d…
$ unit assert still expects DEFAULT_TIP_REMOTE === 'origin/cursor/mp-tip-post3c7bf5e'

$ # star-track env-name residual vs peers:
$ star-track BASE → PLAYTEST_BASE_URL ?? http://127.0.0.1:5173  (ignores PLAYTEST_BASE)
$ calla / fab → PLAYTEST_BASE || PLAYTEST_BASE_URL || http://127.0.0.1:5173
$ PLAYTEST_BASE=http://peer-convention.test:9999 → star stays 127.0.0.1; peer uses peer-convention

$ # emit numbered tilde backups (normalizeRepoRelativePath / CLI):
$ …ai.ts~1 / ~2 / ~99 → { ok: true } then CLI MISSING-BASE exit 1
$ …ai.ts~ → { ok: false } invalid characters exit 2  (1497)
$ …ai.ts.~1~ → { ok: false } invalid characters exit 2  (# already PATH_JUNK / ~ ends)
$ clean twin src/games/hex/ai.ts → OK exit 0

$ Open drafts into cursor/mp-tip-postc84fb89 at audit: none
$ Live product status harvest vs isDeepPlaytestEndStatus: 0 non-banner false+
$ settings/storage/routing/PWA/UI: zero-hit scoped exports = 0 (tests-only gate not met)
$ mobile-audit still localhost:5173 — screened (exhausted mobile-audit / BASE_URL family)
$ knownOvers: [] — no partitionOvers trim theater
```

Baselines also under `/opt/cursor/artifacts/r66-summary.txt` / `r66-knip-raw.txt` / `r66-e2e-list.txt`.

## New tasks

### q-mp-1504 · Docs: living tip pointer AGENTS + wiki + copilot must name `cursor/mp-tip-postc84fb89`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc84fb89`)
- **depends-on:** none; leave wiki **unit/e2e count** cells / README Status remasure alone; supersedes prior pointer targets (`1496`/`1498` / tip-local `post3c7bf5e` stamp)
- **series:** tip-docs
- **verdict:** **SAFE** — living tip-name drift after #1559 cut (not count remasure theater)
- **CI / package.json callers:** none (docs only); `npm run check:dev-docs` should stay green
- **target files:** `AGENTS.md` (Purpose + Draft PR into tip bullets); `docs/wiki/development.md` (Live tip paragraph only); `.github/copilot-instructions.md` (Target tip bullet — same re-anchor surface tip-owner used in prior cuts)
- **measured baseline:** Live HEAD is `cursor/mp-tip-postc84fb89` @ `c84fb89dd2777dc3d90592b9379f7762dfb7b2b6`. `AGENTS.md` still says tip is `cursor/mp-tip-post3c7bf5e` (2 places). Wiki Live tip paragraph still says `cursor/mp-tip-post3c7bf5e` @ `3c7bf5e7` after #1556. Copilot instructions still target `post3c7bf5e`. Agents reading AGENTS open drafts against the **prior** tip.
- **acceptance criteria:** All three files name `cursor/mp-tip-postc84fb89` (and wiki cites tip SHA `c84fb89d` / full SHA optional; prose may note #1559 cut); do **not** rewrite wiki unit/e2e **count** tables or README Status counts; `npx prettier --check` on touched docs; `npm run check:dev-docs` exit 0.
- **verification commands:** `rg -n 'mp-tip-post' AGENTS.md docs/wiki/development.md .github/copilot-instructions.md`; `npx prettier --check AGENTS.md docs/wiki/development.md .github/copilot-instructions.md`; `npm run check:dev-docs`
- **conflict notes:** tip-name after tip cut — **not** tip-stamp count remasure (exhausted); not CONTRIBUTING audit gate; not Branches fence; not prior `1498` remasure of `post4c24321`.
- **screen:** SAFE.

### q-mp-1505 · Scripts: emit-identity `DEFAULT_TIP_REMOTE` must track living tip `cursor/mp-tip-postc84fb89`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc84fb89`)
- **depends-on:** serialize before `1507` if sharing emit-identity; leave path-junk / editor-backup gates alone; leave tip-docs `1504` alone (docs vs script constant)
- **series:** script-tooling
- **verdict:** **SAFE** — default `--base` merge-base prefers a retired tip remote over the living tip (wrong living-tip classification; same class as prior `q-mp-1357` / `q-mp-1500`)
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local / optional CI helper)
- **target files:** `scripts/check-emit-identity.mjs` (`DEFAULT_TIP_REMOTE` + stale “Living tip …” comments ~L38 / ~L1022); unit under `tests/unit/check-emit-identity.test.ts` (asserts currently pin `origin/cursor/mp-tip-post3c7bf5e`)
- **measured baseline:** `DEFAULT_TIP_REMOTE === 'origin/cursor/mp-tip-post3c7bf5e'`. `resolveDefaultMergeBase()` → `3c7bf5e7dbad19e5e633ce1183d8e7a8f9de4504`. With `tipRemote: 'origin/cursor/mp-tip-postc84fb89'` → `c84fb89d…`. AGENTS (even stale) and live tip name `postc84fb89`, not `post3c7bf5e` — comments are false. Unit hermetic stubs key on `merge-base HEAD origin/cursor/mp-tip-post3c7bf5e`.
- **acceptance criteria:** `DEFAULT_TIP_REMOTE` is `origin/cursor/mp-tip-postc84fb89` (or otherwise resolves default merge-base to the living tip SHA); comments match AGENTS/live tip; hermetic unit updated; `resolveDefaultMergeBase()` on tip returns live tip merge-base; no product / AI / path-junk edits.
- **verification commands:** hermetic unit; `node --input-type=module -e "import {DEFAULT_TIP_REMOTE,resolveDefaultMergeBase} from './scripts/check-emit-identity.mjs'; …"`; `rg -n 'DEFAULT_TIP_REMOTE|mp-tip-post3c7bf5e|mp-tip-postc84fb89' scripts/check-emit-identity.mjs tests/unit/check-emit-identity.test.ts`
- **conflict notes:** living-tip constant drift — not tip-stamp count remasure; not docs-only `1504`; not numbered-tilde `1507`; not retired-wave5 invent-DIFF theater beyond updating the constant.
- **screen:** SAFE.

### q-mp-1506 · Scripts: star-track deep playtest must prefer `PLAYTEST_BASE` (calla/fab peer shape)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc84fb89`)
- **depends-on:** leave confusing_turn / `You Wins!` (`1475`/`1483`) alone; leave fab/fraction **host** (`1501`/`1502`) alone; optional testing-layers env-table row update with this fix
- **series:** script-tooling
- **verdict:** **SAFE** — harness env-name honesty; host already `127.0.0.1`; peers already prefer `PLAYTEST_BASE`
- **CI / package.json callers:** none (local playtest harness under `tests/playtest/`; no npm alias)
- **target files:** `tests/playtest/star-track-deep-playtest.mjs` (`BASE` + header env docs); optionally `docs/dev/testing-layers-2026-10-09.md` star-track env-table row only
- **measured baseline:** Live tip `const BASE = process.env.PLAYTEST_BASE_URL ?? 'http://127.0.0.1:5173'` — ignores `PLAYTEST_BASE`. Calla / fab peers use `PLAYTEST_BASE` then `PLAYTEST_BASE_URL` alias then `http://127.0.0.1:5173`. With only `PLAYTEST_BASE=http://peer-convention.test:9999` set, star-track stays on default `127.0.0.1:5173` while peers honor the env. Testing-layers table currently documents star-track → `PLAYTEST_BASE_URL` only (tip-true today; update with the code fix).
- **acceptance criteria:** Prefer `PLAYTEST_BASE` with `PLAYTEST_BASE_URL` alias (calla/fab-shaped); keep default host `http://127.0.0.1:5173`; header/docs strings match; hermetic or source assert acceptable; **no** product / AI / rules edits; testing-layers star-track row updated if touched.
- **verification commands:** `rg -n 'PLAYTEST_BASE|127\\.0\\.0\\.1:5173' tests/playtest/star-track-deep-playtest.mjs docs/dev/testing-layers-2026-10-09.md`; compare to `scripts/calla-deep-playtest.mjs` / `tests/playtest/fab-a-diffy-deep.mjs` BASE blocks
- **conflict notes:** residual after fab/fraction host (`1501`/`1502`) — env-name only, not host; not PLAYTEST\_\* env docs rewrite of all harnesses; not star-track confusing_turn / `You Wins!`.
- **screen:** SAFE.

### q-mp-1507 · Scripts: emit-identity must reject numbered tilde backups (`~1` `~N`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-postc84fb89`)
- **depends-on:** serialize after `1505` if sharing emit-identity; leave bare `~` / `.bak` / swaps / `.old`/`.save`/`.backup` (`1497`/`1499`/`1503`) and shell/unicode/`\extra` alone
- **series:** script-tooling
- **verdict:** **SAFE** — same false-missing-base class as prior backup rejects; new numbered-tilde set
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local / optional CI helper)
- **target files:** `scripts/check-emit-identity.mjs` (`EDITOR_BACKUP_SUFFIX_RE` / `pathHasEditorBackupSuffix`); unit under `tests/unit/*emit-identity*`
- **measured baseline:** `normalizeRepoRelativePath('src/games/hex/ai.ts~1'|~2'|~99')` → `{ok:true}` with junk retained → CLI **MISSING-BASE** / exit **1**. Twin bare `…ai.ts~` → `{ok:false}` invalid-characters / exit **2** (`1497`). Emacs `…ai.ts.~1~` already `{ok:false}` (PATH_JUNK / trailing `~`). Clean twin `src/games/hex/ai.ts` → OK exit **0**. Current regex anchors bare `~$` so numbered `~N` slips through.
- **acceptance criteria:** Reject at normalize with clear invalid-characters (exit **2**), not false missing-base; hermetic unit covering `~1`/`~2`/`~99` + retained bare `~` control; no product edits; do not reopen `DEFAULT_TIP_REMOTE`.
- **verification commands:** hermetic unit; CLI `--files-from` with `…ai.ts~1` line exits **2**; `rg -n 'EDITOR_BACKUP_SUFFIX_RE|~\\\\d|pathHasEditorBackupSuffix' scripts/check-emit-identity.mjs`
- **conflict notes:** extends editor-backup class beyond `1497`/`1499`/`1503` — serialize after `1505` if shared file; not tip-remote (`1505`); not minify/base/parseArgs flag theater; do **not** pad unrelated `.bak1`/`.copy` theater unless the same PR cheaply widens the same regex with measured fixtures.
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict  | Title (short)                                                                  |
| ----------- | -------- | ------------------------------------------------------------------------------ |
| `q-mp-1504` | **SAFE** | docs: AGENTS + wiki + copilot living tip pointer → `cursor/mp-tip-postc84fb89` |
| `q-mp-1505` | **SAFE** | emit-identity: `DEFAULT_TIP_REMOTE` must track living tip `postc84fb89`        |
| `q-mp-1506` | **SAFE** | star-track deep: prefer `PLAYTEST_BASE` (calla/fab peer shape)                 |
| `q-mp-1507` | **SAFE** | emit-identity: reject numbered tilde backups (`~1` / `~N`)                     |

**Screened HOLD-CHECK (not queued — leave prior posture / tip-owner):**

| Topic                                                     | Why not queued                                         |
| --------------------------------------------------------- | ------------------------------------------------------ |
| bf AI shards `1469`/`1470`                                | queued in bf — do not sibling                          |
| be AI shards `1460`/`1461`/`1462`                         | queued in be — do not sibling                          |
| bb ratchet BOM HOLD-CHECK `1386`/`1390`/`1391`/`1392`     | queued in bb — do not sibling                          |
| `check-boundaries` `stripComments` / typeOnly / DOM_IDENT | prior HOLD-CHECK `1201`–`1204`/`1220` — do not sibling |
| lint/type ratchet fail-open (`1328`–`1330`)               | ay HOLD-CHECK — leave prior                            |
| knip LEAVE trio demote / unusedTypes baseline 36→29       | no SAFE demote / knip remasure theater                 |
| `partitionOvers` allowlist trim                           | live `knownOvers: []` — no real data hit               |
| wiki / README / testing-layers **count** cells            | tip-stamp count remasure — exhausted                   |
| bm fab/fraction host / emit `.old`/`.save`/`.backup`      | folded via #1559 — leave `contained`                   |
| mobile-audit still `localhost:5173`                       | exhausted `mobile-audit` / `BASE_URL` family           |
| fab / ramrod **product** thinking chrome                  | HOLD / leave `#422`-style alone                        |
| synthetic deep-playtest-end phrases                       | live product false+ **0** — do not pad                 |
| settings/storage/routing/PWA thin-coverage theater        | dense coverage already; no measured wrong-results      |
| emit `.bak1` / `.copy` false-MISSING-BASE                 | screened — do not pad beyond numbered-tilde residual   |
| offline-probe `#frag` / `.mjs` classify micro-edges       | no live failed-request data hit — do not pad           |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Knip unusedExports (round-66)

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
- Honest underfill: **4** tasks (ids `1504`–`1507`), not padded to 25
