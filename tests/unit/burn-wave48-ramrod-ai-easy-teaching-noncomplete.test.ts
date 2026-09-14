/**
 * Wave 48 — Ramrod easy teaching can pick non-completing. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 ramrod — easy teaching', () => {
  it('easy with random 0.2 still returns a move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const move = getAIMove(createInitialState(), 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.rodId).toBeTruthy();
  });
});
