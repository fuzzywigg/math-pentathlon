# Engineering backlog — 2026-10-10al (tip refill after post1218 cut / round-38)

**Task id:** `q-mp-090al`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1218` @ `b888a73d` (full `b888a73de0a79b50e038245d3b786e22d47931a3`; tip carries AGENTS tip pointer → `post1218`, tip-folded round-36/37 leftovers via `#1239`/`q-mp-026w` including `992`/`993`/`1000`–`1006`/`968`/`974`/`956`/`957`/`959`/`980`, and open `#1238` round-37 backlog `10ak` for remaining ak ids)  
**Depends on:** tip cut `cursor/mp-tip-post1218` @ `b888a73d`. Round-37 backlog (`q-mp-090ak` / open `#1238`, ids `q-mp-992`…`1007`) — several implementers already tip-folded; remaining ak gaps (`994`–`999`/`1007` and any unworked siblings) — leave with `contained`. Round-36 aj leftovers and older stacks — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1218` @ `b888a73d` measures unit files **3392**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 **yes: 0** on live dry-run (inventory regenerated via tip-folded `1004`). This doc lists **16 new** concrete engineering tasks (`q-mp-1017` … `q-mp-1032`) mined from the **live tip tree**, checked against prior refills through `q-mp-1007` and against the full open draft PR list (tip→alpha `#1239`, post1183 workers `#1212`–`#1238`, post1083 leftovers `#1136`–`#1182`, older tip stacks). It is the **only** deliverable of `q-mp-090al`.

**Honest count:** Only **16** tasks — not padded to 25. Id range starts at `q-mp-1017` per round-38 brief (`1008`–`1016` unused / reserved; `981`–`991` remain unused). Round-37 already claimed engine-rank/coverage-map empty+malformed, type/lint ratchet schema, size/perf broken-menu html, knip **tool**/parse failure, check-build SKIP-missing, render-perf-mode env defer, check-perf help-before-env, wiki/testing-layers playtest rows, dead-code inventory regen, offline-pwa sleeps, build-repro docs — **do not** re-queue `992`–`1007` (leave `#1238` + tip-folded implementers with `contained`). This refill **does not** re-queue page-ready / double-rAF / artifact-dir / mountPair adoptions, npm aliases, `--help` / `--dry-run` / unknown-flag argv sweeps, empty-input guards as a family, lib main-entry guards, tip-stamp **count** remasures, knip unusedTypes baseline drop, Rank-3 demote theater, CI `e2e-cross-browser` named script (`800`), dismissOwl deep-playtest (`879`), deep-playtest `waitForTimeout` families already owned by `803`–`807` / `883`/`884`/`909`/`937`/`938`/`951`/`952`/`973`, stars-bars / nav-away / memory-leak / runtime-perf / webkit-offline / probe-offline fixed waits (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK — not queued), AGENTS tip-name (already tip-folded to `post1218`), or anything in rounds ≤37.

**Fresh payoffs on this tip (re-measured after `026w` folds):** **`report-coverage-map` turns pct-only rows into fake 100% heat** (`calla` 100.00 with `0/0` when only `pct` is present), **`engine-coverage-rank` TypeErrors on missing/non-numeric `pct` for matching engine rows**, **`report-knip` with baseline `{}` prints “no baseline file” and exits 0 under `--fail`**, **`size:check --fail-on-new-over` with budgets `{}` (or missing/corrupt budgets) exits 0 after `NO BUDGET` / report-only**, **`report-lint-buckets` TypeErrors on ceilings `{}`**, **`check-boundaries` dumps a SyntaxError stack on non-JSON ceilings**, **flake-rate `ingestJson` has no try/catch around `JSON.parse`**, **`mutation-report` treats baseline `no-tests` as mutate-eligible → bogus 0% scores**, **`report-licenses` dumps a SyntaxError stack on corrupt `package-lock.json`**, **`.github/copilot-instructions.md` still targets `cursor/mp-tip-post477`**, **AGENTS / CONTRIBUTING / wiki / copilot / mermaid equate `npm run verify` with the full CI `lint` job while live `ci.yml` also runs report-only `check:copy-pins -- --fail`**, **`tests/playtest/star-track-deep-playtest.mjs` still has 2 fixed `waitForTimeout`s**, **`docs/playtest/{fraction-pinball-deep-playtest,hex-deep-probe}.mjs` still sleep**, and **wiki `development.md` tip name is still `post1083`**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, emit-identity inventory remasure, knip drift, dead-CSS Rank-1 rescan, or wiki **count** cells. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

| Topic family | Why skipped |
| --- | --- |
| round-37 / engine-rank empty (`992`) / coverage-map empty+malformed (`993`/`1005`) / type+lint ratchet schema (`994`/`995`) / size+perf broken html (`996`/`997`) / knip **tool** fail (`998`) / check-build SKIP (`999`) / render-perf-mode env (`1000`) / check-perf help-env (`1001`) / playtest docs (`1002`/`1003`) / dead-code regen (`1004`) / offline-pwa sleeps (`1006`) / build-repro docs (`1007`) | tip-folded implementers + open `#1238`; ak gaps `994`–`999`/`1007` still need workers — leave with `contained`; **do not** re-queue `992`–`1007` (this refill’s `1017`/`1018`/`1019`/`1020` are **only** pct-math / missing-pct crash / baseline-schema / budgets-schema — not siblings of empty-input or broken-html tickets) |
| round-36…32 / page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / lib main-entry / empty-input argv | prompt hard-skip + open drafts / tip folds — leave with `contained` |
| CI `e2e-cross-browser` named script (`800`) / dismissOwl deep-playtest (`879`) | tip-queued; unworked — **do not** re-queue |
| deep-playtest waits `803`–`807` (ramrod/sum-dominoes/render-perf-mode/calla/par-55) | leave prior ids; this refill’s `1030`/`1031` are **only** star-track playtest + docs/playtest probes |
| knip unusedExports LEAVE / unusedTypes baseline drop / Rank-3 demotes / dead-code Rank-2 yes (live **0**) / unusedFiles **0** | no SAFE deletes; remasure theater skipped |
| AGENTS tip name → `post1218` | already tip-folded in `026w` — **do not** re-queue |
| emit-identity wave5 merge-base tip retarget | tip-owner HOLD-CHECK — not queued |
| size:check `--help` (`899`) / missing `dist/` (`845`) / broken menu html (`996`) | leave prior ids; this refill’s `1020` is **only** empty/invalid **budgets schema** |
| lint-buckets eqeqeq probe (`792` / `#1133`) / `--top` hygiene (`968`/`870`) | leave with `contained`; this refill’s `1022` is **only** ceilings `{}` TypeError UX |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions / eqeqeq in `fiar/rules.ts` | hard-rule HOLD |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `b888a73d`)

| Id | Title (short) | Verdict | Evidence @ `b888a73d` |
| --- | --- | --- | --- |
| `q-mp-090ak` / `#1238` | round-37 backlog | **open / tip-folding** | Leave with `contained` — this refill starts at `1017`. |
| `q-mp-992`/`993`/`1000`–`1006` / `968`/`974`/`956`/`957`/`959`/`980` | ak/aj implementers tip-folded | **tip-folded** | Leave alone. |
| `q-mp-994`–`999`/`1007` | ak gaps still valid on tip | **still-valid; need workers** | type-ratchet `{}` still passes; lint-ratchet `{}` TypeError; size/perf broken html exit 0; knip broken config `--fail` exit 0; check-build SKIP-missing exit 0 — leave prior ids; do not sibling. |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-879` | dismissOwl deep-playtest adopters | **still-valid; no open PR** | Leave prior id. |
| Dead-code Rank-2 yes | live dry-run | **0 yes** | No SAFE delete ticket. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/report-coverage-map.mjs` | `1017` only; leave tip-folded `993`/`1005` + open `#1234`/`977` `--dry-run` alone |
| `scripts/engine-coverage-rank.mjs` | `1018` only; leave tip-folded `992` + open `#1212`/`928` npm alias alone |
| `scripts/report-knip.mjs` + `docs/dev/knip-baseline.json` (read-only) | `1019` only; leave ak `998` knip **tool** failure alone |
| `scripts/check-bundle-budgets.mjs` + `bundle-budgets.json` (read-only) + `docs/bundle-budget.md` | `1020` + `1021` — serialize; leave ak `996` broken-menu html alone |
| `scripts/report-lint-buckets.mjs` + `docs/dev/lint-ratchet-ceilings.json` (read-only) | `1022` only; leave ak `995` check-lint-ratchet + `#1133`/`792` alone |
| `scripts/check-boundaries.mjs` + `docs/dev/module-boundaries-ceilings.json` (read-only) | `1023` only |
| `scripts/flake-rate-unit-loop.mjs` + `scripts/flake-rate-e2e-loop.mjs` | `1024` only; leave `#1231`/`970` help-anywhere alone |
| `scripts/mutation-report.mjs` | `1025` only; leave `#1232`/`967` empty-argv alone |
| `scripts/report-licenses.mjs` | `1026` only; leave `#1236`/`979` `--dry-run` alone |
| `.github/copilot-instructions.md` | `1027` only |
| `AGENTS.md` + `CONTRIBUTING.md` + `docs/wiki/development.md` (CI posture / tip-name lines) + `docs/dev/ci-gates-mermaid-q-mp-073.md` | `1028` + `1032` — serialize lightly (copy-pins CI row vs tip-name cell); leave tip-folded `1002`/`1003` playtest rows alone |
| `tests/unit/workflow-contract.test.ts` and/or overnight CI handshake tests | `1029` only |
| `tests/playtest/star-track-deep-playtest.mjs` | `1030` only; tip-folded `974` already adopted dismissOwl/artifact-dir — waits remain |
| `docs/playtest/fraction-pinball-deep-playtest.mjs` + `docs/playtest/hex-deep-probe.mjs` | `1031` only |

**Parallel-friendly:** `1017`, `1018`, `1019`, `1022`, `1023`, `1024`, `1025`, `1026`, `1027`, `1029`, `1030`, `1031`. Serialize `1020`→`1021`; serialize `1028` lightly with `1032` on wiki.

## Live tip measurements (evidence snapshot @ `b888a73d`)

```text
$ git rev-parse HEAD
  b888a73de0a79b50e038245d3b786e22d47931a3

$ git branch --show-current
  cursor/mp-tip-post1218

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3392

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ # coverage-map pct-only (restore docs after)
  printf summary with calla lines.pct=12.5 (no covered/total) + ramrod 99/100
  → table: src/games/calla | 100.00 | … ; src/games/ramrod | 99.00 | … ; exit 0

$ printf '{"src/games/calla/rules.ts":{"lines":{"total":100,"covered":50,"skipped":0}}}' > /tmp/nopct.json
$ node scripts/engine-coverage-rank.mjs /tmp/nopct.json; echo $?
  → TypeError: Cannot read properties of undefined (reading 'toFixed'); exit 1

$ printf '{}' > docs/dev/knip-baseline.json   # restore after
$ node scripts/report-knip.mjs --fail; echo $?
  → [NOTICE] knip report (no baseline file): exports=3, types=29, files=0; exit 0

$ printf '{}' > bundle-budgets.json   # restore after
$ node scripts/check-bundle-budgets.mjs --fail-on-new-over; echo $?
  → NO BUDGET × 21; exit 0

$ printf '{}' > docs/dev/lint-ratchet-ceilings.json   # restore after
$ node scripts/report-lint-buckets.mjs; echo $?
  → TypeError: Cannot convert undefined or null to object; exit 1

$ printf 'not-json\n' > docs/dev/module-boundaries-ceilings.json   # restore after
$ node scripts/check-boundaries.mjs; echo $?
  → SyntaxError stack; exit 1

$ printf '{]\n' > package-lock.json   # restore after
$ node scripts/report-licenses.mjs --dry-run; echo $?
  → SyntaxError stack; exit 1

$ rg -n 'mp-tip-post' AGENTS.md .github/copilot-instructions.md docs/wiki/development.md
  → AGENTS post1218 (good); copilot post477; wiki post1083

$ rg -n 'check:copy-pins' .github/workflows/ci.yml
  → lint job soft step: npm run check:copy-pins -- --fail (continue-on-error: true)

$ rg -n 'waitForTimeout' tests/playtest/star-track-deep-playtest.mjs docs/playtest/*.mjs
  → star-track 2; fraction-pinball 4; hex-deep-probe 1×800ms

$ Open drafts into cursor/mp-tip-post1218 at audit: (none — workers should retarget this tip)
$ Tip→alpha fold open: #1239
$ Open drafts into cursor/mp-tip-post1183 at audit: #1212–#1238 (42)
$ Open drafts into cursor/mp-tip-post1083 at audit: ~46
```

## New tasks

### q-mp-1017 · Scripts: `report-coverage-map` honor `pct` / reject pct-only rows (no fake 100%)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave tip-folded `993`/`1005` empty+malformed + open `#1234`/`977` `--dry-run` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong aggregation math on realistic partial summaries; no heat regenerate required beyond fix verification
- **CI / package.json callers:** `package.json` → `report:coverage-map`; **not** a blocking CI job (local / docs helper)
- **target files:** `scripts/report-coverage-map.mjs` (`readMetric` / `metric` / `aggregateByDirectory`); optional hermetic unit for pct-only + covered/total paths
- **measured baseline:** Summary with `src/games/calla/board.ts` `{lines:{pct:12.5}}` (no `covered`/`total`) and a normal ramrod row writes heat where **`src/games/calla` = 100.00** (because `metric(0,0)` hard-codes `pct=100`) while ramrod stays 99.00. Empty/`[]` already rejected by tip-folded `993`.
- **acceptance criteria:** Pct-only rows either (a) use the provided numeric `pct` for ranking/display with covered/total shown as unknown/`—`, or (b) reject the summary with exit **1**/**2** and **no** doc writes; never invent 100% from `0/0` when `pct` was supplied or when totals are absent; valid istanbul json-summary with covered/total unchanged.
- **verification commands:** `node scripts/report-coverage-map.mjs --dry-run /tmp/cov-pct-only.json ; echo $?` ; (or write+inspect then `git checkout -- docs/dev/coverage-map.md docs/dev/coverage-map.svg`) ; `CI=1 npx vitest run tests/unit/report-coverage-map*.test.ts` (if present)
- **conflict notes:** distinct from empty-shape reject (`993`) and malformed-JSON UX (`1005`).

### q-mp-1018 · Scripts: `engine-coverage-rank` derive or reject missing/non-numeric `pct`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave tip-folded `992` empty/non-engine + open `#1212`/`928` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — crash / wrong-results on realistic engine rows; no coverage threshold product edits
- **CI / package.json callers:** `package.json` → `report:engine-coverage-rank`; **not** a blocking CI job
- **target files:** `scripts/engine-coverage-rank.mjs` (`collectEngineRows` / `formatRankOutput`); optional hermetic unit
- **measured baseline:** `{"src/games/calla/rules.ts":{"lines":{"total":100,"covered":50,"skipped":0}}}` → `TypeError: … toFixed` exit **1**. String `pct:"50"` → `TypeError: r.linePct.toFixed is not a function` exit **1**. Empty `{}` already exit **2** (tip-folded `992`).
- **acceptance criteria:** Prefer derive `pct` from covered/total when numeric; otherwise exit **2** with a short schema message (no stack); valid numeric-`pct` summaries unchanged; empty/non-engine path unchanged.
- **verification commands:** `node scripts/engine-coverage-rank.mjs /tmp/cov-rules-nopct.json ; echo $?` ; `node scripts/engine-coverage-rank.mjs /tmp/cov-rules-strpct.json ; echo $?` ; `printf '{}' > /tmp/e.json; node scripts/engine-coverage-rank.mjs /tmp/e.json ; echo $?`
- **conflict notes:** do not sibling empty-summary reject (`992`).

### q-mp-1019 · Scripts: `report-knip` reject baseline `{}` / missing numeric `metrics`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave ak `998` knip **spawn/parse** failure + `#1168`/`873` unknown-flag alone; do **not** drop unusedTypes baseline here)
- **series:** script-tooling
- **verdict:** **SAFE** — baseline schema / wrong “no baseline file” notice; growth detection must run when a baseline file exists
- **CI / package.json callers:** `package.json` → `report:knip`; `.github/workflows/ci.yml` → report-only `knip` job (`continue-on-error: true`)
- **target files:** `scripts/report-knip.mjs` (`loadBaseline` / `main`); **do not** edit `docs/dev/knip-baseline.json` metrics downward/upward in this ticket
- **measured baseline:** With baseline file replaced by `{}`, script prints `[NOTICE] knip report (no baseline file): exports=3…` and exits **0** even under `--fail`. Live knip metrics still compute; drift comparison is silently disabled.
- **acceptance criteria:** Present-but-invalid baseline (`{}`, missing `metrics`, non-numeric metric fields) exits **1** with a one-line schema error (and does **not** claim “no baseline file”); truly missing baseline file may keep today’s NOTICE + exit 0 (or document intentionally); successful compare path unchanged; no `--write-baseline` in this ticket.
- **verification commands:** (temp `{}` baseline, restore) `node scripts/report-knip.mjs --fail ; echo $?` ; `npm run report:knip` ; `rg -n 'no baseline file|loadBaseline|metrics' scripts/report-knip.mjs`
- **conflict notes:** distinct from ak `998` (knip.json / spawn failure).

### q-mp-1020 · Scripts: `size:check` non-zero on missing / invalid / empty `bundle-budgets.json`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave ak `996` broken-menu html + `845` missing-`dist/` alone; serialize with `1021`)
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — CI soft `size:check --fail-on-new-over` gate hygiene; no budget number edits; tip-owner should skim
- **CI / package.json callers:** `package.json` → `size:check`; `.github/workflows/ci.yml` → `build` job → `npm run size:check -- --fail-on-new-over` (`continue-on-error: true`)
- **target files:** `scripts/check-bundle-budgets.mjs` (budgets load / main catch); **do not** raise budgets or edit `knownOvers` here
- **measured baseline:** Budgets `{}` → 21× `NO BUDGET` + exit **0** even with `--fail-on-new-over`. Missing budgets file → `ENOENT` + `(report-only: exiting 0)` exit **0**. Corrupt JSON → parse error + exit **0**. Missing `dist/` already exit **2** (good contrast). Docs still bless parse→0 (`1021`).
- **acceptance criteria:** Missing / non-JSON / missing numeric `menuCriticalPath`+`games` budgets exit **2** (usage/schema) — not soft report-only 0; valid `dist/` + valid budgets still exit **0** (or 1 only under `--fail-on-new-over` + novel OVER); no budget number edits.
- **verification commands:** (temp `{}` / missing / `{` budgets, restore) `node scripts/check-bundle-budgets.mjs --fail-on-new-over ; echo $?` ; `npm run size:check` (good budgets + dist)
- **conflict notes:** tip-owner review before fold (soft CI step semantics); do not sibling broken-html (`996`).
- **screen:** HOLD-CHECK — CI soft gate; schema/usage exit only.

### q-mp-1021 · Docs: `docs/bundle-budget.md` exit table after budgets schema fix

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** prefer fold/co-land of `1020` (or land docs in the same PR as `1020` and **skip** opening this id separately)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only; only needed if `1020` lands without updating bundle-budget.md
- **CI / package.json callers:** n/a (docs only; script `size:check` already exists)
- **target files:** `docs/bundle-budget.md` (§Exit codes / “Other measurement/parse failures still exit **0**”)
- **measured baseline:** Doc says other measurement/parse failures still exit **0**. After `1020`, missing/invalid budgets should be exit **2**.
- **acceptance criteria:** Doc distinguishes (a) valid dist+budgets report-only/soft paths vs (b) missing/invalid budgets → usage exit **2**; no tip-name / count edits.
- **verification commands:** `rg -n 'exit \*\*0\*\*|exit 2|parse|budgets' docs/bundle-budget.md scripts/check-bundle-budgets.mjs` ; `node scripts/check-bundle-budgets.mjs ; echo $?`
- **conflict notes:** Prefer merging into `1020`’s PR.

### q-mp-1022 · Scripts: `report-lint-buckets` validate ceilings schema (no TypeError stack)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave ak `995` `check-lint-ratchet` + `#1133`/`792` eqeqeq probe + tip-folded `968` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — report-only helper UX; no ceiling writes; no eslint product clears
- **CI / package.json callers:** `package.json` → `report:lint-buckets`; **not** a blocking CI job (local / AGENTS helper)
- **target files:** `scripts/report-lint-buckets.mjs`; optional tiny spawn/unit test; **do not** edit ceilings JSON
- **measured baseline:** Ceilings file `{}` → `TypeError: Cannot convert undefined or null to object` at `Object.keys(ceilings.rules)` exit **1**. Same crash class as ak `995` but **different script**.
- **acceptance criteria:** Missing / invalid / missing-`rules` ceilings exit **1** with a one-line “invalid ceilings file” message (no TypeError stack); valid ceilings path unchanged; no ceiling JSON edits.
- **verification commands:** (temp `{}`, restore) `node scripts/report-lint-buckets.mjs ; echo $?` ; `npm run report:lint-buckets -- --rule eqeqeq`
- **conflict notes:** do not rewrite `check-lint-ratchet` (`995`).

### q-mp-1023 · Scripts: `check-boundaries` non-JSON ceilings → stable message (no stack)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **HOLD-CHECK** — CI `verify` / `check:boundaries` gate error UX only; no ceiling raises; tip-owner skim
- **CI / package.json callers:** `package.json` → `check:boundaries` (via `verify`); `.github/workflows/ci.yml` → blocking `lint` job → `npm run verify`
- **target files:** `scripts/check-boundaries.mjs`; optional tiny unit/spawn test; **do not** edit `docs/dev/module-boundaries-ceilings.json` ceilings upward
- **measured baseline:** Non-JSON ceilings file → prints audit counts then `SyntaxError` stack; exit **1**. Missing keys already fail cleaner with exit 1.
- **acceptance criteria:** Non-JSON / unreadable ceilings exit **1** with a one-line schema/parse message (no stack); valid ceilings path unchanged; boundary math unchanged.
- **verification commands:** (temp `not-json`, restore) `node scripts/check-boundaries.mjs ; echo $?` ; `npm run check:boundaries`
- **conflict notes:** tip-owner review (verify gate).
- **screen:** HOLD-CHECK — verify/CI gate; schema/error UX only.

### q-mp-1024 · Scripts: flake-rate loops tolerate corrupt Vitest JSON (no uncaught parse)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave `#1231`/`970` help-anywhere + `#1180`/`871` `--out` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — loop robustness on realistic corrupt reporter output; not a new `--help` sweep
- **CI / package.json callers:** `package.json` → `flake:unit`, `flake:e2e`; **not** blocking CI jobs (local flake helpers)
- **target files:** `scripts/flake-rate-unit-loop.mjs`; `scripts/flake-rate-e2e-loop.mjs` (`ingestJson`); optional unit covering corrupt JSON
- **measured baseline:** `ingestJson` does `JSON.parse(fs.readFileSync(jsonPath))` with **no** try/catch. Missing JSON is handled (`ok: false`); corrupt `{` throws and aborts the loop (partial `--out` artifacts may remain).
- **acceptance criteria:** Corrupt/unreadable reporter JSON records a per-run error (continue or exit **1** with a clear message) — no uncaught stack; missing-json path unchanged; summary still written when possible.
- **verification commands:** `rg -n 'JSON.parse|ingestJson' scripts/flake-rate-unit-loop.mjs scripts/flake-rate-e2e-loop.mjs` ; `CI=1 npx vitest run tests/unit/flake-rate-loop*.test.ts`
- **conflict notes:** do not sibling argv/help tickets.

### q-mp-1025 · Scripts: `mutation-report` skip mutants when baseline is `no-tests`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave `#1232`/`967` empty `--max=`/`--games=`/`--json=` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — scoring correctness for the report harness; not product mutation testing of AI/scoring rules beyond skipping when no tests exist
- **CI / package.json callers:** `package.json` → `mutation:report`; **not** a blocking CI job
- **target files:** `scripts/mutation-report.mjs` (`mutateGame` baseline gate); optional unit for `no-tests` skip
- **measured baseline:** Gate is `baseline.status !== 'survived' && baseline.status !== 'no-tests'` → `no-tests` proceeds to mutate; each mutant then counts as `error` / score **0%**. Failed baselines correctly skip.
- **acceptance criteria:** Baseline `no-tests` skips mutants (`skipped: true`, clear `skipReason`); do not report a fake 0% kill score; `survived` baseline path unchanged; no `*/rules.ts` product edits.
- **verification commands:** `rg -n "no-tests|baseline.status" scripts/mutation-report.mjs` ; `CI=1 npx vitest run tests/unit/mutation-report*.test.ts` (if present)
- **conflict notes:** do not widen into AI/scoring product asserts.

### q-mp-1026 · Scripts: `report-licenses` malformed lock → stable message (no stack)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave open `#1236`/`979` `--dry-run` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — error UX only; exit stays non-zero
- **CI / package.json callers:** `package.json` → `report:licenses`; **not** a blocking CI job
- **target files:** `scripts/report-licenses.mjs`
- **measured baseline:** Corrupt `package-lock.json` (`{]`) → `SyntaxError` stack exit **1**. Missing lock already has a clean message exit **1**.
- **acceptance criteria:** Malformed lock → short message + hint (no stack), exit **1**; missing lock message unchanged; valid lock / `--dry-run` path unchanged.
- **verification commands:** (temp corrupt lock, restore) `node scripts/report-licenses.mjs --dry-run ; echo $?` ; `rg -n 'JSON.parse|package-lock' scripts/report-licenses.mjs`
- **conflict notes:** rebase onto `#1236` if still open.

### q-mp-1027 · Docs: `.github/copilot-instructions.md` tip target → `post1218`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (AGENTS already tip-folded to `post1218` — do not re-edit AGENTS tip name here)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only agent routing fix; no CI / product edits
- **CI / package.json callers:** n/a (docs only)
- **target files:** `.github/copilot-instructions.md` (Draft PR tip target line)
- **measured baseline:** Copilot instructions still say target **`cursor/mp-tip-post477`**. Live tip + AGENTS say **`cursor/mp-tip-post1218`**.
- **acceptance criteria:** Tip target matches live tip / AGENTS (`cursor/mp-tip-post1218`); no count remasure; no CI permissions edits.
- **verification commands:** `rg -n 'mp-tip-post' .github/copilot-instructions.md AGENTS.md` ; `git rev-parse --abbrev-ref HEAD`
- **conflict notes:** leave historical tip-pointer sweep drafts (`#996`/`532` etc.) contained.

### q-mp-1028 · Docs: CI `lint` job includes report-only `check:copy-pins` (verify ≠ full lint job)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (serialize lightly with `1032` on wiki; leave tip-folded `1002`/`1003` playtest rows alone)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only; does not change CI workflow or permissions
- **CI / package.json callers:** n/a (documents existing `ci.yml` + `package.json` `verify` / `check:copy-pins`)
- **target files:** `AGENTS.md` (CI gates table / verify bullet); `CONTRIBUTING.md` and/or `docs/wiki/development.md` (verify = lint-job claims); `.github/copilot-instructions.md` (CI lint-job chain); `docs/dev/ci-gates-mermaid-q-mp-073.md` (blocking lint row) — prefer one coherent story, minimal diff
- **measured baseline:** Live `ci.yml` lint job runs `npm run verify` **then** soft `npm run check:copy-pins -- --fail` (`continue-on-error: true`). Docs/AGENTS/copilot still describe verify as the full lint job and omit the soft copy-pins step from the lint-job story (AGENTS lists copy-pins only under local helpers).
- **acceptance criteria:** Docs state verify ⊆ lint job, plus the report-only copy-pins soft step; do not move copy-pins into `package.json` `verify`; no workflow edits in this ticket.
- **verification commands:** `rg -n 'check:copy-pins|npm run verify' .github/workflows/ci.yml AGENTS.md CONTRIBUTING.md docs/wiki/development.md .github/copilot-instructions.md docs/dev/ci-gates-mermaid-q-mp-073.md`
- **conflict notes:** co-land carefully with `1027` if both touch copilot; mermaid row may fold here (no separate tip-stamp).

### q-mp-1029 · Tests: pin CI lint soft `check:copy-pins` step in workflow contract / handshake

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** prefer fold/co-land of `1028` (docs first is OK)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only contract pin; no workflow behavior change
- **CI / package.json callers:** `package.json` → `test:unit` (blocking `unit` job); local `CI=1 npx vitest run tests/unit/workflow-contract.test.ts` (and/or overnight CI handshake tests that already pin `npm run verify`)
- **target files:** `tests/unit/workflow-contract.test.ts` and/or `tests/unit/overnight-wave*-ci-workflow*.test.ts` (smallest existing pin site)
- **measured baseline:** Handshake tests assert `ci.yml` contains `npm run verify` but do **not** assert the soft copy-pins step. Soft step can regress silently while docs/verify stay green.
- **acceptance criteria:** Hermetic assert that lint job YAML includes `check:copy-pins` with `--fail` and `continue-on-error` (or equivalent structural pin); no workflow edits in this ticket.
- **verification commands:** `CI=1 npx vitest run tests/unit/workflow-contract.test.ts tests/unit/overnight-wave59-ci-workflow-unit-e2e.test.ts` ; `rg -n 'copy-pins|verify' tests/unit/workflow-contract.test.ts tests/unit/overnight-wave*-ci-workflow*.test.ts`
- **conflict notes:** do not widen CI permissions pins.

### q-mp-1030 · Playtest: replace fixed `waitForTimeout` in `star-track-deep-playtest` (2 sites)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (tip-folded `974` already adopted dismissOwl/artifact-dir — waits remain; do **not** touch stars-bars / nav-away / memory-leak / runtime-perf — prior HOLD/skip)
- **series:** test-hygiene
- **verdict:** **SAFE** — local playtest harness wait hygiene only; asserts/outcomes unchanged; not mp3d / AI timing product
- **CI / package.json callers:** **not** a blocking CI job (local playtest harness under `tests/playtest/`; no `package.json` script for star-track deep playtest today)
- **target files:** `tests/playtest/star-track-deep-playtest.mjs`
- **measured baseline:** Two fixed delays: `waitForTimeout(50)` and `waitForTimeout(40)` remain after tip-folded `974` dismissOwl/artifact-dir adoption.
- **acceptance criteria:** Replace fixed sleeps with Playwright condition waits (`waitForFunction` / locator / network hooks) where straightforward; same harness outcomes; no board-3d / AI product edits.
- **verification commands:** `rg -n 'waitForTimeout' tests/playtest/star-track-deep-playtest.mjs` ; `node --check tests/playtest/star-track-deep-playtest.mjs`
- **conflict notes:** leave `scripts/stars-bars-deep-playtest.mjs` alone (HOLD/skip family).

### q-mp-1031 · Docs/playtest: replace fixed `waitForTimeout` in fraction-pinball + hex-deep probes

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (do **not** touch `scripts/*-deep-playtest.mjs` owned by `803`–`807` / HOLD AI-adjacency)
- **series:** test-hygiene
- **verdict:** **SAFE** — docs/playtest probe wait hygiene only; not player-facing copy; not Hex Hard 450ms assert
- **CI / package.json callers:** **not** a blocking CI job (local `docs/playtest/*.mjs` probes; no package.json script)
- **target files:** `docs/playtest/fraction-pinball-deep-playtest.mjs`; `docs/playtest/hex-deep-probe.mjs`
- **measured baseline:** `fraction-pinball-deep-playtest.mjs` — 4× `waitForTimeout` (50/80/200/1500ms). `hex-deep-probe.mjs` — 1× `waitForTimeout(800)`. Not in prior HOLD list for stars-bars / nav-away / memory-leak / offline probes.
- **acceptance criteria:** Replace fixed sleeps with condition waits where straightforward; keep probe intent; no Hex Hard timing assert edits; no `*/rules.ts` edits.
- **verification commands:** `rg -n 'waitForTimeout' docs/playtest/fraction-pinball-deep-playtest.mjs docs/playtest/hex-deep-probe.mjs` ; `node --check docs/playtest/fraction-pinball-deep-playtest.mjs docs/playtest/hex-deep-probe.mjs`
- **conflict notes:** leave `scripts/calla-deep-playtest.mjs` / `par-55-deep-playtest.mjs` to prior HOLD-CHECK ids.

### q-mp-1032 · Docs: wiki `development.md` tip name → `post1218` (no count remasure)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** serialize lightly with `1028` if both touch wiki CI posture paragraphs
- **series:** docs-accuracy
- **verdict:** **SAFE** — tip **name** pointer only; explicitly **no** unit/e2e count remasure in this ticket
- **CI / package.json callers:** n/a (docs only)
- **target files:** `docs/wiki/development.md` (live tip sentence ~L142; tip name only)
- **measured baseline:** Wiki still says live tip `cursor/mp-tip-post1083` with stale counts. AGENTS already `post1218`. Count cells remain owned by tip-owner remasure tickets (`#1098`/`667` leftovers) — leave those contained.
- **acceptance criteria:** Tip **name** matches `cursor/mp-tip-post1218`; add a one-line note that counts move every fold / tip-owner remasures; **do not** rewrite unit/e2e count numbers in this ticket.
- **verification commands:** `rg -n 'mp-tip-post' docs/wiki/development.md AGENTS.md` ; `git rev-parse --abbrev-ref origin/cursor/mp-tip-post1218`
- **conflict notes:** do not sibling wiki count-stamp tickets; not tip-stamp theater of counts.

## Verdict summary

| Id | Verdict | One-line |
| --- | --- | --- |
| `q-mp-1017` | **SAFE** | coverage-map pct-only → no fake 100% heat |
| `q-mp-1018` | **SAFE** | engine-coverage-rank missing/string pct → derive or exit 2 |
| `q-mp-1019` | **SAFE** | report-knip invalid baseline metrics → exit 1 (not “no baseline file”) |
| `q-mp-1020` | **HOLD-CHECK** | size:check missing/invalid budgets → exit 2 |
| `q-mp-1021` | **SAFE** | bundle-budget.md exit table after `1020` (prefer same PR) |
| `q-mp-1022` | **SAFE** | report-lint-buckets ceilings schema / no TypeError |
| `q-mp-1023` | **HOLD-CHECK** | check-boundaries non-JSON → no stack |
| `q-mp-1024` | **SAFE** | flake-rate corrupt Vitest JSON → no uncaught parse |
| `q-mp-1025` | **SAFE** | mutation-report skip mutants on baseline `no-tests` |
| `q-mp-1026` | **SAFE** | report-licenses malformed lock → no stack |
| `q-mp-1027` | **SAFE** | copilot-instructions tip → post1218 |
| `q-mp-1028` | **SAFE** | docs: lint job = verify + soft copy-pins |
| `q-mp-1029` | **SAFE** | unit pin CI soft copy-pins step |
| `q-mp-1030` | **SAFE** | star-track-deep-playtest drop 2× waitForTimeout |
| `q-mp-1031` | **SAFE** | docs/playtest fraction-pinball + hex-deep waits |
| `q-mp-1032` | **SAFE** | wiki tip name → post1218 (no count remasure) |

**Screened HOLD-CHECK (2):** `1020`, `1023` — CI soft/blocking gate schema/UX only; tip-owner should skim before fold.  
**No HOLD** product tickets queued.

## Out of scope / not used here

Already claimed / undrafted / HOLD / no headroom / prompt-skipped families: void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets eqeqeq probe (`792`), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, AGENTS tip name (already folded), UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e**, harness shards, demo coverage, `*types*` residuals, page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / empty-input / lib main-entry (rounds 34–37), deep-playtest `waitForTimeout` (`803`–`807`), overnight mountPair/router batches, round-31…37 tickets through `q-mp-1007`, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline wait clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK), Queens & Guards product, AI timing / Hex Hard 450ms / Stars & Bars history cap, dead-code Rank-2 yes deletes (live **0**).

**Could not honestly fill to 25** without filler (more `--help`/`--dry-run`/argv/empty-input theater, mountPair adoptions, npm aliases, tip-stamp count remasures, or HOLD AI/scoring/board-3d work). Stopped at **16**.
