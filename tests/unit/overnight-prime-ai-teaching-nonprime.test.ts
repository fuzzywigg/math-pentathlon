/**
 * Overnight HEAVY — Prime Gold easy teaching prefers non-prime suboptimal.
 * Distinct leftover vs wave42 difficulty smoke. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIPlacement } from '../../src/games/prime-gold/ai';
import {
  createInitialState,
  rollDice,
  findCellByValue,
  getValidPlacements,
} from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Overnight prime — teaching nonprime', () => {
  it('easy teachingMode with random < 0.4 picks a non-prime when available', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0) // rollDice die1
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.1) // teaching gate
      .mockReturnValueOnce(0); // pick first suboptimal
    const placing = rollDice(createInitialState());
    const valids = getValidPlacements(placing);
    const nonPrimes = valids.filter((p) => {
      const cell = findCellByValue(placing, p.value);
      return cell && !cell.isPrime;
    });
    expect(nonPrimes.length).toBeGreaterThan(0);
    const ans = getAIPlacement(placing, 'player1', 'easy');
    expect(ans).not.toBeNull();
    const cell = findCellByValue(placing, ans!.value)!;
    expect(cell.isPrime).toBe(false);
  });

  it('easy skips teaching when random >= 0.4 and returns a valid move', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5); // skip teaching
    const placing = rollDice(createInitialState());
    const ans = getAIPlacement(placing, 'player1', 'easy');
    expect(ans).not.toBeNull();
    expect(getValidPlacements(placing).some((p) => p.value === ans!.value)).toBe(
      true
    );
  });
});
