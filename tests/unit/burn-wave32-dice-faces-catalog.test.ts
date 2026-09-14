/**
 * Wave 32 — DICE_FACES / DICE_CONFIGS / COMMON_DICE_SETS / getDiceConfig catalog.
 * Deepens dice roller beyond wave 27 thin combo. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  DICE_FACES,
  DICE_CONFIGS,
  COMMON_DICE_SETS,
  getDiceConfig,
  type DiceType,
} from '../../src/core/dice';

const ALL_TYPES: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

describe('Wave 32 dice — face catalog', () => {
  it('maps every DiceType to its face count', () => {
    expect(DICE_FACES).toEqual({
      d4: 4,
      d6: 6,
      d8: 8,
      d10: 10,
      d12: 12,
      d20: 20,
    });
  });

  it('DICE_CONFIGS type/faces agree with DICE_FACES and expose colors', () => {
    for (const type of ALL_TYPES) {
      const cfg = DICE_CONFIGS[type];
      expect(cfg.type).toBe(type);
      expect(cfg.faces).toBe(DICE_FACES[type]);
      expect(cfg.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('getDiceConfig returns the same catalog entry identity', () => {
    for (const type of ALL_TYPES) {
      expect(getDiceConfig(type)).toBe(DICE_CONFIGS[type]);
    }
  });
});

describe('Wave 32 dice — COMMON_DICE_SETS structure', () => {
  it('standard / triple / polyhedral / primeGold have stable ids and lengths', () => {
    expect(COMMON_DICE_SETS.standard).toMatchObject({
      id: 'standard',
      name: 'Standard (2d6)',
    });
    expect(COMMON_DICE_SETS.standard.dice).toHaveLength(2);
    expect(COMMON_DICE_SETS.triple.dice).toHaveLength(3);
    expect(COMMON_DICE_SETS.polyhedral.dice.map((d) => d.type)).toEqual(
      ALL_TYPES
    );
    expect(COMMON_DICE_SETS.primeGold.dice.map((d) => d.type)).toEqual([
      'd6',
      'd8',
      'd10',
    ]);
  });

  it('every set die mirrors DICE_CONFIGS faces', () => {
    for (const set of Object.values(COMMON_DICE_SETS)) {
      for (const die of set.dice) {
        expect(die.faces).toBe(DICE_FACES[die.type]);
      }
    }
  });
});
