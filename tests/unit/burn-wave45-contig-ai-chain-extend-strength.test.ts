/**
 * Wave 45 — Contig AI prefers longer own chain extend
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

describe('Wave 45 Contig AI — chain extend strength', () => {
  it('hard prefers extending length-3 over isolated when both legal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Own 1,2,3 on top row → extend to 4; also dice can make isolated 24 etc.
    // [1,2,2] makes 4,5,1,2,3,6,...
    let state = claim([1, 2, 3], 'player1');
    state = {
      ...state,
      phase: 'calculating',
      currentDice: [1, 2, 2],
      currentPlayer: 'player1',
    };
    const move = getAIPlacement(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    // Chain extend to 4 (length 3→4) should outrank sparse placements
    expect(move!.value).toBe(4);
  });
});
