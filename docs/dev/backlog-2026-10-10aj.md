# Engineering backlog — 2026-10-10aj (tip refill after post1183 folds / round-36)

**Task id:** `q-mp-090aj`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1183` @ `f060d745` (full `f060d745f16cd11b0ad2d1a3151cc313c0c58f02`; tip carries AGENTS tip pointer → `post1183`, round-34/35 backlogs `10ah`/`10ai`, and tip-folded helpers `page-settle.mjs` / `artifact-dir.mjs` / lib main-entry for `env-number`/`page-ready`/`dismiss-owl` / `perf:render` alias / render-perf-mode `waitForGameReady`)  
**Depends on:** tip cut `cursor/mp-tip-post1183` @ `f060d745`. Round-35 backlog (`q-mp-090ai` / tip-carried `10ai`, ids `q-mp-942`…`959`) already has implementers on **this** tip (`#1212`–`#1228`; remaining ai gaps without open PR at audit: `942`/`953`/`956`/`957`/`959`) — leave with `contained`. Round-34 ah gaps `924`/`929` and older ag/af stacks — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1183` @ `f060d745` measures suite **3391** files / **14578** listed cases; Chromium e2e **25** files / **249** cases; lint ratchet green (eqeqeq **1**/1 in `src/games/fiar/rules.ts` — HOLD); typecheck in-scope **0** / out-of-scope **216**; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 yes **0**. This doc lists **14 new** concrete engineering tasks (`q-mp-967` … `q-mp-980`) mined from the **live tip tree**, checked against prior refills (`q-mp-090` … `q-mp-090ai` / ids through `q-mp-959`) and against the full open draft PR list (including post1183 workers `#1212`–`#1228`, post1143 leftovers `#1195`–`#1211`, and post1083 leftovers `#1136`–`#1182`). It is the **only** deliverable of `q-mp-090aj`.

**Honest count:** Only **14** tasks — not padded to 25. Round-35 already claimed empty `--files-from` fallback, lint-buckets unknown flags, `perf:render` alias, wiki cheat-sheet/`docs:visuals-2026-10`, page-settle adopters in render-perf\*, measureTTI page-ready, mountPair burn-1008, fullgame helpers/waits, kwatro mulberry, e2e page-settle, artifact-dir extract + adopters, lib main-entry for env-number/page-ready/dismiss-owl, and `perf:runtime:render` — **do not** re-queue `942`–`959` (tip-carried `10ai` + open `#1212`–`#1228`; ai gaps `942`/`953`/`956`/`957`/`959` still need workers — leave with `contained`). Round-34 `917`–`938` and round-33 `892`–`911` remain owned. This refill **does not** re-queue per-game UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **src** or **mp3d e2e** edits, remasure/count-stamp inventories, tip-stamp docs, doc-pointer churn, more mountPair adoptions, more npm-alias/`--help` sweeps unless genuinely missing, overnight mountPair/router batches, script `waitForTimeout` families already owned by `803`–`807` / `883`/`884`/`909`/`937`/`938`/`951`/`952`, stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline fixed-wait clears (prior HOLD/skip), dismissOwl deep-playtest adoption (`879`), CI `e2e-cross-browser` named script (`800`), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK — not queued), or anything in rounds ≤35. Payoffs are freshly measured on this tip: **`mutation-report --max=` silently becomes “all mutants”**, **`--games=` / `--json=` empty values succeed as no-ops**, **`report-lint-buckets --top 0`/`--top=abc` silently keep default 10** (even after tip-carried `943` unknown-flag rejection), **`--top 1.5` truncates to 1**, **`check-emit-identity --base --minify` treats `--minify` as a git ref**, **flake-rate `--out --help` errors on `--out` instead of printing help**, **`docs/perf-2026-10-07.md` still claims `check:perf` always exit 0**, **capture-\* specs still inline `waitForGameReady`/`dismissOwlIfNeeded`**, **`tests/playtest` still hard-codes `/opt/cursor/artifacts` + local `dismissOwl`**, **lib modules `mutation-report-args` / `mobile-audit-out-path` / `pwa-manifest-contract` / `page-settle` / `artifact-dir` / harness CLI parsers still silent on main**, **graph-demo residuals still inline `clickEl`**, **`report-coverage-map` / `report-licenses` have no `--dry-run`**, and **`check-copy-pins --fail` prints `Report-only: exit 0` while exiting 1**.

**Preference:** SAFE, mutually independent **scripts/** tooling, **docs-only**, or **tests-only** helper adoption. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings, boundaries/PWA installability thresholds, board-3d layout inventory, CI permissions, tip-pointer / tip-name sweep theater, open-draft triage, emit-identity inventory remasure, knip drift, dead-CSS Rank-1 rescan, coverage-map heat regenerate, or wiki **count** stamps. **Avoid** competing tickets already owned by open `#1212`–`#1228` / `#1195`–`#1211` / `#1162`–`#1182` / tip-carried `10ag`/`10ah`/`10ai` ids. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

Skipped topics already covered by `q-mp-176`–`q-mp-959`, open drafts, or prior ids (non-exhaustive; `gh pr list --state open` 2026-10-11):

| Topic family | Why skipped |
| --- | --- |
| round-35 backlog / empty `--files-from` (`942`) / lint unknown flags (`943`) / `perf:render` (`944`) / wiki cheat-sheets (`945`/`946`) / page-settle render-perf (`947`) / measureTTI (`948`) / mountPair burn-1008 (`949`) / fullgame helpers+waits (`950`–`952`) / kwatro mulberry (`953`) / e2e page-settle (`954`) / artifact-dir extract+adopters (`955`–`957`) / lib main-entry env/page/dismiss (`958`) / `perf:runtime:render` (`959`) | tip-carried `10ai` + workers `#1212`–`#1228`; ai gaps `942`/`953`/`956`/`957`/`959` still need workers — leave with `contained`; **do not** re-queue `942`–`959` (this refill’s `968` is **only** non-positive/non-integer `--top` + empty `--rule=`, not a sibling of `943`’s unknown-flag rejection; `975`/`980` are **only** other lib modules, not siblings of `958`) |
| round-34 / check:perf+engine-rank+render-perf-mode help (`917`–`919`) / page-settle extract (`920`) / page-ready+dismissOwl unit (`921`/`922`) / page-ready adopters (`923`–`925`) / npm aliases (`926`–`929`) / mountPair destroy+AI-input (`930`–`936`) / e2e waits (`937`/`938`) | tip-carried `10ah` + open `#1195`–`#1210` / post1183 folds — leave with `contained` |
| round-33 / lint+type+pwa+dev-docs+size `--help` (`894`/`895`/`897`/`898`/`899`) / mountPair contig-end+fiar-timer+kings-touch (`903`–`905`) / other `892`–`911` | tip-carried `10ag` + `#1179`; ag gaps still need workers — leave with `contained` |
| round-32 / mutation argv (`867`/`868`) / emit missing-path (`869`) / lint-buckets `--top` missing value (`870`) / flake `--out` / … / offline help | open `#1162`–`#1182` on post1083 — leave with `contained`; **do not** re-queue `867`–`886` (this refill’s `967` is **only** empty `--max=`/`--games=`/`--json=` values, not a sibling of `867`’s non-numeric `--max`) |
| per-game UI coverage / soft-fail chars / mutation-audit waves / board-3d **src** / **mp3d e2e** / remasure inventories / tip-name stamps / `*types*` residuals / doc-pointer churn / more mountPair / more npm-alias/`--help` theater | prompt hard-skip for round-36 |
| knip unusedExports LEAVE / unusedTypes baseline drop / wiki count cells / AGENTS tip name | remasure / tip-stamp theater / intentional LEAVE |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions widening / eqeqeq in `fiar/rules.ts` | hard-rule HOLD |
| wiki `#658` “Open draft” regression (`822`) | leave prior id; do not open a sibling |
| stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline fixed waits | prior HOLD/skip |
| dismissOwl deep-playtest local copies (`879`) | still needs a worker — **do not** sibling; leave `879` (this refill’s `974` is **only** `tests/playtest/*`, not `scripts/*deep-playtest*`) |
| CI `e2e-cross-browser` named script (`800`) | tip-queued; unworked — **do not** re-queue |
| emit-identity default wave5 merge-base tip retarget | tip-owner HOLD-CHECK — not queued |
| `tests/visual/helpers.ts` mulberry inside `addInitScript` | cannot import Node `tests/helpers/rng` — prior note; leave alone |
| console-sweep / flake `/opt/cursor/artifacts` defaults (`956`) | owned by open ai gap — leave `956`; do not sibling |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening, apt, or network-in-tests work. No `memory/` files.

## Stale queue re-check (live tip `f060d745`)

| Id | Title (short) | Verdict | Evidence @ `f060d745` |
| --- | --- | --- | --- |
| `q-mp-090ai` / tip-carried `10ai` | round-35 backlog | **tip-carried** | Leave with `contained` — this refill starts after `959`. |
| `q-mp-942`/`953`/`956`/`957`/`959` | ai gaps without open PR | **still-valid; need workers** | Leave prior ids; do not sibling. |
| `q-mp-917`–`938` / `#1195`–`#1210` + tip folds | round-34 | **still-valid / tip-folding** | Leave alone. Ah gaps `924`/`929` still need workers. |
| `q-mp-894`/`895`/`897`/`898`/`899` | lint/type/pwa/dev-docs/size `--help` | **still-valid; no open implementer PR** | Live scripts still ignore `--help` / run full work — leave prior ids; do not sibling. |
| `q-mp-867`–`886` / `#1162`–`#1182` | round-32 | **still-valid (open on post1083)** | Leave alone. Tip already carries many af fixes; empty `--max=` gap is new (`967`). |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-879` | dismissOwl deep-playtest adopters | **still-valid; no open PR** | `scripts/*deep-playtest*` local copies remain — leave prior id; `974` is `tests/playtest` only. |
| `q-mp-943` / `#1216` | lint-buckets unknown flags | **tip-carried / open draft** | `--wat` now exits **2**; `--top 0` still silently keeps default — `968` is the missing value-hygiene piece only. |
| `q-mp-667`–`668` / `#1098` | wiki/testing-layers counts | **stale vs live 3391/14578** | **do not** re-queue count stamps. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/lib/mutation-report-args.mjs` + `mutation-report.mjs` + unit | `967` + `975` — serialize; leave open `#1181`/`867`/`868` alone |
| `scripts/report-lint-buckets.mjs` + unit parseArgs test | `968` only; serialize with open `#1216`/`943` + `#1172`/`870` |
| `scripts/check-emit-identity.mjs` + unit | `969` only; leave `#1163`/`869` + ai `942` alone; do **not** retarget wave5 merge-base tip |
| `scripts/flake-rate-*-loop.mjs` | `970` only; serialize lightly with ai `956` artifact-dir adopters |
| `docs/perf-2026-10-07.md` | `971` only |
| `scripts/capture-*.spec.ts` | `972` + `973` — serialize |
| `tests/playtest/*.mjs` | `974` only; leave `879` scripts deep-playtests alone; serialize with ai `955`/`956`/`957` |
| `scripts/lib/{mutation-report-args,mobile-audit-out-path,pwa-manifest-contract}.mjs` | `975` only; leave tip-folded `958` alone |
| `tests/unit/q-mp-607-graph-demo-coverage.test.ts` + `q-mp-664-…` | `976` only |
| `scripts/report-coverage-map.mjs` | `977` only; leave `#1154`/`847` missing-summary message alone |
| `scripts/check-copy-pins.mjs` | `978` only; leave `#1168`/`873` unknown-flag work alone |
| `scripts/report-licenses.mjs` | `979` only; leave `#1175`/`885` unknown-flag work alone |
| `scripts/lib/{page-settle,artifact-dir,help-only-cli,browser-harness-cli,deep-playtest-cli,offline-probe-cli}.mjs` | `980` only; leave tip-folded `958` + `975` alone |

**Parallel-friendly:** `967`, `968`, `969`, `970`, `971`, `974`, `975`, `976`, `977`, `978`, `979`, `980`. Serialize `972`→`973` on capture specs; serialize `967`/`975` on mutation-report-args; serialize `968` with `#1216`; serialize `974` with artifact-dir adopters.

## Live tip measurements (evidence snapshot @ `f060d745`)

```text
$ git rev-parse HEAD
  f060d745f16cd11b0ad2d1a3151cc313c0c58f02

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

$ npm run report:dead-code -- --dry-run
  Safe-to-remove yes: 0

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3391

$ npx vitest list | wc -l
  14578

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ node scripts/mutation-report.mjs --max= --dry-run
  → maxMutantsPerGame=all (Number('')===0); exit 0 — typo becomes “mutate everything”

$ node scripts/mutation-report.mjs --games= --dry-run
  → would mutate 0 games; exit 0

$ node --input-type=module -e "import {parseArgs} from './scripts/report-lint-buckets.mjs'; console.log(parseArgs(['--top','0']), parseArgs(['--top=abc']), parseArgs(['--top','1.5']))"
  → {ok:true,top:10} / {ok:true,top:10} / {ok:true,top:1}  (invalid values silently coerced)

$ node scripts/check-emit-identity.mjs --base --minify
  → base=--minify; “no ai/ files to compare”; exit 0

$ node scripts/flake-rate-unit-loop.mjs --out --help; echo $?
  → Missing or invalid value for --out; exit 1 (help never printed)

$ rg -n 'always exit 0' docs/perf-2026-10-07.md
  → npm run check:perf … always exit 0  (wiki development.md already says missing dist/ → exit 2)

$ node scripts/check-copy-pins.mjs --fail; echo $?
  → prints “Report-only: exit 0” then exitCode 1

$ node scripts/report-coverage-map.mjs --dry-run; echo $?
  → Unknown flag: --dry-run; exit 2

$ Open drafts into cursor/mp-tip-post1183 at audit: #1212–#1228
$ Open drafts into cursor/mp-tip-post1143 at audit: #1195–#1211
$ Open drafts into cursor/mp-tip-post1083 at audit: #1136–#1182
```

## New tasks

### q-mp-967 · Scripts: `mutation-report` reject empty `--max=` / `--games=` / `--json=`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (serialize with open `#1181`/`867`/`868`; leave tip-carried help/`--dry-run` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong-results fix for empty `=` values; intentional `--max=0` (“all”) unchanged; no `rules.ts` mutation on reject paths
- **CI / package.json callers:** `package.json` → `mutation:report`; **not** a blocking CI job (local / AGENTS helper)
- **target files:** `scripts/lib/mutation-report-args.mjs`; `scripts/mutation-report.mjs` (if thin glue); `tests/unit/mutation-report-args.test.ts`
- **measured baseline:** `node scripts/mutation-report.mjs --max= --dry-run` prints `maxMutantsPerGame=all` (because `Number('')===0`) and exit **0**. `--games=` / `--games=,,,` resolve to **0 games** and exit **0**. `--json=` accepts empty `jsonOut`. `--timeout=` already rejects (good contrast). `--max=0` remains intentional “all”.
- **acceptance criteria:** Empty / whitespace-only values for `--max=` / `--games=` / `--json=` exit **2** with usage before any plan/mutation; `--max=0` still means all; valid `--games=calla` / `--json=path` unchanged; hermetic unit coverage for the empty-value cases; no product `src/` edits.
- **verification commands:** `node scripts/mutation-report.mjs --max= --dry-run ; echo $?` ; `node scripts/mutation-report.mjs --games= --dry-run ; echo $?` ; `node scripts/mutation-report.mjs --json= --dry-run ; echo $?` ; `node scripts/mutation-report.mjs --max=0 --dry-run ; echo $?` ; `CI=1 npx vitest run tests/unit/mutation-report-args.test.ts`
- **conflict notes:** rebase onto `#1181` if parse helpers moved; do not open a sibling that retargets non-numeric `--max` (owned by `867`).

### q-mp-968 · Scripts: `report-lint-buckets` reject non-positive / non-integer `--top` (+ empty `--rule=`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (serialize with open `#1216`/`943` + `#1172`/`870`)
- **series:** script-tooling
- **verdict:** **SAFE** — argv value hygiene only; no ceiling writes; no eslint product clears
- **CI / package.json callers:** `package.json` → `report:lint-buckets`; **not** a blocking CI job (local / docs helper)
- **target files:** `scripts/report-lint-buckets.mjs` (`parseArgs`); `tests/unit/report-lint-buckets-parse-args.test.ts`
- **measured baseline:** Tip-carried `943` rejects `--wat` (exit **2**). `parseArgs(['--top','0'])` and `['--top=abc']` still return `{ok:true,top:10}` (invalid values silently ignored; default kept). `['--top','1.5']` → `top:1` via `parseInt`. `['--rule=']` → `rule:null` (runs all rules). Unit file has **no** cases for `0` / `abc` / `1.5` / empty `--rule=`.
- **acceptance criteria:** `--top 0` / `--top=0` / `--top=abc` / non-integers exit **2** with usage **before** spawning the probe; empty `--rule=` exits **2**; valid `--top 5` / `--rule=curly` unchanged; hermetic parseArgs + CLI spawn tests cover the new rejects; no ceiling JSON edits.
- **verification commands:** `node scripts/report-lint-buckets.mjs --top 0 ; echo $?` ; `node scripts/report-lint-buckets.mjs --top=abc ; echo $?` ; `node scripts/report-lint-buckets.mjs --top 1.5 ; echo $?` ; `node scripts/report-lint-buckets.mjs --rule= ; echo $?` ; `CI=1 npx vitest run tests/unit/report-lint-buckets-parse-args.test.ts`
- **conflict notes:** rebase onto `#1216` if that PR still reshapes `parseArgs`; do not sibling unknown-flag work.

### q-mp-969 · Scripts: `check-emit-identity` reject missing / flag-like `--base` / `--head` / `--files-from` values

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave `#1163`/`869` missing-path message alone; leave ai `942` empty-list fallback alone; do **not** retarget wave5 merge-base tip)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong-results fix for option values; no AI product / emit threshold edits
- **CI / package.json callers:** `package.json` → `check:emit-identity`; **not** a blocking CI job (local / AGENTS helper)
- **target files:** `scripts/check-emit-identity.mjs` (`parseArgs`); `tests/unit/check-emit-identity.test.ts`
- **measured baseline:** `node scripts/check-emit-identity.mjs --base --minify` sets `base=--minify`, prints `no ai/ files to compare`, exit **0**. Bare `--base` / `--head` fall through to default merge-base / `WORKING_TREE` instead of usage errors. `--files-from --minify` already exits **2** via “path not found: --minify” — tighten to “flag-like / missing value” messaging consistent with `869` if straightforward. Valid `--base HEAD~1` unchanged.
- **acceptance criteria:** Missing or flag-like values for `--base` / `--head` / `--files-from` exit **2** with usage **before** any emit work; valid refs/paths unchanged; hermetic parseArgs coverage; no merge-base tip retarget; empty `--files-from` list behavior left to `942`.
- **verification commands:** `node scripts/check-emit-identity.mjs --base --minify ; echo $?` ; `node scripts/check-emit-identity.mjs --base ; echo $?` ; `node scripts/check-emit-identity.mjs --head --minify ; echo $?` ; `node scripts/check-emit-identity.mjs --files-from --minify ; echo $?` ; `CI=1 npx vitest run tests/unit/check-emit-identity.test.ts`
- **conflict notes:** rebase onto `#1163` / `942` if parse helpers moved; do not open a sibling of the HOLD-CHECK merge-base tip retarget.
- **screen:** HOLD-CHECK (downgraded): check-emit-identity is an AI-adjacent gate script — argv value hygiene only, zero src/AI edits; grep CI/package.json callers first.

### q-mp-970 · Scripts: flake-rate loops honor `--help` / `-h` anywhere in argv

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (serialize lightly with ai `956` if that touches the same argv helpers)
- **series:** script-tooling
- **verdict:** **SAFE** — help-ordering UX only; no flake-run counts / shuffle edits
- **CI / package.json callers:** `package.json` → `flake:unit`, `flake:e2e`; **not** blocking CI jobs (local helpers)
- **target files:** `scripts/flake-rate-unit-loop.mjs`; `scripts/flake-rate-e2e-loop.mjs`
- **measured baseline:** `node scripts/flake-rate-unit-loop.mjs --out --help` exits **1** with `Missing or invalid value for --out` because `applyEarlyCli` consumes the next token as `--out`’s value before noticing `--help`. Same class for `--runs --help`. Bare `--help` still works (exit **0**). `mobile-audit.mjs` already scans for help across all argv first — good contrast.
- **acceptance criteria:** `--help`/`-h` anywhere in argv prints usage and exits **0** without mkdir / vitest / playwright spawn; missing `--out` value without help still exits non-zero; unknown flags still exit **2**; no run-count edits.
- **verification commands:** `node scripts/flake-rate-unit-loop.mjs --out --help ; echo $?` ; `node scripts/flake-rate-unit-loop.mjs --runs --help ; echo $?` ; `node scripts/flake-rate-e2e-loop.mjs --out --help ; echo $?` ; `node scripts/flake-rate-unit-loop.mjs --help ; echo $?`
- **conflict notes:** serialize lightly with `956` artifact-dir default rewires.

### q-mp-971 · Docs: `docs/perf-2026-10-07.md` stop claiming `check:perf` always exit 0

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave `#1164`/`875` script body alone; wiki cheat-sheet already corrected)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only correction of a stale exit-code claim; no harness / CI edits
- **CI / package.json callers:** n/a (docs only; script `check:perf` already exists)
- **target files:** `docs/perf-2026-10-07.md` (command cheat block near the `always exit 0` line)
- **measured baseline:** Line still says `npm run check:perf … always exit 0`. Live script without `dist/` exits **2** (`usage error`). `docs/wiki/development.md` already documents `missing dist/ → exit 2; with dist/ report-only exit 0`.
- **acceptance criteria:** Perf doc matches live exit semantics (missing `dist/` → non-zero usage error; with `dist/` report-only exit 0); no tip-name / count-cell edits; no script body edits required.
- **verification commands:** `rg -n 'check:perf|always exit 0|exit 2' docs/perf-2026-10-07.md docs/wiki/development.md scripts/check-perf.mjs` ; `node scripts/check-perf.mjs ; echo $?`
- **conflict notes:** do not open a third ticket about the wiki one-liner (already fixed).

### q-mp-972 · Scripts: adopt shared `page-ready` + `dismiss-owl` in capture gallery / visuals / lifecycle

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (tip already has `scripts/lib/page-ready.mjs` + `dismiss-owl.mjs`; serialize lightly with `973`)
- **series:** script-tooling
- **verdict:** **SAFE** — Playwright capture harness DRY only; no PNG / config / baseline regenerates
- **CI / package.json callers:** `package.json` → `docs:gallery`, `docs:lifecycle-visuals`, `docs:visuals-2026-10`; **not** blocking CI jobs (local docs capture)
- **target files:** `scripts/capture-gallery.spec.ts`; `scripts/capture-visuals-2026-10.spec.ts`; `scripts/capture-lifecycle-visuals-q-mp-146.spec.ts`
- **measured baseline:** Each file still defines local `dismissOwlIfNeeded` + `waitForGameReady` duplicating the shared loading+chrome / owl contracts. Tip libs already export the shared helpers (and tip-folded `958` gave them main-entry usage).
- **acceptance criteria:** Local ready/dismiss helpers removed in favor of shared imports (timeout option OK); capture case lists / selectors unchanged; no baseline PNG regenerates in this ticket; leave fixed `waitForTimeout` sleep sites to `973`.
- **verification commands:** `rg -n 'waitForGameReady|dismissOwl|from .*page-ready|from .*dismiss-owl' scripts/capture-gallery.spec.ts scripts/capture-visuals-2026-10.spec.ts scripts/capture-lifecycle-visuals-q-mp-146.spec.ts` ; `node -e "const s=require('./package.json').scripts; for (const k of ['docs:gallery','docs:lifecycle-visuals','docs:visuals-2026-10']) console.log(k, !!s[k])"`
- **conflict notes:** serialize with `973` on the same three files.

### q-mp-973 · Scripts: replace fixed `waitForTimeout` sleep helper in capture specs where straightforward

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** prefer fold/co-land of `972`
- **series:** script-tooling
- **verdict:** **SAFE** — capture harness wait hygiene; no visual baseline regenerates; **not** AI product timing
- **CI / package.json callers:** `package.json` → `docs:gallery`, `docs:lifecycle-visuals`, `docs:visuals-2026-10`
- **target files:** `scripts/capture-gallery.spec.ts`; `scripts/capture-visuals-2026-10.spec.ts`; optionally lifecycle if it still has fixed sleeps after `972`
- **measured baseline:** gallery + visuals-2026-10 each wrap `page.waitForTimeout(ms)` in a local sleep helper (1 call site definition each; used for post-nav settle). Not mp3d / fullgame / required chromium smoke.
- **acceptance criteria:** Fixed timeouts replaced with condition / locator / shared settle (`page-settle` / double-rAF) where straightforward; capture lists unchanged; no PNG updates required; no `src/` edits.
- **verification commands:** `rg -n 'waitForTimeout' scripts/capture-gallery.spec.ts scripts/capture-visuals-2026-10.spec.ts scripts/capture-lifecycle-visuals-q-mp-146.spec.ts` ; `npm run test:e2e:chromium -- --list`
- **conflict notes:** co-land carefully with `972`; do not touch mp3d e2e waits.
- **screen:** SAFE — condition waits only; no AI timing thresholds or Hex Hard 450ms.

### q-mp-974 · Tests/playtest: adopt shared `dismissOwl` + `artifact-dir` in fab-a-diffy + star-track harnesses

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** tip-folded `955` (`scripts/lib/artifact-dir.mjs`); leave `879` scripts deep-playtest adopters alone
- **series:** script-tooling
- **verdict:** **SAFE** — local playtest harness path/owl DRY only; no difficulty / matrix / AI delay edits
- **CI / package.json callers:** **none** (local-only under `tests/playtest/`; not wired to `package.json` CI jobs)
- **target files:** `tests/playtest/fab-a-diffy-deep.mjs`; `tests/playtest/star-track-deep-playtest.mjs`; read-only `scripts/lib/dismiss-owl.mjs` + `scripts/lib/artifact-dir.mjs`
- **measured baseline:** Both hard-code `/opt/cursor/artifacts/…` and define local `async function dismissOwl`. Tip already has shared `dismissOwl` + `resolveArtifactDir` / `artifactPath`. `879` owns `scripts/*deep-playtest*` only — these `tests/playtest` copies are uncovered.
- **acceptance criteria:** Local `dismissOwl` removed; artifact roots go through the shared helper (env overrides preserved if present); no playtest matrix / wait / scoring edits; `node --check` on touched files.
- **verification commands:** `rg -n 'dismissOwl|artifact-dir|/opt/cursor/artifacts' tests/playtest/fab-a-diffy-deep.mjs tests/playtest/star-track-deep-playtest.mjs` ; `node --check tests/playtest/fab-a-diffy-deep.mjs tests/playtest/star-track-deep-playtest.mjs`
- **conflict notes:** do not touch `scripts/calla-deep-playtest.mjs` et al. (leave `879`).

### q-mp-975 · Scripts: lib modules main-entry usage for `mutation-report-args` / `mobile-audit-out-path` / `pwa-manifest-contract`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave tip-folded `958` env-number/page-ready/dismiss-owl alone)
- **series:** script-tooling
- **verdict:** **SAFE** — library entry guard only; import-as-library path unchanged; no Playwright launch / mutation I/O
- **CI / package.json callers:** **none** (libs imported by harnesses; not direct CI steps)
- **target files:** `scripts/lib/mutation-report-args.mjs`; `scripts/lib/mobile-audit-out-path.mjs`; `scripts/lib/pwa-manifest-contract.mjs` (add `isMain` usage path; reuse `help-only-cli` if it fits)
- **measured baseline:** Tip-folded `958` fixed env-number/page-ready/dismiss-owl. `node scripts/lib/mutation-report-args.mjs --help`, `mobile-audit-out-path.mjs --help`, and `pwa-manifest-contract.mjs --help` still exit **0** with **empty** stdout/stderr.
- **acceptance criteria:** When executed as main, `--help`/`-h` (and bare main) print a short “library module — import from harness X” usage and exit **0**; unknown flags exit non-zero; import path has no side effects; existing unit tests for mutation-report-args / mobile-audit-out-path still green; optional tiny main-guard tests OK.
- **verification commands:** `node scripts/lib/mutation-report-args.mjs --help ; echo $?` ; `node scripts/lib/mobile-audit-out-path.mjs --help ; echo $?` ; `node scripts/lib/pwa-manifest-contract.mjs --wat ; echo $?` ; `node --check scripts/lib/mutation-report-args.mjs scripts/lib/mobile-audit-out-path.mjs scripts/lib/pwa-manifest-contract.mjs`
- **conflict notes:** do not rewrite exports claimed by open mutation argv / mobile-audit `--out` drafts.

### q-mp-976 · Tests: adopt shared `dom-click` `click` in graph-demo residual suites

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only helper adoption; asserts + case counts unchanged; no `src/` / demo product edits
- **target files:** `tests/unit/q-mp-607-graph-demo-coverage.test.ts`; `tests/unit/q-mp-664-graph-demo-residual-branches.test.ts`
- **measured baseline:** Both files still define local `function clickEl(el)` while many sibling suites already `import { click } from '../helpers/dom-click'`.
- **acceptance criteria:** Local `clickEl` removed in favor of shared `click`; asserts + `npx vitest list | wc -l` unchanged aside from unrelated tip drift; targeted vitest green; no `src/` edits.
- **verification commands:** `rg -n 'clickEl|from .*dom-click' tests/unit/q-mp-607-graph-demo-coverage.test.ts tests/unit/q-mp-664-graph-demo-residual-branches.test.ts` ; `CI=1 npx vitest run tests/unit/q-mp-607-graph-demo-coverage.test.ts tests/unit/q-mp-664-graph-demo-residual-branches.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** leave soft-fail characterization tickets alone.

### q-mp-977 · Scripts: `report-coverage-map` add `--dry-run` (no doc writes)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave `#1154`/`847` missing-summary message alone)
- **series:** script-tooling
- **verdict:** **SAFE** — report-script write guard only; no coverage thresholds / heat regenerates required
- **CI / package.json callers:** `package.json` → `report:coverage-map`; **not** a blocking CI job (local / docs helper)
- **target files:** `scripts/report-coverage-map.mjs`
- **measured baseline:** Sibling `report-dead-code` / `report-ratchet-history` support `--dry-run`. `node scripts/report-coverage-map.mjs --dry-run` exits **2** with `Unknown flag: --dry-run`. Default path still writes `docs/dev/coverage-map.{md,svg}` whenever a summary exists.
- **acceptance criteria:** `--dry-run` computes/prints summary counts (or equivalent) and exits **0** without writing md/svg; `--help` unchanged; unknown flags still exit **2**; default write path unchanged; optional hermetic unit coverage OK.
- **verification commands:** `node scripts/report-coverage-map.mjs --dry-run ; echo $?` ; `node scripts/report-coverage-map.mjs --help ; echo $?` ; `node scripts/report-coverage-map.mjs --wat ; echo $?` ; `rg -n 'dry-run|writeFileSync' scripts/report-coverage-map.mjs`
- **conflict notes:** do not regenerate coverage heat as part of this ticket.

### q-mp-978 · Scripts: `check-copy-pins --fail` must not print `Report-only: exit 0`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave `#1168`/`873` unknown-flag work alone)
- **series:** script-tooling
- **verdict:** **SAFE** — footer/exit messaging only; default report-only path unchanged; no copy-pin rule edits
- **CI / package.json callers:** `package.json` → `check:copy-pins`; **not** a blocking CI job (local / AGENTS helper; opt-in `--fail`)
- **target files:** `scripts/check-copy-pins.mjs` (footer near findings print / `process.exitCode`); optional tiny CLI unit/spawn test
- **measured baseline:** `node scripts/check-copy-pins.mjs --fail` finds findings, prints `Report-only: exit 0`, then sets `process.exitCode = 1`. Footer lies whenever `--fail` is engaged.
- **acceptance criteria:** With `--fail` and findings, footer reflects non-zero exit (or is omitted) and process exits **1**; default (no `--fail`) still prints report-only exit 0 and exits **0**; `--help` / unknown flags unchanged; no pin-rule / registry edits.
- **verification commands:** `node scripts/check-copy-pins.mjs --fail ; echo $?` ; `node scripts/check-copy-pins.mjs ; echo $?` ; `rg -n 'Report-only: exit|args\.fail|exitCode' scripts/check-copy-pins.mjs`
- **conflict notes:** none with open copy-pins unknown-flag drafts beyond light rebase.

### q-mp-979 · Scripts: `report-licenses` add `--dry-run` (no `test-results/licenses` writes)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave `#1175`/`885` unknown-flag / help alone)
- **series:** script-tooling
- **verdict:** **SAFE** — write guard only; license policy / allowlists unchanged
- **CI / package.json callers:** `package.json` → `report:licenses`; **not** a blocking CI job (local helper)
- **target files:** `scripts/report-licenses.mjs`
- **measured baseline:** Default path always `mkdirSync` + writes `test-results/licenses/{sbom.cdx.json,summary.md,summary.json}`. `node scripts/report-licenses.mjs --dry-run` exits **2** (`Unknown flag`). `--help` already exits **0** without scanning.
- **acceptance criteria:** `--dry-run` runs the scan (or prints planned outputs) and exits **0** without writing under `test-results/licenses`; `--help` / unknown flags unchanged; default write path unchanged.
- **verification commands:** `node scripts/report-licenses.mjs --dry-run ; echo $?` ; `node scripts/report-licenses.mjs --help ; echo $?` ; `rg -n 'dry-run|writeFileSync|OUT_DIR' scripts/report-licenses.mjs`
- **conflict notes:** serialize lightly if `#1175` still reshapes argv.

### q-mp-980 · Scripts: lib modules main-entry usage for `page-settle` / `artifact-dir` / harness CLI parsers

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1183`)
- **depends-on:** none (leave tip-folded `958` and sibling `975` alone)
- **series:** script-tooling
- **verdict:** **SAFE** — library entry guard only; import-as-library path unchanged; no Playwright launch
- **CI / package.json callers:** **none** (libs imported by harnesses; not direct CI steps)
- **target files:** `scripts/lib/page-settle.mjs`; `scripts/lib/artifact-dir.mjs`; `scripts/lib/help-only-cli.mjs`; `scripts/lib/browser-harness-cli.mjs`; `scripts/lib/deep-playtest-cli.mjs`; `scripts/lib/offline-probe-cli.mjs`
- **measured baseline:** Tip-folded `958` fixed env-number/page-ready/dismiss-owl. `975` owns mutation-report-args/mobile-audit-out-path/pwa-manifest-contract. These six modules still exit **0** with **empty** stdout/stderr when run as main (`--help` / bare / `--wat`).
- **acceptance criteria:** When executed as main, `--help`/`-h` (and bare main) print a short “library module — import from …” usage and exit **0**; unknown flags exit non-zero; import path has no side effects; existing unit tests for page-settle / artifact-dir / help-only-cli / browser-harness-cli / deep-playtest-cli / offline-probe-cli still green; optional tiny main-guard tests OK.
- **verification commands:** `node scripts/lib/page-settle.mjs --help ; echo $?` ; `node scripts/lib/artifact-dir.mjs --help ; echo $?` ; `node scripts/lib/browser-harness-cli.mjs --wat ; echo $?` ; `node scripts/lib/help-only-cli.mjs --help ; echo $?` ; `node --check` on touched files
- **conflict notes:** do not rewrite exports claimed by open `#1219`/`920` or `#1223`/`955`.

---

**Skipped after measurement (not filler):** AI unit-wall speedups; knip unusedExports (LEAVE only); package.json scripts pointing at missing files (**0** found); expanding `check:dev-docs` scope; playtest/security/mp3d broken backtick paths; visual `addInitScript` mulberry; more mountPair hosts; more npm aliases; ag `--help` gaps `894`/`895`/`897`/`898`/`899` (leave prior ids); ai gaps `942`/`953`/`956`/`957`/`959` (leave prior ids); calla/par-55 wait families (`806`/`807` HOLD-CHECK); `check-build`/`check-perf` already portable under `test-results/` (no artifact-dir ticket); `artifact-dir` unit tests already tip-carried; engines README `check-dev-docs` exit claim still accurate; genuine non-AI flake with a new reproducible harness fix that is not a forbidden fake-clock / shard / retry raise — none freshly proven on this tip beyond the wrong-results / DRY items above.

**Next action: fold into tip by the tip owner**
