/**
 * Wave 45 — Contig placeChip player2 completes five-in-a-row
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

describe('Wave 45 Contig — p2 place five win', () => {
  it('player2 placing 10 after 6-9 wins by alignment', () => {
    let state = claim([6, 7, 8, 9], 'player2');
    state = {
      ...state,
      phase: 'calculating',
      currentPlayer: 'player2',
      currentDice: [2, 2, 5],
    };
    const next = placeChip(state, 10, '(2 + 2) * 5 / 2 + something');
    // placeChip does not validate expression math — just places value
    expect(next.winner).toBe('player2');
    expect(next.phase).toBe('gameOver');
  });
});
