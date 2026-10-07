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
//
// Performance notes (tablet):
// - Search is 1-ply heuristic only (depth knobs below are for priority / randomness,
//   not full minimax — mid-range tablets must stay well under ~1.5s per think).
// - Opponent-win blocking is skipped when the opponent still has ≥2 chips on
//   numbered spaces (they cannot win on their next move).

import { KwaState, Player, Chip, BoardNode, getOpponent } from './types';
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

/** Soft tablet think budget for AI decision work (excludes UI pause). */
export const AI_THINK_BUDGET_MS = 50;

const DIFFICULTY_CONFIG = {
  // depth = how aggressively we prioritize evacuation / win setup vs noise
  easy: { randomness: 0.35, teachingMode: true, depth: 1 },
  medium: { randomness: 0.12, teachingMode: false, depth: 2 },
  hard: { randomness: 0.02, teachingMode: false, depth: 3 },
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
 * Count chips owned by `player` that still sit on numbered (home) spaces.
 */
function countOnNumbered(
  nodes: Map<string, BoardNode>,
  chips: Map<string, Chip>,
  player: Player
): number {
  let n = 0;
  for (const chip of chips.values()) {
    if (chip.owner !== player || !chip.position) continue;
    const node = nodes.get(chip.position);
    if (node?.isNumbered) n += 1;
  }
  return n;
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
  difficulty: AIDifficulty
): MoveOption[] {
  const moves: MoveOption[] = [];
  const opponent = getOpponent(player);
  const config = DIFFICULTY_CONFIG[difficulty];
  const ownOnNumbered = countOnNumbered(state.nodes, state.chips, player);
  const oppOnNumbered = countOnNumbered(state.nodes, state.chips, opponent);
  // Opponent can only win next turn if ≤1 chip remains on numbered spaces
  // (a single move can clear at most one chip off a numbered space).
  const oppCanThreatenWin = oppOnNumbered <= 1;
  const lastOwnMove = [...state.moveHistory]
    .reverse()
    .find((m) => m.player === player);

  // Stronger evacuation weight on harder difficulties (depth knob).
  const evacuateWeight = 600 + config.depth * 250;
  const allOffBonus = 1500 + config.depth * 500;

  for (const chip of state.chips.values()) {
    if (chip.owner !== player) continue;

    const fromNode = chip.position ? state.nodes.get(chip.position) : null;
    const chipOnNumbered = Boolean(fromNode?.isNumbered);
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

      // Factor 2: Block opponent's win (only when a win is still possible)
      if (oppCanThreatenWin) {
        for (const oppChip of state.chips.values()) {
          if (oppChip.owner !== opponent) continue;
          // If opp still has exactly one numbered chip, only that chip can
          // complete the all-off gate — skip others.
          if (oppOnNumbered === 1) {
            const oppFrom = oppChip.position
              ? state.nodes.get(oppChip.position)
              : null;
            if (!oppFrom?.isNumbered) continue;
          }
          const oppMoves = getValidMoves(state, oppChip.id);
          if (oppMoves.includes(nodeId)) {
            const oppWin = wouldCreateWin(state, oppChip.id, nodeId);
            if (oppWin) {
              score += 5000;
              reasons.push('Blocks opponent win');
            }
          }
        }
      }

      // Factor 3: Evacuate numbered home rows (required before any win)
      if (chipOnNumbered && !node.isNumbered) {
        // Bigger bonus as fewer chips remain on numbered spaces.
        const urgency = (5 - ownOnNumbered + 1) * evacuateWeight;
        score += urgency;
        reasons.push('Leaves numbered space');
        if (ownOnNumbered === 1) {
          score += allOffBonus;
          reasons.push('Clears last numbered chip');
        }
      } else if (!chipOnNumbered && node.isNumbered) {
        // Never retreat onto a numbered space unless nothing else exists.
        score -= 2000;
        reasons.push('Retreats to numbered space');
      } else if (chipOnNumbered && node.isNumbered) {
        // Lateral shuffle along the home row does not progress the goal.
        score -= 400;
        reasons.push('Stays on numbered row');
      } else if (!node.isNumbered) {
        score += 120;
        reasons.push('Non-numbered space');
      }

      // Factor 4: Anti-cycle — penalize immediately undoing our last move
      if (
        lastOwnMove &&
        lastOwnMove.toNode === chip.position &&
        lastOwnMove.fromNode === nodeId
      ) {
        score -= 800;
        reasons.push('Avoids undo cycle');
      }

      // Factor 5: Prefer moving chips that are still stuck on numbered spaces
      // when any remain — progress the conjunctive win gate.
      if (ownOnNumbered > 0 && chipOnNumbered) {
        score += 150 * config.depth;
      } else if (ownOnNumbered > 0 && !chipOnNumbered) {
        // Soft penalty for fiddling with already-evacuated chips.
        score -= 80 * config.depth;
      }

      // Factor 6: Center control (weaker than evacuation)
      const match = nodeId.match(/n(\d+)-(\d+)/);
      if (match) {
        const row = parseInt(match[1]);
        const col = parseInt(match[2]);
        const centerDist = Math.abs(row - 2) + Math.abs(col - 2);
        const centerBonus = (4 - centerDist) * 20;
        score += centerBonus;
        if (centerDist <= 1) {
          reasons.push('Central position');
        }
      }

      // Factor 7: Alignment potential (after chips are mostly off)
      if (ownOnNumbered <= 2 && isOnAlignmentPath(state.nodes, nodeId, chip)) {
        score += 180 + config.depth * 40;
        reasons.push('Building toward alignment');
      }

      // Factor 8: More connections = more mobility
      score += node.connections.length * 8;

      // Stable tie-break so equal scores do not oscillate seat-to-seat.
      score += (chip.id.charCodeAt(chip.id.length - 1) % 7) * 0.01;
      score += (nodeId.charCodeAt(nodeId.length - 1) % 5) * 0.001;

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

  // Prefer still-progressing alternatives: only sample from the top half so
  // teaching noise does not resurrect full home-row thrashing.
  if (Math.random() < 0.4 && moves.length > 1) {
    const poolSize = Math.max(2, Math.ceil(moves.length / 2));
    const pool = moves.slice(0, poolSize);
    if (pool.length > 1) {
      return pool[1 + Math.floor(Math.random() * (pool.length - 1))];
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
  const started = performance.now();

  // Teaching mode for easy difficulty
  if (config.teachingMode) {
    const result = getTeachingMove(state, aiPlayer);
    if (result) {
      return { chipId: result.chipId, nodeId: result.nodeId };
    }
  }

  const moves = evaluateMoves(state, aiPlayer, difficulty);

  if (moves.length === 0) return null;

  // Soft budget guard: if evaluation already burned the tablet slice (rare),
  // take the top move immediately without extra randomness sampling.
  if (performance.now() - started > AI_THINK_BUDGET_MS) {
    return { chipId: moves[0].chipId, nodeId: moves[0].nodeId };
  }

  // Add randomness based on difficulty (only among top progressive moves)
  if (Math.random() < config.randomness && moves.length > 1) {
    const topMoves = moves.slice(0, Math.min(3, moves.length));
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
