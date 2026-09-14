/**
 * Wave 32 — mixed polyhedral rolls + COMMON_DICE_SETS handshake.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollDice,
  COMMON_DICE_SETS,
  DICE_FACES,
  getAllPossibleSums,
  getSelectedTotal,
  selectDice,
} from '../../src/core/dice';

function stubRandom(kind: 'min' | 'max' | 'mid' = 'min'): void {
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    i += 1;
    if (kind === 'min') return (i % 10_000) * 1e-7;
    if (kind === 'mid') return 0.5 + (i % 100) * 1e-9;
    return 0.999999 - (i % 10_000) * 1e-12;
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 32 dice — polyhedral mix', () => {
  it('rolls polyhedral set types within each face range', () => {
    stubRandom('mid');
    const types = COMMON_DICE_SETS.polyhedral.dice.map((d) => d.type);
    const result = rollDice({ dice: types });
    expect(result.rolls).toHaveLength(6);
    for (const die of result.rolls) {
      expect(die.value).toBeGreaterThanOrEqual(1);
      expect(die.value).toBeLessThanOrEqual(DICE_FACES[die.diceType]);
    }
    expect(result.total).toBe(
      result.rolls.reduce((sum, d) => sum + d.value, 0)
    );
  });

  it('primeGold three-die selection totals ⊆ possible sums', () => {
    stubRandom('min');
    const types = COMMON_DICE_SETS.primeGold.dice.map((d) => d.type);
    const result = rollDice({ dice: types });
    const selected = selectDice(
      result,
      result.rolls.slice(0, 2).map((r) => r.id),
      true
    );
    const sum = getSelectedTotal(selected);
    const possible = getAllPossibleSums(result.rolls.map((r) => r.value));
    expect(possible).toContain(sum);
  });

  it('standard 2d6 min/max totals under pinned random', () => {
    stubRandom('min');
    const low = rollDice({
      dice: COMMON_DICE_SETS.standard.dice.map((d) => d.type),
    });
    expect(low.total).toBe(2);

    stubRandom('max');
    const high = rollDice({
      dice: COMMON_DICE_SETS.standard.dice.map((d) => d.type),
    });
    expect(high.total).toBe(12);
  });
});
