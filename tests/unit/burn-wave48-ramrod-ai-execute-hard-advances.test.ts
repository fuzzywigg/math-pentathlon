/**
 * Wave 48 — Ramrod executeAITurn hard advances history. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { executeAITurn } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 ramrod — execute hard', () => {
  it('places a rod and flips seat or ends', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = executeAITurn(createInitialState(), 'player1', 'hard');
    expect(next.moveHistory.length).toBe(1);
    expect(next.currentPlayer === 'player2' || next.phase === 'gameOver').toBe(true);
  });
});
