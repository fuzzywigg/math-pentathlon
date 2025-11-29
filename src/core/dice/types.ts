/**
 * Dice System Types
 * Core type definitions for the reusable dice system
 */

// Standard dice types used across Math Pentathlon games
export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

// Number of faces for each dice type
export const DICE_FACES: Record<DiceType, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
};

// Result of a single die roll
export interface DieRoll {
  id: string; // Unique identifier for this roll
  diceType: DiceType;
  value: number;
  timestamp: number;
  isSelected?: boolean; // For dice selector UI
  isLocked?: boolean; // For games that allow re-rolling
}

// Result of rolling multiple dice at once
export interface DiceRollResult {
  id: string;
  rolls: DieRoll[];
  timestamp: number;
  total: number; // Sum of all rolls
}

// Configuration for a dice roll action
export interface DiceRollConfig {
  dice: DiceType[]; // Which dice to roll
  minSelectable?: number; // Minimum dice that must be selected
  maxSelectable?: number; // Maximum dice that can be selected
  allowReroll?: boolean; // Whether locked dice can be re-rolled
  maxRerolls?: number; // Maximum number of re-rolls allowed
}

// State of the dice selector component
export interface DiceSelectorState {
  currentRoll: DiceRollResult | null;
  selectedDice: string[]; // IDs of selected dice
  lockedDice: string[]; // IDs of locked dice
  rerollsRemaining: number;
  isRolling: boolean;
}

// History entry for tracking rolls over time
export interface DiceHistoryEntry {
  rollResult: DiceRollResult;
  selectedValues: number[];
  action?: string; // Description of what the roll was used for
}

// Animation configuration for dice rolling
export interface DiceAnimationConfig {
  duration: number; // Total animation duration in ms
  bounceCount: number; // Number of intermediate values to show
  easing: 'linear' | 'easeOut' | 'bounce';
}

// Default animation settings
export const DEFAULT_ANIMATION_CONFIG: DiceAnimationConfig = {
  duration: 600,
  bounceCount: 8,
  easing: 'easeOut',
};

// Visual state of a die during animation
export interface DieVisualState {
  value: number;
  rotation: number; // Degrees of rotation
  scale: number; // For bounce effect
  opacity: number;
}

// Colors for dice faces (used in SVG rendering)
export interface DiceColorScheme {
  face: string;
  border: string;
  pip: string;
  highlight: string;
  shadow: string;
}

// Default color schemes for different dice types
export const DEFAULT_DICE_COLORS: Record<DiceType, DiceColorScheme> = {
  d4: {
    face: '#e8f5e9',
    border: '#2e7d32',
    pip: '#1b5e20',
    highlight: '#c8e6c9',
    shadow: '#1b5e20',
  },
  d6: {
    face: '#ffffff',
    border: '#424242',
    pip: '#212121',
    highlight: '#f5f5f5',
    shadow: '#9e9e9e',
  },
  d8: {
    face: '#e3f2fd',
    border: '#1565c0',
    pip: '#0d47a1',
    highlight: '#bbdefb',
    shadow: '#0d47a1',
  },
  d10: {
    face: '#fff3e0',
    border: '#ef6c00',
    pip: '#e65100',
    highlight: '#ffe0b2',
    shadow: '#e65100',
  },
  d12: {
    face: '#fce4ec',
    border: '#c2185b',
    pip: '#880e4f',
    highlight: '#f8bbd9',
    shadow: '#880e4f',
  },
  d20: {
    face: '#f3e5f5',
    border: '#7b1fa2',
    pip: '#4a148c',
    highlight: '#e1bee7',
    shadow: '#4a148c',
  },
};
