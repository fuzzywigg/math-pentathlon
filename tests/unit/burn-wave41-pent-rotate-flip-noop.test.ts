/**
 * Wave 41 — Pent\'Em In X rotate/flip noop + ghost canPlayerMove quirk.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getPentominoShape,
} from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  rotateSelectedPiece,
  flipSelectedPiece,
  canPlayerMove,
  getPieceCells,
  canPlacePiece,
  cancelSelection,
  setPreviewPosition,
} from '../../src/games/pent-em-in/rules';

describe('Wave 41 pent-em-in — rotate/flip/ghost', () => {
  it('X shape canRotate/canFlip false → rotate/flip identity', () => {
    const x = getPentominoShape('X');
    expect(x?.canRotate).toBe(false);
    expect(x?.canFlip).toBe(false);
    let state = createInitialState();
    // Ensure X is available for player1
    if (!state.player1Pieces.available.includes('X')) {
      state = {
        ...state,
        player1Pieces: {
          available: ['X', ...state.player1Pieces.available],
          placed: state.player1Pieces.placed,
        },
      };
    }
    state = selectPiece(state, 'X');
    expect(state.selectedPiece).toBe('X');
    expect(rotateSelectedPiece(state)).toBe(state);
    expect(flipSelectedPiece(state)).toBe(state);
  });

  it('rotate/flip without selection → identity', () => {
    const state = createInitialState();
    expect(state.selectedPiece).toBeNull();
    expect(rotateSelectedPiece(state)).toBe(state);
    expect(flipSelectedPiece(state)).toBe(state);
  });

  it('canPlayerMove empty available false; ghost shape quirk true', () => {
    const state = createInitialState();
    const empty = {
      ...state,
      player1Pieces: { available: [] as string[], placed: [...state.player1Pieces.available] },
    };
    expect(canPlayerMove(empty, 'player1')).toBe(false);
    const ghost = {
      ...state,
      player1Pieces: { available: ['not-a-shape'], placed: [] as string[] },
    };
    expect(canPlayerMove(ghost, 'player1')).toBe(true);
  });

  it('getPieceCells unknown []; OOB place false; cancel + preview', () => {
    expect(getPieceCells('ZZZ', { row: 0, col: 0 }, 0, false)).toEqual([]);
    const state = createInitialState();
    expect(canPlacePiece(state, 'F', { row: -2, col: -2 }, 0, false)).toBe(false);
    const selected = selectPiece(state, state.player1Pieces.available[0]);
    const previewed = setPreviewPosition(selected, { row: 4, col: 4 });
    expect(previewed.previewPosition).toEqual({ row: 4, col: 4 });
    const cancelled = cancelSelection(previewed);
    expect(cancelled.selectedPiece).toBeNull();
  });

  it('selectPiece of already-placed id → identity', () => {
    const state = createInitialState();
    const id = state.player1Pieces.available[0];
    const forged = {
      ...state,
      player1Pieces: {
        available: state.player1Pieces.available.filter((x) => x !== id),
        placed: [...state.player1Pieces.placed, id],
      },
    };
    expect(selectPiece(forged, id)).toBe(forged);
  });
});
