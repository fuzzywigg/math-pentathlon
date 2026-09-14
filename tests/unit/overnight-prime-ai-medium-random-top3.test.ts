/**
 * Overnight HEAVY — Prime Gold medium top-3 randomness branch.
 * Distinct leftover vs wave42 hard random smoke. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIPlacement } from '../../src/games/prime-gold/ai';
import {
  createInitialState,
  rollDice,
  getValidPlacements,
} from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Overnight prime — medium random top3', () => {
  it('medium randomness trigger still returns a legal placement', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.05) // < 0.15 → random top3
      .mockReturnValueOnce(0.9); // pick among top3
    const placing = rollDice(createInitialState());
    const ans = getAIPlacement(placing, 'player1', 'medium');
    expect(ans).not.toBeNull();
    expect(getValidPlacements(placing).some((p) => p.value === ans!.value)).toBe(
      true
    );
  });
});
