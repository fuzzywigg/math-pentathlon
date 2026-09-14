/**
 * Wave 40 — contig-60 five-in-row checkWinner leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, CONFIG } from '../../src/games/contig-60/types';
import { checkWinner } from '../../src/games/contig-60/rules';

describe('Wave 40 contig-60 — five in a row', () => {
  it('horizontal five owned cells → player1 wins', () => {
    const s = createInitialState();
    const cells = new Map(s.cells);
    // First row values 1..10; claim first five for player1
    for (let col = 0; col < CONFIG.WIN_BY_ALIGNMENT; col++) {
      const value = s.grid[0][col]!;
      const cell = cells.get(value)!;
      cells.set(value, { ...cell, owner: 'player1' });
    }
    const winner = checkWinner({ ...s, cells });
    expect(winner).toBe('player1');
  });

  it('empty board has no winner', () => {
    expect(checkWinner(createInitialState())).toBeNull();
  });
});
