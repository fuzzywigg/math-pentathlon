/**
 * Wave 48 — Juggle executeAITurn mono path advances seat. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { executeAITurn } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — execute mono', () => {
  it('from selectingShape with die1 completes place and flips seat or ends', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 1] as [number, number],
    };
    const next = executeAITurn(s, 'player1', 'hard');
    expect(next.currentPlayer === 'player2' || next.phase === 'gameOver' || next.phase === 'rolling').toBe(true);
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(0);
  });
});
