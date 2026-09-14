/**
 * Wave 48 — Ramrod executeAITurn player2. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { executeAITurn } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 ramrod — execute p2', () => {
  it('p2 places from selectingRod', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = { ...createInitialState(), currentPlayer: 'player2' as const };
    const next = executeAITurn(s, 'player2', 'medium');
    expect(next.moveHistory.length).toBe(1);
    expect(next.currentPlayer === 'player1' || next.phase === 'gameOver').toBe(true);
  });
});
