/**
 * Overnight TOKENMAXX HEAVY — isValidSelection min>max contradictory bounds leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  isValidSelection,
  selectDice,
} from '../../src/core/dice/roller';
import type { RollResult } from '../../src/core/dice/types';

function three(): RollResult {
  return {
    id: 'r',
    rolls: [
      {
        id: '1',
        diceType: 'd4',
        value: 1,
        isSelected: false,
        isLocked: false,
        timestamp: 1,
      },
      {
        id: '2',
        diceType: 'd4',
        value: 2,
        isSelected: false,
        isLocked: false,
        timestamp: 1,
      },
      {
        id: '3',
        diceType: 'd4',
        value: 3,
        isSelected: false,
        isLocked: false,
        timestamp: 1,
      },
    ],
    total: 6,
  };
}

describe('Overnight dice — contradictory min/max selectable', () => {
  it('minSelectable > maxSelectable rejects every selection count', () => {
    const bounds = {
      dice: ['d4', 'd4', 'd4'] as const,
      minSelectable: 3,
      maxSelectable: 1,
    };
    let r = three();
    expect(isValidSelection(r, { ...bounds, dice: [...bounds.dice] })).toBe(
      false
    );
    r = selectDice(r, ['1'], true);
    expect(isValidSelection(r, { ...bounds, dice: [...bounds.dice] })).toBe(
      false
    );
    r = selectDice(r, ['2', '3'], true);
    expect(isValidSelection(r, { ...bounds, dice: [...bounds.dice] })).toBe(
      false
    );
  });
});
