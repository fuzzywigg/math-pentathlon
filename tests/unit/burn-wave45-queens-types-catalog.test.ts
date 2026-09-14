/**
 * Wave 45 TOKENMAXX — Queens types/CONFIG catalog leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  CONFIG,
  cellKey,
  parseKey,
  cellsInRing,
  getOpponent,
  createInitialState,
} from '../../src/games/queens-guards/types';

describe('Wave 45 queens — types catalog', () => {
  it('CONFIG rings/guards and key roundtrip', () => {
    expect(CONFIG.NUM_RINGS).toBe(6);
    expect(CONFIG.GUARDS_PER_PLAYER).toBe(6);
    expect(cellsInRing(0)).toBe(1);
    expect(cellsInRing(1)).toBe(6);
    expect(parseKey(cellKey(3, 4))).toEqual({ ring: 3, position: 4 });
    expect(getOpponent('player1')).toBe('player2');
  });

  it('opening has empty capture list and no winner', () => {
    const s = createInitialState();
    expect(s.capturedPieces).toEqual([]);
    expect(s.winner).toBeNull();
    expect(s.currentPlayer).toBe('player1');
  });
});
