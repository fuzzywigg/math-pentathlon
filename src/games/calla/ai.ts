// Calla AI Module
// Strategic AI for Mancala-style game with captures and free turns
//
// EDUCATIONAL NOTES:
// Calla teaches counting, planning ahead, and understanding cyclical patterns.
// Key skills: modular arithmetic (wrap-around), cause-and-effect reasoning,
// strategic sacrifice (giving up small gains for larger ones).
//
// Strategy tips for learners:
// 1. Free turns are very powerful - look for moves that land in your Calla
// 2. Count carefully: cubes go pit-by-pit, skipping opponent's Calla
// 3. Captures happen when you land in an empty pit on YOUR side
// 4. Watch for "traps" - don't set up captures for your opponent
// 5. Sometimes it's better to make your opponent empty their side

import {
  CallaGameState,
  Player,
  PITS_PER_SIDE,
  getOpponent,
  getPlayerPits,
  getPlayerCalla,
  getOppositePitIndex,
} from './types';

import { getValidPits, makeMove, isGameOver } from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { maxDepth: 2, randomness: 0.4, teachingMode: true },
  medium: { maxDepth: 4, randomness: 0.15, teachingMode: false },
  hard: { maxDepth: 6, randomness: 0.02, teachingMode: false },
};

// =============================================================================
// Move Prediction Helpers
// =============================================================================

/**
 * Predict where cubes will land without actually making the move.
 * Returns information useful for evaluating move quality.
 */
interface MoveOutcome {
  landsInCalla: boolean;  // Free turn!
  captureAmount: number;  // How many cubes captured (0 if none)
  landsSide: 'own' | 'opponent' | 'calla';
  landsIndex: number;
  cubesDistributed: number;
}

function predictMoveOutcome(
  state: CallaGameState,
  pitIndex: number
): MoveOutcome {
  const currentPlayer = state.currentPlayer;
  const pits = getPlayerPits(state, currentPlayer);
  const cubes = pits[pitIndex];

  if (cubes === 0) {
    return {
      landsInCalla: false,
      captureAmount: 0,
      landsSide: 'own',
      landsIndex: pitIndex,
      cubesDistributed: 0,
    };
  }

  // Simulate sowing to find where last cube lands
  // Board positions: 0-4 = own pits, 5 = own calla, 6-10 = opponent pits (reversed)
  // Total cycle length = 11 (skip opponent's calla)
  const cycleLength = PITS_PER_SIDE * 2 + 1;

  let position = pitIndex;
  let remaining = cubes;

  while (remaining > 0) {
    position = (position + 1) % (cycleLength + 1);
    // Skip opponent's calla (position 11)
    if (position === cycleLength) {
      position = 0;
    }
    remaining--;
  }

  // Determine where we landed
  let landsSide: 'own' | 'opponent' | 'calla';
  let landsIndex: number;
  let landsInCalla = false;
  let captureAmount = 0;

  if (position < PITS_PER_SIDE) {
    // Own pits
    landsSide = 'own';
    landsIndex = position;
  } else if (position === PITS_PER_SIDE) {
    // Own calla
    landsSide = 'calla';
    landsIndex = 0;
    landsInCalla = true;
  } else {
    // Opponent's pits
    landsSide = 'opponent';
    landsIndex = PITS_PER_SIDE * 2 - position;
  }

  // Check for capture (only if landing in own empty pit)
  if (landsSide === 'own') {
    const ownPits = getPlayerPits(state, currentPlayer);
    const oppPits = getPlayerPits(state, getOpponent(currentPlayer));

    // Will this pit be empty when we land? (was 0 before, or we picked from it)
    const willBeEmpty = (landsIndex === pitIndex)
      ? true // We picked from this pit, so it will have exactly 1 after sowing back
      : ownPits[landsIndex] === 0;

    if (willBeEmpty) {
      const oppositeIndex = getOppositePitIndex(landsIndex);
      captureAmount = oppPits[oppositeIndex];
      if (captureAmount > 0) {
        captureAmount += 1; // Include the capturing cube
      }
    }
  }

  return {
    landsInCalla,
    captureAmount,
    landsSide,
    landsIndex,
    cubesDistributed: cubes,
  };
}

// =============================================================================
// Board Evaluation
// =============================================================================

/**
 * Evaluate board position for a player.
 * Higher score = better for that player.
 */
function evaluatePosition(state: CallaGameState, player: Player): number {
  const opponent = getOpponent(player);

  // Terminal state evaluation
  if (isGameOver(state)) {
    const playerCalla = getPlayerCalla(state, player);
    const opponentCalla = getPlayerCalla(state, opponent);

    if (playerCalla > opponentCalla) return 10000 + (playerCalla - opponentCalla);
    if (opponentCalla > playerCalla) return -10000 - (opponentCalla - playerCalla);
    return 0; // Tie
  }

  let score = 0;

  // Factor 1: Calla difference (most important)
  const playerCalla = getPlayerCalla(state, player);
  const opponentCalla = getPlayerCalla(state, opponent);
  score += (playerCalla - opponentCalla) * 100;

  // Factor 2: Cubes on own side (potential for captures and control)
  const playerPits = getPlayerPits(state, player);
  const opponentPits = getPlayerPits(state, opponent);
  const playerSideTotal = playerPits.reduce((a, b) => a + b, 0);
  const opponentSideTotal = opponentPits.reduce((a, b) => a + b, 0);
  score += (playerSideTotal - opponentSideTotal) * 10;

  // Factor 3: Capture opportunities
  // Check if it's our turn and we have capture opportunities
  if (state.currentPlayer === player) {
    const validPits = getValidPits(state);
    for (const pit of validPits) {
      const outcome = predictMoveOutcome(state, pit);
      if (outcome.captureAmount > 0) {
        score += outcome.captureAmount * 15;
      }
      if (outcome.landsInCalla) {
        score += 20; // Free turns are valuable
      }
    }
  }

  // Factor 4: Defensive - check opponent's capture threats
  if (state.currentPlayer === opponent) {
    const tempState = { ...state, currentPlayer: opponent };
    const oppValidPits = getValidPits(tempState);
    for (const pit of oppValidPits) {
      const outcome = predictMoveOutcome(tempState, pit);
      if (outcome.captureAmount > 0) {
        score -= outcome.captureAmount * 12;
      }
      if (outcome.landsInCalla) {
        score -= 15;
      }
    }
  }

  // Factor 5: Pit distribution (having options is good)
  const playerNonEmpty = playerPits.filter(p => p > 0).length;
  const opponentNonEmpty = opponentPits.filter(p => p > 0).length;
  score += (playerNonEmpty - opponentNonEmpty) * 5;

  // Factor 6: Avoid having too many cubes in single pit (inefficient)
  const maxPlayerPit = Math.max(...playerPits);
  if (maxPlayerPit > 8) {
    score -= (maxPlayerPit - 8) * 2;
  }

  return score;
}

// =============================================================================
// Minimax with Alpha-Beta Pruning
// =============================================================================

function minimax(
  state: CallaGameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  aiPlayer: Player
): number {
  // Terminal conditions
  if (depth === 0 || isGameOver(state)) {
    return evaluatePosition(state, aiPlayer);
  }

  const validPits = getValidPits(state);

  if (validPits.length === 0) {
    return evaluatePosition(state, aiPlayer);
  }

  // Order moves for better pruning (free turns and captures first)
  const orderedMoves = validPits
    .map(pit => ({ pit, outcome: predictMoveOutcome(state, pit) }))
    .sort((a, b) => {
      // Priority: free turns, then captures, then by cube count
      const aScore = (a.outcome.landsInCalla ? 100 : 0) + a.outcome.captureAmount * 10;
      const bScore = (b.outcome.landsInCalla ? 100 : 0) + b.outcome.captureAmount * 10;
      return bScore - aScore;
    })
    .map(m => m.pit);

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const pit of orderedMoves) {
      const newState = makeMove(state, pit);

      // If we got a free turn, we're still maximizing
      const stillMaximizing = newState.currentPlayer === aiPlayer;

      const evalScore = minimax(
        newState,
        depth - 1,
        alpha,
        beta,
        stillMaximizing,
        aiPlayer
      );

      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const pit of orderedMoves) {
      const newState = makeMove(state, pit);

      // If opponent got a free turn, they're still minimizing
      const stillMinimizing = newState.currentPlayer !== aiPlayer;

      const evalScore = minimax(
        newState,
        depth - 1,
        alpha,
        beta,
        !stillMinimizing,
        aiPlayer
      );

      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// =============================================================================
// Teaching Mode Analysis
// =============================================================================

export interface MoveAnalysis {
  pit: number;
  score: number;
  outcome: MoveOutcome;
  reasoning: string;
  isGoodMove: boolean;
  isBestMove: boolean;
}

/**
 * Analyze all possible moves for teaching purposes.
 * Explains why each move is good or bad.
 */
export function analyzeMoves(
  state: CallaGameState,
  aiPlayer: Player
): MoveAnalysis[] {
  const validPits = getValidPits(state);

  const analyses: MoveAnalysis[] = validPits.map(pit => {
    const outcome = predictMoveOutcome(state, pit);
    const newState = makeMove(state, pit);

    // Quick evaluation
    const score = evaluatePosition(newState, aiPlayer);

    // Generate reasoning
    const reasons: string[] = [];

    if (outcome.landsInCalla) {
      reasons.push('Lands in your Calla for a free turn!');
    }

    if (outcome.captureAmount > 0) {
      reasons.push(`Captures ${outcome.captureAmount} cubes!`);
    }

    if (outcome.landsSide === 'own' && outcome.captureAmount === 0) {
      const oppPits = getPlayerPits(state, getOpponent(aiPlayer));
      const oppositeCount = oppPits[getOppositePitIndex(outcome.landsIndex)];
      if (oppositeCount === 0) {
        reasons.push('Lands on your side but opposite pit is empty (no capture).');
      }
    }

    if (outcome.landsSide === 'opponent') {
      reasons.push('Adds cubes to opponent\'s side.');
    }

    // Check if this sets up opponent capture
    if (!isGameOver(newState)) {
      const oppValidPits = getValidPits(newState);
      let oppBestCapture = 0;
      for (const oppPit of oppValidPits) {
        const oppOutcome = predictMoveOutcome(newState, oppPit);
        if (oppOutcome.captureAmount > oppBestCapture) {
          oppBestCapture = oppOutcome.captureAmount;
        }
      }
      if (oppBestCapture > 2) {
        reasons.push(`Warning: Sets up opponent to capture ${oppBestCapture} cubes!`);
      }
    }

    if (reasons.length === 0) {
      reasons.push('A safe, neutral move.');
    }

    return {
      pit,
      score,
      outcome,
      reasoning: reasons.join(' '),
      isGoodMove: false, // Will be set after sorting
      isBestMove: false, // Will be set after sorting
    };
  });

  // Sort by score and mark best moves
  analyses.sort((a, b) => b.score - a.score);

  if (analyses.length > 0) {
    analyses[0].isBestMove = true;
    analyses[0].isGoodMove = true;

    // Mark moves within 20% of best as "good"
    const bestScore = analyses[0].score;
    const threshold = Math.abs(bestScore) * 0.2;
    for (const analysis of analyses) {
      if (Math.abs(analysis.score - bestScore) <= threshold) {
        analysis.isGoodMove = true;
      }
    }
  }

  return analyses;
}

// =============================================================================
// Intentionally Bad Moves (for Easy Mode Teaching)
// =============================================================================

/**
 * In easy mode, occasionally make suboptimal moves and highlight
 * the opportunity for the human player to exploit.
 */
function getTeachingMove(
  state: CallaGameState,
  aiPlayer: Player
): { pit: number; hint?: string } | null {
  const validPits = getValidPits(state);
  if (validPits.length === 0) return null;

  // Analyze all moves
  const analyses = analyzeMoves(state, aiPlayer);
  if (analyses.length === 0) return null;

  // 30% chance to make a deliberately suboptimal move
  if (Math.random() < 0.3 && analyses.length > 1) {
    // Find moves that set up captures for opponent
    const suboptimal = analyses.filter(a => !a.isGoodMove && a.score < analyses[0].score - 50);

    if (suboptimal.length > 0) {
      const chosen = suboptimal[Math.floor(Math.random() * suboptimal.length)];

      // Figure out what opportunity this creates
      const newState = makeMove(state, chosen.pit);
      const oppPits = getValidPits(newState);
      let bestOppCapture = 0;
      let bestOppPit = -1;

      for (const pit of oppPits) {
        const outcome = predictMoveOutcome(newState, pit);
        if (outcome.captureAmount > bestOppCapture) {
          bestOppCapture = outcome.captureAmount;
          bestOppPit = pit;
        }
        if (outcome.landsInCalla && bestOppCapture === 0) {
          bestOppPit = pit;
        }
      }

      let hint: string | undefined;
      if (bestOppCapture > 0) {
        hint = `Look carefully! There's a chance to capture ${bestOppCapture} cubes.`;
      } else if (bestOppPit >= 0) {
        hint = `Can you find a move that gives you a free turn?`;
      }

      return { pit: chosen.pit, hint };
    }
  }

  // Otherwise pick from good moves with some randomness
  const goodMoves = analyses.filter(a => a.isGoodMove);
  if (goodMoves.length > 0) {
    const chosen = goodMoves[Math.floor(Math.random() * goodMoves.length)];
    return { pit: chosen.pit };
  }

  return { pit: analyses[0].pit };
}

// =============================================================================
// Public API
// =============================================================================

export interface AIMove {
  pit: number;
  hint?: string;  // Teaching hint for opponent
}

/**
 * Get the AI's next move.
 */
export function getAIMove(
  state: CallaGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIMove | null {
  if (isGameOver(state)) return null;
  if (state.currentPlayer !== aiPlayer) return null;

  const config = DIFFICULTY_CONFIG[difficulty];

  // Teaching mode for easy difficulty
  if (config.teachingMode) {
    const result = getTeachingMove(state, aiPlayer);
    if (result) return result;
  }

  const validPits = getValidPits(state);
  if (validPits.length === 0) return null;

  // Immediate win/capture detection
  for (const pit of validPits) {
    const outcome = predictMoveOutcome(state, pit);
    const newState = makeMove(state, pit);

    // Check for immediate win
    if (isGameOver(newState) && newState.winner === aiPlayer) {
      return { pit };
    }

    // In hard mode, always take big captures
    if (difficulty === 'hard' && outcome.captureAmount >= 5) {
      return { pit };
    }
  }

  // Evaluate all moves with minimax
  const scoredMoves = validPits.map(pit => {
    const newState = makeMove(state, pit);
    const stillMaximizing = newState.currentPlayer === aiPlayer;

    const score = minimax(
      newState,
      config.maxDepth - 1,
      -Infinity,
      Infinity,
      stillMaximizing,
      aiPlayer
    );

    return { pit, score };
  });

  // Sort by score
  scoredMoves.sort((a, b) => b.score - a.score);

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && scoredMoves.length > 1) {
    const topCount = Math.min(3, scoredMoves.length);
    const randomIndex = Math.floor(Math.random() * topCount);
    return { pit: scoredMoves[randomIndex].pit };
  }

  return { pit: scoredMoves[0].pit };
}

/**
 * Check if it's the AI's turn.
 */
export function isAITurn(
  state: CallaGameState,
  aiPlayer: Player | null,
  gameMode: 'human-vs-human' | 'human-vs-ai'
): boolean {
  if (gameMode !== 'human-vs-ai') return false;
  if (!aiPlayer) return false;
  if (isGameOver(state)) return false;

  return state.currentPlayer === aiPlayer;
}
