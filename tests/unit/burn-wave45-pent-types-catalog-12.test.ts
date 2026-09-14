/**
 * Wave 45 — Pent'Em In catalog / opponent leftovers after #208. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOpponent,
  getPentominoShape,
  PIECES_PER_PLAYER,
} from '../../src/games/pent-em-in/types';

describe('Wave 45 pent — types catalog', () => {
  it('initial hands have 12 shapes; opponent swaps', () => {
    const state = createInitialState();
    expect(state.player1Pieces.available).toHaveLength(PIECES_PER_PLAYER);
    expect(state.player2Pieces.available).toHaveLength(PIECES_PER_PLAYER);
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    expect(getPentominoShape('X')?.cells).toHaveLength(5);
    expect(getPentominoShape('ghost')).toBeUndefined();
  });
});
