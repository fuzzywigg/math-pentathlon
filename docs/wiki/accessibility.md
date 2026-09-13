# Accessibility

Public posture for keyboard and screen-reader support on practice boards. Implementation detail lives in `src/ui/board-a11y.ts` and per-game board UI controllers. This page does **not** change product code.

## Shared helpers (`src/ui/board-a11y.ts`)

Documented waves in source:

| Wave | Intent |
|------|--------|
| Wave 1 | Focusable cells, Enter/Space activation, aria-label parts, focus restore, live status |
| Wave 2 | ARIA grid pattern, one roving tabindex, arrow-key navigation |
| Wave 3 | SVG click-board focusables with the same attributes as HTML cells |

Helpers include `buildCellAriaLabel`, `makeCellFocusable`, grid/roving helpers, and live-status marking. Labels can announce coordinates, ownership, emptiness, and valid move/placement — so color is not the only cue.

## Coverage reality

Adoption is **uneven across games**. Some boards wire the shared helpers more thoroughly than others. Treat the live site and unit tests under `tests/unit/*a11y*` as the checkable surface; do not assume every catalog game has full keyboard parity yet.

## Reviewer checklist (public)

1. Open a game at [https://math.pappas.work](https://math.pappas.work).
2. Tab / arrow through the board; confirm focus stays on cells after moves when helpers are wired.
3. Confirm valid destinations are named in labels, not only colored.
4. Look for polite live status updates during play when `markStatusLive` (or equivalent) is used.

## Out of scope here

- Private school or family accommodation workflows
- Changing scoring or game engines (escalate per `AGENTS.md`)
