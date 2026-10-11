# Engineering backlog — 2026-10-10ak (tip refill after post1183 folds / round-37)

**Task id:** `q-mp-090ak`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1183` @ `748df394` (full `748df3941a500b313d7eba89750e631a87a73e40`; tip carries AGENTS tip pointer → `post1183`, round-36 backlog `10aj` folded as `docs(q-mp-090aj)`, and tip-folded helpers / aliases from rounds 34–36)  
**Depends on:** tip cut `cursor/mp-tip-post1183` @ `748df394`. Round-36 backlog (`q-mp-090aj` / tip-carried `10aj` + open `#1229`, ids `q-mp-967`…`980`) already has implementers on **this** tip (`#1230`–`#1237` and earlier `#1212`–`#1228`; remaining aj gaps without open PR at audit: `968`/`969`/`974`/`978`/`980`) — leave with `contained`. Round-35 ai gaps `942`/`953`/`956`/`957`/`959` — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1183` @ `748df394` measures suite **3391** files / **14580** listed cases; Chromium e2e **25** files / **249** cases; lint ratchet green (eqeqeq **1**/1 in `src/games/fiar/rules.ts` — HOLD); typecheck in-scope **0** / out-of-scope **216**; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 yes **0** on live dry-run (committed inventory still stale — see `1004`). This doc lists **16 new** concrete engineering tasks (`q-mp-992` … `q-mp-1007`) mined from the **live tip tree**, checked against prior refills (`q-mp-090` … `q-mp-090aj` / ids through `q-mp-980`) and against the full open draft PR list (including post1183 workers `#1212`–`#1237`, post1143 leftovers `#1195`–`#1211`, and post1083 leftovers `#1136`–`#1182`). It is the **only** deliverable of `q-mp-090ak`.

**Honest count:** Only **16** tasks — not padded to 25. Id range starts at `q-mp-992` per round-37 brief (`981`–`991` unused / reserved). Round-36 already claimed mutation empty `--max=`/`--games=`/`--json=`, lint-buckets `--top` hygiene, emit-identity flag-like refs, flake help-anywhere, `check:perf` docs exit claim, capture page-ready/dismissOwl + wait hygiene, `tests/playtest` artifact-dir/dismissOwl, lib main-entry for mutation-report-args/mobile-audit-out-path/pwa-manifest-contract + page-settle/artifact-dir/harness CLIs, graph-demo `clickEl`, coverage-map/licenses `--dry-run`, and copy-pins `--fail` footer — **do not** re-queue `967`–`980` (tip-carried `10aj` + open `#1229`/`#1230`–`#1237`; aj gaps `968`/`969`/`974`/`978`/`980` still need workers — leave with `contained`). Round-35 `942`–`959` and round-34 `917`–`938` remain owned. This refill **does not** re-queue page-ready / double-rAF / artifact-dir / mountPair adoptions, npm aliases, `--help` / `--dry-run` / unknown-flag argv sweeps, lib main-entry guards, per-game UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **src** or **mp3d e2e** edits, remasure/count-stamp inventories, tip-stamp docs, doc-pointer churn, overnight mountPair/router batches, script `waitForTimeout` families already owned by `803`–`807` / `883`/`884`/`909`/`937`/`938`/`951`/`952`/`973`, stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline fixed-wait clears (prior HOLD/skip), dismissOwl deep-playtest adoption (`879`), CI `e2e-cross-browser` named script (`800`), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK — not queued), knip unusedTypes baseline drop / Rank-3 demote remasure theater, or anything in rounds ≤36. Payoffs are freshly measured on this tip: **`engine-coverage-rank` succeeds on empty / non-engine summaries**, **`report-coverage-map` writes heat docs from `{}` / `[]`**, **`check-type-ratchet` passes when Phase-2 baseline is missing or `{}`**, **`check-lint-ratchet` throws TypeError on `{}` ceilings**, **`size:check` / `check:perf` exit 0 on broken `dist/index.html`**, **`report-knip` exits 0 (even with `--fail`) when knip cannot parse config**, **`check:build` with `CHECK_BUILD_SKIP_BUILD=1` and missing snapshots exits 0 with a stack**, **`render-perf-mode` / `runtime-perf` / `check-perf` validate env numbers before CLI help (contradicting “no side effects on import”)**, **wiki + testing-layers playtest rows still claim “no npm script” / 4 harnesses after five `playtest:*` aliases landed**, **committed dead-code inventory still claims `mockRouterNavigateModule` has zero importers (live: 56)**, **`report-coverage-map` dumps a stack on malformed JSON**, and **`offline-pwa` still uses fixed `setTimeout` sleeps**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings, boundaries/PWA installability thresholds, board-3d layout inventory, CI permissions, tip-pointer / tip-name sweep theater, open-draft triage, emit-identity inventory remasure, knip drift, dead-CSS Rank-1 rescan, coverage-map heat regenerate (except the empty-input reject in `993`), or wiki **count** stamps. **Avoid** competing tickets already owned by open `#1212`–`#1237` / `#1195`–`#1211` / `#1162`–`#1182` / tip-carried `10ag`/`10ah`/`10ai`/`10aj` ids. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

Skipped topics already covered by `q-mp-176`–`q-mp-980`, open drafts, or prior ids (non-exhaustive; `gh pr list --state open` 2026-10-11):

| Topic family | Why skipped |
| --- | --- |
| round-36 backlog / mutation empty `=` (`967`) / lint `--top` (`968`) / emit flag-like (`969`) / flake help-anywhere (`970`) / perf-doc exit (`971`) / capture page-ready+waits (`972`/`973`) / playtest artifact-dir (`974`) / lib main-entry (`975`/`980`) / graph `clickEl` (`976`) / coverage-map+licenses dry-run (`977`/`979`) / copy-pins `--fail` footer (`978`) | tip-carried `10aj` + workers `#1230`–`#1237` / `#1229`; aj gaps `968`/`969`/`974`/`978`/`980` still need workers — leave with `contained`; **do not** re-queue `967`–`980` (this refill’s `993`/`1005` are **only** empty/malformed summary wrong-results, not siblings of `977`’s `--dry-run`) |
| round-35 / empty `--files-from` (`942`) / lint unknown flags (`943`) / `perf:render` (`944`) / wiki cheat-sheets (`945`/`946`) / page-settle render-perf (`947`) / measureTTI (`948`) / mountPair burn-1008 (`949`) / fullgame helpers+waits (`950`–`952`) / kwatro mulberry (`953`) / e2e page-settle (`954`) / artifact-dir extract+adopters (`955`–`957`) / lib main-entry env/page/dismiss (`958`) / `perf:runtime:render` (`959`) | tip-carried `10ai` + workers `#1212`–`#1228`; ai gaps still need workers — leave with `contained` |
| round-34 / check:perf+engine-rank+render-perf-mode help (`917`–`919`) / page-settle extract (`920`) / page-ready+dismissOwl unit (`921`/`922`) / page-ready adopters (`923`–`925`) / npm aliases (`926`–`929`) / mountPair destroy+AI-input (`930`–`936`) / e2e waits (`937`/`938`) | tip-carried `10ah` + open `#1195`–`#1210` — leave with `contained` |
| round-33 / lint+type+pwa+dev-docs+size `--help` (`894`/`895`/`897`/`898`/`899`) / mountPair contig-end+fiar-timer+kings-touch (`903`–`905`) / other `892`–`911` | tip-carried `10ag` + `#1179`; ag gaps still need workers — leave with `contained` |
| round-32 / mutation argv (`867`/`868`) / emit missing-path (`869`) / lint-buckets `--top` missing value (`870`) / flake `--out` / … / offline help | open `#1162`–`#1182` on post1083 — leave with `contained` |
| page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv sweeps / lib main-entry | prompt hard-skip for round-37 (dominated rounds 34–36) |
| per-game UI coverage / soft-fail chars / mutation-audit waves / board-3d **src** / **mp3d e2e** / remasure inventories / tip-name stamps / `*types*` residuals / doc-pointer churn | prompt hard-skip |
| knip unusedExports LEAVE / unusedTypes baseline drop / wiki count cells / AGENTS tip name | remasure / tip-stamp theater / intentional LEAVE |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions widening / eqeqeq in `fiar/rules.ts` | hard-rule HOLD |
| stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline fixed waits | prior HOLD/skip (this refill’s `1006` is **only** `tests/e2e/offline-pwa.spec.ts`, not those harnesses) |
| dismissOwl deep-playtest local copies (`879`) | still needs a worker — **do not** sibling |
| CI `e2e-cross-browser` named script (`800`) | tip-queued; unworked — **do not** re-queue |
| emit-identity default wave5 merge-base tip retarget | tip-owner HOLD-CHECK — not queued |
| Rank-3 knip type demotes (`compat.ts` leftovers / `timer-scoring`) | prior unusedTypes batch chain + scoring HOLD — leave with `contained` |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening, apt, or network-in-tests work. No `memory/` files.

## Stale queue re-check (live tip `748df394`)

| Id | Title (short) | Verdict | Evidence @ `748df394` |
| --- | --- | --- | --- |
| `q-mp-090aj` / tip-carried `10aj` | round-36 backlog | **tip-carried** | Leave with `contained` — this refill starts after `980`. |
| `q-mp-968`/`969`/`974`/`978`/`980` | aj gaps without open PR | **still-valid; need workers** | Leave prior ids; do not sibling. |
| `q-mp-967`/`970`–`973`/`975`–`977`/`979` / `#1230`–`#1237` | aj implementers | **open / tip-folding** | Leave alone. |
| `q-mp-942`/`953`/`956`/`957`/`959` | ai gaps | **still-valid; need workers** | Leave prior ids; do not sibling. |
| `q-mp-917`–`938` / `#1195`–`#1210` | round-34 | **still-valid / tip-folding** | Leave alone. |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-879` | dismissOwl deep-playtest adopters | **still-valid; no open PR** | Leave prior id. |
| `q-mp-667`–`668` / `#1098` | wiki/testing-layers counts | **stale vs live 3391/14580** | **do not** re-queue count stamps; playtest *behavior* docs are `1002`/`1003`. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/engine-coverage-rank.mjs` | `992` only; leave open `#1212`/`928` npm alias alone |
| `scripts/report-coverage-map.mjs` | `993` + `1005` — serialize; leave open `#1234`/`977` `--dry-run` alone |
| `scripts/check-type-ratchet.mjs` + `docs/dev/type-ratchet-phase2-baseline.json` (read-only) | `994` only |
| `scripts/check-lint-ratchet.mjs` + `docs/dev/lint-ratchet-ceilings.json` (read-only) | `995` only |
| `scripts/check-bundle-budgets.mjs` | `996` only; leave ag `899` size `--help` alone |
| `scripts/check-perf.mjs` | `997` + `1001` — serialize; leave `#1230`/`971` docs-only + `#1203`/`917` help alone |
| `scripts/report-knip.mjs` | `998` only; leave `#1168`/`873` unknown-flag work alone |
| `scripts/check-build.mjs` + `docs/build-repro-2026-10-08.md` | `999` only; leave `#1171`/`874` help alone |
| `scripts/render-perf-mode.mjs` + `scripts/runtime-perf.mjs` | `1000` only; leave `#1199`/`919` + `#1222`/`948` alone |
| `docs/wiki/development.md` (playtest table only) | `1002` only; leave `#1215`/`945` cheat-sheet alone |
| `docs/dev/testing-layers-2026-10-09.md` (playtest section only) | `1003` only; leave count-stamp tickets alone |
| `docs/dev/dead-code-inventory.{md,json}` via `report-dead-code` | `1004` only; leave `#1155`/`817` DEFER-list alone |
| `tests/e2e/offline-pwa.spec.ts` | `1006` only; do not touch webkit/probe offline harnesses |

**Parallel-friendly:** `992`, `994`, `995`, `996`, `998`, `999`, `1000`, `1002`, `1003`, `1004`, `1006`. Serialize `993`→`1005` on coverage-map; serialize `997`→`1001` on check-perf; serialize `996` lightly with `997` if both touch `measureMenuCriticalPath`.

## Live tip measurements (evidence snapshot @ `748df394`)

```text
$ git rev-parse HEAD
  748df3941a500b313d7eba89750e631a87a73e40

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

$ npm run typecheck:ratchet
  in-scope errors:     0
  out-of-scope errors: 216

$ npm run report:knip
  unusedExports: 3  unusedTypes: 29  unlisted: 3  duplicates: 0  unusedFiles: 0
  (baseline unusedTypes still 36 — tip-owner ratchet; not queued here)

$ npm run report:dead-code -- --dry-run
  Safe-to-remove yes: 0
  (committed inventory.md still lists mockRouterNavigateModule as Rank-2 zero-importers)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3391

$ npx vitest list | wc -l
  14580

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ printf '{}' > /tmp/empty.json && node scripts/engine-coverage-rank.mjs /tmp/empty.json; echo $?
  → empty table; exit 0

$ printf '{}' > /tmp/empty.json && node scripts/report-coverage-map.mjs /tmp/empty.json; echo $?
  → wrote docs/dev/coverage-map.{md,svg}; exit 0

$ # type-ratchet with baseline '{}' (restored after)
  → Phase-2 ceiling: 216 ≤ baseline undefined; Type ratchet passed; exit 0

$ # type-ratchet with baseline file removed (restored after)
  → Type ratchet passed; exit 0 (Phase-2 skipped entirely)

$ # lint-ratchet with ceilings '{}' (restored after)
  → TypeError: Cannot convert undefined or null to object; exit 1

$ # size:check / check:perf with dist/index.html = <html></html> (restored after)
  → No menu JS/CSS refs found… (report-only: exiting 0); exit 0

$ # report-knip with knip.json = '{' (restored after), with and without --fail
  → [WARNING] knip report failed…; exit 0

$ CHECK_BUILD_SKIP_BUILD=1 node scripts/check-build.mjs; echo $?
  → check:build error: Error: dist-a/dist-b missing…; exit 0 (+ summary.md ERROR)

$ PERF_MOVES=abc node scripts/runtime-perf.mjs --help; echo $?
  → Invalid PERF_MOVES="abc"…; exit 2 (no usage)

$ PERF_LH_TIMEOUT_MS=abc node scripts/check-perf.mjs --help; echo $?
  → Invalid PERF_LH_TIMEOUT_MS="abc"…; exit 2 (no usage)

$ PERF_MOVES=abc node scripts/render-perf.mjs --help; echo $?
  → usage; exit 0  (good contrast)

$ rg -n 'no npm script|Playtest' docs/wiki/development.md docs/dev/testing-layers-2026-10-09.md
  → table/section still claim no npm script / 4 harnesses; cheat sheet lists 5 playtest:*

$ rg -l 'mockRouterNavigateModule' tests --glob '*.ts' | wc -l
  → 56  (inventory still says zero)

$ Open drafts into cursor/mp-tip-post1183 at audit: #1212–#1237
$ Open drafts into cursor/mp-tip-post1143 at audit: #1195–#1211
$ Open drafts into cursor/mp-tip-post1083 at audit: #1136–#1182
```

## New tasks

### q-mp-992 · Scripts: `engine-coverage-rank` reject empty / non-engine coverage summaries

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave open `#1212`/`928` npm alias + `#1204`/`918` help alone; leave `#1145`/`842` missing-file message alone)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong-results fix for empty/non-engine JSON; no coverage thresholds / AI edits
- **CI / package.json callers:** `package.json` → `report:engine-coverage-rank`; **not** a blocking CI job (local / docs helper)
- **target files:** `scripts/engine-coverage-rank.mjs`; optional `tests/unit/engine-coverage-rank*.test.ts`
- **measured baseline:** `node scripts/engine-coverage-rank.mjs` with `{}`, total-only summary, or non-engine `src/main.ts` rows prints an empty ranking table and exits **0** — looks like “no engine debt”. Missing file already exits **2** (good contrast).
- **acceptance criteria:** Summaries with zero matching engine rows (and/or no file entries besides `total`) exit **2** with a clear usage/empty-summary message before printing a fake empty rank; valid `coverage-summary.json` with engine rows unchanged; hermetic unit coverage OK; no `src/` edits.
- **verification commands:** `printf '{}' > /tmp/e.json; node scripts/engine-coverage-rank.mjs /tmp/e.json ; echo $?` ; `printf '{"total":{"lines":{"total":1,"covered":1,"skipped":0,"pct":100}}}' > /tmp/t.json; node scripts/engine-coverage-rank.mjs /tmp/t.json ; echo $?` ; `CI=1 npx vitest run tests/unit/engine-coverage-rank*.test.ts` (if present)
- **conflict notes:** do not sibling missing-file UX (`842`) or npm alias (`928`).

### q-mp-993 · Scripts: `report-coverage-map` reject empty / invalid-shape summaries (no doc writes)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (serialize with `1005` + open `#1234`/`977` `--dry-run`; leave `#1154`/`847` missing-summary message alone)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong-results / write-guard for garbage input; no heat regenerate required
- **CI / package.json callers:** `package.json` → `report:coverage-map`; **not** a blocking CI job (local / docs helper)
- **target files:** `scripts/report-coverage-map.mjs`; optional hermetic unit/spawn test
- **measured baseline:** `node scripts/report-coverage-map.mjs` with `{}` or `[]` prints `0 directories`, **writes** `docs/dev/coverage-map.{md,svg}`, exits **0**. Missing file exits **1** (good contrast).
- **acceptance criteria:** Empty / zero-directory / array-shaped summaries exit **1** (or **2**) with a clear message and **no** md/svg writes; valid coverage-summary path unchanged; leave `--dry-run` to `977`.
- **verification commands:** `printf '{}' > /tmp/c.json; node scripts/report-coverage-map.mjs /tmp/c.json ; echo $?` ; `printf '[]' > /tmp/a.json; node scripts/report-coverage-map.mjs /tmp/a.json ; echo $?` ; `rg -n 'writeFileSync|0 directories' scripts/report-coverage-map.mjs`
- **conflict notes:** rebase onto `#1234` if still open; do not regenerate heat as part of this ticket.

### q-mp-994 · Scripts: `check-type-ratchet` require numeric Phase-2 baseline (reject missing / `{}`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — CI `verify` / `typecheck:ratchet` gate hygiene only; no baseline number raise; no AI/rules scope edits
- **CI / package.json callers:** `package.json` → `typecheck:ratchet` (via `verify`); `.github/workflows/ci.yml` → blocking `lint` job → `npm run verify`
- **target files:** `scripts/check-type-ratchet.mjs`; optional tiny unit/spawn test; **do not** edit `docs/dev/type-ratchet-phase2-baseline.json` counts upward
- **measured baseline:** With Phase-2 file `{}`, script prints `Phase-2 ceiling: 216 ≤ baseline undefined` and **`Type ratchet passed.`** exit **0**. With the baseline file **removed**, Phase-2 is skipped entirely and exit **0**. Corrupt/missing baseline disables the out-of-scope ratchet.
- **acceptance criteria:** Missing file, non-JSON, or missing numeric `outOfScopeErrors` (or documented alias) exits **1** with a one-line schema/usage error and **no** “Type ratchet passed.”; valid baseline unchanged; in-scope **0** still required; no scope / tsconfig edits.
- **verification commands:** (temp `{}` / missing file, restore after) `node scripts/check-type-ratchet.mjs ; echo $?` ; `npm run typecheck:ratchet` ; `npm run verify` (or at least the typecheck:ratchet step)
- **conflict notes:** none; tip-owner may want to review before fold because it hardens a CI gate.
- **screen:** HOLD-CHECK — verify/CI gate; schema-only, baseline number must not rise.

### q-mp-995 · Scripts: `check-lint-ratchet` validate ceilings schema (no TypeError / ENOENT stack)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — CI `verify` / `lint:ratchet` gate hygiene only; no ceiling raises; no eslint product clears
- **CI / package.json callers:** `package.json` → `lint:ratchet` (via `verify`); `.github/workflows/ci.yml` → blocking `lint` job → `npm run verify`
- **target files:** `scripts/check-lint-ratchet.mjs`; optional tiny unit/spawn test; **do not** edit `docs/dev/lint-ratchet-ceilings.json` ceilings upward
- **measured baseline:** With ceilings file `{}`, script throws `TypeError: Cannot convert undefined or null to object` at `Object.keys(ceilings.rules)` and exits **1**. Missing file throws raw `ENOENT` stack. Failures are correct in spirit but noisy / easy to misread as probe flake.
- **acceptance criteria:** Missing / invalid / missing-`rules` ceilings exit **1** with a one-line “invalid ceilings file” message (no TypeError stack); valid ceilings path unchanged; ratchet math unchanged; no ceiling JSON edits in this ticket.
- **verification commands:** (temp `{}` / missing file, restore after) `node scripts/check-lint-ratchet.mjs ; echo $?` ; `npm run lint:ratchet`
- **conflict notes:** tip-owner review before fold (CI gate).
- **screen:** HOLD-CHECK — verify/CI gate; schema/error UX only.

### q-mp-996 · Scripts: `size:check` non-zero when `dist/index.html` has no menu JS/CSS refs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (serialize lightly with `997` if sharing `measureMenuCriticalPath`; leave ag `899`/`845` missing-`dist/` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — measurement/usage-error hygiene for broken `dist/`; soft known-OVER path unchanged when dist is valid
- **CI / package.json callers:** `package.json` → `size:check`; `.github/workflows/ci.yml` → `build` job → `npm run size:check -- --fail-on-new-over` (`continue-on-error: true`)
- **target files:** `scripts/check-bundle-budgets.mjs` (`measureMenuCriticalPath` / main catch); optional docs one-liner in `docs/wiki/development.md` if it still implies any existing `dist/` → exit 0
- **measured baseline:** With a built `dist/` then `dist/index.html` replaced by `<html></html>`, script prints `No menu JS/CSS refs found in dist/index.html` / `(report-only: exiting 0)` and exits **0**. Missing `dist/` already exits **2**.
- **acceptance criteria:** Menu parse / critical-path measure failure exits **2** (usage/measurement error) — not soft report-only 0; valid `dist/` after `npm run build` still exits **0** (or 1 only under `--fail-on-new-over` + novel OVER); no budget number edits.
- **verification commands:** `npm run build` ; (temp broken html, restore) `node scripts/check-bundle-budgets.mjs ; echo $?` ; `node scripts/check-bundle-budgets.mjs ; echo $?` (good dist)
- **conflict notes:** do not sibling missing-`dist/` work (`845`).

### q-mp-997 · Scripts: `check:perf` non-zero when menu critical path cannot be measured

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** prefer fold/co-land of `996` if shared helper; serialize with `1001`; leave `#1230`/`971` docs-only + `#1164`/`875` missing-`dist/` alone
- **series:** script-tooling
- **verdict:** **SAFE** — same broken-`dist/` class as `996`; not AI product timing
- **CI / package.json callers:** `package.json` → `check:perf`; **not** a blocking CI job (local / AGENTS helper; wiki documents report-only with dist)
- **target files:** `scripts/check-perf.mjs` (catch / measure path shared with budgets)
- **measured baseline:** Broken `dist/index.html` → `No menu JS/CSS refs found…`; exit **0**. Missing `dist/` → exit **2**. Wiki already documents missing → 2 / with dist report-only 0 — broken dist is the gap.
- **acceptance criteria:** Broken menu critical path exits non-zero (prefer **2**) without claiming report-only success; valid dist measurement path still report-only exit **0**; leave Lighthouse optional path alone; no Hex Hard / AI timing edits.
- **verification commands:** (temp broken html) `PERF_SKIP_LIGHTHOUSE=1 node scripts/check-perf.mjs ; echo $?` ; `node scripts/check-perf.mjs ; echo $?` (missing dist → 2)
- **conflict notes:** co-land carefully with `996`; do not rewrite `#1230` docs ticket beyond what’s needed if wiki one-liner must mention broken dist.

### q-mp-998 · Scripts: `report-knip` non-zero when knip cannot run / parse (honor `--fail`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave `#1168`/`873` unknown-flag work alone; do **not** drop unusedTypes baseline here)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong exit when knip spawn/parse fails; no baseline demote; no unusedExports LEAVE deletes
- **CI / package.json callers:** `package.json` → `report:knip`; `.github/workflows/ci.yml` → report-only `knip` job (`continue-on-error: true`)
- **target files:** `scripts/report-knip.mjs`
- **measured baseline:** With `knip.json` set to `{`, script prints `[WARNING] knip report failed (report-only): Failed to parse knip JSON` and exits **0** — including under `--fail`. Automation treating exit 0 as “knip clean” is wrong; growth detection never runs.
- **acceptance criteria:** Knip spawn/parse/config failure exits **1** (at least when `--fail` is set; prefer always **1** on tool failure while keeping “within baseline” success as **0**); successful knip run unchanged; no `--write-baseline` / metric edits in this ticket.
- **verification commands:** (temp broken `knip.json`, restore) `node scripts/report-knip.mjs ; echo $?` ; `node scripts/report-knip.mjs --fail ; echo $?` ; `npm run report:knip`
- **conflict notes:** CI knip stays report-only via `continue-on-error`; do not change workflow permissions.

### q-mp-999 · Scripts: `check:build` usage-exit when `CHECK_BUILD_SKIP_BUILD=1` and snapshots missing

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave `#1171`/`874` early `--help` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — usage-error exit hygiene; dual-build measurement path may stay report-only exit 0
- **CI / package.json callers:** `package.json` → `check:build`; **not** a blocking CI job (local / `docs/build-repro-2026-10-08.md` helper)
- **target files:** `scripts/check-build.mjs`; `docs/build-repro-2026-10-08.md` (SKIP missing-snapshot exit semantics)
- **measured baseline:** `CHECK_BUILD_SKIP_BUILD=1 node scripts/check-build.mjs` with no `test-results/build/dist-{a,b}` prints a stack (`Error: dist-a/dist-b missing…`), writes `summary.md` **ERROR (report-only exit 0)**, exits **0**. Missing `dist/` for size/perf is already exit **2** — inconsistent.
- **acceptance criteria:** Missing snapshots under SKIP exit **2** with a short usage message (no “passed” / no pretend report-only success); default dual-build measurement path may remain report-only exit **0** when builds run; `--help` unchanged; docs/build-repro SKIP section matches.
- **verification commands:** `rm -rf test-results/build/dist-a test-results/build/dist-b; CHECK_BUILD_SKIP_BUILD=1 node scripts/check-build.mjs ; echo $?` ; `node scripts/check-build.mjs --help ; echo $?` ; `rg -n 'CHECK_BUILD_SKIP|exit 2|always exit 0' scripts/check-build.mjs docs/build-repro-2026-10-08.md`
- **conflict notes:** do not make successful reproducibility diffs fail CI.

### q-mp-1000 · Scripts: defer `requireEnvNumber` off `render-perf-mode` import (fix `runtime-perf` / library contract)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave `#1199`/`919` main-entry usage + `#1222`/`948` measureTTI page-ready alone; leave tip-folded `876` NaN harness env alone)
- **series:** script-tooling
- **verdict:** **SAFE** — import side-effect / wrong-results under polluted env; not AI product timing; Hex Hard untouched
- **CI / package.json callers:** `package.json` → `perf:runtime`, `perf:render`; **not** blocking CI jobs (local perf helpers)
- **target files:** `scripts/render-perf-mode.mjs`; `scripts/runtime-perf.mjs` (import site); optional unit for lazy env read
- **measured baseline:** Module top-level `CPU_THROTTLE` / `HOVER_SAMPLES` / `MOVE_TARGET_RENDER = requireEnvNumber(...)` runs on import. Comment claims “Import-as-library path is unchanged (no side effects on import).” `PERF_MOVES=abc node scripts/runtime-perf.mjs --help` and `… render-perf-mode.mjs --help` exit **2** with invalid-env (no usage). Contrast: `PERF_MOVES=abc node scripts/render-perf.mjs --help` → exit **0** + usage.
- **acceptance criteria:** Importing `render-perf-mode` does not call `requireEnvNumber` / exit; env validated when measuring or in `main()` after help parse; `--help`/`-h` works under junk `PERF_*`; valid env measurement path unchanged; no product timing threshold edits.
- **verification commands:** `PERF_MOVES=abc node scripts/runtime-perf.mjs --help ; echo $?` ; `PERF_MOVES=abc node scripts/render-perf-mode.mjs --help ; echo $?` ; `PERF_MOVES=abc node scripts/render-perf.mjs --help ; echo $?` ; `node --check scripts/render-perf-mode.mjs scripts/runtime-perf.mjs`
- **conflict notes:** rebase onto `#1199`/`#1222` if still open; do not clear runtime-perf fixed waits (prior HOLD).

### q-mp-1001 · Scripts: `check:perf` parse `--help` before `PERF_LH_TIMEOUT_MS`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** serialize with `997`; leave `#1203`/`917` unknown-flag/help text alone if that draft still reshapes argv
- **series:** script-tooling
- **verdict:** **SAFE** — CLI ordering / wrong-results under stale env; not a new `--help` feature sweep
- **CI / package.json callers:** `package.json` → `check:perf`; **not** a blocking CI job
- **target files:** `scripts/check-perf.mjs`
- **measured baseline:** Module-level `LH_TIMEOUT_MS = requireEnvNumber('PERF_LH_TIMEOUT_MS', …)` runs before CLI parse. `PERF_LH_TIMEOUT_MS=abc node scripts/check-perf.mjs --help` exits **2** with invalid-env (no usage). Clean-env `--help` exits **0**.
- **acceptance criteria:** `--help`/`-h` prints usage and exits **0** even when `PERF_LH_TIMEOUT_MS` is invalid; invalid env still errors on real measurement runs; missing `dist/` still exit **2**; no Lighthouse threshold product edits.
- **verification commands:** `PERF_LH_TIMEOUT_MS=abc node scripts/check-perf.mjs --help ; echo $?` ; `node scripts/check-perf.mjs --help ; echo $?` ; `node scripts/check-perf.mjs ; echo $?`
- **conflict notes:** distinct from `917` (help exists; env ordering is the bug) and from `971` (docs-only).

### q-mp-1002 · Docs: wiki `development.md` playtest row matches live `playtest:*` scripts

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave `#1215`/`945` cheat-sheet + `#1213`/`927` package aliases alone — code already has 5 scripts; docs lag)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only; no harness / matrix / AI edits
- **CI / package.json callers:** n/a (docs only; scripts already exist)
- **target files:** `docs/wiki/development.md` (playtest table row ~L175; do not retarget tip-name / unit count cells)
- **measured baseline:** Cheat sheet lists **5** `npm run playtest:*` scripts. Table row still says **“4 `.mjs` harnesses”**, **“no npm script”**, and `node tests/playtest/…` only. Live: **5** `scripts/*-deep-playtest.mjs` + **2** `tests/playtest/*.mjs` + **15** `docs/playtest/*.md`.
- **acceptance criteria:** One playtest story: **5** `npm run playtest:*` → `scripts/*-deep-playtest.mjs`; separate mention of `tests/playtest/` (2) and `docs/playtest/` reports/probes; remove “no npm script”; **no** unit/e2e count remasure in this ticket.
- **verification commands:** `rg -n 'playtest:|no npm script|4 \.mjs|5 \.mjs' docs/wiki/development.md package.json` ; `ls scripts/*-deep-playtest.mjs | wc -l` ; `ls tests/playtest/*.mjs | wc -l`
- **conflict notes:** align wording with `1003`; leave `#1098`/`667` count stamps contained.

### q-mp-1003 · Docs: `testing-layers` playtest section — named scripts + correct harness paths

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** prefer fold/co-land of `1002`
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only factual correction; no count-stamp remasure required
- **CI / package.json callers:** n/a (docs only)
- **target files:** `docs/dev/testing-layers-2026-10-09.md` (§ Playtest — “no npm script” / 4 harnesses under `tests/playtest/`)
- **measured baseline:** Section claims **no** `package.json` playtest script and **4** runnable `.mjs` under `tests/playtest/` (+ docs probes). Live: **5** named scripts; **5** under `scripts/`; **2** under `tests/playtest/`; **15** `docs/playtest/*.md`.
- **acceptance criteria:** Document `npm run playtest:*`, split **scripts/** vs **tests/playtest/** vs **docs/playtest/**; drop “no npm script”; leave unit/e2e count tables to tip-owner remasure tickets.
- **verification commands:** `rg -n 'no npm script|playtest:|Runnable harnesses' docs/dev/testing-layers-2026-10-09.md` ; `ls scripts/*-deep-playtest.mjs docs/playtest/*.mjs tests/playtest/*.mjs 2>/dev/null | wc -l`
- **conflict notes:** co-land with `1002`; do not open a third tip-name stamp ticket.

### q-mp-1004 · Scripts/docs: regenerate `dead-code-inventory` (stale `mockRouterNavigateModule` zero-importers)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave `#1155`/`817` DEFER-list + `#1129`–`#1131`/`819`–`821` adoption/delete chain alone)
- **series:** docs-accuracy
- **verdict:** **SAFE** — regenerate committed inventory via existing script; no `src/` deletes; no helper API edits
- **CI / package.json callers:** `package.json` → `report:dead-code`; **not** a blocking CI job
- **target files:** `docs/dev/dead-code-inventory.md`; `docs/dev/dead-code-inventory.json` (via `npm run report:dead-code`)
- **measured baseline:** Committed inventory ranks `tests/unit/helpers/router-mock.ts` → `mockRouterNavigateModule` as Rank-2 **deferred** with evidence “grep: no references outside defining module”. Live `rg -l 'mockRouterNavigateModule' tests --glob '*.ts' | wc -l` → **56**. Live `npm run report:dead-code -- --dry-run` → Safe-to-remove yes: **0** (scanner already correct; docs stale).
- **acceptance criteria:** Regenerated inventory matches live dry-run (no false zero-importer Rank-2 for `mockRouterNavigateModule`); no symbol deletions; leave adoption/delete to `819`–`821`.
- **verification commands:** `npm run report:dead-code` ; `rg -n 'mockRouterNavigateModule' docs/dev/dead-code-inventory.md` ; `rg -l 'mockRouterNavigateModule' tests --glob '*.ts' | wc -l` ; `npm run report:dead-code -- --dry-run`
- **conflict notes:** do not delete the helper; do not sibling overnight adoption batches.

### q-mp-1005 · Scripts: `report-coverage-map` malformed JSON — stable message (no stack)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** prefer fold/co-land of `993`; serialize with open `#1234`/`977`
- **series:** script-tooling
- **verdict:** **SAFE** — error UX only; exit stays non-zero; no heat regenerate
- **CI / package.json callers:** `package.json` → `report:coverage-map`; **not** a blocking CI job
- **target files:** `scripts/report-coverage-map.mjs` (`main` catch / `writeReport` parse)
- **measured baseline:** `printf '{' > /tmp/bad.json; node scripts/report-coverage-map.mjs /tmp/bad.json` prints `report:coverage-map error: SyntaxError:…` **plus stack**, exit **1**. Contrast: `engine-coverage-rank` on the same file exits **2** with a short parse error + usage (no stack).
- **acceptance criteria:** Malformed JSON → short message + hint (no stack), exit **1** (or **2** if aligned with engine-rank); no doc writes; valid summary unchanged.
- **verification commands:** `printf '{' > /tmp/bad.json; node scripts/report-coverage-map.mjs /tmp/bad.json ; echo $?` ; `node scripts/engine-coverage-rank.mjs /tmp/bad.json ; echo $?`
- **conflict notes:** co-land with `993` OK; leave `#1154`/`847` missing-file copy alone.

### q-mp-1006 · E2E: replace fixed `setTimeout` sleeps in `offline-pwa` (2 sites)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (do **not** touch webkit-offline / probe-offline harnesses — prior HOLD/skip)
- **series:** test-hygiene
- **verdict:** **SAFE** — Chromium e2e wait hygiene only; asserts + case counts unchanged; not mp3d / AI timing
- **CI / package.json callers:** `package.json` → `test:e2e:chromium` (blocking `e2e` job includes this spec under chromium smoke when not `@fullgame`-only filtered — file is in `tests/e2e/`); local `npm run test:e2e:chromium -- tests/e2e/offline-pwa.spec.ts`
- **target files:** `tests/e2e/offline-pwa.spec.ts`
- **measured baseline:** Two fixed delays: `await new Promise((r) => setTimeout(r, 250))` and `… 500)`; heavy case uses `test.setTimeout(120_000)`. Not in the prior HOLD list for webkit/probe offline script waits.
- **acceptance criteria:** Replace fixed sleeps with Playwright condition waits (`waitForFunction` / locator / network / SW hooks) where straightforward; same asserts; no mp3d edits; no service-worker product changes beyond test waits.
- **verification commands:** `rg -n 'setTimeout' tests/e2e/offline-pwa.spec.ts` ; `npm run test:e2e:chromium -- tests/e2e/offline-pwa.spec.ts`
- **conflict notes:** leave `scripts/webkit-offline-probe.mjs` / `probe-offline-resilience-*.mjs` alone.

### q-mp-1007 · Docs: `docs/build-repro-2026-10-08.md` SKIP-missing exit after `999`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** prefer fold/co-land of `999` (or land docs in the same PR as `999` and **skip** opening this id separately)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only; only needed if `999` lands without updating build-repro
- **CI / package.json callers:** n/a (docs only; script `check:build` already exists)
- **target files:** `docs/build-repro-2026-10-08.md`
- **measured baseline:** Doc says `npm run check:build … always exit 0` and documents `CHECK_BUILD_SKIP_BUILD=1` without saying missing snapshots are a usage error. After `999`, SKIP-missing should be exit **2**.
- **acceptance criteria:** Doc distinguishes (a) successful dual-build report-only exit 0 vs (b) SKIP without snapshots → non-zero usage error; no tip-name / count edits.
- **verification commands:** `rg -n 'always exit 0|CHECK_BUILD_SKIP|exit 2' docs/build-repro-2026-10-08.md scripts/check-build.mjs` ; `CHECK_BUILD_SKIP_BUILD=1 node scripts/check-build.mjs ; echo $?`
- **conflict notes:** Prefer merging into `999`’s PR; only open this id if `999` already folded docs-less.

## Verdict summary

| Id | Verdict | One-line |
| --- | --- | --- |
| `q-mp-992` | **SAFE** | engine-coverage-rank empty/non-engine → exit 2 |
| `q-mp-993` | **SAFE** | coverage-map empty/invalid shape → no writes |
| `q-mp-994` | **HOLD-CHECK** | type-ratchet require numeric Phase-2 baseline |
| `q-mp-995` | **HOLD-CHECK** | lint-ratchet schema / no TypeError stack |
| `q-mp-996` | **SAFE** | size:check broken menu html → exit 2 |
| `q-mp-997` | **SAFE** | check:perf broken menu html → non-zero |
| `q-mp-998` | **SAFE** | report-knip tool failure → non-zero (honor `--fail`) |
| `q-mp-999` | **SAFE** | check:build SKIP missing snapshots → exit 2 |
| `q-mp-1000` | **SAFE** | render-perf-mode defer env (fix runtime-perf help) |
| `q-mp-1001` | **SAFE** | check:perf help before PERF_LH_TIMEOUT_MS |
| `q-mp-1002` | **SAFE** | wiki playtest row ↔ 5 `playtest:*` scripts |
| `q-mp-1003` | **SAFE** | testing-layers playtest section paths/scripts |
| `q-mp-1004` | **SAFE** | regenerate dead-code inventory (stale mockRouter row) |
| `q-mp-1005` | **SAFE** | coverage-map malformed JSON → no stack |
| `q-mp-1006` | **SAFE** | offline-pwa replace 2 fixed setTimeout sleeps |
| `q-mp-1007` | **SAFE** | build-repro docs for SKIP-missing (prefer with `999`) |

**Screened HOLD-CHECK (2):** `994`, `995` — CI `verify` gate schema only; tip-owner should skim before fold.  
**No HOLD** product tickets queued.

## Out of scope / not used here

Already claimed / undrafted / HOLD / no headroom / prompt-skipped families: void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets probe (`792`), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki count remasure, tip-name stamps, UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e**, harness shards, demo coverage, `*types*` residuals, page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv sweeps / lib main-entry (rounds 34–36), deep-playtest `waitForTimeout` (`803`–`807`), overnight mountPair/router batches, round-31…36 tickets through `q-mp-980`, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline wait clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK), Queens & Guards product, AI timing / Hex Hard 450ms / Stars & Bars history cap.

**Could not honestly fill to 25** without filler (more `--help`/`--dry-run`/argv theater, mountPair adoptions, npm aliases, tip-stamp remasures, or HOLD AI/scoring/board-3d work). Stopped at **16**.
