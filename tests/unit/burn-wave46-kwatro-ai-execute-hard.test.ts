/**
 * Wave 46 — Kwatro executeAITurn hard leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { executeAITurn, getAIMove } from '../../src/games/kwatro-sinko/ai';

describe('Wave 46 kwatro — execute hard', () => {
  afterEach(() => vi.restoreAllMocks());

  it('hard execute records move and flips', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(getAIMove(createInitialState(), 'player1', 'hard')).not.toBeNull();
    const next = executeAITurn(createInitialState(), 'player1', 'hard');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.currentPlayer).toBe('player2');
  });
});
