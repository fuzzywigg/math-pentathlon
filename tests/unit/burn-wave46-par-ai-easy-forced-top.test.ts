/**
 * Wave 46 — Par 55 easy with high RNG picks top path leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { getAIMove } from '../../src/games/par-55/ai';

describe('Wave 46 par — easy top path', () => {
  afterEach(() => vi.restoreAllMocks());

  it('easy with random=0.99 returns a hand block id', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(state.hands.player1.some((b) => b.id === move!.blockId)).toBe(true);
  });
});
