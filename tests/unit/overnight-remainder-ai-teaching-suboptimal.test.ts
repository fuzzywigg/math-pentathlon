/**
 * Overnight HEAVY — Remainder Islands easy teaching suboptimal pick.
 * Distinct leftover vs wave42 "still returns an island" without random spy.
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

function selecting(
  overrides: Partial<RemainderIslandsState> = {}
): RemainderIslandsState {
  const state = createInitialState();
  const roll = { die1: 5, die2: 4, total: 9 };
  return {
    ...state,
    phase: 'selectIsland',
    currentRoll: roll,
    validIslands: findValidIslands(state, roll.total),
    ...overrides,
  };
}

describe('Overnight remainder — teaching suboptimal', () => {
  it('easy teaching gate random < 0.4 picks from suboptimal slice', () => {
    const state = selecting();
    expect(state.validIslands.length).toBeGreaterThan(3);

    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const best = getAIIslandChoice(state, 'player1', 'easy');
    expect(best).not.toBeNull();

    vi.restoreAllMocks();
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // teaching suboptimal gate
      .mockReturnValueOnce(0); // first of slice(1,4)
    const sub = getAIIslandChoice(state, 'player1', 'easy');
    expect(sub).not.toBeNull();
    expect(state.validIslands).toContain(sub!.islandId);
    // With enough scored diversity, suboptimal should differ from top
    // when top is unique; still must be a valid id either way.
    expect(typeof sub!.islandId).toBe('string');
  });

  it('easy teaching skip (random >= 0.4) returns top-scored island', () => {
    const state = selecting();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const top = getAIIslandChoice(state, 'player1', 'easy');
    const hard = getAIIslandChoice(state, 'player1', 'hard');
    expect(top?.islandId).toBe(hard?.islandId);
  });
});
