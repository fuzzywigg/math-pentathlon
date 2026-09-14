/**
 * Wave 32 — COMMON_DICE_SETS / DICE_CONFIGS color + name uniqueness.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  DICE_CONFIGS,
  COMMON_DICE_SETS,
  type DiceType,
} from '../../src/core/dice';

describe('Wave 32 dice — config color uniqueness', () => {
  it('each polyhedral type has a distinct catalog color', () => {
    const colors = Object.values(DICE_CONFIGS).map((c) => c.color);
    expect(new Set(colors).size).toBe(colors.length);
  });

  it('standard set uses two d6 with distinct colors', () => {
    const [a, b] = COMMON_DICE_SETS.standard.dice;
    expect(a!.type).toBe('d6');
    expect(b!.type).toBe('d6');
    expect(a!.color).not.toBe(b!.color);
  });

  it('triple set three d6 colors are pairwise distinct', () => {
    const colors = COMMON_DICE_SETS.triple.dice.map((d) => d.color);
    expect(new Set(colors).size).toBe(3);
  });

  it('polyhedral set colors match DICE_CONFIGS per type', () => {
    for (const die of COMMON_DICE_SETS.polyhedral.dice) {
      expect(die.color).toBe(DICE_CONFIGS[die.type as DiceType].color);
    }
  });

  it('set display names are unique', () => {
    const names = Object.values(COMMON_DICE_SETS).map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
