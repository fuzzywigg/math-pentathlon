# Live dogfood notes — 2026-09-09

Target: [https://math.pappas.work](https://math.pappas.work) (Math Pentathlon Practice Edition — 20 games / 4 divisions).  
Branch context: `alpha`. Reversible docs-only note (issue comment API unavailable to this agent run).

## Session exercised

| Step | Result |
|---|---|
| Home load | Confirmed Practice Edition, 20 Games, 4 Divisions |
| Ollie | Dismiss + minimize |
| Div I — Kings & Quadraphages vs AI Hard | ≥3 interactions: E1→E2 + ●A1; AI E9→D8 + ●E3; second turn E2→D2 + ●I9 |
| Div II — Sum Dominoes & Dice | Roll dice (=9), select playable domino, place on valid cell |
| Div III — Contig 60 @ 390×844 | Roll 2/2/1, choose expression, place |
| Div IV — Prime Gold | Roll 1/8/8, place chip on valid cell 7 (Blue 19 chips) |

## Findings (mapped)

### F1 — Accessibility uneven (#8) — **P2**

**Repro:** https://math.pappas.work → Kings vs AI; also Contig / Prime Gold / Sum Dominoes boards.

**Expected:** Keyboard-reachable boards, announced valid moves, live status, non-color player cues.

**Actual:**

- Kings: `role="button"`, `tabindex="0"`, `aria-label`, Enter/Space work (partial progress).
- After keyboard select, focus jumps to `body` (lost on rebuild).
- Valid move cells still labeled e.g. `E2, empty` (green = color-only).
- No `[aria-live]` / `role="status"` during session.
- Contig / Prime Gold / Sum Dominoes cells: no `role` / `tabindex` / `aria-label`.

**UX proposals:**

1. Roving tabindex + arrow keys (avoid 81 tab stops); restore focus after updates.
2. Port Kings a11y pattern to other games; include “valid move” in labels.
3. `aria-live="polite"` on status + shape/icon markers beyond color.

### F2 — Full DOM rebuild (#11) — **P2**

**Repro:** Kings place-quad / Prime Gold place — stash cell node, act, compare identity.

**Expected:** In-place class/content updates; preserved focus; stable elements.

**Actual:** `before !== after` on cell nodes; Playwright “element is not stable” on board clicks; focus loss pairs with #8. Source still clears `innerHTML` in board UIs/controllers.

**UX proposals:**

1. Initial render vs incremental update (shared renderer).
2. Preserve focused `[data-row]/[data-col]` across updates.
3. Single paint for AI multi-step turns to reduce flicker.

### F3 — AI affordances / logic (#12) — **P2** (live) / source risk on Fab-a-Diffy

**Repro:** Kings → New Game → vs AI Hard → play ≥1 full turn.

**Expected:** Visible thinking state; board disabled; safe multi-step AI pipelines.

**Actual:**

- Hard AI moved successfully (not stuck); no thinking spinner / `aria-busy`.
- Difficulty UI exists for Kings; uneven across catalog.
- Source still: `fab-a-diffy/game-controller.ts` `makeAIMove` chains select/execute without per-step phase validation.

**UX proposals:**

1. Global AI-thinking UI + disable board.
2. Validate each Fab-a-Diffy step; pass + log on failure.
3. Shared difficulty control on game selector.

### F4 — Division tab TypeError (novel) — **P1**

**Repro:** Home → click Division II (or III/IV) tab in top nav.

**Expected:** Open matching accordion and scroll.

**Actual:** Console `TypeError: Cannot read properties of null (reading 'setAttribute')`; all accordions collapse; collapsed Div II+ cards intercept pointer events despite appearing in a11y tree.

**Cause:** `src/ui/game-selector.ts` — tabs and sections both use `data-division`; tab handler `querySelector` hits the tab first; `toggleAccordion` null-derefs `.accordion-header`.

**UX proposals:**

1. Query `.division-accordion[data-division="…"]` only.
2. Distinct data attributes for tabs vs sections.
3. Null-guard in `toggleAccordion`.

## Mobile / keyboard notes

- Contig @ 390×844: board usable; chrome denser; Ollie FAB sits over lower viewport.
- Sum Dominoes: hand/board cells ~22px — weak touch targets.
- Prime Gold @ 1280: hex board visually clipped on the right edge.
- Home Division tabs are keyboard buttons but broken (F4).

## Console

- Division tab click → production `TypeError` (F4).
- No errors during Kings AI turns themselves.

## Success criteria (this dogfood)

| ID | Criterion | Status |
|---|---|---|
| S1 | Live home + game visible | Pass |
| S2 | Micro-session ≥3 interactions documented | Pass (Kings) |
| S3 | ≥3 divisions touched | Pass (I–IV) |
| S4 | ≥3 concrete findings | Pass (F1–F4) |
| S5 | ≥2 UX proposals | Pass |
| S6 | Reversible only | Pass (this docs note; no closes/deletes) |

## Issue / PR status

- Novel P1 opened: https://github.com/fuzzywigg/math-pentathlon/issues/52
- Docs PR (this file): https://github.com/fuzzywigg/math-pentathlon/pull/53
- Preferred comments on #8 / #11 / #12 could not be posted from this agent (API 403 on `issues/*/comments`). Paste F1–F3 from this note onto those issues when comment scope is available. Issues were **not** closed.
