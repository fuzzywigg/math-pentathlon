/**
 * Wave 45 — Kwatro AI opening hard leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { getAIMove, executeAITurn, isAITurn } from '../../src/games/kwatro-sinko/ai';

describe('Wave 45 kwatro — AI opening', () => {
  afterEach(() => vi.restoreAllMocks());

  it('hard move + execute advances history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.currentPlayer).toBe('player2');
  });

  it('isAITurn matrix', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
  });
});
