/**
 * Wave 40 — Queens makeMove invalid identity + selectPiece rejects.
 * After #177 restore matrix; deepen move/select leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  makeMove,
  selectPiece,
  getValidMoves,
  hasValidMoves,
  checkWinner,
} from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
} from '../../src/games/queens-guards/types';

describe('Wave 40 queens — makeMove / select leftovers', () => {
  it('makeMove identity on invalid destination', () => {
    const state = createInitialState();
    // Find a player1 piece
    let from = { ring: 0, position: 0 };
    for (const [, cell] of state.cells) {
      if (cell.piece?.player === 'player1') {
        from = { ring: cell.ring, position: cell.position };
        break;
      }
    }
    const next = makeMove(state, from, { ring: 99, position: 99 });
    expect(next).toBe(state);
  });

  it('selectPiece clears on opponent / no moves', () => {
    const state = createInitialState();
    let opp = { ring: 0, position: 0 };
    for (const [, cell] of state.cells) {
      if (cell.piece?.player === 'player2') {
        opp = { ring: cell.ring, position: cell.position };
        break;
      }
    }
    const cleared = selectPiece(state, opp);
    expect(cleared.selectedPiece).toBeNull();
  });

  it('hasValidMoves true on opening; checkWinner null incomplete', () => {
    const state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    expect(checkWinner(state)).toBeNull();
    // Own piece with moves can select
    for (const [, cell] of state.cells) {
      if (cell.piece?.player === 'player1') {
        const coord = { ring: cell.ring, position: cell.position };
        const moves = getValidMoves(state, coord);
        if (moves.length > 0) {
          const selected = selectPiece(state, coord);
          expect(selected.selectedPiece).toBe(
            cellKey(coord.ring, coord.position)
          );
          break;
        }
      }
    }
  });
});
