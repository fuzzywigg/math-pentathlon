/**
 * Wave 44 — COMMON_DICE_SETS catalog invariant leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { COMMON_DICE_SETS, DICE_FACES } from '../../src/core/dice';

describe('Wave 44 dice — common sets catalog', () => {
  it('ids unique and faces match DICE_FACES', () => {
    const ids = Object.values(COMMON_DICE_SETS).map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const set of Object.values(COMMON_DICE_SETS)) {
      expect(set.name.length).toBeGreaterThan(0);
      expect(set.dice.length).toBeGreaterThan(0);
      for (const d of set.dice) {
        expect(d.faces).toBe(DICE_FACES[d.type]);
        expect(d.color).toMatch(/^#/);
      }
    }
  });

  it('primeGold is 3 polyhedral types', () => {
    expect(COMMON_DICE_SETS.primeGold.dice.map((d) => d.type)).toEqual([
      'd6',
      'd8',
      'd10',
    ]);
  });
});
