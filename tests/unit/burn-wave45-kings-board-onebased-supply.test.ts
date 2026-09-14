/**
 * Wave 45 TOKENMAXX — Kings board one-based + hasSupply leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  fromOneBasedPosition,
  toOneBasedPosition,
  hasSupply,
  createInitialGameState,
  BOARD_SIZE,
  PLAYER1_KING_START,
  PLAYER2_KING_START,
} from '../../src/games/kings-quadraphages/board';

describe('Wave 45 kings — board helpers', () => {
  it('one-based roundtrip and start seats', () => {
    expect(fromOneBasedPosition(1, 5)).toEqual({ row: 0, col: 4 });
    expect(toOneBasedPosition({ row: 8, col: 4 })).toEqual({ row: 9, col: 5 });
    expect(PLAYER1_KING_START).toEqual({ row: 0, col: 4 });
    expect(PLAYER2_KING_START).toEqual({ row: 8, col: 4 });
    expect(BOARD_SIZE).toBe(9);
  });

  it('hasSupply mirrors supply counts', () => {
    const s = createInitialGameState();
    expect(hasSupply(s, 'player1')).toBe(true);
    expect(hasSupply({ ...s, player1Supply: 0 }, 'player1')).toBe(false);
    expect(hasSupply({ ...s, player2Supply: 0 }, 'player2')).toBe(false);
  });
});
