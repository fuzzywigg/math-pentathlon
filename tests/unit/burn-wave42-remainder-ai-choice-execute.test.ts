/**
 * Wave 42 — Remainder AI choice + executeAISelection leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAIIslandChoice,
  isAITurn,
  executeAISelection,
} from '../../src/games/remainder-islands/ai';
import { createInitialState, type RemainderIslandsState } from '../../src/games/remainder-islands/types';
import { findValidIslands } from '../../src/games/remainder-islands/rules';

function selecting(): RemainderIslandsState {
  const state = createInitialState();
  const roll = { die1: 4, die2: 3, total: 7 };
  return {
    ...state,
    phase: 'selectIsland',
    currentRoll: roll,
    validIslands: findValidIslands(state, roll.total),
  };
}

describe('Wave 42 remainder — AI execute', () => {
  it('medium/hard choose valid island ids', () => {
    const state = selecting();
    for (const d of ['medium', 'hard'] as const) {
      const choice = getAIIslandChoice(state, 'player1', d);
      expect(choice).not.toBeNull();
      expect(state.validIslands).toContain(choice!.islandId);
    }
  });

  it('executeAISelection applies choice and leaves rolling', () => {
    const state = selecting();
    const next = executeAISelection(state, 'player1', 'hard');
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.player1Chips).toBe(state.player1Chips - 1);
    expect(next.moveHistory).toHaveLength(1);
  });

  it('wrong seat / phase / mode gates', () => {
    const state = selecting();
    expect(getAIIslandChoice(state, 'player2', 'medium')).toBeNull();
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(isAITurn(state, 'player2')).toBe(false);
    const rolling = createInitialState();
    expect(getAIIslandChoice(rolling, 'player1', 'easy')).toBeNull();
  });

  it('easy teaching still returns an island', () => {
    const choice = getAIIslandChoice(selecting(), 'player1', 'easy');
    expect(choice?.islandId).toBeTruthy();
  });
});
