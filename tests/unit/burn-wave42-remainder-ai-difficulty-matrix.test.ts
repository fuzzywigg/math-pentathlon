/**
 * Wave 42 — Remainder Islands AI difficulty / isAITurn leftovers.
 * Beyond wave41 select/score; deepens AI gates. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import {
  getAIIslandChoice,
  executeAISelection,
  isAITurn,
} from '../../src/games/remainder-islands/ai';

afterEach(() => vi.restoreAllMocks());

function selectState() {
  const base = createInitialState();
  return {
    ...base,
    phase: 'selectIsland' as const,
    currentRoll: { die1: 3, die2: 5, total: 8 },
    validIslands: base.islands.slice(0, 5).map((i) => i.id),
  };
}

describe('Wave 42 remainder — AI difficulties', () => {
  it('easy/medium/hard each return a listed island under seed 0', () => {
    const state = selectState();
    for (const difficulty of ['easy', 'medium', 'hard'] as const) {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const choice = getAIIslandChoice(state, 'player1', difficulty);
      expect(choice).not.toBeNull();
      expect(state.validIslands).toContain(choice!.islandId);
      vi.restoreAllMocks();
    }
  });

  it('executeAISelection hard leaves rolling with owned island', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = selectState();
    const next = executeAISelection(state, 'player1', 'hard');
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.currentRoll).toBeNull();
    expect(next.islands.some((i) => i.owner === 'player1')).toBe(true);
  });

  it('isAITurn false for null seat and gameOver', () => {
    const state = selectState();
    expect(isAITurn(state, null)).toBe(false);
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(
      isAITurn({ ...state, phase: 'gameOver', winner: 'player2' }, 'player1')
    ).toBe(false);
  });
});
