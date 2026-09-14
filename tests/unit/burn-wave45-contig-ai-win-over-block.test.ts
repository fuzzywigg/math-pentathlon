/**
 * Wave 45 — Contig AI win (+10000) beats block (+5000) head-to-head
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

function claim(values: number[], owner: 'player1' | 'player2', base = createInitialState()): ContigState {
  const cells = new Map(base.cells);
  for (const value of values) cells.set(value, { ...cells.get(value)!, owner });
  return { ...base, cells };
}

describe('Wave 45 Contig AI — win over block', () => {
  it('hard prefers completing own five over blocking opponent', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Own 1-4 needs 5; opponent 11-14 needs 15. Dice [3,3,5] make both.
    let state = claim([1, 2, 3, 4], 'player1');
    state = claim([11, 12, 13, 14], 'player2', state);
    state = {
      ...state,
      phase: 'calculating',
      currentDice: [3, 3, 5],
      currentPlayer: 'player1',
    };
    const move = getAIPlacement(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.value).toBe(5); // win +10000 beats block of 15 (+5000)
  });
});
