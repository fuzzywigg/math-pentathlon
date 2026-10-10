# Engineering backlog — 2026-10-10ae (tip refill after post1083 cut / round-31)

**Task id:** `q-mp-090ae`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1083` @ `8901cff6` (full `8901cff6ed31052188e24cad5d17d342f4a623ae`; cut from `alpha` after tip fold `q-mp-026s` / #1083)  
**Depends on:** tip cut `cursor/mp-tip-post1083` @ `8901cff6`. Round-30 backlog (`q-mp-090ad` / open `#1135` on old tip `post1059`, ids `q-mp-817`…`830`) already has implementers on **this** tip (`#1136`–`#1142`) — leave with `contained`. Round-29 and earlier tip-carried on prior tips — leave open drafts with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1083` @ `8901cff6` measures suite **3366** files / **14347** listed cases; Chromium e2e **25** files / **249** cases; lint ratchet green (eqeqeq **1**/1); typecheck in-scope **0** / out-of-scope **216**; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 yes still `mockRouterNavigateModule` (owned by open `#1142`/`819` chain). This doc lists **20 new** concrete engineering tasks (`q-mp-842` … `q-mp-861`) mined from the **live tip tree**, checked against prior refills (`q-mp-090` … `q-mp-090ad` / ids through `q-mp-830`) and against the full open draft PR list (including post1083 workers `#1136`–`#1142` and older tip stacks). It is the **only** deliverable of `q-mp-090ae`.

**Honest count:** Only **20** tasks — not padded to 25. Round-30 already claimed dead-code DEFER/registry labels, router-mock navigate adoption, wiki firefox/cross row splits, mountPair overnight batches, kwatro RNG helper adoption, and state-roundtrip-fuzz cadence — **do not** re-queue `817`–`830`. Unit coverage / lint successors remain saturated or owned; knip has **no** SAFE unusedExports. Slowest unit-node wall is still AI determinism / calibration (hard-rule HOLD — not queued). This refill **does not** re-queue per-game UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **src** or **mp3d e2e** edits, demo coverage, harness shards, remasure/count-stamp inventories, tip-name stamps, `*types*` residuals, docs reproduce-command → named chromium sweeps, script `waitForTimeout` clears, overnight mountPair/router batches, or anything in rounds ≤30. Payoffs are freshly measured on this tip: **dev-script exit/arg bugs**, **stale Playwright config regex**, **docs that disagree with live paths / `package.json` / `playwright.config.ts`**, **check-dev-docs scope gap** (wiki + top-level `docs/` broken refs invisible today), and **non-overnight fixture helper adoption** away from overnight veins already queued.

**Preference:** SAFE, mutually independent **scripts/** tooling, **docs-only**, or **tests-only** helper adoption. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins, boundaries/PWA, board-3d layout inventory, CI permissions, tip-pointer / tip-name sweep theater, open-draft triage, emit-identity, knip drift, dead-CSS Rank-1 rescan, coverage-map heat regenerate, or wiki **count** stamps. **Avoid** competing tickets already owned by open `#1136`–`#1142` / `#1135` / tip-carried `10ac`/`10ad` ids. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics (no real→fake timer product retargets).

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

Skipped topics already covered by `q-mp-176`–`q-mp-830`, open drafts, or prior ids (non-exhaustive; `gh pr list --state open` 2026-10-10):

| Topic family | Why skipped |
| --- | --- |
| round-30 backlog / dead-code DEFER / registry games-vs-divisions / router navigate batches / wiki `#658`+firefox-cross / overnight mountPair / kwatro RNG / state-roundtrip cadence | open `#1135` (old tip) + post1083 workers `#1136`–`#1142` — leave with `contained`; **do not** re-queue `817`–`830` |
| round-29 / lint-buckets eqeqeq probe / docs reproduce → chromium / storage-stubs / script waitForTimeout clears | tip-carried `10ac` + open `#1125`–`#1134` — leave with `contained` |
| per-game UI coverage / soft-fail chars / mutation-audit waves / board-3d **src** / **mp3d e2e** / demo cov / harness shards / remasure inventories / tip-name stamps / `*types*` residuals | prompt hard-skip for round-31 |
| knip unusedExports LEAVE / unusedTypes baseline drop / wiki count cells / AGENTS tip name | remasure / tip-stamp theater / intentional LEAVE |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions widening | hard-rule HOLD |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening, apt, or network-in-tests work. No `memory/` files.

## Stale queue re-check (live tip `8901cff6`)

| Id | Title (short) | Verdict | Evidence @ `8901cff6` |
| --- | --- | --- | --- |
| `q-mp-090ad` / `#1135` | round-30 backlog 10ad | **still-valid (open; wrong tip base)** | Leave on `post1059` with `contained`; this refill starts after `830` on **post1083**. |
| `q-mp-817`–`818` / `#1137` | dead-code DEFER + registry labels | **still-valid (open on post1083)** | Leave `#1137` alone. |
| `q-mp-819`/`820`/`829` / `#1140`–`#1142` | router navigate adoption | **still-valid (open)** | Leave alone — do not queue more overnight router batches. |
| `q-mp-823`/`828` / `#1136` | wiki/CONTRIBUTING firefox vs cross | **still-valid (open)** | Leave alone; this refill’s `860` only touches `ci-gates-mermaid` (different file). |
| `q-mp-824`/`825` / `#1138`–`#1139` | overnight mountPair | **still-valid (open)** | Leave alone; this refill owns **non-overnight** mountPair only (`858`). |
| `q-mp-826`/`822`/`830`/`821` | kwatro RNG / wiki `#658` / fuzz cadence / optional delete | **tip-queued; undrafted or old-tip** | Leave undrafted / do not duplicate. |
| `q-mp-792` / `#1133` | lint-buckets eqeqeq probe | **still-valid (open on post1059)** | Leave with `contained`. |
| `q-mp-667`–`668` / `#1098` | wiki/testing-layers counts | **still-valid (open)** | **do not** re-queue count stamps. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/check-bundle-budgets.mjs` + `docs/wiki/development.md` | `845` (exit semantics + one cheat-sheet line) — serialize lightly with open `#1136`/`823` on wiki |
| `scripts/check-dev-doc-links.mjs` | `857` only (scope expand); playtest doc fixes `853`–`855` are separate consumers |
| `docs/playtest/*` | serialize `853`→`854`→`855` if same PR author prefers; otherwise parallel by file set |
| `tests/helpers/mount-pair.ts` / `tests/helpers/rng.ts` | consumers only (`858`/`859`) — no API rewrite |

**Parallel-friendly:** `842`, `843`, `844`, `847`, `848`, `849`, `850`, `851`, `852`, `856`, `858`, `859`, `860`, `861`. Serialize `845` with `#1136` on wiki; serialize playtest batches if desired; run `857` before or with `853`–`855` so expanded checker can verify.

## Live tip measurements (evidence snapshot @ `8901cff6`)

```text
$ git rev-parse HEAD
  8901cff6ed31052188e24cad5d17d342f4a623ae

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
  Safe-to-remove yes: 1 → mockRouterNavigateModule (owned by #1142/819)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3366

$ npx vitest list | wc -l
  14347

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ node scripts/engine-coverage-rank.mjs
  → ENOENT stack on coverage-engine-baseline/coverage-summary.json (exit 1; no usage text)

$ node scripts/flake-rate-unit-loop.mjs --runs abc --shuffle 0 --out /tmp/flake-bad
  → writes summary with totalRuns=0, exit 0 (NaN loop bound)

$ node scripts/mobile-audit.mjs --out
  → TypeError ERR_INVALID_ARG_TYPE paths[0] undefined (exit 1; no usage text)

$ node scripts/check-bundle-budgets.mjs   # no dist/
  → "dist/ not found… (report-only: exiting 0)" despite comment calling it a usage error

$ npm run check:dev-docs
  problems: 1 (missing-path backlog ac → scripts/lint-ratchet-probe.mjs — owned by 793)
  scope: docs/dev/ only — does NOT see 28 missing backtick paths under docs/ + docs/wiki/

$ python3 path-scan docs/ + docs/wiki (excl. backlog/tip-vs-alpha/compliance)
  unique missing paths: 28 (playtest deep docs, mobile-audit, ai-determinism monolith,
    web-security hex-ui.ts, mp3d kings board-ui path, STANDALONE-TRIAGE hex-deep, …)

$ playwright.config.ts:48
  still matches mobile-viewport-smoke.spec.ts (file gone; live is mobile-touch-smoke.spec.ts)

$ rg -c 'async function dismissOwl' scripts/*.mjs
  10 local copies (console-sweep / mobile-audit / memory-leak / runtime-perf / render-perf /
    calla / ramrod / sum-dominoes / par-55 / stars-bars deep-playtests)

$ Open drafts into cursor/mp-tip-post1083 at audit: #1136–#1142 (round-30 implementers)
```

## New tasks

### q-mp-842 · Scripts: `engine-coverage-rank` friendly missing-file error + usage

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — non-src script UX; no coverage baseline commit; no ratchet/CI edits
- **target files:** `scripts/engine-coverage-rank.mjs`; optionally one clarifying sentence in `docs/dev/engine-coverage-round.md` (default path is generated, not committed)
- **measured baseline:** `node scripts/engine-coverage-rank.mjs` with no args throws raw `ENOENT` stack for `coverage-engine-baseline/coverage-summary.json` and exits **1**. Directory is not in the tree (coverage outputs are gitignored / ephemeral). Docs still show the bare default invocation.
- **acceptance criteria:** Missing/default path prints a short usage line (`node scripts/engine-coverage-rank.mjs <path/to/coverage-summary.json>`) and exits **2** (or **1** with clear message — pick one and document); valid JSON path still prints the rank table; no `src/` edits; no committed coverage artifacts.
- **verification commands:** `node scripts/engine-coverage-rank.mjs ; echo exit:$?` ; `node --check scripts/engine-coverage-rank.mjs` ; `rg -n 'coverage-engine-baseline|Usage' scripts/engine-coverage-rank.mjs docs/dev/engine-coverage-round.md`
- **conflict notes:** serialize lightly with `856` if both touch engine-coverage-round.md.

### q-mp-843 · Scripts: flake-rate loops reject non-numeric `--runs` / `--shuffle`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — local harness scripts only; not CI-wired; no test product edits
- **target files:** `scripts/flake-rate-unit-loop.mjs`, `scripts/flake-rate-e2e-loop.mjs`
- **measured baseline:** `flag('--runs', …)` uses bare `Number(...)`. `node scripts/flake-rate-unit-loop.mjs --runs abc --shuffle 0 --out /tmp/x` completes with `totalRuns: 0`, writes a “green” summary, exits **0**. Same class of bug in the e2e loop (`--runs abc` → exit 0, failing=0).
- **acceptance criteria:** Non-numeric or non-positive `--runs` / `--shuffle` (unit) / `--runs` (e2e) print usage and exit non-zero **before** spawning vitest/playwright; defaults still work; no `src/` / CI edits.
- **verification commands:** `node scripts/flake-rate-unit-loop.mjs --runs abc --shuffle 0 --out /tmp/flake-unit-bad ; echo $?` ; `node scripts/flake-rate-e2e-loop.mjs --runs abc --out /tmp/flake-e2e-bad ; echo $?` ; `node --check scripts/flake-rate-unit-loop.mjs scripts/flake-rate-e2e-loop.mjs`
- **conflict notes:** none.

### q-mp-844 · Scripts: `mobile-audit` validate `--out` value (no TypeError)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — script arg parsing only; audit outcomes unchanged
- **target files:** `scripts/mobile-audit.mjs` (out-path parse near L75–78)
- **measured baseline:** `node scripts/mobile-audit.mjs --out` (flag present, value missing) throws `TypeError [ERR_INVALID_ARG_TYPE]: The "paths[0]" argument must be of type string. Received undefined` from `path.resolve(undefined)` and exits **1**.
- **acceptance criteria:** Missing/invalid `--out` value prints usage and exits non-zero without TypeError stack; omitting `--out` keeps stdout-only behavior; with a valid `--out path` still writes JSON; no game-list / product edits in this ticket (see `849` for doc path drift).
- **verification commands:** `node scripts/mobile-audit.mjs --out ; echo $?` ; `node --check scripts/mobile-audit.mjs`
- **conflict notes:** none with `849` (docs-only).

### q-mp-845 · Scripts: `size:check` non-zero exit on missing `dist/` (usage error)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (serialize wiki cheat-sheet line with open `#1136`/`823`)
- **series:** script-tooling
- **verdict:** **SAFE** — restores stated “usage error” semantics; soft budget overs remain report-only unless `--fail-on-new-over`; no budget number changes
- **target files:** `scripts/check-bundle-budgets.mjs` (missing-`dist/` branch ~L274–281 and catch that forces exit 0); one line in `docs/wiki/development.md` cheat-sheet that currently says `size:check` is “report-only, exit 0” without distinguishing missing build
- **measured baseline:** Without `dist/`, script prints `dist/ not found. Run npm run build before size:check.` and `(report-only: exiting 0)` even though the inline comment calls missing build a **usage error**. Wiki L43: `npm run size:check … (needs dist/; report-only, exit 0)`.
- **acceptance criteria:** Missing `dist/` exits non-zero (recommend **2**); when `dist/` exists, default soft path still exits **0** on known/within budgets; `--fail-on-new-over` behavior unchanged; wiki cheat-sheet notes missing-`dist/` usage failure vs soft budget report-only; no CI job / permissions edits; no budget raises.
- **verification commands:** `node scripts/check-bundle-budgets.mjs ; echo $?` (no dist) ; `rg -n 'report-only: exiting 0|missing dist|size:check' scripts/check-bundle-budgets.mjs docs/wiki/development.md` ; after `npm run build`: `npm run size:check`
- **conflict notes:** serialize wiki touch with `#1136`; do not edit count/SHA cells or tip-name stamps.

### q-mp-846 · Scripts: extract shared `dismissOwl` helper; adopt in ≥4 harness scripts

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — scripts-only DRY; keep behavior (pointer-events none and/or dismiss click variants — pick the richer console-sweep behavior as canonical or export both thin wrappers); **no** deep-playtest waitForTimeout clears (owned by `803`–`807`)
- **target files:** new `scripts/lib/dismiss-owl.mjs` (or similar under `scripts/lib/`); adopt in ≥4 of: `scripts/console-sweep.mjs`, `scripts/mobile-audit.mjs`, `scripts/memory-leak-audit.mjs`, `scripts/runtime-perf.mjs`, `scripts/render-perf.mjs` (leave deep-playtest scripts for a follow-up if PR size balloons)
- **measured baseline:** **10** local `async function dismissOwl` copies under `scripts/*.mjs`. `scripts/lib/` today only holds PWA manifest contract helpers.
- **acceptance criteria:** Shared module exported; ≥4 listed scripts import it and delete their local copy; `node --check` on touched files; no playtest outcome / timing constant edits; no `src/` edits.
- **verification commands:** `rg -n 'async function dismissOwl|from .*dismiss-owl' scripts/` ; `node --check scripts/lib/dismiss-owl.mjs scripts/console-sweep.mjs scripts/mobile-audit.mjs`
- **conflict notes:** leave open `#1129`–`#1134` wait clears alone; do not expand nav-away / stars-bars waits.

### q-mp-847 · Scripts: `report-coverage-map` friendly missing-summary message

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — report script UX only; keep non-zero exit on missing input; **no** coverage-map remasure / SVG regenerate theater
- **target files:** `scripts/report-coverage-map.mjs` (`main` / `writeReport` missing-file path)
- **measured baseline:** `npm run report:coverage-map` without a prior coverage run dumps a full `ENOENT` stack for `coverage/coverage-summary.json` and exits **1**. Header already documents the default path + optional arg.
- **acceptance criteria:** Missing summary prints a one/two-line hint (`npm run test:unit:coverage` then `npm run report:coverage-map`, or pass an explicit path) and exits non-zero **without** a raw stack as the primary UX; valid summary path still writes md/svg; do **not** regenerate map from stale data in this ticket.
- **verification commands:** `npm run report:coverage-map ; echo $?` ; `node --check scripts/report-coverage-map.mjs`
- **conflict notes:** do not touch `docs/dev/coverage-map.md` heat numbers (count/remasure skip).

### q-mp-848 · Config: drop stale `mobile-viewport-smoke` name from Playwright regex

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 config-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** e2e-config
- **verdict:** **SAFE** — dead filename token in a match/ignore regex; live file is `tests/e2e/mobile-touch-smoke.spec.ts`; **no** project renames / CI check-name edits
- **target files:** `playwright.config.ts` (header comment + regex ~L48 that still lists `mobile-viewport-smoke.spec.ts`)
- **measured baseline:** `ls tests/e2e/mobile*.spec.ts` → only `mobile-touch-smoke.spec.ts`. Config regex still alternates `mobile-viewport-smoke\.spec\.ts`. Projects `mobile-iphone-13` / `mobile-pixel-7` / `mobile-ipad` already `testMatch` the touch-smoke file.
- **acceptance criteria:** Stale filename removed from regex (and comment if present); `npm run test:e2e:mobile -- --list` still lists the same case count; no CI job renames.
- **verification commands:** `rg -n 'mobile-viewport-smoke|mobile-touch-smoke' playwright.config.ts` ; `npm run test:e2e:mobile -- --list`
- **conflict notes:** docs fix for the same rename is `849` (parallel).

### q-mp-849 · Docs: `mobile-audit` smoke path + project names match Playwright

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; demonstrably disagrees with `playwright.config.ts` + `package.json`
- **target files:** `docs/mobile-audit-2026-10-07.md` (§ Smoke e2e)
- **measured baseline:** Doc claims `tests/e2e/mobile-viewport-smoke.spec.ts` via projects `mobile-iphone-se` and `mobile-pixel-7`, and that CI runs both alongside `chromium`. Live: file is `mobile-touch-smoke.spec.ts`; projects are `mobile-iphone-13` / `mobile-pixel-7` / `mobile-ipad`; CI report-only job uses `npm run test:e2e:mobile` (not chromium project).
- **acceptance criteria:** Doc paths/project names match live config; prefer `npm run test:e2e:mobile` as the reproduce command; no Playwright config edits in this ticket (see `848`); no count-stamp theater.
- **verification commands:** `rg -n 'mobile-viewport-smoke|mobile-iphone-se|mobile-touch-smoke|test:e2e:mobile' docs/mobile-audit-2026-10-07.md playwright.config.ts package.json` ; `ls tests/e2e/mobile*.spec.ts`
- **conflict notes:** parallel with `848`.

### q-mp-850 · Docs: AI determinism report — point at shard files (monolith removed)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs path correction only; **no** AI search/scoring/difficulty/timing product edits; **no** fake-clock retargets; Hex Hard 450ms untouched
- **target files:** `docs/ai-determinism-2026-10-07.md` (Tests live in… + reproduce command)
- **measured baseline:** Doc lists `tests/unit/ai-determinism-2026-10-07.test.ts` (missing) and `npx vitest run tests/unit/ai-determinism-2026-10-07.test.ts`. Live shards: `ai-determinism-shard-a`…`e.test.ts` + `ai-determinism-helpers.ts` / `ai-determinism-harness.ts`.
- **acceptance criteria:** Doc references the live helper/harness/shard files; reproduce command uses an existing path (or `npm run test:unit -- tests/unit/ai-determinism-shard-a.test.ts` sample); no AI assert / seed / clock semantic changes; no `src/games/**/ai*.ts` edits.
- **verification commands:** `ls tests/unit/ai-determinism*.ts` ; `rg -n 'ai-determinism-2026-10-07\.test|shard-|helpers|harness' docs/ai-determinism-2026-10-07.md`
- **conflict notes:** tip-owner glance for AI-doc adjacency; do not touch calibration benches.

### q-mp-851 · Docs: web-security sinks — remove stale `src/core/hex/hex-ui.ts` rows

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; **do not** convert hex `innerHTML = ''` to `clearElement` in product code (out of scope / possible DOM behavior change)
- **target files:** `docs/web-security-burn-1008-sinks.md` (table rows naming `src/core/hex/hex-ui.ts` — appears twice)
- **measured baseline:** `src/core/hex/` has no `hex-ui.ts` (dir listing is empty / N/A — hex UI lives under `src/games/hex/board-ui.ts`). Catch-all row `src/games/*/board-ui.ts + game-controller.ts` already covers games. Stale absolute path fails `check:dev-docs` once scope expands (`857`).
- **acceptance criteria:** Stale `hex-ui.ts` rows removed or rewritten to the live games path **without** claiming a `clearElement` conversion that is not present; other table paths left alone unless also missing; no `src/` edits.
- **verification commands:** `ls src/core/hex src/games/hex/board-ui.ts` ; `rg -n 'hex-ui|games/hex/board-ui' docs/web-security-burn-1008-sinks.md`
- **conflict notes:** none.

### q-mp-852 · Docs: mp3d kings spec — fix `board-ui.ts` path

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only path fix under `docs/mp3d/`; **no** board-3d **src** and **no** mp3d **e2e** edits
- **target files:** `docs/mp3d/spec-kings-quadraphages.md` (Sources read line + any `src/ui/board/kings-quadraphages/board-ui.ts` mentions)
- **measured baseline:** Spec cites `src/ui/board/kings-quadraphages/board-ui.ts`. Live file: `src/games/kings-quadraphages/board-ui.ts`. `src/ui/board/kings-quadraphages/` does not exist.
- **acceptance criteria:** Spec paths resolve on disk; no Three/board-3d source or e2e changes; no gameplay copy edits.
- **verification commands:** `ls src/games/kings-quadraphages/board-ui.ts` ; `rg -n 'board-ui\.ts|src/ui/board' docs/mp3d/spec-kings-quadraphages.md`
- **conflict notes:** prompt forbids board-3d src / mp3d e2e — this ticket is markdown only.

### q-mp-853 · Docs: playtest deep reports batch A (calla / ramrod / sum-dominoes)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (prefer after or with `857` so checker can confirm)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; retarget to surviving scripts/e2e or mark historical; **no** AI timer product edits; **no** new playability asserts
- **target files:** `docs/playtest/calla-deep-2026-10-07.md`, `docs/playtest/ramrod-deep-2026-10-07.md`, `docs/playtest/sum-dominoes-deep-2026-10-07.md`
- **measured baseline:** Each file backticks missing unit/e2e paths (calla deep unit+e2e gone; ramrod deep unit+e2e + ai-timer-race gone; sum-dominoes ai-timer-race + deep-playability unit gone). Survivors: `scripts/calla-deep-playtest.mjs`, `scripts/ramrod-deep-playtest.mjs`, `scripts/sum-dominoes-deep-playtest.mjs`, `tests/e2e/sum-dominoes-deep.spec.ts`.
- **acceptance criteria:** Every backtick `tests/` / `scripts/` path in the three files resolves **or** is clearly marked historical without a live path claim; prefer pointing reproduce steps at surviving `scripts/*-deep-playtest.mjs` / e2e; no `src/` / AI / timing edits.
- **verification commands:** `npm run check:dev-docs` (after `857` if folded) ; path exists checks for cited files ; `rg -n 'tests/unit/|tests/e2e/|scripts/' docs/playtest/calla-deep-2026-10-07.md docs/playtest/ramrod-deep-2026-10-07.md docs/playtest/sum-dominoes-deep-2026-10-07.md`
- **conflict notes:** parallel with `854`/`855` (different files).

### q-mp-854 · Docs: playtest deep reports batch B (hex / kings / stars-bars / par-55)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; Hex Hard **450ms** prose must remain accurate if mentioned; no AI product edits
- **target files:** `docs/playtest/hex-deep-2026-10-07.md`, `docs/playtest/kings-deep-2026-10-07.md`, `docs/playtest/stars-bars-deep-2026-10-07.md`, `docs/playtest/par-55-deep-2026-10-07.md`
- **measured baseline:** Missing unit/e2e paths across all four (hex-deep-playability, kings-deep-playability, stars-bars deep + ai-timer-race, par-55 ai-timer-race + deep-playtest-ux + e2e playability). Survivor scripts: `scripts/stars-bars-deep-playtest.mjs`, `scripts/par-55-deep-playtest.mjs`; kings/hex deep e2e unit files absent (mp3d e2e exists but **do not** retarget this ticket into mp3d e2e work).
- **acceptance criteria:** Broken live-path claims fixed or marked historical; do not open mp3d e2e edits; do not change Hex Hard 450ms; no `src/` edits.
- **verification commands:** path exists checks ; `rg -n 'tests/unit/|tests/e2e/|scripts/' docs/playtest/hex-deep-2026-10-07.md docs/playtest/kings-deep-2026-10-07.md docs/playtest/stars-bars-deep-2026-10-07.md docs/playtest/par-55-deep-2026-10-07.md`
- **conflict notes:** parallel with `853`/`855`.

### q-mp-855 · Docs: playtest deep reports batch C (contig / fraction-pinball / queens) + STANDALONE-TRIAGE

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; Queens & Guards product work not in scope — path retarget to surviving `tests/e2e/queens-guards-playability.spec.ts` / `tests/e2e/contig-60-playability.spec.ts` only
- **target files:** `docs/playtest/contig-60-deep-2026-10-07.md`, `docs/playtest/fraction-pinball-deep-2026-10-07.md`, `docs/playtest/queens-guards-deep-2026-10-07.md`, `docs/STANDALONE-TRIAGE-2026-10-07.md` (hex-deep-playability mention)
- **measured baseline:** Contig cites missing ai-timer-generation + deep-playtest-ux units (survivor e2e: `contig-60-playability.spec.ts`). Fraction-pinball cites three missing paths (no survivor deep e2e). Queens cites missing touch-aria unit (survivor e2e playability). STANDALONE-TRIAGE still backticks missing `tests/unit/hex-deep-playability.test.ts`.
- **acceptance criteria:** Broken paths fixed or historical; prefer surviving playability e2e where real; no Queens product / AI / mp3d e2e edits; Hex Hard 450ms note in STANDALONE-TRIAGE stays consistent with tip (450, not 2500).
- **verification commands:** `ls tests/e2e/contig-60-playability.spec.ts tests/e2e/queens-guards-playability.spec.ts` ; `rg -n 'hex-deep-playability|fraction-pinball-deep|queens-guards-touch' docs/playtest docs/STANDALONE-TRIAGE-2026-10-07.md`
- **conflict notes:** parallel with `853`/`854`.

### q-mp-856 · Docs: engine-coverage-round — default coverage dir is not committed

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** fold or co-land of `842` preferred
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; no engine coverage remasure wave
- **target files:** `docs/dev/engine-coverage-round.md` (and optionally the shared “Rank helper” blurb mirrored in newer round docs if it still implies a checked-in baseline dir)
- **measured baseline:** Doc step 1 / command block tells workers to run `node scripts/engine-coverage-rank.mjs coverage-engine-baseline/coverage-summary.json` as if that directory exists. It does not (and `coverage/` is gitignored).
- **acceptance criteria:** Docs state the summary JSON must be produced locally first and passed explicitly; no fake committed baseline added; no mutation-audit / engine-cov characterization wave.
- **verification commands:** `rg -n 'coverage-engine-baseline|engine-coverage-rank' docs/dev/engine-coverage-round.md` ; `ls coverage-engine-baseline 2>&1 | head -1`
- **conflict notes:** after/with `842`.

### q-mp-857 · Scripts: expand `check:dev-docs` scope to `docs/` + `docs/wiki/`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (unblocks verification for `849`–`855`)
- **series:** script-tooling
- **verdict:** **SAFE** — report-only checker scope; **keep exit 0**; do not fail CI; optionally allowlist enormous generated audit dumps if noise is extreme (document any skip)
- **target files:** `scripts/check-dev-doc-links.mjs` (DOCS_DIR / walk roots); header comment; optionally a short note in whatever docs describe `check:dev-docs` (`docs/wiki/development.md` one-liner is enough — avoid tip stamps)
- **measured baseline:** Checker scans **only** `docs/dev/` (314 files). Manual scan of `docs/` + `docs/wiki` (excluding backlog / tip-vs-alpha / compliance) finds **28** unique missing backtick paths that the checker never reports. Wiki cheat-sheet still describes it as “engine-doc link report”.
- **acceptance criteria:** Running `npm run check:dev-docs` also reports missing backtick paths under `docs/*.md`, `docs/wiki/**`, and `docs/playtest/**` (and other non-excluded trees you include); still exit **0**; summarize counts; exclude only clearly generated dumps if needed (list them in the script header); no path “fixes” in this ticket (owned by `849`–`855` / `851` / `852`).
- **verification commands:** `npm run check:dev-docs` ; `rg -n 'docs/dev|DOCS_DIR|docs/wiki|playtest' scripts/check-dev-doc-links.mjs`
- **conflict notes:** expect problem count to jump until doc batches land — that is desired signal, not a ratchet.

### q-mp-858 · Tests: adopt shared `mountPair` in non-overnight fiar/calla hosts

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave overnight `#1138`/`#1139` with `contained`)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only; asserts + counts unchanged; **not** a soft-fail re-characterization; skip mp3d hosts
- **target files:** `tests/unit/fiar-ai-null-draw-recovery.test.ts`, `tests/unit/finish-calla-practice-after-finish.test.ts` (and any sibling non-overnight, non-mp3d, non-mutation soft-fail host with the same board+status `createElement` pair shape if still obvious after tip rebase)
- **measured baseline:** Both files hand-roll `document.createElement('div')` board+status pairs. Shared `tests/helpers/mount-pair.ts` already used elsewhere. Overnight contig/fiar mountPair owned by `#1138`/`#1139`.
- **acceptance criteria:** Listed hosts import `mountPair`; local pair scaffolding removed; asserts + `npx vitest list | wc -l` unchanged; targeted `CI=1 npx vitest run` green on the correct project; no `src/` / copy / AI edits; no mp3d files.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/fiar-ai-null-draw-recovery.test.ts tests/unit/finish-calla-practice-after-finish.test.ts` ; `CI=1 npx vitest run tests/unit/fiar-ai-null-draw-recovery.test.ts tests/unit/finish-calla-practice-after-finish.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** do not touch open `#1138`/`#1139` overnight files; leave mutation-ui / soft-fail board-a11y hosts alone.

### q-mp-859 · Tests: adopt `mulberry32Uint` in `undo-audit-core-games-props`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave `#1135`/`826` kwatro RNG alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only RNG helper adoption; keep stream identical (`mulberry32Uint` matches the uint32-forced body); no rules/scoring/AI edits
- **target files:** `tests/unit/undo-audit-core-games-props.test.ts` (local IIFE mulberry with `0x6d2b79f5` → `mulberry32Uint` from `tests/helpers/rng.ts`)
- **measured baseline:** File inlines the uint32-forced mulberry32 body that `tests/helpers/rng.ts` already exports as `mulberry32Uint`. Helper header says prefer shared helpers over local copies. (Do **not** retarget `tests/visual/helpers.ts` — that copy lives inside `page.addInitScript` and cannot import the Node helper.)
- **acceptance criteria:** Local mulberry IIFE removed in favor of `mulberry32Uint`; property asserts + case counts unchanged; suite green under `CI=1`; no fake-clock retarget; no `src/` edits.
- **verification commands:** `rg -n '0x6d2b79f5|mulberry32Uint|from .*helpers/rng' tests/unit/undo-audit-core-games-props.test.ts` ; `CI=1 npx vitest run tests/unit/undo-audit-core-games-props.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** leave kwatro `826` and visual init-script RNG alone.

### q-mp-860 · Docs: CI gates Mermaid — prefer `test:e2e:firefox-webkit` for cross-browser row

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none (leave `#1136`/`823`/`828` and tip-queued `800` CI yaml alone)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only in `docs/dev/ci-gates-mermaid-q-mp-073.md`; **no** `.github/workflows/ci.yml` edits; **no** CI check renames
- **target files:** `docs/dev/ci-gates-mermaid-q-mp-073.md` (e2e-cross-browser reproduce cell)
- **measured baseline:** Row still leads with `npm run test:e2e -- --project=firefox --project=webkit` and only parenthetically mentions `test:e2e:firefox-webkit`. `package.json` already defines the named script. Open `#1136` fixes wiki/CONTRIBUTING, not this Mermaid doc. Tip-queued `800` owns CI yaml named-script swap — **out of scope here**.
- **acceptance criteria:** Mermaid/table reproduce command prefers `npm run test:e2e:firefox-webkit`; may note bare equivalent; no workflow edits; no job-name changes.
- **verification commands:** `rg -n 'test:e2e:firefox-webkit|e2e-cross-browser' docs/dev/ci-gates-mermaid-q-mp-073.md package.json` ; `node -e "console.log(require('./package.json').scripts['test:e2e:firefox-webkit'])"`
- **conflict notes:** leave `#1126`/`800`/`#1136` alone.

### q-mp-861 · Docs: wiki game-visuals — clarify three visual entrypoints

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1083`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; configs already exist; reduce bare-`npx` confusion vs `package.json` scripts
- **target files:** `docs/wiki/game-visuals.md` (and a cross-link sentence only if needed in `docs/wiki/development.md` visual bullets — avoid count cells)
- **measured baseline:** `game-visuals.md` tells readers `npx playwright test -c playwright.visuals-2026-10.config.ts` only. Repo also has `npm run test:visual` → `playwright.visual.config.ts` and `npm run test:e2e:visual` → CI report-only baselines. Easy to run the wrong suite.
- **acceptance criteria:** Doc distinguishes (1) docs/iPad capture config `playwright.visuals-2026-10.config.ts`, (2) opt-in `npm run test:visual`, (3) CI report-only `npm run test:e2e:visual`; no baseline PNG regenerations in this ticket.
- **verification commands:** `rg -n 'playwright.visual|test:visual|test:e2e:visual' docs/wiki/game-visuals.md docs/wiki/development.md package.json` ; `ls playwright.visual.config.ts playwright.visuals-2026-10.config.ts`
- **conflict notes:** none with visual-baseline remasure skips.

---

## Id allocation

New ids in this doc: **`q-mp-842` … `q-mp-861`** (**20** tasks — fewer than 25; no filler).  
Ids `q-mp-831`…`q-mp-841` and `q-mp-862`…`q-mp-866` are intentionally unused (gap after round-30 `830`; unused tail of the requested `842`…`866` window).  
Do **not** reuse `q-mp-001`–`q-mp-830`. Tip-owner refill should point workers at these after folding this doc into `cursor/mp-tip-post1083`.

**Ceiling keys used in this refill:** **none**.  
**Not used here (already claimed / undrafted / HOLD / no headroom / prompt-skipped families):** void/nnnull/nullish successors, eqeqeq product clear, lint-buckets probe (`792`), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki count remasure, tip-name stamps, UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **src** / **mp3d e2e**, harness shards, demo coverage, `*types*` residuals, docs reproduce → `test:e2e:chromium` sweeps, script `waitForTimeout` clears, overnight mountPair/router batches (`819`–`825` / `#1136`–`#1142`), storage-stubs (`802`), CI `e2e-cross-browser` yaml named script (`800`), Queens & Guards product, AI timing.

**Skipped after measurement (not filler):** AI unit-wall speedups; knip unusedExports (LEAVE only); overnight mountPair remainder (owned); visual `addInitScript` mulberry (cannot import Node `rng` helper); converting hex `innerHTML=''` to `clearElement` (product DOM); expanding nav-away game list (AI mid-nav adjacency); genuine non-AI flake with a new reproducible harness fix that is not a forbidden fake-clock / shard / retry raise — none freshly proven on this tip beyond already-owned soft-fail / AI-timing inventories.

Prefer parallel start on: **842**, **843**, **844**, **847**, **848**, **849**, **850**, **851**, **852**, **858**, **859**, **860**, **861**. Serialize **845** with `#1136` on wiki; prefer **857** before/with playtest doc batches **853**–**855**; serialize **842**/**856**.

**One-line id tags:** `842 SAFE`, `843 SAFE`, `844 SAFE`, `845 SAFE`, `846 SAFE`, `847 SAFE`, `848 SAFE`, `849 SAFE`, `850 SAFE`, `851 SAFE`, `852 SAFE`, `853 SAFE`, `854 SAFE`, `855 SAFE`, `856 SAFE`, `857 SAFE`, `858 SAFE`, `859 SAFE`, `860 SAFE`, `861 SAFE`.

**Next action: fold into tip by the tip owner.**
