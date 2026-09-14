/**
 * Overnight HEAVY — Remainder Islands empty / constrained valids → null.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAIIslandChoice,
  executeAISelection,
} from '../../src/games/remainder-islands/ai';
import {
  createInitialState,
  type RemainderIslandsState,
} from '../../src/games/remainder-islands/types';
import { findValidIslands } from '../../src/games/remainder-islands/rules';

function selecting(
  overrides: Partial<RemainderIslandsState> = {}
): RemainderIslandsState {
  const state = createInitialState();
  const roll = { die1: 3, die2: 3, total: 6 };
  return {
    ...state,
    phase: 'selectIsland',
    currentRoll: roll,
    validIslands: findValidIslands(state, roll.total),
    ...overrides,
  };
}

describe('Overnight remainder — empty / constrained valids', () => {
  it('empty validIslands → getAIIslandChoice null + execute identity', () => {
    const state = selecting({ validIslands: [] });
    expect(getAIIslandChoice(state, 'player1', 'hard')).toBeNull();
    expect(getAIIslandChoice(state, 'player1', 'easy')).toBeNull();
    expect(executeAISelection(state, 'player1', 'medium')).toBe(state);
  });

  it('all islands owned by opponent → findValidIslands empty → null', () => {
    const base = createInitialState();
    const owned = base.islands.map((island) => ({
      ...island,
      owner: 'player2' as const,
      chips: 1,
    }));
    const roll = { die1: 2, die2: 2, total: 4 };
    const state: RemainderIslandsState = {
      ...base,
      islands: owned,
      phase: 'selectIsland',
      currentPlayer: 'player1',
      currentRoll: roll,
      validIslands: findValidIslands({ ...base, islands: owned }, roll.total),
    };
    expect(state.validIslands).toHaveLength(0);
    expect(getAIIslandChoice(state, 'player1', 'hard')).toBeNull();
    expect(executeAISelection(state, 'player1', 'easy')).toBe(state);
  });

  it('missing currentRoll → null even with phase selectIsland', () => {
    const state = selecting({ currentRoll: null });
    expect(getAIIslandChoice(state, 'player1', 'medium')).toBeNull();
  });
});
