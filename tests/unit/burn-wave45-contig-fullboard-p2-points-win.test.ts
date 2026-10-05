/**
 * Wave 45 — Contig full-board settle prefers higher p2 score
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { checkWinner } from '../../src/games/contig-60/rules';

describe('Wave 45 Contig — fullboard alignment settle', () => {
  it('full board result ignores adjacency points', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const [v, cell] of base.cells) {
      const idx = cell.row * 10 + cell.col;
      const owner = idx % 5 === 4 ? 'player2' : 'player1';
      cells.set(v, { ...cell, owner });
    }
    const a = checkWinner({ ...base, cells, scores: { player1: 3, player2: 9 } });
    const b = checkWinner({ ...base, cells, scores: { player1: 9, player2: 3 } });
    expect(a).not.toBeNull();
    expect(a).toBe(b);
  });
});
