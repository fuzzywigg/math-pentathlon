/**
 * Overnight TOKENMAXX HEAVY — lock/unlock/clearSelection empty + immutability leftovers.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  lockDice,
  unlockDice,
  clearSelection,
  getSelectedValues,
  getSelectedTotal,
} from '../../src/core/dice/roller';
import type { RollResult } from '../../src/core/dice/types';

const base: RollResult = {
  id: 'r',
  rolls: [
    {
      id: 'a',
      diceType: 'd8',
      value: 7,
      isSelected: true,
      isLocked: false,
      timestamp: 1,
    },
    {
      id: 'b',
      diceType: 'd8',
      value: 2,
      isSelected: true,
      isLocked: true,
      timestamp: 1,
    },
  ],
  total: 9,
};

describe('Overnight dice — empty lock/unlock + clear immutability', () => {
  it('lock/unlock empty ids leave flags; clearSelection clones', () => {
    const locked = lockDice(base, []);
    expect(locked.rolls.map((d) => d.isLocked)).toEqual([false, true]);
    const unlocked = unlockDice(base, []);
    expect(unlocked.rolls.map((d) => d.isLocked)).toEqual([false, true]);
    const cleared = clearSelection(base);
    expect(cleared).not.toBe(base);
    expect(cleared.rolls.every((d) => !d.isSelected)).toBe(true);
    expect(base.rolls[0].isSelected).toBe(true);
    expect(getSelectedValues(cleared)).toEqual([]);
    expect(getSelectedTotal(cleared)).toBe(0);
    expect(getSelectedValues(base)).toEqual([7, 2]);
  });
});
