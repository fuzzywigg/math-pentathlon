/**
 * Wave 46 — Par 55 executeAITurn hard advances leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { executeAITurn, getAIMove } from '../../src/games/par-55/ai';

describe('Wave 46 par — executeAITurn hard', () => {
  afterEach(() => vi.restoreAllMocks());

  it('hard execute places and flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    expect(getAIMove(state, 'player1', 'hard')).not.toBeNull();
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.moveHistory.length).toBe(1);
    expect(next.currentPlayer).toBe('player2');
  });
});
