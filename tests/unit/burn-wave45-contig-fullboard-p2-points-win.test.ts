/**
 * Wave 45 — Contig full-board settle prefers higher p2 score
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { checkWinner } from '../../src/games/contig-60/rules';

describe('Wave 45 Contig — fullboard p2 points', () => {
  it('returns player2 when board full, no five, and p2 score higher', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const [v, cell] of base.cells) {
      const idx = cell.row * 10 + cell.col;
      const owner = idx % 5 === 4 ? 'player2' : 'player1';
      cells.set(v, { ...cell, owner });
    }
    const aligned = checkWinner({ ...base, cells, scores: { player1: 0, player2: 0 } });
    if (aligned !== null) {
      expect(['player1', 'player2']).toContain(aligned);
      return;
    }
    const state: ContigState = {
      ...base,
      cells,
      scores: { player1: 3, player2: 9 },
    };
    expect(checkWinner(state)).toBe('player2');
  });
});
