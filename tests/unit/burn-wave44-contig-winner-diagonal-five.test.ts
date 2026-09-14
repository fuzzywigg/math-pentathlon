/**
 * Wave 44 — Contig diagonal five-in-row leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ContigState, createInitialState, BOARD_NUMBERS } from '../../src/games/contig-60/types';
import { checkWinner } from '../../src/games/contig-60/rules';

function claimDiag(): ContigState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  for (let i = 0; i < 5; i++) {
    const v = BOARD_NUMBERS[i][i];
    cells.set(v, { ...cells.get(v)!, owner: 'player1' });
  }
  return { ...base, cells };
}

describe('Wave 44 Contig — winner diagonal five', () => {
  it('detects diagonal down-right ownership', () => {
    expect(checkWinner(claimDiag())).toBe('player1');
  });
});
