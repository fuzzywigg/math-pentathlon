/**
 * Wave 45 — Prime Gold easy teaching non-prime leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, rollDice } from '../../src/games/prime-gold/rules';
import { getAIPlacement } from '../../src/games/prime-gold/ai';

describe('Wave 45 prime — AI teaching', () => {
  afterEach(() => vi.restoreAllMocks());

  it('easy random<0.4 still returns a placement when moves exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = rollDice(createInitialState());
    const move = getAIPlacement(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.value).toBeGreaterThan(0);
  });
});
