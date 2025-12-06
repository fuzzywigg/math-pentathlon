/**
 * Dice System Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  DiceType,
  DICE_FACES,
  rollDie,
  rollDice,
  roll,
  rollMultiple,
  rerollDice,
  lockDice,
  unlockDice,
  toggleDiceSelection,
  selectDice,
  clearSelection,
  getSelectedValues,
  getSelectedTotal,
  isValidSelection,
  getAllPossibleSums,
  getAllPossibleProducts,
  getTwoDiceResults,
} from '../../src/core/dice';

describe('Dice Types', () => {
  it('should have correct face counts for all dice types', () => {
    expect(DICE_FACES.d4).toBe(4);
    expect(DICE_FACES.d6).toBe(6);
    expect(DICE_FACES.d8).toBe(8);
    expect(DICE_FACES.d10).toBe(10);
    expect(DICE_FACES.d12).toBe(12);
    expect(DICE_FACES.d20).toBe(20);
  });
});

describe('rollDie', () => {
  it('should roll a d6 within valid range', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDie('d6');
      expect(result.value).toBeGreaterThanOrEqual(1);
      expect(result.value).toBeLessThanOrEqual(6);
      expect(result.diceType).toBe('d6');
    }
  });

  it('should roll a d20 within valid range', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDie('d20');
      expect(result.value).toBeGreaterThanOrEqual(1);
      expect(result.value).toBeLessThanOrEqual(20);
      expect(result.diceType).toBe('d20');
    }
  });

  it('should generate unique IDs for each roll', () => {
    const rolls = Array.from({ length: 10 }, () => rollDie('d6'));
    const ids = rolls.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(10);
  });

  it('should set correct initial state', () => {
    const result = rollDie('d6');
    expect(result.isSelected).toBe(false);
    expect(result.isLocked).toBe(false);
    expect(result.timestamp).toBeLessThanOrEqual(Date.now());
  });

  const diceTypes: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

  for (const diceType of diceTypes) {
    it(`should roll ${diceType} within valid range`, () => {
      const maxValue = DICE_FACES[diceType];
      for (let i = 0; i < 50; i++) {
        const result = rollDie(diceType);
        expect(result.value).toBeGreaterThanOrEqual(1);
        expect(result.value).toBeLessThanOrEqual(maxValue);
      }
    });
  }
});

describe('rollDice', () => {
  it('should roll multiple dice', () => {
    const result = rollDice({ dice: ['d6', 'd6', 'd6'] });
    expect(result.rolls).toHaveLength(3);
    expect(result.rolls.every((r) => r.diceType === 'd6')).toBe(true);
  });

  it('should calculate total correctly', () => {
    const result = rollDice({ dice: ['d6', 'd6'] });
    const expectedTotal = result.rolls[0].value + result.rolls[1].value;
    expect(result.total).toBe(expectedTotal);
  });

  it('should handle mixed dice types', () => {
    const result = rollDice({ dice: ['d4', 'd6', 'd8', 'd10'] });
    expect(result.rolls).toHaveLength(4);
    expect(result.rolls[0].diceType).toBe('d4');
    expect(result.rolls[1].diceType).toBe('d6');
    expect(result.rolls[2].diceType).toBe('d8');
    expect(result.rolls[3].diceType).toBe('d10');
  });
});

describe('roll (convenience function)', () => {
  it('should roll specified dice', () => {
    const result = roll('d6', 'd6');
    expect(result.rolls).toHaveLength(2);
  });

  it('should work with single die', () => {
    const result = roll('d20');
    expect(result.rolls).toHaveLength(1);
    expect(result.rolls[0].diceType).toBe('d20');
  });
});

describe('rollMultiple', () => {
  it('should roll N dice of same type', () => {
    const result = rollMultiple('d6', 4);
    expect(result.rolls).toHaveLength(4);
    expect(result.rolls.every((r) => r.diceType === 'd6')).toBe(true);
  });

  it('should calculate total correctly', () => {
    const result = rollMultiple('d6', 3);
    const sum = result.rolls.reduce((acc, r) => acc + r.value, 0);
    expect(result.total).toBe(sum);
  });
});

describe('rerollDice', () => {
  it('should reroll specified dice', () => {
    const original = rollMultiple('d6', 3);
    const diceToReroll = [original.rolls[0].id];

    // Force different values to ensure reroll happened
    // (We can't guarantee different values, but we can check structure)
    const rerolled = rerollDice(original, diceToReroll);

    expect(rerolled.rolls).toHaveLength(3);
    expect(rerolled.id).not.toBe(original.id);
  });

  it('should not reroll locked dice', () => {
    const original = rollMultiple('d6', 2);
    const locked = lockDice(original, [original.rolls[0].id]);
    const diceToReroll = [locked.rolls[0].id]; // Try to reroll locked die

    const rerolled = rerollDice(locked, diceToReroll);

    // Locked die should keep its value
    expect(rerolled.rolls[0].value).toBe(locked.rolls[0].value);
  });

  it('should preserve dice that are not being rerolled', () => {
    const original = rollMultiple('d6', 3);
    const diceToReroll = [original.rolls[1].id];

    const rerolled = rerollDice(original, diceToReroll);

    expect(rerolled.rolls[0].value).toBe(original.rolls[0].value);
    expect(rerolled.rolls[2].value).toBe(original.rolls[2].value);
  });
});

describe('lockDice / unlockDice', () => {
  it('should lock specified dice', () => {
    const original = rollMultiple('d6', 3);
    const locked = lockDice(original, [original.rolls[0].id, original.rolls[2].id]);

    expect(locked.rolls[0].isLocked).toBe(true);
    expect(locked.rolls[1].isLocked).toBe(false);
    expect(locked.rolls[2].isLocked).toBe(true);
  });

  it('should unlock specified dice', () => {
    const original = rollMultiple('d6', 2);
    const locked = lockDice(original, [original.rolls[0].id, original.rolls[1].id]);
    const unlocked = unlockDice(locked, [original.rolls[0].id]);

    expect(unlocked.rolls[0].isLocked).toBe(false);
    expect(unlocked.rolls[1].isLocked).toBe(true);
  });
});

describe('toggleDiceSelection', () => {
  it('should toggle selection state', () => {
    const original = rollDice({ dice: ['d6'] });
    const dieId = original.rolls[0].id;

    expect(original.rolls[0].isSelected).toBe(false);

    const selected = toggleDiceSelection(original, dieId);
    expect(selected.rolls[0].isSelected).toBe(true);

    const deselected = toggleDiceSelection(selected, dieId);
    expect(deselected.rolls[0].isSelected).toBe(false);
  });
});

describe('selectDice', () => {
  it('should select multiple dice', () => {
    const original = rollMultiple('d6', 3);
    const selected = selectDice(original, [original.rolls[0].id, original.rolls[2].id], true);

    expect(selected.rolls[0].isSelected).toBe(true);
    expect(selected.rolls[1].isSelected).toBe(false);
    expect(selected.rolls[2].isSelected).toBe(true);
  });

  it('should deselect dice when selected=false', () => {
    const original = rollMultiple('d6', 2);
    const selected = selectDice(original, [original.rolls[0].id, original.rolls[1].id], true);
    const deselected = selectDice(selected, [original.rolls[0].id], false);

    expect(deselected.rolls[0].isSelected).toBe(false);
    expect(deselected.rolls[1].isSelected).toBe(true);
  });
});

describe('clearSelection', () => {
  it('should clear all selections', () => {
    const original = rollMultiple('d6', 3);
    const selected = selectDice(original, original.rolls.map((r) => r.id), true);
    const cleared = clearSelection(selected);

    expect(cleared.rolls.every((r) => r.isSelected === false)).toBe(true);
  });
});

describe('getSelectedValues', () => {
  it('should return values of selected dice', () => {
    const original = rollMultiple('d6', 3);
    const selected = selectDice(original, [original.rolls[0].id, original.rolls[2].id], true);

    const values = getSelectedValues(selected);

    expect(values).toHaveLength(2);
    expect(values).toContain(original.rolls[0].value);
    expect(values).toContain(original.rolls[2].value);
  });

  it('should return empty array when nothing selected', () => {
    const original = rollMultiple('d6', 3);
    const values = getSelectedValues(original);
    expect(values).toHaveLength(0);
  });
});

describe('getSelectedTotal', () => {
  it('should return sum of selected dice', () => {
    const original = rollMultiple('d6', 3);
    const selected = selectDice(original, original.rolls.map((r) => r.id), true);

    const total = getSelectedTotal(selected);
    const expectedTotal = original.rolls.reduce((acc, r) => acc + r.value, 0);

    expect(total).toBe(expectedTotal);
  });

  it('should return 0 when nothing selected', () => {
    const original = rollMultiple('d6', 3);
    expect(getSelectedTotal(original)).toBe(0);
  });
});

describe('isValidSelection', () => {
  it('should validate minimum selection requirement', () => {
    const original = rollMultiple('d6', 3);

    const config = { dice: ['d6', 'd6', 'd6'] as DiceType[], minSelectable: 2 };

    // No selection - invalid
    expect(isValidSelection(original, config)).toBe(false);

    // One selected - invalid
    const oneSelected = selectDice(original, [original.rolls[0].id], true);
    expect(isValidSelection(oneSelected, config)).toBe(false);

    // Two selected - valid
    const twoSelected = selectDice(original, [original.rolls[0].id, original.rolls[1].id], true);
    expect(isValidSelection(twoSelected, config)).toBe(true);
  });

  it('should validate maximum selection requirement', () => {
    const original = rollMultiple('d6', 3);
    const config = { dice: ['d6', 'd6', 'd6'] as DiceType[], maxSelectable: 2 };

    // Two selected - valid
    const twoSelected = selectDice(original, [original.rolls[0].id, original.rolls[1].id], true);
    expect(isValidSelection(twoSelected, config)).toBe(true);

    // Three selected - invalid
    const threeSelected = selectDice(original, original.rolls.map((r) => r.id), true);
    expect(isValidSelection(threeSelected, config)).toBe(false);
  });

  it('should validate exact selection requirement', () => {
    const original = rollMultiple('d6', 3);
    const config = { dice: ['d6', 'd6', 'd6'] as DiceType[], minSelectable: 2, maxSelectable: 2 };

    // One selected - invalid
    const oneSelected = selectDice(original, [original.rolls[0].id], true);
    expect(isValidSelection(oneSelected, config)).toBe(false);

    // Two selected - valid
    const twoSelected = selectDice(original, [original.rolls[0].id, original.rolls[1].id], true);
    expect(isValidSelection(twoSelected, config)).toBe(true);

    // Three selected - invalid
    const threeSelected = selectDice(original, original.rolls.map((r) => r.id), true);
    expect(isValidSelection(threeSelected, config)).toBe(false);
  });
});

describe('getAllPossibleSums', () => {
  it('should return all subset sums', () => {
    const values = [1, 2, 3];
    const sums = getAllPossibleSums(values);

    // Subsets: {1}=1, {2}=2, {3}=3, {1,2}=3, {1,3}=4, {2,3}=5, {1,2,3}=6
    expect(sums).toContain(1);
    expect(sums).toContain(2);
    expect(sums).toContain(3);
    expect(sums).toContain(4);
    expect(sums).toContain(5);
    expect(sums).toContain(6);
  });

  it('should return sorted unique values', () => {
    const values = [2, 2, 2];
    const sums = getAllPossibleSums(values);

    // Subsets: {2}=2, {2,2}=4, {2,2,2}=6 (duplicates removed)
    expect(sums).toEqual([2, 4, 6]);
  });

  it('should handle single value', () => {
    const sums = getAllPossibleSums([5]);
    expect(sums).toEqual([5]);
  });
});

describe('getAllPossibleProducts', () => {
  it('should return all subset products', () => {
    const values = [2, 3, 4];
    const products = getAllPossibleProducts(values);

    // Subsets: {2}=2, {3}=3, {4}=4, {2,3}=6, {2,4}=8, {3,4}=12, {2,3,4}=24
    expect(products).toContain(2);
    expect(products).toContain(3);
    expect(products).toContain(4);
    expect(products).toContain(6);
    expect(products).toContain(8);
    expect(products).toContain(12);
    expect(products).toContain(24);
  });

  it('should return sorted unique values', () => {
    const values = [2, 2];
    const products = getAllPossibleProducts(values);

    // Subsets: {2}=2, {2,2}=4 (duplicates removed)
    expect(products).toEqual([2, 4]);
  });
});

describe('getTwoDiceResults', () => {
  it('should return all basic operations', () => {
    const results = getTwoDiceResults(6, 3);

    expect(results.get('6 + 3')).toBe(9);
    expect(results.get('6 - 3')).toBe(3);
    expect(results.get('3 - 6')).toBe(-3);
    expect(results.get('6 × 3')).toBe(18);
    expect(results.get('6 ÷ 3')).toBe(2);
  });

  it('should only include valid divisions', () => {
    const results = getTwoDiceResults(5, 3);

    // 5 / 3 is not a whole number
    expect(results.has('5 ÷ 3')).toBe(false);
    expect(results.has('3 ÷ 5')).toBe(false);
  });

  it('should handle division by zero', () => {
    const results = getTwoDiceResults(6, 0);

    // Should not include division by zero
    expect(results.has('6 ÷ 0')).toBe(false);
  });

  it('should include both division directions when valid', () => {
    const results = getTwoDiceResults(6, 2);

    expect(results.get('6 ÷ 2')).toBe(3);
    // 2 / 6 is not a whole number
    expect(results.has('2 ÷ 6')).toBe(false);

    const results2 = getTwoDiceResults(4, 4);
    expect(results2.get('4 ÷ 4')).toBe(1);
  });
});
