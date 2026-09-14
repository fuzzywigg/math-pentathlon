/**
 * Overnight HEAVY — Remainder isAITurn + execute after constrained single valid.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getAIIslandChoice,
  executeAISelection,
  isAITurn,
} from '../../src/games/remainder-islands/ai';
import {
  createInitialState,
  type RemainderIslandsState,
} from '../../src/games/remainder-islands/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Overnight remainder — constrained single valid', () => {
  it('single constrained valid island is always chosen', () => {
    const base = createInitialState();
    const only = base.islands[0];
    const islands = base.islands.map((island) =>
      island.id === only.id
        ? island
        : { ...island, owner: 'player2' as const, chips: 1 }
    );
    const roll = { die1: 1, die2: 2, total: 3 };
    const state: RemainderIslandsState = {
      ...base,
      islands,
      phase: 'selectIsland',
      currentPlayer: 'player1',
      currentRoll: roll,
      validIslands: [only.id],
    };
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    for (const d of ['easy', 'medium', 'hard'] as const) {
      expect(getAIIslandChoice(state, 'player1', d)?.islandId).toBe(only.id);
    }
    const next = executeAISelection(state, 'player1', 'hard');
    expect(next).not.toBe(state);
    expect(next.moveHistory).toHaveLength(1);
  });

  it('isAITurn false on gameOver even for matching seat', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
      currentPlayer: 'player1' as const,
    };
    expect(isAITurn(over, 'player1')).toBe(false);
    expect(isAITurn(createInitialState(), 'player1')).toBe(true);
  });
});
