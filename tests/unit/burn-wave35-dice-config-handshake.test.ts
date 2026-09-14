/**
 * Wave 35 — DICE_CONFIGS / COMMON_DICE_SETS / getDiceConfig handshake.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  DICE_CONFIGS,
  DICE_FACES,
  COMMON_DICE_SETS,
  getDiceConfig,
  type DiceType,
} from '../../src/core/dice';

describe('Wave 35 dice-config — faces ↔ configs', () => {
  it('every DiceType config.faces matches DICE_FACES', () => {
    for (const type of Object.keys(DICE_FACES) as DiceType[]) {
      expect(DICE_CONFIGS[type].type).toBe(type);
      expect(DICE_CONFIGS[type].faces).toBe(DICE_FACES[type]);
      expect(getDiceConfig(type)).toEqual(DICE_CONFIGS[type]);
      expect(getDiceConfig(type).color).toMatch(/^#/);
    }
  });
});

describe('Wave 35 dice-config — common sets integrity', () => {
  it('each set has unique id and non-empty dice with known types', () => {
    const ids = new Set<string>();
    for (const set of Object.values(COMMON_DICE_SETS)) {
      expect(set.id).toBeTruthy();
      expect(ids.has(set.id)).toBe(false);
      ids.add(set.id);
      expect(set.name.length).toBeGreaterThan(0);
      expect(set.dice.length).toBeGreaterThan(0);
      for (const die of set.dice) {
        expect(DICE_FACES[die.type]).toBe(die.faces);
        expect(die.color).toBeTruthy();
      }
    }
  });

  it('polyhedral set covers all six standard types once', () => {
    const types = COMMON_DICE_SETS.polyhedral.dice.map((d) => d.type).sort();
    expect(types).toEqual(['d10', 'd12', 'd20', 'd4', 'd6', 'd8']);
  });
});
