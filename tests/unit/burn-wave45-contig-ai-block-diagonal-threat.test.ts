/**
 * Wave 45 — Contig AI blocks diagonal opponent four-threat
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

describe('Wave 45 Contig AI — diagonal block', () => {
  it('hard blocks down-right diagonal four-threat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Opponent: 1(0,0),12(1,1),28(2,2),55(3,3) → needs 108(4,4) to five
    // Dice [6,6,3] → (6*6)*3 = 108
    let state = claim([1, 12, 28, 55], 'player2');
    state = {
      ...state,
      phase: 'calculating',
      currentDice: [6, 6, 3],
      currentPlayer: 'player1',
    };
    const move = getAIPlacement(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.value).toBe(108);
  });
});
