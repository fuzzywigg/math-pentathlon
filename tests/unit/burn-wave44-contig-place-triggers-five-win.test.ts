/**
 * Wave 44 — Contig placeChip five-win transition leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_NUMBERS } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — place triggers five win', () => {
  it('placing the fifth in a row ends game', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const v of [1, 2, 3, 4]) {
      cells.set(v, { ...cells.get(v)!, owner: 'player1' });
    }
    const next = placeChip(
      {
        ...base,
        cells,
        phase: 'calculating',
        currentDice: [1, 1, 5],
        currentPlayer: 'player1',
      },
      5,
      '1+4'
    );
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(BOARD_NUMBERS[0].slice(0, 5)).toEqual([1, 2, 3, 4, 5]);
  });
});
