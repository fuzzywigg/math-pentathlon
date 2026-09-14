/**
 * Overnight HEAVY after #214/#215 — Stars medium randomness leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { getAIMove } from '../../src/games/stars-bars/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight stars-bars — medium random', () => {
  it('low random still returns legal cardId from hand', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const s = createInitialState();
    const move = getAIMove(s, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(s.playerHands.player1.some((c) => c.id === move!.cardId)).toBe(true);
    expect(move!.row).toBeGreaterThanOrEqual(0);
    expect(move!.col).toBeGreaterThanOrEqual(0);
  }, 15_000);
});
