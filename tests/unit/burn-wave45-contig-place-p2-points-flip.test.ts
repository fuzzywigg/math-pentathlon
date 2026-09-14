/**
 * Wave 45 — Contig placeChip p2 awards points and flips to p1
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

function claim(values: number[], owner: 'player1' | 'player2', base = createInitialState()): ContigState {
  const cells = new Map(base.cells);
  for (const value of values) cells.set(value, { ...cells.get(value)!, owner });
  return { ...base, cells };
}

describe('Wave 45 Contig — p2 points seat flip', () => {
  it('awards adjacency points to p2 then flips currentPlayer', () => {
    let state = claim([2, 11], 'player1');
    state = {
      ...state,
      phase: 'calculating',
      currentPlayer: 'player2',
      currentDice: [1, 1, 1],
      scores: { player1: 0, player2: 0 },
    };
    const next = placeChip(state, 1, '1*1*1');
    expect(next.scores.player2).toBeGreaterThanOrEqual(2);
    expect(next.currentPlayer).toBe('player1');
    expect(next.phase).toBe('rolling');
  });
});
