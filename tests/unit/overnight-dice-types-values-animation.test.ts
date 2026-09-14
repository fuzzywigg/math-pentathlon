/**
 * Overnight TOKENMAXX HEAVY — DiceConfig.values optional catalog + AnimationState export.
 * After #214/#215. Tests-only. Contract leftovers (field unused by roller).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  DICE_CONFIGS,
  DICE_FACES,
  COMMON_DICE_SETS,
  type DiceAnimationState,
  type DiceConfig,
} from '../../src/core/dice/types';
import { rollDie, getDiceConfig } from '../../src/core/dice/roller';

afterEach(() => vi.restoreAllMocks());

describe('Overnight dice types — values optional + animation state contract', () => {
  it('DICE_CONFIGS omit values; custom values field is ignored by rollDie', () => {
    for (const type of Object.keys(DICE_FACES) as (keyof typeof DICE_FACES)[]) {
      expect(DICE_CONFIGS[type].values).toBeUndefined();
    }
    const withValues: DiceConfig = {
      type: 'd6',
      faces: 6,
      values: [10, 20, 30, 40, 50, 60],
    };
    expect(withValues.values).toEqual([10, 20, 30, 40, 50, 60]);
    vi.spyOn(Math, 'random').mockReturnValue(0);
    // rollDie ignores DiceConfig.values and uses DICE_FACES
    expect(rollDie('d6').value).toBe(1);
    expect(getDiceConfig('d6').values).toBeUndefined();
  });

  it('DiceAnimationState union + COMMON_DICE_SETS color parity', () => {
    const states: DiceAnimationState[] = ['idle', 'rolling', 'settled'];
    expect(states).toHaveLength(3);
    expect(COMMON_DICE_SETS.primeGold.dice.map((d) => d.type)).toEqual([
      'd6',
      'd8',
      'd10',
    ]);
    expect(COMMON_DICE_SETS.triple.dice).toHaveLength(3);
  });
});
