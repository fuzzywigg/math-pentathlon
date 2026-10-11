# Engineering backlog — 2026-10-10am (tip refill after post1218 cut / round-39)

**Task id:** `q-mp-090am`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1218` @ `39bed214` (full `39bed2144d4bc76aff0548578d931b805878fe15`; tip carries fold `#1253` / `q-mp-090al` round-38 backlog `10al` with ids `1017`…`1032`, plus prior `026w` leftovers)  
**Depends on:** tip cut `cursor/mp-tip-post1218` @ `39bed214`. Round-38 backlog (`q-mp-090al`, tip-folded via `#1253`) — open tip implementers `#1254`–`#1260` already cover several `1017`/`1018`/`1024`/`1026`/`1027`/`1028`/`1029`/`1030`/`1032` slices; remaining al gaps (`1019`–`1023`/`1025`/`1031` and any unworked siblings) — leave with `contained`. Older tip stacks (`#1212`–`#1238` on post1183, `#1136`–`#1182` on post1083, etc.) — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1218` @ `39bed214` measures unit files **3392**; Chromium e2e **25** files / **249** cases; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 **yes: 0** on live dry-run. Tip CI run `38107348270` is green on blocking jobs; report-only `visual-baseline` still records **42 failed** screenshot comparisons. This doc lists **19 new** concrete engineering tasks (`q-mp-1033` … `q-mp-1051`) mined from the **live tip tree**, checked against prior refills through `q-mp-1032` and against the full open draft PR list (tip implementers `#1254`–`#1260`, post1183 workers `#1212`–`#1238`, post1083 leftovers, older tip stacks). It is the **only** deliverable of `q-mp-090am`.

**Honest count:** Only **19** tasks — not padded to 25. Id range starts at `q-mp-1033` per round-39 brief (`1008`–`1016` and `981`–`991` remain unused / reserved). Round-38 already claimed coverage-map pct-only fake 100%, engine-rank missing/non-numeric pct crash, knip baseline `{}`, size budgets schema, lint-buckets ceilings `{}`, boundaries non-JSON stack, flake-rate corrupt JSON parse, mutation `no-tests` baseline, licenses malformed lock, tip-name pointers, verify≠lint+copy-pins docs + workflow pin, star-track / docs-playtest waits — **do not** re-queue `1017`–`1032` (leave `#1253` + open `#1254`–`#1260` + unworked al gaps with `contained`). This refill **does not** re-queue page-ready / double-rAF / artifact-dir / mountPair adoptions, npm aliases, `--help` / `--dry-run` / unknown-flag argv sweeps, empty-input / malformed-JSON guards as a family, lib main-entry guards, tip-stamp **count** remasures, knip unusedTypes baseline drop, Rank-3 demote theater, CI `e2e-cross-browser` named script (`800`), dismissOwl deep-playtest (`879`), deep-playtest `waitForTimeout` families already owned by `803`–`807` / `883`/`884`/`909`/`937`/`938`/`951`/`952`/`973`/`1030`/`1031`, stars-bars / nav-away / memory-leak / runtime-perf / webkit-offline / probe-offline **fixed waits** (prior HOLD/skip — this refill’s `1043` is **only** the `finally` forced `exit(0)` bug), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK — not queued), or anything in rounds ≤38.

**Fresh payoffs on this tip (re-measured after `090al` fold + tip CI `38107348270`):** **`engine-coverage-rank` trusts stale numeric `pct` over `covered`/`total` (calla 90/100 ranked at 10%)**, **`flake-rate-unit-loop` records `ok: true` when Vitest JSON has `success: true` despite walked failures**, **`report-ratchet-history --first-parent` never passes `--first-parent` to `git log`**, **`report-knip` incomplete `metrics` keys coerce to 0 → fake growth under `--fail`; corrupt baseline JSON claims “no baseline file” and exits 0 under `--fail`**, **`report-licenses` accepts `packages: null` / `{}` → empty SBOM exit 0**, **`mutation-report` classifies Vitest “No test files found” (exit 1) as `killed`**, **`report-coverage-map` emits markdown `120.00` when `covered > total` (SVG heat clamps; table does not)**, **AGENTS / wiki / mermaid describe soft `size:check` without CI’s `--fail-on-new-over`**, **workflow-contract tests do not pin that CI flag**, **`check-pwa-manifest` header still says `REPORT_ONLY=0` “fail CI” while CI never sets it**, **`webkit-offline-probe` `finally` always schedules `process.exit(0)`**, **`docs/dev/knip-report.md` cheat line still says unconditional exit 0**, **`readme-npm-scripts` treats `npm run playtest:*` as missing script `playtest:` (worker CI `38106654481` failure class)**, **`ai-move-time-midgame.bench.test.ts` hardcodes `/workspace/docs/…`**, **`tests/unit/example.test.ts (deleted on tip)` was a placeholder with zero product imports**, **active audit docs still prescribe bare `npx tsc --noEmit`**, **`TRACKED.curly` path alias has zero callers**, tip CI **visual-baseline 42 failed**, and **canvas-dpr-resize permanently `test.skip`s on WebKit flake**.

**Preference:** SAFE, mutually independent **scripts/** wrong-results fixes, **docs-only** accuracy, or **tests-only** flake/contract hygiene. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings totals, boundaries/PWA thresholds, board-3d layout inventory, CI permissions, tip-pointer **count** stamps, open-draft triage, emit-identity inventory remasure, knip drift, dead-CSS Rank-1 rescan, or wiki **count** cells. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, board-3d **src** / **mp3d e2e**, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

| Topic family | Why skipped |
| --- | --- |
| round-38 / coverage-map pct-only (`1017`) / engine missing pct (`1018`) / knip `{}` (`1019`) / size budgets schema (`1020`/`1021`) / lint-buckets ceilings (`1022`) / boundaries non-JSON (`1023`) / flake corrupt JSON (`1024`) / mutation `no-tests` (`1025`) / licenses malformed lock (`1026`) / tip pointers (`1027`/`1032`) / copy-pins docs+pin (`1028`/`1029`) / star-track + docs/playtest waits (`1030`/`1031`) | tip-folded backlog + open `#1254`–`#1260`; al gaps `1019`–`1023`/`1025`/`1031` still need workers — leave with `contained`; **do not** re-queue `1017`–`1032` (this refill’s `1033`/`1036`/`1037`/`1038`/`1039` are **only** contradictory-pct / incomplete-metrics / empty-packages / no-files-as-killed / covered>total — not siblings of empty-input, missing-pct crash, `{}` baseline, or malformed-lock tickets) |
| round-37…32 / page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / lib main-entry / empty-input argv | prompt hard-skip + open drafts / tip folds — leave with `contained` |
| CI `e2e-cross-browser` named script (`800`) / dismissOwl deep-playtest (`879`) | tip-queued; unworked — **do not** re-queue |
| deep-playtest waits `803`–`807` / `1030`/`1031` | leave prior ids; this refill does **not** add more waitForTimeout clears |
| knip unusedExports LEAVE / unusedTypes baseline drop / Rank-3 demotes / dead-code Rank-2 yes (live **0**) / unusedFiles **0** | no SAFE deletes; remasure theater skipped |
| emit-identity wave5 merge-base tip retarget | tip-owner HOLD-CHECK — not queued |
| AI determinism / quality shard wall times (measured ~38–132s locally) | **HOLD** — AI harness; do not fake-clock or change search |
| size:check `--help` (`899`) / missing `dist/` (`845`) / broken menu html (`996`) / budgets schema (`1020`) | leave prior ids; this refill’s `1040`/`1041` are **only** CI `--fail-on-new-over` docs + workflow-contract pin |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions / eqeqeq in `fiar/rules.ts` | hard-rule HOLD |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening. No `memory/` files.

## Stale queue re-check (live tip `39bed214`)

| Id | Title (short) | Verdict | Evidence @ `39bed214` |
| --- | --- | --- | --- |
| `q-mp-090al` / `#1253` | round-38 backlog | **tip-folded** | Leave alone; this refill starts at `1033`. |
| `#1254`–`#1260` | al implementers on tip | **open / tip-folding** | Leave with `contained`. |
| `q-mp-1019`–`1023`/`1025`/`1031` | al gaps still valid on tip | **still-valid; need workers** | knip `{}`, size budgets schema, lint-buckets ceilings, boundaries non-JSON, mutation `no-tests`, docs/playtest waits — leave prior ids; do not sibling. |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-879` | dismissOwl deep-playtest adopters | **still-valid; no open PR** | Leave prior id. |
| Dead-code Rank-2 yes | live dry-run | **0 yes** | No SAFE delete ticket beyond placeholder example.test.ts / `TRACKED.curly`. |
| Tip CI `38107348270` | blocking green; visual 42 failed | **report-only drift** | Queued as `1050` HOLD-CHECK. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/engine-coverage-rank.mjs` | `1033` only; leave open `#1260`/`1018` missing/non-numeric pct alone |
| `scripts/flake-rate-unit-loop.mjs` | `1034` only; leave open `#1257`/`1024` corrupt JSON alone; e2e loop ok-logic already correct |
| `scripts/report-ratchet-history.mjs` | `1035` + `1049` — serialize lightly (`--first-parent` vs dead `TRACKED.curly`) |
| `scripts/report-knip.mjs` + `docs/dev/knip-baseline.json` (read-only) | `1036` only; leave al `1019` `{}` / “no baseline file” alone; serialize docs `1044` after script if both land |
| `scripts/report-licenses.mjs` | `1037` only; leave open `#1256`/`1026` malformed lock alone |
| `scripts/mutation-report.mjs` | `1038` only; leave al `1025` baseline `no-tests` alone |
| `scripts/report-coverage-map.mjs` | `1039` only; leave open `#1258`/`1017` pct-only alone |
| `AGENTS.md` + `docs/wiki/development.md` + `docs/dev/ci-gates-mermaid-q-mp-073.md` (+ optional `docs/bundle-budget.md`) | `1040` only; leave open `#1259`/`1028` copy-pins CI story alone |
| `tests/unit/workflow-contract.test.ts` and/or overnight CI handshake tests | `1041` only; leave open `#1259`/`1029` copy-pins pin alone |
| `scripts/check-pwa-manifest.mjs` + `docs/pwa-manifest-installability-2026-10-08.md` | `1042` only |
| `scripts/webkit-offline-probe.mjs` | `1043` only; do **not** clear probe `waitForTimeout` (prior HOLD/skip) |
| `docs/dev/knip-report.md` | `1044` only; prefer after `1036` if both touch fail semantics prose |
| `tests/unit/readme-npm-scripts.test.ts` | `1045` only |
| `tests/unit/ai-move-time-midgame.bench.test.ts` | `1046` only — path fix only; no AI timing/product edits |
| `tests/unit/example.test.ts (deleted on tip)` | `1047` only |
| Active audit docs (`docs/*-2026-10-0*.md`) | `1048` only — `npx tsc` → `npm run typecheck`; leave `1007` check:build exit wording alone |
| `tests/e2e/visual-baseline.spec.ts` / `tests/e2e/visual-baselines/**` | `1050` only |
| `tests/e2e/canvas-dpr-resize.spec.ts` | `1051` only |

**Parallel-friendly:** `1033`, `1034`, `1036`, `1037`, `1038`, `1039`, `1040`, `1041`, `1042`, `1043`, `1045`, `1046`, `1047`, `1048`. Serialize `1035`→`1049`; serialize `1036` lightly with `1044`; serialize `1040` lightly with open `#1259` on AGENTS/wiki.

## Live tip measurements (evidence snapshot @ `39bed214`)

```text
$ git rev-parse HEAD
  39bed2144d4bc76aff0548578d931b805878fe15

$ git branch --show-current
  cursor/mp-tip-post1218

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3392

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ printf '%s\n' '{"src/games/calla/rules.ts":{"lines":{"total":100,"covered":90,"pct":10},"branches":{"total":40,"covered":36,"pct":10}},"src/games/ramrod/rules.ts":{"lines":{"total":100,"covered":50,"pct":50},"branches":{"total":40,"covered":20,"pct":50}}}' > /tmp/stale-pct.json
$ node scripts/engine-coverage-rank.mjs /tmp/stale-pct.json; echo $?
  → rank 1 calla 10.00% (90/100); rank 2 ramrod 50.00%; exit 0

$ node --input-type=module -e 'const data={success:true,numFailedTests:2}; const failed=1; const ok=data.success!==false&&failed===0&&(data.numFailedTests??0)===0; console.log({ok, reportedOk: data.success===true||(ok&&(data.numFailedTests??failed)===0)});'
  → { ok: false, reportedOk: true }

$ # report-ratchet-history --first-parent: parseArgs sets firstParent:true; collectHistory omits --all but never adds --first-parent
$ rg -n 'firstParent \? \[\] :|first-parent' scripts/report-ratchet-history.mjs
  → ...(firstParent ? [] : ['--all'])… ; USAGE claims “HEAD first-parent history”

$ # knip incomplete metrics (restore baseline after)
  metrics:{unusedExports only} + --fail → fake unusedTypes 0→29 / unlisted 0→3; exit 1
  corrupt baseline `{]` + --fail → “[NOTICE] knip report (no baseline file)”; exit 0

$ printf '%s\n' '{"name":"x","version":"1","lockfileVersion":3,"packages":null}' > /tmp/lock-null.json
  (swap package-lock, restore after) → Lockfile packages: **0**; Would write SBOM; exit 0

$ npx vitest run tests/unit/this-does-not-exist-xyzzy.test.ts --reporter=dot; echo $?
  → No test files found, exiting with code 1
  → mutation-report runVitest maps any non-zero → status 'killed'

$ coverage-map covered>total → markdown "| … | 120.00 | … |"; heatColor clamps to green ≥95

$ rg -n 'size:check' AGENTS.md docs/wiki/development.md docs/dev/ci-gates-mermaid-q-mp-073.md .github/workflows/ci.yml
  → CI: npm run size:check -- --fail-on-new-over; docs/AGENTS omit the flag

$ Tip CI 38107348270 visual-baseline: 42 failed (report-only job success)

$ Open drafts into cursor/mp-tip-post1218 at audit: #1254–#1260 (7 al implementers)
$ Open drafts into cursor/mp-tip-post1183 at audit: #1212–#1238 (many)
$ Open drafts into cursor/mp-tip-post1083 at audit: ~46
$ Tip→alpha fold open at audit: (none)
```

## New tasks

### q-mp-1033 · Scripts: `engine-coverage-rank` prefer `covered`/`total` over contradictory numeric `pct`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave open `#1260`/`1018` missing/non-numeric pct alone)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong ranking on realistic istanbul rows where `pct` disagrees with counts; no coverage threshold product edits
- **CI / package.json callers:** `package.json` → `report:engine-coverage-rank`; **not** a blocking CI job
- **target files:** `scripts/engine-coverage-rank.mjs` (`collectEngineRows` / rank sort); optional hermetic unit for contradictory pct
- **measured baseline:** Summary with calla `lines: {total:100, covered:90, pct:10}` + ramrod `{total:100, covered:50, pct:50}` ranks **calla #1 at 10.00%** despite 90/100 coverage; exit **0**. Open `#1260`/`1018` only derives when pct is **missing/non-numeric** and keeps “valid numeric pct” unchanged.
- **acceptance criteria:** When numeric `covered` + `total` are present, derive display/rank pct from them (or reject contradictory pct with exit **2**); never rank a 90/100 row below a 50/100 row because stale `pct:10` won; missing-pct path left to `1018`; empty/non-engine path unchanged.
- **verification commands:** `node scripts/engine-coverage-rank.mjs /tmp/stale-pct.json ; echo $?` ; `CI=1 npx vitest run tests/unit/engine-coverage-rank*.test.ts` (if present)
- **conflict notes:** do not sibling missing/non-numeric pct (`1018` / `#1260`).

### q-mp-1034 · Scripts: `flake-rate-unit-loop` do not mark `ok: true` on `success: true` with failures

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave open `#1257`/`1024` corrupt JSON alone)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong aggregation on realistic Vitest JSON shapes; not a new `--help` / parse-guard ticket
- **CI / package.json callers:** `package.json` → `flake:unit`; **not** a blocking CI job
- **target files:** `scripts/flake-rate-unit-loop.mjs` (run summary `ok` assignment ~L179–186); optional unit covering `success:true` + `numFailedTests>0`
- **measured baseline:** `ok` walks failures correctly (`ok: false` when `failed===1`), but published `ok: data.success === true || …` short-circuits to **true** when `success: true` even with `numFailedTests: 2`. E2e loop already keys `ok` off unexpected/failed counts only.
- **acceptance criteria:** Per-run `ok` is true only when walked failures and `numFailedTests` (or equivalent) are 0; `success` alone must not override; summary / `--out` artifacts reflect failures; corrupt-JSON path left to `1024`.
- **verification commands:** `rg -n 'success === true|numFailedTests' scripts/flake-rate-unit-loop.mjs` ; `CI=1 npx vitest run tests/unit/flake-rate-loop*.test.ts`
- **conflict notes:** do not sibling corrupt JSON ingest (`1024`).

### q-mp-1035 · Scripts: `report-ratchet-history --first-parent` pass `--first-parent` to `git log`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (serialize lightly with `1049` on same file)
- **series:** script-tooling
- **verdict:** **SAFE** — flag/docs disagree with git argv; history math wrong on merge-heavy tips; no ceiling edits
- **CI / package.json callers:** `package.json` → `report:ratchet-history`; **not** a blocking CI job
- **target files:** `scripts/report-ratchet-history.mjs` (`collectHistory` log argv + `gitMode` string); unit asserting injected git sees `--first-parent`
- **measured baseline:** `parseArgs(['--first-parent'])` → `firstParent: true`. `collectHistory` then uses `git log` **without** `--all` and **without** `--first-parent`. USAGE promises “HEAD first-parent history”; `gitMode` string becomes `git log (HEAD only)` — still walks merge second parents.
- **acceptance criteria:** When `--first-parent` is set, every `git log` invocation includes `--first-parent`; `gitMode` / USAGE match; default (no flag) still uses `--all` as today; `--dry-run` / write paths unchanged aside from history set.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-ratchet-history.test.ts` ; `node scripts/report-ratchet-history.mjs --help`
- **conflict notes:** serialize with `1049` if both touch `TRACKED` / exports.

### q-mp-1036 · Scripts: `report-knip` reject incomplete / corrupt baseline metrics (no fake growth / no “missing file” lie)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave al `1019` baseline `{}` → “no baseline file” alone; do **not** drop unusedTypes baseline here)
- **series:** script-tooling
- **verdict:** **SAFE** — baseline schema / wrong-results under `--fail`; growth detection must not invent deltas from missing keys
- **CI / package.json callers:** `package.json` → `report:knip`; `.github/workflows/ci.yml` → report-only `knip` job (`continue-on-error: true`)
- **target files:** `scripts/report-knip.mjs` (`loadBaseline` / `diffMetrics` / main); **do not** edit `docs/dev/knip-baseline.json` metrics in this ticket
- **measured baseline:** Baseline with only `metrics.unusedExports` set → `--fail` reports `unusedTypes 0→29` / `unlisted 0→3` and exits **1**. Corrupt baseline `{]` → `[NOTICE] knip report (no baseline file)` and exits **0** even under `--fail` (`loadBaseline` catch → `null`). Distinct from al `1019` (`{}` parses, empty object, “no baseline file” exit 0).
- **acceptance criteria:** Incomplete `metrics` (missing any `METRIC_KEYS` entry, or null/`""`/non-numeric values) exits **1** with a one-line schema error and **no** fake growth warning; unparseable baseline file exits **1** with a parse/schema message (does **not** claim “no baseline file”); truly missing baseline file may keep today’s NOTICE + exit 0; successful full-metrics compare path unchanged; no `--write-baseline` in this ticket.
- **verification commands:** (temp incomplete / corrupt baseline, restore) `node scripts/report-knip.mjs --fail ; echo $?` ; `npm run report:knip` ; `rg -n 'loadBaseline|METRIC_KEYS|no baseline file' scripts/report-knip.mjs`
- **conflict notes:** do not rewrite al `1019` `{}` story; rebase if `1019` lands first and already covers incomplete keys — then narrow this id to corrupt-JSON only or mark contained.

### q-mp-1037 · Scripts: `report-licenses` reject null / empty `packages`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave open `#1256`/`1026` malformed lock alone)
- **series:** script-tooling
- **verdict:** **SAFE** — silent empty SBOM on realistic broken locks; exit must be non-zero
- **CI / package.json callers:** `package.json` → `report:licenses`; **not** a blocking CI job
- **target files:** `scripts/report-licenses.mjs` (`collectPackagesFromLock` / main gate)
- **measured baseline:** Lock `{lockfileVersion:3, packages:null}` (and `packages:{}`) → `Lockfile packages: **0**`; Would write SBOM; exit **0**. Malformed JSON stack left to `1026`.
- **acceptance criteria:** Missing / null / empty `packages` → short error, exit **1**, **no** artifact writes (including `--dry-run` “Would write”); valid lock path unchanged; malformed JSON left to `1026`.
- **verification commands:** (temp null/`{}` lock, restore) `node scripts/report-licenses.mjs --dry-run ; echo $?` ; `rg -n 'packages \|\| \{\}|collectPackagesFromLock' scripts/report-licenses.mjs`
- **conflict notes:** rebase onto `#1256` if still open.

### q-mp-1038 · Scripts: `mutation-report` map Vitest “No test files found” to `error` (not `killed`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave al `1025` baseline `no-tests` skip alone)
- **series:** script-tooling
- **verdict:** **SAFE** — harness scoring metadata only; not student-facing rules/AI product
- **CI / package.json callers:** `package.json` → `mutation:report`; **not** a blocking CI job
- **target files:** `scripts/mutation-report.mjs` (`runVitest` classifier); optional unit for stderr/exit mapping
- **measured baseline:** `npx vitest run tests/unit/this-does-not-exist-xyzzy.test.ts` → “No test files found, exiting with code 1”. `runVitest` maps any non-zero exit to `status: 'killed'`, inflating kill rate when filters miss. Distinct from `1025` (baseline `no-tests` still mutates).
- **acceptance criteria:** No-files / filter-miss / clear vitest infra failures map to `error` (or skip) — not `killed`; real assertion failures remain `killed`; baseline `no-tests` path left to `1025`; no `*/rules.ts` product edits.
- **verification commands:** `npx vitest run tests/unit/this-does-not-exist-xyzzy.test.ts --reporter=dot ; echo $?` ; `rg -n "killed|No test files|status: 'error'" scripts/mutation-report.mjs` ; `CI=1 npx vitest run tests/unit/mutation-report*.test.ts` (if present)
- **conflict notes:** do not widen into AI/scoring product asserts.

### q-mp-1039 · Scripts: `report-coverage-map` clamp or reject `covered > total` (no >100% table)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave open `#1258`/`1017` pct-only fake 100% alone)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong display math on inconsistent summaries; heat already clamps
- **CI / package.json callers:** `package.json` → `report:coverage-map`; **not** a blocking CI job
- **target files:** `scripts/report-coverage-map.mjs` (`metric` / markdown render); optional hermetic unit
- **measured baseline:** Row with `lines: {covered:120, total:100}` aggregates to `pct: 120`; markdown shows `120.00`; `heatColor` clamps to ≥95 green. Distinct from `1017` (pct-only / absent totals → fake 100% via `0/0`).
- **acceptance criteria:** Pct for display/rank ∈ [0, 100] when totals are present (clamp covered to total, or reject summary with exit **1**/**2** and no doc writes); valid istanbul rows unchanged; pct-only path left to `1017`.
- **verification commands:** `CI=1 npx vitest run tests/unit/report-coverage-map.test.ts tests/unit/report-coverage-map-cli-args.test.ts` ; `node scripts/report-coverage-map.mjs --dry-run /tmp/cov-over.json ; echo $?`
- **conflict notes:** do not sibling pct-only (`1017` / `#1258`).

### q-mp-1040 · Docs: CI soft `size:check` uses `--fail-on-new-over` (not plain report-only exit 0)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (serialize lightly with open `#1259`/`1028` on AGENTS/wiki; leave al `1020`/`1021` budgets schema alone)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only; does not change CI workflow or budgets
- **CI / package.json callers:** n/a (documents existing `ci.yml` + `package.json` `size:check`)
- **target files:** `AGENTS.md` (build soft row / local verify bullet); `docs/wiki/development.md` (cheat-sheet + CI prose); `docs/dev/ci-gates-mermaid-q-mp-073.md` (soft step command); optional one-line cross-link in `docs/bundle-budget.md` if needed
- **measured baseline:** Live CI build step runs `npm run size:check -- --fail-on-new-over` (`continue-on-error: true`) — exit **1** on novel OVER. Wiki cheat-sheet says “soft budgets report-only exit 0”; AGENTS soft reproduce is bare `npm run size:check`; mermaid soft step omits the flag.
- **acceptance criteria:** Docs state CI invokes `--fail-on-new-over` and that novel OVER exits **1** while the build job stays soft via `continue-on-error`; local default without the flag remains report-oriented; no workflow / budget number edits; no tip-name / count remasure.
- **verification commands:** `rg -n 'fail-on-new-over|size:check' .github/workflows/ci.yml AGENTS.md docs/wiki/development.md docs/dev/ci-gates-mermaid-q-mp-073.md docs/bundle-budget.md`
- **conflict notes:** co-land carefully with `#1259` if both touch AGENTS/wiki CI posture.

### q-mp-1041 · Tests: pin CI soft `size:check --fail-on-new-over` in workflow contract / handshake

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** prefer fold/co-land of `1040` (docs first is OK)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only contract pin; no workflow behavior change
- **CI / package.json callers:** `package.json` → `test:unit` (blocking `unit` job); local `CI=1 npx vitest run tests/unit/workflow-contract.test.ts` (and/or overnight CI handshake tests)
- **target files:** `tests/unit/workflow-contract.test.ts` and/or `tests/unit/overnight-wave*-ci-workflow*.test.ts` (smallest existing pin site)
- **measured baseline:** Handshake tests pin various CI commands but do **not** assert the build job’s `size:check --fail-on-new-over` soft step. Flag can regress to bare `size:check` while docs stay green.
- **acceptance criteria:** Hermetic assert that build job YAML includes `size:check` with `--fail-on-new-over` (and soft/`continue-on-error` if that is how neighboring pins are structured); no workflow edits in this ticket.
- **verification commands:** `CI=1 npx vitest run tests/unit/workflow-contract.test.ts tests/unit/overnight-wave59-ci-workflow-unit-e2e.test.ts` ; `rg -n 'fail-on-new-over|size:check' tests/unit/workflow-contract.test.ts tests/unit/overnight-wave*-ci-workflow*.test.ts`
- **conflict notes:** leave open `#1259`/`1029` copy-pins pin alone; do not widen CI permissions pins.

### q-mp-1042 · Scripts/docs: `check-pwa-manifest` stop claiming `REPORT_ONLY=0` “fail CI”

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — comment + audit-doc accuracy only; **do not** flip CI to failing without tip-owner ask (that would be HOLD-CHECK)
- **CI / package.json callers:** `package.json` → `check:pwa-manifest`; `.github/workflows/ci.yml` → `build` job soft step `npm run check:pwa-manifest` (default report-only; never sets `REPORT_ONLY=0`)
- **target files:** `scripts/check-pwa-manifest.mjs` (header/USAGE comment); `docs/pwa-manifest-installability-2026-10-08.md` (REPORT_ONLY cheat line)
- **measured baseline:** Script header: `REPORT_ONLY=0 npm run check:pwa-manifest   # fail CI on violations`. Live CI never sets `REPORT_ONLY`; violations with default env exit **0**. Audit doc: `npm run check:pwa-manifest   # report-only (REPORT_ONLY=0 to fail)`.
- **acceptance criteria:** Comments/docs describe opt-in local fail via `REPORT_ONLY=0`, and state CI soft step stays report-only unless tip-owner wires otherwise; no workflow edits in this ticket; no manifest product changes.
- **verification commands:** `rg -n 'REPORT_ONLY|fail CI' scripts/check-pwa-manifest.mjs docs/pwa-manifest-installability-2026-10-08.md .github/workflows/ci.yml` ; `npm run check:pwa-manifest ; echo $?`
- **conflict notes:** wiring `REPORT_ONLY=0` into CI is **out of scope** (would need tip-owner HOLD-CHECK).

### q-mp-1043 · Scripts: `webkit-offline-probe` do not force `process.exit(0)` after failures

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (do **not** clear probe `waitForTimeout` — prior HOLD/skip family)
- **series:** script-tooling
- **verdict:** **SAFE** — exit-code correctness for local probe; preview child keeps event loop alive so `finally`’s delayed `exit(0)` can mask throws
- **CI / package.json callers:** **not** a blocking CI job (local probe; no dedicated `package.json` script required today — invoke via `node scripts/webkit-offline-probe.mjs`)
- **target files:** `scripts/webkit-offline-probe.mjs` (`try/finally` exit); optionally align success-only delayed exit pattern with `probe-offline-resilience.mjs` (`main().catch` → exit 1)
- **measured baseline:** Top-level `try { … } finally { preview.kill; setTimeout(() => process.exit(0), 500) }`. On probe/build failure, preview keepalive + delayed `exit(0)` can force success. Fixed waits in the same file stay out of scope.
- **acceptance criteria:** Process exit code reflects try outcome (non-zero on throw / probe failure); delayed exit may still flush after success; no waitForTimeout / AI / SW product edits.
- **verification commands:** `rg -n 'process\.exit|finally' scripts/webkit-offline-probe.mjs` ; `node scripts/webkit-offline-probe.mjs --help ; echo $?`
- **conflict notes:** leave `probe-offline-resilience*.mjs` wait clears alone; do not sibling `--help` tickets.

### q-mp-1044 · Docs: `docs/dev/knip-report.md` stop claiming unconditional exit 0

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** prefer fold of `1036` (and/or al `1019`) so exit table matches schema behavior; docs-only PR OK if it accurately describes **current** script
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only
- **CI / package.json callers:** n/a (documents `package.json` → `report:knip` / CI knip job)
- **target files:** `docs/dev/knip-report.md` (cheat block ~L11 and any absolute “exit 0” claims)
- **measured baseline:** Line ~11: `npm run report:knip … exit 0`. Later sections already mention `--fail` → exit 1 on growth. Absolute cheat-line disagrees with `--fail` / `enforce` and with schema-exit work in `1019`/`1036`.
- **acceptance criteria:** Cheat block: default exit 0; `--fail`/`enforce` exit 1 on unused growth; invalid/corrupt baseline policy stated once (aligned with landed script); no baseline metric edits.
- **verification commands:** `rg -n 'exit 0|--fail|enforce' docs/dev/knip-report.md scripts/report-knip.mjs` ; `npm run report:knip ; echo $?`
- **conflict notes:** serialize lightly with `1036`.

### q-mp-1045 · Tests: harden `readme-npm-scripts` against `npm run foo:*` globs

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only; prevents false CI failures when docs mention glob families
- **CI / package.json callers:** `package.json` → `test:unit` (blocking `unit` job)
- **target files:** `tests/unit/readme-npm-scripts.test.ts` (`extractNpmRunScripts`)
- **measured baseline:** Regex `/npm run ([a-zA-Z0-9:_-]+)/g` on `` npm run playtest:* `` yields `playtest:` (trailing colon), which is not a `package.json` script → `expect(missing).toEqual([])` fails. Tip HEAD passes only because docs avoid the glob spelling; worker CI run `38106654481` (`q-mp-1002`/`1003`) failed on this class.
- **acceptance criteria:** Extractor ignores glob / trailing-`:` tokens; add a fixture case `` npm run playtest:* `` → not reported missing; real missing scripts still fail the test.
- **verification commands:** `CI=1 npx vitest run tests/unit/readme-npm-scripts.test.ts` ; `node -e '…extract playtest:*…'`
- **conflict notes:** do not “fix” by forbidding glob wording in docs; harden the extractor.

### q-mp-1046 · Tests: `ai-move-time` bench write path use `process.cwd()` (not `/workspace`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — path portability only; suite already `describe.skipIf(!!process.env.CI)`; **no** AI timing/search/difficulty edits
- **CI / package.json callers:** `package.json` → `test:unit` (file skipped under `CI=1`; still parsed/loaded)
- **target files:** `tests/unit/ai-move-time-midgame.bench.test.ts` (writeFileSync path ~L567)
- **measured baseline:** `writeFileSync('/workspace/docs/ai-move-time-2026-10-07.md', …)` — fails outside Cursor `/workspace` checkouts. Local verbose run wall ~92s when not skipped.
- **acceptance criteria:** Write via `resolve(process.cwd(), 'docs/ai-move-time-2026-10-07.md')` (or skip write when not writable); no AI assert / timing / difficulty changes; CI skip behavior unchanged.
- **verification commands:** `rg -n '/workspace' tests/unit/ai-move-time-midgame.bench.test.ts` ; `CI=1 npx vitest run tests/unit/ai-move-time-midgame.bench.test.ts`
- **conflict notes:** HOLD if the change would alter measured mid-game timing tables — path-only edits stay SAFE.

### q-mp-1047 · Tests: delete placeholder `tests/unit/example.test.ts (deleted on tip)`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 dead-code
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none
- **series:** dead-code
- **verdict:** **SAFE** — zero product imports; `1+1` / string-concat only; tip CI still executes it (pre-delete)
- **CI / package.json callers:** `package.json` → `test:unit` (blocking `unit` job)
- **target files:** `tests/unit/example.test.ts (delete)` — tip-folded via `#1264`
- **measured baseline:** File was scaffold-only; no `src/` imports; knip unusedFiles **0** (still discovered by vitest include). Dead-code Rank-2 yes remains **0** for `src/` — this is test scaffold, not Rank-2 inventory.
- **acceptance criteria:** File removed; unit suite discovers one fewer file / two fewer tests; no other edits; `npm run test:unit` still green for an unrelated smoke file if needed.
- **verification commands:** `test ! -f tests/unit/example.test.ts` ; `CI=1 npx vitest run tests/unit/example.test.ts` (expect not found / no tests) ; `rg -n 'Example Unit Tests' tests/unit || true`
- **conflict notes:** do not touch knip baseline / unusedTypes.

### q-mp-1048 · Docs: active audit docs prefer `npm run typecheck` over bare `npx tsc --noEmit`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none (leave al `1007` check:build exit wording alone)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only; matches CONTRIBUTING / wiki preference
- **CI / package.json callers:** n/a (documents existing `package.json` → `typecheck`)
- **target files:** Active audit docs that still end reproduce blocks with bare `npx tsc --noEmit`, including at least: `docs/build-repro-2026-10-08.md`, `docs/pwa-manifest-installability-2026-10-08.md`, `docs/forced-colors-2026-10-08.md`, `docs/keyboard-sr-audit-2026-10-07.md`, `docs/a11y-sweep-2026-10-07.md` (and other `docs/*-2026-10-0*.md` hits from `rg` if still present). Prefer minimal wording: `npm run typecheck`.
- **measured baseline:** `rg -n 'npx tsc --noEmit$' docs/*.md` hits multiple active audits. CONTRIBUTING already says use `npm run typecheck` (not bare `npx tsc --noEmit`).
- **acceptance criteria:** Those reproduce blocks call `npm run typecheck` (or note it via `verify`); no tip-name / count edits; no `tsconfig.ratchet.json` raw-tsc lines rewritten unless they are clearly “developer reproduce” (Phase-2 export may keep `npx tsc -p tsconfig.ratchet.json` if that is the ratchet tool’s real command).
- **verification commands:** `rg -n 'npx tsc --noEmit$' docs/*.md` ; `npm run check:dev-docs`
- **conflict notes:** do not sibling `1007` / build-repro exit-code claims.

### q-mp-1049 · Scripts: remove dead `TRACKED.curly` alias (zero callers)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 dead-code
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** serialize lightly with `1035` on `report-ratchet-history.mjs`
- **series:** dead-code
- **verdict:** **SAFE** — deprecated path alias with **zero** `TRACKED.curly` refs in scripts/tests; lint metric field `curly` on history rows is unrelated and must stay
- **CI / package.json callers:** `package.json` → `report:ratchet-history` (behavior unchanged); unit via `test:unit`
- **target files:** `scripts/report-ratchet-history.mjs` (`TRACKED` freeze); update any comment; unit if it asserted the alias (none today)
- **measured baseline:** `TRACKED = { lintCeilings, curly: /* deprecated alias */, … }`. `rg -n 'TRACKED\.curly'` → **zero** hits outside docs. Comment claims “kept for unit tests” but tests use lint ceilings / row `.curly` metrics, not `TRACKED.curly`.
- **acceptance criteria:** Remove `TRACKED.curly` alias (or add a real unit that asserts alias equality — prefer delete); history row `curly` metric + SVG/md columns unchanged; `report-ratchet-history` tests green.
- **verification commands:** `rg -n 'TRACKED\.curly' -g '!docs/**'` ; `CI=1 npx vitest run tests/unit/report-ratchet-history.test.ts`
- **conflict notes:** serialize with `1035`; do **not** remove lint rule key `curly` / row field `curly`.

### q-mp-1050 · E2E: tip CI `visual-baseline` — 42 failed screenshots (tip-owner refresh vs stabilize)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 flake / visual drift
- **role:** worker (tip-owner screen before PNG churn)
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none
- **series:** flake-hygiene
- **verdict:** **HOLD-CHECK** — report-only CI job is green via `continue-on-error`, but suite is largely red; refreshing baselines is tip-owner judgment (product UI drift vs flake)
- **CI / package.json callers:** `package.json` → `test:e2e:visual` / `test:e2e:visual:update`; `.github/workflows/ci.yml` → report-only `visual-baseline` job
- **target files:** `tests/e2e/visual-baseline.spec.ts`; `tests/e2e/visual-baselines/**` (only with tip-owner OK)
- **measured baseline:** Tip CI run `38107348270` job `visual-baseline`: **42 failed** (desktop + phone start/game openings). Job conclusion success (report-only).
- **acceptance criteria:** Tip-owner chooses (a) intentional baseline refresh via `npm run test:e2e:visual:update` after confirming UI drift, or (b) stabilize waits/selectors without product copy/AI edits; failure count → 0 or documented intentional remaining drift. **Do not** silently churn dozens of PNGs in a drive-by.
- **verification commands:** `npm run test:e2e:visual` ; compare to tip CI visual-baseline log
- **conflict notes:** tip-owner skim before fold.
- **screen:** HOLD-CHECK — visual baseline ownership / possible product UI acceptance.

### q-mp-1051 · E2E: replace permanent WebKit `test.skip` in `canvas-dpr-resize` with a real policy

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 flake-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1218`)
- **depends-on:** none
- **series:** flake-hygiene
- **verdict:** **HOLD-CHECK** — cross-browser flake policy; Chromium path must stay green; tip-owner skim
- **CI / package.json callers:** `package.json` → `test:e2e:chromium` (blocking; includes this spec) and `test:e2e:firefox-webkit` / CI `e2e-cross-browser` (report-only / soft)
- **target files:** `tests/e2e/canvas-dpr-resize.spec.ts` (~L169–175 catch → `test.skip` on webkit)
- **measured baseline:** On WebKit failure, catch permanently `test.skip(true, "webkit Pent'Em In resize hit-test flake…")`. Tip CI `e2e-cross-browser` wall ~534s. Chromium asserts remain required.
- **acceptance criteria:** Replace permanent skip with condition wait / project-scoped skip annotation / documented `test.fix` that does not hide unrelated failures mid-test; Chromium behavior unchanged; no board-3d **src** edits.
- **verification commands:** `npm run test:e2e:chromium -- tests/e2e/canvas-dpr-resize.spec.ts` ; `npm run test:e2e:firefox-webkit -- tests/e2e/canvas-dpr-resize.spec.ts`
- **conflict notes:** tip-owner skim; do not touch mp3d board3d wait families (HOLD).
- **screen:** HOLD-CHECK — cross-browser skip policy.

## Verdict summary

| Id | Verdict | One-line |
| --- | --- | --- |
| `q-mp-1033` | **SAFE** | engine-coverage-rank: prefer covered/total over contradictory pct |
| `q-mp-1034` | **SAFE** | flake-rate-unit: no ok=true on success:true with failures |
| `q-mp-1035` | **SAFE** | report-ratchet-history: pass git `--first-parent` |
| `q-mp-1036` | **SAFE** | report-knip: incomplete/corrupt baseline schema (not fake growth) |
| `q-mp-1037` | **SAFE** | report-licenses: reject null/empty packages |
| `q-mp-1038` | **SAFE** | mutation-report: no-files → error, not killed |
| `q-mp-1039` | **SAFE** | coverage-map: no >100% when covered>total |
| `q-mp-1040` | **SAFE** | docs: CI size:check uses --fail-on-new-over |
| `q-mp-1041` | **SAFE** | tests: pin CI size:check --fail-on-new-over |
| `q-mp-1042` | **SAFE** | pwa-manifest: REPORT_ONLY comment ≠ “fail CI” |
| `q-mp-1043` | **SAFE** | webkit-offline-probe: don’t force exit 0 after failures |
| `q-mp-1044` | **SAFE** | knip-report.md: stop absolute exit 0 |
| `q-mp-1045` | **SAFE** | readme-npm-scripts: ignore npm run foo:* globs |
| `q-mp-1046` | **SAFE** | ai-move-time bench: cwd-relative write path |
| `q-mp-1047` | **SAFE** | delete placeholder example.test.ts |
| `q-mp-1048` | **SAFE** | audit docs: npm run typecheck not bare npx tsc |
| `q-mp-1049` | **SAFE** | remove dead TRACKED.curly alias |
| `q-mp-1050` | **HOLD-CHECK** | visual-baseline 42 failures — tip-owner refresh/stabilize |
| `q-mp-1051` | **HOLD-CHECK** | canvas-dpr-resize WebKit permanent skip policy |

**Screened HOLD-CHECK (2):** `1050`, `1051` — tip-owner should skim before fold (visual baseline ownership; cross-browser skip policy).  
**No HOLD** product tickets queued (AI shard speedups measured but left out of scope).

## Out of scope / not used here

Already claimed / undrafted / HOLD / no headroom / prompt-skipped families: void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets eqeqeq probe (`792`), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki **count** remasure, tip-name pointers (`1027`/`1032`), UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e** wait clears, harness shards, demo coverage, `*types*` residuals, page-ready / double-rAF / artifact-dir / mountPair / npm aliases / `--help`/`--dry-run`/argv / empty-input / lib main-entry (rounds 34–38), deep-playtest `waitForTimeout` (`803`–`807` / `1030`/`1031`), overnight mountPair/router batches, round-31…38 tickets through `q-mp-1032`, CI `e2e-cross-browser` yaml named script (`800`), dismissOwl deep-playtest (`879`), stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline **wait** clears (prior HOLD/skip), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK), Queens & Guards product, AI timing / Hex Hard 450ms / Stars & Bars history cap, AI determinism/quality shard wall-time cuts (HOLD), dead-code Rank-2 yes deletes (live **0**), `cancelFabAiRequests` knip LEAVE (AI HOLD).

**Could not honestly fill to 25** without filler (more `--help`/`--dry-run`/argv/empty-input theater, mountPair adoptions, npm aliases, tip-stamp count remasures, AI harness speed theater, or HOLD board-3d/mp3d wait clears). Stopped at **19**.
