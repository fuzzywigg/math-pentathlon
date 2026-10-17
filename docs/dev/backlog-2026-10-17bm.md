# Engineering backlog — 2026-10-17bm (tip refill after bl queue / round-65)

**Task id:** `q-mp-090bm`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post4c24321` @ `4c243214` (full `4c243214c7f90f67c661cc4b779a73060d169b29`; living tip cut from `alpha` after #1548 squash-merge of round-62–63 `#1546`–`#1552`; tip-owner folded bj/bk SAFE implementers `1492`…`1495`/`1497` into this tip tree — treat every bj/bk id as already queued; round-64 bl ids `q-mp-1498`…`1500` live in open draft `#1553` + implementer `#1554` into this tip — treat every bl id as already queued)  
**Depends on:** tip `cursor/mp-tip-post4c24321` @ `4c243214`. Round-64 backlog (`q-mp-090bl`, ids `q-mp-1498`…`1500`) — leave with `contained` (open draft `#1553` + implementer `#1554` covering `1499`/`1500`; `1498` tip-pointer still open in `#1553` — do **not** re-queue bl families or siblings). Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post4c24321` @ `4c243214` measures unit files **3481**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **3 new** concrete engineering tasks (`q-mp-1501` … `q-mp-1503`) mined from the **live tip tree after the #1548 fold**, checked against prior refills through `q-mp-1500` (bl draft `#1553` + implementer `#1554` into this tip — leave `contained`), bk (`1494`…`1497`), bj (`1492`…`1493`), bi (`1486`…`1491`), bh (`1478`…`1485`), and the open draft PR list (`#1553` + `#1554` into `post4c24321`). It is the **only** deliverable of `q-mp-090bm`.

**Honest count:** **3** tasks (not 25) with measured wrong-results / harness host drift — not padded from exhausted families. Id range starts at `q-mp-1501` per round-65 brief. Round-64 already claimed living tip pointer AGENTS/wiki/copilot → `post4c24321` (`1498`), emit vim secondary swaps `.swo`/`.swn`/`.swx` (`1499`), emit `DEFAULT_TIP_REMOTE` → living tip (`1500`) — **do not** re-queue (open `#1553`/`#1554` are covering them now). Rounds 62, 63 and 64 found only 2, 4 and 3 scripts/harness tasks, so this refill **widened** the audit to (a) tests-only gaps for settings/storage/routing/PWA/UI plumbing, (b) real script wrong-results beyond emit tip/secondary-swap, (c) living-doc tip drift and playtest host residuals after peer harness IPv4 migration. Tests-only scan: settings/storage/routing/PWA/offline dense; scoped zero-name-match leftovers are AI-worker / board-3d / expressions (HOLD or already covered) — **0** tests-only queues. This refill **does not** re-queue exhausted families from the round-64 / round-63 purpose sections: `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-stamp **count** remasure theater, knip remeasure/baselines, AI harness speed / CI-skipped latency benches, license-classifier, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache/chunk/html/health, menu-critical-ref, md-link regex, check-copy-pins **argv/totals remasure theater** / softRe apostrophe / mid-fragment / leading debris / WINDOW_LINES / wins! **keep** / `remaining)` / extract apostrophe / char-class `)` / registry `.not.toMatch` polarity (`1494`), summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas/self_size/truncated/BOM/baseURL, prototype-restore (scrollIntoView/offsetWidth/getContext/ResizeObserver/elementFromPoint), engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep summary **or** `BASE_URL` **or** settle thinking-**class** list (`1491`) **or** multi-class attribute-suffix (`1492`/`1493`), mutation-report games/ARITH/infra/dead/`--max`/dup/flag-like, check-dev-doc-links, probe-offline classify/board/recovered/mount, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest / calla **end matchers** (live product status harvest shows **0** further non-banner false+; do not pad synthetic-only phrases), webkit-offline-probe, artifact-dir **extract/adopters/main-entry/env-trim** / path-**containment** (`1495`), README CI posture/Status counts/lint-ratchet docs / Branches, PATH_RE, PLAYTEST\_\* env docs theater, testing-layers doc **count** rows, hex mutation, flattenKnip, eslint probe, fab/fraction/calibration env parsing, calibration-date whitespace, playtest-seed parse, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep **BASE_URL / game-list / wait-for-thinking poll** (`1482`) / sample selector (`1493`), check-perf waitForUrl/`.mjs`/numeric/BOM, emit-identity minify/base/parseArgs/`++`/`--files-from` **flag** dup/flag-like/merge-base/**empty-list fallthrough**/abs/dedupe/**backslash**/`?`/`#`/NUL/`//`/dirs/ADS/`%&*`/shell/unicode/junk `\extra` / editor backup `~`/`.bak`/`.swp`/`.tmp`/`.orig`/`.rej` (`1497`) / vim secondary `.swo`/`.swn`/`.swx` (`1499` — OS/editor `.old`/`.save`/`.backup` are **new**) / `DEFAULT_TIP_REMOTE` (`1500`), queens fuzz/shards/seed, runLighthouse JSON, waitForGameReady load-error, offline-dev date, report-licenses maps, mapGameChunks, withSeededRandom/oracle thenables, storage-stubs, hex-ui, playtest BASE join/seed URL, type-ratchet phase2/coercion/fail-open, engine-property immutability/shards, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty/dup, playtest OUT date harness stems, reporter BOM, matchMedia restore, ai-calibration winners/OUT, lint/type-ratchet fail-open, env-leak `.mjs`, html poster/srcset, ai-typeonly docs, burn-1007/1008/residual hidden+serviceWorker+visibilityState+onLine+innerWidth restores, polyomino/fab/pent/fiar shards, calla PLAYTEST_BASE (`1374` — fab/fraction-pinball **host** residuals are **new**), isHttpResponseReady status, ai-move-time bench OUT date, UTF-8 BOM ingest siblings, wiki Branches/CI posture / Commands fence, CONTRIBUTING PR base **or** audit gate, navigator.connection owl-idle/prefetch restore, calla `blueDuringHva`, AI determinism-a/c/d/e + calibration-difficulty-order shards, par-55/sum-dominoes/ramrod illicit sampling, stars-bars New Game race wait (`1474`), star-track confusing_turn_copy / `You Wins!` (`1475`/`1483`), fab-a-diffy thinking chrome + soft-`ok` (`1484`/`1485`), stars-bars Red→`ai-win` / dead `.status-ai-thinking` metric (`1486`/`1490`), ramrod never-applied thinking class (`1487`), check-copy-pins extractExpectUnit apostrophe / char-class `)` (`1488`/`1489`), console-sweep settle `.sd-computer-thinking` class list (`1491`), living tip pointer → `post4c24321` (`1498`). No NaN/null-coercion micro-fixes unless real data hits them. No tip-stamp **count** remasure of wiki/testing-layers/README Status / copy-pins findings totals. No knip unusedTypes baseline drop. No `partitionOvers` trim theater while live `bundle-budgets.json` `knownOvers` is `[]`.

**Fresh payoffs on this tip (re-measured @ `4c243214` after #1548 fold; bl `1498`–`1500` open/implementing — left alone):** **`tests/playtest/fab-a-diffy-deep.mjs` still defaults `PLAYTEST_BASE_URL` → `http://localhost:5173`** while calla / ramrod / par-55 / stars-bars / sum-dominoes use `PLAYTEST_BASE` (+ optional `PLAYTEST_BASE_URL` alias) → `http://127.0.0.1:5173` (live `getent ahosts localhost` lists `::1` before `127.0.0.1`; Vite peers bind IPv4), **`docs/playtest/fraction-pinball-deep-playtest.mjs` already reads `PLAYTEST_BASE` but still defaults `http://localhost:5173`**, **`normalizeRepoRelativePath('…ai.ts.old'|'.save'|'.backup')` stays `{ok:true}`** then CLI **MISSING-BASE** / exit **1** (OS/editor backup suffixes; `.swp` already rejected by `1497`; `.swo`/`.swn`/`.swx` owned by open `1499`). Knip unusedExports still exactly the LEAVE trio (no new zero-importer SAFE demote). Live product status harvest vs `isDeepPlaytestEndStatus`: **0** further non-banner false+ — do not pad synthetic theater. Settings/storage/routing/PWA/UI plumbing already have dense unit + e2e coverage — no honest tests-only gap with measured wrong-results.

**Preference:** SAFE **scripts/** / playtest harness wrong-results fixes. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings **totals**, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-stamp **count** cells, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`. AI determinism **further shards** are HOLD-CHECK (tests-only walls; do not thin asserts or change AI). Held ids stay held — **do not sibling**: `q-mp-1309`, `1328`/`1329`/`1330`, `1341`, `1386`/`1390`/`1391`/`1392`, `1460`/`1461`/`1462`, `1469`/`1470`, boundaries / size soft-gate `1201`–`1204` / `1220`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Bb lint/type/boundaries BOM HOLD-CHECK (`1386`/`1390`/`1391`/`1392`) stay prior — **do not** sibling.

## Duplicate check (do not re-queue)

| Topic family                                                                                 | Why skipped                                                                  |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| round-64 bl `1498`–`1500` (+ `#1553` / implementer `#1554`)                                  | leave with `contained`; this refill’s tickets are **new** surfaces only      |
| round-63 bk `1494`–`1497` (+ folded `#1548` / stale open drafts)                             | leave with `contained`                                                       |
| round-62 bj `1492`–`1493` (+ folded `#1548`)                                                 | leave with `contained`                                                       |
| living tip pointer AGENTS/wiki/copilot (`1498`)                                              | open in `#1553` — left alone                                                 |
| emit `.swo`/`.swn`/`.swx` + `DEFAULT_TIP_REMOTE` (`1499`/`1500`)                             | open `#1554` — left alone; `.old`/`.save`/`.backup` are **new** residual     |
| calla `PLAYTEST_BASE` (`1374`) / console-sweep `BASE_URL` host (`1411`)                      | fab + fraction-pinball **host** residuals are **new** peer-harness leftovers |
| mobile-audit `localhost` residual                                                            | `mobile-audit` / console-sweep `BASE_URL` family exhausted — leave screened  |
| tip-stamp **count** remasure (wiki unit cells / README Status / copy-pins totals)            | exhausted                                                                    |
| deep-playtest-end / calla end matchers                                                       | live product false+ count **0** — do not pad synthetic-only                  |
| queens fuzz / fab / pent / fiar / polyomino / engine-property shards; AI determinism-a/c/d/e | bf/be HOLD-CHECK `1469`/`1470` / `1460`–`1462` — **do not** sibling          |
| knip unusedExports LEAVE trio                                                                | no new SAFE demote                                                           |
| settings/storage/routing/PWA/UI thin-coverage theater                                        | dense coverage; zero-hit scoped exports **0**                                |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions        | hard-rule HOLD                                                               |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `4c243214`)

| Id                                   | Title (short)                               | Verdict                                            | Evidence @ `4c243214`                                        |
| ------------------------------------ | ------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| `q-mp-090bl` / `#1553`               | round-64 backlog                            | **open draft vs tip** (ids not folded yet)         | This refill starts at `1501`; do not re-queue `1498`–`1500`. |
| `#1554`                              | bl SAFE implementer (`1499`+`1500`)         | **open draft (implementing now)**                  | Leave with `contained`.                                      |
| `q-mp-1498`                          | tip pointer → `post4c24321`                 | **queued in bl; not implemented yet**              | Leave `#1553` — do not sibling.                              |
| `q-mp-090bk` / `#1549`               | round-63 backlog                            | **folded on tip** via #1548                        | Leave with `contained`.                                      |
| `#1550`/`#1551`/`#1552`              | bk SAFE implementers (`1495`/`1497`/`1494`) | **folded on tip** (open drafts stale vs prior tip) | Leave with `contained` / `superseded`.                       |
| `q-mp-090bj` / `#1546` / `#1547`     | round-62 + implementer                      | **folded on tip** via #1548                        | Leave with `contained`.                                      |
| `q-mp-1469`/`1470`                   | bf HOLD-CHECK AI shards                     | **queued in bf; do not sibling**                   | Leave prior ids.                                             |
| `q-mp-1460`/`1461`/`1462`            | be HOLD-CHECK AI shards                     | **queued in be; do not sibling**                   | Leave prior ids.                                             |
| `q-mp-1386`/`1390`/`1391`/`1392`     | bb HOLD-CHECK ratchet BOM                   | **queued in bb; no tip PR yet**                    | Leave prior ids — **do not** sibling.                        |
| `q-mp-1201`…`1204` / `1220`          | boundaries + size soft-gate                 | **still-valid; no tip PR yet**                     | Leave prior ids — **do not** re-queue.                       |
| `q-mp-1309` / `1328`–`1330` / `1341` | held ids                                    | **still held**                                     | Do not sibling.                                              |
| knip unusedExports                   | live `--json`                               | **3 LEAVE**                                        | No new SAFE demote.                                          |
| Open drafts into `post4c24321`       | `gh pr list`                                | **`#1553` + `#1554`**                              | Already covering `1498`–`1500`; this backlog is next refill. |

## Shared-file conflict flags

| Shared file                                           | Conflicting new ids                                                                                 |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `tests/playtest/fab-a-diffy-deep.mjs`                 | `1501` only; leave open fab thinking/soft-`ok` (`1484`/`1485`) / fab-env alone                      |
| `docs/playtest/fraction-pinball-deep-playtest.mjs`    | `1502` only; leave calibration/env-number theater alone                                             |
| `docs/dev/testing-layers-2026-10-09.md` (env table)   | update with `1501`/`1502` (or serialize after both); leave **count** rows alone                     |
| `scripts/check-emit-identity.mjs` (`EDITOR_BACKUP_*`) | `1503` only; serialize after open `#1554` (`1499`) folds; leave `DEFAULT_TIP_REMOTE` (`1500`) alone |

**Parallel-friendly:** `1501` ∥ `1502`. Serialize `1503` after `#1554` / `1499` on `EDITOR_BACKUP_SUFFIX_RE`. Prefer landing harness host fixes before testing-layers row polish.

## Live tip measurements (evidence snapshot @ `4c243214`)

```text
$ git rev-parse HEAD
  4c243214c7f90f67c661cc4b779a73060d169b29

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3481

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run report:knip -- --json
  unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ # bl surfaces open/implementing (do not re-queue):
$ AGENTS/wiki/copilot tip → cursor/mp-tip-post3af3000   # 1498
$ DEFAULT_TIP_REMOTE → origin/cursor/mp-tip-post38d2    # 1500
$ …ai.ts.swo/.swn/.swx → MISSING-BASE exit 1            # 1499
$ open drafts into tip: #1553 (bl backlog), #1554 (1499+1500)

$ # fab / fraction host residuals vs peers:
$ fab-a-diffy-deep BASE → PLAYTEST_BASE_URL || http://localhost:5173
$ fraction-pinball-deep BASE → PLAYTEST_BASE || http://localhost:5173
$ calla / ramrod / par-55 / stars-bars / sum → PLAYTEST_BASE (+ alias) || http://127.0.0.1:5173
$ getent ahosts localhost → ::1 first, then 127.0.0.1

$ # emit OS/editor backups (normalizeRepoRelativePath / CLI):
$ …ai.ts.old / .save / .backup → { ok: true } then CLI MISSING-BASE exit 1
$ …ai.ts.swp → { ok: false } invalid characters exit 2  (1497)
$ …ai.ts.swo → { ok: true } MISSING-BASE exit 1         (1499 open)
$ clean twin src/games/hex/ai.ts → OK exit 0

$ Live product status harvest vs isDeepPlaytestEndStatus: 0 non-banner false+
$ settings/storage/routing/PWA/UI: zero-hit scoped exports = 0 (tests-only gate not met)
$ mobile-audit still localhost:5173 — screened (exhausted mobile-audit / BASE_URL family)
```

Baselines also under `/opt/cursor/artifacts/r65-summary.txt` / `r65-knip-raw.txt` / `r65-e2e-list.txt`.

## New tasks

### q-mp-1501 · Scripts: fab-a-diffy deep playtest must default `PLAYTEST_BASE` + `127.0.0.1` (like calla)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post4c24321`)
- **depends-on:** leave open fab thinking chrome / soft-`ok` (`1484`/`1485`) alone; leave calla `PLAYTEST_BASE` (`1374`) alone; optional testing-layers env-table row update with this fix
- **series:** script-tooling
- **verdict:** **SAFE** — harness host honesty; peer deep-playtests already on IPv4 loopback after calla migration
- **CI / package.json callers:** none (local playtest harness under `tests/playtest/`; no npm alias)
- **target files:** `tests/playtest/fab-a-diffy-deep.mjs` (`BASE` + header env docs); optionally `docs/dev/testing-layers-2026-10-09.md` fab env-table row only
- **measured baseline:** Live tip `const BASE = process.env.PLAYTEST_BASE_URL \|\| 'http://localhost:5173'`. Calla peer uses `PLAYTEST_BASE` then `PLAYTEST_BASE_URL` alias then `http://127.0.0.1:5173`. Ramrod / par-55 / stars-bars / sum-dominoes same IPv4 default. `getent ahosts localhost` lists `::1` before `127.0.0.1`. Testing-layers table currently documents fab → `PLAYTEST_BASE_URL` / `localhost:5173` (tip-true today; update with the code fix).
- **acceptance criteria:** Default base is `http://127.0.0.1:5173`; prefer `PLAYTEST_BASE` with `PLAYTEST_BASE_URL` alias (calla-shaped); header/docs strings match; hermetic or source assert acceptable; **no** product / AI / rules edits; testing-layers fab row updated if touched.
- **verification commands:** `rg -n 'PLAYTEST_BASE|localhost:5173|127\\.0\\.0\\.1:5173' tests/playtest/fab-a-diffy-deep.mjs docs/dev/testing-layers-2026-10-09.md`; compare to `scripts/calla-deep-playtest.mjs` BASE block
- **conflict notes:** residual after calla `PLAYTEST_BASE` (`1374`) — not fab thinking/soft-`ok` (`1484`/`1485`); not fraction host (`1502`); not mobile-audit exhausted family.
- **screen:** SAFE.

### q-mp-1502 · Scripts: fraction-pinball deep playtest must default `http://127.0.0.1:5173`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post4c24321`)
- **depends-on:** leave fab (`1501`) alone; leave fraction/calibration env-number theater alone; optional testing-layers env-table row update with this fix
- **series:** script-tooling
- **verdict:** **SAFE** — same IPv4 loopback host honesty; env name already `PLAYTEST_BASE`
- **CI / package.json callers:** none (local harness under `docs/playtest/`)
- **target files:** `docs/playtest/fraction-pinball-deep-playtest.mjs` (`BASE` + header); optionally `docs/dev/testing-layers-2026-10-09.md` fraction-pinball env-table row only
- **measured baseline:** Live tip `const BASE = process.env.PLAYTEST_BASE \|\| 'http://localhost:5173'` (env name already correct; host still `localhost`). Testing-layers row documents `PLAYTEST_BASE` / `localhost:5173`. Peer scripts default `127.0.0.1:5173`.
- **acceptance criteria:** Default base is `http://127.0.0.1:5173`; keep `PLAYTEST_BASE`; header/docs match; testing-layers fraction row updated if touched; **no** product edits.
- **verification commands:** `rg -n 'PLAYTEST_BASE|localhost:5173|127\\.0\\.0\\.1:5173' docs/playtest/fraction-pinball-deep-playtest.mjs docs/dev/testing-layers-2026-10-09.md`
- **conflict notes:** host residual only — not fab env-name+host (`1501`); not PLAYTEST\_\* env docs theater rewrite of all harnesses.
- **screen:** SAFE.

### q-mp-1503 · Scripts: emit-identity must reject OS/editor backup suffixes (`.old` `.save` `.backup`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post4c24321`)
- **depends-on:** serialize after open `#1554` / `1499` (shared `EDITOR_BACKUP_SUFFIX_RE`); leave `1497` primary backups / shell/unicode/`\extra` / `DEFAULT_TIP_REMOTE` (`1500`) alone
- **series:** script-tooling
- **verdict:** **SAFE** — same false-missing-base class as `1497`/`1499`; new OS/editor backup set
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local / optional CI helper)
- **target files:** `scripts/check-emit-identity.mjs` (`EDITOR_BACKUP_SUFFIX_RE` / `pathHasEditorBackupSuffix`); unit under `tests/unit/*emit-identity*`
- **measured baseline:** `normalizeRepoRelativePath('src/games/hex/ai.ts.old'|'.save'|'.backup')` → `{ok:true}` with junk retained → CLI **MISSING-BASE** / exit **1**. Twin `.swp` → `{ok:false}` invalid-characters / exit **2** (`1497`). Twin `.swo` still `{ok:true}` until `#1554`/`1499` lands. Clean twin `src/games/hex/ai.ts` → OK exit **0**.
- **acceptance criteria:** Reject at normalize with clear invalid-characters (exit **2**), not false missing-base; hermetic unit covering `.old`/`.save`/`.backup` + retained `.swp` control; no product edits; do not reopen `DEFAULT_TIP_REMOTE`.
- **verification commands:** hermetic unit; CLI `--files-from` with `…ai.ts.old` line exits **2**; `rg -n 'EDITOR_BACKUP_SUFFIX_RE|\\\\.old|\\\\.save|\\\\.backup' scripts/check-emit-identity.mjs`
- **conflict notes:** extends editor-backup class beyond `1497`/`1499` — serialize after `#1554`; not tip-remote (`1500`); not minify/base/parseArgs flag theater.
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict  | Title (short)                                                              |
| ----------- | -------- | -------------------------------------------------------------------------- |
| `q-mp-1501` | **SAFE** | fab-a-diffy deep: `PLAYTEST_BASE` + default `127.0.0.1` (peer calla shape) |
| `q-mp-1502` | **SAFE** | fraction-pinball deep: default host `localhost` → `127.0.0.1`              |
| `q-mp-1503` | **SAFE** | emit-identity: reject OS/editor backups (`.old` `.save` `.backup`)         |

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
| bl tip pointer / vim secondary / DEFAULT_TIP_REMOTE       | open `#1553`/`#1554` — leave `contained`               |
| mobile-audit still `localhost:5173`                       | exhausted `mobile-audit` / `BASE_URL` family           |
| fab / ramrod **product** thinking chrome                  | HOLD / leave `#422`-style alone                        |
| synthetic deep-playtest-end phrases                       | live product false+ **0** — do not pad                 |
| settings/storage/routing/PWA thin-coverage theater        | dense coverage already; no measured wrong-results      |
| offline-probe `#frag` / `.mjs` classify micro-edges       | no live failed-request data hit — do not pad           |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Knip unusedExports (round-65)

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
- Honest underfill: **3** tasks (ids `1501`–`1503`), not padded to 25
