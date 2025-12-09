// Stars & Bars AI Module
// Strategic AI for attribute logic placement game
//
// EDUCATIONAL NOTES:
// Stars & Bars teaches logical thinking and attribute comparison.
// Key skills: Identifying similarities/differences, strategic placement,
// maximizing differences for points.
//
// Strategy tips for learners:
// 1. Each card has 4 attributes: shape, color, size, thickness
// 2. Score = sum of differences with ALL adjacent cards (up to 8 neighbors!)
// 3. Star cells (corners + center) DOUBLE your score - target these!
// 4. Maximum 4 points per neighbor (all 4 attributes different)
// 5. Look for cards that are "opposite" to multiple neighbors
// 6. Early center control gives more scoring opportunities

import {
  StarsState,
  Player,
  AttributeCard,
  CONFIG,
  countDifferences,
} from './types';
import {
  selectCard,
  placeCard,
  getValidPlacements,
  hasValidMoves,
  passTurn,
} from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { randomness: 0.5, teachingMode: true },
  medium: { randomness: 0.15, teachingMode: false },
  hard: { randomness: 0.03, teachingMode: false },
};

// =============================================================================
// Move Evaluation
// =============================================================================

interface MoveOption {
  cardId: string;
  row: number;
  col: number;
  score: number;
  reasoning: string;
  immediatePoints: number;
}

/**
 * Get adjacent cells with cards
 */
function getAdjacentCards(state: StarsState, row: number, col: number): AttributeCard[] {
  const cards: AttributeCard[] = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  for (const [dr, dc] of directions) {
    const adjRow = row + dr;
    const adjCol = col + dc;

    if (
      adjRow >= 0 &&
      adjRow < CONFIG.BOARD_SIZE &&
      adjCol >= 0 &&
      adjCol < CONFIG.BOARD_SIZE
    ) {
      const adjCell = state.cells[adjRow][adjCol];
      if (adjCell.card) {
        cards.push(adjCell.card);
      }
    }
  }

  return cards;
}

/**
 * Calculate immediate points for a placement
 */
function calculateImmediatePoints(
  state: StarsState,
  card: AttributeCard,
  row: number,
  col: number
): number {
  const cell = state.cells[row][col];
  const adjacentCards = getAdjacentCards(state, row, col);

  let points = 0;
  for (const adjCard of adjacentCards) {
    points += countDifferences(card, adjCard);
  }

  // Double for star cells
  if (cell.isStar && points > 0) {
    points *= 2;
  }

  return points;
}

/**
 * Evaluate all possible moves
 */
function evaluateMoves(
  state: StarsState,
  player: Player,
  _difficulty: AIDifficulty
): MoveOption[] {
  const hand = state.playerHands[player];
  const validPlacements = getValidPlacements(state);
  const moves: MoveOption[] = [];

  for (const card of hand) {
    for (const { row, col } of validPlacements) {
      const cell = state.cells[row][col];
      const immediatePoints = calculateImmediatePoints(state, card, row, col);

      let score = immediatePoints * 10; // Base score from points
      const reasons: string[] = [];

      if (immediatePoints > 0) {
        reasons.push(`${immediatePoints} points`);
      }

      // Factor 1: Star cell bonus (high value targets)
      if (cell.isStar) {
        score += 30;
        reasons.push('Star cell target');
      }

      // Factor 2: Position value - center gives more future adjacencies
      const centerDist = Math.abs(row - 2) + Math.abs(col - 2);
      if (centerDist === 0) {
        score += 25;
        reasons.push('Center control');
      } else if (centerDist <= 2) {
        score += 15 - centerDist * 3;
        reasons.push('Near center');
      }

      // Factor 3: Adjacency count - more neighbors = more points potential
      const adjacentCards = getAdjacentCards(state, row, col);
      if (adjacentCards.length >= 3) {
        score += adjacentCards.length * 5;
        reasons.push(`${adjacentCards.length} neighbors`);
      }

      // Factor 4: Card efficiency - use cards that are "extreme"
      // (all-different from common cards)
      const avgDifference = adjacentCards.length > 0
        ? adjacentCards.reduce((sum, adj) => sum + countDifferences(card, adj), 0) / adjacentCards.length
        : 2;
      if (avgDifference >= 3.5) {
        score += 20;
        reasons.push('High-contrast card');
      }

      // Factor 5: Check if this could win the game
      const currentScore = state.playerScores[player];
      if (currentScore + immediatePoints >= CONFIG.TARGET_SCORE) {
        score += 10000;
        reasons.push('Winning move!');
      }

      // Factor 6: Edge positions are less valuable (fewer potential neighbors)
      const isEdge = row === 0 || row === CONFIG.BOARD_SIZE - 1 ||
                     col === 0 || col === CONFIG.BOARD_SIZE - 1;
      if (isEdge && !cell.isStar) {
        score -= 10;
      }

      moves.push({
        cardId: card.id,
        row,
        col,
        score,
        reasoning: reasons.join('; ') || 'Standard placement',
        immediatePoints,
      });
    }
  }

  moves.sort((a, b) => b.score - a.score);
  return moves;
}

// =============================================================================
// Teaching Mode
// =============================================================================

/**
 * In easy mode, occasionally miss the best scoring opportunities
 */
function getTeachingMove(state: StarsState, player: Player): MoveOption | null {
  const moves = evaluateMoves(state, player, 'easy');

  if (moves.length === 0) return null;

  // 40% chance to pick a lower-scoring move
  if (Math.random() < 0.4 && moves.length > 1) {
    // Pick a move that's not the best but still reasonable
    const suboptimal = moves.slice(1, Math.min(5, moves.length));
    if (suboptimal.length > 0) {
      return suboptimal[Math.floor(Math.random() * suboptimal.length)];
    }
  }

  return moves[0];
}

// =============================================================================
// Public API
// =============================================================================

export interface AIMove {
  cardId: string;
  row: number;
  col: number;
  hint?: string;
}

/**
 * Get AI's move decision
 */
export function getAIMove(
  state: StarsState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIMove | null {
  if (state.phase === 'gameOver') return null;
  if (state.currentPlayer !== aiPlayer) return null;

  // Check if we have any valid moves
  if (!hasValidMoves(state)) {
    return null; // Will need to pass
  }

  const config = DIFFICULTY_CONFIG[difficulty];

  // Teaching mode for easy difficulty
  if (config.teachingMode) {
    const result = getTeachingMove(state, aiPlayer);
    if (result) {
      return { cardId: result.cardId, row: result.row, col: result.col };
    }
  }

  const moves = evaluateMoves(state, aiPlayer, difficulty);

  if (moves.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && moves.length > 1) {
    const topMoves = moves.slice(0, 3);
    const chosen = topMoves[Math.floor(Math.random() * topMoves.length)];
    return { cardId: chosen.cardId, row: chosen.row, col: chosen.col };
  }

  return { cardId: moves[0].cardId, row: moves[0].row, col: moves[0].col };
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: StarsState,
  aiPlayer: Player | null,
  gameMode: 'human-vs-human' | 'human-vs-ai'
): boolean {
  if (gameMode !== 'human-vs-ai') return false;
  if (!aiPlayer) return false;
  if (state.phase === 'gameOver') return false;

  return state.currentPlayer === aiPlayer;
}

/**
 * Execute a complete AI turn
 */
export function executeAITurn(
  state: StarsState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): StarsState {
  const move = getAIMove(state, aiPlayer, difficulty);

  if (!move) {
    return passTurn(state);
  }

  let currentState = state;
  currentState = selectCard(currentState, move.cardId);
  currentState = placeCard(currentState, move.row, move.col);

  return currentState;
}
