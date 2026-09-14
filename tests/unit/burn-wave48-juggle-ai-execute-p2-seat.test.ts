/**
 * Wave 48 — Juggle executeAITurn for player2 seat. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { executeAITurn } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — execute p2', () => {
  it('p2 seat from selectingShape with mono advances', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      phase: 'selectingShape' as const,
      currentDice: [1, 1] as [number, number],
    };
    const next = executeAITurn(s, 'player2', 'medium');
    expect(next.currentPlayer === 'player1' || next.phase === 'gameOver' || next.phase === 'rolling').toBe(true);
  });
});
