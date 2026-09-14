/**
 * Wave 40 — Pent Em In select ghost / rotate-flip flags / canPlacePiece OOB.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  BOARD_SIZE,
  getPentominoShape,
} from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  rotateSelectedPiece,
  flipSelectedPiece,
  canPlacePiece,
} from '../../src/games/pent-em-in/rules';

describe('Wave 40 pent-em-in — select flags OOB', () => {
  it('selectPiece unavailable/ghost shapeId → identity', () => {
    const state = createInitialState();
    expect(selectPiece(state, 'ghost-shape')).toBe(state);
    expect(selectPiece(state, 'not-in-catalog')).toBe(state);

    // Already placed / unavailable: forge empty available
    const depleted = {
      ...state,
      player1Pieces: { available: [], placed: [...state.player1Pieces.available] },
    };
    expect(selectPiece(depleted, 'X')).toBe(depleted);
  });

  it('rotateSelectedPiece / flipSelectedPiece when canRotate/canFlip false → identity', () => {
    // X-pentomino: canRotate false, canFlip false
    const x = getPentominoShape('X');
    expect(x?.canRotate).toBe(false);
    expect(x?.canFlip).toBe(false);

    let state = createInitialState();
    state = selectPiece(state, 'X');
    expect(state.selectedPiece).toBe('X');
    expect(rotateSelectedPiece(state)).toBe(state);
    expect(flipSelectedPiece(state)).toBe(state);
  });

  it('canPlacePiece OOB → false', () => {
    const state = createInitialState();
    const shapeId = state.player1Pieces.available[0];
    expect(
      canPlacePiece(state, shapeId, { row: -1, col: 0 }, 0, false)
    ).toBe(false);
    expect(
      canPlacePiece(state, shapeId, { row: 0, col: -1 }, 0, false)
    ).toBe(false);
    expect(
      canPlacePiece(
        state,
        shapeId,
        { row: BOARD_SIZE, col: 0 },
        0,
        false
      )
    ).toBe(false);
    expect(
      canPlacePiece(
        state,
        shapeId,
        { row: 0, col: BOARD_SIZE },
        0,
        false
      )
    ).toBe(false);
  });
});
