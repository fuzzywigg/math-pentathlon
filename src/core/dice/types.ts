// Dice System Types

/** Standard dice types by number of faces */
export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

/** Dice face configuration */
export interface DiceConfig {
  type: DiceType;
  faces: number;
  /** Custom face values (default: 1 to faces) */
  values?: number[];
  /** Display color */
  color?: string;
}

/** Standard dice configurations */
export const DICE_CONFIGS: Record<DiceType, DiceConfig> = {
  d4: { type: 'd4', faces: 4, color: '#e91e63' },
  d6: { type: 'd6', faces: 6, color: '#2196f3' },
  d8: { type: 'd8', faces: 8, color: '#4caf50' },
  d10: { type: 'd10', faces: 10, color: '#ff9800' },
  d12: { type: 'd12', faces: 12, color: '#9c27b0' },
  d20: { type: 'd20', faces: 20, color: '#f44336' },
};

/** Result of a single die roll */
export interface DieRoll {
  id: string;
  type: DiceType;
  value: number;
  /** Whether this die is selected (for combination UI) */
  selected?: boolean;
  /** Whether this die has been used */
  used?: boolean;
}

/** Result of rolling multiple dice */
export interface RollResult {
  id: string;
  timestamp: number;
  dice: DieRoll[];
  /** Sum of all dice */
  total: number;
}

/** Dice set configuration for a game */
export interface DiceSet {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Dice in this set */
  dice: DiceConfig[];
}

/** Common dice sets used in Math Pentathlon */
export const COMMON_DICE_SETS: Record<string, DiceSet> = {
  standard: {
    id: 'standard',
    name: 'Standard (2d6)',
    dice: [
      { type: 'd6', faces: 6, color: '#2196f3' },
      { type: 'd6', faces: 6, color: '#f44336' },
    ],
  },
  triple: {
    id: 'triple',
    name: 'Triple (3d6)',
    dice: [
      { type: 'd6', faces: 6, color: '#2196f3' },
      { type: 'd6', faces: 6, color: '#f44336' },
      { type: 'd6', faces: 6, color: '#4caf50' },
    ],
  },
  polyhedral: {
    id: 'polyhedral',
    name: 'Polyhedral Set',
    dice: [
      { type: 'd4', faces: 4, color: '#e91e63' },
      { type: 'd6', faces: 6, color: '#2196f3' },
      { type: 'd8', faces: 8, color: '#4caf50' },
      { type: 'd10', faces: 10, color: '#ff9800' },
      { type: 'd12', faces: 12, color: '#9c27b0' },
      { type: 'd20', faces: 20, color: '#f44336' },
    ],
  },
  primeGold: {
    id: 'primeGold',
    name: 'Prime Gold (3 polyhedral)',
    dice: [
      { type: 'd6', faces: 6, color: '#2196f3' },
      { type: 'd8', faces: 8, color: '#4caf50' },
      { type: 'd10', faces: 10, color: '#ff9800' },
    ],
  },
};

/** Animation state for dice rolling */
export type DiceAnimationState = 'idle' | 'rolling' | 'settled';

/** Callback types */
export type RollCallback = (result: RollResult) => void;
export type DieSelectCallback = (dieId: string, selected: boolean) => void;
