/**
 * Wave 44 — DICE_CONFIGS ↔ DICE_FACES parity leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { DICE_CONFIGS, DICE_FACES, getDiceConfig } from '../../src/core/dice';
import type { DiceType } from '../../src/core/dice';

const TYPES: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

describe('Wave 44 dice — configs faces parity', () => {
  it('every type config matches faces map and getDiceConfig', () => {
    for (const t of TYPES) {
      expect(DICE_CONFIGS[t].faces).toBe(DICE_FACES[t]);
      expect(DICE_CONFIGS[t].type).toBe(t);
      expect(getDiceConfig(t)).toEqual(DICE_CONFIGS[t]);
    }
  });
});
