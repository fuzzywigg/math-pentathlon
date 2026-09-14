/**
 * Overnight HEAVY after #214/#215 — Ramrod easy teaching leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight ramrod — easy teaching', () => {
  it('easy returns a concrete placement in hand', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const s = createInitialState();
    const move = getAIMove(s, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(s.playerRods.player1).toContain(move!.rodId);
    expect(move!.boxId.length).toBeGreaterThan(0);
    expect([0, 1]).toContain(move!.slot);
  }, 15_000);
});
