# Engineering backlog — 2026-10-16bl (tip refill after bk fold / round-64)

**Task id:** `q-mp-090bl`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post4c24321` @ `4c243214` (full `4c243214c7f90f67c661cc4b779a73060d169b29`; living tip cut from `alpha` after #1548 squash-merge of round-62–63 `#1546`–`#1552`; tip-owner folded bj/bk SAFE implementers `1492`…`1495`/`1497` into this tip tree — treat every bj/bk id as already queued; `1496` was skipped at fold and is **superseded** by the new tip-cut pointer task below)  
**Depends on:** tip `cursor/mp-tip-post4c24321` @ `4c243214`. Round-63 backlog (`q-mp-090bk`, ids `q-mp-1494`…`1497`) and round-62 (`q-mp-090bj`, ids `q-mp-1492`…`1493`) — leave with `contained` (folded on tip via #1548; open drafts vs prior tip names are stale). A parallel tests-only underfill branch `cursor/backlog-2026-10-17bl-cd65` (doc `backlog-2026-10-17bl.md`, **0** tasks) is **superseded / contained** by this widened refill — do not re-queue its empty set. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post4c24321` @ `4c243214` measures unit files **3481**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE: `isPlainProgressObject`, `sanitizeSettings`, `cancelFabAiRequests`) / unusedTypes **29** / unusedFiles **0**. This doc lists **3 new** concrete engineering tasks (`q-mp-1498` … `q-mp-1500`) mined from the **live tip tree after the #1548 fold**, checked against prior refills through `q-mp-1497` (bj/bk folded via #1548 — leave `contained`), bi (`1486`…`1491`), bh (`1478`…`1485`), bg (`1471`…`1477`), bf (`1463`…`1470`), be (`1453`…`1462`), and the open draft PR list (**none** into `post4c24321` at audit). It is the **only** deliverable of `q-mp-090bl`.

**Honest count:** **3** tasks (not 25) with measured wrong-results / living-doc tip drift — not padded from exhausted families. Id range starts at `q-mp-1498` per round-64 brief. Round-63 already claimed copy-pins `.not.toMatch` `wins!` polarity (`1494`), `artifactPath` containment (`1495`), living tip pointer → `post3af3000` (`1496`, **skipped** at fold), emit editor backups `~`/`.bak`/`.swp`/`.tmp` (`1497`) — **do not** re-queue (tip carries `1494`/`1495`/`1497`; `1496`’s tip-name target is now stale vs this tip cut). Rounds 62 and 63 found only 2 and 4 scripts/harness tasks, so this refill **widened** the audit to (a) tests-only gaps for settings/storage/routing/PWA/UI plumbing, (b) real script wrong-results, (c) living-doc tip drift after the #1548 cut. Tests-only scan: every scoped export has ≥1 unit file; storage/settings/routing/PWA dense; playtest honesty `1474`…`1493` folded + green — **0** tests-only queues (agree with parallel `17bl` underfill on that surface only). This refill **does not** re-queue exhausted families from the round-63 / round-62 purpose sections: `--help`/argv/empty-input theater, cli-help spawn, mountPair, npm aliases, tip-stamp **count** remasure theater, knip remeasure/baselines, AI harness speed / CI-skipped latency benches, license-classifier, pwa-manifest-contract, check-pwa-manifest, check-workflows parsing, precache parser, check-build asset/precache/chunk/html/health, menu-critical-ref, md-link regex, check-copy-pins **argv/totals remasure theater** / softRe apostrophe / mid-fragment / leading debris / WINDOW_LINES / wins! **keep** / `remaining)` / extract apostrophe / char-class `)` / registry `.not.toMatch` polarity (`1494`), summarizeKnip/diffMetrics, classifyVitestRunResult, flake-rate loops, heap/memory-leak deltas/self_size/truncated/BOM/baseURL, prototype-restore (scrollIntoView/offsetWidth/getContext/ResizeObserver/elementFromPoint), engine-coverage-rank, report-coverage-map, ratchet-history ceilings/mergeHistory/lint keys, env-number, render-perf/runtime-perf, mobile-audit, console-sweep summary **or** `BASE_URL` **or** settle thinking-**class** list (`1491`) **or** multi-class attribute-suffix (`1492`/`1493`), mutation-report games/ARITH/infra/dead/`--max`/dup/flag-like, check-dev-doc-links, probe-offline classify/board/recovered/mount, check-bundle-budgets exit codes, report-dead-code parsers, deep-playtest / calla **end matchers** (live product status harvest shows **0** further non-banner false+; do not pad synthetic-only phrases), webkit-offline-probe, artifact-dir **extract/adopters/main-entry/env-trim** / path-**containment** (`1495`), README CI posture/Status counts/lint-ratchet docs / Branches, PATH_RE, PLAYTEST\_\* env docs, testing-layers doc **count** rows, hex mutation, flattenKnip, eslint probe, fab/fraction/calibration env parsing, calibration-date whitespace, playtest-seed parse, gotoGame baseURL, CycloneDX SBOM, nav-away-sweep **BASE_URL / game-list / wait-for-thinking poll** (`1482`) / sample selector (`1493`), check-perf waitForUrl/`.mjs`/numeric/BOM, emit-identity minify/base/parseArgs/`++`/`--files-from` **flag** dup/flag-like/merge-base/**empty-list fallthrough**/abs/dedupe/**backslash**/`?`/`#`/NUL/`//`/dirs/ADS/`%&*`/shell/unicode/junk `\extra` / editor backup `~`/`.bak`/`.swp`/`.tmp`/`.orig`/`.rej` (`1497` — vim **secondary** swaps `.swo`/`.swn`/`.swx` are **new**), queens fuzz/shards/seed, runLighthouse JSON, waitForGameReady load-error, offline-dev date, report-licenses maps, mapGameChunks, withSeededRandom/oracle thenables, storage-stubs, hex-ui, playtest BASE join/seed URL, type-ratchet phase2/coercion/fail-open, engine-property immutability/shards, size:check flags, knip.error, MEM_LEAK filter/date, help-only positionals, lint-buckets empty/dup, playtest OUT date harness stems, reporter BOM, matchMedia restore, ai-calibration winners/OUT, lint/type-ratchet fail-open, env-leak `.mjs`, html poster/srcset, ai-typeonly docs, burn-1007/1008/residual hidden+serviceWorker+visibilityState+onLine+innerWidth restores, polyomino/fab/pent/fiar shards, calla PLAYTEST_BASE, isHttpResponseReady status, ai-move-time bench OUT date, UTF-8 BOM ingest siblings, wiki Branches/CI posture / Commands fence, CONTRIBUTING PR base **or** audit gate, navigator.connection owl-idle/prefetch restore, calla `blueDuringHva`, AI determinism-a/c/d/e + calibration-difficulty-order shards, par-55/sum-dominoes/ramrod illicit sampling, stars-bars New Game race wait (`1474`), star-track confusing_turn_copy / `You Wins!` (`1475`/`1483`), fab-a-diffy thinking chrome + soft-`ok` (`1484`/`1485`), stars-bars Red→`ai-win` / dead `.status-ai-thinking` metric (`1486`/`1490`), ramrod never-applied thinking class (`1487`), check-copy-pins extractExpectUnit apostrophe / char-class `)` (`1488`/`1489`), console-sweep settle `.sd-computer-thinking` class list (`1491`). No NaN/null-coercion micro-fixes unless real data hits them. No tip-stamp **count** remasure of wiki/testing-layers/README Status / copy-pins findings totals. No knip unusedTypes baseline drop. No `partitionOvers` trim theater while live `bundle-budgets.json` `knownOvers` is `[]`.

**Fresh payoffs on this tip (re-measured @ `4c243214` after #1548 fold; bj/bk `1492`–`1495`/`1497` on tip — left alone):** **living tip pointer in `AGENTS.md` + `docs/wiki/development.md` + `.github/copilot-instructions.md` still names `cursor/mp-tip-post3af3000`** after the #1548 cut to `cursor/mp-tip-post4c24321` @ `4c243214` (agents/wiki/copilot point at the prior tip; wiki still describes 026aq as in-flight), **`normalizeRepoRelativePath('…ai.ts.swo'|'.swn'|'.swx')` stays `{ok:true}`** then CLI **MISSING-BASE** / exit **1** (vim secondary swap suffixes; `.swp` already rejected by `1497`), **`DEFAULT_TIP_REMOTE` is still `origin/cursor/mp-tip-post38d2`** so `resolveDefaultMergeBase()` returns ancient `38d22ce0…` instead of live tip `4c243214` (comments falsely claim “Living tip from AGENTS.md”). Knip unusedExports still exactly the LEAVE trio (no new zero-importer SAFE demote). Live product status harvest vs `isDeepPlaytestEndStatus`: **0** further non-banner false+ — do not pad synthetic theater. Settings/storage/routing/PWA/UI plumbing already have dense unit + e2e coverage — no honest tests-only gap with measured wrong-results.

**Preference:** SAFE **scripts/** wrong-results fixes, living tip-pointer doc drift after tip cut. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings **totals**, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-stamp **count** cells, open-draft triage, knip unusedTypes baseline drop, Rank-3 demote theater, dead-CSS Rank-1 rescan, or more exhausted-family theater. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`. AI determinism **further shards** are HOLD-CHECK (tests-only walls; do not thin asserts or change AI). Held ids stay held — **do not sibling**: `q-mp-1309`, `1328`/`1329`/`1330`, `1341`, `1386`/`1390`/`1391`/`1392`, `1460`/`1461`/`1462`, `1469`/`1470`, boundaries / size soft-gate `1201`–`1204` / `1220`.

**Lint policy for this refill:** **no** new ceiling-key clears. Boundaries / size soft-gate schema tickets stay prior HOLD-CHECK ids — do not sibling. Bb lint/type/boundaries BOM HOLD-CHECK (`1386`/`1390`/`1391`/`1392`) stay prior — **do not** sibling.

## Duplicate check (do not re-queue)

| Topic family                                                                                 | Why skipped                                                                         |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| round-63 bk `1494`–`1497` (+ folded `#1548` / stale open drafts)                             | leave with `contained`; `1496` tip-name target superseded by this tip cut           |
| round-62 bj `1492`–`1493` (+ folded `#1548`)                                                 | leave with `contained`                                                              |
| parallel `17bl` tests-only underfill (`backlog-2026-10-17bl.md`, **0** tasks)                | **superseded / contained** — same `q-mp-090bl` slot; this doc is the widened refill |
| check-copy-pins registry polarity / extract / softRe / wins! **keep**                        | folded `1494` / prior — left alone                                                  |
| artifactPath containment                                                                     | folded `1495` — left alone                                                          |
| emit `~`/`.bak`/`.swp`/`.tmp`/`.orig`/`.rej`                                                 | folded `1497`; vim secondary `.swo`/`.swn`/`.swx` are **new**                       |
| tip-stamp **count** remasure (wiki unit cells / README Status / copy-pins totals)            | exhausted; living tip **name** after #1548 cut is different (queued once)           |
| tip pointer → `post3af3000` (`1496`)                                                         | skipped at fold; prior tip name now wrong — queue **new** pointer to `post4c24321`  |
| deep-playtest-end / calla end matchers                                                       | live product false+ count **0** — do not pad synthetic-only                         |
| queens fuzz / fab / pent / fiar / polyomino / engine-property shards; AI determinism-a/c/d/e | bf/be HOLD-CHECK `1469`/`1470` / `1460`–`1462` — **do not** sibling                 |
| knip unusedExports LEAVE trio                                                                | no new SAFE demote                                                                  |
| settings/storage/routing/PWA/UI thin-coverage theater                                        | dense coverage; zero-hit scoped exports **0**                                       |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions        | hard-rule HOLD                                                                      |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `4c243214`)

| Id                                   | Title (short)                               | Verdict                                            | Evidence @ `4c243214`                                        |
| ------------------------------------ | ------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| `q-mp-090bk` / `#1549`               | round-63 backlog                            | **folded on tip** via #1548                        | This refill starts at `1498`; do not re-queue `1494`–`1497`. |
| `#1550`/`#1551`/`#1552`              | bk SAFE implementers (`1495`/`1497`/`1494`) | **folded on tip** (open drafts stale vs prior tip) | Leave with `contained` / `superseded`.                       |
| `q-mp-1496`                          | tip pointer → `post3af3000`                 | **skipped at fold; superseded**                    | Re-queue as `1498` for `post4c24321` only.                   |
| `q-mp-090bj` / `#1546` / `#1547`     | round-62 + implementer                      | **folded on tip** via #1548                        | Leave with `contained`.                                      |
| `cursor/backlog-2026-10-17bl-cd65`   | parallel 0-task tests-only underfill        | **superseded / contained** (no open PR)            | Official deliverable is this `16bl` doc.                     |
| `q-mp-1469`/`1470`                   | bf HOLD-CHECK AI shards                     | **queued in bf; do not sibling**                   | Leave prior ids.                                             |
| `q-mp-1460`/`1461`/`1462`            | be HOLD-CHECK AI shards                     | **queued in be; do not sibling**                   | Leave prior ids.                                             |
| `q-mp-1386`/`1390`/`1391`/`1392`     | bb HOLD-CHECK ratchet BOM                   | **queued in bb; no tip PR yet**                    | Leave prior ids — **do not** sibling.                        |
| `q-mp-1201`…`1204` / `1220`          | boundaries + size soft-gate                 | **still-valid; no tip PR yet**                     | Leave prior ids — **do not** re-queue.                       |
| `q-mp-1309` / `1328`–`1330` / `1341` | held ids                                    | **still held**                                     | Do not sibling.                                              |
| knip unusedExports                   | live `--json`                               | **3 LEAVE**                                        | No new SAFE demote.                                          |
| Open drafts into `post4c24321`       | `gh pr list`                                | **none**                                           | This backlog is the first post4c24321 refill.                |

## Shared-file conflict flags

| Shared file                                                                  | Conflicting new ids                                                                    |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `AGENTS.md` + `docs/wiki/development.md` + `.github/copilot-instructions.md` | `1498` only; leave wiki **count** cells / Status remasure alone                        |
| `scripts/check-emit-identity.mjs` (`EDITOR_BACKUP_SUFFIX_RE`)                | `1499` only; leave shell/unicode/`\extra` / `1497` primary backups alone               |
| `scripts/check-emit-identity.mjs` (`DEFAULT_TIP_REMOTE`)                     | `1500` only; serialize after `1499` if sharing the same PR file; leave path junk alone |

**Parallel-friendly:** `1498` alone vs emit pair. Prefer landing `1498` tip-pointer early so later workers target the live tip name. Serialize `1499`→`1500` if one worker owns emit-identity (shared file).

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

$ # living tip pointer drift (after #1548 cut):
$ AGENTS.md tip → cursor/mp-tip-post3af3000
$ docs/wiki/development.md Live tip → cursor/mp-tip-post3af3000 @ 3af30003
$ .github/copilot-instructions.md → cursor/mp-tip-post3af3000
$ live branch / HEAD → cursor/mp-tip-post4c24321 @ 4c243214

$ # emit vim secondary swaps (normalizeRepoRelativePath / CLI):
$ …ai.ts.swo / .swn / .swx → { ok: true } then CLI MISSING-BASE exit 1
$ …ai.ts.swp / ~ → { ok: false } invalid characters exit 2  (1497)
$ clean twin src/games/hex/ai.ts → OK exit 0

$ # DEFAULT_TIP_REMOTE (resolveDefaultMergeBase):
$ DEFAULT_TIP_REMOTE → origin/cursor/mp-tip-post38d2
$ resolveDefaultMergeBase() → 38d22ce0eb77ed593b0fa03e743888b0ae5d9814
$ resolveDefaultMergeBase({ tipRemote: 'origin/cursor/mp-tip-post4c24321' }) → 4c243214…
$ unit assert still expects DEFAULT_TIP_REMOTE === 'origin/cursor/mp-tip-post38d2'

$ Open drafts into cursor/mp-tip-post4c24321 at audit: none
$ Live product status harvest vs isDeepPlaytestEndStatus: 0 non-banner false+
$ settings/storage/routing/PWA/UI: zero-hit scoped exports = 0 (tests-only gate not met)
```

Baselines also under `/opt/cursor/artifacts/r64-summary.txt` / `r64-probe-*.log`.

## New tasks

### q-mp-1498 · Docs: living tip pointer AGENTS + wiki + copilot must name `cursor/mp-tip-post4c24321`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post4c24321`)
- **depends-on:** none; leave wiki **unit/e2e count** cells / README Status remasure alone; supersedes skipped `1496` (prior tip name)
- **series:** tip-docs
- **verdict:** **SAFE** — living tip-name drift after #1548 cut (not count remasure theater)
- **CI / package.json callers:** none (docs only); `npm run check:dev-docs` should stay green
- **target files:** `AGENTS.md` (Purpose + Draft PR into tip bullets); `docs/wiki/development.md` (Live tip paragraph only); `.github/copilot-instructions.md` (Target tip bullet — same re-anchor surface tip-owner used in #1548)
- **measured baseline:** Live HEAD is `cursor/mp-tip-post4c24321` @ `4c243214c7f90f67c661cc4b779a73060d169b29`. `AGENTS.md` still says tip is `cursor/mp-tip-post3af3000` (2 places). Wiki Live tip paragraph still says `cursor/mp-tip-post3af3000` @ `3af30003` and describes 026aq as in-flight after #1540. Copilot instructions still target `post3af3000`. Agents reading AGENTS open drafts against the **prior** tip.
- **acceptance criteria:** All three files name `cursor/mp-tip-post4c24321` (and wiki cites tip SHA `4c243214` / full SHA optional; prose may note #1548 cut); do **not** rewrite wiki unit/e2e **count** tables or README Status counts; `npx prettier --check` on touched docs; `npm run check:dev-docs` exit 0.
- **verification commands:** `rg -n 'mp-tip-post' AGENTS.md docs/wiki/development.md .github/copilot-instructions.md`; `npx prettier --check AGENTS.md docs/wiki/development.md .github/copilot-instructions.md`; `npm run check:dev-docs`
- **conflict notes:** tip-name after tip cut — **not** tip-stamp count remasure (exhausted); not CONTRIBUTING audit gate; not Branches fence; not skipped `1496` remasure of `post3af3000`.
- **screen:** SAFE.

### q-mp-1499 · Scripts: emit-identity must reject vim secondary swap suffixes (`.swo` `.swn` `.swx`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post4c24321`)
- **depends-on:** leave `1497` primary backups (`~`/`.bak`/`.swp`/`.tmp`/`.orig`/`.rej`) and shell/unicode/`\extra` / `?`/`#`/NUL / ADS/`%&*` / `//` / dirs alone; serialize before `1500` if sharing emit-identity in one PR
- **series:** script-tooling
- **verdict:** **SAFE** — same false-missing-base class as `1497`; new vim secondary-swap set
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local / optional CI helper)
- **target files:** `scripts/check-emit-identity.mjs` (`EDITOR_BACKUP_SUFFIX_RE` / `pathHasEditorBackupSuffix`); unit under `tests/unit/*emit-identity*`
- **measured baseline:** `normalizeRepoRelativePath('src/games/hex/ai.ts.swo'|'.swn'|'.swx')` → `{ok:true}` with junk retained → CLI **MISSING-BASE** / exit **1**. Twin `.swp` / `~` → `{ok:false}` invalid-characters / exit **2** (already `1497`). Clean twin `src/games/hex/ai.ts` → OK exit **0**. Vim creates `.swo`/`.swn`/`.swx` when `.swp` already exists.
- **acceptance criteria:** Reject at normalize with clear invalid-characters (exit **2**), not false missing-base; hermetic unit covering the three secondary suffixes + retained `.swp` control; no product edits.
- **verification commands:** hermetic unit; CLI `--files-from` with `…ai.ts.swo` line exits **2**; `rg -n 'EDITOR_BACKUP_SUFFIX_RE|\\\\.swo|pathHasEditorBackupSuffix' scripts/check-emit-identity.mjs`
- **conflict notes:** extends editor-backup class beyond `1497` — not minify/base/parseArgs flag theater; not `DEFAULT_TIP_REMOTE` (`1500`).
- **screen:** SAFE.

### q-mp-1500 · Scripts: emit-identity `DEFAULT_TIP_REMOTE` must track living tip `cursor/mp-tip-post4c24321`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post4c24321`)
- **depends-on:** serialize after `1499` if sharing emit-identity; leave path-junk / editor-backup gates alone; leave tip-docs `1498` alone (docs vs script constant)
- **series:** script-tooling
- **verdict:** **SAFE** — default `--base` merge-base prefers a retired tip remote over the living tip (wrong living-tip classification; same class as prior `q-mp-1357`)
- **CI / package.json callers:** `package.json` → `check:emit-identity` (local / optional CI helper)
- **target files:** `scripts/check-emit-identity.mjs` (`DEFAULT_TIP_REMOTE` + stale “Living tip from AGENTS.md” comments ~L38 / ~L1015); unit under `tests/unit/check-emit-identity.test.ts` (asserts currently pin `origin/cursor/mp-tip-post38d2`)
- **measured baseline:** `DEFAULT_TIP_REMOTE === 'origin/cursor/mp-tip-post38d2'`. `resolveDefaultMergeBase()` → `38d22ce0eb77ed593b0fa03e743888b0ae5d9814`. With `tipRemote: 'origin/cursor/mp-tip-post4c24321'` → `4c243214…`. AGENTS (even stale) names `post3af3000`, not `post38d2` — comments are false. Unit hermetic stubs key on `merge-base HEAD origin/cursor/mp-tip-post38d2`.
- **acceptance criteria:** `DEFAULT_TIP_REMOTE` is `origin/cursor/mp-tip-post4c24321` (or otherwise resolves default merge-base to the living tip SHA); comments match AGENTS/live tip; hermetic unit updated; `resolveDefaultMergeBase()` on tip returns live tip merge-base; no product / AI / path-junk edits.
- **verification commands:** hermetic unit; `node --input-type=module -e "import {DEFAULT_TIP_REMOTE,resolveDefaultMergeBase} from './scripts/check-emit-identity.mjs'; …"`; `rg -n 'DEFAULT_TIP_REMOTE|mp-tip-post38d2|mp-tip-post4c24321' scripts/check-emit-identity.mjs tests/unit/check-emit-identity.test.ts`
- **conflict notes:** living-tip constant drift — not tip-stamp count remasure; not docs-only `1498`; not editor-suffix `1499`; not retired-wave5 invent-DIFF theater beyond updating the constant.
- **screen:** SAFE.

## Verdict summary

| Id          | Verdict  | Title (short)                                                                  |
| ----------- | -------- | ------------------------------------------------------------------------------ |
| `q-mp-1498` | **SAFE** | docs: AGENTS + wiki + copilot living tip pointer → `cursor/mp-tip-post4c24321` |
| `q-mp-1499` | **SAFE** | emit-identity: reject vim secondary swaps (`.swo` `.swn` `.swx`)               |
| `q-mp-1500` | **SAFE** | emit-identity: `DEFAULT_TIP_REMOTE` must track living tip `post4c24321`        |

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
| bj/bk folded status / copy-pins / artifact / emit primary | leave `contained`                                      |
| fab / ramrod **product** thinking chrome                  | HOLD / leave `#422`-style alone                        |
| synthetic deep-playtest-end phrases                       | live product false+ **0** — do not pad                 |
| settings/storage/routing/PWA thin-coverage theater        | dense coverage already; no measured wrong-results      |
| parallel `17bl` 0-task underfill                          | superseded by this widened refill                      |

**No HOLD** product tickets queued (AI / board-3d / rules / copy left out of scope).

## Knip unusedExports (round-64)

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
- Honest underfill: **3** tasks (ids `1498`–`1500`), not padded to 25
