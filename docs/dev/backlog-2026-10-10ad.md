# Engineering backlog — 2026-10-10ad (tip refill after post1059 mid-fold / round-30)

**Task id:** `q-mp-090ad`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1059` @ `3a9b2688` (full `3a9b2688b4b40e4dbf283316493c6f616f773d44`)  
**Depends on:** tip cut after `q-mp-026r` / tip PR #1059 squash-merged; tip-owner fold `q-mp-026s` / draft tip PR `#1083` (base `alpha`) advancing live tip HEAD. Round-29 backlog (`q-mp-090ac` / tip-carried `docs/dev/backlog-2026-10-10ac.md` @ `d9fe2d07`/`3a9b2688`, ids `q-mp-792`…`807`) and round-28 (`q-mp-090ab` tip-carried + workers) are **tip-carried** — leave open drafts with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1059` @ `3a9b2688` measures suite **3366** files / **14347** listed cases; nnnull **237**/237; void **47**/47; nullish **65**/65; unusedTypes live **29** vs baseline **36**; AGENTS tip **name** already **post1059**; wiki/testing-layers **count** cells owned by tip remasure / open `#1098` leftovers — leave with `contained`. Chromium e2e list **25** files / **249** cases. **`npm run lint:ratchet` eqeqeq 1 / ceiling 1**, but **`npm run report:lint-buckets -- --rule eqeqeq` still falsely reports 0 / 1** until open `#1133`/`792` folds — leave with `contained` (do not re-queue). Knip unusedExports remain the intentional LEAVE barrel pair + AI `cancelFabAiRequests` (no SAFE knip deletes; unusedFiles **0**). This doc lists **13 new** concrete engineering tasks (`q-mp-817` … `q-mp-830`, skipping `827`) mined from the **live tip tree**, checked against prior refills (`q-mp-090` … `q-mp-090ac` / ids through `q-mp-807`) and against the full open draft PR list. It is the **only** deliverable of `q-mp-090ad`.

**Honest count:** Only **13** tasks — not padded to 25. Round-29 already claimed lint-buckets probe drift, docs reproduce-command → named e2e scripts, `gotoGame`/`storage-stubs` adoption, and deep-playtest / render-perf script `waitForTimeout` clears (workers `#1126`–`#1134` open — leave with `contained`). Unit coverage / lint successors remain saturated or owned; knip has **no** SAFE unusedExports. Slowest unit-node wall is still AI determinism / calibration (hard-rule HOLD — not queued). Non-AI isolate files remeasured earlier are already ≤~4s (`existing-games-controllers`) / ≤~2.4s (registry contract) with no proven in-file speedup that is not a forbidden harness shard. This refill **does not** re-queue per-game UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **src** or **mp3d e2e** edits, demo coverage, harness shards, remasure/count-stamp inventories, tip-name stamps, `*types*` residuals, docs reproduce-command → `test:e2e:chromium` preference sweeps, script `waitForTimeout` clears (already dense in `792`–`807` / `#1129`–`#1134`), Queens & Guards product work, AI timing, or anything in rounds ≤29. Payoffs are freshly measured: **stale dead-code defer metadata**, **unused navigate-only router mock helper** (dead-code Rank-2 yes; `#526` MERGED), **wiki script/row conflation** (`firefox-webkit` ≠ `test:e2e:cross`), **tip-remasure regression** reintroducing “Open draft #658”, **mountPair / RNG helper adoption**, and **state-roundtrip-fuzz wall** (AI-sample cadence) under tip-owner guardrail.

**Preference:** SAFE, mutually independent **tests-only**, **docs-only**, or **scripts/** tooling work. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins, boundaries/PWA, board-3d layout inventory, CI permissions, tip-pointer / tip-name sweep theater, open-draft triage, emit-identity, knip drift, dead-CSS Rank-1 rescan, coverage-map heat regenerate, or wiki **count** stamps. **Avoid** competing tickets already owned by open `#1084`–`#1134` / tip-carried `10y`/`10z`/`10aa`/`10ab`/`10ac`. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics (no real→fake timer product retargets).

**Lint policy for this refill:** **no** new ceiling-key clears. Leave `#1133`/`792` + `#995`/`543` alone.

## Duplicate check (do not re-queue)

Skipped topics already covered by `q-mp-176`–`q-mp-807`, open drafts, or prior ids (non-exhaustive; `gh pr list --state open` 2026-10-10):

| Topic family                                                                                                                                                                                                                                                | Why skipped                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| round-29 backlog / lint-buckets eqeqeq probe / shared probe extract / a11y+offline+cross reproduce scripts / CI `e2e-cross-browser` named script / `gotoGame` / `storage-stubs` / ramrod+sum-dominoes+render-perf+calla+par-55 script waits | tip-carried `10ac` @ `3a9b2688` + open workers `#1125`–`#1134` — leave with `contained`; **do not** re-queue `792`–`807` |
| round-28 backlog / wiki `#658` original fix / playability+visual waits / `waitForGameReady`+`startHuman` / mp3d e2e waits / wiki a11y reproduce | tip-carried `10ab` + open `#1121`/`#1130`/`#1124` — leave with `contained`; **do not** re-queue `767`–`779` (note: tip remasure **re-broke** `#658` wording — new id `817` owns the regression only) |
| round-27 / void queens-board-3d / nnnull owl-messages / nullish fiar-board-3d / ceilings notes / canvas-dpr + contig-60 + sum-dominoes e2e waits / router mock **extract** (`748`) | tip-carried `10aa` + `745`–`748` @ tip — leave open drafts with `contained` |
| per-game UI coverage rounds / soft-fail characterizations / mutation-audit waves / board-3d **src** or **mp3d e2e** / demo coverage / harness shards / remasure inventories / tip-name stamps / `*types*` residuals / docs reproduce → named chromium sweeps / script `waitForTimeout` clears | prompt hard-skip for round-30 |
| knip unusedExports (storage barrel LEAVE + `cancelFabAiRequests` AI) / Rank-3 unusedTypes demote / unusedTypes baseline 36→29 drop                                                                                                                           | intentional LEAVE / prior demote chain / remasure theater — leave alone |
| wiki/testing-layers **count** cells / AGENTS tip **name**                                                                                                                                                                                                   | tip name already post1059; counts tip-remasured / `#1098` |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts logic / copy / scoring / optional-chain or radix **product** clears / CI permissions **widening**                                                                                                       | hard-rule HOLD |
| old-tip Rank-2 helper demote `#650` / helper consolidate `#656` / rng alias `#712`                                                                                                                                                                          | wrong tip base — leave with `contained`; do not retarget those PRs |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening, apt, or network-in-tests work. No `memory/` files.

## Stale queue re-check (live tip `3a9b2688`)

| Id                                  | Title (short)                | Verdict                                                | Evidence @ `3a9b2688`                                                                                 |
| ----------------------------------- | ---------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `q-mp-090ac` / `#1125`              | round-29 backlog 10ac        | **tip-carried (open draft)**                           | Leave open with `contained` — this refill starts after `807`.                                         |
| `q-mp-792` / `#1133`                | lint-buckets eqeqeq probe    | **still-valid (open)**                                 | Live buckets still **0**/1 vs ratchet **1**/1 — leave `#1133` alone.                                  |
| `q-mp-794`–`799` / `#1126`–`#1132`  | docs prefer named e2e scripts | **still-valid (open)**                                | Leave with `contained` — do not add another reproduce-command sweep.                                  |
| `q-mp-800`                          | CI cross-browser named script | **tip-queued; unworked**                              | Leave undrafted / do not duplicate (id `827` intentionally unused this refill).                        |
| `q-mp-801`/`771` / `#1130`          | startHuman + gotoGame adopt  | **still-valid (open)**                                 | Local `startHuman` still in pointer/canvas/zoom/forced — leave `#1130`.                               |
| `q-mp-802`–`805` / `#1127`/`#1129`/`#1131`/`#1134` | storage-stubs + script waits | **still-valid (open)**                        | Leave with `contained`.                                                                               |
| `q-mp-806`–`807`                    | calla/par-55 script waits    | **tip-queued HOLD-CHECK; unworked**                    | Leave alone.                                                                                          |
| `q-mp-667`–`668` / `#1098`          | wiki/testing-layers counts   | **partially tip-remasured**                            | Live list **14347** vs wiki **14335** — leave `#1098` / tip remasure; **do not** re-queue count stamps. |
| `q-mp-543` / `#995`                 | eqeqeq ceiling 1→0           | **still-valid (HOLD product; ceiling-only undrafted)** | **do not** re-queue.                                                                                  |
| `#650` (post477)                    | Rank-2 unused test-helper demote | **stale tip**                                      | Leave with `contained` on old tip; this refill’s `818`/`819` supersede the *navigate-only* leftover only. |

## Shared-file conflict flags

| Shared file                                   | Conflicting new ids                                                                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/report-dead-code.mjs`                | `817` (DEFER list / disposition copy) + `818` (registry-id label) — serialize lightly                                                 |
| `tests/unit/helpers/router-mock.ts`           | `819`/`820` consumers only — **do not** delete `mockRouterNavigateModule` until adoption batches land (or fold `821` delete after)  |
| `docs/wiki/development.md`                    | `822` (`#658` regression) + `823` (firefox/cross row) — serialize; **do not** edit count cells                                        |
| `tests/unit/state-roundtrip-fuzz.test.ts`     | `830` only                                                                                                                            |

**Parallel-friendly:** `q-mp-819`, `q-mp-820`, `q-mp-824`, `q-mp-825`, `q-mp-826`, `q-mp-828`, `q-mp-829` (no shared product files). Serialize `817`→`818`; serialize `819`/`820` before optional `821`; serialize `822`/`823` on wiki/development.md.

## Live tip measurements (evidence snapshot @ `3a9b2688`)

```text
$ git rev-parse HEAD
  3a9b2688b4b40e4dbf283316493c6f616f773d44

$ npm run lint:ratchet
  ok   curly: 538 / ceiling 538
  ok   @typescript-eslint/no-non-null-assertion: 237 / ceiling 237
  ok   @typescript-eslint/no-confusing-void-expression: 47 / ceiling 47
  ok   radix: 6 / ceiling 6
  ok   default-case: 5 / ceiling 5
  ok   no-duplicate-imports: 42 / ceiling 42
  ok   @typescript-eslint/prefer-nullish-coalescing: 65 / ceiling 65
  ok   @typescript-eslint/prefer-optional-chain: 21 / ceiling 21
  ok   @typescript-eslint/switch-exhaustiveness-check: 8 / ceiling 8
  ok   @typescript-eslint/no-shadow: 3 / ceiling 3
  ok   eqeqeq: 1 / ceiling 1
  ok   @typescript-eslint/return-await: 3 / ceiling 3

$ npm run report:lint-buckets -- --rule eqeqeq
  eqeqeq: 0 / ceiling 1 (−1 headroom)
  (no hits)   ← owned by open #1133/792 — leave contained

$ npm run typecheck:ratchet
  in-scope errors:     0
  out-of-scope errors: 216   ← AI residual (hard-rule HOLD)

$ npm run report:knip
  unusedExports: 3  unusedTypes: 29  unlisted: 3  duplicates: 0  unusedFiles: 0
  unusedExports = storage barrel LEAVE + cancelFabAiRequests (AI HOLD) — no SAFE knip deletes

$ npm run report:dead-code
  Safe-to-remove yes: 1
  [R2 yes] tests/unit/helpers/router-mock.ts#mockRouterNavigateModule
  DEFER_TO_OPEN_PRS still lists #518/#523/#526 (MERGED) and #520 (CLOSED)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3366

$ npx vitest list | wc -l
  14347

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ npm run test:e2e:firefox-webkit -- --list
  Total: 498 tests in 25 files   ← firefox+webkit only

$ npx playwright test --project=ipad-webkit --list
  Total: 249 tests in 25 files   ← only via test:e2e:cross

$ CI=1 npx vitest run --project unit-node --reporter=json
  state-roundtrip-fuzz.test.ts     ~29.9s wall (non-AI file; AI-sample cadence inside)
  engine-property-invariants.test.ts ~13.6s
  (AI determinism shards 8–165s — HOLD, not queued)

$ rg -l "vi.mock('.*/router', () => ({ navigate: vi.fn() }))" tests/unit --glob 'overnight*.ts' | wc -l
  194   ← navigate-only inline mocks; mockRouterNavigateModule has zero importers

$ docs/wiki/development.md:122
  tip remasure @ ee77348c reintroduced "Open draft #658" after 767 had set "Merged #658"

$ docs/wiki/development.md:148
  single row lists firefox/webkit/ipad + both test:e2e:firefox-webkit and test:e2e:cross as if equivalent
```

## New tasks

### q-mp-817 · Scripts: refresh `report-dead-code` DEFER list (drop merged/closed PRs)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (serialize `818` after/with this)
- **series:** script-tooling
- **verdict:** **SAFE** — non-src script metadata; restores report fidelity; **no** knip baseline edits; **no** `src/` deletes in this ticket
- **target files:** `scripts/report-dead-code.mjs` (`DEFER_TO_OPEN_PRS` + disposition / header copy that still says “coordinate with #526” / “leave for #526”); regenerate `docs/dev/dead-code-inventory.md` (+ `.json`) via `npm run report:dead-code`
- **measured baseline:** Live GitHub: `#518` MERGED, `#520` CLOSED, `#523` MERGED, `#526` MERGED. Script still emits “Defer — do not redo” bullets for all four and tells workers to skip Rank-2 test-helper removals “coordinate with #526”.
- **acceptance criteria:** DEFER list no longer cites merged/closed PRs as open blockers (remove or rewrite as historical notes); regenerated inventory disposition copy matches; Rank-2 `mockRouterNavigateModule` remains visible as safe-to-remove **until** `819`/`820` adopt it; `npm run report:dead-code` exits 0; no `src/` / ratchet / CI permission edits.
- **verification commands:** `npm run report:dead-code` ; `rg -n 'DEFER_TO_OPEN_PRS|pr: 526|coordinate with #526' scripts/report-dead-code.mjs docs/dev/dead-code-inventory.md` ; `gh pr view 526 --json state`
- **conflict notes:** serialize with `818`; leave `#650` (old tip) with `contained`.

### q-mp-818 · Scripts: `report-dead-code` registry label — do not call divisions “games”

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** fold or co-land of `817` preferred
- **series:** script-tooling
- **verdict:** **SAFE** — non-src report copy / id filter; wiki already distinguishes **20 games** + **4 divisions**
- **target files:** `scripts/report-dead-code.mjs` (`collectDynamicAndRegistry` / inventory “Registered games:” line); regenerated `docs/dev/dead-code-inventory.md`
- **measured baseline:** Inventory prints `Registered games: 24` including `division-1`…`division-4`. `docs/wiki/overview.md` / `game-registry.md` say **20 registered games** + **4 divisions**. Playable fuzz adapters = **20**.
- **acceptance criteria:** Report distinguishes playable game ids (**20**) from division hub ids (**4**), or labels the list “registry ids” without calling divisions games; regenerate inventory; no `src/core/game-registry.ts` product edits.
- **verification commands:** `npm run report:dead-code` ; `rg -n 'Registered games|registry ids|division-1' docs/dev/dead-code-inventory.md` ; `rg -n "id: '" src/core/game-registry.ts | wc -l`
- **conflict notes:** after/with `817`.

### q-mp-819 · Tests: adopt `mockRouterNavigateModule` in overnight navigate-only suites (batch A)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (prefer after tip-carried `748` / leave `#1120` with `contained`)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only helper adoption; keep behavioral asserts + test counts; **not** a soft-fail re-characterization
- **target files:** ≥25 `tests/unit/overnight-*.ts` files that still use `vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }))` with **no** `router-mock` import; switch to async `vi.mock` + `mockRouterNavigateModule()` from `tests/unit/helpers/router-mock.ts`; no `src/` edits
- **measured baseline:** `mockRouterNavigateModule` has **zero** importers (`rg` + `npm run report:dead-code` Rank-2 yes). **194** overnight files still inline navigate-only mocks. `748` only adopted `mockRouterModule` in three game-route-mounts suites.
- **acceptance criteria:** ≥25 overnight files import/use `mockRouterNavigateModule`; asserts + `npx vitest list | wc -l` unchanged; targeted `CI=1 npx vitest run --project unit-shared` (or correct project) green for a sample of adopters; no soft-fail assert retargets; no `src/` / copy / AI edits.
- **verification commands:** `rg -n 'mockRouterNavigateModule' tests/unit --glob '*.ts'` ; `rg -l "navigate: vi.fn()" tests/unit --glob 'overnight*.ts' | wc -l` ; `npx vitest list | wc -l` ; `CI=1 npx vitest run --project unit-shared tests/unit/overnight-wave64-demos-graph-clear-path-btn-exact.test.ts tests/unit/overnight-wave60-demos-frac-equals-exact.test.ts`
- **conflict notes:** serialize with `820`/`821`; leave open demo residual soft-fail PRs (`#1088`/`#1089`/…) alone; no ratchet JSON.

### q-mp-820 · Tests: adopt `mockRouterNavigateModule` in overnight navigate-only suites (batch B)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** fold or co-land of `819`
- **series:** test-hygiene
- **verdict:** **SAFE** — same class as `819`; second batch so PRs stay reviewable
- **target files:** next ≥25 overnight navigate-only files still inlining after `819`; same adoption pattern; no `src/` edits
- **measured baseline:** After `819`, ≥169 overnight inlines remain (194−25). Goal: drive importer count high enough that the helper is no longer Rank-2-unused (or leave a thin remainder for `821`).
- **acceptance criteria:** ≥25 additional overnight files adopted; asserts + case counts unchanged; sample suites green under `CI=1`; no `src/` edits.
- **verification commands:** `rg -n 'mockRouterNavigateModule' tests/unit --glob 'overnight*.ts' | wc -l` ; `rg -l "navigate: vi.fn()" tests/unit --glob 'overnight*.ts' | wc -l` ; `npx vitest list | wc -l`
- **conflict notes:** after `819`; before optional `821`.

### q-mp-821 · Tests: delete `mockRouterNavigateModule` if still unused after adoption batches — [optional cleanup]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** fold of `819`+`820` (skip this ticket entirely if helper has ≥1 importer)
- **series:** test-hygiene
- **verdict:** **SAFE** — delete only if still zero importers; dead-code Rank-2 yes; `#526` MERGED unblocks
- **target files:** `tests/unit/helpers/router-mock.ts` (remove `mockRouterNavigateModule` + its doc line); keep `mockRouterModule`; regenerate dead-code inventory optional
- **measured baseline:** Pre-adoption: zero importers. This ticket is a backstop if adoption batches are abandoned.
- **acceptance criteria:** Either (a) helper has importers and this ticket is closed as N/A in the PR body, or (b) export removed, `mockRouterModule` retained, dead-code Rank-2 yes count drops, unit list unchanged, no `src/` edits.
- **verification commands:** `rg -n 'mockRouterNavigateModule' tests` ; `npm run report:dead-code` ; `npx vitest list | wc -l`
- **conflict notes:** only after `819`/`820`; leave `#650` alone.

### q-mp-822 · Docs: restore wiki `#658` MERGED wording (tip-remasure regression)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (leave `#1124`/`767` with `contained` — that fix landed then was overwritten)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; live GitHub state **MERGED** disagrees with current wiki prose
- **target files:** `docs/wiki/development.md` unit-job-runtime paragraph (L122 area) — change “Open draft #658 …” back to past-tense **Merged** wording (as in `0475167a`); **do not** remasure count cells here
- **measured baseline:** `gh pr view 658 --json state` → `MERGED`. Tip commit `0475167a` (`767`) set Merged wording; tip remasure `ee77348c` rewrote the paragraph and reintroduced “Open draft #658”.
- **acceptance criteria:** Paragraph says Merged (not Open draft) for `#658`; count/SHA cells untouched (or left to tip remasure / `#1098`); no `src/` / CI edits.
- **verification commands:** `gh pr view 658 --json state` ; `rg -n '658|Open draft|Merged' docs/wiki/development.md`
- **conflict notes:** serialize with `823`; leave count stamps alone.

### q-mp-823 · Docs: split wiki Firefox/WebKit vs iPad (`test:e2e:cross`) row

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (leave `#1126`/`799` alone — that ticket only renames the cross-browser **doc** reproduce line)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; row **demonstrably disagrees** with `package.json` script definitions
- **target files:** `docs/wiki/development.md` testing-layers table row “E2E Firefox / WebKit / iPad” (and command cheat-sheet lines if they imply equivalence); optionally one clarifying sentence in `CONTRIBUTING.md`
- **measured baseline:** `test:e2e:firefox-webkit` = firefox+webkit (**498** listed tests). `test:e2e:cross` = firefox+webkit+**ipad-webkit**. Wiki single row lists all three projects and both scripts as if interchangeable. `docs/dev/testing-layers-2026-10-09.md` already splits ipad onto `test:e2e:cross` correctly.
- **acceptance criteria:** Wiki distinguishes CI report-only firefox+webkit script from local/cross script that adds ipad-webkit; no job-name / permissions edits; no count-cell remasure theater.
- **verification commands:** `node -e "const s=require('./package.json').scripts; console.log(s['test:e2e:firefox-webkit'], s['test:e2e:cross'])"` ; `rg -n 'test:e2e:cross|firefox-webkit|ipad-webkit' docs/wiki/development.md docs/dev/testing-layers-2026-10-09.md`
- **conflict notes:** serialize with `822`; leave `#1126`/`800` alone.

### q-mp-824 · Tests: adopt shared `mountPair` in overnight contig board+status suites

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only fixture adoption; keep asserts + counts; no controller product edits
- **target files:** overnight contig suites that still `createElement` board+status pairs without `mountPair` — measured hosts include `tests/unit/overnight-wave59-contig-status-aria-live-polite.test.ts`, `overnight-wave59-contig-status-red-turn-copy.test.ts`, `overnight-wave58-contig-new-game-vs-ai-chrome.test.ts`, `overnight-wave59-contig-cell-click-places.test.ts`, `overnight-wave59-contig-new-game-clears-ai-chrome.test.ts`, `overnight-wave59-contig-winner-hides-turn-status.test.ts`, `overnight-wave58-contig-scores-plural-pts.test.ts`, `overnight-wave58-contig-new-game-vs-human-resets.test.ts`, `overnight-wave58-contig-winner-aria-live-still.test.ts`, `overnight-wave57-contig-status-rolling-copy.test.ts`, `overnight-wave59-contig-scores-nonzero-chrome.test.ts` (and siblings still inlining after tip rebase); import `mountPair` from `tests/helpers/mount-pair.ts`
- **measured baseline:** Shared `mountPair` already used by ≥16 unit files. **≥69** overnight-wave files still hand-roll board+status divs matching the helper shape.
- **acceptance criteria:** ≥8 listed contig hosts adopt `mountPair` (or `mountPair({…})` if class hooks needed); asserts + case counts unchanged; targeted vitest paths green; no `src/` / copy edits.
- **verification commands:** `rg -n 'mountPair' tests/unit --glob 'overnight-wave*contig*'` ; `CI=1 npx vitest run --project unit-shared tests/unit/overnight-wave59-contig-status-aria-live-polite.test.ts tests/unit/overnight-wave58-contig-new-game-vs-ai-chrome.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** leave soft-fail / UI-cov contig tickets alone; no ratchet JSON.

### q-mp-825 · Tests: adopt shared `mountPair` in overnight fiar / kings / handshake board+status suites

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (parallel with `824`)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only; asserts unchanged
- **target files:** overnight fiar/kings/handshake hosts with board+status createElement pairs — measured examples: `overnight-wave55-fiar-controller-*.test.ts`, `overnight-wave56-fiar-controller-*.test.ts`, `overnight-wave56-kings-status-aria-live.test.ts`, `overnight-wave52-kings-status-ai-thinking.test.ts`, `overnight-wave56-handshake-kings-hex-par.test.ts`, `overnight-wave57-handshake-kings-hex-par.test.ts`, `overnight-wave59-handshake-fab-fiar-inject-chrome.test.ts`, `overnight-wave50-calla-controller-tutorial.test.ts` (and siblings); import `mountPair` where the pair shape matches
- **measured baseline:** Same as `824` — large inline createElement surface; helper already proven in burn-wave suites.
- **acceptance criteria:** ≥8 hosts adopt `mountPair`; asserts + counts unchanged; sample suites green; no `src/` edits; skip hosts whose mount shape is not board+status (single root / demos gallery).
- **verification commands:** `rg -n 'mountPair' tests/unit --glob 'overnight-wave*fiar*' --glob 'overnight-wave*kings*' --glob 'overnight-wave*handshake*'` ; `npx vitest list | wc -l`
- **conflict notes:** parallel with `824`; leave AI-thinking copy asserts untouched (structure only).

### q-mp-826 · Tests: adopt shared `rng` helpers in `kwatro-sinko-ai-long-game-completion`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only RNG helper adoption; **no** Kwatro AI / rules / scoring / difficulty / timing product edits; keep stream + asserts identical
- **target files:** `tests/unit/kwatro-sinko-ai-long-game-completion.test.ts` (local `mulberry32` / `withSeededRandom` → `tests/helpers/rng.ts`); no `src/games/kwatro-sinko/**` edits
- **measured baseline:** File defines a local mulberry32 (`t += 0x6d2b79f5`) identical to `tests/helpers/rng.ts` `mulberry32` / `withSeededRandom`. Shared helper header already says prefer these over local copies.
- **acceptance criteria:** Local RNG helpers removed; shared imports used; playout asserts + case counts unchanged; suite green under `CI=1` on the correct vitest project; Hex Hard / history-cap untouched; no fake-clock retarget.
- **verification commands:** `rg -n 'function mulberry32|function withSeededRandom|from .*helpers/rng' tests/unit/kwatro-sinko-ai-long-game-completion.test.ts` ; `CI=1 npx vitest run tests/unit/kwatro-sinko-ai-long-game-completion.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** do **not** retarget tablet-ai / ai-move-time bench local RNGs (AI-bench HOLD surface); no ratchet JSON.

### q-mp-828 · Docs: CONTRIBUTING — document `test:e2e:cross` vs `test:e2e:firefox-webkit`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (serialize lightly with `823`)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; CONTRIBUTING currently prefers `test:e2e:chromium` but never explains the firefox-webkit vs cross split that `package.json` already defines
- **target files:** `CONTRIBUTING.md` (short note near e2e script guidance)
- **measured baseline:** CONTRIBUTING mentions `test:e2e:chromium` vs bare `test:e2e` only. `package.json` has both `test:e2e:firefox-webkit` and `test:e2e:cross` (adds ipad-webkit). Wiki cheat-sheet lists both without CONTRIBUTING coverage.
- **acceptance criteria:** CONTRIBUTING states firefox-webkit = CI report-only pair; cross adds ipad-webkit locally; no workflow edits.
- **verification commands:** `rg -n 'test:e2e:cross|firefox-webkit' CONTRIBUTING.md package.json` ; `node -e "console.log(require('./package.json').scripts['test:e2e:cross'])"`
- **conflict notes:** serialize with `823`.

### q-mp-829 · Tests: adopt `mockRouterNavigateModule` in non-overnight demo suites (navigate-only) — leave soft-fail PRs alone

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** fold or co-land of `819` preferred
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only; **skip** any file owned by open soft-fail / residual-branch drafts (`#1088`/`#1089`/`#1095`/`#1096`/…); asserts unchanged
- **target files:** non-overnight navigate-only mocks such as `tests/unit/polyomino-demo-remount-resets-board.test.ts` and any sibling **not** claimed by an open post1059 residual PR; use `mockRouterNavigateModule`; no `src/` edits
- **measured baseline:** Besides **194** overnight files, several non-overnight demo suites still inline `{ navigate: vi.fn() }` without `router-mock` (measured: polyomino-demo remount + assorted `q-mp-*-demo-*` files — many of those have open residual PRs → **skip those**).
- **acceptance criteria:** ≥3 unowned navigate-only suites adopted; open residual-branch PRs left untouched (`contained`); asserts + counts unchanged; no soft-fail assert retargets.
- **verification commands:** `rg -n 'mockRouterNavigateModule' tests/unit --glob '*demo*'` ; `rg -l "navigate: vi.fn()" tests/unit --glob '*demo*' | head` ; `npx vitest list | wc -l`
- **conflict notes:** explicitly leave `#1088`/`#1089`/`#1091`/`#1095`/`#1096`/`#1105` alone.

### q-mp-830 · Tests: speed up `state-roundtrip-fuzz` AI-sample cadence — [HOLD-CHECK: AI-call adjacency]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-perf
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** test-perf
- **verdict:** **HOLD-CHECK** — tests-only wall reduction that changes how often `aiChoice` runs inside the fuzz harness; **no** `src/games/**/ai*.ts` / rules / scoring / difficulty / timing product edits; tip-owner guardrail before fold; **no** fake-clock product retargets; Hex Hard / history-cap untouched
- **target files:** `tests/unit/state-roundtrip-fuzz.test.ts` (AI sample `movesPlayed % 5 === 0` → less frequent, e.g. `% 10`, while **keeping** the final AI parity checkpoint); optionally a one-line comment in `docs/state-roundtrip-2026-10-07.md` if it documents the sample rate
- **measured baseline:** Under `CI=1` `unit-node` JSON wall ≈ **29.9s** for this file (largest non-determinism non-AI unit-node file). Loop calls real `fabAI`/`fiarAI`/`hexAI`/`queensAI` plus `mockAI`-wrapped easy AIs every 5th move × 2 seeds × ≤28 moves. Estimated AI invocations drop ~2× if cadence goes to every 10th move while final checkpoint remains.
- **acceptance criteria:** Measurable wall drop on the same command (report before/after seconds); deep-equality + legal-move asserts unchanged; final AI checkpoint retained; case count unchanged; suite green under `CI=1 npx vitest run --project unit-node tests/unit/state-roundtrip-fuzz.test.ts`; no `src/` AI edits; no harness shard / project move.
- **verification commands:** `CI=1 npx vitest run --project unit-node tests/unit/state-roundtrip-fuzz.test.ts` ; `rg -n 'movesPlayed %|aiChoice|AI_COMPARE' tests/unit/state-roundtrip-fuzz.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** tip-owner review for AI-adjacency; do **not** touch AI determinism shards; no Stars & Bars history cap; no Hex Hard 450ms edits.

---

## Id allocation

New ids in this doc: **`q-mp-817` … `q-mp-830`** except **`q-mp-827`** (**13** tasks — fewer than 25; no filler).  
Ids `q-mp-808`…`q-mp-816` and **`q-mp-827`** are intentionally unused (`827` left free so tip-queued `800` CI named-script work is not duplicated).  
Do **not** reuse `q-mp-001`–`q-mp-807`. Tip-owner refill should point workers at these after folding this doc into `cursor/mp-tip-post1059`.

**Ceiling keys used in this refill:** **none**.  
**Not used here (already claimed / undrafted / HOLD / no headroom / prompt-skipped families):** void/nnnull/nullish successors, eqeqeq product clear (`#995`/`543`), lint-buckets probe (`#1133`/`792`), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki count remasure, tip-name stamps, UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **src** / **mp3d e2e**, harness shards, demo coverage, `*types*` residuals, docs reproduce → `test:e2e:chromium` sweeps (`794`–`799`), script `waitForTimeout` clears (`803`–`807` / `#1129`–`#1134`), `startHuman`/`gotoGame`/`storage-stubs` (`771`/`801`/`802`), CI `e2e-cross-browser` named script (`800`), Queens & Guards product, open post1059 workers `#1084`–`#1134`.

**Skipped after measurement (not filler):** AI unit-wall speedups (determinism/calibration); knip unusedExports (LEAVE only); non-AI isolate files without proven non-shard speedup; stars-bars / memory-leak / nav-away script waits (HOLD / prior skip); re-exporting `state-roundtrip` `pickIndex` from `rng` (lenient empty-length vs throw — semantic mismatch); re-queue of tip-queued `800`.

Prefer parallel start on: **819**, **820**, **824**, **825**, **826**, **828**, **829**. Serialize **817**→**818**; serialize **822**/**823**; serialize **819**/**820** before optional **821**; tip-owner gate **830**.

**One-line id tags:** `817 SAFE`, `818 SAFE`, `819 SAFE`, `820 SAFE`, `821 SAFE`, `822 SAFE`, `823 SAFE`, `824 SAFE`, `825 SAFE`, `826 SAFE`, `828 SAFE`, `829 SAFE`, `830 HOLD-CHECK`.

**Next action: fold into tip by the tip owner.**
