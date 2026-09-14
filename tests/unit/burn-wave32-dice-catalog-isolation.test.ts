/**
 * Wave 32 — catalog constants isolation (no shared mutable array refs across reads).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  DICE_CONFIGS,
  COMMON_DICE_SETS,
  getDiceConfig,
  type DiceType,
} from '../../src/core/dice';

describe('Wave 32 dice — catalog isolation', () => {
  it('getDiceConfig returns stable shared config objects', () => {
    const types: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
    for (const type of types) {
      expect(getDiceConfig(type)).toBe(DICE_CONFIGS[type]);
      expect(getDiceConfig(type).faces).toBe(DICE_CONFIGS[type].faces);
    }
  });

  it('COMMON_DICE_SETS entries keep distinct dice arrays', () => {
    const sets = Object.values(COMMON_DICE_SETS);
    for (let i = 0; i < sets.length; i++) {
      for (let j = i + 1; j < sets.length; j++) {
        expect(sets[i]!.dice).not.toBe(sets[j]!.dice);
        expect(sets[i]!.id).not.toBe(sets[j]!.id);
      }
    }
  });

  it('mutating a copied dice array does not alter the catalog', () => {
    const copy = [...COMMON_DICE_SETS.standard.dice];
    copy.pop();
    expect(COMMON_DICE_SETS.standard.dice).toHaveLength(2);
  });
});
