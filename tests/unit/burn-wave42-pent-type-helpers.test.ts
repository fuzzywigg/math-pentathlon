/**
 * Wave 42 — Pent'Em In getPentominoShape / getOpponent helpers leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getOpponent,
  getPentominoShape,
  getPlayerPieces,
  createInitialState,
} from '../../src/games/pent-em-in/types';

describe('Wave 42 pent-em-in — type helpers', () => {
  it('getOpponent toggles player1 ↔ player2', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    expect(getOpponent(getOpponent('player1'))).toBe('player1');
  });

  it('getPentominoShape returns shape metadata for all 12 ids', () => {
    for (const id of ['F', 'I5', 'L5', 'N', 'P', 'T5', 'U', 'V', 'W', 'X', 'Y', 'Z5']) {
      const shape = getPentominoShape(id);
      expect(shape).toBeDefined();
      expect(shape!.id).toBe(id);
      expect(shape!.cells).toHaveLength(5);
    }
    expect(getPentominoShape('missing')).toBeUndefined();
  });

  it('getPlayerPieces returns correct tray for each seat', () => {
    const state = createInitialState();
    expect(getPlayerPieces(state, 'player1')).toBe(state.player1Pieces);
    expect(getPlayerPieces(state, 'player2')).toBe(state.player2Pieces);
  });
});
