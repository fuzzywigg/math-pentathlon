# Engineering backlog — 2026-10-10ai (tip refill after post1143 folds / round-35)

**Task id:** `q-mp-090ai`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1143` @ `d2494c58` (full `d2494c583380242df86fcc42cbaab562edf78a63`; tip carries AGENTS tip pointer → `post1143`, round-33 backlog `10ag`, folded round-33 workers through `q-mp-907`/`900`/`910`/…, and open round-34 backlog `#1195` / `10ah` with implementers `#1197`–`#1210`)  
**Depends on:** tip cut `cursor/mp-tip-post1143` @ `d2494c58`. Round-34 backlog (`q-mp-090ah` / open `#1195` into post1143, ids `q-mp-917`…`938`) already has implementers on **this** tip (`#1197`–`#1210`; remaining ah gaps without open PR at audit: `920`/`923`/`924`/`925`/`927`/`928`/`929`/`936`) — leave with `contained`. Round-33 ag gaps `894`/`895`/`897`/`898`/`899`/`903`/`904`/`905` (still in tip-carried `10ag` / `#1179`) — leave with `contained`. Older tip stacks — leave open drafts with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1143` @ `d2494c58` measures suite **3381** files / **14497** listed cases; Chromium e2e **25** files / **249** cases; lint ratchet green (eqeqeq **1**/1 in `src/games/fiar/rules.ts` — HOLD); typecheck in-scope **0** / out-of-scope **216**; knip unusedExports **3** (LEAVE) / unusedTypes **29** / unusedFiles **0**; dead-code Rank-2 yes **0**. This doc lists **18 new** concrete engineering tasks (`q-mp-942` … `q-mp-959`) mined from the **live tip tree**, checked against prior refills (`q-mp-090` … `q-mp-090ah` / ids through `q-mp-938`) and against the full open draft PR list (including post1143 workers `#1195`–`#1210` and post1083 leftovers `#1136`–`#1182`). It is the **only** deliverable of `q-mp-090ai`.

**Honest count:** Only **18** tasks — not padded to 25. Round-34 already claimed check:perf/`engine-coverage-rank`/`render-perf-mode` help, page-settle extract, page-ready/dismiss-owl unit tests, page-ready adopters in memory-leak/nav-away/deep-playtests, npm aliases for audits/playtests/engine-coverage-rank/`PERF_MODE=render`, non-overnight mountPair destroy/AI-input hosts, and Chromium waits in `sum-dominoes-deep` + `queens-guards-playability` — **do not** re-queue `917`–`938` (open `#1195` + `#1197`–`#1210`). Round-33 `894`/`895`/`897`/`898`/`899` still own lint/type/pwa/dev-docs/size `--help` (unworked ag gaps) — **do not** sibling. Round-32 `867`–`886` and round-31 `842`–`861` remain owned by open post1083 drafts. This refill **does not** re-queue per-game UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **src** or **mp3d e2e** edits, remasure/count-stamp inventories, tip-stamp docs, doc-pointer churn, more npm-alias/`--help` sweeps unless genuinely missing, overnight mountPair/router batches, script `waitForTimeout` families already owned by `803`–`807` / `883`/`884`/`909`, stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline fixed-wait clears (prior HOLD/skip), dismissOwl deep-playtest adoption (`879`), CI `e2e-cross-browser` named script (`800`), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK — not queued), or anything in rounds ≤34. Payoffs are freshly measured on this tip: **`check-emit-identity --files-from` empty list wrongly falls back to the default 21-file AI scan**, **`report-lint-buckets` ignores unknown flags and still runs the full eslint probe** (even after tip-carried `870` `--top`/`--rule` hygiene), **`scripts/render-perf.mjs` documents `npm run perf:render` but package.json has no such script** (distinct from ah `929`’s `PERF_MODE=render` wrap), **harnesses hard-code `/opt/cursor/artifacts` (EACCES on non-cloud hosts)**, **`render-perf*.mjs` still inline `waitDoubleRaf` after `920`**, **`render-perf-mode` measureTTI still hand-rolls loading waits**, **`fullgame/_helpers` duplicates `waitForGameReady`**, **fullgame harness/drivers still use fixed `waitForTimeout`/`sleep`**, **`burn-1008-registry-module-contract` still hand-rolls board+status**, **kwatro long-game test still inlines mulberry32**, and **wiki cheat-sheets omit live `docs:*` / `verify` names**.

**Preference:** SAFE, mutually independent **scripts/** tooling, **docs-only**, or **tests-only** helper adoption. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins findings, boundaries/PWA installability thresholds, board-3d layout inventory, CI permissions, tip-pointer / tip-name sweep theater, open-draft triage, emit-identity inventory remasure, knip drift, dead-CSS Rank-1 rescan, coverage-map heat regenerate, or wiki **count** stamps. **Avoid** competing tickets already owned by open `#1195`–`#1210` / `#1179` / `#1162`–`#1182` / tip-carried `10ag`/`10ah` ids. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics. **Do not** edit `*/rules.ts`.

**Lint policy for this refill:** **no** new ceiling-key clears.

## Duplicate check (do not re-queue)

Skipped topics already covered by `q-mp-176`–`q-mp-938`, open drafts, or prior ids (non-exhaustive; `gh pr list --state open` 2026-10-11):

| Topic family | Why skipped |
| --- | --- |
| round-34 backlog / check:perf+engine-rank+render-perf-mode help (`917`–`919`) / page-settle (`920`) / page-ready+dismissOwl unit (`921`/`922`) / page-ready adopters (`923`–`925`) / npm aliases (`926`–`929`) / mountPair destroy+AI-input (`930`–`936`) / e2e waits (`937`/`938`) | open `#1195` + workers `#1197`–`#1210`; ah gaps `920`/`923`/`924`/`925`/`927`/`928`/`929`/`936` still need workers — leave with `contained`; **do not** re-queue `917`–`938` |
| round-33 / lint+type+pwa+dev-docs+size `--help` (`894`/`895`/`897`/`898`/`899`) / mountPair contig-end+fiar-timer+kings-touch (`903`–`905`) / other `892`–`911` | tip-carried `10ag` + `#1179`; ag gaps still need workers — leave with `contained` |
| round-32 / mutation argv / emit-identity missing-path (`869`) / lint-buckets `--top` (`870`) / flake `--out` / ratchet-history / copy-pins+knip / check-build / check:perf missing-dist / harness env NaN / gallery npm / mountPair kings+contig / dismissOwl extract+adopters (`879`) / e2e helpers / page-ready extract / waits / workflows unknown / offline help | open `#1162`–`#1182` on post1083 — leave with `contained`; **do not** re-queue `867`–`886` (this refill’s `942` is **only** empty `--files-from` fallback, not a sibling of `869`’s missing-path UX; `943` is **only** unknown-flag rejection, not a sibling of `870`’s `--top`/`--rule` value eating) |
| round-31 / engine-coverage-rank missing-file (`842`) / flake `--runs` / mobile-audit `--out` / size missing-dist / coverage-map UX / playtest+security+mp3d docs / `check:dev-docs` scope / mountPair fiar-calla / mulberry undo-audit (`859`) / Mermaid+visuals docs (`861`) | open `#1144`–`#1161` — leave with `contained` |
| per-game UI coverage / soft-fail chars / mutation-audit waves / board-3d **src** / **mp3d e2e** / demo cov / harness shards / remasure inventories / tip-name stamps / `*types*` residuals / doc-pointer churn / more npm-alias/`--help` theater | prompt hard-skip for round-35 |
| knip unusedExports LEAVE / unusedTypes baseline drop / wiki count cells / AGENTS tip name | remasure / tip-stamp theater / intentional LEAVE |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts / copy / scoring / CI permissions widening / eqeqeq in `fiar/rules.ts` | hard-rule HOLD |
| wiki `#658` “Open draft” regression (`822`) | leave prior id; do not open a sibling |
| stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline / probe-offline fixed waits | prior HOLD/skip |
| dismissOwl deep-playtest local copies (`879`) | still needs a worker — **do not** sibling; leave `879` |
| CI `e2e-cross-browser` named script (`800`) | tip-queued; unworked — **do not** re-queue |
| emit-identity default wave5 merge-base tip retarget | tip-owner HOLD-CHECK — not queued |
| historical backlog missing-path noise (`check:dev-docs` on `10ac`/`10ae`/`10af`) | owned by `848`–`857` / intentional examples — no backlog path-citation theater |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening, apt, or network-in-tests work. No `memory/` files.

## Stale queue re-check (live tip `d2494c58`)

| Id | Title (short) | Verdict | Evidence @ `d2494c58` |
| --- | --- | --- | --- |
| `q-mp-090ah` / `#1195` | round-34 backlog 10ah | **open draft on post1143** | Leave with `contained` — this refill starts after `938`. |
| `q-mp-917`–`938` / `#1197`–`#1210` | round-34 implementers | **still-valid (open on post1143)** | Leave alone — do not duplicate. Ah gaps without open PR: `920`/`923`/`924`/`925`/`927`/`928`/`929`/`936`. |
| `q-mp-894`/`895`/`897`/`898`/`899` | lint/type/pwa/dev-docs/size `--help` | **still-valid; no open implementer PR** | Live scripts still ignore `--help` / run full work — leave prior ids; do not sibling. |
| `q-mp-867`–`886` / `#1162`–`#1182` | round-32 implementers | **still-valid (open on post1083)** | Leave alone. |
| `q-mp-842`–`861` / `#1145`–`#1161` | round-31 implementers | **still-valid (open on post1083)** | Leave alone; `946` must not rewrite `861` three-entrypoint framing. |
| `q-mp-800` | CI cross-browser named script | **tip-queued; unworked** | Live `ci.yml` still bare `test:e2e -- --project=firefox --project=webkit` — **do not** re-queue. |
| `q-mp-879` | dismissOwl deep-playtest adopters | **still-valid; no open PR** | 5 local `dismissOwl` copies remain — leave prior id; do not sibling. |
| `q-mp-870` / `#1172` | lint-buckets `--top`/`--rule` | **tip-carried parseArgs + open draft on post1083** | Tip already rejects missing `--top`/`--rule` values; unknown flags still ignored — `943` is the missing unknown-flag piece only. |
| `q-mp-822` / wiki `#658` | Open draft #658 regression | **leave prior id** | Do not open a sibling. |
| `q-mp-667`–`668` / `#1098` | wiki/testing-layers counts | **stale vs live 3381/14497** | **do not** re-queue count stamps. |

## Shared-file conflict flags

| Shared file | Conflicting new ids |
| --- | --- |
| `scripts/check-emit-identity.mjs` | `942` only; leave `#1163`/`869` missing-path message alone; do **not** retarget wave5 merge-base tip |
| `scripts/report-lint-buckets.mjs` + unit parseArgs test | `943` only; serialize with open `#1172`/`870` |
| `package.json` + `docs/wiki/development.md` | `944` + `945` — serialize if multiple land; leave `#1198`/`926` + ah `927`–`929` alone; **`944` wins the name `perf:render`** over ah `929`’s `PERF_MODE` wrap (retarget that to e.g. `perf:runtime:render`) |
| `docs/wiki/game-visuals.md` | `946` only; serialize with open `#1156`/`861` |
| `scripts/lib/page-settle.mjs` (from `920`) + `render-perf*.mjs` | `947` — depends on fold/co-land of `920` |
| `scripts/render-perf-mode.mjs` | `947` + `948` — serialize; leave `#1199`/`919` help wrap alone |
| `scripts/lib/artifact-dir.mjs` (new) + console-sweep / flake loops | `955` + `956` — serialize |
| deep-playtest / offline-probe `.mjs` set | `957` only; serialize with `879` / offline help drafts |
| `tests/unit/burn-1008-registry-module-contract.test.ts` | `949` only |
| `tests/e2e/fullgame/_helpers.ts` | `950` only |
| `tests/e2e/fullgame/_harness.ts` | `951` only |
| `tests/e2e/fullgame/_drivers.ts` | `952` only |
| `tests/unit/kwatro-sinko-ai-long-game-completion.test.ts` | `953` only; leave `#1161`/`859` undo-audit alone |
| `tests/e2e/helpers/*` + canvas-dpr + zoom-reflow | `954` only; leave `#1169`/`880` + `#1117`/`746` alone |

**Parallel-friendly:** `942`, `943`, `944`, `945`, `946`, `949`, `950`, `951`, `952`, `953`, `955`. Serialize `947`/`948` with `920`/`919`; serialize `954` with `920` pattern; serialize `956` with `955`; serialize `957` with `879`/offline drafts; serialize `944`/`945` on `package.json`/`development.md`; prefer `929` retarget note when folding `944`.

## Live tip measurements (evidence snapshot @ `d2494c58`)

```text
$ git rev-parse HEAD
  d2494c583380242df86fcc42cbaab562edf78a63

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
  3381

$ npx vitest list | wc -l
  14497

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ printf '' > /tmp/empty-emit-list && node scripts/check-emit-identity.mjs --files-from /tmp/empty-emit-list
  → header shows "files: 21" and runs default AI-touched scan (empty --files-from ignored)

$ node scripts/report-lint-buckets.mjs --jason
  → full lint-bucket summary (198 lines); exit 0 (unknown flag ignored)

$ node -e "console.log(require('./package.json').scripts['perf:render'])"
  → undefined (while scripts/render-perf.mjs USAGE says Prefer: npm run perf:render)

$ node -e "import fs from 'fs'; try { fs.mkdirSync('/opt/nope-test-mp',{recursive:true}) } catch(e){ console.log(e.code) }"
  → EACCES (non-writable /opt); harnesses still default under /opt/cursor/artifacts

$ rg -n 'function waitDoubleRaf' scripts/*.mjs
  → local copies in console-sweep, mobile-audit, render-perf, render-perf-mode (no scripts/lib/page-settle.mjs yet — owned by 920)

$ rg -n 'function waitForGameReady' tests/e2e/fullgame/_helpers.ts tests/e2e/helpers/page.ts
  → fullgame still defines a local duplicate

$ Open drafts into cursor/mp-tip-post1143 at audit: #1195, #1197–#1210
$ Open drafts into cursor/mp-tip-post1083 at audit: #1136–#1182 (+ alpha tip PR #1183)
```

## New tasks

### q-mp-942 · Scripts: `check-emit-identity` empty `--files-from` must not fall back to default AI scan

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave open `#1163`/`869` missing-path message alone; do **not** retarget wave5 merge-base tip)
- **series:** script-tooling
- **verdict:** **SAFE** — wrong-results fix for explicit empty file lists; no AI product / emit threshold edits
- **CI / package.json callers:** `package.json` → `check:emit-identity`; **not** a blocking CI job (local / AGENTS helper)
- **target files:** `scripts/check-emit-identity.mjs` (`runEmitIdentityCheck` / `parseArgs` `sawFilesFrom` path); `tests/unit/check-emit-identity.test.ts`
- **measured baseline:** `printf '' > /tmp/empty-emit-list && node scripts/check-emit-identity.mjs --files-from /tmp/empty-emit-list` prints `files: 21` and runs `defaultAiTouchedFiles` because `files.length === 0` after a successful empty `loadFilesFromList`. Same for blank/comment-only lists. Missing-path UX is already owned by `869`.
- **acceptance criteria:** When `--files-from` was provided, an empty (or comment/blank-only) list exits **0** with a clear “no files to compare” message and **does not** call `defaultAiTouchedFiles`; valid non-empty lists unchanged; missing/non-file `--files-from` still exits **2** as `869` defines; hermetic unit coverage for the empty-list path; no merge-base tip retarget in this ticket.
- **verification commands:** `printf '' > /tmp/empty-emit-list; node scripts/check-emit-identity.mjs --files-from /tmp/empty-emit-list ; echo $?` ; `printf '# none\n\n' > /tmp/blank-emit-list; node scripts/check-emit-identity.mjs --files-from /tmp/blank-emit-list ; echo $?` ; `CI=1 npx vitest run tests/unit/check-emit-identity.test.ts` ; `node --check scripts/check-emit-identity.mjs`
- **conflict notes:** rebase onto `#1163` if parse helpers moved; do not open a sibling of the HOLD-CHECK merge-base tip retarget.

### q-mp-943 · Scripts: `report-lint-buckets` reject unknown flags (+ unit coverage)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (serialize with open `#1172`/`870` `--top`/`--rule` value hygiene already tip-carried)
- **series:** script-tooling
- **verdict:** **SAFE** — argv hygiene only; no ceiling writes; no eslint product clears
- **CI / package.json callers:** `package.json` → `report:lint-buckets`; **not** a blocking CI job (local / docs helper)
- **target files:** `scripts/report-lint-buckets.mjs` (`parseArgs`); `tests/unit/report-lint-buckets-parse-args.test.ts`
- **measured baseline:** Tip already rejects bare/flag-like `--top`/`--rule` values (`870`). `node scripts/report-lint-buckets.mjs --wat` and `--jason` still run the full eslint probe (~198-line summary) and exit **0**. Unit file has **no** unknown-flag cases.
- **acceptance criteria:** Unknown flags (incl. typos) exit **2** with usage **before** spawning the probe; `--help`/`-h` still exit **0** without probing; valid `--top`/`--rule`/`--json` paths unchanged; hermetic parseArgs + CLI spawn tests cover `--wat` / `--jason`; no ceiling JSON edits.
- **verification commands:** `node scripts/report-lint-buckets.mjs --wat ; echo $?` ; `node scripts/report-lint-buckets.mjs --jason ; echo $?` ; `node scripts/report-lint-buckets.mjs --help ; echo $?` ; `CI=1 npx vitest run tests/unit/report-lint-buckets-parse-args.test.ts`
- **conflict notes:** rebase onto `#1172` if that PR still reshapes `parseArgs`.

### q-mp-944 · package.json + docs: `perf:render` alias for `scripts/render-perf.mjs`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (conflicts with ah `929` name choice — see notes)
- **series:** docs-accuracy
- **verdict:** **SAFE** — npm alias + cheat-sheet line for an existing harness; no PERF_* / AI timing edits
- **CI / package.json callers:** n/a (adding alias; harness remains local-only). Related existing: `package.json` → `perf:runtime`
- **target files:** `package.json` (scripts); `docs/wiki/development.md` (cheat-sheet near `perf:runtime`)
- **measured baseline:** `scripts/render-perf.mjs` USAGE / header say `Prefer: npm run perf:render`, but `package.json` has **no** `perf:render`. Ah `929` proposes mapping that name to `PERF_MODE=render npm run perf:runtime` (different harness via `render-perf-mode.mjs`).
- **acceptance criteria:** Add `perf:render` → `node scripts/render-perf.mjs` (forward args if the repo pattern supports it); development.md prefers the named script; if ah `929` lands first with the `PERF_MODE` wrap under this name, **retarget that wrap** to e.g. `perf:runtime:render` (or equivalent) so `perf:render` matches `render-perf.mjs`; no harness body edits required in this ticket.
- **verification commands:** `node -e "console.log(require('./package.json').scripts['perf:render'])"` ; `rg -n 'perf:render|render-perf\\.mjs' package.json docs/wiki/development.md scripts/render-perf.mjs`
- **conflict notes:** tip-owner prefers this mapping over ah `929` for the bare name `perf:render`.

### q-mp-945 · Docs: development.md cheat-sheet for live `docs:*` + `verify` (+ optional `mutation:report`)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave `#1198`/`926` + ah `927`–`929` alone; serialize lightly with `944`)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs-only cheat-sheet lines for scripts that already exist; no CI job edits
- **CI / package.json callers:** n/a (documenting existing `package.json` scripts: `docs:gallery`, `docs:lifecycle-visuals`, `docs:visuals-2026-10`, `verify`; optionally `mutation:report` / `report:licenses` / `report:ratchet-history` if space allows)
- **target files:** `docs/wiki/development.md` (cheat-sheet block only)
- **measured baseline:** Those npm script names exist in `package.json` but are absent from the development.md cheat-sheet (contributors still see bare `npx playwright test -c …` for gallery/lifecycle/visuals-2026-10 elsewhere). `CONTRIBUTING.md` already mentions `verify`.
- **acceptance criteria:** Cheat-sheet lists the live `docs:*` names and `npm run verify`; no count-cell / tip-name edits; no workflow YAML edits; do not invent new aliases here.
- **verification commands:** `rg -n 'docs:gallery|docs:lifecycle-visuals|docs:visuals-2026-10|npm run verify' docs/wiki/development.md package.json` ; `node -e "const s=require('./package.json').scripts; for (const k of ['docs:gallery','docs:lifecycle-visuals','docs:visuals-2026-10','verify']) console.log(k, !!s[k])"`
- **conflict notes:** serialize wiki one-liner lightly with `944`/`946`.

### q-mp-946 · Docs: wiki game-visuals prefer `npm run docs:visuals-2026-10`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-accuracy
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (serialize with open `#1156`/`861` three-entrypoint clarify)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs prefer named script after tip-folded `901`; no Playwright config / baseline regenerates
- **CI / package.json callers:** n/a (docs only; script `docs:visuals-2026-10` already exists)
- **target files:** `docs/wiki/game-visuals.md`
- **measured baseline:** Table + command block still say `npx playwright test -c playwright.visuals-2026-10.config.ts` only. Tip already has `npm run docs:visuals-2026-10`. Open `861` clarifies three entrypoints but predates the alias.
- **acceptance criteria:** Prefer `npm run docs:visuals-2026-10` as the primary docs/iPad capture command; keep the three-entrypoint distinction (`test:visual` / `test:e2e:visual` / docs capture) if `861` has not landed — do not flatten them; no PNG / config edits.
- **verification commands:** `rg -n 'docs:visuals-2026-10|playwright.visuals-2026-10' docs/wiki/game-visuals.md package.json` ; `node -e "console.log(require('./package.json').scripts['docs:visuals-2026-10'])"`
- **conflict notes:** rebase onto `#1156` if that PR rewrites the same table.

### q-mp-947 · Scripts: adopt shared `page-settle` in `render-perf` + `render-perf-mode`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** fold or co-land of ah `920` (shared `scripts/lib/page-settle.mjs`)
- **series:** script-tooling
- **verdict:** **SAFE** — scripts-only DRY of existing double-rAF; no PERF_* / AI timing / wait-budget edits
- **CI / package.json callers:** `package.json` → `perf:runtime` (imports `render-perf-mode` when `PERF_MODE=render`); `render-perf.mjs` is local-only (`944` may add `perf:render`)
- **target files:** `scripts/render-perf.mjs`; `scripts/render-perf-mode.mjs`; read-only `scripts/lib/page-settle.mjs` (from `920`)
- **measured baseline:** Both files define local `waitDoubleRaf`. `920` extracts the helper for console-sweep/mobile-audit only. Open `#1199`/`919` is help/main-guard only.
- **acceptance criteria:** Local `waitDoubleRaf` removed in favor of the shared helper; settle semantics unchanged; `node --check` on touched files; no `waitForTimeout` / CPU-throttle / move-target edits; no `src/` edits.
- **verification commands:** `rg -n 'waitDoubleRaf|page-settle' scripts/render-perf.mjs scripts/render-perf-mode.mjs scripts/lib/page-settle.mjs` ; `node --check scripts/render-perf.mjs scripts/render-perf-mode.mjs`
- **conflict notes:** rebase onto `920` + `#1199`.

### q-mp-948 · Scripts: adopt `page-ready` ready wait in `render-perf-mode` measureTTI

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (serialize lightly with `947` / `#1199`/`919`; leave ah `925` deep-playtest adopters alone)
- **series:** script-tooling
- **verdict:** **SAFE** — DRY loading/ready wait only; keep TTI measurement contract; no AI delay edits
- **CI / package.json callers:** imported by `scripts/runtime-perf.mjs` when `PERF_MODE=render` (`package.json` → `perf:runtime`); **not** a direct CI step
- **target files:** `scripts/render-perf-mode.mjs` (`measureTTI`)
- **measured baseline:** `measureTTI` hand-rolls `[data-testid="game-loading"]` hidden + `#new-game-btn, h1` visible waits. Shared `waitForGameReady` already encodes that contract.
- **acceptance criteria:** Post-nav ready path uses `waitForGameReady` (timeout option OK); TTI still measured around `navigateFn`; no PERF_* default edits; `node --check`.
- **verification commands:** `rg -n 'waitForGameReady|game-loading|from .*page-ready' scripts/render-perf-mode.mjs` ; `node --check scripts/render-perf-mode.mjs`
- **conflict notes:** co-land carefully with `947`/`919`.

### q-mp-949 · Tests: adopt shared `mountPair` in `burn-1008-registry-module-contract` board-status family

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave ah `930`–`936` / ag `903`–`905` alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only board+status scaffolding in `callInit`; asserts + registry counts unchanged; no `src/` edits
- **target files:** `tests/unit/burn-1008-registry-module-contract.test.ts`
- **measured baseline:** `callInit` `board-status` family hand-rolls `createElement('div')` pairs + `append(board, status)`. Single-host `container-vsai` / default hosts can stay local.
- **acceptance criteria:** Board+status path uses `mountPair`; other init families untouched; asserts + `npx vitest list | wc -l` unchanged aside from unrelated tip drift; targeted vitest green; no `src/` edits.
- **verification commands:** `rg -n 'mountPair|createElement\('\''div'\''\)' tests/unit/burn-1008-registry-module-contract.test.ts` ; `CI=1 npx vitest run tests/unit/burn-1008-registry-module-contract.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** none with open mountPair PRs (different host file).

### q-mp-950 · E2E: adopt shared `waitForGameReady` in `fullgame/_helpers`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only DRY; fullgame remains `@fullgame` / report-only; no product edits
- **CI / package.json callers:** `package.json` → `test:e2e:fullgame` (CI report-only `e2e-fullgame`); **not** in required `test:e2e:chromium`
- **target files:** `tests/e2e/fullgame/_helpers.ts`
- **measured baseline:** File already imports `dismissOwl` from `../helpers/page` but still defines a local `waitForGameReady` that duplicates the shared loading+chrome wait (20s timeouts).
- **acceptance criteria:** Use shared `waitForGameReady` (timeout option OK if 20s must stay); delete local duplicate; startHumanVsHuman / other helpers unchanged; no `src/` edits; no fullgame case-list churn.
- **verification commands:** `rg -n 'waitForGameReady|from .*helpers/page' tests/e2e/fullgame/_helpers.ts` ; `npm run test:e2e:chromium -- --list` (still 249; fullgame excluded)
- **conflict notes:** none.

### q-mp-951 · E2E: replace fixed `waitForTimeout` in `fullgame/_harness` (5 sites)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (serialize lightly with `950`/`952`)
- **series:** test-hygiene
- **verdict:** **SAFE** — report-only fullgame wait hygiene; playability asserts unchanged; **not** mp3d / required chromium smoke / AI product timing
- **CI / package.json callers:** `package.json` → `test:e2e:fullgame` (CI report-only `e2e-fullgame`)
- **target files:** `tests/e2e/fullgame/_harness.ts` (**5** `waitForTimeout` call sites)
- **measured baseline:** Fixed 40/60/80/60/50ms sleeps after playLegal / stall nudge / illegal / legal loops.
- **acceptance criteria:** Fixed timeouts replaced with condition / locator / fingerprint waits where straightforward; fullgame case list unchanged; no `src/` edits; no fake-clock retarget; do **not** clear driver `sleep()` sites here (`952`).
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/fullgame/_harness.ts` ; `npm run test:e2e:chromium -- --list` ; optionally targeted `npm run test:e2e:fullgame -- tests/e2e/fullgame/hex.spec.ts` when browsers available
- **conflict notes:** do not touch mp3d e2e waits.

### q-mp-952 · E2E: replace fixed `sleep`/`waitForTimeout` in `fullgame/_drivers` where straightforward

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (serialize lightly with `951`)
- **series:** test-hygiene
- **verdict:** **SAFE** — report-only fullgame driver wait hygiene; per-game click contracts unchanged; **not** AI product timing
- **CI / package.json callers:** `package.json` → `test:e2e:fullgame` (CI report-only `e2e-fullgame`)
- **target files:** `tests/e2e/fullgame/_drivers.ts` (`sleep` helper + call sites)
- **measured baseline:** Local `sleep` wraps `page.waitForTimeout`; ~12+ call sites after clicks/selection. Non-mp3d.
- **acceptance criteria:** Prefer condition / locator waits (or a shared short settle helper) where straightforward; keep asserts; no game-list / scoring edits; no `src/` edits; leave harness sites to `951`.
- **verification commands:** `rg -n 'waitForTimeout|function sleep' tests/e2e/fullgame/_drivers.ts` ; `npm run test:e2e:chromium -- --list`
- **conflict notes:** large file — keep diff focused on wait helpers/call sites only.

### q-mp-953 · Tests: adopt shared `mulberry32` / `withSeededRandom` in kwatro long-game completion

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave open `#1161`/`859` undo-audit alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only RNG helper adoption; keep stream identical; **no** AI search/scoring/difficulty/timing product edits; no `src/games/**/ai.ts` edits
- **target files:** `tests/unit/kwatro-sinko-ai-long-game-completion.test.ts`
- **measured baseline:** File inlines `mulberry32` + local `withSeededRandom` matching `tests/helpers/rng.ts`. Helper header says prefer shared helpers over local copies. (`859` only targets undo-audit props.)
- **acceptance criteria:** Local mulberry/withSeededRandom removed in favor of `tests/helpers/rng`; ply/seed asserts + case counts unchanged; suite green under `CI=1`; no fake-clock retarget; no `src/` edits.
- **verification commands:** `rg -n '0x6d2b79f5|mulberry32|withSeededRandom|from .*helpers/rng' tests/unit/kwatro-sinko-ai-long-game-completion.test.ts` ; `CI=1 npx vitest run tests/unit/kwatro-sinko-ai-long-game-completion.test.ts` ; `npx vitest list | wc -l`
- **conflict notes:** do not touch AI product modules.

### q-mp-954 · E2E: extract shared double-rAF settle helper; adopt in canvas-dpr + zoom-reflow

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (pattern-sibling of ah `920`; leave `#1169`/`880` + `#1117`/`746` alone)
- **series:** test-hygiene
- **verdict:** **SAFE** — e2e helper DRY only; asserts unchanged; **not** mp3d / fullgame / AI timing
- **CI / package.json callers:** `package.json` → `test:e2e:chromium` (canvas-dpr); `test:e2e:zoom-reflow` (CI report-only `zoom-reflow`)
- **target files:** `tests/e2e/helpers/page-settle.ts` (new) or extend an existing helper; adopt in `tests/e2e/canvas-dpr-resize.spec.ts`; adopt in `tests/e2e/zoom-reflow-a11y.spec.ts`; optionally thin wrap in `tests/e2e/helpers/visual-stability.ts` if it still inlines the same pattern
- **measured baseline:** canvas-dpr and zoom-reflow each inline `requestAnimationFrame(() => requestAnimationFrame(...))`. visual-stability also inlines the same settle before exporting `waitForGameReady`.
- **acceptance criteria:** Shared helper exported; local double-rAF settle removed at the listed call sites; chromium list still **249**; zoom-reflow case list unchanged; no `src/` edits; do **not** clear remaining `waitForTimeout` families owned elsewhere.
- **verification commands:** `rg -n 'page-settle|requestAnimationFrame' tests/e2e/helpers tests/e2e/canvas-dpr-resize.spec.ts tests/e2e/zoom-reflow-a11y.spec.ts` ; `npm run test:e2e:chromium -- --list`
- **conflict notes:** keep distinct from scripts `920` (Playwright page.evaluate helper vs unit/script lib).

### q-mp-955 · Scripts: extract shared writable `artifact-dir` helper

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none
- **series:** script-tooling
- **verdict:** **SAFE** — scripts-only path helper; no harness game-list / timing edits
- **CI / package.json callers:** **none** (local harness helper; adopters in `956`/`957`)
- **target files:** `scripts/lib/artifact-dir.mjs` (new); optional tiny unit test under `tests/unit/`
- **measured baseline:** Many harnesses hard-code `/opt/cursor/artifacts`. Creating `/opt/…` on a non-cloud host fails with `EACCES` (measured). `mobile-audit` already defaults under `docs/` — good contrast.
- **acceptance criteria:** Helper resolves a writable artifact root: prefer `process.env.MP_ARTIFACT_DIR` / existing `/opt/cursor/artifacts` when creatable, else fall back to repo-local `test-results/agent-artifacts` (or equivalent); exports a small API (e.g. `resolveArtifactDir()` / `artifactPath(...parts)`); hermetic unit test with fake fs OK; no adopter rewires required in this ticket (`956`/`957`).
- **verification commands:** `node --check scripts/lib/artifact-dir.mjs` ; `CI=1 npx vitest run tests/unit/artifact-dir.test.ts` (if added) ; `rg -n 'resolveArtifactDir|artifact-dir' scripts/lib/artifact-dir.mjs`
- **conflict notes:** keep defaults documented in the helper header.

### q-mp-956 · Scripts: adopt `artifact-dir` in console-sweep + flake-rate loops

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** `955`
- **series:** script-tooling
- **verdict:** **SAFE** — default output path portability only; keep SWEEP_OUT / `--out` overrides; no browser / flake-run semantics edits
- **CI / package.json callers:** `package.json` → `flake:unit`, `flake:e2e`; console-sweep is local-only (`926` may add `audit:console`)
- **target files:** `scripts/console-sweep.mjs`; `scripts/flake-rate-unit-loop.mjs`; `scripts/flake-rate-e2e-loop.mjs`
- **measured baseline:** console-sweep defaults + `mkdirSync` hard-code `/opt/cursor/artifacts`. Flake loops default `--out` to `/opt/cursor/artifacts/flake-rate`.
- **acceptance criteria:** Defaults use the shared helper; explicit `SWEEP_OUT` / `--out` still win; help text mentions the fallback; `node --check` on touched files; no run-count / shuffle edits.
- **verification commands:** `rg -n 'artifact-dir|/opt/cursor/artifacts' scripts/console-sweep.mjs scripts/flake-rate-unit-loop.mjs scripts/flake-rate-e2e-loop.mjs` ; `node scripts/console-sweep.mjs --help ; echo $?` ; `node scripts/flake-rate-unit-loop.mjs --help ; echo $?`
- **conflict notes:** serialize with open `#1198`/`926` if that touches console-sweep docs only.

### q-mp-957 · Scripts: adopt `artifact-dir` in offline probes + deep-playtest harnesses

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** `955` (serialize with `879` / open offline-help drafts)
- **series:** script-tooling
- **verdict:** **SAFE** — output path portability only; **no** `waitForTimeout` / AI delay / dismissOwl edits (leave `879` / prior HOLD waits alone)
- **CI / package.json callers:** **none** (local-only probes / playtests; ah `927` may add playtest npm aliases)
- **target files:** `scripts/probe-offline-resilience.mjs`; `scripts/probe-offline-resilience-dev.mjs`; `scripts/webkit-offline-probe.mjs`; `scripts/calla-deep-playtest.mjs`; `scripts/ramrod-deep-playtest.mjs`; `scripts/sum-dominoes-deep-playtest.mjs`; `scripts/stars-bars-deep-playtest.mjs`; `scripts/par-55-deep-playtest.mjs`
- **measured baseline:** Each hard-codes `/opt/cursor/artifacts` (or a subdir) for JSON/md outputs.
- **acceptance criteria:** Artifact roots go through the shared helper; env overrides preserved where they exist; no playtest matrix / difficulty / wait edits; local `dismissOwl` left for `879`; `node --check` on touched files.
- **verification commands:** `rg -n 'artifact-dir|/opt/cursor/artifacts' scripts/*offline*.mjs scripts/*deep-playtest.mjs` ; `node --check` on touched files
- **conflict notes:** co-land carefully with `879` / `#1178`/`886`.

### q-mp-958 · Scripts: lib modules main-entry usage (`help-only-cli` pattern) for `env-number` / `page-ready` / `dismiss-owl`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** none (leave `#1199`/`919` render-perf-mode alone; leave `#1209`/`921` + `#1210`/`922` unit coverage alone)
- **series:** script-tooling
- **verdict:** **SAFE** — library entry guard only; import-as-library path unchanged; no Playwright launch
- **CI / package.json callers:** **none** (libs imported by harnesses; not direct CI steps)
- **target files:** `scripts/lib/env-number.mjs`; `scripts/lib/page-ready.mjs`; `scripts/lib/dismiss-owl.mjs` (add `isMain` usage path; reuse `help-only-cli` if it fits)
- **measured baseline:** `node scripts/lib/env-number.mjs --help` (and page-ready / dismiss-owl) exit **0** with **empty** stdout/stderr — easy to mistake for broken scripts. Sibling `help-only-cli` / browser-harness libs already have hermetic tests.
- **acceptance criteria:** When executed as main, `--help`/`-h` (and bare main) print a short “library module — import from harness X” usage and exit **0**; unknown flags exit non-zero; import path has no side effects; existing unit tests for env-number still green; optional tiny main-guard tests OK.
- **verification commands:** `node scripts/lib/env-number.mjs --help ; echo $?` ; `node scripts/lib/page-ready.mjs --help ; echo $?` ; `node scripts/lib/dismiss-owl.mjs --wat ; echo $?` ; `node --check scripts/lib/env-number.mjs scripts/lib/page-ready.mjs scripts/lib/dismiss-owl.mjs`
- **conflict notes:** do not rewrite exports claimed by open `#1209`/`#1210`.

### q-mp-959 · package.json + docs: named `perf:runtime:render` alias (PERF_MODE wrap) after `944` claims `perf:render`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs-tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1143`)
- **depends-on:** prefer fold of `944` first (or co-land); replaces/absorbs ah `929`’s name choice
- **series:** docs-accuracy
- **verdict:** **SAFE** — npm alias wrapping existing `PERF_MODE=render` path; no probe thresholds / AI timing edits
- **CI / package.json callers:** n/a (adding alias; `perf:runtime` already exists)
- **target files:** `package.json` (scripts); `docs/wiki/development.md` (note under `perf:runtime`)
- **measured baseline:** Docs tell contributors to set `PERF_MODE=render npm run perf:runtime`. Ah `929` wanted to call that `perf:render`, but that name belongs to `render-perf.mjs` (`944`).
- **acceptance criteria:** Add e.g. `perf:runtime:render` → `PERF_MODE=render npm run perf:runtime` (match repo env-prefix conventions; do not add `cross-env` solely for this ticket); development.md prefers the named script for the `render-perf-mode` path; no harness edits required.
- **verification commands:** `node -e "console.log(require('./package.json').scripts['perf:runtime:render'])"` ; `rg -n 'perf:runtime:render|PERF_MODE=render' package.json docs/wiki/development.md`
- **conflict notes:** if ah `929` already landed as `perf:render`, rename that alias here as part of acceptance.

---

## Id allocation

New ids in this doc: **`q-mp-942` … `q-mp-959`** (**18** tasks — fewer than 25; no filler).  
Ids `q-mp-939`…`q-mp-941` remain intentionally unused (unused tail of the round-34 `917`…`941` window). Ids `q-mp-960`…`q-mp-966` are intentionally unused (unused tail of the requested `942`…`966` window).  
Do **not** reuse `q-mp-001`–`q-mp-938`. Tip-owner refill should point workers at these after folding this doc into `cursor/mp-tip-post1143`.

**Ceiling keys used in this refill:** **none**.  
**Not used here (already claimed / undrafted / HOLD / no headroom / prompt-skipped families):** void/nnnull/nullish successors, eqeqeq product clear (`fiar/rules.ts` HOLD), lint-buckets probe (`792`), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki count remasure, tip-name stamps, UI coverage rounds, soft-fail characterizations, mutation-audit **waves**, board-3d **src** / **mp3d e2e**, harness shards, demo coverage, `*types*` residuals, docs reproduce → named chromium sweeps already owned, deep-playtest `waitForTimeout` (`803`–`807`), overnight mountPair/router batches, round-31 script/docs tickets (`842`–`861`), round-32 tickets (`867`–`886`), round-33 tickets (`892`–`911` / `#1179`), round-34 tickets (`917`–`938` / `#1195`–`#1210`), CI `e2e-cross-browser` yaml named script (`800`), wiki `#658` third rewrite, dismissOwl deep-playtest (`879`), stars-bars / nav-away mid-AI / memory-leak / runtime-perf / webkit-offline wait clears (prior HOLD/skip), lint/type/pwa/dev-docs/size `--help` (`894`/`895`/`897`/`898`/`899`), emit-identity wave5 merge-base tip retarget (tip-owner HOLD-CHECK), Queens & Guards product, AI timing.

**Skipped after measurement (not filler):** AI unit-wall speedups; knip unusedExports (LEAVE only / `cancelFabAiRequests` AI HOLD); package.json scripts pointing at missing files (**0** found); expanding `check:dev-docs` scope (owned by `857`); playtest/security/mp3d broken backtick paths (owned by `849`–`855`); historical backlog missing-path citations; visual `addInitScript` mulberry; converting destroy-suite `innerHTML=''` to `clearElement`; keyboard-only `startHumanKeyboard` specialization; a11y-axe local `waitForVisualSettle`; `engine-coverage-rank` missing-summary copy (owned by `842`) / help (owned by `918`); undo-audit mulberry (owned by `859`); single-root AI-input-guard hosts (not `mountPair` pairs); genuine non-AI flake with a new reproducible harness fix that is not a forbidden fake-clock / shard / retry raise — none freshly proven on this tip beyond already-owned soft-fail / AI-timing inventories.

Prefer parallel start on: **942**, **943**, **944**, **945**, **946**, **949**, **950**, **951**, **952**, **953**, **955**. Serialize **947**/**948** with **920**/**919**; serialize **954** with the `920` pattern; serialize **956**/**957** after **955**; serialize **959** after **944** (absorbs ah **929** name); serialize **943** with **870**; prefer **911**/`page-ready` folded before large memory-leak ready edits (still ah `923`).

**One-line id tags:** `942 SAFE`, `943 SAFE`, `944 SAFE`, `945 SAFE`, `946 SAFE`, `947 SAFE`, `948 SAFE`, `949 SAFE`, `950 SAFE`, `951 SAFE`, `952 SAFE`, `953 SAFE`, `954 SAFE`, `955 SAFE`, `956 SAFE`, `957 SAFE`, `958 SAFE`, `959 SAFE`.

**Next action: fold into tip by the tip owner.**
