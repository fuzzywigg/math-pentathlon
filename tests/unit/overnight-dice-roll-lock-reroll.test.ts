/**
 * Overnight TOKENMAXX — dice roll/lock/reroll leftovers after #197. Tests-only. Not demos.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  rollMultiple,
  lockDice,
  unlockDice,
  rerollDice,
  selectDice,
  clearSelection,
  toggleDiceSelection,
  getSelectedValues,
  getSelectedTotal,
  isValidSelection,
} from '../../src/core/dice/roller';

afterEach(() => vi.restoreAllMocks());

describe('Overnight dice — lock/reroll/selection', () => {
  it('lock skips reroll; unlock restores', () => {
    // Build explicit ids — Math.random()===0 makes generateId() empty and collapses locks
    let result = {
      id: 'roll-1',
      rolls: [
        {
          id: 'die-a',
          diceType: 'd6' as const,
          value: 2,
          isSelected: false,
          isLocked: false,
          timestamp: 1,
        },
        {
          id: 'die-b',
          diceType: 'd6' as const,
          value: 3,
          isSelected: false,
          isLocked: false,
          timestamp: 1,
        },
        {
          id: 'die-c',
          diceType: 'd6' as const,
          value: 4,
          isSelected: false,
          isLocked: false,
          timestamp: 1,
        },
      ],
      total: 9,
    };
    result = lockDice(result, ['die-a']);
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    result = rerollDice(result, ['die-a', 'die-b', 'die-c']);
    expect(result.rolls[0].value).toBe(2);
    expect(result.rolls[0].isLocked).toBe(true);
    expect(result.rolls[1].value).toBe(6);
    expect(result.rolls[2].value).toBe(6);
    result = unlockDice(result, ['die-a']);
    expect(result.rolls[0].isLocked).toBe(false);
  });

  it('selection helpers and bounds', () => {
    let result = rollMultiple('d4', 4);
    const ids = result.rolls.map((d) => d.id);
    result = selectDice(result, [ids[0], ids[1]], true);
    expect(getSelectedValues(result)).toHaveLength(2);
    expect(getSelectedTotal(result)).toBe(
      result.rolls[0].value + result.rolls[1].value
    );
    expect(isValidSelection(result, { dice: ['d4', 'd4', 'd4', 'd4'], minSelectable: 2, maxSelectable: 2 })).toBe(true);
    result = toggleDiceSelection(result, ids[2]);
    expect(isValidSelection(result, { dice: ['d4', 'd4', 'd4', 'd4'], maxSelectable: 2 })).toBe(false);
    result = clearSelection(result);
    expect(getSelectedValues(result)).toEqual([]);
  });
});
