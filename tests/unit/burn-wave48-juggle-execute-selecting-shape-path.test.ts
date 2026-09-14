/**
 * Wave 48 — Juggle executeAITurn from selectingShape (not rolling). Tests-only.
 * Avoids hard AI loops; uses easy + fixed RNG.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { executeAITurn } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — execute selectingShape path', () => {
  it('easy AI completes turn from selectingShape with monomino die', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 1] as [number, number],
    };
    const next = executeAITurn(selecting, 'player1', 'easy');
    expect(next.moveHistory.length).toBe(1);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
  });
});
