/**
 * Wave 39 — getDiceConfig face parity with rollDie under mocked RNG.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  getDiceConfig,
  rollDie,
  DICE_FACES,
  type DiceType,
} from '../../src/core/dice';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 39 dice — config roll parity', () => {
  it('getDiceConfig faces match DICE_FACES and bound rollDie', () => {
    const types = Object.keys(DICE_FACES) as DiceType[];
    for (const type of types) {
      const cfg = getDiceConfig(type);
      expect(cfg.faces).toBe(DICE_FACES[type]);
      expect(cfg.type).toBe(type);
    }
  });

  it('rollDie respects face bounds for 0 and ~1 RNG edges', () => {
    for (const type of Object.keys(DICE_FACES) as DiceType[]) {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const low = rollDie(type);
      expect(low.value).toBeGreaterThanOrEqual(1);
      expect(low.value).toBeLessThanOrEqual(DICE_FACES[type]);
      vi.spyOn(Math, 'random').mockReturnValue(0.999999);
      const high = rollDie(type);
      expect(high.value).toBe(DICE_FACES[type]);
      vi.restoreAllMocks();
    }
  });
});
