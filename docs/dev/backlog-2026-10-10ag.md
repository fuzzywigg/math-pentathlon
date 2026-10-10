# Engineering backlog — 2026-10-10ag (tip refill after post1083 mid-fold / round-33)

**Task id:** `q-mp-090ag`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1083` @ `ad4928d6` (full `ad4928d6fa34a33d77040a28f20de7fdeac91d74`; tip carries round-32 backlog `10af` + folded helpers `dismiss-owl.mjs` / `mobile-audit-out-path.mjs`; suite grew vs af’s `536a5fba` cut)  
**Depends on:** tip cut `cursor/mp-tip-post1083` @ `ad4928d6`. Round-32 backlog (`q-mp-090af` / open `#1162`, ids `q-mp-867`…`886`) already has implementers on **this** tip (`#1163`–`#1178`; af gaps still needing workers: `867`/`868`/`871`/`879`) — leave with `contained`. Round-31 (`#1144` + `#1145`–`#1161`) and older tip stacks — leave open drafts with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1083` @ `ad4928d6` measures suite **3370** files / **14366** listed cases; Chromium e2e **25** files / **249** cases; lint ratchet green (eqeqeq **1**/1); typecheck in-scope **0** / out-of-scope **216**; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 yes **0**. This doc lists **20 new** concrete engineering tasks (`q-mp-892` … `q-mp-911`) mined from the **live tip tree**, checked against prior refills (`q-mp-090` … `q-mp-090af` / ids through `q-mp-886`) and against the full open draft PR list (including post1083 workers `#1136`–`#1178`). It is the **only** deliverable of `q-mp-090ag`.

**Honest count:** Only **20** tasks — not padded to 25. Round-32 already claimed mutation `--max`/`--games`, emit-identity `--files-from`, lint-buckets `--top`, flake `--out`, ratchet-history help, copy-pins+knip unknown flags, check-build help, check:perf missing-`dist/`, harness `MEM_LEAK_*`/`PERF_*` NaN, gallery/lifecycle npm aliases, mountPair kings+contig AI-seat, dismissOwl deep-playtest follow-up, canvas-dpr + forced-colors helpers, page-ready extract, render-perf + console-sweep waits, workflows/boundaries/licenses unknown flags, offline-probe help — **do not** re-queue `867`–`886` (open `#1162`–`#1178`). Round-31 `842`–`861` remain owned by `#1145`–`#1161`. Unit coverage / lint successors remain saturated or owned; knip has **no** SAFE unusedExports. Slowest unit-node wall is still AI determinism / calibration (hard-rule HOLD — not queued). This refill **does not** re-queue per-game UI coverage rounds, soft-fail characterizations, mutation-audit waves (scoring mutants / kill rates), board-3d **src** or **mp3d e2e** edits, demo coverage, harness shards, remasure/count-stamp inventories, tip-name stamps, `*types*` residuals, doc-pointer churn, overnight mountPair/router batches, script `waitForTimeout` clears already owned by `803`–`807` / `883`/`884`, stars-bars / nav-away / memory-leak / runtime-perf wait families (prior HOLD/skip), or anything in rounds ≤32. Payoffs are freshly measured on this tip: **`--help` / unknown-flag footguns that still run eslint, knip, mutation, or Playwright**, **`mutation-report --help` that mutates `*/rules.ts`**, **report scripts that write docs without a dry-run**, **size:check help that dies on missing `dist/` before printing usage**, **coverage-map treating `--help` as a path**, **named package.json gaps for visuals-2026-10 + flake loops**, **non-overnight mountPair leftovers after `858`/`878`**, **deep-playtest `GAMES_*` env NaN**, and **one remaining mobile-audit fixed wait**.

**Preference:** SAFE, mutually independent **scripts/** tooling, **docs-only**, or **tests-only** helper adoption. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings, boundaries/PWA installability thresholds, board-3d layout inventory, CI permissions, tip-pointer / tip-name sweep theater, open-draft triage, emit-identity inventory remasure, knip drift, dead-CSS Rank-1 rescan, coverage-map heat regenerate, or wiki **count** stamps. **Avoid** competing tickets already owned by open `#1163`–`#1178` / `#1145`–`#1162` / `#1136`–`#1144` / tip-carried `10ac`/`10ad`/`10ae`/`10af` ids. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts` (the mutation `--help` ticket must keep the script from mutating product trees on help/unknown args).

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

Skipped topics already covered by `q-mp-176`–`q-mp-886`, open drafts, or prior ids (non-exhaustive; `gh pr list --state open` 2026-10-10):

| Topic family | Why skipped |
| --- | --- |
| round-32 backlog / script exit UX (`867`–`876`) / gallery npm (`877`) / mountPair kings+contig (`878`) / dismissOwl deep-playtest (`879`) / e2e helpers (`880`/`881`) / page-ready (`882`) / waits (`883`/`884`) / workflows unknown (`885`) / offline help (`886`) | open `#1162` + workers `#1163`–`#1178`; af gaps `867`/`868`/`871`/`879` still need workers — leave with `contained`; **do not** re-queue `867`–`886` |
| round-31 / engine-coverage-rank / flake `--runs` / mobile-audit `--out` / size missing-dist / dismissOwl extract / coverage-map UX / playtest+security+mp3d docs / `check:dev-docs` scope / mountPair fiar-calla / mulberry / Mermaid+visuals docs | open `#1144` + `#1145`–`#1161` — leave with `contained`; **do not** re-queue `842`–`861` |
| round-30 / dead-code DEFER / router navigate / wiki firefox-cross / overnight mountPair / kwatro RNG | tip-folded + open leftovers `#1136`–`#1142` — leave with `contained` |
| round-29 / lint-buckets eqeqeq probe / docs reproduce → named e2e / storage-stubs / deep-playtest waits (`803`–`807`) / CI `e2e-cross-browser` named script (`800`) | tip-carried / open `#1125`–`#1134` — leave with `contained` |
| per-game UI coverage / soft-fail chars / mutation-audit waves / board-3d **src** / **mp3d e2e** / demo cov / harness shards / remasure inventories / tip-name stamps / `*types*` residuals / doc-pointer churn | prompt hard-skip for round-33 |
| knip unusedExports LEAVE / unusedTypes baseline drop / wiki count cells / AGENTS tip name | remasure / tip-stamp theater / intentional LEAVE |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions widening | hard-rule HOLD |
| wiki `#658` “Open draft” regression (`822`) | leave prior id; do not open a sibling |
| wiki `check:perf` “exit 0” one-liner | owned as optional note inside open `#1164`/`875` — do not open a third ticket |
| `report-knip`/`check-copy-pins` `--help` | optional inside open `#1168`/`873` — do not sibling |
| stars-bars / nav-away / memory-leak / runtime-perf / webkit-offline / probe-offline fixed waits | prior HOLD/skip (except the single mobile-audit site in `909`) |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening, apt, or network-in-tests work. No `memory/` files.

## Stale queue re-check (live tip `ad4928d6`)

| Id | Title (short) | Verdict | Evidence @ `ad4928d6` |
| --- | --- | --- | --- |
| `q-mp-090af` / `#1162` | round-32 backlog 10af | **tip-carried (open draft)** | Leave with `contained` — this refill starts after `886`. |
| `q-mp-867`–`886` / `#1163`–`#1178` | round-32 implementers | **still-valid (open on post1083)** | Leave alone — do not duplicate. Af gaps without open PR: `867`/`868`/`871`/`879`. |
| `q-mp-842`–`861` / `#1145`–`#1161` | round-31 implementers | **still-valid (open on post1083)** | Leave alone. |
| `q-mp-817`–`829` / `#1136`–`#1142` | round-30 implementers | **mostly tip-folded; drafts still open** | Leave with `contained`. |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-803`–`807` | deep-playtest / render-perf-mode waits | **tip-folded or open** | Leave alone; this refill’s `909` owns **one** `mobile-audit.mjs` site only. |
| `q-mp-822` / wiki `#658` | Open draft #658 regression | **leave prior id** | Do not open a sibling. |
| `q-mp-667`–`668` / `#1098` | wiki/testing-layers counts | **stale vs live 3370/14366** | **do not** re-queue count stamps. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/mutation-report.mjs` | `892` only; serialize with open af gaps `867`/`868` (same parseArgs / main) |
| `scripts/flake-rate-unit-loop.mjs` + `flake-rate-e2e-loop.mjs` | `893` + `907` — serialize; also lightly with open `#1149`/`843` + af `871` |
| `scripts/check-lint-ratchet.mjs` | `894` only |
| `scripts/check-type-ratchet.mjs` | `895` only |
| `scripts/report-dead-code.mjs` | `896` only |
| `scripts/check-pwa-manifest.mjs` | `897` only |
| `scripts/check-dev-doc-links.mjs` | `898` only; serialize lightly with open `#1148`/`857` |
| `scripts/check-bundle-budgets.mjs` | `899` only; serialize lightly with open `#1151`/`845` |
| browser harness `.mjs` set | `900` (+ `909` mobile-audit waits); serialize with open `#1165`/`882`, `#1178`/`886`, `#1153`/`846`, af `879` |
| `package.json` + visuals README | `901` + `907` — serialize if both land |
| `tests/helpers/mount-pair.ts` | consumers only (`902`–`905`) — leave `#1159`/`858` + `#1167`/`878` alone |
| `scripts/report-coverage-map.mjs` | `906` only; leave `#1154`/`847` missing-summary message alone |
| deep-playtest `.mjs` | `908` + `910`; serialize with af `879` dismissOwl adopters |

**Parallel-friendly:** `894`, `895`, `896`, `897`, `898`, `899`, `901`, `902`, `903`, `904`, `905`, `906`, `909`. Serialize `892` with `867`/`868`; serialize `893`→`907` with `843`/`871`; serialize `900`/`908`/`910` with harness adopters; prefer `882`/`846` folded before large harness help edits.

## Live tip measurements (evidence snapshot @ `ad4928d6`)

```text
$ git rev-parse HEAD
  ad4928d6fa34a33d77040a28f20de7fdeac91d74

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

$ npm run report:dead-code
  Safe-to-remove yes: 0

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3370

$ npx vitest list | wc -l
  14366

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ node scripts/mutation-report.mjs --help
  → starts mutating (header + calla mutants); can leave src/games/*/rules.ts dirty
  → same for --dry-run (not a dry-run)

$ node scripts/flake-rate-unit-loop.mjs --help
  → "[flake-rate] starting default-1…" (spawns vitest path)

$ node scripts/check-lint-ratchet.mjs --help
  → full eslint probe run; exit 0 (ignores --help/--wat)

$ node scripts/check-type-ratchet.mjs --wat
  → full typecheck:ratchet; exit 0

$ node scripts/report-dead-code.mjs --help
  → starts knip + writes docs/dev/dead-code-inventory.{md,json}

$ node scripts/check-pwa-manifest.mjs --help
  → full report (missing dist/ violations); exit 0

$ node scripts/check-dev-doc-links.mjs --help
  → full docs scan; exit 0

$ node scripts/check-bundle-budgets.mjs --help
  → "dist/ not found… exiting 2" (no usage text)

$ node scripts/console-sweep.mjs --help
  → launches Playwright (fails here only on missing browsers)

$ node scripts/report-coverage-map.mjs --help
  → "missing coverage summary at --help" exit 1 (treats flag as path)

$ CALLA_GAMES_PER=abc node scripts/calla-deep-playtest.mjs
  → banner "NaN games × 3 diffs…" then browser launch

$ rg -n 'async function dismissOwl' scripts/*deep-playtest.mjs
  → 5 local copies remain (879 still owns adoption; tip already has scripts/lib/dismiss-owl.mjs)

$ Open drafts into cursor/mp-tip-post1083 at audit: #1136–#1178 (+ tip PR #1143 into alpha)
```

## New tasks

### q-mp-892 · Scripts: `mutation-report` early `--help` / `--dry-run` (never touch `rules.ts`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** serialize with af gaps `867`/`868` (same `parseArgs` / `main`)
- **series:** script-tooling
- **verdict:** **SAFE** — CLI UX only; **not** a mutation-audit wave; must not leave dirty `*/rules.ts`
- **CI / package.json callers:** `package.json` → `mutation:report`; **not** invoked by `.github/workflows/ci.yml`
- **target files:** `scripts/mutation-report.mjs` (`parseArgs` / `main`)
- **measured baseline:** `node scripts/mutation-report.mjs --help` and `--dry-run` both print the mutation header and **start mutating** (observed dirtying `src/games/calla/rules.ts` when interrupted). Unknown flags are ignored.
- **acceptance criteria:** `--help`/`-h` prints usage and exits **0** without reading/writing any `rules.ts`; `--dry-run` lists games/plan (or prints “would mutate N games”) and exits **0** without writes; unknown flags exit non-zero before mutation; valid default / `--games=` / `--max=` paths unchanged once `867`/`868` land; `git status --short` stays clean after help/dry-run; no product `src/` edits in the ticket.
- **verification commands:** `node scripts/mutation-report.mjs --help ; echo $?` ; `node scripts/mutation-report.mjs --dry-run ; echo $?` ; `git status --short` ; `node --check scripts/mutation-report.mjs`
- **conflict notes:** rebase onto / co-land with `867`/`868` if those land first.

### q-mp-893 · Scripts: flake-rate loops early `--help` (no runner spawn)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (serialize lightly with open `#1149`/`843` + af `871`)
- **series:** script-tooling
- **verdict:** **SAFE** — local harness CLI only; complements `843`/`871` without redoing numeric/`--out` validation
- **CI / package.json callers:** **none** today (local-only scripts; `907` may add npm aliases)
- **target files:** `scripts/flake-rate-unit-loop.mjs`, `scripts/flake-rate-e2e-loop.mjs`
- **measured baseline:** `node scripts/flake-rate-unit-loop.mjs --help` prints `[flake-rate] starting default-1…` and proceeds down the runner path. Same class for the e2e loop.
- **acceptance criteria:** `--help`/`-h` prints usage (flags: `--runs`, `--shuffle`, `--out`, …) and exits **0** without spawning vitest/playwright; unknown flags exit non-zero; default invocation unchanged.
- **verification commands:** `node scripts/flake-rate-unit-loop.mjs --help ; echo $?` ; `node scripts/flake-rate-e2e-loop.mjs --help ; echo $?` ; `node --check scripts/flake-rate-unit-loop.mjs scripts/flake-rate-e2e-loop.mjs`
- **conflict notes:** rebase onto `#1149` / af `871` if landed first.

### q-mp-894 · Scripts: `lint:ratchet` `--help` + reject unknown flags

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — argv UX only; ceilings unchanged; no eslint product clears
- **CI / package.json callers:** `package.json` → `lint:ratchet`; `verify`; CI `lint` job (`npm run verify` in `.github/workflows/ci.yml`)
- **target files:** `scripts/check-lint-ratchet.mjs`
- **measured baseline:** Script has **no** argv handling. `--help` / `--wat` run the full eslint probe (writes `.eslint.ratchet.probe.config.js` during the run) and exit **0**.
- **acceptance criteria:** `--help`/`-h` prints usage and exits **0** without spawning eslint or leaving a probe config; unknown flags exit **2**; default `npm run lint:ratchet` unchanged; no ceiling JSON edits.
- **verification commands:** `node scripts/check-lint-ratchet.mjs --help ; echo $?` ; `node scripts/check-lint-ratchet.mjs --wat ; echo $?` ; `npm run lint:ratchet` ; `test ! -f .eslint.ratchet.probe.config.js`
- **conflict notes:** none.

### q-mp-895 · Scripts: `typecheck:ratchet` `--help` + reject unknown flags

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — argv UX only; phase-2 baseline unchanged; no AI/rules scope expansion
- **CI / package.json callers:** `package.json` → `typecheck:ratchet`; `verify`; CI `lint` job (`npm run verify`)
- **target files:** `scripts/check-type-ratchet.mjs`
- **measured baseline:** No argv handling. `--help` / `--wat` run full `tsc -p tsconfig.ratchet.json` and exit **0**.
- **acceptance criteria:** `--help`/`-h` prints usage (scope summary OK) and exits **0** without spawning `tsc`; unknown flags exit **2**; default `npm run typecheck:ratchet` unchanged; no baseline JSON edits.
- **verification commands:** `node scripts/check-type-ratchet.mjs --help ; echo $?` ; `node scripts/check-type-ratchet.mjs --wat ; echo $?` ; `npm run typecheck:ratchet`
- **conflict notes:** none.

### q-mp-896 · Scripts: `report-dead-code` `--help` + `--dry-run` (no silent inventory writes)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — report script UX; intentional default write path may remain; **no** knip baseline / product removals
- **CI / package.json callers:** `package.json` → `report:dead-code`; **not** in CI
- **target files:** `scripts/report-dead-code.mjs`
- **measured baseline:** No argv handling. `node scripts/report-dead-code.mjs --help` starts knip and **writes** `docs/dev/dead-code-inventory.md` + `.json`.
- **acceptance criteria:** `--help`/`-h` prints usage and exits **0** without writing; `--dry-run` computes/prints summary counts without `writeFileSync`; unknown flags exit **2**; intentional default invocation may still write (document in header); no DEFER-list product edits required in this ticket.
- **verification commands:** `node scripts/report-dead-code.mjs --help ; echo $?` ; `git status --short docs/dev/dead-code-inventory.md` ; `node --check scripts/report-dead-code.mjs`
- **conflict notes:** do not commit regenerated inventory artifacts from probing.

### q-mp-897 · Scripts: `check:pwa-manifest` `--help` + reject unknown flags

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — argv UX only; keep report-only exit semantics for installability violations; **no** CI permissions / manifest contract threshold edits
- **CI / package.json callers:** `package.json` → `check:pwa-manifest`; CI `build` job (`.github/workflows/ci.yml` ~L109)
- **target files:** `scripts/check-pwa-manifest.mjs`
- **measured baseline:** No argv handling. `--help` / `--wat` run the full check (missing `dist/` violations) and exit **0**.
- **acceptance criteria:** `--help`/`-h` prints usage (`REPORT_ONLY`, needs `dist/`) and exits **0** without scanning; unknown flags exit **2**; default CI invocation unchanged (still report-only for violations); no workflow YAML edits.
- **verification commands:** `node scripts/check-pwa-manifest.mjs --help ; echo $?` ; `node scripts/check-pwa-manifest.mjs --wat ; echo $?` ; `npm run check:pwa-manifest`
- **conflict notes:** do **not** retarget missing-`dist/` to hard-fail in this ticket (report-only contract).

### q-mp-898 · Scripts: `check:dev-docs` `--help` + reject unknown flags

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (serialize lightly with open `#1148`/`857` scope expand)
- **series:** script-tooling
- **verdict:** **SAFE** — argv UX only; report-only exit 0 for findings unchanged; no backlog path-citation theater
- **CI / package.json callers:** `package.json` → `check:dev-docs`; **not** a blocking CI job
- **target files:** `scripts/check-dev-doc-links.mjs`
- **measured baseline:** No argv handling. `--help` / `--wat` run the full docs scan (currently reports backlog example paths as missing-path noise) and exit **0**.
- **acceptance criteria:** `--help`/`-h` prints usage and exits **0** without scanning; unknown flags exit **2**; default `npm run check:dev-docs` unchanged; no drive-by backlog link rewrites in this ticket.
- **verification commands:** `node scripts/check-dev-doc-links.mjs --help ; echo $?` ; `node scripts/check-dev-doc-links.mjs --wat ; echo $?` ; `npm run check:dev-docs`
- **conflict notes:** rebase onto `#1148` if that changes the scanner entry.

### q-mp-899 · Scripts: `size:check` early `--help` + reject unknown flags

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (serialize lightly with open `#1151`/`845` missing-`dist/` exit)
- **series:** script-tooling
- **verdict:** **SAFE** — CLI help/unknown only; keep missing-`dist/` exit **2** and soft-budget semantics
- **CI / package.json callers:** `package.json` → `size:check`; CI `build` job (`npm run size:check -- --fail-on-new-over`)
- **target files:** `scripts/check-bundle-budgets.mjs` (`parseSizeCheckArgs` / `main`)
- **measured baseline:** `parseSizeCheckArgs` only looks for `--fail-on-new-over`. `node scripts/check-bundle-budgets.mjs --help` hits the missing-`dist/` branch and exits **2** with no usage text. Unknown flags are ignored.
- **acceptance criteria:** `--help`/`-h` prints usage (incl. `--fail-on-new-over`) and exits **0** **before** the `dist/` existence check; unknown flags exit **2**; missing `dist/` without help still exits **2**; CI `--fail-on-new-over` path unchanged.
- **verification commands:** `node scripts/check-bundle-budgets.mjs --help ; echo $?` ; `node scripts/check-bundle-budgets.mjs --wat ; echo $?` ; `node scripts/check-bundle-budgets.mjs ; echo $?`
- **conflict notes:** rebase onto `#1151` if parse/main reshaped.

### q-mp-900 · Scripts: browser harnesses early `--help` (no Playwright launch)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (serialize with open `#1165`/`882`, `#1178`/`886`, `#1153`/`846`, af `879`)
- **series:** script-tooling
- **verdict:** **SAFE** — CLI help only; probe/measure contracts unchanged; no game-list expansion; no wait clears in this ticket
- **CI / package.json callers:** `package.json` → `audit:memory`, `perf:runtime`; `console-sweep` / `mobile-audit` / `nav-away-sweep` / `render-perf` are **local-only** (no npm aliases today)
- **target files:** `scripts/console-sweep.mjs`, `scripts/mobile-audit.mjs`, `scripts/nav-away-sweep.mjs`, `scripts/memory-leak-audit.mjs`, `scripts/runtime-perf.mjs`, `scripts/render-perf.mjs` (wrap `nav-away-sweep` top-level await in `main` so help can short-circuit)
- **measured baseline:** `--help` is ignored; scripts immediately `chromium.launch` (failing here on missing browsers). `nav-away-sweep.mjs` is top-level await with zero argv parsing. Offline probes are owned by `886` — out of scope.
- **acceptance criteria:** `--help`/`-h` prints usage and exits **0** without browser launch or build; unknown flags exit non-zero; default harness behavior unchanged; no `waitForTimeout` / AI delay edits here.
- **verification commands:** `node scripts/console-sweep.mjs --help ; echo $?` ; `node scripts/mobile-audit.mjs --help ; echo $?` ; `node scripts/nav-away-sweep.mjs --help ; echo $?` ; `node scripts/memory-leak-audit.mjs --help ; echo $?` ; `node scripts/runtime-perf.mjs --help ; echo $?` ; `node scripts/render-perf.mjs --help ; echo $?`
- **conflict notes:** rebase onto page-ready / dismissOwl adopters if they touch the same files.

### q-mp-901 · package.json + docs: named script for iPad visuals-2026-10 + fix gallery relative link

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave open `#1170`/`877` gallery+lifecycle aliases alone — different configs)
- **series:** docs-accuracy
- **verdict:** **SAFE** — npm script alias + one broken markdown href; no PNG regenerations; no CI job edits
- **CI / package.json callers:** n/a (adding aliases); docs-only link fix
- **target files:** `package.json` (scripts); `docs/visuals/2026-10/README.md` (broken `[docs/gallery/](../gallery/)` → `docs/visuals/gallery`)
- **measured baseline:** `playwright.visuals-2026-10.config.ts` exists; docs tell contributors to run bare `npx playwright test -c …`. `npm run check:dev-docs` reports `[broken-md-link] docs/visuals/2026-10/README.md: ../gallery/ -> docs/visuals/gallery`. Gallery/lifecycle npm names are owned by `877`.
- **acceptance criteria:** Add e.g. `docs:visuals-2026-10` (name may vary — document it) pointing at the existing config; README prefers `npm run …`; fix the gallery relative link to `../../gallery/`; no baseline PNG updates; no CI workflow edits.
- **verification commands:** `node -e "console.log(require('./package.json').scripts['docs:visuals-2026-10'])"` ; `rg -n 'docs:visuals-2026-10|\\.\\./\\.\\./gallery' package.json docs/visuals/2026-10/README.md` ; `npm run check:dev-docs` (broken-md-link for this file gone)
- **conflict notes:** parallel with `#1170`/`877` (different script names/configs).

### q-mp-902 · Tests: adopt shared `mountPair` in `destroy-game-cleanup`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave `#1159`/`858` + `#1167`/`878` alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only board+status scaffolding; asserts + counts unchanged; **not** soft-fail / mutation / mp3d; no AI product edits
- **target files:** `tests/unit/destroy-game-cleanup.test.ts`
- **measured baseline:** Hex + star-track cases hand-roll `const board/status = document.createElement('div'); document.body.append(board, status)` matching `mountPair`. Prime-gold / frac-fact single-host roots can stay local.
- **acceptance criteria:** Board+status pairs import `mountPair`; asserts + `npx vitest list | wc -l` unchanged; targeted `CI=1 npx vitest run tests/unit/destroy-game-cleanup.test.ts` green; no `src/` edits.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/destroy-game-cleanup.test.ts` ; `CI=1 npx vitest run tests/unit/destroy-game-cleanup.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** none with open mountPair PRs (different hosts).

### q-mp-903 · Tests: adopt shared `mountPair` in `contig-60-end-rules` controller hosts

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave `#1167`/`878` contig AI-seat host alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only scaffolding; end-rules asserts unchanged; no rules/scoring edits
- **target files:** `tests/unit/contig-60-end-rules.test.ts`
- **measured baseline:** Two `initGame(board, status)` hosts still hand-roll board+status pairs (~L176–195). Pure rules cases need no mountPair.
- **acceptance criteria:** Controller hosts use `mountPair`; rules-only cases untouched; case list unchanged; targeted vitest green; no `src/` / copy edits.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/contig-60-end-rules.test.ts` ; `CI=1 npx vitest run tests/unit/contig-60-end-rules.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** do not touch overnight contig suites (`824`).

### q-mp-904 · Tests: adopt shared `mountPair` in `input-race-fiar-opening-ai-timer`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave `#1159`/`858` fiar hosts alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only board+status scaffolding; timer asserts unchanged; **no** fake→real timer retarget; no AI product edits
- **target files:** `tests/unit/input-race-fiar-opening-ai-timer.test.ts`
- **measured baseline:** Two board+status `initGame` hosts hand-roll `createElement('div')` pairs. Shared `mountPair` already used elsewhere.
- **acceptance criteria:** Hosts import `mountPair`; asserts + case count unchanged; targeted vitest green; no `src/` edits; keep existing fake-timer usage as-is.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/input-race-fiar-opening-ai-timer.test.ts` ; `CI=1 npx vitest run tests/unit/input-race-fiar-opening-ai-timer.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** do not touch `#1159` fiar files.

### q-mp-905 · Tests: adopt shared `mountPair` in `hex-queens-kings-touch-reduced-motion`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave `#1167`/`878` kings AI-seat host alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only scaffolding; touch/reduced-motion asserts unchanged; no player-facing copy / a11y string edits
- **target files:** `tests/unit/hex-queens-kings-touch-reduced-motion.test.ts`
- **measured baseline:** Kings host hand-rolls `board`+`status` and `document.body.append(board, status)` matching `mountPair`.
- **acceptance criteria:** Import `mountPair` for that pair; asserts unchanged; targeted vitest green; no `src/` / copy edits.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/hex-queens-kings-touch-reduced-motion.test.ts` ; `CI=1 npx vitest run tests/unit/hex-queens-kings-touch-reduced-motion.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** do not touch `#1167` kings AI-seat file.

### q-mp-906 · Scripts: `report-coverage-map` reject flag-like argv (no `--help` as path)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave open `#1154`/`847` missing-summary copy alone)
- **series:** script-tooling
- **verdict:** **SAFE** — argv hygiene; complements `847` without rewriting its missing-summary text; no heat-map regenerate theater
- **CI / package.json callers:** `package.json` → `report:coverage-map`; **not** in CI
- **target files:** `scripts/report-coverage-map.mjs`
- **measured baseline:** `node scripts/report-coverage-map.mjs --help` → `missing coverage summary at --help` exit **1** (flag treated as a filesystem path). Same for `--wat`.
- **acceptance criteria:** Args starting with `-` are rejected with usage and exit non-zero **before** path lookup; `--help`/`-h` exit **0** with usage; valid explicit summary path still works; default missing-summary message for real paths stays as `847` defines it; no SVG/md regenerate in this ticket.
- **verification commands:** `node scripts/report-coverage-map.mjs --help ; echo $?` ; `node scripts/report-coverage-map.mjs --wat ; echo $?` ; `node --check scripts/report-coverage-map.mjs`
- **conflict notes:** rebase onto `#1154` if message helpers moved.

### q-mp-907 · package.json: named scripts for flake-rate unit + e2e loops

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (serialize lightly with `893` / `#1149` / af `871` if docs cite flags)
- **series:** docs-accuracy
- **verdict:** **SAFE** — add npm script aliases only; scripts already exist; no CI job edits; no flake threshold changes
- **CI / package.json callers:** n/a (adding aliases; loops remain local-only)
- **target files:** `package.json` (scripts); optionally one line in `docs/wiki/development.md` cheat-sheet if flake loops are mentioned
- **measured baseline:** `scripts/flake-rate-unit-loop.mjs` + `scripts/flake-rate-e2e-loop.mjs` exist with **no** `package.json` names (contributors run bare `node scripts/…`).
- **acceptance criteria:** Add e.g. `flake:unit` / `flake:e2e` (names may vary — document them); docs prefer `npm run …` if they mention the loops; no CI workflow edits; no default `--runs` changes.
- **verification commands:** `node -e "const s=require('./package.json').scripts; console.log(s['flake:unit'], s['flake:e2e'])"` ; `rg -n 'flake:unit|flake:e2e|flake-rate-' package.json docs/wiki/development.md`
- **conflict notes:** serialize wiki one-liner lightly with other development.md editors.

### q-mp-908 · Scripts: deep-playtest `GAMES_*` env reject NaN / non-positive

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (serialize lightly with af `879` dismissOwl adopters)
- **series:** script-tooling
- **verdict:** **SAFE** — env parse UX only; default numeric values unchanged; **no** AI delay / difficulty / game-count product retargets
- **CI / package.json callers:** **none** (local-only deep-playtest scripts)
- **target files:** `scripts/calla-deep-playtest.mjs` (`CALLA_GAMES_PER`), `scripts/sum-dominoes-deep-playtest.mjs` (`SD_GAMES`), `scripts/ramrod-deep-playtest.mjs` (`RAMROD_GAMES`), `scripts/stars-bars-deep-playtest.mjs` (`STARS_GAMES`), `scripts/par-55-deep-playtest.mjs` (`PAR55_GAMES` / `PAR55_QUICK`)
- **measured baseline:** `CALLA_GAMES_PER=abc` → banner `NaN games × 3 diffs…` then Playwright launch. Same bare `Number(process.env.*)` pattern across listed scripts. Distinct from `876` (`MEM_LEAK_*` / `PERF_*`).
- **acceptance criteria:** Non-finite / non-positive env values print a one-line error naming the var and exit non-zero **before** browser launch; unset env keeps current defaults; `PAR55_QUICK` truthy behavior preserved; no waitForTimeout / AI delay edits.
- **verification commands:** `CALLA_GAMES_PER=abc timeout 5s node scripts/calla-deep-playtest.mjs ; echo $?` ; `SD_GAMES=abc timeout 5s node scripts/sum-dominoes-deep-playtest.mjs ; echo $?` ; `node --check` on touched files
- **conflict notes:** rebase onto `#1153`/`879` if those touch the same deep-playtest files.

### q-mp-909 · Scripts: replace fixed `waitForTimeout` in `mobile-audit.mjs` (1 site)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave `#1131`/`805` render-perf-mode + `#1174`/`884` console-sweep alone)
- **series:** script-tooling
- **verdict:** **SAFE** — harness wait only; audit contracts unchanged; no game-list / AI timing edits
- **CI / package.json callers:** **none** (local `scripts/mobile-audit.mjs`; docs reference bare node)
- **target files:** `scripts/mobile-audit.mjs` (**1** `waitForTimeout` call site ~L355)
- **measured baseline:** `803`–`807` / `883`/`884` cleared other harness waits. `mobile-audit.mjs` still has one fixed 300ms timeout. Tip already has `scripts/lib/mobile-audit-out-path.mjs` from `844` fold — do not redo `--out`.
- **acceptance criteria:** Fixed timeout replaced with condition / rAF / response wait where straightforward; report fields unchanged; `node --check`; no `src/` edits.
- **verification commands:** `rg -n 'waitForTimeout' scripts/mobile-audit.mjs` ; `node --check scripts/mobile-audit.mjs`
- **conflict notes:** serialize lightly with `900` / `#1160`/`844` if both touch mobile-audit.

### q-mp-910 · Scripts: deep-playtest harnesses early `--help` (no browser launch)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (serialize with `908` + af `879`)
- **series:** script-tooling
- **verdict:** **SAFE** — CLI help only; playtest loops / difficulty matrices unchanged; no wait clears
- **CI / package.json callers:** **none** (local-only)
- **target files:** `scripts/calla-deep-playtest.mjs`, `scripts/ramrod-deep-playtest.mjs`, `scripts/sum-dominoes-deep-playtest.mjs`, `scripts/stars-bars-deep-playtest.mjs`, `scripts/par-55-deep-playtest.mjs`
- **measured baseline:** No argv handling. Invoking with `--help` still proceeds to Playwright launch (same foot-gun class as `900` / `886`).
- **acceptance criteria:** `--help`/`-h` prints usage (env knobs OK) and exits **0** without browser launch; unknown flags exit non-zero; default playtest behavior unchanged; no `waitForTimeout` / AI delay edits.
- **verification commands:** `node scripts/calla-deep-playtest.mjs --help ; echo $?` ; `node scripts/par-55-deep-playtest.mjs --help ; echo $?` ; `node --check` on touched files
- **conflict notes:** co-land carefully with `908`/`879` on the same files.

### q-mp-911 · Scripts: adopt shared `page-ready` helpers in `console-sweep` (+ optional `nav-away` ready wait)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** fold or co-land of `882` / open `#1165` (`scripts/lib/page-ready.mjs`)
- **series:** script-tooling
- **verdict:** **SAFE** — scripts-only DRY follow-up to `882`; keep navigation/ready semantics; **no** AI mid-nav list expansion; no waitForTimeout clears beyond what shared helpers already encode
- **CI / package.json callers:** **none** for console-sweep / nav-away (local-only)
- **target files:** `scripts/console-sweep.mjs` (replace local `waitReady`); optionally align `scripts/nav-away-sweep.mjs` ready wait if the shared helper matches
- **measured baseline:** After `882` targets mobile-audit/memory-leak/runtime/render-perf, `console-sweep.mjs` still defines local `waitReady`. `nav-away-sweep.mjs` inlines loading waits.
- **acceptance criteria:** Shared module imported; local ready helper removed in console-sweep; `node --check` on touched files; no game-list / timing constant edits; no `src/` edits.
- **verification commands:** `rg -n 'function waitReady|from .*page-ready' scripts/console-sweep.mjs` ; `node --check scripts/console-sweep.mjs`
- **conflict notes:** rebase onto `#1165`; serialize with `900`/`884` if those also touch console-sweep.

---

## Id allocation

New ids in this doc: **`q-mp-892` … `q-mp-911`** (**20** tasks — fewer than 25; no filler).  
Ids `q-mp-887`…`q-mp-891` and `q-mp-912`…`q-mp-916` are intentionally unused (gap after round-32 `886`; unused tail of the requested `892`…`916` window).  
Do **not** reuse `q-mp-001`–`q-mp-886`. Tip-owner refill should point workers at these after folding this doc into `cursor/mp-tip-post1083`.

**Ceiling keys used in this refill:** **none**.  
**Not used here (already claimed / undrafted / HOLD / no headroom / prompt-skipped families):** void/nnnull/nullish successors, eqeqeq product clear, lint-buckets probe (`792`), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki count remasure, tip-name stamps, UI coverage rounds, soft-fail characterizations, mutation-audit **waves** (kill-rate tables — distinct from CLI `--help` ticket `892`), board-3d **src** / **mp3d e2e**, harness shards, demo coverage, `*types*` residuals, docs reproduce → named chromium sweeps, deep-playtest `waitForTimeout` (`803`–`807`), overnight mountPair/router batches, round-31 script/docs tickets (`842`–`861`), round-32 tickets (`867`–`886` / `#1162`–`#1178`), CI `e2e-cross-browser` yaml named script (`800`), wiki `#658` third rewrite, stars-bars / nav-away / memory-leak / runtime-perf / webkit-offline wait clears (prior HOLD/skip), gallery/lifecycle npm names (`877`), emit-identity default wave5 merge-base retarget (tip-owner HOLD-CHECK — not queued), Queens & Guards product, AI timing.

**Skipped after measurement (not filler):** AI unit-wall speedups; knip unusedExports (LEAVE only); package.json scripts pointing at missing files (**0** found); expanding `check:dev-docs` scope (owned by `857`); playtest/security/mp3d broken backtick paths (owned by `849`–`855`); visual `addInitScript` mulberry; converting hex `innerHTML=''` to `clearElement`; keyboard-only `startHumanKeyboard` specialization; a11y-axe local `waitForVisualSettle` (specialized game-selector opacity — no shared twin); `engine-coverage-rank` dash-args (owned by `842` friendly missing-file); `report-knip`/`check-copy-pins` `--help` (optional inside `873`); wiki `check:perf` exit note (optional inside `875`); genuine non-AI flake with a new reproducible harness fix that is not a forbidden fake-clock / shard / retry raise — none freshly proven on this tip beyond already-owned soft-fail / AI-timing inventories.

Prefer parallel start on: **894**, **895**, **896**, **897**, **898**, **899**, **901**, **902**, **903**, **904**, **905**, **906**, **909**. Serialize **892** with **867**/**868**; serialize **893**→**907** with **843**/**871**; prefer **882**/`#1165` before **911**; serialize **900**/**908**/**910** with harness adopters / **879**.

**One-line id tags:** `892 SAFE`, `893 SAFE`, `894 SAFE`, `895 SAFE`, `896 SAFE`, `897 SAFE`, `898 SAFE`, `899 SAFE`, `900 SAFE`, `901 SAFE`, `902 SAFE`, `903 SAFE`, `904 SAFE`, `905 SAFE`, `906 SAFE`, `907 SAFE`, `908 SAFE`, `909 SAFE`, `910 SAFE`, `911 SAFE`.

**Next action: fold into tip by the tip owner.**
