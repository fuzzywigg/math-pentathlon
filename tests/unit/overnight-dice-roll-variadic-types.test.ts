/**
 * Overnight TOKENMAXX HEAVY — roll(...types) variadic convenience leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { roll, rollMultiple } from '../../src/core/dice/roller';

afterEach(() => vi.restoreAllMocks());

describe('Overnight dice — roll variadic + empty rollMultiple', () => {
  it('roll(...types) preserves type order and total invariant', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const result = roll('d4', 'd8', 'd20');
    expect(result.rolls.map((d) => d.diceType)).toEqual(['d4', 'd8', 'd20']);
    expect(result.rolls.every((d) => d.value === 1)).toBe(true);
    expect(result.total).toBe(3);
  });

  it('rollMultiple count 0 yields empty rolls and total 0', () => {
    const result = rollMultiple('d6', 0);
    expect(result.rolls).toEqual([]);
    expect(result.total).toBe(0);
  });
});
