/**
 * Wave 48 — Calla getAIMove immediate-win early return. Tests-only.
 * Uses medium + random=0; no hard minimax storm (#213).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { getAIMove } from '../../src/games/calla/ai';
import { makeMove, isGameOver } from '../../src/games/calla/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 calla — AI immediate win', () => {
  it('medium picks pit that empties own side for win', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    // Only pit0 has 1 cube; emptying side sweeps; ensure P1 calla wins
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [2, 2, 2, 2, 2],
      player1Calla: 20,
      player2Calla: 0,
    };
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    const next = makeMove(state, move!.pit);
    expect(isGameOver(next)).toBe(true);
    expect(next.winner).toBe('player1');
  });
});
