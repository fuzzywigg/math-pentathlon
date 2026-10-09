# Engineering backlog — round 4 (2026-10-09d, tip post700)

**Task id:** `q-mp-090d`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post700` @ `3320d897` (alpha land of tip #700 / `q-mp-026d`)  
**Depends on:** tip #700 fold (satisfied)

## Purpose

The Oct 9–18 refill queue needs a fresh tranche after tip `#700` landed batch-5 folds (including `q-mp-090c` / #689). This doc lists **new** concrete engineering tasks (`q-mp-176` upward) mined from the **live tip tree** @ `3320d897`, checked against prior refills (`q-mp-090` / #614 ids `100`–`123`; `q-mp-090b` / #657 ids `124`–`150`; `q-mp-090c` / #689 ids `152`–`175`) and against the open draft PR list (including post700 drafts #703 / #705). It is the **only** deliverable of `q-mp-090d`.

## Duplicate check (do not re-queue)

Skipped topics already covered by prior backlog ids `q-mp-001`–`q-mp-175`, open drafts, or tip #700 folds (non-exhaustive; `gh pr list --state open` 2026-10-09):

| Topic family | Why skipped |
| --- | --- |
| curly / nnnull board-ui / three / games-shell / kings board-renderer | open #666/#701/#702/#699 + tip ceilings; `q-mp-131`/`150`/`162`/`168` |
| shell mounts nnnull (`main` + `game-route-mounts`) | already ticketed `q-mp-132` (090b); residual still live but do not re-id |
| confusing-void ratchet + mounts brace clear | `q-mp-128`/`147` (folded / open duplicates) |
| nullish / optional-chain / switch / duplicate-imports / default-case / radix ratchets | `q-mp-127`/`129`/`130`/`140`/`141`/`148` |
| no-param-reassign / no-shadow / return-await / prefer-object-has-own / eqeqeq / no-console ratchets | `q-mp-156`–`160`, `173`; open #703 (`157`), #705 (`159`) |
| size trim juggle/par-55/remainder + bundle-over first snapshot | `q-mp-163`/`172` |
| check:dev-docs missing-path sweep (79→13) | `q-mp-164` folded in #700 |
| AI-timing CI-skip inventory / wiki CI budget | `q-mp-165`/`175` folded |
| dismissOwl / clearDom / Rank-1 calla+sd CSS / knip unusedTypes triage | `q-mp-154`–`155`/`166`/`170` folded |
| UI cov r6–r8 (`three`) / engine cov r4 / mutation wave 4 | `q-mp-149`/`167`/`143`/`144` |
| destroyGame stubs / R-SHELL soft-fails / Hex Hard 450ms HOLD | hard-rule or already ticketed |
| Star Track p95 (#687) | left open intentionally by tip owner |

Also skipped: any work that would change AI search/scoring/difficulty/timing, player-facing copy / rules text, `*/rules.ts` legal-move or scoring logic, Stars & Bars history cap, Hex Hard 450ms assert, or baseline *raises*.

## Shared-file conflict flags

Workers that touch the same ratchet/ceiling files must serialize (or land as tip-owner folds in order):

| Shared file | Conflicting new ids |
| --- | --- |
| `docs/dev/lint-ratchet-ceilings.json` | `q-mp-180`–`q-mp-183`, `q-mp-190`–`q-mp-194`, `q-mp-198`, `q-mp-205` (+ open #703/#705 and older ratchet drafts) |
| `docs/dev/knip-baseline.json` | `q-mp-187`, `q-mp-204` (+ folded `q-mp-170`) |
| `bundle-budgets.json` / size allowlist | `q-mp-200` (docs remeasure only) vs open `q-mp-163` trim |
| `AGENTS.md` / `docs/wiki/development.md` | `q-mp-198`, `q-mp-199` |

## Live tip measurements (evidence snapshot @ `3320d897`)

```text
$ git rev-parse HEAD
  3320d89712b0cab715b4419e1ef7cafcf952a559

$ npm run lint:ratchet
  ok   curly: 539 / ceiling 539
  ok   @typescript-eslint/no-non-null-assertion: 313 / ceiling 313
  ok   @typescript-eslint/no-confusing-void-expression: 183 / ceiling 183
  ok   radix: 6 / ceiling 6
  ok   default-case: 5 / ceiling 5
  ok   no-duplicate-imports: 122 / ceiling 122
  ok   @typescript-eslint/prefer-nullish-coalescing: 96 / ceiling 96
  ok   @typescript-eslint/prefer-optional-chain: 21 / ceiling 21
  ok   @typescript-eslint/switch-exhaustiveness-check: 8 / ceiling 8

$ npm run typecheck:ratchet
  in-scope errors:     0
  out-of-scope errors: 216   ← AI residual (hard-rule HOLD)

$ npm run check:boundaries
  all counts 0

$ npm run check:dev-docs
  problems: 61  (missing-symbol=48, missing-path=13)
  missing-symbol: docs/dev/alpha-delta-isolation-2026-10-08.md ×48
  missing-path: dead-code-inventory.md ×8, tip-vs-alpha-audit ×3, mutation-audit-ui-2/4 ×1 each

$ npm run report:knip
  unusedExports: 6 (baseline 7 → −1 NOTICE)
  unusedTypes: 91
  unlisted: 3  duplicates: 3

$ npm run build && npm run size:check
  Known OVER allowlist: 0
  NEW OVER: game-juggle (+654 B), game-par-55 (+1.18 kB), game-remainder-islands (+559 B)

ESLint overlay probe (src/, 2026-10-09):
  no-confusing-void-expression buckets: game-controller 51 / ui-three 38 / board-ui 32 / main 12 / …
  prefer-nullish densest: fraction-bar-ui 18 / highlight-ui 11 / owl-messages 9
  no-duplicate-imports: game-controller 31 (non-AI/non-rules)
  eqeqeq (always): 12  |  no-shadow: 13  |  return-await: 7  |  no-promise-executor-return: 1 (owl-system)
  curly residual outside AI/rules HOLD: kings board-renderer 1 (owned by open q-mp-168)
  switch-exhaustiveness: 8 (7 non-rules + star-track/rules HOLD)

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3131

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  hard: 450   ← HOLD untouched
```

---

### q-mp-176 · Delete Rank-1 dead CSS `.game-card-division`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P4 polish
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (orthogonal to folded `q-mp-154` calla/sd-hands cleanup)
- **goal:** Remove the unused `.game-card-division` rule from `src/style.css` and mark the dead-code inventory row removed.
- **evidence:** Live tip `docs/dev/dead-code-inventory.md` Rank-1 kept row for `src/style.css` → `game-card-division` (“grep: no references outside defining module”). Definition at `src/style.css:667`. `rg 'game-card-division' src` → CSS-only.
- **acceptance:** Selector gone; inventory disposition updated; `rg 'game-card-division' src` empty; chromium smoke still green.
- **verify:** `rg 'game-card-division' src` ; `npm run test:e2e:chromium`
- **screening:** CSS-only delete; no player-facing copy strings or rules text. **Conflicts:** none with open post700 drafts.

### q-mp-177 · Clear `check:dev-docs` missing-symbol drift in `alpha-delta-isolation`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs with visuals
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (orthogonal to folded `q-mp-164` missing-path sweep)
- **goal:** Rewrite or remove stale backtick **symbols** in `docs/dev/alpha-delta-isolation-2026-10-08.md` so `npm run check:dev-docs` reports `missing-symbol=0` (path issues may remain for sibling tickets).
- **evidence:** Live tip `npm run check:dev-docs` → **48** `[missing-symbol]` lines, all in `docs/dev/alpha-delta-isolation-2026-10-08.md` (e.g. `status-copy` / `ai-think-delays` / `tutorial-div*` anchors absent after AI/copy restore). Total problems **61** (`missing-symbol=48`, `missing-path=13`).
- **acceptance:** Zero missing-symbol lines from that file; no `src/` edits; no player-facing wiki copy.
- **verify:** `npm run check:dev-docs`
- **screening:** Dev-docs symbol hygiene only; does not change product copy or AI behavior. **Conflicts:** none with `q-mp-178` if each owns disjoint problem kinds/files.

### q-mp-178 · Clear residual 13 `missing-path` stubs (post-#700)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs with visuals
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (`q-mp-164` already folded; this is the leftover set)
- **goal:** Fix stale paths pointing at the deleted unit fake-timers helper and quarantined production core-hex modules so `missing-path` count is 0.
- **evidence:** Live tip missing-path ×**13**: `docs/dev/dead-code-inventory.md` ×8 (deleted fake-timers helper; quarantined core-hex hex-ui/types), `tip-vs-alpha-audit-2026-10-08.md` ×3, `mutation-audit-ui-2.md` ×1 (coordinates), `mutation-audit-ui-4.md` ×1 (hex-ui). Tip replacements live under `tests/helpers/core-hex/` (no production `src/core/hex` tree).
- **acceptance:** `npm run check:dev-docs` shows no `[missing-path]`; docs-only.
- **verify:** `npm run check:dev-docs`
- **screening:** Path rewrite after quarantine/deletes; not a product change. **Conflicts:** may touch same inventory md as `q-mp-176` disposition edits — serialize or combine carefully.

### q-mp-179 · Sync `runtime-error-path-audit.md` to post-fix tip reality

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs with visuals
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none
- **goal:** Update inventory rows that still say **UNRECOVERED** / “skip expected fix” for paths already soft-failed on tip (at least R-SHELL-01), and align recommended-fix table with folded #568 / `q-mp-108` reality.
- **evidence:** Live `src/main.ts:63-68` soft-fails missing `#app` via `console.error('[main] App container not found')` (no throw). Unit pin `tests/unit/runtime-error-path-audit.test.ts:196-200` expects soft-fail. Doc still lists R-SHELL-01 as **UNRECOVERED** sync throw at `docs/dev/runtime-error-path-audit.md:35`.
- **acceptance:** Doc rows match live behavior + tests; no `src/` edits; `check:dev-docs` clean for touched paths.
- **verify:** `npm run check:dev-docs` ; `npx vitest run --project unit-shared tests/unit/runtime-error-path-audit.test.ts`
- **screening:** Docs sync only; hard-rule compliant.

### q-mp-180 · Clear `no-confusing-void-expression` in `game-controller.ts` (−51)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (orthogonal to folded `q-mp-147` mounts −40; tip void ceiling now **183**)
- **goal:** Brace/void-fix confusing-void hits only in `src/games/*/game-controller.ts`; lower void ceiling by the measured delta (≥51). No AI/rules edits.
- **evidence:** Live overlay probe @ tip: void total **183**; bucket **game-controller: 51** (top: `sum-dominoes` 8, `kwatro-sinko` 7, `juggle`/`prime-gold` 6, …).
- **acceptance:** Controllers clean under the rule; ceiling down by ≥51; controller unit smoke green; emit-identity optional for brace-only.
- **verify:** `npm run lint:ratchet` ; `npx vitest run --project unit-shared tests/unit/burn-1009-ui-cov-r6-*.test.ts`
- **screening:** Controller expression hygiene only. **Conflicts:** `lint-ratchet-ceilings.json` with other void clears.

### q-mp-181 · Clear `no-confusing-void-expression` in `src/ui/three/**` (−38)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (disjoint from `q-mp-180` controllers)
- **goal:** Clear void hits under `src/ui/three/**`; lower void ceiling by ≥38.
- **evidence:** Live probe bucket **ui-three: 38** (e.g. `hex-a-gone-board-3d.ts` 5, `star-track-board-3d.ts` 5). Tip void ceiling **183**.
- **acceptance:** `src/ui/three` clean under the rule; ceiling down; mp3d lifecycle unit suites green; no AI timing edits.
- **verify:** `npm run lint:ratchet` ; `npx vitest run --project unit-shared tests/unit/mp3d-*-lifecycle.test.ts`
- **screening:** 3D host brace/void only. **Conflicts:** void ceiling JSON with `q-mp-180`/`182`/`183`.

### q-mp-182 · Clear `no-confusing-void-expression` in `*/board-ui.ts` (−32)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none
- **goal:** Clear void hits in `src/games/*/board-ui.ts` only; lower ceiling by ≥32.
- **evidence:** Live probe bucket **board-ui: 32** of 183.
- **acceptance:** board-ui clean under the rule; ceiling down; no rules/AI/copy edits.
- **verify:** `npm run lint:ratchet` ; `npm run test:unit`
- **screening:** Board UI expression hygiene. **Conflicts:** void ceiling JSON; avoid stacking with open board-ui nnnull #666 on same files if both land — tip owner reconciles.

### q-mp-183 · Clear `no-confusing-void-expression` in `src/main.ts` (−12)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none
- **goal:** Clear the 12 void hits in `src/main.ts`; lower void ceiling by ≥12.
- **evidence:** Live probe: `src/main.ts` **12** void hits (densest single file). Shell route tests already cover main.
- **acceptance:** main clean under the rule; ceiling down; `burn-1007-main-shell-routes` + runtime-error-path suites green.
- **verify:** `npm run lint:ratchet` ; `npx vitest run --project unit-shared tests/unit/burn-1007-main-shell-routes.test.ts tests/unit/runtime-error-path-audit.test.ts`
- **screening:** Shell bootstrap only; no AI/copy. **Conflicts:** void ceiling JSON.

### q-mp-184 · Clear `prefer-nullish-coalescing` in `fraction-bar-ui.ts` (−18)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (ratchet harness already on tip via folded `q-mp-140`; ceiling **96**)
- **goal:** Replace safe `||` with `??` only where empty-string/`0` falsy semantics are impossible (color/style defaults); lower nullish ceiling by measured delta. **Do not** change visible colors for legitimate empty overrides.
- **evidence:** Live probe densest file: `src/core/fractions/fraction-bar-ui.ts` **18** hits (e.g. `:24`, `:73-74`, `:89`, `:186-187`). Tip nullish ceiling **96**.
- **acceptance:** File clean or residual documented with why `||` must stay; ceiling down by cleared count; fraction UI unit/mutation suites green; no rules/AI edits.
- **verify:** `npm run lint:ratchet` ; `npx vitest run --project unit-shared tests/unit/*fraction*`
- **screening:** Core UI helper modernization; player-facing **strings** untouched (colors only). **Conflicts:** nullish ceiling JSON.

### q-mp-185 · Clear `prefer-nullish-coalescing` in `highlight-ui.ts` (−11)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (disjoint file from `q-mp-184`)
- **goal:** Clear nullish hits in `src/core/alignment/highlight-ui.ts`; lower ceiling by ≥11 with falsy-safe `??` only.
- **evidence:** Live probe: `highlight-ui.ts` **11** hits (e.g. `:156`, `:166-169`, `:195-196`, `:273-274`).
- **acceptance:** File clean under the rule; ceiling down; alignment/highlight unit suites green.
- **verify:** `npm run lint:ratchet` ; `npx vitest run --project unit-shared tests/unit/*highlight* tests/unit/mutation-ui2-contiguous*.test.ts`
- **screening:** Alignment highlight helper only. **Conflicts:** nullish ceiling JSON with `q-mp-184`/`186`.

### q-mp-186 · Clear `prefer-nullish-coalescing` in `owl-messages.ts` (−9)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none
- **goal:** Clear nullish hits in `src/core/owl/owl-messages.ts` without changing player-visible message **text** (structural `??` only on optional fields).
- **evidence:** Live probe: `owl-messages.ts` **9** hits. Tip nullish ceiling **96**.
- **acceptance:** File clean; ceiling down; owl unit suites green; no copy-string edits.
- **verify:** `npm run lint:ratchet` ; `npx vitest run --project unit-shared tests/unit/*owl*`
- **screening:** Optional-field coalescing only; hard-rule forbids player-facing copy changes. **Conflicts:** nullish ceiling JSON.

### q-mp-187 · Demote unused `tablet-gl` exports (knip unusedExports)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P4 polish
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (complements folded `q-mp-170` types triage; does not reopen AI `cancelFabAiRequests`)
- **goal:** Stop exporting `BOARD_3D_LQ_PARAM`, `BOARD_3D_LQ_STORAGE_KEY`, and `MP3D_READY_ATTR` from `src/ui/three/tablet-gl.ts` (keep as module-private; tests that string-pin names can keep source pins). Lower `unusedExports` toward baseline-down. **HOLD:** do not edit `src/games/fab-a-diffy/ai-client.ts` `cancelFabAiRequests` (AI surface).
- **evidence:** Live `npx knip --include exports --reporter compact`: unused `tablet-gl.ts` exports listed above; `npm run report:knip` → `unusedExports: 6` (baseline 7). Tests reference names as strings in `tests/unit/e2e-3d-timeout-config.test.ts:66`.
- **acceptance:** Exports demoted/private; knip unusedExports decreased; 3D unit/e2e still pass; no AI file edits; update `docs/dev/knip-baseline.json` only downward-safe.
- **verify:** `npm run report:knip` ; `npx vitest run --project unit-shared tests/unit/e2e-3d-timeout-config.test.ts tests/unit/mp3d-*-lifecycle.test.ts`
- **screening:** Non-AI export hygiene. **Conflicts:** `knip-baseline.json`.

### q-mp-188 · Deduplicate `tests/helpers/rng` seeded-random aliases

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P4 polish
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (orthogonal to folded e2e `dismissOwl` `q-mp-166`)
- **goal:** Collapse knip duplicate pair `withSeededRandom` / `withSeededMathRandom` in `tests/helpers/rng.ts` to one canonical export (keep a thin deprecated alias only if importers require it, or migrate callers).
- **evidence:** Live knip duplicates: `tests/helpers/rng.ts: withSeededRandom, withSeededMathRandom`. Source alias at `tests/helpers/rng.ts:43-54`. Callers span `tests/unit/helpers/*` and `tests/helpers/ai-calibration/*`.
- **acceptance:** Knip duplicate pair gone or documented single-owner alias; unit suites green; no product `src/` edits.
- **verify:** `npx knip --include duplicates --reporter compact` ; `npm run test:unit`
- **screening:** Test-helper only. **Conflicts:** none with product ratchets.

### q-mp-189 · Deduplicate `kings-board` `createRulesState` alias

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P4 polish
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none
- **goal:** Resolve knip duplicate `createCustomGameState` / `createRulesState` in `tests/unit/helpers/kings-board.ts` (prefer one name; update overnight/engine importers).
- **evidence:** Live knip duplicates list that pair. Alias at `tests/unit/helpers/kings-board.ts:39-52`. Importers include `tests/unit/overnight-kings-ai-*.test.ts` and `engine-coverage-round-burn-1008.test.ts`.
- **acceptance:** Duplicate pair cleared; kings helper consumers compile/green; no `src/games/kings-quadraphages/rules.ts` / AI edits.
- **verify:** `npx knip --include duplicates --reporter compact` ; `npx vitest run --project unit-shared tests/unit/rules.test.ts tests/unit/engine-coverage-round-burn-1008.test.ts`
- **screening:** Test-helper rename only. **Conflicts:** overnight AI tests import paths only (no AI source).

### q-mp-190 · Clear `switch-exhaustiveness-check` non-HOLD sites (−7)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (ratchet already on tip @ ceiling **8** via folded `q-mp-141`)
- **goal:** Add exhaustive `default`/`never` arms (or missing cases) in the seven non-rules hits; **HOLD** `src/games/star-track/rules.ts` (`"moving"`). Lower ceiling by ≥7.
- **evidence:** Live probe hits: `attribute-ui.ts:63` (`custom`), `dice-ui.ts:161` (`d6`), `expressions/evaluator.ts:262` (compare ops), `owl-messages.ts:502`, `owl-system.ts:193`, `graph-demo.ts:315`, `polyomino-demo.ts:380`, plus HOLD `star-track/rules.ts:122`.
- **acceptance:** Non-HOLD files clean; ceiling ≤1 (HOLD only) or 0 if tip owner later clears rules; no rules/AI logic changes beyond exhaustiveness in non-rules files.
- **verify:** `npm run lint:ratchet` ; `npm run test:unit`
- **screening:** Exhaustiveness in core/demos/owl only; rules residual HOLD. **Conflicts:** switch ceiling JSON.

### q-mp-191 · Clear `no-shadow` in `contig-60/types.ts` (−2)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** open #703 `q-mp-157` ratchet preferred (ceiling 13)
- **goal:** Rename shadowed `a`/`b` bindings; lower no-shadow ceiling by ≥2.
- **evidence:** Live eslint: `src/games/contig-60/types.ts:242` — `'a'/'b' already declared in the upper scope on line 197`. Tip probe total no-shadow **13**.
- **acceptance:** File clean under the rule; ceiling down; contig unit suites green; no `rules.ts`/AI edits.
- **verify:** `npx eslint src/games/contig-60/types.ts --rule '@typescript-eslint/no-shadow: error'` ; `npx vitest run --project unit-shared tests/unit/*contig*`
- **screening:** Identifier rename in types helper. **Conflicts:** no-shadow ceiling with #703 / `q-mp-174` / `q-mp-192`.

### q-mp-192 · Clear `no-shadow` in `src/ui/three/*-board-3d.ts` (−4)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** open #703 `q-mp-157` preferred
- **goal:** Rename shadowed bindings in three board hosts (`kwatro-sinko-board-3d` ×2, `hex-a-gone-board-3d` ×1, `pent-em-in-board-3d` ×1); lower ceiling by ≥4.
- **evidence:** Live probe no-shadow bucket **ui-three: 4** (files above). Orthogonal to controller shadow clear `q-mp-174`.
- **acceptance:** Those files clean; ceiling down; mp3d lifecycle tests green.
- **verify:** `npm run lint:ratchet` ; `npx vitest run --project unit-shared tests/unit/mp3d-*-lifecycle.test.ts`
- **screening:** 3D host identifier renames only. **Conflicts:** no-shadow ceiling JSON.

### q-mp-193 · Clear `return-await` in `game-route-mounts.ts` (−1)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** `q-mp-158` ratchet preferred (not yet on tip ceilings)
- **goal:** Autofix the single return-await site in `src/ui/game-route-mounts.ts`; lower return-await ceiling by ≥1 once harness exists (or hard-enable if debt reaches 0 with `q-mp-169`).
- **evidence:** Live eslint: `src/ui/game-route-mounts.ts:47` “Returning an awaited promise is required”. Probe return-await total **7** (idle-warm 3 owned by `q-mp-169`, AI-client 3 HOLD, mounts 1).
- **acceptance:** Mounts clean under the rule; ceiling down; route-mount unit suites green; no AI-client edits.
- **verify:** `npx eslint src/ui/game-route-mounts.ts --rule '@typescript-eslint/return-await: [error, always]'` ; `npx vitest run --project unit-shared tests/unit/burn-1007-game-route-mounts.test.ts`
- **screening:** Shell mount async style only. **Conflicts:** return-await ceiling with `q-mp-158`/`169`.

### q-mp-194 · Clear stricter `eqeqeq` residuals outside `rules.ts` (−11)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** `q-mp-160` ratchet preferred
- **goal:** Replace residual `==`/`!=` with `===`/`!==` in non-rules files; **HOLD** `src/games/fiar/rules.ts`. Lower stricter eqeqeq ceiling by ≥11.
- **evidence:** Live probe eqeqeq(always) **12** — `safe-web-storage.ts` 3, `board-a11y.ts` 2, `game-shell.ts` 2, `kwatro-sinko-board-3d.ts` 2, `storage.ts` 1, `kwatro-sinko/board-ui.ts` 1, HOLD `fiar/rules.ts` 1.
- **acceptance:** Non-HOLD sites clean; ceiling ≤1; storage/a11y/shell unit suites green; no rules logic edits.
- **verify:** `npm run lint:ratchet` ; `npx vitest run --project unit-shared tests/unit/*safe-web-storage* tests/unit/*board-a11y*`
- **screening:** Comparison hygiene outside rules. **Conflicts:** eqeqeq ceiling JSON.

### q-mp-195 · Clear `no-param-reassign` in `fractions/arithmetic.ts` (−11)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** `q-mp-156` ratchet preferred
- **goal:** Eliminate param reassignment in `src/core/fractions/arithmetic.ts` via local copies (behavior-identical); lower no-param-reassign ceiling by ≥11. **Do not** edit AI modules (11 AI hits remain HOLD).
- **evidence:** Live probe: `arithmetic.ts` **11** of 23 total; remaining 11 in AI + 1 `fiar/rules.ts` HOLD. Inventory lists rule at `docs/dev/eslint-off-rules-inventory.md:26`.
- **acceptance:** arithmetic clean under the rule; ceiling down; fraction arithmetic unit suites green; emit-identity preferred for pure refactors.
- **verify:** `npx eslint src/core/fractions/arithmetic.ts --rule 'no-param-reassign: error'` ; `npx vitest run --project unit-shared tests/unit/*fraction*arithmetic* tests/unit/*fractions*`
- **screening:** Core math helper locals only; not scoring/rules path rewrites. **Conflicts:** no-param-reassign ceiling with `q-mp-156`.

### q-mp-196 · UI coverage round 9 — coldest `src/ui/owl` (84.89% lines)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (orthogonal to open #699 `q-mp-167` three/r8)
- **goal:** Characterization tests for `src/ui/owl` (2 files) without asserting AI move choice/timing or player-facing copy strings. Raise directory lines ≥+2 pp or document measured gains.
- **evidence:** Live `docs/dev/coverage-map.md` coldest non-AI-worker row after `src/ui/three`: **`src/ui/owl` 84.89% lines / 67.11% branches** (2 files). Map stamped `2026-10-09T10:38:58Z`.
- **acceptance:** New tests only; coverage-map regenerated or delta table committed; no AI/rules/copy product edits.
- **verify:** `npm run test:unit:coverage` ; `npm run report:coverage-map`
- **screening:** Tests-only coverage; excludes AI workers and rules.

### q-mp-197 · Cut `owl-component` layout-forcing `getBoundingClientRect` reads

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (orthogonal to folded `q-mp-134` par-55 reads; densest remaining shell/owl)
- **goal:** Reduce synchronous layout reads in `src/ui/owl/owl-component.ts` (cache rects / rAF / ResizeObserver) without changing owl timing delays or message copy.
- **evidence:** Live `rg` densest non-three layout reader: `src/ui/owl/owl-component.ts` **6** hits at `:205`, `:388-389`, `:411-413`, `:605`. three/* boards have 4 each (often resize handlers — leave unless obvious dup).
- **acceptance:** Measured read count down; owl unit + e2e chromium still green; no AI/copy edits; optional before/after note under docs/dev/.
- **verify:** `rg 'getBoundingClientRect' src/ui/owl/owl-component.ts` ; `npx vitest run --project unit-shared tests/unit/*owl*` ; `npm run test:e2e:chromium`
- **screening:** Layout thrash only; Hex Hard / AI timing untouched.

### q-mp-198 · Re-anchor `AGENTS.md` + wiki tip pointers to `cursor/mp-tip-post700`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs with visuals
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none
- **goal:** Update stale tip branch names from `cursor/mp-tip-post477` to `cursor/mp-tip-post700` in agent/wiki contributor pointers so new drafts target the live tip.
- **evidence:** Live `AGENTS.md:11` and `:20` still say tip integration branch / draft PR base `cursor/mp-tip-post477`. Tip HEAD is `cursor/mp-tip-post700` @ `3320d897` after #700. `docs/wiki/development.md:119` still cites post477 @ `a023fc36`.
- **acceptance:** Pointers name `cursor/mp-tip-post700`; no workflow permission changes; no `src/` edits.
- **verify:** `rg 'mp-tip-post477' AGENTS.md docs/wiki/development.md` ; `npm run check:dev-docs`
- **screening:** Docs/agent routing only. **Conflicts:** `q-mp-199` may edit the same wiki paragraph — combine or serialize.

### q-mp-199 · Refresh testing-layers + wiki unit counts for tip post700

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs with visuals
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (pairs with `q-mp-198` tip rename)
- **goal:** Remeasure and rewrite live counts in `docs/dev/testing-layers-2026-10-09.md` + the unit-count blurb in `docs/wiki/development.md` for tip `3320d897` (**3131** unit files observed).
- **evidence:** Live `find tests/unit … | wc -l` → **3131**. Docs still stamp post477 @ `a023fc36` with **3114** files / **11988** cases (`docs/dev/testing-layers-2026-10-09.md`, `docs/wiki/development.md:119`).
- **acceptance:** Counts + tip SHA updated; pin policy unchanged; no test or product edits.
- **verify:** `find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l` ; `npx vitest list | wc -l` ; `npm run check:dev-docs`
- **screening:** Docs remeasure only.

### q-mp-200 · Remeasure `bundle-over` after tip #700 (par-55 growth)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs with visuals
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (docs follow-up to folded `q-mp-172`; trim still `q-mp-163`)
- **goal:** Add a dated addendum (or refresh) under `docs/dev/bundle-over-2026-10-09.md` with post-#700 gzip deltas — especially **par-55 +1.18 kB** vs earlier **+97 B** snapshot — plus Mermaid update. **No budget raise.**
- **evidence:** Live tip `npm run size:check` @ `3320d897`: NEW OVER `game-juggle` 8.63>7.99 (+654 B), `game-par-55` 8.93>7.74 (+1.18 kB), `game-remainder-islands` 7.26>6.72 (+559 B); allowlist **0**. Folded `q-mp-172` doc still cites older tip `66b683a5` / smaller par-55 delta.
- **acceptance:** Doc shows new tip SHA + byte table; no `bundle-budgets.json` raise; `check:dev-docs` clean.
- **verify:** `npm run build` ; `npm run size:check` ; `npm run check:dev-docs`
- **screening:** Documentation of budgets only. **Conflicts:** none with trim PR if docs-only.

### q-mp-201 · Engine coverage round 5 — clear remaining `it.todo` from rounds 1–2

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** fold of open `q-mp-143` r4 preferred for round-3 todos
- **goal:** Convert or permanently document remaining `it.todo` arms in `tests/unit/engine-coverage-round-burn-1008.test.ts` (8) and `engine-coverage-round-2-burn-1008.test.ts` (10) that are reachable without editing `rules.ts`/AI; leave geometric impossibilities as annotated todos.
- **evidence:** Live `rg -c 'it\.todo'` → round1 **8**, round2 **10**, round3 **1** (r4-owned). Sample unreachable annotations at round1 `:377-385`.
- **acceptance:** Todo count down where exercisable; no engine/`rules.ts`/AI source edits; unit green.
- **verify:** `rg -c 'it\\.todo' tests/unit/engine-coverage-round*.test.ts` ; `npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts`
- **screening:** Tests-only; hard-rule safe.

### q-mp-202 · Mutation audit UI wave 5 — deferred `dice-ui` / `roller` / owl

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** fold of open `q-mp-144` wave 4 preferred
- **goal:** Tests-only mutation measurement for modules deferred in wave 4 (`src/core/dice/dice-ui.ts`, `roller.ts`) and/or `src/ui/owl/owl-component.ts`; commit baseline/after JSON + markdown under docs/dev/. No `src/` product edits.
- **evidence:** `docs/dev/mutation-audit-ui-4.md` explicitly deferred `dice-ui` **65%** / `roller` **75%**. Owl is coldest non-three UI dir (see `q-mp-196`) and a natural wave-5 target.
- **acceptance:** Wave-5 report committed with scores; surviving mutants either killed by new tests or documented; no AI/rules/copy edits.
- **verify:** `npm run test:unit` ; `npm run check:dev-docs`
- **screening:** Tests + docs only.

### q-mp-203 · Wiki gallery — embed `docs/visuals/2026-10` start/mid shots

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs with visuals
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (orthogonal to folded lifecycle visuals `q-mp-146`)
- **goal:** Add a wiki page (or section under `docs/wiki/games.md`, or a new wiki visuals page) linking real start/mid PNGs from `docs/visuals/2026-10/` for games that currently lack wiki/image embeds (most games have visuals/ but only hex/kings appear under `docs/wiki/images/`).
- **evidence:** Live `docs/visuals/2026-10/` has start+mid for 20 games; `docs/wiki/images/` only hex/kings/landing/stats. Wiki README links architecture screenshots but not the Oct visuals set. Capture at least one fresh screenshot of the wiki page or reuse existing PNGs (real UI).
- **acceptance:** Wiki page with ≥6 game embeds from real visuals; `check:dev-docs` clean; no player-facing rules text changes.
- **verify:** `npm run check:dev-docs` ; `ls docs/visuals/2026-10/*-start.png | wc -l`
- **screening:** Docs/visuals only; uses existing real UI captures.

### q-mp-204 · Demote unused knip types in `pointer-hygiene` + `GameMode`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P4 polish
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (narrow non-AI slice; do not mass-delete game `GamePhase` types without tip-owner review)
- **goal:** Demote or internalize clearly unused exported types `PointerTapPhase` / `PointerTapState` (`src/ui/pointer-hygiene.ts`) and `GameMode` (`src/ui/components/game-shell.ts`) if still unused after tip re-check; lower `unusedTypes` (baseline **91**). Skip AI-worker protocol types and game `GamePhase` bulk.
- **evidence:** Live `npx knip --include types --reporter compact` lists `pointer-hygiene.ts: PointerTapPhase, PointerTapState` and `game-shell.ts: GameMode`. Tip `unusedTypes: 91`.
- **acceptance:** Targeted types demoted or justified kept; knip types count down; shell/pointer unit suites green; baseline updated downward-safe only.
- **verify:** `npm run report:knip` ; `npx vitest run --project unit-shared tests/unit/*pointer* tests/unit/*game-shell*`
- **screening:** Non-AI type export hygiene. **Conflicts:** `knip-baseline.json` with `q-mp-187`.

### q-mp-205 · Clear `no-duplicate-imports` in non-AI `game-controller.ts` (−31)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests/ratchets/CI
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (ratchet already on tip @ ceiling **122** via `q-mp-127`)
- **goal:** Merge split imports in `src/games/*/game-controller.ts` only (exclude `rules.ts`/`ai.ts`); lower duplicate-imports ceiling by ≥31.
- **evidence:** Live probe bucket **game-controller: 31** of 122 (many files show 2 each, e.g. `calla`, `contig-60`, `fiar`, `frac-fact`, …).
- **acceptance:** Controllers clean under the rule; ceiling down; no behavior change; unit smoke green.
- **verify:** `npm run lint:ratchet` ; `npm run test:unit`
- **screening:** Import merge only. **Conflicts:** duplicate-imports ceiling JSON with any open leftover `q-mp-127` drafts.

### q-mp-206 · Remove demo `console.log` + document intentional `no-console` sites

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P4 polish
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** `q-mp-173` ratchet preferred
- **goal:** Delete or gate the demo `console.log` in `src/demos/expression-demo.ts:510`; add a short docs note listing intentional `console.error` soft-fail sites (`main`, storage, register, error-boundary) so future workers do not strip them when lowering the no-console ceiling.
- **evidence:** Live probe no-console **24** — includes `src/demos/expression-demo.ts:510` `console.log(\`Expression complete…\`)`. Intentional error logs dominate `src/main.ts` (10) and `storage.ts` (7).
- **acceptance:** Demo log gone or `import.meta.env.DEV`-gated; doc lists keep-sites; ceiling down by ≥1 once ratchet exists; demo unit/e2e unaffected.
- **verify:** `rg 'console\\.log' src/demos/expression-demo.ts` ; `npm run lint:ratchet` ; `npx vitest run --project unit-shared tests/unit/*expression*`
- **screening:** Demo noise only; preserves soft-fail `console.error` paths. **Conflicts:** no-console ceiling with `q-mp-173`.

### q-mp-207 · Wire `check:emit-identity` npm script + list knip `esbuild` unlisted

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs with visuals
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none
- **goal:** Add a `package.json` script alias (e.g. `check:emit-identity`) pointing at `node scripts/check-emit-identity.mjs`, document it in `docs/dev/ai-typeonly-option.md` / DEPENDENCIES, and either add `esbuild` to the knip script allowlist **or** document why the unlisted hit is intentional (alongside playwright probe scripts). No CI permission widening; no apt; no network in tests.
- **evidence:** Live knip unlisted ×**3**: `scripts/check-emit-identity.mjs: esbuild`, `scripts/probe-offline-resilience*.mjs: playwright`. AGENTS.md already tells agents to run `node scripts/check-emit-identity.mjs` with **no** npm alias. `package.json` has no `check:emit-identity` script today.
- **acceptance:** npm script works; docs mention it; knip unlisted documented or cleared without enabling enforce; `npm run check:workflows` still OK (`permissions: contents: read`, `persist-credentials: false`).
- **verify:** `npm run check:emit-identity -- --help` (or script equivalent) ; `npm run report:knip` ; `npm run check:workflows`
- **screening:** DevX/docs only; does not touch AI emit surfaces. **Conflicts:** knip config / baseline with `q-mp-187`/`204`.

### q-mp-208 · Clear `no-promise-executor-return` leftover in `owl-system.ts` (−1)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 bug
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none (narrows unfinished residue of `q-mp-153` after kings site cleared on tip)
- **goal:** Rewrite `owl-system` delay helper so the Promise executor does not return the timer id (block body / void). Delay duration unchanged.
- **evidence:** Live probe `no-promise-executor-return` total **1** at `src/core/owl/owl-system.ts:285` (`return new Promise((resolve) => setTimeout(resolve, ms))`). Kings controller site from `q-mp-153` is already clean on tip.
- **acceptance:** Rule clean on that file; owl unit suites green; delay semantics unchanged; no AI/copy edits.
- **verify:** `npx eslint src/core/owl/owl-system.ts --rule 'no-promise-executor-return: error'` ; `npx vitest run --project unit-shared tests/unit/*owl*`
- **screening:** Promise executor hygiene in owl delay helper only. If open `q-mp-153` still claims this exact site, leave #689/#153 open and comment `contained` rather than closing.

### q-mp-209 · Docs: tip post700 open-draft triage snapshot (JSON + md)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs with visuals
- **role:** worker
- **base:** `cursor/mp-tip-post700`
- **depends-on:** none
- **goal:** Produce a fresh open-draft triage markdown under docs/dev/ (suggested basename open-draft-triage-post700-2026-10-09, plus optional JSON) listing open drafts by base tip (`post477` / `post598` / `post700`), fold-vs-leave recommendations, and contained/superseded notes — report-only, do not close PRs.
- **evidence:** Live `gh pr list --state open` still shows large stacks on `cursor/mp-tip-post477` and `cursor/mp-tip-post598` after #700 land, plus new post700 drafts #703/#705. Prior triage docs (`docs/dev/open-draft-triage-2026-10-08.md`, `docs/dev/open-draft-triage-v2.md`) predate post700.
- **acceptance:** Snapshot committed with PR numbers + bases; explicitly forbids closing PRs (comment `superseded`/`contained` only); `check:dev-docs` clean.
- **verify:** `gh pr list --state open --limit 200` ; `npm run check:dev-docs`
- **screening:** Coordination docs only; no product edits.

---

## Summary

New ids in this doc: **`q-mp-176` … `q-mp-209`** (34 tasks).  
Do **not** reuse `q-mp-001`–`q-mp-175`. Tip-owner refill should point workers at these after folding this doc into `cursor/mp-tip-post700`.

**Next action: fold into tip by the tip owner.**
