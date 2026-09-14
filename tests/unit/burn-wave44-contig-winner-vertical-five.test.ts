/**
 * Wave 44 — Contig vertical five-in-row leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ContigState, createInitialState, BOARD_NUMBERS } from '../../src/games/contig-60/types';
import { checkWinner } from '../../src/games/contig-60/rules';

function claimCol(col: number, owner: 'player1' | 'player2'): ContigState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  for (let r = 0; r < 5; r++) {
    const v = BOARD_NUMBERS[r][col];
    cells.set(v, { ...cells.get(v)!, owner });
  }
  return { ...base, cells };
}

describe('Wave 44 Contig — winner vertical five', () => {
  it('detects five owned cells down a column', () => {
    expect(checkWinner(claimCol(0, 'player1'))).toBe('player1');
    expect(checkWinner(claimCol(3, 'player2'))).toBe('player2');
  });
});
