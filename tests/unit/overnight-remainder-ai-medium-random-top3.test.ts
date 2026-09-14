/**
 * Overnight HEAVY — Remainder Islands medium randomness top-3 branch.
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
  const roll = { die1: 6, die2: 5, total: 11 };
  return {
    ...state,
    phase: 'selectIsland',
    currentRoll: roll,
    validIslands: findValidIslands(state, roll.total),
  };
}

describe('Overnight remainder — medium random top3', () => {
  it('randomness branch (random < 0.15) still returns a valid island', () => {
    const state = selecting();
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.05) // enter randomness
      .mockReturnValueOnce(0); // first of top 3
    const choice = getAIIslandChoice(state, 'player1', 'medium');
    expect(choice).not.toBeNull();
    expect(state.validIslands).toContain(choice!.islandId);
  });

  it('high random skips randomness and matches hard top pick', () => {
    const state = selecting();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const medium = getAIIslandChoice(state, 'player1', 'medium');
    const hard = getAIIslandChoice(state, 'player1', 'hard');
    expect(medium?.islandId).toBe(hard?.islandId);
  });
});
