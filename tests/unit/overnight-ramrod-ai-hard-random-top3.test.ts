/**
 * Overnight HEAVY after #214/#215 — Ramrod hard/medium randomness leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove, executeAITurn } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight ramrod — AI random/execute', () => {
  it('medium low-random returns rod in hand; execute flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const s = createInitialState();
    const move = getAIMove(s, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(s.playerRods.player1).toContain(move!.rodId);
    expect([0, 1]).toContain(move!.slot);
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const next = executeAITurn(createInitialState(), 'player1', 'hard');
    expect(next.currentPlayer === 'player2' || next.phase === 'gameOver').toBe(true);
  }, 15_000);
});
