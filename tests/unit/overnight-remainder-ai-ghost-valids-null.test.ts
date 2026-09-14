/**
 * Overnight HEAVY after #210 — Remainder AI ghost validIslands → null / identity.
 * evaluateMoves skips missing islands; executeAISelection must no-op.
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

describe('Overnight remainder — ghost valids null', () => {
  it('ghost validIslands yield null choice and identity execute', () => {
    const base = createInitialState();
    const roll = { die1: 3, die2: 3, total: 6 };
    const state: RemainderIslandsState = {
      ...base,
      phase: 'selectIsland',
      currentPlayer: 'player1',
      currentRoll: roll,
      validIslands: ['ghost-island-a', 'ghost-island-b'],
    };
    expect(getAIIslandChoice(state, 'player1', 'hard')).toBeNull();
    expect(getAIIslandChoice(state, 'player1', 'medium')).toBeNull();
    expect(getAIIslandChoice(state, 'player1', 'easy')).toBeNull();
    const next = executeAISelection(state, 'player1', 'hard');
    expect(next).toBe(state);
  });
});
