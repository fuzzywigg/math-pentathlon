/**
 * Wave 42 leftovers B — Remainder isAITurn during rolling phase.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isAITurn, getAIIslandChoice } from '../../src/games/remainder-islands/ai';
import { createInitialState } from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — AI turn during rolling', () => {
  it('isAITurn true on rolling for current seat; choice null until select', () => {
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(getAIIslandChoice(state, 'player1', 'hard')).toBeNull();
  });
});
