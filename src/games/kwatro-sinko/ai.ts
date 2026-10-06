// Kwatro-Sinko AI Module
// Strategic AI for alignment and arithmetic game
//
// EDUCATIONAL NOTES:
// Kwatro-Sinko teaches addition, subtraction, and strategic positioning.
// Key skills: Mental math with single digits, creating equations, spatial planning.
//
// Strategy tips for learners:
// 1. Look for chips that can combine to make 4 or 5: e.g., 6 + 3 - 4 = 5
// 2. Move chips toward the center - more connection options
// 3. Block opponent alignments by occupying key spaces
// 4. Even numbers (player 1) can make 4: 0+6-2, 2+4-2, etc.
// 5. Odd numbers (player 2) can make 5: 1+7-3, 3+9-7, etc.

import {
  KwaState,
  Player,
  Chip,
  BoardNode,
  getOpponent,
} from './types';
import {
  selectChip,
  moveChip,
  getValidMoves,
  hasValidMoves,
  passTurn,
  allChipsOffNumbered,
  findWinningAlignment,
  checkTrioForWin,
} from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { randomness: 0.5, teachingMode: true, depth: 1 },
  medium: { randomness: 0.15, teachingMode: false, depth: 2 },
  hard: { randomness: 0.03, teachingMode: false, depth: 3 },
};

// =============================================================================
// Alignment Analysis
// =============================================================================

/**
 * Check if three chips can form a winning equation (like + like − opposite).
 */
function canFormWinningEquation(
  chips: Chip[]
): { expression: string; result: number } | null {
  if (chips.length !== 3) return null;
  // Nodes are unused by checkTrioForWin beyond ids; stub empty pads.
  const stubNode = (chip: Chip, index: number): BoardNode => ({
    id: `ai-stub-${index}`,
    x: 0,
    y: 0,
    isNumbered: false,
    chip,
    connections: [],
  });
  const alignment = checkTrioForWin(
    chips.map((chip, index) => ({ node: stubNode(chip, index), chip }))
  );
  if (!alignment) return null;
  return { expression: alignment.expression, result: alignment.result };
}

/**
 * Check if position is along a potential alignment path
 */
function isOnAlignmentPath(
  nodes: Map<string, BoardNode>,
  nodeId: string,
  chip: Chip
): boolean {
  const node = nodes.get(nodeId);
  if (!node) return false;

  // Check each direction for alignment potential
  const directions = [
    [
      [0, -1],
      [0, 1],
    ], // Horizontal
    [
      [-1, 0],
      [1, 0],
    ], // Vertical
    [
      [-1, -1],
      [1, 1],
    ], // Diagonal \
    [
      [-1, 1],
      [1, -1],
    ], // Diagonal /
  ];

  const match = nodeId.match(/n(\d+)-(\d+)/);
  if (!match) return false;
  const row = parseInt(match[1]);
  const col = parseInt(match[2]);

  for (const [dir1, dir2] of directions) {
    const chipsInLine: Chip[] = [chip];

    for (const [dr, dc] of [dir1, dir2]) {
      let r = row + dr;
      let c = col + dc;

      while (r >= 0 && r < 5 && c >= 0 && c < 5) {
        const adjId = `n${r}-${c}`;
        const adjNode = nodes.get(adjId);

        if (adjNode?.chip) {
          chipsInLine.push(adjNode.chip);
        }

        r += dr;
        c += dc;
      }
    }

    // If we have 3 chips that could form a winning equation
    if (chipsInLine.length >= 3) {
      for (let i = 0; i < chipsInLine.length - 2; i++) {
        for (let j = i + 1; j < chipsInLine.length - 1; j++) {
          for (let k = j + 1; k < chipsInLine.length; k++) {
            if (
              canFormWinningEquation([
                chipsInLine[i],
                chipsInLine[j],
                chipsInLine[k],
              ])
            ) {
              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

/**
 * Check if a move would create a legal win (chips off numbered + alignment).
 */
function wouldCreateWin(
  state: KwaState,
  chipId: string,
  toNodeId: string
): { expression: string; result: number } | null {
  const chip = state.chips.get(chipId);
  if (!chip) return null;

  const newNodes = new Map(state.nodes);

  if (chip.position) {
    const oldNode = newNodes.get(chip.position);
    if (oldNode) {
      newNodes.set(chip.position, { ...oldNode, chip: null });
    }
  }

  const newNode = newNodes.get(toNodeId);
  if (!newNode) return null;
  const movedChip = { ...chip, position: toNodeId };
  newNodes.set(toNodeId, { ...newNode, chip: movedChip });

  const newChips = new Map(state.chips);
  newChips.set(chip.id, movedChip);

  // Same conjunctive gate as moveChip — alignment alone is not a win.
  if (!allChipsOffNumbered(newNodes, newChips, chip.owner)) {
    return null;
  }

  const alignment = findWinningAlignment(newNodes, toNodeId);
  if (!alignment) return null;
  return { expression: alignment.expression, result: alignment.result };
}

// =============================================================================
// Move Evaluation
// =============================================================================

interface MoveOption {
  chipId: string;
  nodeId: string;
  score: number;
  reasoning: string;
}

/**
 * Evaluate all possible moves
 */
function evaluateMoves(
  state: KwaState,
  player: Player,
  _difficulty: AIDifficulty
): MoveOption[] {
  const moves: MoveOption[] = [];
  const opponent = getOpponent(player);

  for (const chip of state.chips.values()) {
    if (chip.owner !== player) continue;

    const validMoves = getValidMoves(state, chip.id);

    for (const nodeId of validMoves) {
      const node = state.nodes.get(nodeId);
      if (!node) continue;

      let score = 0;
      const reasons: string[] = [];

      // Factor 1: Win immediately
      const winResult = wouldCreateWin(state, chip.id, nodeId);
      if (winResult) {
        score += 10000;
        reasons.push(`Creates winning alignment: ${winResult.expression}`);
      }

      // Factor 2: Block opponent's win
      // Check if opponent could win by moving to this space
      for (const oppChip of state.chips.values()) {
        if (oppChip.owner !== opponent) continue;
        const oppMoves = getValidMoves(state, oppChip.id);
        if (oppMoves.includes(nodeId)) {
          const oppWin = wouldCreateWin(state, oppChip.id, nodeId);
          if (oppWin) {
            score += 5000;
            reasons.push('Blocks opponent win');
          }
        }
      }

      // Factor 3: Prefer non-numbered spaces (goal condition)
      if (!node.isNumbered) {
        score += 200;
        reasons.push('Non-numbered space');
      }

      // Factor 4: Center control
      const match = nodeId.match(/n(\d+)-(\d+)/);
      if (match) {
        const row = parseInt(match[1]);
        const col = parseInt(match[2]);
        const centerDist = Math.abs(row - 2) + Math.abs(col - 2);
        const centerBonus = (4 - centerDist) * 30;
        score += centerBonus;
        if (centerDist <= 1) {
          reasons.push('Central position');
        }
      }

      // Factor 5: Alignment potential
      if (isOnAlignmentPath(state.nodes, nodeId, chip)) {
        score += 100;
        reasons.push('Building toward alignment');
      }

      // Factor 6: More connections = more mobility
      score += node.connections.length * 10;

      moves.push({
        chipId: chip.id,
        nodeId,
        score,
        reasoning: reasons.join('; ') || 'Standard move',
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
 * In easy mode, make intentionally suboptimal moves
 */
function getTeachingMove(state: KwaState, player: Player): MoveOption | null {
  const moves = evaluateMoves(state, player, 'easy');

  if (moves.length === 0) return null;

  // 40% chance to pick a suboptimal move
  if (Math.random() < 0.4 && moves.length > 1) {
    const suboptimal = moves.slice(1);
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
  chipId: string;
  nodeId: string;
  hint?: string;
}

/**
 * Get AI's move decision
 */
export function getAIMove(
  state: KwaState,
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
      return { chipId: result.chipId, nodeId: result.nodeId };
    }
  }

  const moves = evaluateMoves(state, aiPlayer, difficulty);

  if (moves.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && moves.length > 1) {
    const topMoves = moves.slice(0, 3);
    const chosen = topMoves[Math.floor(Math.random() * topMoves.length)];
    return { chipId: chosen.chipId, nodeId: chosen.nodeId };
  }

  return { chipId: moves[0].chipId, nodeId: moves[0].nodeId };
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: KwaState,
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
  state: KwaState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): KwaState {
  const move = getAIMove(state, aiPlayer, difficulty);

  if (!move) {
    // No valid moves, pass
    return passTurn(state);
  }

  // Execute the move
  let currentState = state;
  currentState = selectChip(currentState, move.chipId);
  currentState = moveChip(currentState, move.nodeId);

  return currentState;
}
