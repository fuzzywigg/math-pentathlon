/**
 * Overnight HEAVY after #214/#215 — Stars & Bars hard execute leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { getAIMove, executeAITurn, isAITurn } from '../../src/games/stars-bars/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight stars-bars — hard execute', () => {
  it('hard move uses a hand card; execute flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    const move = getAIMove(s, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(s.playerHands.player1.some((c) => c.id === move!.cardId)).toBe(true);
    const next = executeAITurn(s, 'player1', 'hard');
    expect(next.moveHistory.length).toBe(1);
    expect(next.currentPlayer).toBe('player2');
  }, 15_000);
});
