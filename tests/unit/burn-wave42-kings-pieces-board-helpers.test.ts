/**
 * Wave 42 — Kings pieces + board isEmpty/supply helpers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { BOARD_SIZE, isValidPosition, isEmpty, getSupply } from '../../src/games/kings-quadraphages/board';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — board helpers', () => {
  it('BOARD_SIZE 9; corners valid; OOB false', () => {
    expect(BOARD_SIZE).toBe(9);
    expect(isValidPosition({ row: 0, col: 0 })).toBe(true);
    expect(isValidPosition({ row: 8, col: 8 })).toBe(true);
    expect(isValidPosition({ row: -1, col: 0 })).toBe(false);
    expect(isValidPosition({ row: 0, col: 9 })).toBe(false);
  });

  it('isEmpty false on kings; supply mirrors state', () => {
    const s = createInitialGameState();
    expect(isEmpty(s.board, { row: 0, col: 4 })).toBe(false);
    expect(isEmpty(s.board, { row: 4, col: 4 })).toBe(true);
    expect(getSupply(s, 'player1')).toBe(30);
    expect(getSupply(s, 'player2')).toBe(30);
  });
});
