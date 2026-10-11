# Engineering backlog — 2026-10-10af (tip refill after post1083 mid-fold / round-32)

**Task id:** `q-mp-090af`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1083` @ `536a5fba` (full `536a5fba9e7cb0a207c30b6a0aee9d07a34a2f9d`; tip already carries round-31 backlog `10ae` + folded round-30 implementers `817`–`829` / `823`/`828`)  
**Depends on:** tip cut `cursor/mp-tip-post1083` @ `536a5fba`. Round-31 backlog (`q-mp-090ae` / open `#1144`, ids `q-mp-842`…`861`) already has implementers on **this** tip (`#1145`–`#1161`) — leave with `contained`. Older tip stacks (`post1059` / `post1023` / …) — leave open drafts with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1083` @ `536a5fba` measures suite **3367** files / **14349** listed cases; Chromium e2e **25** files / **249** cases; lint ratchet green (eqeqeq **1**/1); typecheck in-scope **0** / out-of-scope **216**; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 yes **0** (router navigate adoption already tip-folded). This doc lists **20 new** concrete engineering tasks (`q-mp-867` … `q-mp-886`) mined from the **live tip tree**, checked against prior refills (`q-mp-090` … `q-mp-090ae` / ids through `q-mp-861`) and against the full open draft PR list (including post1083 workers `#1136`–`#1161`). It is the **only** deliverable of `q-mp-090af`.

**Honest count:** Only **20** tasks — not padded to 25. Round-31 already claimed engine-coverage-rank / flake `--runs` / mobile-audit `--out` / size:check missing-`dist/` / dismissOwl extract / coverage-map UX / Playwright `mobile-viewport-smoke` regex / playtest+security+mp3d path docs / `check:dev-docs` scope expand / non-overnight mountPair+RNG / Mermaid firefox-webkit / game-visuals entrypoints — **do not** re-queue `842`–`861` (open `#1145`–`#1161`). Unit coverage / lint successors remain saturated or owned; knip has **no** SAFE unusedExports. Slowest unit-node wall is still AI determinism / calibration (hard-rule HOLD — not queued). This refill **does not** re-queue per-game UI coverage rounds, soft-fail characterizations, mutation-audit waves (scoring mutants / kill rates), board-3d **src** or **mp3d e2e** edits, demo coverage, harness shards, remasure/count-stamp inventories, tip-name stamps, `*types*` residuals, doc-pointer churn, overnight mountPair/router batches, script `waitForTimeout` clears already owned by `803`–`807`, or anything in rounds ≤31. Payoffs are freshly measured on this tip: **remaining scripts/ crash-on-bad-args or silent wrong exits**, **flag-eating argv parsers**, **report scripts that write docs on `--help`**, **named package.json gaps for gallery/lifecycle capture**, **non-overnight mountPair / e2e helper leftovers after `801`/`858`**, and **harness env `Number()` NaN**.

**Preference:** SAFE, mutually independent **scripts/** tooling, **docs-only**, or **tests-only** helper adoption. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings, boundaries/PWA, board-3d layout inventory, CI permissions, tip-pointer / tip-name sweep theater, open-draft triage, emit-identity inventory remasure, knip drift, dead-CSS Rank-1 rescan, coverage-map heat regenerate, or wiki **count** stamps. **Avoid** competing tickets already owned by open `#1145`–`#1161` / `#1136`–`#1144` / tip-carried `10ac`/`10ad`/`10ae` ids. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics (no real→fake timer product retargets). **Do not** edit `*/rules.ts` (mutation-report CLI tickets must keep the script from mutating product trees on bad args).

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

Skipped topics already covered by `q-mp-176`–`q-mp-861`, open drafts, or prior ids (non-exhaustive; `gh pr list --state open` 2026-10-10):

| Topic family | Why skipped |
| --- | --- |
| round-31 backlog / script exit UX (`842`–`847`) / Playwright mobile rename (`848`/`849`) / playtest+security+mp3d docs (`850`–`856`) / `check:dev-docs` scope (`857`) / non-overnight mountPair+RNG (`858`/`859`) / Mermaid+visuals docs (`860`/`861`) | open `#1144` + workers `#1145`–`#1161` — leave with `contained`; **do not** re-queue `842`–`861` |
| round-30 / dead-code DEFER / router navigate / wiki firefox-cross / overnight mountPair / kwatro RNG / fuzz cadence | tip-folded + open leftovers `#1136`–`#1142` / `#1135` — leave with `contained` |
| round-29 / lint-buckets eqeqeq probe / docs reproduce → named e2e / storage-stubs / deep-playtest `waitForTimeout` (`803`–`807`) / CI `e2e-cross-browser` named script (`800`) | tip-carried / open `#1125`–`#1134` — leave with `contained`; **do not** re-queue stars-bars / nav-away / memory-leak wait families already skipped as HOLD |
| per-game UI coverage / soft-fail chars / mutation-audit waves / board-3d **src** / **mp3d e2e** / demo cov / harness shards / remasure inventories / tip-name stamps / `*types*` residuals / doc-pointer churn | prompt hard-skip for round-32 |
| knip unusedExports LEAVE / unusedTypes baseline drop / wiki count cells / AGENTS tip name | remasure / tip-stamp theater / intentional LEAVE |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions widening | hard-rule HOLD |
| wiki `#658` “Open draft” regression (`822`) | tip-queued / `#1136` adjacency — leave alone (line still present @ `536a5fba`; do not open a third `#658` ticket) |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening, apt, or network-in-tests work. No `memory/` files.

## Stale queue re-check (live tip `536a5fba`)

| Id | Title (short) | Verdict | Evidence @ `536a5fba` |
| --- | --- | --- | --- |
| `q-mp-090ae` / `#1144` | round-31 backlog 10ae | **tip-carried (open draft)** | Leave with `contained` — this refill starts after `861`. |
| `q-mp-842`–`861` / `#1145`–`#1161` | round-31 implementers | **still-valid (open on post1083)** | Leave alone — do not duplicate script UX / docs / mountPair / RNG tickets. |
| `q-mp-817`–`829` / `#1136`–`#1142` | round-30 implementers | **mostly tip-folded; drafts still open** | Leave with `contained`. |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still `npm run test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-803`–`807` | deep-playtest / render-perf-mode waits | **tip-folded or open** | Leave alone; this refill’s `883` owns **`render-perf.mjs`** (not `-mode`). |
| `q-mp-822` / wiki `#658` | Open draft #658 regression | **still present on tip** | Leave prior id; do not open a sibling. |
| `q-mp-667`–`668` / `#1098` | wiki/testing-layers counts | **stale counts vs live 3367/14349** | **do not** re-queue count stamps. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/mutation-report.mjs` | `867` + `868` — serialize (same parseArgs / main) |
| `scripts/flake-rate-unit-loop.mjs` + `flake-rate-e2e-loop.mjs` | `871` only; serialize lightly with open `#1149`/`843` if both land |
| `scripts/report-lint-buckets.mjs` | `870` only; leave `#1133`/`792` probe overlay alone |
| `scripts/lib/dismiss-owl.mjs` (new via `#1153`/`846`) | `879` consumers only — depends on fold/co-land of `846` |
| `tests/helpers/mount-pair.ts` | consumers only (`878`) — leave `#1159`/`858` alone |
| `tests/e2e/helpers/page.ts` | consumers only (`880`/`881`) — no API rewrite |
| `package.json` | `877` only (gallery/lifecycle script names) |

**Parallel-friendly:** `869`, `870`, `872`, `873`, `874`, `875`, `876`, `877`, `878`, `880`, `881`, `883`, `886`. Serialize `867`→`868`; prefer `846` before `879`; serialize `871` with `#1149`; serialize `882` lightly with `879` if both touch the same harness files.

## Live tip measurements (evidence snapshot @ `536a5fba`)

```text
$ git rev-parse HEAD
  536a5fba9e7cb0a207c30b6a0aee9d07a34a2f9d

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
  3367

$ npx vitest list | wc -l
  14349

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ node scripts/mutation-report.mjs --max=abc
  → silently resets to maxMutantsPerGame=35 and starts mutating (no usage error)

$ node scripts/mutation-report.mjs --games=no-such-game --max=1
  → raw ENOENT stack for src/games/no-such-game/rules.ts
  (intentional check:dev-docs missing-path negative example — do not invent that path to “fix” the report; see q-mp-868 measured baseline)

$ node scripts/check-emit-identity.mjs --files-from /tmp/no-files-from-xyz
  → raw ENOENT stack from readFileSync (no usage text)

$ node scripts/report-lint-buckets.mjs --top --json
  → text summary (not JSON): --top consumes --json as its value, then ignores NaN

$ node scripts/report-ratchet-history.mjs --help
  → no --help handler; writes docs/dev/ratchet-ceiling-history.{md,svg}

$ node scripts/check-perf.mjs   # no dist/
  → "dist/ not found. Wrote stub summary. (report-only)" exit 0

$ node scripts/check-copy-pins.mjs --wat ; node scripts/report-knip.mjs --wat
  → both ignore unknown flags and run full report (exit 0)

$ rg -n 'async function (gotoGame|startHuman|waitForGameReady)' tests/e2e/canvas-dpr-resize.spec.ts
  → 3 local copies (801 only adopted pointer/zoom hosts)

$ Open drafts into cursor/mp-tip-post1083 at audit: #1136–#1161
```

## New tasks

### q-mp-867 · Scripts: `mutation-report` reject non-numeric `--max` / `--timeout`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (serialize `868` after/with this)
- **series:** script-tooling
- **verdict:** **SAFE** — CLI argv UX only; **not** a mutation-audit wave (no kill-rate / scoring / rules characterization); must not leave dirty `*/rules.ts` on bad args
- **target files:** `scripts/mutation-report.mjs` (`parseArgs` ~L55–74)
- **measured baseline:** `Number(arg.slice…)` then `if (!Number.isFinite(opts.max) || opts.max < 0) opts.max = 35` silently coerces `--max=abc` / `--timeout=xyz` to defaults and **starts mutating**. `--max=0` meaning “all” remains intentional once validated.
- **acceptance criteria:** Non-numeric or negative `--max` / non-numeric or `<5000` `--timeout` print usage and exit non-zero **before** reading/writing any `rules.ts`; valid numeric args unchanged; no product `src/` edits in the ticket; no CI wiring.
- **verification commands:** `node scripts/mutation-report.mjs --max=abc ; echo $?` ; `node scripts/mutation-report.mjs --timeout=xyz ; echo $?` ; `node --check scripts/mutation-report.mjs` ; `git status --short` (must stay clean)
- **conflict notes:** serialize with `868`.

### q-mp-868 · Scripts: `mutation-report` validate `--games=` ids (no ENOENT stack)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** prefer after/with `867`
- **series:** script-tooling
- **verdict:** **SAFE** — CLI validation only; **not** a mutation-audit wave; no rules/scoring edits
- **target files:** `scripts/mutation-report.mjs` (`main` / `listGames` / `mutateGame` entry)
- **measured baseline:** `node scripts/mutation-report.mjs --games=no-such-game --max=1` prints the header then throws raw `ENOENT` for `src/games/no-such-game/rules.ts` (**intentional** `check:dev-docs` missing-path negative example — keep; do not invent a real game tree to “fix” the report).
- **acceptance criteria:** Unknown game ids print a short list of valid games (or “unknown: X”) and exit non-zero before mutation; valid `--games=calla` still runs; no `src/` edits.
- **verification commands:** `node scripts/mutation-report.mjs --games=no-such-game --max=1 ; echo $?` ; `node --check scripts/mutation-report.mjs`
- **conflict notes:** after `867`.

### q-mp-869 · Scripts: `check-emit-identity` friendly `--files-from` errors

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — script UX only; **do not** retarget default wave5 merge-base tip (see HOLD-CHECK skip notes); no AI file edits
- **target files:** `scripts/check-emit-identity.mjs` (`parseArgs` `--files-from` branch ~L240)
- **measured baseline:** Missing path → raw `ENOENT` stack. Directory path → raw `EISDIR` stack. `--help` already works; unknown flags already exit 2.
- **acceptance criteria:** Missing/non-file `--files-from` prints usage + path and exits **2** (or **1**) without a stack as primary UX; valid file list still works; default merge-base behavior unchanged in this ticket.
- **verification commands:** `node scripts/check-emit-identity.mjs --files-from /tmp/no-files-from-xyz ; echo $?` ; `node scripts/check-emit-identity.mjs --files-from /tmp ; echo $?` ; `node --check scripts/check-emit-identity.mjs`
- **conflict notes:** none.

### q-mp-870 · Scripts: `report-lint-buckets` stop eating next flags for `--top` / `--rule`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave `#1133`/`792` eqeqeq probe alone)
- **series:** script-tooling
- **verdict:** **SAFE** — report-only CLI; ceilings unchanged; no eslint product clears
- **target files:** `scripts/report-lint-buckets.mjs` (`parseArgs`)
- **measured baseline:** `node scripts/report-lint-buckets.mjs --top --json` produces the **text** summary because `--top` consumes `--json` via `argv[i+1]`, `Number.parseInt('--json')` is NaN (keeps default top), and `--json` never runs. Bare `--rule` / `--top` with missing values also continue as a full report instead of usage errors.
- **acceptance criteria:** If `--top` / `--rule` is present without a valid value (missing, or next token starts with `-`), print usage and exit non-zero; `--top=N` / `--rule=name` forms unchanged; `--top 5 --json` still emits JSON; no ceiling edits.
- **verification commands:** `node scripts/report-lint-buckets.mjs --top --json ; echo $?` ; `node scripts/report-lint-buckets.mjs --top=3 --json | head -c 80` ; `node --check scripts/report-lint-buckets.mjs`
- **conflict notes:** do not touch probe overlay owned by `#1133`.

### q-mp-871 · Scripts: flake-rate loops reject missing / flag-like `--out`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (serialize lightly with open `#1149`/`843`)
- **series:** script-tooling
- **verdict:** **SAFE** — local harness scripts only; complements `843` (`--runs`/`--shuffle`) without redoing it
- **target files:** `scripts/flake-rate-unit-loop.mjs`, `scripts/flake-rate-e2e-loop.mjs` (`strFlag`)
- **measured baseline:** `strFlag('--out', def)` returns `args[i+1] ?? def`. Trailing `--out` silently falls back to the default dir and starts vitest/playwright. A value that is another flag (e.g. `--out --runs`) would be accepted as a directory name.
- **acceptance criteria:** `--out` with missing value or a value starting with `-` prints usage and exits non-zero before spawning runners; omitting `--out` keeps the default; valid `--out /tmp/…` still works; no change to `843` numeric validation once folded.
- **verification commands:** `node scripts/flake-rate-unit-loop.mjs --runs 1 --shuffle 0 --out ; echo $?` ; `node scripts/flake-rate-e2e-loop.mjs --runs 1 --out --runs ; echo $?` ; `node --check scripts/flake-rate-unit-loop.mjs scripts/flake-rate-e2e-loop.mjs`
- **conflict notes:** rebase onto `#1149` if landed first.

### q-mp-872 · Scripts: `report-ratchet-history` `--help` + `--dry-run` (no silent doc writes)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — report script UX; default write path may remain for intentional regenerations; **no** ceiling remasure theater in this ticket
- **target files:** `scripts/report-ratchet-history.mjs` (`main` / argv parse)
- **measured baseline:** Script only reads `--first-parent`. `node scripts/report-ratchet-history.mjs --help` still walks git history and **writes** `docs/dev/ratchet-ceiling-history.md` + `.svg`.
- **acceptance criteria:** `--help`/`-h` prints usage and exits 0 without writing; `--dry-run` computes/prints summary paths (or row count) without `writeFileSync`; unknown flags exit non-zero; intentional default invocation may still write (document in header); no ceiling JSON edits.
- **verification commands:** `node scripts/report-ratchet-history.mjs --help ; echo $?` ; `git status --short docs/dev/ratchet-ceiling-history.md` ; `node --check scripts/report-ratchet-history.mjs`
- **conflict notes:** do not commit regenerated history artifacts from probing.

### q-mp-873 · Scripts: `check-copy-pins` + `report-knip` reject unknown flags

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — argv hygiene; report outcomes unchanged for known flags; no knip baseline / copy-pin product edits
- **target files:** `scripts/check-copy-pins.mjs`, `scripts/report-knip.mjs` (`parseArgs`)
- **measured baseline:** Both use `argv.includes(...)` only. `node scripts/check-copy-pins.mjs --wat` and `node scripts/report-knip.mjs --wat` ignore the typo and run the full report (exit 0).
- **acceptance criteria:** Unknown flags print usage (list known flags) and exit **2**; `--help` optional but nice; `--fail` / `--json` / `--write-baseline` / `--self-test` behavior unchanged; no baseline JSON edits in this ticket.
- **verification commands:** `node scripts/check-copy-pins.mjs --wat ; echo $?` ; `node scripts/report-knip.mjs --wat ; echo $?` ; `node --check scripts/check-copy-pins.mjs scripts/report-knip.mjs`
- **conflict notes:** none.

### q-mp-874 · Scripts: `check-build` early `--help` (no double production build)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — CLI help only; build determinism semantics unchanged
- **target files:** `scripts/check-build.mjs` (`main` entry)
- **measured baseline:** `node scripts/check-build.mjs --help` ignores the flag and starts `check:build — clean build A…` (full `tsc && vite build`).
- **acceptance criteria:** `--help`/`-h` prints usage (incl. `CHECK_BUILD_SKIP_BUILD`) and exits 0 without spawning builds; unknown flags exit non-zero; default invocation unchanged.
- **verification commands:** `node scripts/check-build.mjs --help ; echo $?` ; `node --check scripts/check-build.mjs`
- **conflict notes:** none.

### q-mp-875 · Scripts: `check:perf` non-zero exit on missing `dist/` (usage error)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (mirror semantics of open `#1151`/`845` for size:check)
- **series:** script-tooling
- **verdict:** **SAFE** — restores usage-error semantics for missing build; when `dist/` exists keep report-only exit 0; no Lighthouse threshold / CI job edits
- **target files:** `scripts/check-perf.mjs` (missing-`dist/` branch); optionally one clarifying phrase in `docs/wiki/development.md` cheat-sheet if `check:perf` is mentioned
- **measured baseline:** Without `dist/`, script prints stub summary / `dist/ not found` and exits **0** (`process.exitCode = 0`). Header claims report-only always exit 0 — missing build is a usage error, same class as `845`.
- **acceptance criteria:** Missing `dist/` exits non-zero (recommend **2**); with `dist/` present, default path still exits **0**; no CI permissions / job edits; no perf budget number changes.
- **verification commands:** `node scripts/check-perf.mjs ; echo $?` (no dist) ; `rg -n 'exiting 0|dist/ not found|check:perf' scripts/check-perf.mjs docs/wiki/development.md`
- **conflict notes:** serialize wiki one-liner lightly with open `#1151`/`845` if both touch development.md.

### q-mp-876 · Scripts: harness env `Number()` reject NaN for MEM_LEAK_* / PERF_*

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — env parse UX; default numeric values unchanged; **no** playtest outcome / AI timing constant edits
- **target files:** prefer a small shared helper under `scripts/lib/` **or** local validates in: `scripts/memory-leak-audit.mjs`, `scripts/runtime-perf.mjs`, `scripts/render-perf.mjs`, `scripts/render-perf-mode.mjs`, `scripts/check-perf.mjs` (env keys already using bare `Number(process.env.*)`)
- **measured baseline:** `MEM_LEAK_PORT=abc` → `Number` is NaN → `listen` throws `ERR_SOCKET_BAD_PORT`. `PERF_MOVES=abc` → loop bound NaN → **0 iterations** with exit 0 (silent empty run). Same pattern across listed harnesses.
- **acceptance criteria:** Non-finite / non-positive (where positive is required) env values print a one-line error naming the var and exit non-zero before browser launch; unset env keeps current defaults; no waitForTimeout / AI delay edits in this ticket.
- **verification commands:** `MEM_LEAK_PORT=abc timeout 5s node scripts/memory-leak-audit.mjs ; echo $?` ; `PERF_MOVES=abc timeout 5s node scripts/runtime-perf.mjs ; echo $?` ; `node --check` on touched files
- **conflict notes:** leave deep-playtest `GAMES_PER` env alone if AI-adjacency is unclear; focus on MEM_LEAK_* / PERF_*.

### q-mp-877 · package.json: named scripts for gallery + lifecycle visual capture

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave `#1156`/`861` game-visuals entrypoints alone — different configs)
- **series:** docs-accuracy
- **verdict:** **SAFE** — add npm script aliases only; configs/specs already exist; no PNG regenerations; no CI job edits
- **target files:** `package.json` (scripts); `docs/gallery/README.md`; `README.md` gallery regenerate line; optionally one line in `docs/dev/engines/game-lifecycle.md`
- **measured baseline:** `playwright.gallery.config.ts` + `scripts/capture-gallery.spec.ts` and `playwright.lifecycle-visuals.config.ts` + `scripts/capture-lifecycle-visuals-q-mp-146.spec.ts` exist, but `package.json` has **no** named scripts — docs tell contributors to run bare `npx playwright test -c …` only. Easy to confuse with `test:visual` / `test:e2e:visual` (owned clarification for those three is `861`).
- **acceptance criteria:** Add e.g. `docs:gallery` / `docs:lifecycle-visuals` (names may vary — document them) pointing at the existing configs; docs prefer `npm run …` over bare npx; no baseline PNG updates; no CI workflow edits.
- **verification commands:** `node -e "const s=require('./package.json').scripts; console.log(s['docs:gallery'], s['docs:lifecycle-visuals'])"` ; `rg -n 'docs:gallery|docs:lifecycle|playwright.gallery|lifecycle-visuals' package.json docs/gallery/README.md README.md`
- **conflict notes:** parallel with `#1156`/`861` (different files/configs).

### q-mp-878 · Tests: adopt shared `mountPair` in kings + contig AI-seat lock hosts

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave `#1159`/`858` fiar/calla alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only board+status scaffolding; asserts + counts unchanged; **not** soft-fail / mutation / mp3d; no AI product edits
- **target files:** `tests/unit/kings-ai-input-aria-guard.test.ts`, `tests/unit/contig-60-ai-seat-input-lock.test.ts`
- **measured baseline:** Both hand-roll `document.createElement('div')` board+status pairs (kings also builds an `app` root — only replace the board+status pair shape that matches `mountPair`). Shared `tests/helpers/mount-pair.ts` already used elsewhere. `858` owns different hosts.
- **acceptance criteria:** Listed hosts import `mountPair` for board+status; local pair scaffolding removed where shape matches; asserts + `npx vitest list | wc -l` unchanged; targeted `CI=1 npx vitest run` green; no `src/` / copy / AI edits.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/kings-ai-input-aria-guard.test.ts tests/unit/contig-60-ai-seat-input-lock.test.ts` ; `CI=1 npx vitest run tests/unit/kings-ai-input-aria-guard.test.ts tests/unit/contig-60-ai-seat-input-lock.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** do not touch `#1159`/`858` files; skip mutation-ui / soft-fail hosts.

### q-mp-879 · Scripts: adopt shared `dismissOwl` in remaining deep-playtest harnesses

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** fold or co-land of `846` / open `#1153` (`scripts/lib/dismiss-owl.mjs`)
- **series:** script-tooling
- **verdict:** **SAFE** — scripts-only DRY follow-up to `846`; **no** waitForTimeout clears (still owned/skipped separately); keep dismiss behavior
- **target files:** adopt in ≥3 of: `scripts/calla-deep-playtest.mjs`, `scripts/ramrod-deep-playtest.mjs`, `scripts/sum-dominoes-deep-playtest.mjs`, `scripts/stars-bars-deep-playtest.mjs`, `scripts/par-55-deep-playtest.mjs` (delete local `async function dismissOwl`)
- **measured baseline:** After `846` targets console-sweep/mobile-audit/memory-leak/runtime/render-perf, **5** deep-playtest scripts still carry local `dismissOwl` copies. Round-31 explicitly deferred them.
- **acceptance criteria:** Shared module imported; local copies removed in ≥3 listed scripts; `node --check` on touched files; no wait/timeout / AI delay edits; no `src/` edits.
- **verification commands:** `rg -n 'async function dismissOwl|from .*dismiss-owl' scripts/*deep-playtest.mjs` ; `node --check` on touched files
- **conflict notes:** rebase onto `#1153`; leave `#1129`–`#1134` wait clears alone.

### q-mp-880 · Tests: adopt shared `gotoGame` / `startHuman` / `waitForGameReady` in canvas-dpr-resize

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (`801` tip-folded for pointer/zoom only)
- **series:** test-hygiene
- **verdict:** **SAFE** — e2e helper adoption; asserts unchanged; no canvas/DPR product edits
- **target files:** `tests/e2e/canvas-dpr-resize.spec.ts`
- **measured baseline:** File still defines local `waitForGameReady` / `gotoGame` / `startHuman` despite shared exports in `tests/e2e/helpers/page.ts`. Tip fold `fa65025a` (`771`/`801`) only touched pointer-edge-cases + zoom-reflow.
- **acceptance criteria:** Locals removed in favor of `helpers/page` imports; case list unchanged (`npm run test:e2e:chromium -- --list` count stable); no `src/` edits.
- **verification commands:** `rg -n 'async function (gotoGame|startHuman|waitForGameReady)|from .*helpers/page' tests/e2e/canvas-dpr-resize.spec.ts` ; `npm run test:e2e:chromium -- --list` ; optionally targeted chromium run of this file when browsers available
- **conflict notes:** none with open `#1130` (already tip-folded scope).

### q-mp-881 · Tests: adopt shared `startHuman` in forced-colors-a11y

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — e2e helper adoption; already imports `dismissOwl` + `waitForGameReady` from `helpers/page`; drop local `startHuman` only if behavior matches shared helper
- **target files:** `tests/e2e/forced-colors-a11y.spec.ts`
- **measured baseline:** Imports shared `dismissOwl`/`waitForGameReady` but still defines local `async function startHuman` (~L78) that only wraps `waitForGameReady` + click pattern duplicated in `helpers/page.ts`.
- **acceptance criteria:** Local `startHuman` removed; shared import used; forced-colors case count unchanged; no a11y product / copy edits.
- **verification commands:** `rg -n 'async function startHuman|startHuman' tests/e2e/forced-colors-a11y.spec.ts tests/e2e/helpers/page.ts` ; `npm run test:e2e:forced-colors -- --list`
- **conflict notes:** leave `keyboard-only` `startHumanKeyboard` alone (specialized keyboard path).

### q-mp-882 · Scripts: extract shared `waitForGameReady` / `startHuman` / `gotoGame` for .mjs harnesses

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (parallel to e2e `880`/`881`; TS e2e helpers cannot be imported from plain `.mjs` without a bridge)
- **series:** script-tooling
- **verdict:** **SAFE** — scripts-only DRY; keep navigation/ready semantics; **no** AI mid-nav list expansion; no waitForTimeout clears in this ticket
- **target files:** new `scripts/lib/page-ready.mjs` (or similar); adopt in ≥3 of: `scripts/mobile-audit.mjs`, `scripts/memory-leak-audit.mjs`, `scripts/runtime-perf.mjs`, `scripts/render-perf.mjs`
- **measured baseline:** Multiple harness `.mjs` files each define local `waitForGameReady` / `startHuman` / `gotoGame`. Capture `*.spec.ts` under `scripts/` already have TS locals — **out of scope** here (optional follow-up).
- **acceptance criteria:** Shared module exported; ≥3 listed `.mjs` harnesses import it and delete locals; `node --check` on touched files; no game-list / timing constant edits.
- **verification commands:** `rg -n 'async function (gotoGame|startHuman|waitForGameReady)|from .*page-ready' scripts/*.mjs` ; `node --check scripts/lib/page-ready.mjs` (+ adopters)
- **conflict notes:** serialize lightly with `879`/`846` if PRs also touch mobile-audit / runtime-perf / render-perf.

### q-mp-883 · Scripts: replace fixed `waitForTimeout` in `render-perf.mjs` (not `-mode`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave `#1131`/`805` render-perf-**mode** alone)
- **series:** script-tooling
- **verdict:** **SAFE** — harness waits only; keep measure contracts / sample counts; **no** AI product timing edits
- **target files:** `scripts/render-perf.mjs` (**7** `waitForTimeout` call sites)
- **measured baseline:** `805` cleared waits in `render-perf-mode.mjs` only. Sibling `render-perf.mjs` still has 7 fixed timeouts for nav/hover/settle.
- **acceptance criteria:** Fixed timeouts replaced with condition / rAF / response waits where straightforward; metrics fields and default env knobs unchanged; `node --check`; no `src/` edits.
- **verification commands:** `rg -n 'waitForTimeout' scripts/render-perf.mjs` ; `node --check scripts/render-perf.mjs`
- **conflict notes:** do not edit `render-perf-mode.mjs`; leave runtime-perf / memory-leak / nav-away / stars-bars waits alone (prior HOLD/skip).

### q-mp-884 · Scripts: `console-sweep` replace fixed `waitForTimeout` (2 sites)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — small harness wait cleanup; console error contracts unchanged; no game-list expansion
- **target files:** `scripts/console-sweep.mjs`
- **measured baseline:** **2** `waitForTimeout` sites remain. Not owned by `803`–`807`. Round-29/30 skipped larger HOLD families but this file is a small SAFE slice.
- **acceptance criteria:** Both fixed waits replaced with condition waits (or justified networkidle/load state); sweep still exits non-zero on console errors as today; no `src/` edits.
- **verification commands:** `rg -n 'waitForTimeout' scripts/console-sweep.mjs` ; `node --check scripts/console-sweep.mjs`
- **conflict notes:** serialize lightly with `#1153`/`846` if both touch console-sweep for dismissOwl.

### q-mp-885 · Scripts: `check-workflows` + `check-boundaries` + `report-licenses` reject unknown flags

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — argv hygiene; audit/report semantics unchanged for default invocation; **keep** CI workflow permissions contract (`contents: read`, `persist-credentials: false`)
- **target files:** `scripts/check-workflows.mjs`, `scripts/check-boundaries.mjs`, `scripts/report-licenses.mjs`
- **measured baseline:** `node scripts/check-workflows.mjs --wat` and `node scripts/check-boundaries.mjs --wat` ignore unknowns and exit 0 with full OK reports. `report-licenses.mjs --help` runs a full license scan + writes `test-results/licenses/*`.
- **acceptance criteria:** Unknown flags / `--help` behave consistently (help exit 0 without side effects; unknown exit 2); default `npm run check:workflows` / `check:boundaries` / `report:licenses` unchanged; no workflow YAML edits; no ceiling edits.
- **verification commands:** `node scripts/check-workflows.mjs --wat ; echo $?` ; `node scripts/check-boundaries.mjs --help ; echo $?` ; `node scripts/report-licenses.mjs --help ; echo $?` ; `npm run check:workflows` ; `npm run check:boundaries`
- **conflict notes:** none with CI permissions pins.

### q-mp-886 · Scripts: offline probes early `--help` (no immediate build / browser launch)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — CLI help only; probe logic / offline assertions unchanged; no Playwright project renames
- **target files:** `scripts/webkit-offline-probe.mjs`, `scripts/probe-offline-resilience.mjs`, `scripts/probe-offline-resilience-dev.mjs`
- **measured baseline:** `--help` is ignored; scripts immediately run `npm run build` and/or launch Playwright (failing fast here on missing browsers / typecheck noise). Same class of foot-gun as `check-build --help`.
- **acceptance criteria:** `--help`/`-h` prints usage and exits 0 without build or browser launch; unknown flags exit non-zero; default probe behavior unchanged.
- **verification commands:** `node scripts/webkit-offline-probe.mjs --help ; echo $?` ; `node scripts/probe-offline-resilience.mjs --help ; echo $?` ; `node scripts/probe-offline-resilience-dev.mjs --help ; echo $?`
- **conflict notes:** none.

---

## Id allocation

New ids in this doc: **`q-mp-867` … `q-mp-886`** (**20** tasks — fewer than 25; no filler).  
Ids `q-mp-862`…`q-mp-866` and `q-mp-887`…`q-mp-891` are intentionally unused (gap after round-31 `861`; unused tail of the requested `867`…`891` window).  
Do **not** reuse `q-mp-001`–`q-mp-861`. Tip-owner refill should point workers at these after folding this doc into `cursor/mp-tip-post1083`.

**Ceiling keys used in this refill:** **none**.  
**Not used here (already claimed / undrafted / HOLD / no headroom / prompt-skipped families):** void/nnnull/nullish successors, eqeqeq product clear, lint-buckets probe (`792`), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki count remasure, tip-name stamps, UI coverage rounds, soft-fail characterizations, mutation-audit **waves** (kill-rate tables — distinct from CLI argv tickets `867`/`868`), board-3d **src** / **mp3d e2e**, harness shards, demo coverage, `*types*` residuals, docs reproduce → named chromium sweeps, deep-playtest `waitForTimeout` (`803`–`807`), overnight mountPair/router batches, round-31 script/docs tickets (`842`–`861` / `#1145`–`#1161`), CI `e2e-cross-browser` yaml named script (`800`), wiki `#658` third rewrite, stars-bars / nav-away / memory-leak / runtime-perf wait clears (prior HOLD/skip), emit-identity default wave5 merge-base retarget (tip-owner HOLD-CHECK — not queued), Queens & Guards product, AI timing.

**Skipped after measurement (not filler):** AI unit-wall speedups; knip unusedExports (LEAVE only); package.json scripts pointing at missing files (**0** found); broken wiki markdown links (**0**); expanding `check:dev-docs` (owned by `857`); playtest/security/mp3d broken backtick paths (owned by `849`–`855`); visual `addInitScript` mulberry; converting hex `innerHTML=''` to `clearElement`; keyboard-only `startHumanKeyboard` specialization; genuine non-AI flake with a new reproducible harness fix that is not a forbidden fake-clock / shard / retry raise — none freshly proven on this tip beyond already-owned soft-fail / AI-timing inventories.

Prefer parallel start on: **869**, **870**, **872**, **873**, **874**, **875**, **876**, **877**, **878**, **880**, **881**, **883**, **884**, **885**, **886**. Serialize **867**→**868**; prefer **846**/`#1153` before **879**; serialize **871** with `#1149`; serialize **882** with harness adopters.

**One-line id tags:** `867 SAFE`, `868 SAFE`, `869 SAFE`, `870 SAFE`, `871 SAFE`, `872 SAFE`, `873 SAFE`, `874 SAFE`, `875 SAFE`, `876 SAFE`, `877 SAFE`, `878 SAFE`, `879 SAFE`, `880 SAFE`, `881 SAFE`, `882 SAFE`, `883 SAFE`, `884 SAFE`, `885 SAFE`, `886 SAFE`.

**Next action: fold into tip by the tip owner.**
