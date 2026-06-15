// Dice Rolling Logic

import { DiceConfig, DiceType, DieRoll, RollResult, RollConfig, DICE_CONFIGS, DICE_FACES } from './types';

/** Generate a unique ID */
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/** Roll a single die by type */
export function rollDie(type: DiceType): DieRoll {
  const faces = DICE_FACES[type];
  const value = Math.floor(Math.random() * faces) + 1;
  return {
    id: generateId(),
    diceType: type,
    value,
    isSelected: false,
    isLocked: false,
    timestamp: Date.now(),
  };
}

/** Roll multiple dice from a config */
export function rollDice(config: RollConfig): RollResult {
  const rolls = config.dice.map(type => rollDie(type));
  return {
    id: generateId(),
    rolls,
    total: rolls.reduce((sum, die) => sum + die.value, 0),
  };
}

/** Convenience: roll specified dice types */
export function roll(...types: DiceType[]): RollResult {
  return rollDice({ dice: types });
}

/** Roll multiple dice of the same type */
export function rollMultiple(type: DiceType, count: number): RollResult {
  return rollDice({ dice: Array(count).fill(type) });
}

/** Re-roll specific dice (skips locked dice) */
export function rerollDice(result: RollResult, dieIds: string[]): RollResult {
  const newRolls = result.rolls.map(die => {
    if (dieIds.includes(die.id) && !die.isLocked) {
      return rollDie(die.diceType);
    }
    return die;
  });
  return {
    id: generateId(),
    rolls: newRolls,
    total: newRolls.reduce((sum, die) => sum + die.value, 0),
  };
}

/** Lock specified dice (prevent reroll) */
export function lockDice(result: RollResult, dieIds: string[]): RollResult {
  return {
    ...result,
    rolls: result.rolls.map(die =>
      dieIds.includes(die.id) ? { ...die, isLocked: true } : die
    ),
  };
}

/** Unlock specified dice */
export function unlockDice(result: RollResult, dieIds: string[]): RollResult {
  return {
    ...result,
    rolls: result.rolls.map(die =>
      dieIds.includes(die.id) ? { ...die, isLocked: false } : die
    ),
  };
}

/** Toggle selection state of a single die */
export function toggleDiceSelection(result: RollResult, dieId: string): RollResult {
  return {
    ...result,
    rolls: result.rolls.map(die =>
      die.id === dieId ? { ...die, isSelected: !die.isSelected } : die
    ),
  };
}

/** Select or deselect specific dice */
export function selectDice(result: RollResult, dieIds: string[], selected: boolean): RollResult {
  return {
    ...result,
    rolls: result.rolls.map(die =>
      dieIds.includes(die.id) ? { ...die, isSelected: selected } : die
    ),
  };
}

/** Clear all selections */
export function clearSelection(result: RollResult): RollResult {
  return {
    ...result,
    rolls: result.rolls.map(die => ({ ...die, isSelected: false })),
  };
}

/** Get values of selected dice */
export function getSelectedValues(result: RollResult): number[] {
  return result.rolls.filter(die => die.isSelected).map(die => die.value);
}

/** Get sum of selected dice */
export function getSelectedTotal(result: RollResult): number {
  return result.rolls
    .filter(die => die.isSelected)
    .reduce((sum, die) => sum + die.value, 0);
}

/** Check if current selection satisfies the config constraints */
export function isValidSelection(result: RollResult, config: RollConfig): boolean {
  const selectedCount = result.rolls.filter(d => d.isSelected).length;
  if (config.minSelectable !== undefined && selectedCount < config.minSelectable) return false;
  if (config.maxSelectable !== undefined && selectedCount > config.maxSelectable) return false;
  return true;
}

/** Get all possible subset sums from an array of values */
export function getAllPossibleSums(values: number[]): number[] {
  const sums = new Set<number>();
  const n = values.length;
  for (let mask = 1; mask < (1 << n); mask++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) sum += values[i];
    }
    sums.add(sum);
  }
  return Array.from(sums).sort((a, b) => a - b);
}

/** Get all possible subset products from an array of values */
export function getAllPossibleProducts(values: number[]): number[] {
  const products = new Set<number>();
  const n = values.length;
  for (let mask = 1; mask < (1 << n); mask++) {
    let product = 1;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) product *= values[i];
    }
    products.add(product);
  }
  return Array.from(products).sort((a, b) => a - b);
}

/** Get all possible arithmetic results from two dice values */
export function getTwoDiceResults(a: number, b: number): Map<string, number> {
  const results = new Map<string, number>();
  results.set(`${a} + ${b}`, a + b);
  results.set(`${a} - ${b}`, a - b);
  results.set(`${b} - ${a}`, b - a);
  results.set(`${a} × ${b}`, a * b);
  // Only include integer divisions
  if (b !== 0 && a % b === 0) results.set(`${a} ÷ ${b}`, a / b);
  if (a !== 0 && b % a === 0) results.set(`${b} ÷ ${a}`, b / a);
  return results;
}

// ---- Legacy helpers kept for internal UI usage ----

/** @internal Get a DiceConfig for a type */
export function getDiceConfig(type: DiceType): DiceConfig {
  return DICE_CONFIGS[type];
}
