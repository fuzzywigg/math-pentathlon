// Sum Dominoes AI Module
// Strategic AI for dice-driven domino matching game
//
// EDUCATIONAL NOTES:
// Sum Dominoes teaches addition facts and number bonds.
// Key skills: Addition facts 2-12, finding complements, strategic domino play.
//
// Strategy tips for learners:
// 1. With dice sum N, you need pairs that add to N (e.g., sum=8: 2+6, 3+5, 4+4)
// 2. Get rid of high-pip dominoes first (fewer points if stuck)
// 3. Watch what faces are on the board - can you set up future plays?
// 4. Double dominoes (3-3, 5-5) have only one useful face value
// 5. Think ahead: what dice rolls will give you playable dominoes?

import {
  SumDominoesState,
  Player,
  Domino,
  BoardPosition,
  getDiceSum,
} from './types';
import {
  doRollDice,
  selectDomino,
  placeDomino,
  passTurn,
  getValidPlacements,
  canPlayDomino,
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
  domino: Domino;
  position: BoardPosition;
  orientation: 'horizontal' | 'vertical';
  score: number;
  reasoning: string;
}

/**
 * Evaluate all possible moves for a given dice sum
 */
function evaluateMoves(
  state: SumDominoesState,
  player: Player,
  diceSum: number,
  _difficulty: AIDifficulty
): MoveOption[] {
  const hand = state.hands[player];
  const moves: MoveOption[] = [];

  for (const domino of hand) {
    const placements = getValidPlacements(state, domino, diceSum);

    for (const { position, orientation } of placements) {
      const reasons: string[] = [];
      let score = 0;

      // Factor 1: Get rid of high-pip dominoes (reduces penalty if game ends blocked)
      const pipCount = domino.face1 + domino.face2;
      score += pipCount * 5;
      if (pipCount >= 10) {
        reasons.push('High-pip domino removal');
      }

      // Factor 2: Prefer doubles (they're harder to play with limited face options)
      if (domino.face1 === domino.face2) {
        score += 15;
        reasons.push('Using double');
      }

      // Factor 3: Central positions are more valuable (more connection options)
      const centerDist = Math.abs(position.row - 5) + Math.abs(position.col - 5);
      if (centerDist <= 3) {
        score += 10 - centerDist * 2;
        reasons.push('Central placement');
      }

      // Factor 4: Consider versatility of remaining hand
      // After this move, which faces remain in hand?
      const remainingAfter = hand.filter(d => d.id !== domino.id);
      const remainingFaces = new Set<number>();
      for (const d of remainingAfter) {
        remainingFaces.add(d.face1);
        remainingFaces.add(d.face2);
      }
      // More unique faces = more flexible
      score += remainingFaces.size * 2;

      // Factor 5: Avoid putting faces that help opponent
      // (This is simplified - full analysis would track opponent's hand which is hidden)

      // Factor 6: If this is our last domino, huge bonus!
      if (hand.length === 1) {
        score += 1000;
        reasons.push('Winning move!');
      }

      moves.push({
        domino,
        position,
        orientation,
        score,
        reasoning: reasons.join('; ') || 'Standard play',
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
 * In easy mode, occasionally pick suboptimal moves
 */
function getTeachingMove(
  state: SumDominoesState,
  player: Player,
  diceSum: number
): MoveOption | null {
  const moves = evaluateMoves(state, player, diceSum, 'easy');

  if (moves.length === 0) return null;

  // 40% chance to pick a lower-scoring move for teaching
  if (Math.random() < 0.4 && moves.length > 1) {
    const suboptimal = moves.slice(1, Math.min(4, moves.length));
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
  dominoId: string;
  position: BoardPosition;
  orientation: 'horizontal' | 'vertical';
  hint?: string;
}

/**
 * Get AI's move decision given the current dice roll
 */
export function getAIMove(
  state: SumDominoesState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIMove | null {
  if (state.phase === 'gameOver') return null;
  if (state.currentPlayer !== aiPlayer) return null;
  if (!state.currentDice) return null;

  const diceSum = getDiceSum(state.currentDice);
  const config = DIFFICULTY_CONFIG[difficulty];

  // Teaching mode for easy difficulty
  if (config.teachingMode) {
    const result = getTeachingMove(state, aiPlayer, diceSum);
    if (result) {
      return {
        dominoId: result.domino.id,
        position: result.position,
        orientation: result.orientation,
      };
    }
  }

  const moves = evaluateMoves(state, aiPlayer, diceSum, difficulty);

  if (moves.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && moves.length > 1) {
    const topMoves = moves.slice(0, 3);
    const chosen = topMoves[Math.floor(Math.random() * topMoves.length)];
    return {
      dominoId: chosen.domino.id,
      position: chosen.position,
      orientation: chosen.orientation,
    };
  }

  return {
    dominoId: moves[0].domino.id,
    position: moves[0].position,
    orientation: moves[0].orientation,
  };
}

/**
 * Check if any domino in hand can be played with given dice sum
 */
export function hasPlayableMove(
  state: SumDominoesState,
  player: Player,
  diceSum: number
): boolean {
  const hand = state.hands[player];
  return hand.some(domino => canPlayDomino(state, domino, diceSum));
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: SumDominoesState,
  aiPlayer: Player | null
): boolean {
  if (!aiPlayer) return false;
  if (state.phase === 'gameOver') return false;
  return state.currentPlayer === aiPlayer;
}

/**
 * Execute a complete AI turn (handles rolling, placing, or passing)
 */
export function executeAITurn(
  state: SumDominoesState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): SumDominoesState {
  let currentState = state;

  // Roll dice if needed
  if (currentState.phase === 'rolling') {
    currentState = doRollDice(currentState);
  }

  // Pass if needed
  if (currentState.phase === 'passing') {
    return passTurn(currentState);
  }

  // Place domino
  if (currentState.phase === 'placing' && currentState.currentDice) {
    const move = getAIMove(currentState, aiPlayer, difficulty);

    if (move) {
      currentState = selectDomino(currentState, move.dominoId);
      currentState = placeDomino(currentState, move.position, move.orientation);
    }
  }

  return currentState;
}
