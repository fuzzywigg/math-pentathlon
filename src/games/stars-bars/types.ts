// Stars & Bars Types
// Attribute logic game with geometric cards

export type Player = 'player1' | 'player2';

// Four attributes for each card
export type Shape = 'circle' | 'square' | 'triangle' | 'hexagon' | 'rectangle';
export type CardColor = 'red' | 'blue' | 'yellow';
export type Size = 'small' | 'large';
export type Thickness = 'thin' | 'thick';

export interface AttributeCard {
  id: string;
  shape: Shape;
  color: CardColor;
  size: Size;
  thickness: Thickness;
}

export interface BoardCell {
  row: number;
  col: number;
  card: AttributeCard | null;
  owner: Player | null;
  isStar: boolean; // Star cells score double
}

export interface MoveRecord {
  player: Player;
  card: AttributeCard;
  row: number;
  col: number;
  score: number;
  breakdown: string;
}

export interface StarsState {
  cells: BoardCell[][];
  playerHands: Record<Player, AttributeCard[]>;
  playerScores: Record<Player, number>;
  currentPlayer: Player;
  selectedCard: AttributeCard | null;
  phase: 'selectingCard' | 'placingCard' | 'gameOver';
  winner: Player | null;
  moveHistory: MoveRecord[];
  deck: AttributeCard[];
  lastMove: { row: number; col: number } | null;
}

// Configuration
export const CONFIG = {
  BOARD_SIZE: 5,
  HAND_SIZE: 5,
  CARDS_PER_ATTRIBUTE: 1, // Results in 60 unique cards (5 shapes × 3 colors × 2 sizes × 2 thicknesses)
  TARGET_SCORE: 30,
};

export const SHAPES: Shape[] = ['circle', 'square', 'triangle', 'hexagon', 'rectangle'];
export const COLORS: CardColor[] = ['red', 'blue', 'yellow'];
export const SIZES: Size[] = ['small', 'large'];
export const THICKNESSES: Thickness[] = ['thin', 'thick'];

// Color values for rendering
export const COLOR_VALUES: Record<CardColor, string> = {
  red: '#e53935',
  blue: '#1976d2',
  yellow: '#fdd835',
};

/**
 * Count how many attributes differ between two cards
 */
export function countDifferences(card1: AttributeCard, card2: AttributeCard): number {
  let diff = 0;
  if (card1.shape !== card2.shape) diff++;
  if (card1.color !== card2.color) diff++;
  if (card1.size !== card2.size) diff++;
  if (card1.thickness !== card2.thickness) diff++;
  return diff;
}

/**
 * Get a description of the differences
 */
export function getDifferenceDescription(card1: AttributeCard, card2: AttributeCard): string {
  const diffs: string[] = [];
  if (card1.shape !== card2.shape) diffs.push('shape');
  if (card1.color !== card2.color) diffs.push('color');
  if (card1.size !== card2.size) diffs.push('size');
  if (card1.thickness !== card2.thickness) diffs.push('thickness');
  return diffs.join(', ');
}
