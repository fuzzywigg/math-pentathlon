/**
 * Wave 45 — Par 55 easy teaching suboptimal branch leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { getAIMove } from '../../src/games/par-55/ai';

describe('Wave 45 par — AI teaching', () => {
  afterEach(() => vi.restoreAllMocks());

  it('easy with random<0.4 still returns a legal move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(state.hands.player1.some((b) => b.id === move!.blockId)).toBe(true);
  });

  it('easy with random high picks top path', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const move = getAIMove(createInitialState(), 'player1', 'easy');
    expect(move).not.toBeNull();
  });
});
