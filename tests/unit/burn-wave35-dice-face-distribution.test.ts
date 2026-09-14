/**
 * Wave 35 — face bounds + deterministic face mapping leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollDie,
  rollMultiple,
  DICE_FACES,
  type DiceType,
} from '../../src/core/dice';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 35 dice-faces — bounds under random stream', () => {
  it('100 rolls per type stay within 1..faces', () => {
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return (n % 997) / 997;
    });
    for (const type of Object.keys(DICE_FACES) as DiceType[]) {
      const faces = DICE_FACES[type];
      for (let i = 0; i < 100; i++) {
        const v = rollDie(type).value;
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(faces);
      }
    }
  });

  it('rollMultiple respects per-die face caps', () => {
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return (n % 89) / 89;
    });
    for (const type of Object.keys(DICE_FACES) as DiceType[]) {
      const result = rollMultiple(type, 20);
      for (const die of result.rolls) {
        expect(die.value).toBeGreaterThanOrEqual(1);
        expect(die.value).toBeLessThanOrEqual(DICE_FACES[type]);
      }
    }
  });
});

describe('Wave 35 dice-faces — clamp at high/low random', () => {
  it('random just below 1 maps to max face', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999);
    expect(rollDie('d6').value).toBe(6);
    expect(rollDie('d20').value).toBe(20);
    expect(rollDie('d4').value).toBe(4);
  });

  it('random 0 maps to face 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(rollDie('d10').value).toBe(1);
    expect(rollDie('d12').value).toBe(1);
  });
});
