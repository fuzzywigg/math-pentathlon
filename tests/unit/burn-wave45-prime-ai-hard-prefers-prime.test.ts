/**
 * Wave 45 — Prime Gold hard prefers prime placement leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  rollDice,
  findCellByValue,
  getValidPlacements,
} from '../../src/games/prime-gold/rules';
import { getAIPlacement } from '../../src/games/prime-gold/ai';

describe('Wave 45 prime — AI hard prime preference', () => {
  afterEach(() => vi.restoreAllMocks());

  it('hard pick is prime when any prime valid exists', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const rolled = rollDice(createInitialState());
    const move = getAIPlacement(rolled, 'player1', 'hard');
    expect(move).not.toBeNull();
    const anyPrime = getValidPlacements(rolled).some(
      (v) => findCellByValue(rolled, v.value)?.isPrime
    );
    if (anyPrime) {
      expect(findCellByValue(rolled, move!.value)?.isPrime).toBe(true);
    }
  });
});
