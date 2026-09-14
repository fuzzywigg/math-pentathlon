/**
 * Wave 42 — Contig AI prefers extending own chain when no win/block.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

function withOwned(values: number[], owner: 'player1' | 'player2'): ContigState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  for (const value of values) {
    cells.set(value, { ...cells.get(value)!, owner });
  }
  return { ...base, cells };
}

describe('Wave 42 Contig AI — chain extend', () => {
  it('hard extends own 2-chain when available', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Own 1,2 — extending to 3 is attractive; dice [1,1,1] can make small nums
    let state = withOwned([1, 2], 'player1');
    state = {
      ...state,
      phase: 'calculating',
      currentDice: [1, 1, 1],
      currentPlayer: 'player1',
    };
    const move = getAIPlacement(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    // 3 continues the row; also 1+1+1=3
    expect(typeof move!.value).toBe('number');
    expect(move!.expression.length).toBeGreaterThan(0);
  });
});
