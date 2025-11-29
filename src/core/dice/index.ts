/**
 * Dice System
 * Reusable dice rolling, rendering, and selection components
 *
 * Used by: Sum Dominoes, Juggle, Contig 60, Prime Gold, Remainder Islands
 */

// Types
export type {
  DiceType,
  DieRoll,
  DiceRollResult,
  DiceRollConfig,
  DiceSelectorState,
  DiceHistoryEntry,
  DiceAnimationConfig,
  DiceColorScheme,
} from './types';

export {
  DICE_FACES,
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_DICE_COLORS,
} from './types';

// Roller logic
export {
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
} from './roller';

// UI rendering
export {
  renderDie,
  renderD6,
  renderPolyhedralDie,
  renderDieRoll,
  renderDiceRollResult,
  animateDieRoll,
  animateDiceRoll,
  getDiceStyles,
} from './dice-ui';

// Dice selector component
export { DiceSelector, createDiceSelector } from './dice-selector';
export type { DiceSelectorOptions } from './dice-selector';

// History component
export { DiceHistory, createDiceHistory } from './dice-history';
export type { DiceHistoryOptions } from './dice-history';
