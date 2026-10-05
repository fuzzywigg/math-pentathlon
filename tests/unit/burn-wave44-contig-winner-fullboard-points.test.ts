/**
 * Wave 44 — Contig full-board points winner leftovers.
 * Checkerboard creates diagonal 5-in-row; use stride-5 striping so alignment
 * stays false and scoreboard settle can fire.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { checkWinner } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — winner fullboard alignment', () => {
  it('full board settles by alignment independent of scores', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const [v, cell] of base.cells) {
      const idx = cell.row * 10 + cell.col;
      const owner = idx % 5 === 4 ? 'player2' : 'player1';
      cells.set(v, { ...cell, owner });
    }
    const baseline = checkWinner({
      ...base,
      cells,
      scores: { player1: 0, player2: 0 },
    });
    expect(baseline).not.toBeNull();
    expect(
      checkWinner({
        ...base,
        cells,
        scores: { player1: 12, player2: 3 },
      })
    ).toBe(baseline);
    expect(
      checkWinner({
        ...base,
        cells,
        scores: { player1: 1, player2: 9 },
      })
    ).toBe(baseline);
  });
});
