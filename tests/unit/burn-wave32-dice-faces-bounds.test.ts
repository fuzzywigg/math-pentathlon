/**
 * Wave 32 — dice face bounds × type matrix with deterministic Math.random.
 * Deepens existing rollDie / DICE_FACES beyond dice.test.ts + wave 27.
 * Distinct from #153 expressions / #154 timer / #151 storage. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  rollDie,
  DICE_FACES,
  DICE_CONFIGS,
  type DiceType,
} from '../../src/core/dice';

const TYPES: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

beforeEach(() => {
  // Step through many distinct fractions so generateId stays unique and
  // floor(r*faces)+1 eventually covers the full face range.
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 997) / 997;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 32 dice-faces — DICE_FACES ↔ DICE_CONFIGS handshake', () => {
  it('every type has matching faces and color in configs', () => {
    for (const type of TYPES) {
      expect(DICE_FACES[type]).toBe(DICE_CONFIGS[type].faces);
      expect(DICE_CONFIGS[type].type).toBe(type);
      expect(DICE_CONFIGS[type].color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe('Wave 32 dice-faces — rollDie inclusive bounds', () => {
  it('can produce every face 1..faces via controlled Math.random', () => {
    for (const type of TYPES) {
      const faces = DICE_FACES[type];
      for (let face = 1; face <= faces; face++) {
        // rollDie: first random → value, second → generateId
        const valueRandom = (face - 1) / faces;
        let call = 0;
        vi.spyOn(Math, 'random').mockImplementation(() => {
          call += 1;
          if (call === 1) return valueRandom;
          return ((call * 37) % 997) / 997;
        });
        const die = rollDie(type);
        expect(die.value).toBe(face);
        expect(die.diceType).toBe(type);
        expect(die.isSelected).toBe(false);
        expect(die.isLocked).toBe(false);
        vi.restoreAllMocks();
      }
    }
  });

  it('floor(random*faces)+1 never exceeds faces at random=0.999… boundary', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999);
    for (const type of TYPES) {
      const die = rollDie(type);
      expect(die.value).toBe(DICE_FACES[type]);
    }
  });

  it('random=0 always yields face 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    for (const type of TYPES) {
      expect(rollDie(type).value).toBe(1);
    }
  });
});
