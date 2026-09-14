/**
 * Wave 41 — Pent'Em In select / rotate / flip leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getPentominoShape,
  getPlayerPieces,
  getOpponent,
  PIECES_PER_PLAYER,
} from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  rotateSelectedPiece,
  flipSelectedPiece,
  cancelSelection,
  setPreviewPosition,
} from '../../src/games/pent-em-in/rules';

describe('Wave 41 Pent — select / rotate / flip', () => {
  it('opening deals full pentomino sets to both seats', () => {
    const state = createInitialState();
    expect(state.player1Pieces.available).toHaveLength(PIECES_PER_PLAYER);
    expect(state.player2Pieces.available).toHaveLength(PIECES_PER_PLAYER);
    expect(state.phase).toBe('selectPiece');
    expect(getOpponent('player1')).toBe('player2');
    expect(getPlayerPieces(state, 'player1').available.length).toBe(
      PIECES_PER_PLAYER
    );
  });

  it('selectPiece unknown / opponent piece is identity', () => {
    const state = createInitialState();
    expect(selectPiece(state, 'not-real')).toBe(state);
    // Both players start with same shape ids; selecting own is fine.
    // After removing from p1 available, selecting again is identity.
    const shapeId = state.player1Pieces.available[0];
    let next = {
      ...state,
      player1Pieces: {
        available: state.player1Pieces.available.filter((id) => id !== shapeId),
        placed: [shapeId],
      },
    };
    expect(selectPiece(next, shapeId)).toBe(next);
  });

  it('select → rotate cycles 0/90/180/270 when canRotate', () => {
    let state = createInitialState();
    const rotatable = state.player1Pieces.available.find((id) => {
      const shape = getPentominoShape(id);
      return shape?.canRotate;
    })!;
    state = selectPiece(state, rotatable);
    expect(state.phase).toBe('placePiece');
    expect(state.selectedRotation).toBe(0);
    state = rotateSelectedPiece(state);
    expect(state.selectedRotation).toBe(90);
    state = rotateSelectedPiece(state);
    expect(state.selectedRotation).toBe(180);
    state = rotateSelectedPiece(state);
    expect(state.selectedRotation).toBe(270);
    state = rotateSelectedPiece(state);
    expect(state.selectedRotation).toBe(0);
  });

  it('rotate/flip without selection are identity; non-flippable stays', () => {
    const state = createInitialState();
    expect(rotateSelectedPiece(state)).toBe(state);
    expect(flipSelectedPiece(state)).toBe(state);
    const noFlip = state.player1Pieces.available.find((id) => {
      const shape = getPentominoShape(id);
      return shape && !shape.canFlip;
    });
    if (noFlip) {
      let next = selectPiece(state, noFlip);
      expect(flipSelectedPiece(next)).toBe(next);
    }
  });

  it('flip toggles selectedFlipped when canFlip', () => {
    let state = createInitialState();
    const flippable = state.player1Pieces.available.find((id) => {
      const shape = getPentominoShape(id);
      return shape?.canFlip;
    })!;
    state = selectPiece(state, flippable);
    expect(state.selectedFlipped).toBe(false);
    state = flipSelectedPiece(state);
    expect(state.selectedFlipped).toBe(true);
    state = flipSelectedPiece(state);
    expect(state.selectedFlipped).toBe(false);
  });

  it('cancelSelection restores selectPiece; setPreviewPosition updates', () => {
    let state = createInitialState();
    const id = state.player1Pieces.available[0];
    state = selectPiece(state, id);
    state = setPreviewPosition(state, { row: 3, col: 4 });
    expect(state.previewPosition).toEqual({ row: 3, col: 4 });
    state = setPreviewPosition(state, null);
    expect(state.previewPosition).toBeNull();
    state = cancelSelection(state);
    expect(state.phase).toBe('selectPiece');
    expect(state.selectedPiece).toBeNull();
    expect(state.selectedRotation).toBe(0);
    expect(state.selectedFlipped).toBe(false);
  });
});
