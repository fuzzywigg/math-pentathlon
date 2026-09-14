/**
 * Wave 42 — Contig AI blocks opponent 4-in-a-row threat.
 * Distinct from wave41 contig rules/AI hard placement. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

function withOwned(
  values: number[],
  owner: 'player1' | 'player2',
  base = createInitialState()
): ContigState {
  const cells = new Map(base.cells);
  for (const value of values) {
    const cell = cells.get(value);
    if (!cell) throw new Error(`missing ${value}`);
    cells.set(value, { ...cell, owner });
  }
  return { ...base, cells };
}

describe('Wave 42 Contig AI — block threat', () => {
  it('hard blocks opponent completing 5 via value 5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Opponent owns 1-4 on top row; AI can make 5 with [1,2,2]
    let state = withOwned([1, 2, 3, 4], 'player2');
    state = {
      ...state,
      phase: 'calculating',
      currentDice: [1, 2, 2],
      currentPlayer: 'player1',
    };
    const move = getAIPlacement(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.value).toBe(5);
  });
});
