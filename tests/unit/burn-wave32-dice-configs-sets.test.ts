/**
 * Wave 32 — DICE_CONFIGS / COMMON_DICE_SETS / getDiceConfig catalog contracts.
 * Deepens type catalog stability for game wiring. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  DICE_CONFIGS,
  DICE_FACES,
  COMMON_DICE_SETS,
  getDiceConfig,
  type DiceType,
} from '../../src/core/dice';

const TYPES: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

describe('Wave 32 dice-configs — getDiceConfig parity', () => {
  it('getDiceConfig returns the shared DICE_CONFIGS object entry', () => {
    for (const type of TYPES) {
      expect(getDiceConfig(type)).toBe(DICE_CONFIGS[type]);
      expect(getDiceConfig(type).faces).toBe(DICE_FACES[type]);
    }
  });
});

describe('Wave 32 dice-configs — COMMON_DICE_SETS catalog', () => {
  it('standard / triple / polyhedral / primeGold stay shape-stable', () => {
    expect(Object.keys(COMMON_DICE_SETS).sort()).toEqual(
      ['polyhedral', 'primeGold', 'standard', 'triple'].sort()
    );

    expect(COMMON_DICE_SETS.standard).toMatchObject({
      id: 'standard',
      name: 'Standard (2d6)',
    });
    expect(COMMON_DICE_SETS.standard.dice.map((d) => d.type)).toEqual([
      'd6',
      'd6',
    ]);
    expect(COMMON_DICE_SETS.standard.dice.map((d) => d.color)).toEqual([
      '#2196f3',
      '#f44336',
    ]);

    expect(COMMON_DICE_SETS.triple.dice).toHaveLength(3);
    expect(COMMON_DICE_SETS.triple.dice.every((d) => d.type === 'd6')).toBe(
      true
    );

    expect(COMMON_DICE_SETS.polyhedral.dice.map((d) => d.type)).toEqual(TYPES);
    expect(
      COMMON_DICE_SETS.polyhedral.dice.every(
        (d) => d.faces === DICE_FACES[d.type]
      )
    ).toBe(true);

    expect(COMMON_DICE_SETS.primeGold.dice.map((d) => d.type)).toEqual([
      'd6',
      'd8',
      'd10',
    ]);
    expect(COMMON_DICE_SETS.primeGold.id).toBe('primeGold');
  });

  it('every set die faces match DICE_FACES for its type', () => {
    for (const set of Object.values(COMMON_DICE_SETS)) {
      expect(set.id).toBeTruthy();
      expect(set.name.length).toBeGreaterThan(0);
      for (const die of set.dice) {
        expect(die.faces).toBe(DICE_FACES[die.type]);
        expect(die.color).toBeTruthy();
      }
    }
  });
});
