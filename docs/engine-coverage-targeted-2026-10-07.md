# Engine branch coverage — targeted unit tests (2026-10-07)

Hand-built-state unit tests for **kwatro-sinko**, **kings-quadraphages**, and **fiar** engines.
No engine code, rules, or scoring changes.

## Method

- Baseline and after: `vitest run --coverage` with
  `coverage.include` limited to the engine modules below.
- New suites (tests only):
  - `tests/unit/engine-coverage-kwatro-sinko-targeted.test.ts`
  - `tests/unit/engine-coverage-kings-quadraphages-targeted.test.ts`
  - `tests/unit/engine-coverage-fiar-targeted.test.ts`

## Before / after (branch %)

| Module | Before branches | After branches | Δ covered arms |
| --- | --- | --- | --- |
| `src/games/kwatro-sinko/rules.ts` | 102/116 (**87.93%**) | 109/116 (**93.96%**) | +7 |
| `src/games/kings-quadraphages/rules.ts` | 46/50 (**92.00%**) | 46/50 (**92.00%**) | 0 (remaining unreachable) |
| `src/games/kings-quadraphages/game-state.ts` | 52/55 (**94.54%**) | 54/55 (**98.18%**) | +2 |
| `src/games/kings-quadraphages/board.ts` | 10/10 (**100%**) | 10/10 (**100%**) | 0 |
| `src/games/fiar/rules.ts` | 100/107 (**93.45%**) | 106/107 (**99.06%**) | +6 |
| `src/games/fiar/types.ts` | 38/39 (**97.43%**) | 39/39 (**100%**) | +1 |
| **Combined (these files)** | **348/377 (92.30%)** | **364/377 (96.55%)** | **+16** |

Statements / lines (combined): 96.35% → 98.50% stmts; 98.84% → 99.23% lines.
Functions stayed at 100%.

## Branches newly covered (by theme)

### Kwatro-Sinko

- Edge-of-board corner destinations (`n0-0`, `n4-4`); off-board dest rejection.
- `getValidMoves` when `chip.position` points at a missing node.
- Illegal select/move phase and missing-chip rejection; `passTurn` / `clearSelection` handoff.
- `allChipsOffNumbered` empty-seat and null-position chips.
- `findWinningAlignment` on empty / malformed node ids.
- `checkTrioForWin` non-triple input.
- Win via `findAnyWinningAlignment` when the clinching move is **off** the pre-existing winning line (no seat flip on win).

### Kings & Quadraphages

- Corner / far-edge king mobility and OOB placement rejection.
- Wrong-phase `moveKing` / `placeQuadraphage`; illegal coords.
- `moveKing` no-op when the current seat has no king on the board.
- `endTurn` tie when **only the incoming opponent** has empty supply (distinct from both-supplies-zero `isDrawCondition`).
- Normal place → seat handoff to `moveKing`.

### FIAR

- `setSelectedChipKind` rejects exhausted plain/marked inventory.
- `normalizeSelectedChipKind` falls back to plain when marked is empty.
- `placeChip` with a non-`plain`/`marked` kind argument uses `selectedChipKind`.
- `forceChip` throws on missing node id.
- Wrong-phase / occupied / missing placement rejection.
- Edge-column ray destinations stay on-board; `getBoardDirections` spacing falsy fallback.
- `findPaths` skips missing ids injected into `straightLinesCache`.
- Select/deselect, illegal move reject, legal move turn handoff.

## Unreachable branches (documented, not forced)

These arms remain uncovered under the current public API without changing engine code.
They are defensive / impossible given prior guards.

### `kwatro-sinko/rules.ts`

| Line | Arm | Why unreachable |
| --- | --- | --- |
| 54 | `if (!node) continue` in `createBoard` | `createBoard` is private; every `n{r}-{c}` is inserted before the connection pass. |
| 98 / 110 | `if (node)` false in `createInitialState` | Placement targets `n0-{i}` / `n4-{i}` always exist on the 5×5 board. |
| 251 | `if (!chip \|\| !chip.position)` true after `isValidMove` | `isValidMove` → `getValidMoves` already returns `[]` for missing/null-position chips, so `moveChip` returns earlier. |
| 260 | `if (oldNode)` false | Same map that validated the move still contains `fromNodeId`. |
| 266 | `if (!newNode)` true | Destinations in `getValidMoves` are existing connected nodes; `new Map(state.nodes)` keeps them. |
| 436 | `if (!likes \|\| !opposite)` true | After `trio.length === 3` and `byOwner.size === 2`, the only partition is 2+1. |

### `kings-quadraphages/rules.ts`

| Line | Arm | Why unreachable |
| --- | --- | --- |
| 98 | stay-in-place (`rowDiff === 0 && colDiff === 0`) | Destination equal to the king cell fails `isEmpty` first (king occupies it). |
| 193–197 | board-full draw (`emptyCount === 0` && both kings still have moves) | With zero empty cells, `getValidKingMoves` cannot return any empty adjacent square; the compound condition cannot become true. |

### `kings-quadraphages/game-state.ts`

| Line | Arm | Why unreachable |
| --- | --- | --- |
| 136–138 | `default` exhaustive `never` in `getCurrentPhaseMessage` | `TurnPhase` only allows `moveKing` \| `placeQuadraphage` \| `gameOver`; default is a compile-time exhaustiveness guard. |

### `fiar/rules.ts`

| Line | Arm | Why unreachable |
| --- | --- | --- |
| 289 | `subsetUnblocked` early return when `chipNodes.length < WIN_LENGTH` | Sole caller (`findPaths`) only invokes it when `segmentChips.length >= CONFIG.WIN_LENGTH`. |

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run test:unit
npm run test:unit:coverage -- \
  --coverage.include='src/games/kwatro-sinko/rules.ts' \
  --coverage.include='src/games/kings-quadraphages/rules.ts' \
  --coverage.include='src/games/kings-quadraphages/game-state.ts' \
  --coverage.include='src/games/kings-quadraphages/board.ts' \
  --coverage.include='src/games/fiar/rules.ts' \
  --coverage.include='src/games/fiar/types.ts'
```
