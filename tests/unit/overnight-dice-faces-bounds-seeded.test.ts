/**
 * Overnight TOKENMAXX — dice face bounds under seeded random leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollDie, rollDice } from '../../src/core/dice/roller';
import { DICE_FACES } from '../../src/core/dice/types';

afterEach(() => vi.restoreAllMocks());

describe('Overnight dice — face bounds', () => {
  it('each type stays in 1..faces across random ladder', () => {
    const values = [0, 0.1, 0.49, 0.5, 0.99];
    for (const type of Object.keys(DICE_FACES) as (keyof typeof DICE_FACES)[]) {
      for (const v of values) {
        vi.spyOn(Math, 'random').mockReturnValue(v);
        const die = rollDie(type);
        expect(die.value).toBeGreaterThanOrEqual(1);
        expect(die.value).toBeLessThanOrEqual(DICE_FACES[type]);
        vi.restoreAllMocks();
      }
    }
  });

  it('rollDice totals match sum of rolls', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const result = rollDice({ dice: ['d6', 'd8', 'd10'] });
    expect(result.total).toBe(result.rolls.reduce((s, d) => s + d.value, 0));
    expect(result.rolls).toHaveLength(3);
  });
});
