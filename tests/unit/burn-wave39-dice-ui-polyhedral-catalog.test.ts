/**
 * Wave 39 — polyhedral renderDie catalog leftovers after #172/#173.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  renderDie,
  DICE_CONFIGS,
  type DiceType,
  type DieRoll,
} from '../../src/core/dice';

function die(type: DiceType, value: number): DieRoll {
  return {
    id: `${type}-${value}`,
    diceType: type,
    value,
    isSelected: false,
    isLocked: false,
    timestamp: 1,
  };
}

describe('Wave 39 dice-ui — polyhedral catalog', () => {
  it('d6 uses pips; polyhedral types use die-{type} + number text', () => {
    const d6 = renderDie(die('d6', 4), 48);
    expect(d6.getAttribute('class')).toContain('die-d6');
    expect(d6.querySelectorAll('circle').length).toBeGreaterThan(0);

    for (const type of ['d4', 'd8', 'd10', 'd12', 'd20'] as DiceType[]) {
      const faces = DICE_CONFIGS[type].faces;
      const value = Math.min(faces, 3);
      const svg = renderDie(die(type, value), 48);
      expect(svg.getAttribute('class')).toContain(`die-${type}`);
      expect(svg.querySelector('text')?.textContent).toBe(String(value));
    }
  });

  it('every DiceType in DICE_CONFIGS renders without throw', () => {
    for (const type of Object.keys(DICE_CONFIGS) as DiceType[]) {
      expect(() => renderDie(die(type, 1), 32)).not.toThrow();
    }
  });
});
