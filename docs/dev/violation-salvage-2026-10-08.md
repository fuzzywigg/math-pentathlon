# Violation salvage — 2026-10-08

**Task id:** `burn-1008-mp-violation-salvage`  
**Tip base:** `cursor/integration-fold-wave5-tip-4af0`  
**Tip SHA checked:** `6b5a22701e37b0e8000761189d457b3ce90ae8cf`  
**Source triage:** #545 category (e) hard-rule violations (9 drafts)  
**This PR:** salvage-only draft — zero AI/scoring/copy/rules-text behavior changes.

## Method

1. For each (e) draft other than #535/#537, diff `base...head` hunk-by-hunk against live tip.
2. Drop any hunk that touches `ai/` search·scoring·difficulty·timing, player-facing copy, rules-text, scoring/legal-move outcomes, Stars & Bars history cap, or the Hex Hard 450ms assert.
3. Skip hunks already present on tip or already covered by another open tip draft (notably #526 calibration helpers, #540/#546 replacements, #533 pointer work on remainder hit targets).
4. Any salvaged test pins **current tip** behavior (rewrite or drop asserts that expected retuned AI / fixed copy).

## Per-PR salvage table

| PR | Title | Hunks salvaged | Hunks dropped (rule cited only) | Recommendation |
| ---: | --- | --- | --- | --- |
| #419 | fix(remainder-islands): deep playtest stalls, touch UX, AI pacing | **board-ui:** always-on `.island-r-hint` R= overlays for valid islands (touch, no hover); hide hint under selected `.island-r-preview`; coarse/touch CSS floors (`touch-action`, 44/48px, responsive board). **game-controller:** lazy division-preview mount (only when `selectedIsland`) — no instruction copy change. **tests:** `remainder-islands-touch-hints-salvage.test.ts` pins tip hints/CSS and tip AI delays remain 800ms. | `ai.ts` remainder preference / sort — Hard rule: No AI behavior changes (search, scoring, difficulty, timing). `rules.ts` skip→`gameOver` on last-turn empty valids — Hard rule: No AI/scoring / legal-move outcome changes; also escalate: game mechanic / scoring. AI timer retune 450/550 + `getAIThinkDelays` — Hard rule: No AI behavior changes (… timing). Instruction copy “Tap a highlighted island…” — Hard rule: No player-facing copy or rules-text changes. Playtest screenshots / e2e asserting retuned pacing — same AI timing rule. Wave68 timer asserts rewritten to 450/550 — dropped (tip stays 800). | **close** original (#419) |
| #428 | fix(juggle): deep playtest — jam Pass, fit-aware UX, AI seat polish | *Nothing salvageable.* Pass UX / grey-out / tests all depend on new `passTurn` / `shouldOfferPass` rules paths or AI jam handling. | `rules.ts` `passTurn` / `shouldOfferPass` / `selectDie` auto-select fit gate / `clearSelectedShape` — Hard rule: No AI/scoring / legal-move outcome changes; escalate: game mechanic. `ai.ts` jam pass + die skip — Hard rule: No AI behavior changes. Pass Turn button copy + fit aria strings — Hard rule: No player-facing copy or rules-text changes. Deep playtest script/screenshots/tests asserting Pass — same. | **close** original (#428) |
| #429 | fix(hex-a-gone): deep playtest polish — AI budget, touch, HvA UX | **board-ui:** `type=button`; bank buttons `disabled` + `aria-disabled` when not selectable / AI seat; Confirm gated on `interactive` + `scrollIntoView`. **game-play.css:** disabled bank cursor; coarse sticky confirm strip. **tests:** `hex-a-gone-bank-a11y-salvage.test.ts` pins tip a11y and tip `HEX_SIZE=30` / no Easy lookahead cap. | `ai.ts` `maxSelectionLookahead` selection cap — Hard rule: No AI behavior changes (search, scoring, difficulty, timing). `AI_THINKING_DELAY` 800→350 (already on tip separately) + tests asserting Easy=1 Hard≤3 — same AI rule. HvA “You win!” / phase Blue→Your copy — Hard rule: No player-facing copy or rules-text changes. `HEX_SIZE` 30→32 + board width CSS retune — left on tip (cells already ≥44px at tip scale; avoid visual churn / baseline risk). Deep playtest screenshots/e2e — copy/AI asserts. | **close** original (#429) |
| #468 | test(ai): headless AI calibration matrices + Hard≥Easy guards | *Nothing new to salvage.* Tip already contains calibration helpers + `ai-calibration-difficulty-order.test.ts` with `KNOWN_TIP_INVERSIONS` for fiar/pent-em-in/fab-a-diffy (folded earlier without AI retunes). | `src/games/fiar/ai.ts`, `kwatro-sinko/ai.ts`, `pent-em-in/ai.ts` teachingBlunder / depth retunes — Hard rule: No AI behavior changes (search, scoring, difficulty, timing). Docs/scripts that document retuned matrices as landed — same. | **close** original (#468) |
| #487 | docs(copy): kid-friendly player text polish (grades 3–5) | *Nothing salvageable.* Entire PR is player-facing string rewrites + tests updated to match new strings. | Owl messages, registry blurbs, status/win banners, shell/selector copy across games — Hard rule: No player-facing copy or rules-text changes. Matching unit expects — same. | **close** original (#487) |
| #488 | fix(ai): tip AI difficulty recheck — FIAR/Pent Hard≥Easy | *Nothing new to salvage.* Calibration harness already on tip; Hex Hard deadline assert already `450` on tip (`tests/unit/hex-deep-playability.test.ts`). | `fiar/ai.ts`, `pent-em-in/ai.ts` Hard≥Easy retunes — Hard rule: No AI behavior changes (search, scoring, difficulty, timing). Do not touch Hex Hard 450ms assert (already correct on tip). | **close** original (#488) |
| #492 | docs(rules): audit help/tutorial text vs engine | **docs:** this salvage report records the audit findings without applying wording fixes. **tests:** `rules-text-audit-characterization-salvage.test.ts` pins engine facts (`DEFAULT_MAX_PROBLEMS=10`, Prime Gold ≤49 / no 5!, Stars empty-board 25) and characterizes tip’s **current** mismatched tutorial strings (Frac Fact “10 problems each”, Prime Gold `5!=120`, Stars omits first-card-anywhere, Fab-a-Diffy “your pool”). | All `tutorial.ts` edits, `game-registry.ts` / `main.ts` help HTML, `docs/wiki/games.md` — Hard rule: No player-facing copy or rules-text changes. Tests that required fixed wording (“10 problems total”, “shared pool”, etc.) — rewritten to pin tip or dropped. | **close** original (#492) |
| #535 | fix(math): arithmetic exactness audit | *Out of salvage scope (already replaced).* No hunks carried here. | Scoring-adjacent `isPrime` / `negate` / `isWholeNumber` helper changes — Hard rule: No AI/scoring / legal-move outcome changes. Compliant replacement: **#540** (characterization-only). | **close** original (#535); fold **#540** instead |
| #537 | fix(types): Phase-2 type-ratchet Batch 2 — rules-heavy | *Out of salvage scope (already replaced).* No hunks carried here. | `rules.ts` apply/legality `??` fallbacks / silent no-ops — Hard rule: No legal-move generation / outcome / scoring path changes without owner exemption. Compliant replacement: **#546** (`!` assertions only). | **close** original (#537); fold **#546** instead |

## Files changed in this salvage PR

| Path | Origin |
| --- | --- |
| `src/games/remainder-islands/board-ui.ts` | #419 (hints + touch CSS) |
| `src/games/remainder-islands/game-controller.ts` | #419 (lazy preview only) |
| `src/games/hex-a-gone/board-ui.ts` | #429 (bank disabled / Confirm gate) |
| `src/ui/styles/game-play.css` | #429 (disabled + sticky confirm CSS) |
| `tests/unit/remainder-islands-touch-hints-salvage.test.ts` | #419 rewritten to tip |
| `tests/unit/burn-wave27-quiz-seat-chrome.test.ts` | pin tip: no empty preview; expect `.island-r-hint` |
| `tests/unit/hex-a-gone-bank-a11y-salvage.test.ts` | #429 rewritten to tip |
| `tests/unit/rules-text-audit-characterization-salvage.test.ts` | #492 rewritten to tip |
| `docs/dev/violation-salvage-2026-10-08.md` | this report |

## Explicit non-touches

- No files under `src/games/*/ai.ts`
- No tutorial / help / registry / owl / wiki player copy
- No Hex Hard `AI_PLAY_DEADLINE_MS.hard === 450` change
- No Stars & Bars history cap
- No edits to other open PRs

## Next action

**Next action: fold into tip by the tip owner**
