# Engineering backlog — 2026-10-10ah (tip refill after post1143 cut / round-34)

**Task id:** `q-mp-090ah`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1143` @ `dde030bf` (full `dde030bfc078242a08916fdc077a640ac51ef51c`; tip carries AGENTS tip pointer → `post1143`, round-33 backlog `10ag`, and prior tip-folded helpers under `scripts/lib/`)  
**Depends on:** tip cut `cursor/mp-tip-post1143` @ `dde030bf`. Round-33 backlog (`q-mp-090ag` / tip-carried `10ag` + open `#1179` into post1083, ids `q-mp-892`…`911`) already has implementers on **this** tip (`#1184`–`#1194`; remaining ag gaps without open PR at audit: `894`/`895`/`897`/`898`/`899`/`903`/`904`/`905`/`907`) — leave with `contained`. Round-32 (`#1162`–`#1182` / post1083) and older tip stacks — leave open drafts with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1143` @ `dde030bf` measures suite **3377** files / **14435** listed cases; Chromium e2e **25** files / **249** cases; lint ratchet green (eqeqeq **1**/1 in `src/games/fiar/rules.ts` — HOLD); typecheck in-scope **0** / out-of-scope **216**; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 yes **0**. This doc lists **22 new** concrete engineering tasks (`q-mp-917` … `q-mp-938`) mined from the **live tip tree**, checked against prior refills (`q-mp-090` … `q-mp-090ag` / ids through `q-mp-911`) and against the full open draft PR list (including post1143 workers `#1184`–`#1194` and post1083 leftovers `#1136`–`#1182`). It is the **only** deliverable of `q-mp-090ah`.

**Honest count:** Only **22** tasks — not padded to 25. Round-33 already claimed mutation `--help`/`--dry-run`, flake-rate `--help`, lint/type/pwa/dev-docs/size ratchet `--help`, dead-code `--help`/`--dry-run`, browser-harness `--help`, visuals-2026-10 npm + gallery link, mountPair destroy-game-cleanup / contig-end / fiar-timer / kings-touch, coverage-map flag-argv, flake npm aliases, deep-playtest `GAMES_*` NaN + `--help`, mobile-audit wait, console-sweep page-ready — **do not** re-queue `892`–`911` (open `#1184`–`#1194` + `#1179`). Round-32 `867`–`886` and round-31 `842`–`861` remain owned by open post1083 drafts. Unit coverage / lint successors remain saturated or owned; knip has **no** SAFE unusedExports; eqeqeq sole residual is `fiar/rules.ts` (hard-rule HOLD). Slowest unit-node wall is still AI determinism / calibration (hard-rule HOLD — not queued). This refill **does not** re-queue per-game UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **src** or **mp3d e2e** edits, demo coverage, harness shards, remasure/count-stamp inventories, tip-name stamps, `*types*` residuals, doc-pointer churn, overnight mountPair/router batches, script `waitForTimeout` families already owned by `803`–`807` / `883`/`884`/`909`, stars-bars / nav-away mid-AI / memory-leak / runtime-perf fixed-wait clears (prior HOLD/skip), dismissOwl deep-playtest adoption (`879`), CI `e2e-cross-browser` named script (`800`), or anything in rounds ≤33. Payoffs are freshly measured on this tip: **`check:perf --help` still dies on missing `dist/`**, **`engine-coverage-rank --help` treated as a filesystem path (exit 2)**, **`render-perf-mode.mjs` main entry prints nothing**, **no unit coverage for `page-ready` / `dismiss-owl` libs**, **memory-leak + nav-away still inline ready/start helpers after `882`/`911`**, **named package.json gaps for console/mobile/nav audits + deep-playtests + engine-coverage-rank + `PERF_MODE=render`**, **non-overnight mountPair leftovers in destroy-cleanup / AI-input-guard hosts after `902`–`905`**, **Chromium e2e fixed waits in `sum-dominoes-deep` + `queens-guards-playability`**, and **a shared double-rAF settle helper to DRY `console-sweep` / `909`**.

**Preference:** SAFE, mutually independent **scripts/** tooling, **docs-only**, or **tests-only** helper adoption. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings, boundaries/PWA installability thresholds, board-3d layout inventory, CI permissions, tip-pointer / tip-name sweep theater, open-draft triage, emit-identity inventory remasure, knip drift, dead-CSS Rank-1 rescan, coverage-map heat regenerate, or wiki **count** stamps. **Avoid** competing tickets already owned by open `#1184`–`#1194` / `#1179` / `#1162`–`#1182` / `#1145`–`#1161` / tip-carried `10ag`/`10af` ids. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

Skipped topics already covered by `q-mp-176`–`q-mp-911`, open drafts, or prior ids (non-exhaustive; `gh pr list --state open` 2026-10-11):

| Topic family | Why skipped |
| --- | --- |
| round-33 backlog / script `--help` (`892`–`900`/`906`/`908`/`910`) / visuals npm (`901`) / mountPair (`902`–`905`) / flake npm (`907`) / mobile wait (`909`) / page-ready console-sweep (`911`) | tip-carried `10ag` + open `#1179` + workers `#1184`–`#1194`; ag gaps `894`/`895`/`897`/`898`/`899`/`903`/`904`/`905`/`907` still need workers — leave with `contained`; **do not** re-queue `892`–`911` |
| round-32 / mutation argv / emit-identity / lint-buckets / flake `--out` / ratchet-history / copy-pins+knip / check-build / check:perf missing-dist / harness env NaN / gallery npm / mountPair kings+contig / dismissOwl extract+adopters (`879`) / e2e helpers / page-ready extract / waits / workflows unknown / offline help | open `#1162`–`#1182` on post1083 — leave with `contained`; **do not** re-queue `867`–`886` |
| round-31 / engine-coverage-rank missing-file (`842`) / flake `--runs` / mobile-audit `--out` / size missing-dist / coverage-map UX / playtest+security+mp3d docs / `check:dev-docs` scope / mountPair fiar-calla / mulberry / Mermaid+visuals docs | open `#1144`–`#1161` — leave with `contained`; **do not** re-queue `842`–`861` (this refill’s `918` is **only** early `--help` / flag rejection, not a sibling of `842`’s missing-summary copy) |
| round-30 / dead-code DEFER / router navigate / wiki firefox-cross / overnight mountPair / kwatro RNG | tip-folded + open leftovers `#1136`–`#1142` — leave with `contained` |
| round-29 / lint-buckets eqeqeq probe / docs reproduce → named e2e / storage-stubs / deep-playtest waits (`803`–`807`) / CI `e2e-cross-browser` named script (`800`) | tip-carried / open `#1125`–`#1134` — leave with `contained` |
| per-game UI coverage / soft-fail chars / mutation-audit waves / board-3d **src** / **mp3d e2e** / demo cov / harness shards / remasure inventories / tip-name stamps / `*types*` residuals / doc-pointer churn | prompt hard-skip for round-34 |
| knip unusedExports LEAVE / unusedTypes baseline drop / wiki count cells / AGENTS tip name | remasure / tip-stamp theater / intentional LEAVE |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions widening / eqeqeq in `fiar/rules.ts` | hard-rule HOLD |
| wiki `#658` “Open draft” regression (`822`) | leave prior id; do not open a sibling |
| stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline fixed waits | prior HOLD/skip (this refill may DRY ready/start helpers without clearing those waits) |
| dismissOwl deep-playtest local copies (`879`) | still needs a worker — **do not** sibling; leave `879` |
| historical backlog missing-path noise (`check:dev-docs` on `10ac`/`10ae`/`10af`) | owned by `848`–`857` / intentional examples — no backlog path-citation theater |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening, apt, or network-in-tests work. No `memory/` files.

## Stale queue re-check (live tip `dde030bf`)

| Id | Title (short) | Verdict | Evidence @ `dde030bf` |
| --- | --- | --- | --- |
| `q-mp-090ag` / `#1179` | round-33 backlog 10ag | **tip-carried + open draft on post1083** | Leave with `contained` — this refill starts after `911`. |
| `q-mp-892`–`911` / `#1184`–`#1194` | round-33 implementers | **still-valid (open on post1143)** | Leave alone — do not duplicate. Ag gaps without open PR: `894`/`895`/`897`/`898`/`899`/`903`/`904`/`905`/`907`. |
| `q-mp-867`–`886` / `#1162`–`#1182` | round-32 implementers | **still-valid (open on post1083)** | Leave alone. |
| `q-mp-842`–`861` / `#1145`–`#1161` | round-31 implementers | **still-valid (open on post1083)** | Leave alone; `918` must not rewrite `842` missing-summary text. |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-879` | dismissOwl deep-playtest adopters | **still-valid; no open PR** | 5 local `dismissOwl` copies remain — leave prior id; do not sibling. |
| `q-mp-803`–`807` / `883`/`884`/`909` | harness wait clears | **tip-folded or open** | Leave alone; this refill’s `920` extracts settle helper only. |
| `q-mp-822` / wiki `#658` | Open draft #658 regression | **leave prior id** | Do not open a sibling. |
| `q-mp-667`–`668` / `#1098` | wiki/testing-layers counts | **stale vs live 3377/14435** | **do not** re-queue count stamps. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/check-perf.mjs` | `917` only; serialize lightly with open `#1164`/`875` if that reshapes main |
| `scripts/engine-coverage-rank.mjs` | `918` + `928` — serialize; leave `#1158`/`842` missing-summary message alone |
| `scripts/render-perf-mode.mjs` | `919` only; leave `#1131`/`805` waits alone |
| `scripts/lib/page-settle.mjs` (new) + `console-sweep` / `mobile-audit` | `920` only; serialize with open `#1185`/`909` + `#1174`/`884` |
| `scripts/lib/page-ready.mjs` | `921` (tests) + `923`/`924`/`925` (adopters); serialize with open `#1186`/`911` |
| `scripts/lib/dismiss-owl.mjs` | `922` tests only — leave `879` adopters alone |
| `scripts/memory-leak-audit.mjs` | `923` only; serialize with open `#1194`/`900` help wrap |
| `scripts/nav-away-sweep.mjs` | `924` only; serialize with `#1194`/`900` |
| deep-playtest `.mjs` set | `925` only; serialize with `879` / `#1190`/`908` / `#1193`/`910` |
| `package.json` + `docs/wiki/development.md` | `926`–`929` — serialize if multiple land; leave `#1184`/`901` + ag `907` alone |
| `tests/helpers/mount-pair.ts` | consumers only (`930`–`936`) — leave `#1189`/`902` + ag `903`–`905` alone |
| `tests/e2e/sum-dominoes-deep.spec.ts` | `937` only |
| `tests/e2e/queens-guards-playability.spec.ts` | `938` only |

**Parallel-friendly:** `917`, `918`, `919`, `921`, `922`, `926`, `927`, `928`, `929`, `930`, `931`, `932`, `933`, `934`, `935`, `936`, `937`, `938`. Serialize `920` with `909`/`884`; serialize `923`/`924` with `900`; serialize `925` with `879`/`908`/`910`; prefer `911` folded before large memory-leak ready edits.

## Live tip measurements (evidence snapshot @ `dde030bf`)

```text
$ git rev-parse HEAD
  dde030bfc078242a08916fdc077a640ac51ef51c

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
  3377

$ npx vitest list | wc -l
  14435

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ node scripts/check-perf.mjs --help
  → "dist/ not found. Run npm run build before check:perf." exit 2 (no usage text)

$ node scripts/engine-coverage-rank.mjs --help
  → "error: coverage summary not found: /workspace/--help" exit 2 (flag treated as path)

$ node scripts/render-perf-mode.mjs --help
  → empty stdout/stderr; exit 0 (library module; no main-guard usage)

$ rg -l 'page-ready|dismiss-owl' tests/unit --glob '*.test.ts'
  → (none) — env-number / help-only-cli / mutation-report-args covered; these two libs have 0 unit tests

$ rg -n 'async function waitGameReady|async function startHuman' scripts/memory-leak-audit.mjs
  → local copies remain after page-ready extract (`882`) / console-sweep adopt (`911`)

$ rg -n 'waitForTimeout' tests/e2e/sum-dominoes-deep.spec.ts tests/e2e/queens-guards-playability.spec.ts
  → 3 + 1 fixed waits (non-mp3d)

$ Open drafts into cursor/mp-tip-post1143 at audit: #1184–#1194
$ Open drafts into cursor/mp-tip-post1083 at audit: #1136–#1182 (+ alpha tip PR #1183)
```

## New tasks

### q-mp-917 · Scripts: `check:perf` early `--help` + reject unknown flags

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (serialize lightly with open `#1164`/`875` missing-`dist/` exit)
- **series:** script-tooling
- **verdict:** **SAFE** — CLI help/unknown only; keep missing-`dist/` exit **2** and report-only-with-dist semantics; no Lighthouse / budget retargets
- **CI / package.json callers:** `package.json` → `check:perf`; **not** a blocking CI job (local / docs reproduce)
- **target files:** `scripts/check-perf.mjs`
- **measured baseline:** No argv handling. `node scripts/check-perf.mjs --help` hits missing-`dist/` and exits **2** with no usage text. Unknown flags are ignored the same way.
- **acceptance criteria:** `--help`/`-h` prints usage (mentions missing-`dist/` exit **2**, report-only when `dist/` exists) and exits **0** **before** the `dist/` existence check and before any summary writes; unknown flags exit **2**; missing `dist/` without help still exits **2**; default `npm run check:perf` unchanged.
- **verification commands:** `node scripts/check-perf.mjs --help ; echo $?` ; `node scripts/check-perf.mjs --wat ; echo $?` ; `node scripts/check-perf.mjs ; echo $?` ; `node --check scripts/check-perf.mjs`
- **conflict notes:** rebase onto `#1164` if main/error paths reshaped.

### q-mp-918 · Scripts: `engine-coverage-rank` early `--help` + reject flag-like argv

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave open `#1158`/`842` missing-summary message alone)
- **series:** script-tooling
- **verdict:** **SAFE** — argv hygiene; complements `842` without rewriting its missing-summary text; no coverage regenerate theater
- **CI / package.json callers:** **none** today (local-only; `928` may add an npm alias)
- **target files:** `scripts/engine-coverage-rank.mjs` (`main` / argv pre-check)
- **measured baseline:** `node scripts/engine-coverage-rank.mjs --help` → `error: coverage summary not found: …/--help` exit **2** (flag treated as a filesystem path). Same for `--wat`.
- **acceptance criteria:** Args starting with `-` are rejected with usage and exit non-zero **before** path lookup; `--help`/`-h` exit **0** with usage; valid explicit summary path still works; default missing-summary message for real paths stays as `842` defines it; no baseline JSON/md regenerate in this ticket.
- **verification commands:** `node scripts/engine-coverage-rank.mjs --help ; echo $?` ; `node scripts/engine-coverage-rank.mjs --wat ; echo $?` ; `node --check scripts/engine-coverage-rank.mjs`
- **conflict notes:** rebase onto `#1158` if `main` helpers moved; co-land lightly with `928`.

### q-mp-919 · Scripts: `render-perf-mode` main-entry usage / `--help`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave `#1131`/`805` wait clears alone)
- **series:** script-tooling
- **verdict:** **SAFE** — library entry guard only; `PERF_MODE=render` measurement contracts unchanged; no AI timing edits
- **CI / package.json callers:** imported by `scripts/runtime-perf.mjs` when `PERF_MODE=render` (`package.json` → `perf:runtime`); **not** a direct CI step
- **target files:** `scripts/render-perf-mode.mjs` (add `isMain` usage path)
- **measured baseline:** `node scripts/render-perf-mode.mjs --help` (and bare invocation) exit **0** with **empty** stdout/stderr — easy to mistake for a runnable harness.
- **acceptance criteria:** When executed as the main module, `--help`/`-h` (and bare main with no args) print a short usage pointing at `PERF_MODE=render npm run perf:runtime` and exit **0**; unknown flags exit non-zero; import-as-library path unchanged (no side effects on import); no wait/timeout / `PERF_*` default edits.
- **verification commands:** `node scripts/render-perf-mode.mjs --help ; echo $?` ; `node scripts/render-perf-mode.mjs --wat ; echo $?` ; `node --check scripts/render-perf-mode.mjs`
- **conflict notes:** none with `805` wait work.

### q-mp-920 · Scripts: extract shared `page-settle` (double-rAF) helper

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** fold or co-land of `909` / open `#1185` (and lightly `#1174`/`884`)
- **series:** script-tooling
- **verdict:** **SAFE** — scripts-only DRY; settle semantics match existing double-rAF; no game-list / AI delay edits
- **CI / package.json callers:** **none** (local harness helpers)
- **target files:** `scripts/lib/page-settle.mjs` (new); adopt in `scripts/console-sweep.mjs`; adopt in `scripts/mobile-audit.mjs` once `909` lands (or co-land)
- **measured baseline:** `console-sweep.mjs` inlines `requestAnimationFrame(() => requestAnimationFrame(...))`. `909` replaces the last `mobile-audit` `waitForTimeout(300)` with the same pattern. No shared helper yet under `scripts/lib/`.
- **acceptance criteria:** Shared helper exported (e.g. `waitDoubleRaf(page)`); console-sweep local settle removed; mobile-audit uses the helper after `909`; `node --check` on touched files; optional tiny unit test with a fake `page.evaluate` / rAF stub OK; no `src/` edits; do **not** clear nav-away / memory-leak / runtime-perf / stars-bars waits here.
- **verification commands:** `rg -n 'page-settle|requestAnimationFrame' scripts/lib/page-settle.mjs scripts/console-sweep.mjs scripts/mobile-audit.mjs` ; `node --check scripts/lib/page-settle.mjs scripts/console-sweep.mjs scripts/mobile-audit.mjs`
- **conflict notes:** rebase onto `#1185` / `#1174`.

### q-mp-921 · Tests: unit coverage for `scripts/lib/page-ready.mjs`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (serialize lightly with open `#1186`/`911` if exports move)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only for harness helper; no Playwright browser launch; no product edits
- **CI / package.json callers:** n/a (new unit file under `tests/unit`; picked up by `npm run test:unit` / CI `unit`)
- **target files:** `tests/unit/page-ready.test.ts` (new); read-only `scripts/lib/page-ready.mjs`
- **measured baseline:** `scripts/lib/page-ready.mjs` exports `waitForGameReady` / `gotoGame` / `startHuman` with **zero** unit tests (`rg` over `tests/unit` finds none). Sibling libs `env-number` / `help-only-cli` already have hermetic tests.
- **acceptance criteria:** Hermetic tests with a fake `page` (locator/goto/evaluate stubs) cover ready wait, goto URL shaping (`?board3d=1`), and startHuman modal path; no real Chromium; case list grows only by this file; no `src/` edits.
- **verification commands:** `CI=1 npx vitest run tests/unit/page-ready.test.ts` ; `rg -n 'page-ready' tests/unit/page-ready.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** rebase if `#1186` renames exports.

### q-mp-922 · Tests: unit coverage for `scripts/lib/dismiss-owl.mjs`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave `879` deep-playtest adopters alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only for harness helper; no browser launch; no player-facing copy / aria string edits in product
- **CI / package.json callers:** n/a (new unit file; CI `unit`)
- **target files:** `tests/unit/dismiss-owl.test.ts` (new); read-only `scripts/lib/dismiss-owl.mjs`
- **measured baseline:** Shared `dismissOwl` has **zero** unit tests. Deep-playtest adoption remains owned by `879`.
- **acceptance criteria:** Hermetic fake-`page` tests cover dismiss click, optional minimize, and `pointerEventsNone` evaluate path; option flags respected; no real Chromium; no `src/` / deep-playtest edits in this ticket.
- **verification commands:** `CI=1 npx vitest run tests/unit/dismiss-owl.test.ts` ; `node --check scripts/lib/dismiss-owl.mjs` ; `npx vitest list | wc -l`
- **conflict notes:** do not open a sibling of `879`.

### q-mp-923 · Scripts: adopt shared `page-ready` helpers in `memory-leak-audit`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (serialize with open `#1194`/`900` help wrap; prefer `911` folded)
- **series:** script-tooling
- **verdict:** **SAFE** — scripts-only DRY; keep menu/accordion / heap-measure contracts; **do not** clear remaining `waitForTimeout` sites (prior HOLD/skip)
- **CI / package.json callers:** `package.json` → `audit:memory`; **not** in CI
- **target files:** `scripts/memory-leak-audit.mjs`
- **measured baseline:** File still defines local `waitGameReady` / `startHuman` despite `scripts/lib/page-ready.mjs`. It already imports shared `dismissOwl`.
- **acceptance criteria:** Import `waitForGameReady` / `startHuman` from `page-ready` (timeout option OK if local 25s must stay); delete local duplicates; menu/`openGameFromMenu` path unchanged; no waitForTimeout clears; `node --check`; no `src/` edits.
- **verification commands:** `rg -n 'function waitGameReady|function startHuman|from .*page-ready' scripts/memory-leak-audit.mjs` ; `node --check scripts/memory-leak-audit.mjs`
- **conflict notes:** rebase onto `#1194` if main() wrap lands first.

### q-mp-924 · Scripts: adopt `page-ready` `waitForGameReady` in `nav-away-sweep`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (serialize with open `#1194`/`900`; optional note in `911`)
- **series:** script-tooling
- **verdict:** **SAFE** — replace loading-chrome wait only; **keep** human-vs-ai start + mid-AI / post-nav `waitForTimeout` sites (prior HOLD — out of scope)
- **CI / package.json callers:** **none** (local-only; `926` may add `audit:nav-away`)
- **target files:** `scripts/nav-away-sweep.mjs`
- **measured baseline:** Top-level await script inlines `game-loading` hidden wait then human-vs-ai start. `911` optionally mentioned nav-away; open `#1186` targets console-sweep only.
- **acceptance criteria:** Use `waitForGameReady` for the post-goto ready wait; do **not** switch the probe to `startHuman` (must stay human-vs-ai); do **not** clear mid-AI / stale-timer waits; help/`main` wrap from `900` preserved; `node --check`.
- **verification commands:** `rg -n 'waitForGameReady|waitForTimeout|human-vs-ai' scripts/nav-away-sweep.mjs` ; `node --check scripts/nav-away-sweep.mjs`
- **conflict notes:** rebase onto `#1194`.

### q-mp-925 · Scripts: adopt `page-ready` ready wait in deep-playtest harnesses

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (serialize with `879` / `#1190`/`908` / `#1193`/`910`)
- **series:** script-tooling
- **verdict:** **SAFE** — DRY loading/ready wait only; keep each script’s vs-AI start + difficulty matrix; **no** `waitForTimeout` / AI delay edits; leave local `dismissOwl` to `879`
- **CI / package.json callers:** **none** (local-only; `927` may add npm aliases)
- **target files:** `scripts/calla-deep-playtest.mjs`, `scripts/ramrod-deep-playtest.mjs`, `scripts/sum-dominoes-deep-playtest.mjs`, `scripts/stars-bars-deep-playtest.mjs`, `scripts/par-55-deep-playtest.mjs`
- **measured baseline:** Each script `page.goto`s then hand-rolls loading waits. Shared `waitForGameReady` exists but is unused here. `910` owns `--help`; `908` owns `GAMES_*`; `879` owns dismissOwl adoption.
- **acceptance criteria:** Post-goto ready path uses `waitForGameReady` (or `gotoGame` **only** where vs-AI start is unchanged — do not force human-vs-human); local dismissOwl left for `879` unless already adopted; no timing constant edits; `node --check` on touched files.
- **verification commands:** `rg -n 'waitForGameReady|from .*page-ready|async function dismissOwl' scripts/*deep-playtest.mjs` ; `node --check` on touched files
- **conflict notes:** co-land carefully with `879`/`908`/`910`.

### q-mp-926 · package.json + docs: named scripts for console / mobile / nav-away audits

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave `#1184`/`901` + ag `907` alone)
- **series:** docs-accuracy
- **verdict:** **SAFE** — npm script aliases + cheat-sheet lines; scripts already exist; no CI job edits
- **CI / package.json callers:** n/a (adding aliases; harnesses remain local-only)
- **target files:** `package.json` (scripts); `docs/wiki/development.md` (cheat-sheet bullets near `audit:memory` / `perf:runtime`)
- **measured baseline:** `console-sweep.mjs` / `mobile-audit.mjs` / `nav-away-sweep.mjs` have **no** `package.json` names (`audit:memory` already exists for memory-leak). Contributors run bare `node scripts/…`.
- **acceptance criteria:** Add e.g. `audit:console` / `audit:mobile` / `audit:nav-away` (names may vary — document them); development.md prefers `npm run …`; no CI workflow edits; no harness behavior changes.
- **verification commands:** `node -e "const s=require('./package.json').scripts; console.log(s['audit:console'], s['audit:mobile'], s['audit:nav-away'])"` ; `rg -n 'audit:console|audit:mobile|audit:nav-away' package.json docs/wiki/development.md`
- **conflict notes:** serialize wiki one-liner lightly with `927`–`929`.

### q-mp-927 · package.json + docs: named scripts for deep-playtest harnesses

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (serialize lightly with `925` / `908` / `910` if docs cite flags)
- **series:** docs-accuracy
- **verdict:** **SAFE** — npm aliases only; no playtest matrix / difficulty / game-count retargets; no CI edits
- **CI / package.json callers:** n/a (adding aliases; remain local-only)
- **target files:** `package.json` (scripts); optionally `docs/wiki/development.md` or playtest README one-liners if they already cite bare `node scripts/*deep-playtest*`
- **measured baseline:** Five `*-deep-playtest.mjs` scripts exist with **no** npm names.
- **acceptance criteria:** Add e.g. `playtest:calla` / `playtest:ramrod` / `playtest:sum-dominoes` / `playtest:stars-bars` / `playtest:par-55` (names may vary — document them); docs prefer `npm run …` where they mention the scripts; no default env / wait edits.
- **verification commands:** `node -e "const s=require('./package.json').scripts; console.log(['playtest:calla','playtest:ramrod','playtest:sum-dominoes','playtest:stars-bars','playtest:par-55'].map(k=>k+':'+(s[k]||'MISSING')).join('\n'))"` ; `rg -n 'playtest:' package.json docs/wiki/development.md`
- **conflict notes:** serialize package.json with `926`/`928`/`929`.

### q-mp-928 · package.json + docs: named script for `engine-coverage-rank`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (serialize lightly with `918`)
- **series:** docs-accuracy
- **verdict:** **SAFE** — npm alias + docs prefer named script; no coverage baseline regenerate
- **CI / package.json callers:** n/a (adding alias; script remains local-only)
- **target files:** `package.json` (scripts); optionally one line in `docs/wiki/development.md` or `docs/dev/engine-coverage-*.md` if they tell contributors to run bare `node scripts/engine-coverage-rank.mjs`
- **measured baseline:** Script exists; no `package.json` name; engine-coverage round docs cite bare `node scripts/engine-coverage-rank.mjs …`.
- **acceptance criteria:** Add e.g. `report:engine-coverage-rank` (name may vary — document it) forwarding args; docs prefer `npm run … -- <summary.json>`; no CI edits; no inventory remasure.
- **verification commands:** `node -e "console.log(require('./package.json').scripts['report:engine-coverage-rank'])"` ; `rg -n 'report:engine-coverage-rank|engine-coverage-rank' package.json docs/wiki/development.md`
- **conflict notes:** rebase onto `918` if usage text moves.

### q-mp-929 · package.json + docs: named `perf:render` alias

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave `#1131`/`805` + `919` alone for script body)
- **series:** docs-accuracy
- **verdict:** **SAFE** — npm alias wrapping existing `PERF_MODE=render` path; no probe thresholds / AI timing edits
- **CI / package.json callers:** n/a (adding alias; `perf:runtime` already exists)
- **target files:** `package.json` (scripts); `docs/wiki/development.md` (note under `perf:runtime`)
- **measured baseline:** Docs tell contributors to set `PERF_MODE=render npm run perf:runtime`. No dedicated npm script name.
- **acceptance criteria:** Add e.g. `perf:render` → `PERF_MODE=render npm run perf:runtime` (cross-platform via `cross-env` only if already a dependency — otherwise document POSIX form / use `env` pattern consistent with repo); development.md prefers the named script; no harness edits required.
- **verification commands:** `node -e "console.log(require('./package.json').scripts['perf:render'])"` ; `rg -n 'perf:render|PERF_MODE=render' package.json docs/wiki/development.md`
- **conflict notes:** do not add `cross-env` dependency solely for this ticket if the repo has an existing env-prefix pattern — match local conventions.

### q-mp-930 · Tests: adopt shared `mountPair` in `q-mp-102-destroy-cleanup`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave `#1189`/`902` destroy-game-cleanup alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only board+status scaffolding; asserts + counts unchanged; no `src/` edits
- **target files:** `tests/unit/q-mp-102-destroy-cleanup.test.ts`
- **measured baseline:** Hex/calla-style hosts hand-roll `board`+`status` + `document.body.append(board, status)`. Single-host roots can stay local.
- **acceptance criteria:** Board+status pairs import `mountPair`; asserts + `npx vitest list | wc -l` unchanged aside from unrelated tip drift; targeted vitest green; no `src/` edits.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/q-mp-102-destroy-cleanup.test.ts` ; `CI=1 npx vitest run tests/unit/q-mp-102-destroy-cleanup.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** none with open mountPair PRs (different hosts).

### q-mp-931 · Tests: adopt shared `mountPair` in `q-mp-145-ai-timer-destroy-cleanup`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave ag `904` fiar-opening-ai-timer alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only scaffolding; timer/destroy asserts unchanged; **no** fake→real timer retarget; no AI product edits
- **target files:** `tests/unit/q-mp-145-ai-timer-destroy-cleanup.test.ts`
- **measured baseline:** Multiple board+status `initGame` hosts hand-roll `createElement('div')` pairs.
- **acceptance criteria:** Hosts import `mountPair`; asserts + case count unchanged; targeted vitest green; keep existing fake-timer usage as-is.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/q-mp-145-ai-timer-destroy-cleanup.test.ts` ; `CI=1 npx vitest run tests/unit/q-mp-145-ai-timer-destroy-cleanup.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** do not touch ag `904` file.

### q-mp-932 · Tests: adopt shared `mountPair` in `q-mp-030-hex-pinball-destroy-cleanup`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only board+status scaffolding; destroy asserts unchanged; no product edits
- **target files:** `tests/unit/q-mp-030-hex-pinball-destroy-cleanup.test.ts`
- **measured baseline:** Board+status pair hand-rolled; single-host roots can stay local.
- **acceptance criteria:** Board+status uses `mountPair`; asserts unchanged; targeted vitest green; no `src/` edits.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/q-mp-030-hex-pinball-destroy-cleanup.test.ts` ; `CI=1 npx vitest run tests/unit/q-mp-030-hex-pinball-destroy-cleanup.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** none.

### q-mp-933 · Tests: adopt shared `mountPair` in `q-mp-034-destroy-remount-contract`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only scaffolding; remount contract asserts unchanged; no `src/` edits
- **target files:** `tests/unit/q-mp-034-destroy-remount-contract.test.ts`
- **measured baseline:** Helper path hand-rolls board+status append matching `mountPair`. Single-host helper can stay local.
- **acceptance criteria:** Board+status path uses `mountPair`; asserts unchanged; targeted vitest green.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/q-mp-034-destroy-remount-contract.test.ts` ; `CI=1 npx vitest run tests/unit/q-mp-034-destroy-remount-contract.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** none.

### q-mp-934 · Tests: adopt shared `mountPair` in `juggle-ai-input-guard`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only scaffolding; input-guard asserts unchanged; no AI product / aria string edits
- **target files:** `tests/unit/juggle-ai-input-guard.test.ts`
- **measured baseline:** Board+status host hand-rolls `createElement('div')` + `append(board, status)`.
- **acceptance criteria:** Import `mountPair`; asserts unchanged; targeted vitest green; no `src/` / copy edits.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/juggle-ai-input-guard.test.ts` ; `CI=1 npx vitest run tests/unit/juggle-ai-input-guard.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** none.

### q-mp-935 · Tests: adopt shared `mountPair` in `pent-em-in-ai-input-guard`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only scaffolding; input-guard asserts unchanged; no AI product edits
- **target files:** `tests/unit/pent-em-in-ai-input-guard.test.ts`
- **measured baseline:** Board+status pair hand-rolled alongside a separate `app` host (app can stay local).
- **acceptance criteria:** Board+status uses `mountPair`; asserts unchanged; targeted vitest green; no `src/` edits.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/pent-em-in-ai-input-guard.test.ts` ; `CI=1 npx vitest run tests/unit/pent-em-in-ai-input-guard.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** none.

### q-mp-936 · Tests: adopt shared `mountPair` in `fiar-ai-seat-aria-guard` board+status host

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave `#1159`/`858` + ag `904` alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only scaffolding for the one board+status pair; aria-guard asserts unchanged; **no** player-facing aria/label string edits in product
- **target files:** `tests/unit/fiar-ai-seat-aria-guard.test.ts`
- **measured baseline:** Most cases use a single `app` host (stay local). One host (~L162+) hand-rolls `board`+`status` matching `mountPair`.
- **acceptance criteria:** That board+status pair uses `mountPair`; app-only hosts untouched; asserts unchanged; targeted vitest green; no `src/` / copy edits.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/fiar-ai-seat-aria-guard.test.ts` ; `CI=1 npx vitest run tests/unit/fiar-ai-seat-aria-guard.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** do not touch `#1159` fiar files.

### q-mp-937 · E2E: replace fixed `waitForTimeout` in `sum-dominoes-deep` (3 sites)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — Chromium e2e wait hygiene only; playability asserts unchanged; **not** mp3d / fullgame / AI product timing
- **CI / package.json callers:** `package.json` → `test:e2e:chromium` (CI `e2e` job); file is part of the chromium smoke set
- **target files:** `tests/e2e/sum-dominoes-deep.spec.ts` (**3** `waitForTimeout` call sites)
- **measured baseline:** Fixed 100ms / 120ms / 80ms waits around roll / human-turn / thinking flash. Non-mp3d.
- **acceptance criteria:** Fixed timeouts replaced with condition / locator / response waits where straightforward; case list unchanged (`npm run test:e2e:chromium -- --list` still 249); no `src/` edits; no fake-clock retarget.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/sum-dominoes-deep.spec.ts` ; `npm run test:e2e:chromium -- --list` ; optionally targeted chromium run of this file when browsers available
- **conflict notes:** do not touch mp3d e2e waits.

### q-mp-938 · E2E: replace fixed `waitForTimeout` in `queens-guards-playability` (1 site)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — Chromium e2e wait hygiene only; playability loop asserts unchanged; **not** mp3d / Queens product edits
- **CI / package.json callers:** `package.json` → `test:e2e:chromium` (CI `e2e` job)
- **target files:** `tests/e2e/queens-guards-playability.spec.ts` (**1** `waitForTimeout(60)` site)
- **measured baseline:** Poll loop sleeps a fixed 60ms between phase checks.
- **acceptance criteria:** Fixed timeout replaced with condition / short locator wait where straightforward; case list unchanged; no `src/` / copy edits.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/queens-guards-playability.spec.ts` ; `npm run test:e2e:chromium -- --list` ; optionally targeted chromium run of this file when browsers available
- **conflict notes:** do not touch `tests/e2e/mp3d-queens-guards-board3d.spec.ts`.

---

## Id allocation

New ids in this doc: **`q-mp-917` … `q-mp-938`** (**22** tasks — fewer than 25; no filler).  
Ids `q-mp-912`…`q-mp-916` remain intentionally unused (unused tail of the round-33 `892`…`916` window). Ids `q-mp-939`…`q-mp-941` are intentionally unused (unused tail of the requested `917`…`941` window).  
Do **not** reuse `q-mp-001`–`q-mp-911`. Tip-owner refill should point workers at these after folding this doc into `cursor/mp-tip-post1143`.

**Ceiling keys used in this refill:** **none**.  
**Not used here (already claimed / undrafted / HOLD / no headroom / prompt-skipped families):** void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets probe (`792`), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki count remasure, tip-name stamps, UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e**, harness shards, demo coverage, `*types*` residuals, docs reproduce → named chromium sweeps already owned, deep-playtest `waitForTimeout` (`803`–`807`), overnight mountPair/router batches, round-31 script/docs tickets (`842`–`861`), round-32 tickets (`867`–`886`), round-33 tickets (`892`–`911` / `#1184`–`#1194`), CI `e2e-cross-browser` yaml named script (`800`), wiki `#658` third rewrite, dismissOwl deep-playtest (`879`), stars-bars / nav-away mid-AI / memory-leak / runtime-perf wait clears (prior HOLD/skip), gallery/lifecycle/visuals-2026-10 npm names (`877`/`901`), flake npm names (`907`), emit-identity default wave5 merge-base retarget (tip-owner HOLD-CHECK — not queued), Queens & Guards product, AI timing.

**Skipped after measurement (not filler):** AI unit-wall speedups; knip unusedExports (LEAVE only); package.json scripts pointing at missing files (**0** found); expanding `check:dev-docs` scope (owned by `857`); playtest/security/mp3d broken backtick paths (owned by `849`–`855`); historical backlog missing-path citations; visual `addInitScript` mulberry; converting destroy-suite `innerHTML=''` to `clearElement`; keyboard-only `startHumanKeyboard` specialization; a11y-axe local `waitForVisualSettle`; `engine-coverage-rank` missing-summary copy (owned by `842` — distinct from `918` help); undo-audit mulberry already re-exported via `undo-audit-helpers` from `helpers/rng`; genuine non-AI flake with a new reproducible harness fix that is not a forbidden fake-clock / shard / retry raise — none freshly proven on this tip beyond already-owned soft-fail / AI-timing inventories.

Prefer parallel start on: **917**, **918**, **919**, **921**, **922**, **926**, **927**, **928**, **929**, **930**, **931**, **932**, **933**, **934**, **935**, **936**, **937**, **938**. Serialize **920** with **909**/**884**; serialize **923**/**924** with **900**; serialize **925** with **879**/**908**/**910**; prefer **911** before large memory-leak ready edits.

**One-line id tags:** `917 SAFE`, `918 SAFE`, `919 SAFE`, `920 SAFE`, `921 SAFE`, `922 SAFE`, `923 SAFE`, `924 SAFE`, `925 SAFE`, `926 SAFE`, `927 SAFE`, `928 SAFE`, `929 SAFE`, `930 SAFE`, `931 SAFE`, `932 SAFE`, `933 SAFE`, `934 SAFE`, `935 SAFE`, `936 SAFE`, `937 SAFE`, `938 SAFE`.

**Next action: fold into tip by the tip owner.**
