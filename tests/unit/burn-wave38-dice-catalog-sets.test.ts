/**
 * Wave 38 — COMMON_DICE_SETS / DICE_CONFIGS catalog leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  COMMON_DICE_SETS,
  DICE_CONFIGS,
  DICE_FACES,
  rollDice,
  type DiceType,
} from '../../src/core/dice';

const TYPES: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

describe('Wave 38 dice-catalog — configs mirror faces', () => {
  it('every DiceType has matching faces in CONFIGS and FACES', () => {
    for (const t of TYPES) {
      expect(DICE_FACES[t]).toBe(DICE_CONFIGS[t].faces);
      expect(DICE_CONFIGS[t].type).toBe(t);
      expect(DICE_CONFIGS[t].color).toMatch(/^#/);
    }
  });

  it('COMMON_DICE_SETS entries have unique ids and non-empty dice', () => {
    const ids = Object.values(COMMON_DICE_SETS).map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const set of Object.values(COMMON_DICE_SETS)) {
      expect(set.name.length).toBeGreaterThan(0);
      expect(set.dice.length).toBeGreaterThan(0);
      for (const die of set.dice) {
        expect(TYPES).toContain(die.type);
        expect(die.faces).toBe(DICE_FACES[die.type]);
      }
    }
  });

  it('rolling a catalog set yields one roll per configured die', () => {
    for (const set of Object.values(COMMON_DICE_SETS)) {
      const result = rollDice({ dice: set.dice.map((d) => d.type) });
      expect(result.rolls).toHaveLength(set.dice.length);
      expect(result.total).toBe(result.rolls.reduce((s, d) => s + d.value, 0));
      for (let i = 0; i < set.dice.length; i++) {
        expect(result.rolls[i].diceType).toBe(set.dice[i].type);
        expect(result.rolls[i].value).toBeGreaterThanOrEqual(1);
        expect(result.rolls[i].value).toBeLessThanOrEqual(set.dice[i].faces);
      }
    }
  });
});
