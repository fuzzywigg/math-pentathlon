# Screen-reader semantics audit — 2026-10-08

Scope: structural SR semantics (landmarks, heading ids, dialog wiring, live
regions, board naming). Stacked on tip `cursor/integration-fold-wave5-tip-4af0`
(#477). Does **not** redo keyboard focus order (#491) or reduced-motion /
contrast (#495). No rules, AI, scoring, or visible player-facing copy changes.

## Findings

| Area | Before | Severity |
| --- | --- | --- |
| Shell `#status` | Live attrs only if each game remembered `markStatusLive` | Medium |
| Game area / boards | `role="grid"` often unnamed (no label / labelledby) | Medium |
| Shell modals | `role="dialog"` + focus trap present; `aria-hidden` not synced with `.hidden` | Medium |
| Move history | Collapse control present; panel not a labelled region | Low |
| Difficulty picker | Selected class only; no `aria-pressed` | Low |
| Tutorial dialog | `aria-labelledby` only; title was `h3`; message not `aria-describedby` | Medium |
| Owl speech | Message text updated with no live region | Medium |
| Game selector | Tabs lacked `aria-controls`; division panels not labelled regions | Low |
| Stats dashboard | Header + `h1` only; main content not a labelled region | Low |

## Fixes

- **Shell** (`game-shell.ts`): `#game-title` on `h1`; `#status` marked polite live at mount; game area `role="region"` + `aria-labelledby="game-title"`; move-history region labelled by existing “History” text; modal `aria-hidden` synced on open/close/Escape; difficulty `aria-pressed`.
- **Boards** (`board-a11y.ts`): `markBoardAsGrid` / `labelBoardFromGameTitle` name grids from `#game-title` when no name already set.
- **Tutorial** (`tutorial.ts`): title element `h2`; `aria-describedby` → existing message paragraph.
- **Owl** (`owl-component.ts`): `.owl-message` is `role="status"` + `aria-live="polite"`.
- **Menu / stats**: division panels + tabs `aria-controls` / region labelledby; stats main region labelled by “Your Progress”.

## Tests

`tests/unit/sr-semantics-structure.test.ts` locks landmarks, live status,
modal `aria-hidden`, board labelling, tutorial describedby, owl live region,
selector/stats regions.

## Human review

No new visible player-facing copy. Accessible-name wiring reuses existing
visible strings (`#game-title`, “History”, division names, “Your Progress”,
tutorial title/message, owl message text).

Items for a human decision:

1. **Owl polite live region** — Ollie can speak often; confirm polite
   announcements are acceptable vs. leaving speech silent for AT.
2. **Game region named by `h1`** — Some SR users will hear the title twice
   (heading + region). Acceptable tradeoff for an explicit board landmark?
3. **Tutorial title tag `h3` → `h2`** — Same visible text; heading level only.
   Confirm CSS/theme still looks correct (class selectors unchanged).
