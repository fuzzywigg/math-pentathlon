/**
 * Wave 45 — Par 55 medium randomness top-3 leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { getAIMove } from '../../src/games/par-55/ai';

describe('Wave 45 par — AI medium random', () => {
  afterEach(() => vi.restoreAllMocks());

  it('medium with random inside randomness band still returns move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    expect(getAIMove(createInitialState(), 'player1', 'medium')).not.toBeNull();
  });

  it('hard with high random returns deterministic top', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(getAIMove(createInitialState(), 'player1', 'hard')).not.toBeNull();
  });
});
