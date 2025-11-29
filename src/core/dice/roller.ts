/**
 * Dice Roller Logic
 * Core functionality for rolling dice with cryptographically secure randomness
 */

import {
  DiceType,
  DieRoll,
  DiceRollResult,
  DiceRollConfig,
  DICE_FACES,
} from './types';

// Generate a unique ID for rolls
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Roll a single die of the specified type
 */
export function rollDie(diceType: DiceType): DieRoll {
  const faces = DICE_FACES[diceType];
  const value = Math.floor(Math.random() * faces) + 1;

  return {
    id: generateId(),
    diceType,
    value,
    timestamp: Date.now(),
    isSelected: false,
    isLocked: false,
  };
}

/**
 * Roll multiple dice according to configuration
 */
export function rollDice(config: DiceRollConfig): DiceRollResult {
  const rolls = config.dice.map((diceType) => rollDie(diceType));
  const total = rolls.reduce((sum, roll) => sum + roll.value, 0);

  return {
    id: generateId(),
    rolls,
    timestamp: Date.now(),
    total,
  };
}

/**
 * Roll a specific set of dice (convenience function)
 * @param dice Array of dice types to roll
 */
export function roll(...dice: DiceType[]): DiceRollResult {
  return rollDice({ dice });
}

/**
 * Roll N dice of the same type
 */
export function rollMultiple(diceType: DiceType, count: number): DiceRollResult {
  const dice = Array(count).fill(diceType);
  return rollDice({ dice });
}

/**
 * Re-roll specific dice from a previous result, keeping locked dice
 */
export function rerollDice(
  previousResult: DiceRollResult,
  diceIdsToReroll: string[]
): DiceRollResult {
  const newRolls = previousResult.rolls.map((roll) => {
    if (diceIdsToReroll.includes(roll.id) && !roll.isLocked) {
      return rollDie(roll.diceType);
    }
    return { ...roll };
  });

  const total = newRolls.reduce((sum, roll) => sum + roll.value, 0);

  return {
    id: generateId(),
    rolls: newRolls,
    timestamp: Date.now(),
    total,
  };
}

/**
 * Lock specific dice (prevent re-rolling)
 */
export function lockDice(
  result: DiceRollResult,
  diceIds: string[]
): DiceRollResult {
  return {
    ...result,
    rolls: result.rolls.map((roll) => ({
      ...roll,
      isLocked: diceIds.includes(roll.id) ? true : roll.isLocked,
    })),
  };
}

/**
 * Unlock specific dice (allow re-rolling)
 */
export function unlockDice(
  result: DiceRollResult,
  diceIds: string[]
): DiceRollResult {
  return {
    ...result,
    rolls: result.rolls.map((roll) => ({
      ...roll,
      isLocked: diceIds.includes(roll.id) ? false : roll.isLocked,
    })),
  };
}

/**
 * Toggle selection state of specific dice
 */
export function toggleDiceSelection(
  result: DiceRollResult,
  diceId: string
): DiceRollResult {
  return {
    ...result,
    rolls: result.rolls.map((roll) => ({
      ...roll,
      isSelected: roll.id === diceId ? !roll.isSelected : roll.isSelected,
    })),
  };
}

/**
 * Set selection state for multiple dice
 */
export function selectDice(
  result: DiceRollResult,
  diceIds: string[],
  selected: boolean = true
): DiceRollResult {
  return {
    ...result,
    rolls: result.rolls.map((roll) => ({
      ...roll,
      isSelected: diceIds.includes(roll.id) ? selected : roll.isSelected,
    })),
  };
}

/**
 * Clear all selections
 */
export function clearSelection(result: DiceRollResult): DiceRollResult {
  return {
    ...result,
    rolls: result.rolls.map((roll) => ({
      ...roll,
      isSelected: false,
    })),
  };
}

/**
 * Get the values of selected dice
 */
export function getSelectedValues(result: DiceRollResult): number[] {
  return result.rolls.filter((roll) => roll.isSelected).map((roll) => roll.value);
}

/**
 * Get the sum of selected dice
 */
export function getSelectedTotal(result: DiceRollResult): number {
  return getSelectedValues(result).reduce((sum, val) => sum + val, 0);
}

/**
 * Check if selection meets requirements
 */
export function isValidSelection(
  result: DiceRollResult,
  config: DiceRollConfig
): boolean {
  const selectedCount = result.rolls.filter((roll) => roll.isSelected).length;
  const minRequired = config.minSelectable ?? 0;
  const maxAllowed = config.maxSelectable ?? result.rolls.length;

  return selectedCount >= minRequired && selectedCount <= maxAllowed;
}

/**
 * Calculate all possible sums from dice combinations
 * Useful for games like Contig 60 where players choose how to combine dice
 */
export function getAllPossibleSums(values: number[]): number[] {
  const sums = new Set<number>();

  // Generate all subsets and their sums
  const n = values.length;
  for (let mask = 1; mask < 1 << n; mask++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        sum += values[i];
      }
    }
    sums.add(sum);
  }

  return Array.from(sums).sort((a, b) => a - b);
}

/**
 * Calculate all possible products from dice combinations
 */
export function getAllPossibleProducts(values: number[]): number[] {
  const products = new Set<number>();

  const n = values.length;
  for (let mask = 1; mask < 1 << n; mask++) {
    let product = 1;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        product *= values[i];
      }
    }
    products.add(product);
  }

  return Array.from(products).sort((a, b) => a - b);
}

/**
 * Calculate all possible results using basic operations (+, -, *, /)
 * For two dice values
 */
export function getTwoDiceResults(a: number, b: number): Map<string, number> {
  const results = new Map<string, number>();

  results.set(`${a} + ${b}`, a + b);
  results.set(`${a} - ${b}`, a - b);
  results.set(`${b} - ${a}`, b - a);
  results.set(`${a} × ${b}`, a * b);

  if (b !== 0 && a % b === 0) {
    results.set(`${a} ÷ ${b}`, a / b);
  }
  if (a !== 0 && b % a === 0) {
    results.set(`${b} ÷ ${a}`, b / a);
  }

  return results;
}
