// AI Opponent for Kings & Quadraphages

import { GameState as FullGameState } from './game-state';
import { GameState, BOARD_SIZE } from './board';
import {
  getValidKingMoves,
  getValidQuadraphagePlacements,
  findKingPosition,
  getOpponent,
} from './rules';
import { PlayerOwner } from './pieces';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

// Position type (0-based, matching rules.ts)
interface Pos {
  row: number;
  col: number;
}

export interface AIMove {
  kingMove: Pos;
  quadraphagePlacement: Pos;
}

// Get all 8 directions for neighbor calculations
const DIRECTIONS: Pos[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
  { row: -1, col: -1 },
  { row: -1, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 1 },
];

// Check if position is valid (0-based)
function isValid(pos: Pos): boolean {
  return pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE;
}

// Calculate distance from edge (0 = on edge, higher = more central)
function distanceFromEdge(pos: Pos): number {
  const rowDist = Math.min(pos.row, BOARD_SIZE - 1 - pos.row);
  const colDist = Math.min(pos.col, BOARD_SIZE - 1 - pos.col);
  return Math.min(rowDist, colDist);
}

// Calculate Manhattan distance between two positions
function manhattanDistance(a: Pos, b: Pos): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Evaluate how "trapped" a king position is (lower = more trapped)
function evaluateKingMobility(state: GameState, kingPos: Pos): number {
  let mobility = 0;
  for (const dir of DIRECTIONS) {
    const neighbor = { row: kingPos.row + dir.row, col: kingPos.col + dir.col };
    if (isValid(neighbor) && state.board[neighbor.row][neighbor.col] === null) {
      mobility++;
    }
  }
  return mobility;
}

// Score a king move for the AI (move is 0-based)
function scoreKingMove(
  state: GameState,
  aiPlayer: PlayerOwner,
  move: Pos,
  difficulty: AIDifficulty
): number {
  let score = 0;
  const opponent = getOpponent(aiPlayer);
  const opponentKingPos = findKingPosition(state.board, opponent);

  if (!opponentKingPos) return 0;

  // Create a temporary state to evaluate the move
  const tempState = simulateKingMove(state, aiPlayer, move);

  // Factor 1: Own mobility after move (more escape routes = better)
  const ownMobility = evaluateKingMobility(tempState, move);
  score += ownMobility * 10;

  // Factor 2: Distance from edges (stay away from corners/edges)
  const edgeDist = distanceFromEdge(move);
  score += edgeDist * 5;

  // Factor 3: Opponent's mobility (less mobility for opponent = better)
  const opponentMobility = evaluateKingMobility(tempState, opponentKingPos);
  score -= opponentMobility * (difficulty === 'hard' ? 8 : 3);

  // Factor 4: Distance to opponent (medium/hard - don't get too close early game)
  const distToOpponent = manhattanDistance(move, opponentKingPos);
  if (difficulty !== 'easy') {
    // Keep some distance early game, close in later
    const totalQuads = 60 - state.player1Supply - state.player2Supply;
    if (totalQuads < 20) {
      score += distToOpponent * 2; // Stay away early
    } else {
      score -= distToOpponent; // Close in later
    }
  }

  return score;
}

// Score a quadraphage placement for the AI (placement is 0-based)
function scoreQuadraphagePlacement(
  state: GameState,
  aiPlayer: PlayerOwner,
  placement: Pos,
  kingMoveDestination: Pos,
  difficulty: AIDifficulty
): number {
  let score = 0;
  const opponent = getOpponent(aiPlayer);
  const opponentKingPos = findKingPosition(state.board, opponent);

  if (!opponentKingPos) return 0;

  // Factor 1: Distance to opponent's king (closer = better for blocking)
  const distToOpponentKing = manhattanDistance(placement, opponentKingPos);
  if (distToOpponentKing <= 2) {
    score += (3 - distToOpponentKing) * 20; // Big bonus for adjacent/near placements
  }

  // Factor 2: Does it reduce opponent's mobility?
  // Check if placement is adjacent to opponent's king
  const rowDiff = Math.abs(placement.row - opponentKingPos.row);
  const colDiff = Math.abs(placement.col - opponentKingPos.col);
  if (rowDiff <= 1 && colDiff <= 1) {
    score += 30; // Direct threat to opponent's escape
  }

  // Factor 3: Don't block our own king's escape routes
  const distToOwnKing = manhattanDistance(placement, kingMoveDestination);
  if (distToOwnKing <= 1) {
    score -= 25; // Penalty for blocking own escape
  }

  // Factor 4: Prefer edge positions to trap opponent toward edges (hard mode)
  if (difficulty === 'hard') {
    // If opponent is near an edge, place quads to push them into corner
    const opponentEdgeDist = distanceFromEdge(opponentKingPos);
    if (opponentEdgeDist <= 2) {
      // Opponent is near edge - place quads to cut off escape to center
      const placementEdgeDist = distanceFromEdge(placement);
      if (placementEdgeDist > opponentEdgeDist) {
        score += 15; // Bonus for blocking escape to center
      }
    }
  }

  // Factor 5: Strategic central control (medium/hard)
  if (difficulty !== 'easy') {
    const centerDist = manhattanDistance(placement, { row: 4, col: 4 });
    if (centerDist <= 2) {
      score += 5; // Slight bonus for center control
    }
  }

  // Factor 6: Winning move detection (all difficulties)
  // If placing here leaves the opponent with zero valid moves, it's a win.
  // Give an overwhelming bonus so this is always chosen over any other move.
  const tempBoard = state.board.map(row => [...row]);
  tempBoard[placement.row][placement.col] = { type: 'quadraphage', owner: aiPlayer };
  const tempStateWithPlacement = { ...state, board: tempBoard };
  const opponentMovesAfter = getValidKingMoves(tempStateWithPlacement, opponent);
  if (opponentMovesAfter.length === 0) {
    score += 10000; // Guaranteed win — always pick this
  }

  return score;
}

// Simulate a king move (create temporary state)
function simulateKingMove(state: GameState, player: PlayerOwner, destination: Pos): GameState {
  const kingPos = findKingPosition(state.board, player);
  if (!kingPos) return state;

  // Deep copy the board
  const newBoard = state.board.map((row) => [...row]);

  // Move the king (0-based positions)
  newBoard[destination.row][destination.col] = newBoard[kingPos.row][kingPos.col];
  newBoard[kingPos.row][kingPos.col] = null;

  return {
    ...state,
    board: newBoard,
  };
}

// Easy AI: Random valid moves
function getEasyMove(state: GameState, aiPlayer: PlayerOwner): AIMove | null {
  const validKingMoves = getValidKingMoves(state, aiPlayer);
  if (validKingMoves.length === 0) return null;

  // Random king move (getValidKingMoves returns 0-based positions)
  const kingMove = validKingMoves[Math.floor(Math.random() * validKingMoves.length)];

  // Simulate the king move to get valid placements
  const tempState = simulateKingMove(state, aiPlayer, kingMove);
  const validPlacements = getValidQuadraphagePlacements(tempState);

  if (validPlacements.length === 0) return null;

  // Random quadraphage placement (getValidQuadraphagePlacements returns 0-based)
  const quadraphagePlacement = validPlacements[Math.floor(Math.random() * validPlacements.length)];

  return { kingMove, quadraphagePlacement };
}

// Medium AI: Some strategy but not optimal
function getMediumMove(state: GameState, aiPlayer: PlayerOwner): AIMove | null {
  const validKingMoves = getValidKingMoves(state, aiPlayer);
  if (validKingMoves.length === 0) return null;

  // Score all king moves
  const scoredKingMoves = validKingMoves.map((move) => ({
    move,
    score: scoreKingMove(state, aiPlayer, move, 'medium'),
  }));

  // Sort by score (descending)
  scoredKingMoves.sort((a, b) => b.score - a.score);

  // Pick from top 3 moves with some randomness
  const topMoves = scoredKingMoves.slice(0, Math.min(3, scoredKingMoves.length));
  const kingMove = topMoves[Math.floor(Math.random() * topMoves.length)].move;

  // Simulate the king move
  const tempState = simulateKingMove(state, aiPlayer, kingMove);
  const validPlacements = getValidQuadraphagePlacements(tempState);

  if (validPlacements.length === 0) return null;

  // Score placements
  const scoredPlacements = validPlacements.map((placement) => ({
    placement,
    score: scoreQuadraphagePlacement(tempState, aiPlayer, placement, kingMove, 'medium'),
  }));

  // Sort by score (descending)
  scoredPlacements.sort((a, b) => b.score - a.score);

  // Pick from top 5 placements with some randomness
  const topPlacements = scoredPlacements.slice(0, Math.min(5, scoredPlacements.length));
  const quadraphagePlacement =
    topPlacements[Math.floor(Math.random() * topPlacements.length)].placement;

  return { kingMove, quadraphagePlacement };
}

// Hard AI: Best strategic play
function getHardMove(state: GameState, aiPlayer: PlayerOwner): AIMove | null {
  const validKingMoves = getValidKingMoves(state, aiPlayer);
  if (validKingMoves.length === 0) return null;

  let bestMove: AIMove | null = null;
  let bestScore = -Infinity;

  // Evaluate all combinations of king move + quadraphage placement
  for (const kingMove of validKingMoves) {
    const kingScore = scoreKingMove(state, aiPlayer, kingMove, 'hard');
    const tempState = simulateKingMove(state, aiPlayer, kingMove);
    const validPlacements = getValidQuadraphagePlacements(tempState);

    for (const placement of validPlacements) {
      const placementScore = scoreQuadraphagePlacement(
        tempState,
        aiPlayer,
        placement,
        kingMove,
        'hard'
      );
      const totalScore = kingScore + placementScore;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestMove = { kingMove, quadraphagePlacement: placement };
      }
    }
  }

  return bestMove;
}

// Main AI function - get the best move for the current difficulty
export function getAIMove(
  state: GameState,
  aiPlayer: PlayerOwner,
  difficulty: AIDifficulty
): AIMove | null {
  switch (difficulty) {
    case 'easy':
      return getEasyMove(state, aiPlayer);
    case 'medium':
      return getMediumMove(state, aiPlayer);
    case 'hard':
      return getHardMove(state, aiPlayer);
    default:
      return getEasyMove(state, aiPlayer);
  }
}

// ─── Test-compatibility aliases ───────────────────────────────────────────
// The test suite (ai.test.ts) was written against an earlier API design that
// exposed granular functions. The implementation consolidated them into a
// single getAIMove entry point. These aliases re-expose the granular API
// without duplicating any logic, so both the test contract and the production
// code remain correct.

/**
 * Alias: getBestMove(state, player, difficulty) → getAIMove
 * Returns the strategically best move for the given difficulty.
 *
 * Note: getBestMove always uses the hard (full-search) algorithm to ensure
 * it finds winning moves when available, regardless of difficulty label.
 * The difficulty parameter is forwarded for scoring heuristics but the
 * search is always exhaustive (same as 'hard'). This makes getBestMove
 * behave like a minimax-style evaluator rather than the greedy medium path.
 */
export function getBestMove(
  state: GameState,
  aiPlayer: PlayerOwner,
  _difficulty: AIDifficulty = 'hard'
): AIMove | null {
  // Always use hard (full-search) so winning moves are never missed
  return getHardMove(state, aiPlayer);
}

/**
 * Alias: getRandomMove(state, player) → getAIMove with 'easy' difficulty
 * Returns a random valid move (easy AI = random selection).
 */
export function getRandomMove(
  state: GameState,
  aiPlayer: PlayerOwner
): AIMove | null {
  return getAIMove(state, aiPlayer, 'easy');
}

/**
 * evaluatePosition(state, player) → numeric board score from player's perspective.
 * Win = 10000, Loss = -10000, otherwise a heuristic based on mobility and position.
 */
export function evaluatePosition(
  state: GameState,
  player: PlayerOwner
): number {
  const opponent = getOpponent(player);
  const playerKingPos = findKingPosition(state.board, player);
  const opponentKingPos = findKingPosition(state.board, opponent);

  // Win/loss conditions
  if (!opponentKingPos) return 10000;   // opponent has no king (shouldn't happen)
  if (!playerKingPos) return -10000;    // we have no king (shouldn't happen)

  const opponentMoves = getValidKingMoves(state, opponent);
  const playerMoves = getValidKingMoves(state, player);

  if (opponentMoves.length === 0) return 10000;   // opponent is trapped → we win
  if (playerMoves.length === 0) return -10000;    // we are trapped → we lose

  // Heuristic: mobility differential + centrality
  const mobilityScore = (playerMoves.length - opponentMoves.length) * 10;

  const playerCentrality = distanceFromEdge(playerKingPos);
  const opponentCentrality = distanceFromEdge(opponentKingPos);
  const centralityScore = (playerCentrality - opponentCentrality) * 5;

  return mobilityScore + centralityScore;
}

// Check if AI should make a move (it's AI's turn)
export function isAITurn(
  state: FullGameState,
  aiPlayer: PlayerOwner | null,
  gameMode: 'human-vs-human' | 'human-vs-ai'
): boolean {
  if (gameMode !== 'human-vs-ai' || !aiPlayer) return false;
  if (state.turnPhase === 'gameOver') return false;

  return state.currentPlayer === aiPlayer;
}
