// Hex-a-Gone! AI Module
// Strategic AI for pattern block placement game
//
// EDUCATIONAL NOTES:
// Hex-a-Gone teaches spatial reasoning, resource management, and planning.
// Key skills: Counting available spaces, predicting opponent moves,
// managing shared resources strategically.
//
// Strategy tips for learners:
// 1. Count empty cells before selecting blocks - don't select more than you can place
// 2. Watch what blocks are left in the bank - take ones your opponent might need
// 3. Try to leave yourself good placement options for next turn
// 4. In late game, try to force opponent into positions where they can't place
// 5. Sometimes selecting fewer blocks is smarter than selecting the maximum

import {
  HexAGoneGameState,
  BlockShape,
  Player,
  getAvailableShapes,
} from './types';

import {
  selectBlock,
  commitSelection,
  placeBlock,
  canPlaceAt,
  isGameOver,
} from './rules';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { maxSelectionLookahead: 1, randomness: 0.4, teachingMode: true },
  medium: { maxSelectionLookahead: 2, randomness: 0.15, teachingMode: false },
  hard: { maxSelectionLookahead: 3, randomness: 0.03, teachingMode: false },
};

// =============================================================================
// Board Analysis
// =============================================================================

/**
 * Count empty cells on the board
 */
function countEmptyCells(state: HexAGoneGameState): number {
  return state.board.filter(cell => !cell.filled).length;
}

/**
 * Get all empty cells
 */
function getEmptyCells(state: HexAGoneGameState): { q: number; r: number }[] {
  return state.board
    .filter(cell => !cell.filled)
    .map(cell => ({ q: cell.q, r: cell.r }));
}

// =============================================================================
// Block Selection Strategy
// =============================================================================

interface SelectionOption {
  blocks: BlockShape[];
  score: number;
  reasoning: string;
}

/**
 * Evaluate different block selection combinations
 */
function evaluateSelections(
  state: HexAGoneGameState,
  _aiPlayer: Player,
  _difficulty: AIDifficulty
): SelectionOption[] {
  const availableShapes = getAvailableShapes(state);
  const emptyCells = countEmptyCells(state);
  const options: SelectionOption[] = [];

  // Don't select more blocks than we can place
  const maxBlocks = Math.min(3, emptyCells, availableShapes.length);

  if (maxBlocks === 0) {
    return [{ blocks: [], score: -1000, reasoning: "No blocks can be placed" }];
  }

  // Generate all valid combinations of 1-maxBlocks shapes
  const generateCombinations = (shapes: BlockShape[], size: number): BlockShape[][] => {
    if (size === 0) return [[]];
    if (shapes.length < size) return [];

    const result: BlockShape[][] = [];
    for (let i = 0; i <= shapes.length - size; i++) {
      const rest = generateCombinations(shapes.slice(i + 1), size - 1);
      for (const combo of rest) {
        result.push([shapes[i], ...combo]);
      }
    }
    return result;
  };

  // Evaluate each possible selection
  for (let numBlocks = 1; numBlocks <= maxBlocks; numBlocks++) {
    const combos = generateCombinations(availableShapes, numBlocks);

    for (const blocks of combos) {
      let score = 0;
      const reasons: string[] = [];

      // Simulate selecting and placing these blocks
      let simState = { ...state };
      for (const block of blocks) {
        simState = selectBlock(simState, block);
      }
      simState = commitSelection(simState);

      // Can we actually place all selected blocks?
      const emptyCellsList = getEmptyCells(simState);
      if (emptyCellsList.length < blocks.length) {
        score -= 1000; // Can't place all blocks
        reasons.push("Not enough empty cells");
      } else {
        // Score based on block types
        for (const block of blocks) {
          if (block === 'triangle') {
            score += 15;
            reasons.push("Triangle is flexible");
          } else if (block === 'hexagon') {
            score += 12;
            reasons.push("Hexagon fills space well");
          } else {
            score += 8;
          }
        }

        // Bonus for selecting multiple blocks (more efficient turn)
        score += blocks.length * 5;

        // Late game: fewer blocks might be safer
        if (emptyCells <= 5) {
          score -= (blocks.length - 1) * 10;
          reasons.push("Late game - conservative selection");
        }
      }

      // Consider what's left for opponent
      const shapesAfter = availableShapes.filter(s => !blocks.includes(s));
      const cellsAfterOurTurn = emptyCells - blocks.length;

      if (cellsAfterOurTurn > 0 && shapesAfter.length === 0) {
        score += 100; // Opponent might be stuck!
        reasons.push("May leave opponent with no options");
      }

      options.push({
        blocks,
        score,
        reasoning: reasons.join('; ') || "Standard selection",
      });
    }
  }

  // Sort by score
  options.sort((a, b) => b.score - a.score);

  return options;
}

// =============================================================================
// Block Placement Strategy
// =============================================================================

interface PlacementOption {
  q: number;
  r: number;
  score: number;
  reasoning: string;
}

/**
 * Evaluate placement options for the current block
 */
function evaluatePlacements(
  state: HexAGoneGameState,
  aiPlayer: Player
): PlacementOption[] {
  const emptyCells = getEmptyCells(state);
  const options: PlacementOption[] = [];

  for (const cell of emptyCells) {
    if (!canPlaceAt(state, cell.q, cell.r)) continue;

    let score = 0;
    const reasons: string[] = [];

    // Simulate placing here
    const simState = placeBlock(state, cell.q, cell.r);

    // Factor 1: Does this create winning position?
    if (simState.winner === aiPlayer) {
      score += 10000;
      reasons.push("Winning move!");
    }

    // Factor 2: Center control (center cells are more flexible)
    const distFromCenter = Math.abs(cell.q) + Math.abs(cell.r) + Math.abs(-cell.q - cell.r);
    const centerBonus = Math.max(0, 6 - distFromCenter) * 3;
    score += centerBonus;
    if (distFromCenter <= 2) {
      reasons.push("Good center position");
    }

    // Factor 3: Don't isolate single empty cells
    // Check if any neighboring cell would become isolated
    const neighbors = getHexNeighbors(cell.q, cell.r);
    let isolatedCount = 0;
    for (const neighbor of neighbors) {
      const neighborCell = state.board.find(c => c.q === neighbor.q && c.r === neighbor.r);
      if (neighborCell && !neighborCell.filled) {
        // Check if this neighbor would be isolated after our move
        const neighborNeighbors = getHexNeighbors(neighbor.q, neighbor.r);
        const emptyNeighborsAfter = neighborNeighbors.filter(nn => {
          if (nn.q === cell.q && nn.r === cell.r) return false; // We're filling this
          const nnCell = state.board.find(c => c.q === nn.q && c.r === nn.r);
          return nnCell && !nnCell.filled;
        });
        if (emptyNeighborsAfter.length === 0) {
          isolatedCount++;
        }
      }
    }
    if (isolatedCount > 0) {
      score -= isolatedCount * 5;
      reasons.push("May create isolated cells");
    }

    // Factor 4: Edge vs interior
    const isEdge = neighbors.some(n => !state.board.find(c => c.q === n.q && c.r === n.r));
    if (!isEdge) {
      score += 3;
      reasons.push("Interior position");
    }

    options.push({
      q: cell.q,
      r: cell.r,
      score,
      reasoning: reasons.join('; ') || "Standard placement",
    });
  }

  // Sort by score
  options.sort((a, b) => b.score - a.score);

  return options;
}

/**
 * Get neighboring hex coordinates
 */
function getHexNeighbors(q: number, r: number): { q: number; r: number }[] {
  return [
    { q: q + 1, r: r },
    { q: q - 1, r: r },
    { q: q, r: r + 1 },
    { q: q, r: r - 1 },
    { q: q + 1, r: r - 1 },
    { q: q - 1, r: r + 1 },
  ];
}

// =============================================================================
// Teaching Mode
// =============================================================================

/**
 * In easy mode, occasionally make suboptimal moves
 */
function getTeachingSelection(
  state: HexAGoneGameState,
  aiPlayer: Player
): { blocks: BlockShape[]; hint?: string } | null {
  const options = evaluateSelections(state, aiPlayer, 'easy');

  if (options.length === 0) return null;

  // 30% chance to make a suboptimal selection
  if (Math.random() < 0.3 && options.length > 1) {
    const suboptimal = options.slice(1).find(o => o.score < options[0].score - 20);
    if (suboptimal) {
      return {
        blocks: suboptimal.blocks,
        hint: "Think about which blocks to select carefully!",
      };
    }
  }

  return { blocks: options[0].blocks };
}

// =============================================================================
// Public API
// =============================================================================

export interface AISelectionResult {
  blocks: BlockShape[];
  hint?: string;
}

export interface AIPlacementResult {
  q: number;
  r: number;
  hint?: string;
}

/**
 * Get AI's block selection for this turn
 */
export function getAISelection(
  state: HexAGoneGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AISelectionResult | null {
  if (state.phase !== 'selectBlocks') return null;
  if (state.currentPlayer !== aiPlayer) return null;

  const config = DIFFICULTY_CONFIG[difficulty];

  // Teaching mode for easy difficulty
  if (config.teachingMode) {
    const result = getTeachingSelection(state, aiPlayer);
    if (result) return result;
  }

  const options = evaluateSelections(state, aiPlayer, difficulty);

  if (options.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && options.length > 1) {
    const topOptions = options.slice(0, 3);
    const chosen = topOptions[Math.floor(Math.random() * topOptions.length)];
    return { blocks: chosen.blocks };
  }

  return { blocks: options[0].blocks };
}

/**
 * Get AI's block placement
 */
export function getAIPlacement(
  state: HexAGoneGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): AIPlacementResult | null {
  if (state.phase !== 'placeBlocks') return null;
  if (state.currentPlayer !== aiPlayer) return null;

  const config = DIFFICULTY_CONFIG[difficulty];
  const options = evaluatePlacements(state, aiPlayer);

  if (options.length === 0) return null;

  // Add randomness based on difficulty
  if (Math.random() < config.randomness && options.length > 1) {
    const topOptions = options.slice(0, 3);
    const chosen = topOptions[Math.floor(Math.random() * topOptions.length)];
    return { q: chosen.q, r: chosen.r };
  }

  return { q: options[0].q, r: options[0].r };
}

/**
 * Check if it's the AI's turn
 */
export function isAITurn(
  state: HexAGoneGameState,
  aiPlayer: Player | null,
  gameMode: 'human-vs-human' | 'human-vs-ai'
): boolean {
  if (gameMode !== 'human-vs-ai') return false;
  if (!aiPlayer) return false;
  if (isGameOver(state)) return false;

  return state.currentPlayer === aiPlayer;
}

/**
 * Execute a complete AI turn (selection + placement)
 */
export function executeAITurn(
  state: HexAGoneGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium'
): HexAGoneGameState {
  let currentState = state;

  // Phase 1: Selection
  if (currentState.phase === 'selectBlocks') {
    const selection = getAISelection(currentState, aiPlayer, difficulty);
    if (!selection) return currentState;

    // Select each block
    for (const block of selection.blocks) {
      currentState = selectBlock(currentState, block);
    }

    // Commit selection
    currentState = commitSelection(currentState);
  }

  // Phase 2: Placement
  while (currentState.phase === 'placeBlocks' && currentState.currentPlayer === aiPlayer) {
    const placement = getAIPlacement(currentState, aiPlayer, difficulty);
    if (!placement) break;

    currentState = placeBlock(currentState, placement.q, placement.r);
  }

  return currentState;
}
