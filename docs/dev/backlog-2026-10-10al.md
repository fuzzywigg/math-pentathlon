# Engineering backlog — 2026-10-10al (tip refill after post1218 cut / round-38)

**Task id:** `q-mp-090al`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1218` @ `f9597801` (full `f959780145be63d60b7c2cd31e26bfcd75484b9b`; tip carries AGENTS tip pointer still → `post1183`, round-37 backlog `10ak` + open `#1238`, and tip-folded round-34/35 helpers from `#1218`)  
**Depends on:** tip cut `cursor/mp-tip-post1218` @ `f9597801`. Round-37 backlog (`q-mp-090ak` / open `#1238`, ids `q-mp-992`…`1007`) already has implementers (`#1230`–`#1237` leftovers on post1183 plus fresh post1218 workers for `992`/`993`/`1001`/`1002`/`1003`/… observed in Actions) — leave with `contained`. Round-36 aj gaps `968`/`969`/`974`/`978`/`980` and older stacks — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1218` @ `f9597801` measures unit files **3392** / Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 **yes: 0** / unusedFiles **0** on live dry-run (committed inventory still stale — leave `1004`). This doc lists **11 new** concrete engineering tasks (`q-mp-1008` … `q-mp-1018`) mined from the **live tip tree**, checked against prior refills through `q-mp-1007` and against the open draft PR list (post1218 tip `#1239`, post1183 workers `#1212`–`#1238`, post1083 leftovers `#1136`–`#1182`). It is the **only** deliverable of `q-mp-090al`.

**Honest count:** Only **11** tasks — not padded to 25. Id range starts at `q-mp-1008` (after round-37 `992`…`1007`; `981`–`991` remain unused / reserved). Round-37 already claimed engine-rank/coverage-map empty+malformed, type/lint ratchet schema, size/perf broken-menu html, knip tool-failure exit, check-build SKIP-missing, render-perf-mode env defer, check-perf help-before-env, wiki/testing-layers playtest rows, dead-code inventory regen, offline-pwa sleeps, build-repro docs — **do not** re-queue `992`–`1007`. This refill **does not** re-queue page-ready / double-rAF / artifact-dir / mountPair adoptions, npm aliases, `--help` / `--dry-run` / unknown-flag argv sweeps, lib main-entry, tip-stamp **count** remasures, knip unusedTypes baseline drop, Rank-3 demote theater, CI `e2e-cross-browser` named script (`800`), dismissOwl deep-playtest (`879`), deep-playtest `waitForTimeout` families already owned by `803`–`807` / `883`/`884`/`909`/`937`/`938`/`951`/`952`/`973`, stars-bars / nav-away / memory-leak / runtime-perf / webkit-offline / probe-offline fixed waits (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK — not queued), historical backlog missing-path citation theater, or anything in rounds ≤37.

**Fresh payoffs on this tip:** **`AGENTS.md` still points agents at `cursor/mp-tip-post1183` while live tip is `post1218`**, **`.github/copilot-instructions.md` still targets `cursor/mp-tip-post477`**, **AGENTS / CONTRIBUTING / wiki / copilot / mermaid equate `npm run verify` with the full CI `lint` job while live `ci.yml` also runs report-only `check:copy-pins -- --fail`**, **`report-knip` with baseline `{}` prints “no baseline file”**, **`report-licenses` dumps a SyntaxError stack on corrupt `package-lock.json`**, **`size:check --fail-on-new-over` with budgets `{}` exits 0 after warning every game `NO BUDGET`**, **`tests/playtest/star-track-deep-playtest.mjs` still has 2 fixed `waitForTimeout`s**, and **`docs/playtest/{fraction-pinball-deep-playtest,hex-deep-probe}.mjs` still sleep**.

**Preference:** SAFE, mutually independent **docs-only** accuracy, **scripts/** wrong-results fixes, or **tests-only** flake hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, emit-identity inventory remasure, knip drift, dead-CSS Rank-1 rescan, or wiki **count** cells. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

| Topic family | Why skipped |
| --- | --- |
| round-37 / engine-rank empty (`992`) / coverage-map empty+malformed (`993`/`1005`) / type+lint ratchet schema (`994`/`995`) / size+perf broken html (`996`/`997`) / knip tool fail (`998`) / check-build SKIP (`999`) / render-perf-mode env (`1000`) / check-perf help-env (`1001`) / playtest docs (`1002`/`1003`) / dead-code regen (`1004`) / offline-pwa sleeps (`1006`) / build-repro docs (`1007`) | open `#1238` + implementers — leave with `contained`; **do not** re-queue `992`–`1007` |
| round-36…32 / page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / lib main-entry | prompt hard-skip + open drafts — leave with `contained` |
| CI `e2e-cross-browser` named script (`800`) / dismissOwl deep-playtest (`879`) | tip-queued; unworked — **do not** re-queue |
| deep-playtest waits `803`–`807` / capture+fullgame+e2e waits owned ids | leave prior ids; this refill’s `1015`/`1016` are **only** star-track + docs/playtest probes not in those lists |
| knip unusedExports LEAVE / unusedTypes baseline drop / Rank-3 demotes / dead-code Rank-2 yes (live **0**) / unusedFiles **0** | no SAFE deletes; remasure theater skipped |
| historical backlog missing-path noise (`check:dev-docs` on `10ac`/`10ae`/`10af`) | intentional examples — no citation theater |
| emit-identity wave5 merge-base tip retarget | tip-owner HOLD-CHECK — not queued |
| size:check `--help` (`899`) / missing `dist/` (`845`) | leave prior ids; this refill’s `1013` is **only** empty/invalid **budgets schema** under `--fail-on-new-over` |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions / eqeqeq in `fiar/rules.ts` | hard-rule HOLD |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `f9597801`)

| Id | Title (short) | Verdict | Evidence @ `f9597801` |
| --- | --- | --- | --- |
| `q-mp-090ak` / `#1238` | round-37 backlog | **open / tip-folding** | Leave with `contained` — this refill starts after `1007`. |
| `q-mp-992`…`1007` implementers | ak workers | **open / in Actions** | Leave alone. |
| `q-mp-968`/`969`/`974`/`978`/`980` | aj gaps | **still-valid; need workers** | Leave prior ids; do not sibling (esp. `974` vs this refill’s `1015`). |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-879` | dismissOwl deep-playtest adopters | **still-valid; no open PR** | Leave prior id. |
| Dead-code Rank-2 yes | live dry-run | **0 yes** | No SAFE delete ticket; inventory regen stays `1004`. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `AGENTS.md` | `1008` + `1010` — serialize (tip name then lint-job copy-pins row) |
| `.github/copilot-instructions.md` | `1009` only |
| `CONTRIBUTING.md` + `docs/wiki/development.md` (CI posture / verify lines) + `docs/dev/ci-gates-mermaid-q-mp-073.md` | `1010` only; leave `#1215`/`945` cheat-sheet + `#1002`/`1003` playtest rows alone |
| `scripts/report-knip.mjs` | `1011` only; leave `#1238`/`998` knip **tool** failure alone; leave `#1168`/`873` unknown-flag alone |
| `scripts/report-licenses.mjs` | `1012` only; leave open `#1236`/`979` `--dry-run` alone |
| `scripts/check-bundle-budgets.mjs` + `docs/bundle-budget.md` + `bundle-budgets.json` (read-only) | `1013` only; leave `996` broken-menu html + ag `899` `--help` alone |
| `tests/unit/workflow-contract.test.ts` (or sibling) | `1014` only |
| `tests/playtest/star-track-deep-playtest.mjs` | `1015` only; serialize with open `#`/`974` artifact/dismiss |
| `docs/playtest/fraction-pinball-deep-playtest.mjs` + `docs/playtest/hex-deep-probe.mjs` | `1016` only |

**Parallel-friendly:** `1009`, `1011`, `1012`, `1013`, `1014`, `1016`. Serialize `1008`→`1010` on `AGENTS.md`; serialize `1015` lightly with `974`.

## Live tip measurements (evidence snapshot @ `f9597801`)

```text
$ git rev-parse HEAD
  f959780145be63d60b7c2cd31e26bfcd75484b9b

$ git branch --show-current
  cursor/mp-tip-post1218

$ rg -n 'mp-tip-post' AGENTS.md
  → cursor/mp-tip-post1183 (Purpose + Draft PR lines)

$ rg -n 'mp-tip-post' .github/copilot-instructions.md
  → cursor/mp-tip-post477

$ rg -n 'check:copy-pins' .github/workflows/ci.yml
  → lint job step: npm run check:copy-pins -- --fail (continue-on-error: true)

$ rg -n 'npm run verify|copy-pins' AGENTS.md CONTRIBUTING.md docs/wiki/development.md .github/copilot-instructions.md docs/dev/ci-gates-mermaid-q-mp-073.md
  → verify listed as full lint job; copy-pins absent from lint-job / CI posture / mermaid lint row

$ printf '{}' > /tmp/kb.json && cp docs/dev/knip-baseline.json /tmp/kb.bak && cp /tmp/kb.json docs/dev/knip-baseline.json
$ node scripts/report-knip.mjs; echo $?
  → [NOTICE] knip report (no baseline file): exports=3, types=29, files=0; exit 0
  (restore baseline after)

$ cp package-lock.json /tmp/pl.bak && printf '{' > package-lock.json
$ node scripts/report-licenses.mjs --dry-run; echo $?
  → SyntaxError stack; exit 1
  (restore lock after)

$ npm run build   # dist present
$ cp bundle-budgets.json /tmp/bb.bak && printf '{}' > bundle-budgets.json
$ node scripts/check-bundle-budgets.mjs --fail-on-new-over; echo $?
  → ::warning::Bundle budget gap — game-* (NO BUDGET) × many; exit 0
  (restore budgets after)

$ rg -n 'waitForTimeout' tests/playtest/star-track-deep-playtest.mjs
  → 2 sites (50ms, 40ms)

$ rg -n 'waitForTimeout' docs/playtest/fraction-pinball-deep-playtest.mjs docs/playtest/hex-deep-probe.mjs
  → fraction-pinball 4 sites; hex-deep-probe 1×800ms

$ npm run report:dead-code -- --dry-run
  → Safe-to-remove yes: 0; unusedFiles path via knip: 0

$ npm run report:knip
  → unusedExports: 3  unusedTypes: 29  unusedFiles: 0

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3392

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files
```

## New tasks

### q-mp-1008 · Docs: `AGENTS.md` tip pointer → `cursor/mp-tip-post1218`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (serialize with `1010` if both touch `AGENTS.md`)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only tip **name** retarget; **no** unit/e2e count remasure
- **CI / package.json callers:** n/a (docs only)
- **target files:** `AGENTS.md` (Purpose tip line + Draft PR target line only)
- **measured baseline:** Live branch `cursor/mp-tip-post1218` @ `f9597801`. `AGENTS.md` still says `cursor/mp-tip-post1183` in Purpose and Draft PR sections. Agents opening drafts against the stale tip name miss the live fold target.
- **acceptance criteria:** Both agent-facing tip strings become `cursor/mp-tip-post1218`; no CI table / count / ratchet edits in this ticket (leave those to `1010` if needed).
- **verification commands:** `git branch --show-current` ; `git rev-parse HEAD` ; `rg -n 'mp-tip-post' AGENTS.md`
- **conflict notes:** not a wiki/testing-layers **count** stamp; distinct from contained `#1098`/`667`–`668`.

### q-mp-1009 · Docs: `.github/copilot-instructions.md` tip `post477` → `post1218` (+ verify ≠ full lint job)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** prefer fold/co-land of `1008` for tip-name consistency
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only; Copilot/agent entrypoint is wildly stale (`post477`)
- **CI / package.json callers:** n/a (docs only)
- **target files:** `.github/copilot-instructions.md` (Draft PR tip line ~L18; CI lint-job chain line ~L28)
- **measured baseline:** Draft PR line targets **`cursor/mp-tip-post477`**. Lint-job line claims `npm run verify` “Matches `.github/workflows/ci.yml` job `lint`” but live lint job also runs `npm run check:copy-pins -- --fail` (`continue-on-error: true`) after verify.
- **acceptance criteria:** Tip → `cursor/mp-tip-post1218`; verify sentence distinguishes verify chain vs extra report-only copy-pins step; no product/script edits.
- **verification commands:** `rg -n 'mp-tip-post|npm run verify|copy-pins' .github/copilot-instructions.md .github/workflows/ci.yml`
- **conflict notes:** co-land tip name with `1008`; copy-pins wording should match `1010`.

### q-mp-1010 · Docs: CI lint job includes report-only `check:copy-pins` (AGENTS / CONTRIBUTING / wiki / mermaid)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** prefer fold/co-land of `1008`/`1009` for AGENTS/copilot overlap
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only factual CI map; **no** workflow edits; **no** making copy-pins blocking
- **CI / package.json callers:** n/a (documents existing `ci.yml` lint step + `package.json` → `check:copy-pins`)
- **target files:** `AGENTS.md` (CI gates table / Local verify wording); `CONTRIBUTING.md` (verify = lint-job claim); `docs/wiki/development.md` (cheat-sheet verify line + CI posture bullet ~L130); `docs/dev/ci-gates-mermaid-q-mp-073.md` (lint job “Catches” / local reproduce row)
- **measured baseline:** Live `.github/workflows/ci.yml` lint job: `npm run verify` then report-only `npm run check:copy-pins -- --fail` with `continue-on-error: true`. AGENTS blocking-lint row, CONTRIBUTING “same order as lint”, wiki verify cheat-sheet / CI posture, and mermaid lint row omit copy-pins.
- **acceptance criteria:** Each surface states verify chain **plus** report-only copy-pins step (still non-blocking); mermaid job graph may note the soft step without renaming jobs; no `ci.yml` edits; no tip-count remasure.
- **verification commands:** `rg -n 'check:copy-pins|npm run verify' AGENTS.md CONTRIBUTING.md docs/wiki/development.md docs/dev/ci-gates-mermaid-q-mp-073.md .github/workflows/ci.yml`
- **conflict notes:** leave `#1215`/`945` cheat-sheet script names alone; leave `1002`/`1003` playtest rows alone.

### q-mp-1011 · Scripts: `report-knip` require numeric baseline `metrics` (reject `{}` / invalid)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave `#1238`/`998` knip **spawn/parse** failure alone; leave `#1168`/`873` unknown flags alone; **do not** drop unusedTypes baseline here)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong-results / schema message when baseline file exists but lacks metrics; no unusedExports LEAVE deletes
- **CI / package.json callers:** `package.json` → `report:knip`; `.github/workflows/ci.yml` → report-only `knip` job (`continue-on-error: true`)
- **target files:** `scripts/report-knip.mjs` (`loadBaseline` / metrics guard); optional hermetic unit
- **measured baseline:** With `docs/dev/knip-baseline.json` set to `{}`, script prints `[NOTICE] knip report (no baseline file): exports=3, types=29, files=0` and exits **0** — file exists; drift vs baseline never runs. Malformed `{` also collapses to the same “no baseline file” path via catch→null.
- **acceptance criteria:** Present-but-invalid baseline (missing/non-object `metrics`, non-numeric tracked keys, or JSON parse error) prints a clear **invalid baseline** message (not “no baseline file”); prefer exit **1** at least under `--fail` (align with `998` tool-failure posture if that lands first); truly missing file may keep today’s notice; successful knip+valid baseline unchanged; no `--write-baseline` / metric number edits in this ticket.
- **verification commands:** (temp `{}` / `{`, restore) `node scripts/report-knip.mjs ; echo $?` ; `node scripts/report-knip.mjs --fail ; echo $?` ; `npm run report:knip`
- **conflict notes:** rebase onto `998` if still open; distinct bug class (baseline schema vs knip tool failure).

### q-mp-1012 · Scripts: `report-licenses` malformed `package-lock.json` — stable message (no stack)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (serialize lightly with open `#1236`/`979` `--dry-run`)
- **series:** script-tooling
- **verdict:** **SAFE** — error UX only; exit stays non-zero; no SBOM regenerate required
- **CI / package.json callers:** `package.json` → `report:licenses`; **not** a blocking CI job
- **target files:** `scripts/report-licenses.mjs` (`main` lock parse)
- **measured baseline:** `printf '{' > package-lock.json; node scripts/report-licenses.mjs --dry-run` → raw `SyntaxError` **stack**, exit **1**. Contrast: `engine-coverage-rank` on bad JSON exits **2** with a short parse error + usage (no stack) after tip-folded help work.
- **acceptance criteria:** Malformed / unreadable lock → short message + hint (no stack), exit **1** (or **2** if aligned with other CLIs); `--dry-run` / `--help` unchanged; valid lock path unchanged; no license policy edits.
- **verification commands:** (temp corrupt lock, restore) `node scripts/report-licenses.mjs --dry-run ; echo $?` ; `node scripts/report-licenses.mjs --help ; echo $?`
- **conflict notes:** rebase onto `#1236` if still open; leave missing-lock usage path alone if already friendly.

### q-mp-1013 · Scripts: `size:check` reject empty / invalid `bundle-budgets.json` (esp. `--fail-on-new-over`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave `#1238`/`996` broken-menu html alone; leave ag `899`/`845` `--help` / missing-`dist/` alone)
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — CI `build` soft step uses `size:check -- --fail-on-new-over`; empty budgets currently disable the ratchet while exiting 0
- **CI / package.json callers:** `package.json` → `size:check`; `.github/workflows/ci.yml` → `build` job → `npm run size:check -- --fail-on-new-over` (`continue-on-error: true`)
- **target files:** `scripts/check-bundle-budgets.mjs`; `docs/bundle-budget.md` (Exit codes section currently blesses parse failures → 0)
- **measured baseline:** With valid `dist/` and budgets file `{}`, `node scripts/check-bundle-budgets.mjs --fail-on-new-over` prints `NO BUDGET` warnings for every game chunk and exits **0**. Corrupt `{` hits the main catch → `(report-only: exiting 0)`. Missing `dist/` already exits **2** (good contrast). Docs (`docs/bundle-budget.md`) explicitly say other parse failures exit 0.
- **acceptance criteria:** Missing/unreadable/non-object budgets, or object lacking usable `menuCriticalPath` / `games` schema, exits **2** (usage/schema error) with a one-line message — including under `--fail-on-new-over`; valid committed `bundle-budgets.json` after `npm run build` unchanged; **do not** raise budget numbers or grow `knownOvers`; update `docs/bundle-budget.md` exit table to match.
- **verification commands:** `npm run build` ; (temp `{}` / `{`, restore) `node scripts/check-bundle-budgets.mjs --fail-on-new-over ; echo $?` ; `node scripts/check-bundle-budgets.mjs ; echo $?` (good budgets)
- **conflict notes:** tip-owner skim before fold (soft CI gate hygiene); do not sibling `996` menu-html path.
- **screen:** HOLD-CHECK — build-job soft gate; schema-only.

### q-mp-1014 · Tests: workflow contract asserts lint job runs report-only `check:copy-pins`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (docs `1010` optional; test can land first)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only contract pin on existing CI YAML; no workflow permission edits
- **CI / package.json callers:** `package.json` → `test:unit` (blocking `unit` job)
- **target files:** `tests/unit/workflow-contract.test.ts` and/or a tiny sibling under `tests/unit/*ci*`
- **measured baseline:** Live `ci.yml` lint job includes copy-pins `--fail` + `continue-on-error: true`. Existing workflow-contract / overnight CI handshake tests assert `npm run verify` but **do not** pin the copy-pins soft step — docs can drift again unnoticed.
- **acceptance criteria:** Hermetic test reads `.github/workflows/ci.yml` and asserts lint job contains `check:copy-pins` with `--fail` and `continue-on-error: true` (or equivalent structural parse); no `ci.yml` edits; no permissions widening.
- **verification commands:** `CI=1 npx vitest run --project unit-node tests/unit/workflow-contract.test.ts` (or new file path); `rg -n 'copy-pins' tests/unit .github/workflows/ci.yml`
- **conflict notes:** orthogonal to `1010` docs; do not change copy-pins product scanner.

### q-mp-1015 · Playtest: replace fixed `waitForTimeout` in `star-track-deep-playtest` (2 sites)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** serialize with open aj `974` (artifact-dir/dismissOwl on same file)
- **series:** test-hygiene
- **verdict:** **SAFE** — local playtest harness wait hygiene; not CI e2e; not mp3d / AI product timing
- **CI / package.json callers:** n/a (not a CI job; harness under `tests/playtest/`; no `playtest:star-track` npm script today)
- **target files:** `tests/playtest/star-track-deep-playtest.mjs`
- **measured baseline:** Two fixed delays: `await page.waitForTimeout(50)` and `await page.waitForTimeout(40)`. Not covered by `803`–`807` (those own `scripts/*-deep-playtest.mjs`) or by `1006` (offline-pwa e2e).
- **acceptance criteria:** Replace fixed sleeps with condition waits (status / locator / rAF) preserving playtest outcomes and artifact behavior; no `src/` edits; leave Stars & Bars / Hex Hard alone.
- **verification commands:** `rg -n 'waitForTimeout' tests/playtest/star-track-deep-playtest.mjs` ; `node --check tests/playtest/star-track-deep-playtest.mjs`
- **conflict notes:** rebase onto `974` if still open; do not touch `scripts/stars-bars-deep-playtest.mjs` (prior HOLD/skip).

### q-mp-1016 · Playtest: replace fixed `waitForTimeout` in `docs/playtest` fraction-pinball + hex-deep probes

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — docs/playtest probe scripts only; not CI; not `scripts/*` families owned by `803`–`807`
- **CI / package.json callers:** n/a (local probes under `docs/playtest/`)
- **target files:** `docs/playtest/fraction-pinball-deep-playtest.mjs`; `docs/playtest/hex-deep-probe.mjs`
- **measured baseline:** `fraction-pinball-deep-playtest.mjs` — 4× `waitForTimeout` (50/80/200/1500ms). `hex-deep-probe.mjs` — 1× `waitForTimeout(800)`. Not in prior HOLD list for stars-bars / nav-away / memory-leak / offline probes.
- **acceptance criteria:** Condition waits for ready/status/clickable gates; same probe success criteria; no Hex Hard / AI product timing edits; no `src/` edits.
- **verification commands:** `rg -n 'waitForTimeout' docs/playtest/fraction-pinball-deep-playtest.mjs docs/playtest/hex-deep-probe.mjs` ; `node --check docs/playtest/fraction-pinball-deep-playtest.mjs docs/playtest/hex-deep-probe.mjs`
- **conflict notes:** leave `scripts/calla-deep-playtest.mjs` / `par-55` / stars-bars waits to prior ids / HOLD.

### q-mp-1017 · Docs: `docs/bundle-budget.md` exit table after `1013` (empty/invalid budgets)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** prefer fold/co-land of `1013` (or land docs in the same PR as `1013` and **skip** opening this id separately)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only; only needed if `1013` lands without updating bundle-budget.md
- **CI / package.json callers:** n/a (docs only; script `size:check` already exists)
- **target files:** `docs/bundle-budget.md` (Exit codes section)
- **measured baseline:** Doc says other measurement/parse failures still exit **0**. After `1013`, empty/invalid budgets should be exit **2**.
- **acceptance criteria:** Doc distinguishes (a) soft OVER report-only 0 vs (b) unreadable/empty budgets schema → non-zero usage error; no tip-name / count edits.
- **verification commands:** `rg -n 'exit \*\*0\*\*|parse failures|exit \*\*2\*\*' docs/bundle-budget.md scripts/check-bundle-budgets.mjs`
- **conflict notes:** Prefer merging into `1013`’s PR; only open this id if `1013` already folded docs-less.

### q-mp-1018 · Docs: mermaid CI lint row — soft `check:copy-pins` (if `1010` splits)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** prefer fold into `1010` (default); open separately **only** if `1010` lands without mermaid
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only; no workflow rename (`800` still owns firefox-webkit script wiring)
- **CI / package.json callers:** n/a
- **target files:** `docs/dev/ci-gates-mermaid-q-mp-073.md` (lint “Catches” / Local reproduce only)
- **measured baseline:** Mermaid lint row lists verify chain pieces but not copy-pins; live lint job runs copy-pins report-only after verify.
- **acceptance criteria:** Lint row mentions report-only copy-pins soft step; job graph names unchanged; no tip-stamp / count edits.
- **verification commands:** `rg -n 'copy-pins|Local reproduce' docs/dev/ci-gates-mermaid-q-mp-073.md .github/workflows/ci.yml`
- **conflict notes:** Prefer merging into `1010`; leave `#1152`/`860` firefox-webkit wording alone.

## Verdict summary

| Id | Verdict | One-line |
| --- | --- | --- |
| `q-mp-1008` | **SAFE** | AGENTS tip `post1183` → `post1218` |
| `q-mp-1009` | **SAFE** | copilot tip `post477` → `post1218` + verify≠lint |
| `q-mp-1010` | **SAFE** | docs: lint job includes report-only copy-pins |
| `q-mp-1011` | **SAFE** | report-knip baseline `{}` / invalid metrics schema |
| `q-mp-1012` | **SAFE** | report-licenses bad lock → no stack |
| `q-mp-1013` | **HOLD-CHECK** | size:check empty/invalid budgets → exit 2 |
| `q-mp-1014` | **SAFE** | unit contract: lint job copy-pins soft step |
| `q-mp-1015` | **SAFE** | star-track playtest drop 2 fixed waits |
| `q-mp-1016` | **SAFE** | docs/playtest fraction-pinball + hex-deep waits |
| `q-mp-1017` | **SAFE** | bundle-budget.md exit table after `1013` |
| `q-mp-1018` | **SAFE** | mermaid lint row copy-pins (prefer with `1010`) |

**Screened HOLD-CHECK (1):** `1013` — soft CI `size:check --fail-on-new-over` schema hole; tip-owner should skim before fold.  
**No HOLD** product tickets queued.

## Dead-code / knip note (no ticket)

Live `npm run report:dead-code -- --dry-run` → Safe-to-remove **yes: 0**. Live `npm run report:knip` → unusedFiles **0**, unusedExports **3** (LEAVE storage barrel + AI `cancelFabAiRequests` HOLD/`253`). No Rank-2 yes delete candidate on this tip. Inventory staleness remains owned by `1004`.

## Out of scope / not used here

Already claimed / undrafted / HOLD / no headroom / prompt-skipped families: void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets probe (`792`), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki count remasure, tip-name **count** stamps, UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e**, harness shards, demo coverage, `*types*` residuals, page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv sweeps / lib main-entry (rounds 34–37), deep-playtest `waitForTimeout` (`803`–`807`), overnight mountPair/router batches, round-37 tickets through `q-mp-1007`, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline wait clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK), Queens & Guards product, AI timing / Hex Hard 450ms / Stars & Bars history cap, historical backlog missing-path citations.

**Could not honestly fill to 25** without filler (more `--help`/`--dry-run`/argv theater, mountPair adoptions, npm aliases, tip-stamp count remasures, or HOLD AI/scoring/board-3d work). Stopped at **11**.
