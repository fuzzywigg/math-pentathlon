// Dice Rolling Logic

import { DiceConfig, DiceType, DieRoll, RollResult, DICE_CONFIGS } from './types';

/** Generate a unique ID */
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/** Roll a single die */
export function rollDie(config: DiceConfig): DieRoll {
  const values = config.values || Array.from({ length: config.faces }, (_, i) => i + 1);
  const value = values[Math.floor(Math.random() * values.length)];

  return {
    id: generateId(),
    type: config.type,
    value,
    selected: false,
    used: false,
  };
}

/** Roll a single die by type */
export function rollDieByType(type: DiceType): DieRoll {
  return rollDie(DICE_CONFIGS[type]);
}

/** Roll multiple dice */
export function rollDice(configs: DiceConfig[]): RollResult {
  const dice = configs.map(config => rollDie(config));

  return {
    id: generateId(),
    timestamp: Date.now(),
    dice,
    total: dice.reduce((sum, die) => sum + die.value, 0),
  };
}

/** Roll multiple dice of the same type */
export function rollMultiple(type: DiceType, count: number): RollResult {
  const config = DICE_CONFIGS[type];
  const configs = Array(count).fill(config);
  return rollDice(configs);
}

/** Re-roll specific dice in a result */
export function rerollDice(result: RollResult, dieIds: string[]): RollResult {
  const newDice = result.dice.map(die => {
    if (dieIds.includes(die.id)) {
      const config = DICE_CONFIGS[die.type];
      return rollDie(config);
    }
    return die;
  });

  return {
    ...result,
    id: generateId(),
    timestamp: Date.now(),
    dice: newDice,
    total: newDice.reduce((sum, die) => sum + die.value, 0),
  };
}

/** Get selected dice from a roll result */
export function getSelectedDice(result: RollResult): DieRoll[] {
  return result.dice.filter(die => die.selected);
}

/** Get sum of selected dice */
export function getSelectedSum(result: RollResult): number {
  return getSelectedDice(result).reduce((sum, die) => sum + die.value, 0);
}

/** Toggle die selection */
export function toggleDieSelection(result: RollResult, dieId: string): RollResult {
  return {
    ...result,
    dice: result.dice.map(die =>
      die.id === dieId ? { ...die, selected: !die.selected } : die
    ),
  };
}

/** Mark dice as used */
export function markDiceUsed(result: RollResult, dieIds: string[]): RollResult {
  return {
    ...result,
    dice: result.dice.map(die =>
      dieIds.includes(die.id) ? { ...die, used: true, selected: false } : die
    ),
  };
}

/** Reset all dice to unused */
export function resetDiceUsage(result: RollResult): RollResult {
  return {
    ...result,
    dice: result.dice.map(die => ({ ...die, used: false, selected: false })),
  };
}

/** Check if specific sum can be made from available dice */
export function canMakeSum(result: RollResult, target: number): boolean {
  const availableDice = result.dice.filter(die => !die.used);
  return findCombinationForSum(availableDice, target) !== null;
}

/** Find a combination of dice that makes target sum (returns die IDs or null) */
export function findCombinationForSum(dice: DieRoll[], target: number): string[] | null {
  const n = dice.length;

  // Try all combinations using bit manipulation
  for (let mask = 1; mask < (1 << n); mask++) {
    let sum = 0;
    const ids: string[] = [];

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        sum += dice[i].value;
        ids.push(dice[i].id);
      }
    }

    if (sum === target) {
      return ids;
    }
  }

  return null;
}

/** Get all possible sums from available dice */
export function getAllPossibleSums(result: RollResult): number[] {
  const availableDice = result.dice.filter(die => !die.used);
  const sums = new Set<number>();
  const n = availableDice.length;

  for (let mask = 1; mask < (1 << n); mask++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        sum += availableDice[i].value;
      }
    }
    sums.add(sum);
  }

  return Array.from(sums).sort((a, b) => a - b);
}
