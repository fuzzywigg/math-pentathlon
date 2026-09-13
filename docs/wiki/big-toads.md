# Big Toads

**Big Toads** are shared foundational systems reused across multiple games. Planning language and dependency matrices live in the repo root [`ROADMAP.md`](../../ROADMAP.md). Implementations live under `src/core/`.

This page is a public index of those systems as they exist in the tree today. Prefer the registry and source over older “games remaining” counts in planning docs when those disagree.

## Core systems (`src/core/`)

| System | Path | Role |
|--------|------|------|
| Dice | `src/core/dice/` | Rolls, selection UI, combinatorics |
| Alignment | `src/core/alignment/` | N-in-a-row, contiguous regions, highlights |
| Fractions | `src/core/fractions/` | Arithmetic and fraction-bar UI |
| Polyomino | `src/core/polyomino/` | Shapes, transforms, placement, UI |
| Attributes | `src/core/attributes/` | Attribute logic helpers and UI |
| Graph / network | `src/core/graph/` | Graph algorithms and board UI |
| Hex grid | `src/core/hex/` | Hex coordinates and rendering |
| Expressions | `src/core/expressions/` | Number-sentence evaluation and UI |

## Related product modules

| Module | Path | Notes |
|--------|------|-------|
| Game registry | `src/core/game-registry.ts` | Names, divisions, difficulty |
| Tutorial | `src/core/tutorial.ts` | Step guidance shared across games |
| Router | `src/core/router.ts` | In-app navigation |
| Board a11y | `src/ui/board-a11y.ts` | Shared keyboard / ARIA helpers — see [Accessibility](./accessibility.md) |

## How to use this page

1. Find which systems a game needs in [`ROADMAP.md`](../../ROADMAP.md).
2. Open the matching `src/core/<system>/` package before changing a game.
3. Keep rules and state pure; put DOM work in `*-ui.ts` / `game-controller.ts` (see [Development](./development.md)).
