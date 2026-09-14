/**
 * Wave 42 leftovers B — Remainder empty validIslands / empty evaluate path.
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
import { findValidIslands, performRoll } from '../../src/games/remainder-islands/rules';

describe('Wave 42 remainder — empty valids / performRoll bridge', () => {
  it('empty validIslands → AI choice null; execute identity', () => {
    const state: RemainderIslandsState = {
      ...createInitialState(),
      phase: 'selectIsland',
      currentRoll: { die1: 1, die2: 1, total: 2 },
      validIslands: [],
    };
    expect(getAIIslandChoice(state, 'player1', 'hard')).toBeNull();
    expect(executeAISelection(state, 'player1', 'hard')).toBe(state);
  });

  it('performRoll seeds selectIsland when islands available', () => {
    const state = createInitialState();
    const rolled = performRoll(state);
    expect(rolled.currentRoll).not.toBeNull();
    if (rolled.phase === 'selectIsland') {
      expect(rolled.validIslands.length).toBeGreaterThan(0);
      const choice = getAIIslandChoice(rolled, 'player1', 'easy');
      expect(choice).not.toBeNull();
      expect(rolled.validIslands).toContain(choice!.islandId);
    } else {
      // rare: no valid islands for this roll
      expect(findValidIslands(rolled, rolled.currentRoll!.total)).toEqual([]);
    }
  });
});
