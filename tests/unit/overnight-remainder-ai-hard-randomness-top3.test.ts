/**
 * Overnight HEAVY after #210 — Remainder hard randomness=0.03 top-3 branch.
 * #210 only exercised medium top-3; hard was used as deterministic oracle.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIIslandChoice } from '../../src/games/remainder-islands/ai';
import {
  createInitialState,
  type RemainderIslandsState,
} from '../../src/games/remainder-islands/types';
import { findValidIslands } from '../../src/games/remainder-islands/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function selecting(): RemainderIslandsState {
  const state = createInitialState();
  const roll = { die1: 5, die2: 4, total: 9 };
  return {
    ...state,
    phase: 'selectIsland',
    currentRoll: roll,
    validIslands: findValidIslands(state, roll.total),
  };
}

describe('Overnight remainder — hard randomness top3', () => {
  it('hard random < 0.03 still returns a valid top-3 island id', () => {
    const state = selecting();
    expect(state.validIslands.length).toBeGreaterThan(1);
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.01) // enter randomness
      .mockReturnValueOnce(0); // first of top-3
    const choice = getAIIslandChoice(state, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect(state.validIslands).toContain(choice!.islandId);
  });

  it('hard random >= 0.03 matches deterministic top', () => {
    const state = selecting();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const top = getAIIslandChoice(state, 'player1', 'hard');
    vi.restoreAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0.05); // skip hard randomness
    const again = getAIIslandChoice(state, 'player1', 'hard');
    expect(again?.islandId).toBe(top?.islandId);
  });
});
