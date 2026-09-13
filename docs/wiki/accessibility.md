# Accessibility

Public posture for keyboard and screen-reader support on practice boards. Implementation detail lives in `src/ui/board-a11y.ts` and per-game board UI controllers. This page does **not** change product code.

## Shared helpers (`src/ui/board-a11y.ts`)

Documented waves in source:

| Wave | Intent |
|------|--------|
| Wave 1 | Focusable cells, Enter/Space activation, aria-label parts, focus restore, live status |
| Wave 2 | ARIA grid pattern, one roving tabindex, arrow-key navigation |
| Wave 3 | SVG click-board focusables with the same attributes as HTML cells |
| Burn 1/2 | Remaining click boards (Stars & Bars · Kwatro-Sinko · Par 55) + live status on Frac Fact / Fraction Pinball / Star Track |

Helpers include `buildCellAriaLabel`, `makeCellFocusable`, grid/roving helpers, and live-status marking. Labels can announce coordinates, ownership, emptiness, and valid move/placement — so color is not the only cue. Status/score chrome often uses `seatIcon` (🔵/🔴/🟣) beside seat names.

## Coverage reality

Catalog practice boards wire the shared helpers for keyboard activation, named labels, and polite live status. Decorative track SVGs (Star Track path) and quiz-style answer UIs rely on native `<button>` controls plus live status rather than grid cells. Treat unit tests under `tests/unit/*a11y*` and a live Tab/arrow smoke as the checkable surface.

## Reviewer checklist (public)

1. Open a game at [https://math.pappas.work](https://math.pappas.work).
2. Tab / arrow through the board; confirm focus stays on cells after moves when helpers are wired.
3. Confirm valid destinations are named in labels, not only colored.
4. Look for polite live status updates during play when `markStatusLive` (or equivalent) is used.

## Out of scope here

- Private school or family accommodation workflows
- Changing scoring or game engines (escalate per `AGENTS.md`)
- Full WCAG audit / VDOM rewrite (#11) / inventing new chrome
