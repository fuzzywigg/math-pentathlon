# burn-1008 compliance review 8 (independent pass)

**Task id:** `burn-1008-mp-compliance-review-8`  
**Reviewer base (tip):** `cursor/integration-fold-wave5-tip-4af0` @ `dff8c013`  
**Tip owner PR:** [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477)  
**Prior passes (not re-audited here):** review-1…5 · [#572](https://github.com/fuzzywigg/math-pentathlon/pull/572) review-6 · [#580](https://github.com/fuzzywigg/math-pentathlon/pull/580) review-7  
**Scope (live open tip drafts):** `#576` `#577` `#578` `#579`  
**Method:** `gh pr list` / three-dot `git diff tip...PR` + unique delta after each stack-parent merge / hard-rule greps / tip tree cross-check (Hex Hard 450, Stars & Bars history uncapped) / emit-identity for #576 product `src/` / post-restore pin proof for inherited + new phase-message locks / per-branch re-verify (`npm run lint`, `npx tsc --noEmit`, `npm run test:unit`)  
**This deliverable:** report only — no edits, comments, labels, or pushes to other PR branches.

## Tip state at review close

| Item | SHA / status |
| --- | --- |
| Tip HEAD | `dff8c013` — `docs(dev): sync post-restore audit tip SHA to HEAD` |
| Tip vs alpha AI/copy | Frozen GO for Friday land (Queens/Kings/Contig AI, delays, tutorials, status text restored) |
| Hex Hard | `src/games/hex/ai.ts:21` `hard: 450,` (present on tip and all four PR heads) |
| Stars & Bars history | uncapped `moveHistory` reverse loop in `board-ui.ts` (no `slice(-N)` / no cap) on tip and all four PR heads |
| Already folded (context) | `#557` (allowed) · `#562` · `#563` · `#565` · `#566` · `#567` · `#568` · `#572` |
| Stack parents (still open) | `#573` (Batch 7) · `#571` (UI r3) · `#574` (engine r2) · `#575` (triage v2) |

## Hard rules checked

| Rule | Signal |
| --- | --- |
| AI search / scoring / difficulty / think-time | `ai/` logic, deadlines, evaluate/search |
| Player-facing copy / tutorial / rules-text | status strings, phase messages, How-to, badge text |
| Stars & Bars history cap | `moveHistory` trim / cap |
| Hex Hard 450ms assert | `AI_PLAY_DEADLINE_MS.hard` / `toBe(450)` |
| package.json / lockfile / CI | dependency or workflow edits |
| Workflow least-privilege | `contents: read`, `persist-credentials: false` |
| CI install surface | no `apt` / no pip allowlist widen |
| Forbidden topics | openclaw / Merom / Sullivan / meromhouse / pappas-infrastructure |
| Type-only emit identity | `scripts/check-emit-identity.mjs` on every touched product `src/` file |
| Tests locking restore surfaces | player-facing text / AI move choice / AI timing asserts |

**Global scan (PRs #576–#579, three-dot vs tip + unique stack deltas):** no `.github/workflows` edits; no `package.json` / lockfile edits; no Hex Hard mutation; no Stars & Bars history cap; no openclaw/Merom/pappas paths; no apt/pip widening. All four heads keep `hard: 450`.

## Overlap check (open drafts)

No open draft already delivers compliance review 8. Adjacent (not re-reviewed):

- **#580** — review 7 of `#571/#573/#574/#575` (calla `getPhaseMessage` VIOLATION on #574; `Coming Soon` note on #571)
- **#573 / #571 / #574 / #575** — stack parents for this wave; fold order below assumes they land before their children
- **#560** — AI type-only OWNER OPTION (Batch 8 correctly leaves 216 AI residual)

## Summary table

| PR | Title (short) | Stack parent | Verdict |
| ---: | --- | ---: | --- |
| [#576](https://github.com/fuzzywigg/math-pentathlon/pull/576) | Type ratchet Batch 8 helper-test floor | #573 | **COMPLIANT-WITH-NOTES** |
| [#577](https://github.com/fuzzywigg/math-pentathlon/pull/577) | UI coverage round 4 | #571 | **COMPLIANT-WITH-NOTES** |
| [#578](https://github.com/fuzzywigg/math-pentathlon/pull/578) | Engine coverage round 3 | #574 | **VIOLATION** |
| [#579](https://github.com/fuzzywigg/math-pentathlon/pull/579) | Mutation audit non-engine UI | tip (direct) | **COMPLIANT** |

**Counts:** COMPLIANT **1** · COMPLIANT-WITH-NOTES **2** · VIOLATION **1**

---

## Per-PR findings

### #576 — fix(types): Phase-2 type-ratchet Batch 8 helper-test floor

**Verdict:** COMPLIANT-WITH-NOTES

**Branch:** `cursor/type-ratchet-batch-8-d17f` @ `82bfaad2`  
**Stack parent:** #573 `cursor/type-ratchet-batch-7-76e5` @ `caad3eb7` (merged at `7e55b6de`)  
**Merge-base tip drift:** tip ahead of PR fork by ~18 commits (docs/AI-restore); three-dot surface below is what would land on tip if #573 were already folded.

#### Files vs tip (three-dot) — every hunk classified

| Path | Origin | Classification |
| --- | --- | --- |
| `docs/dev/type-ratchet-batch-7.md` | via #573 | **OK** — docs |
| `docs/dev/type-ratchet-batch-8.md` | Batch 8 | **OK** — docs |
| `docs/dev/type-ratchet-phase2-baseline.json` | Batch 8 | **OK** — ceiling stays **216**; `tipSha` refresh on fold |
| `docs/dev/type-ratchet-phase2-export.mjs` | Batch 8 | **OK** — ratchet tooling IN_SCOPE expand |
| `docs/dev/type-ratchet-phase2-plan.md` | Batch 8 | **OK** — docs note |
| `scripts/check-build.d.mts` | Batch 8 | **OK** — ambient types only |
| `scripts/check-type-ratchet.mjs` | Batch 8 | **OK** — ratchet scope |
| `scripts/lib/pwa-manifest-contract.d.mts` | Batch 8 | **OK** — ambient types only |
| `scripts/report-licenses.d.mts` | Batch 8 | **OK** — ambient types only |
| `src/core/ai-worker/client.ts` | via #573 | **OK** — type-only `\| undefined` on optionals; **emit-identical** |
| `src/core/ai-worker/protocol.ts` | via #573 | **OK** — type-only `\| undefined`; **emit-identical** |
| `tests/unit/burn-wave14-types-helpers.test.ts` | via #573 | **OK** — NUI `!` only |
| `tests/unit/burn-wave35-fab-a-diffy-format-helpers.test.ts` | via #573 | **OK** — NUI `!` only |
| `tests/unit/burn-wave35-ramrod-box-format-helpers.test.ts` | via #573 | **OK** — NUI `!` only |
| `tests/unit/burn-wave41-fab-pass-winner-helpers.test.ts` | via #573 | **OK** — NUI `!` only |
| `tests/unit/check-emit-identity.test.ts` | via #573 | **OK** — checker unit coverage |
| `tests/unit/overnight-dice-selector-reset-helpers.test.ts` | via #573 | **OK** — NUI `!` only |
| `tests/unit/report-licenses-helpers.test.ts` | Batch 8 | **OK** — NUI `!` only (3 sites) |
| `tests/unit/shims/node-minimal.d.ts` | Batch 8 | **OK** — ambient shim (no `@types/node`) |
| `tsconfig.ratchet.json` | Batch 8 | **OK** — include helper-test + shim surface |
| `vitest.config.ts` | via #573 | **OK** — route `check-emit-identity.test.ts` to node project |

#### Unique vs stack parent (#573 merge `7e55b6de`→`82bfaad2`)

11 files / +345/−11 — **no product `src/**/*.ts`**. Soft-locks clean `pwa/bootstrap` + `idle-warm` via ratchet include only (no source edits).

#### Emit-identity proof (required)

```text
node scripts/check-emit-identity.mjs \
  --base origin/cursor/integration-fold-wave5-tip-4af0 \
  --head origin/cursor/type-ratchet-batch-8-d17f \
  src/core/ai-worker/client.ts src/core/ai-worker/protocol.ts
# OK  src/core/ai-worker/client.ts
# OK  src/core/ai-worker/protocol.ts
# All 2 file(s) emit-identical.
```

Batch-8 unique product `src/` touched files: **none** (vacuously emit-identical). Non-identical list: **none**.

#### Hard-rule checks

| Check | Result |
| --- | --- |
| `ai/` behavior / timing | **pass** — only type widening on worker optionals (erased) |
| Player-facing copy asserts | **pass** — none |
| Stars & Bars history / Hex 450 | **pass** — untouched |
| package / lock / CI / workflows | **pass** — none |
| Forbidden topics | **pass** |

#### Notes (not violations)

1. Fold after **#573**; refresh `tipSha` in `type-ratchet-phase2-baseline.json` to post-fold tip.
2. Stacked three-dot surface still carries #573’s `ai-worker` type edits — already COMPLIANT-WITH-NOTES in review 7; re-proven emit-identical here.
3. Product-safe Phase-2 pool exhausted at AI residual **216** → #560.

#### Re-verify (this pass, PR head worktree)

| Command | Result |
| --- | --- |
| `npm run lint` | exit **0** |
| `npx tsc --noEmit` | exit **0** |
| `npm run test:unit` | **3107** files / **11780** passed / **21** skipped / **7** todo (exit 0; ~538s) |

Artifacts: `/opt/cursor/artifacts/burn-1008-review8/576-*.log`, `emit-576.log`

---

### #577 — test(ui): non-engine UI coverage round 4

**Verdict:** COMPLIANT-WITH-NOTES

**Branch:** `cursor/burn-1008-mp-ui-coverage-round-4-c3d9` @ `1de745e9`  
**Stack parent:** #571 `cursor/burn-1008-mp-ui-coverage-round-3-36db` @ `baaaa1cc` (merged at `cbc3ef5a`)

#### Files vs tip (three-dot) — every hunk classified

| Path | Origin | Classification |
| --- | --- | --- |
| `docs/dev/ui-coverage-round-2.md` | via #566 stack in #571 | **OK** — docs (already on stack) |
| `docs/dev/ui-coverage-round-3.md` | via #571 | **OK** — docs |
| `docs/dev/ui-coverage-round-4.md` | Round 4 | **OK** — docs |
| `tests/unit/burn-1007-main-shell-routes.test.ts` | via #571 stack | **OK** — prior round coverage |
| `tests/unit/burn-1008-ui-cov-r2-*.test.ts` (4) | via #566/#571 | **OK** — prior rounds |
| `tests/unit/burn-1008-ui-cov-r3-*.test.ts` (6) | via #571 | **OK** / **FLAG** see below |
| `tests/unit/burn-1008-ui-cov-r4-controllers-shell.test.ts` | Round 4 | **OK** — DOM/controller characterization |
| `tests/unit/burn-1008-ui-cov-r4-fiar-layout-board.test.ts` | Round 4 | **OK** |
| `tests/unit/burn-1008-ui-cov-r4-juggle-board-controller.test.ts` | Round 4 | **OK** / soft note |
| `tests/unit/burn-1008-ui-cov-r4-offline-motion-demos.test.ts` | Round 4 | **OK** |
| `tests/unit/burn-1008-ui-cov-r4-owl-poly-helpers.test.ts` | Round 4 | **OK** — asserts message **ids**/null select, not copy body |
| `vitest.config.ts` | via #571 | **OK** — isolate r3 game-selector mock |

Zero `src/` / package / workflow / `ai/` edits.

#### Unique vs stack parent (#571 merge `cbc3ef5a`→`1de745e9`)

6 files / +1211 — tests + `ui-coverage-round-4.md` only.

#### Player-facing / AI pins

| Location | Finding | Action |
| --- | --- | --- |
| Inherited `burn-1008-ui-cov-r3-game-selector.test.ts:57` `expect(badge?.textContent).toBe('Coming Soon')` | **FLAG** (same as review 7 on #571) | Prefer drop exact string before fold; keep badge presence / tabindex / accordion |
| r4 controllers: `/clear/i`, `/pass/i` on `textContent` | Locator only (no `expect(...).toBe('Clear…')`) | **OK** |
| r4 juggle/controllers: `.status-ai-thinking` truthy | CSS chrome class, not copy string / not timing | **OK** (soft note) |
| r4 hex shell: `setAIDifficulty('easy')` + `advanceTimersByTimeAsync(400)` | Setup / fake-timer drain; does **not** assert AI move choice or Hard deadline | **OK** |
| r4 owl: `msg?.id === 'r4-unknown-condition'` | Id pin, not player-facing body | **OK** |
| r4 contig `formatEndBanner` | `it.skip` unreachable default | **OK** |

No Hex 450 / Stars & Bars history / package / workflow hits in unique or three-dot surface.

#### Notes (not violations)

1. Fold after **#571**; prefer parent drop of `Coming Soon` exact assert (review 7) so this stack does not re-introduce it.
2. Round-4 unique surface does **not** add new player-facing copy expects or AI move/timing asserts.

#### Re-verify (this pass, PR head worktree)

| Command | Result |
| --- | --- |
| `npm run lint` | exit **0** |
| `npx tsc --noEmit` | exit **0** |
| `npm run test:unit` | **3121** files / **11898** passed / **24** skipped / **7** todo (exit 0; ~524s) |

Artifacts: `/opt/cursor/artifacts/burn-1008-review8/577-*.log`

---

### #578 — test(engines): coverage round 3 — next lowest non-AI rules

**Verdict:** VIOLATION

**Branch:** `cursor/engine-coverage-round-3-0f02` @ `54d670d7`  
**Stack parent:** #574 `cursor/engine-coverage-round-2-f0ea` @ `8a607e3d` (merged at `95d9422d`)

#### Files vs tip (three-dot) — every hunk classified

| Path | Origin | Classification |
| --- | --- | --- |
| `docs/dev/engine-coverage-round-2.md` | via #574 | **OK** — docs |
| `docs/dev/engine-coverage-round-3.md` | Round 3 | **OK** — docs |
| `tests/unit/engine-coverage-round-2-burn-1008.test.ts` | via #574 | **VIOLATION** — calla `getPhaseMessage` pin (review 7) |
| `tests/unit/engine-coverage-round-3-burn-1008.test.ts` | Round 3 | **VIOLATION** — kings `getCurrentPhaseMessage` copy pins (+ notes) |

Zero `src/` / package / workflow / `ai/` edits. Hex Hard 450 untouched. Stars & Bars history uncapped.

#### Unique vs stack parent (#574 merge `95d9422d`→`54d670d7`)

2 files / +1074 — round-3 suite + doc.

#### VIOLATION hunks (must drop before fold)

**1. Inherited from #574 (same as review 7) — proven red on restored tip**

`tests/unit/engine-coverage-round-2-burn-1008.test.ts` **452–462**:

```ts
it('getPhaseMessage returns empty string when gameOver and winner is null', () => {
  const weird: CallaGameState = {
    ...createCalla(),
    phase: 'gameOver',
    winner: null,
  };
  expect(callaPhase(weird)).toBe('');  // LOCKS player-facing status; FAILS on tip
  expect(callaOver(weird)).toBe(true);
});
```

**Post-restore proof** (tip `dff8c013` + this test file):

```text
npx vitest run tests/unit/engine-coverage-round-2-burn-1008.test.ts \
  -t 'getPhaseMessage returns empty'
# FAIL — expected 'Red wins!' to be ''
```

Tip `getPhaseMessage` (`src/games/calla/rules.ts:253–270`): `gameOver` + non-`tie` winner uses `"${Blue|Red} wins!"`; `null` falls through to `'Red'`.

**Keep** other calla its in round-2 (legal pits / settleNoValidMoves / makeMove phase union).

**2. New in round 3 — kings phase-message copy locks**

`tests/unit/engine-coverage-round-3-burn-1008.test.ts` **278–307** (`it('phase messages + supply + king lookup + reset/endTurn edges')`):

| Lines | Assert | Why drop |
| ---: | --- | --- |
| 286 | `expect(getCurrentPhaseMessage(selected)).toMatch(/green square/)` | Locks player-facing status |
| 293 | `…toMatch(/Place a Quadraphage/)` | Locks player-facing status |
| 300 | `…toMatch(/Player 1 wins/)` | Locks player-facing status |
| 307 | `…toMatch(/Tie/)` | Locks player-facing status |

Tip `getCurrentPhaseMessage` (`src/games/kings-quadraphages/game-state.ts:119–142`) returns those exact status strings. Suite currently **passes** on tip (copy still matches) but **violates** the hard rule against tests that assert player-facing text.

**Drop** the four `getCurrentPhaseMessage` string/regex expects (or the whole phase-message half of that `it`). **Keep** supply / king position / serialize / `endTurn` characterization in the same describe.

**Optional related drop (FLAG, not required for green fold):**

| Lines | Assert | Note |
| ---: | --- | --- |
| 268–275 | `getCurrentPhaseMessage(forged)).toBe('notAPhase')` | Forged `TurnPhase` default-arm echo — not product copy, but still a phase-message API pin; prefer drop with the block above |
| 348 / 358 | `getSaveInfo(…).currentPlayer` → `'Player 1'` / `'Player 2'` | Save-metadata display labels — prefer structural asserts (`isGameOver`, seat enums) |
| 156 / 826 | `getPhaseMessage as callaPhase` + `typeof callaPhase(state) === 'string'` | Does **not** lock copy body; OK to keep, or drop import if unused after cleanup |

#### Other hard-rule checks

| Check | Result |
| --- | --- |
| AI move choice / timing asserts | **pass** — none in unique round-3 |
| Stars & Bars history / Hex 450 | **pass** |
| package / lock / CI / workflows | **pass** |
| Forbidden topics | **pass** |
| Engine source edits | **pass** — tests + docs only |

#### Re-verify (this pass, PR head worktree)

| Command | Result |
| --- | --- |
| `npm run lint` | exit **0** |
| `npx tsc --noEmit` | exit **0** |
| `npm run test:unit` | **3108** files / **11853** passed / **21** skipped / **22** todo (exit 0; ~490s) |

> Suite is green on the PR’s older fork (pre-restore calla). **Not fold-safe** onto tip until VIOLATION hunks are dropped. Inherited calla pin is already red against tip `dff8c013`.

Artifacts: `/opt/cursor/artifacts/burn-1008-review8/578-*.log`, `proof-calla-on-tip.log`, `proof-kings-on-tip.log`

---

### #579 — test(ui): mutation audit — raise non-engine UI kill rates

**Verdict:** COMPLIANT

**Branch:** `cursor/burn-1008-mp-mutation-audit-ui-cec5` @ `04726069`  
**Stack parent:** tip direct (no merge of #571/#577/#576)

#### Files vs tip (three-dot) — every hunk classified

| Path | Classification |
| --- | --- |
| `docs/dev/mutation-audit-ui.md` | **OK** — docs (scores + survivors) |
| `tests/unit/mutation-ui-coord-map.test.ts` | **OK** — canvas DPR / coord helpers |
| `tests/unit/mutation-ui-dom-security.test.ts` | **OK** — sanitize/escape; short fixture strings (`ab`/`hi`/`ok`), not player copy |
| `tests/unit/mutation-ui-feature-flags.test.ts` | **OK** |
| `tests/unit/mutation-ui-game-error-boundary.test.ts` | **OK** — one `it.skip` for equivalent active/didCatch survivor |
| `tests/unit/mutation-ui-offline.test.ts` | **OK** — flag/attr behavior |
| `tests/unit/mutation-ui-pwa-register.test.ts` | **OK** |
| `tests/unit/mutation-ui-reduced-motion.test.ts` | **OK** |
| `tests/unit/mutation-ui-router.test.ts` | **OK** — path/hash routing |
| `tests/unit/mutation-ui-safe-web-storage.test.ts` | **OK** |
| `tests/unit/mutation-ui-settings-flags.test.ts` | **OK** — boolean/enum shape, not copy |
| `tests/unit/mutation-ui-storage-migrate.test.ts` | **OK** |
| `tests/unit/mutation-ui-storage-sanitize.test.ts` | **OK** — length/clamp; `owl*` field shapes |
| `tests/unit/mutation-ui-storage.test.ts` | **OK** |
| `tests/unit/mutation-ui-timeout-handle.test.ts` | **OK** |
| `tests/unit/mutation-ui-url-flags.test.ts` | **OK** |

Zero `src/` / package / lockfile / workflow / `ai/` edits. Stryker was ephemeral via `npx` (not adopted into package.json) — matches PR claim.

#### Player-facing / AI pins

**None.** No `getPhaseMessage` / status-copy / tutorial / `Coming Soon` / Hex 450 / AI move-choice asserts in the 15 new suites.

#### Hard-rule checks

| Check | Result |
| --- | --- |
| AI / copy / history cap / Hex 450 | **pass** |
| package / lock / CI | **pass** |
| Forbidden topics | **pass** |
| Overlap with #571/#577/#576 open files | **pass** — new `mutation-ui-*.test.ts` only |

#### Re-verify (this pass, PR head worktree)

| Command | Result |
| --- | --- |
| `npm run lint` | exit **0** |
| `npx tsc --noEmit` | exit **0** |
| `npm run test:unit` | **3125** files / **11925** passed / **18** skipped / **7** todo (exit 0; ~471s) |

Artifacts: `/opt/cursor/artifacts/burn-1008-review8/579-*.log`

---

## Recommended post-Friday fold order

Exact order requested for this wave (after tip restore GO):

| Step | PR | Gate |
| ---: | --- | --- |
| 1 | **#573** | Batch 7; refresh baseline `tipSha` on fold |
| 2 | **#571** | Prefer drop `Coming Soon` exact assert (`…r3-game-selector.test.ts:57`) |
| 3 | **#577** | After #571; r4-only unique surface is clean |
| 4 | **#574** | **Must drop** calla `getPhaseMessage` it (452–462) first |
| 5 | **#575** | Docs triage (optional tip-SHA refresh) |
| 6 | **#576** | After #573; emit-identical already proven; refresh Batch-8 `tipSha` |
| 7 | **#578** | After #574; **must drop** inherited calla pin **and** kings `getCurrentPhaseMessage` copy expects (286/293/300/307) before fold |
| 8 | **#579** | After UI coverage stack preferred (avoids test-file thrash); COMPLIANT as-is |

**VIOLATION count this pass:** **1** (#578). #576/#577 notes are fold hygiene only.

---

## Verification matrix (this pass)

Serial/parallel worktrees at each PR head; commands exactly as specified:

| PR | `npm run lint` | `npx tsc --noEmit` | `npm run test:unit` |
| ---: | --- | --- | --- |
| #576 | 0 | 0 | 3107 files / **11780** passed / 21 skipped / 7 todo |
| #577 | 0 | 0 | 3121 files / **11898** passed / 24 skipped / 7 todo |
| #578 | 0 | 0 | 3108 files / **11853** passed / 21 skipped / 22 todo |
| #579 | 0 | 0 | 3125 files / **11925** passed / 18 skipped / 7 todo |

Additional proofs:

```text
# #576 emit-identity vs tip dff8c013
node scripts/check-emit-identity.mjs --base origin/cursor/integration-fold-wave5-tip-4af0 \
  --head origin/cursor/type-ratchet-batch-8-d17f \
  src/core/ai-worker/client.ts src/core/ai-worker/protocol.ts
# → All 2 file(s) emit-identical.

# #578 inherited calla pin vs restored tip
# (tip tree + round-2 test from #578)
npx vitest run tests/unit/engine-coverage-round-2-burn-1008.test.ts \
  -t 'getPhaseMessage returns empty'
# → FAIL expected 'Red wins!' to be ''

rg -n 'hard: 450' src/games/hex/ai.ts   # on tip + each PR head → line 21
```

---

## Acceptance checklist

- [x] Diffed #576/#577/#578/#579 vs stack parents and tip; every hunk classified
- [x] Hard rules checked (AI/copy/history/Hex450/package-lock-CI/workflows/forbidden topics)
- [x] #576 emit-identical proven for every touched product file (2/2; Batch-8 unique product src: none)
- [x] Flagged tests asserting player-facing text / AI move choice/timing; #578 carries review-7 calla pin **plus** new kings phase-message pins
- [x] Verdicts + fold order `#573 → #571 → #577 → #574 → #575 → #576 → #578 → #579`
- [x] Re-ran `npm run lint`, `npx tsc --noEmit`, `npm run test:unit` on each PR head with counts
- [x] Doc only; draft PR against tip; no edits/comments/labels on other PRs
- [x] Does not repeat reviews #6 / #7 (scope is #576–#579 only; #574 inherited pin re-proven because #578 still carries it)
