/** Wave 42 — Remainder AI phase / seat / roll null gates. Tests-only. */
import { describe, it, expect } from 'vitest';

import {
  getAIIslandChoice,
  isAITurn,
  executeAISelection,
} from '../../src/games/remainder-islands/ai';
import { createInitialState } from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — AI phase null gates', () => {
  it('getAIIslandChoice null when phase is rolling', () => {
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    expect(getAIIslandChoice(state, 'player1', 'hard')).toBeNull();
  });

  it('getAIIslandChoice null when phase is gameOver', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
      currentRoll: { die1: 1, die2: 2, total: 3 },
      validIslands: ['island-0-0'],
    };
    expect(getAIIslandChoice(over, 'player2', 'hard')).toBeNull();
  });

  it('getAIIslandChoice null when wrong seat even in selectIsland', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectIsland' as const,
      currentPlayer: 'player1' as const,
      currentRoll: { die1: 2, die2: 3, total: 5 },
      validIslands: ['island-0-0'],
    };
    expect(getAIIslandChoice(state, 'player2', 'hard')).toBeNull();
  });

  it('getAIIslandChoice null when currentRoll missing', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectIsland' as const,
      currentRoll: null,
      validIslands: ['island-0-0'],
    };
    expect(getAIIslandChoice(state, 'player1', 'hard')).toBeNull();
  });

  it('isAITurn false for null player and gameOver', () => {
    const state = createInitialState();
    expect(isAITurn(state, null)).toBe(false);
    expect(
      isAITurn(
        { ...state, phase: 'gameOver', winner: 'player1' },
        'player1'
      )
    ).toBe(false);
  });

  it('executeAISelection identity when gates block choice', () => {
    const state = createInitialState(); // rolling
    expect(executeAISelection(state, 'player1', 'hard')).toBe(state);
  });
});
