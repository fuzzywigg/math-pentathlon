// Par 55 Game Rules
// Placing blocks, scoring by matching attributes, bump mechanics

import {
  Par55State,
  Base,
  AttributeBlock,
  Par55Move,
  MatchDetail,
  Player,
  CONFIG,
  createBlockSet,
  shuffleArray,
  getOpponent,
  countMatchingAttributes,
  createBaseId,
} from './types';

// =============================================================================
// State Creation
// =============================================================================

/**
 * Create the pentagon base board layout
 * Connected pentagons in a honeycomb-like pattern
 */
function createBoard(): Map<string, Base> {
  const bases = new Map<string, Base>();

  // Create bases in a staggered grid pattern
  for (let row = 0; row < CONFIG.BOARD_ROWS; row++) {
    // Odd rows have one less column to create hexagonal stagger
    const cols = row % 2 === 1 ? CONFIG.BOARD_COLS - 1 : CONFIG.BOARD_COLS;

    for (let col = 0; col < cols; col++) {
      const id = createBaseId(row, col);
      bases.set(id, {
        id,
        row,
        col,
        block: null,
        placedBy: null,
        adjacentBases: [],
      });
    }
  }

  // Calculate adjacencies
  for (const base of bases.values()) {
    base.adjacentBases = findAdjacentBases(base.row, base.col, bases);
  }

  return bases;
}

/**
 * Find adjacent bases for a given position
 */
function findAdjacentBases(row: number, col: number, bases: Map<string, Base>): string[] {
  const adjacent: string[] = [];
  const isOddRow = row % 2 === 1;

  // Possible neighbors in a hexagonal grid
  const neighbors = isOddRow
    ? [
        [row - 1, col],     // top-left
        [row - 1, col + 1], // top-right
        [row, col - 1],     // left
        [row, col + 1],     // right
        [row + 1, col],     // bottom-left
        [row + 1, col + 1], // bottom-right
      ]
    : [
        [row - 1, col - 1], // top-left
        [row - 1, col],     // top-right
        [row, col - 1],     // left
        [row, col + 1],     // right
        [row + 1, col - 1], // bottom-left
        [row + 1, col],     // bottom-right
      ];

  for (const [r, c] of neighbors) {
    const id = createBaseId(r, c);
    if (bases.has(id)) {
      adjacent.push(id);
    }
  }

  return adjacent;
}

/**
 * Create initial game state
 */
export function createInitialState(): Par55State {
  const bases = createBoard();
  const allBlocks = shuffleArray(createBlockSet());

  // Deal hands
  const player1Hand = allBlocks.slice(0, CONFIG.HAND_SIZE);
  const player2Hand = allBlocks.slice(CONFIG.HAND_SIZE, CONFIG.HAND_SIZE * 2);

  // Place a starting block in the center
  const centerRow = Math.floor(CONFIG.BOARD_ROWS / 2);
  const centerCol = Math.floor(CONFIG.BOARD_COLS / 2);
  const centerId = createBaseId(centerRow, centerCol);
  const startingBlock = allBlocks[CONFIG.HAND_SIZE * 2];

  const centerBase = bases.get(centerId);
  if (centerBase && startingBlock) {
    centerBase.block = startingBlock;
    centerBase.placedBy = null; // Neutral starting block
  }

  return {
    bases,
    hands: {
      player1: player1Hand,
      player2: player2Hand,
    },
    currentPlayer: 'player1',
    selectedBlock: null,
    phase: 'selectingBlock',
    scores: { player1: 0, player2: 0 },
    winner: null,
    moveHistory: [],
    lastMoveBaseId: null,
  };
}

// =============================================================================
// Block Selection
// =============================================================================

/**
 * Select a block from hand
 */
export function selectBlock(state: Par55State, blockId: string): Par55State {
  if (state.phase !== 'selectingBlock') return state;

  const hand = state.hands[state.currentPlayer];
  const block = hand.find((b) => b.id === blockId);
  if (!block) return state;

  return {
    ...state,
    selectedBlock: blockId,
    phase: 'placingBlock',
  };
}

/**
 * Clear block selection
 */
export function clearSelection(state: Par55State): Par55State {
  return {
    ...state,
    selectedBlock: null,
    phase: 'selectingBlock',
  };
}

// =============================================================================
// Placement Validation
// =============================================================================

/**
 * Check if a base is a valid placement target
 */
export function isValidPlacement(state: Par55State, baseId: string): boolean {
  const base = state.bases.get(baseId);
  if (!base) return false;

  // Base must be empty
  if (base.block) return false;

  // Must be adjacent to at least one occupied base
  const hasAdjacentBlock = base.adjacentBases.some((adjId) => {
    const adjBase = state.bases.get(adjId);
    return adjBase?.block !== null;
  });

  return hasAdjacentBlock;
}

/**
 * Get all valid placement bases
 */
export function getValidPlacements(state: Par55State): string[] {
  const valid: string[] = [];

  for (const base of state.bases.values()) {
    if (isValidPlacement(state, base.id)) {
      valid.push(base.id);
    }
  }

  return valid;
}

// =============================================================================
// Scoring
// =============================================================================

/**
 * Calculate points for placing a block at a base
 */
export function calculateScore(
  state: Par55State,
  block: AttributeBlock,
  baseId: string
): { totalPoints: number; matchDetails: MatchDetail[] } {
  const base = state.bases.get(baseId);
  if (!base) return { totalPoints: 0, matchDetails: [] };

  const matchDetails: MatchDetail[] = [];
  let totalPoints = 0;

  // Check each adjacent base for matching attributes
  for (const adjId of base.adjacentBases) {
    const adjBase = state.bases.get(adjId);
    if (adjBase?.block) {
      const matchingAttrs = countMatchingAttributes(block, adjBase.block);
      const points = matchingAttrs.length; // 1 point per matching attribute

      if (points > 0) {
        matchDetails.push({
          adjacentBaseId: adjId,
          matchingAttributes: matchingAttrs,
          points,
        });
        totalPoints += points;
      }
    }
  }

  return { totalPoints, matchDetails };
}

// =============================================================================
// Move Execution
// =============================================================================

/**
 * Place a block on a base
 */
export function placeBlock(state: Par55State, baseId: string): Par55State {
  if (state.phase !== 'placingBlock' || !state.selectedBlock) return state;
  if (!isValidPlacement(state, baseId)) return state;

  const hand = state.hands[state.currentPlayer];
  const block = hand.find((b) => b.id === state.selectedBlock);
  if (!block) return state;

  // Calculate score
  const { totalPoints, matchDetails } = calculateScore(state, block, baseId);

  // Update base
  const newBases = new Map(state.bases);
  const base = newBases.get(baseId);
  if (!base) return state;

  newBases.set(baseId, {
    ...base,
    block,
    placedBy: state.currentPlayer,
  });

  // Remove block from hand
  const newHand = hand.filter((b) => b.id !== block.id);

  // Draw a new block if available
  const allUsedBlockIds = new Set<string>();
  for (const b of state.hands.player1) allUsedBlockIds.add(b.id);
  for (const b of state.hands.player2) allUsedBlockIds.add(b.id);
  for (const base of state.bases.values()) {
    if (base.block) allUsedBlockIds.add(base.block.id);
  }
  allUsedBlockIds.add(block.id);

  // Update scores
  const newScores = { ...state.scores };
  newScores[state.currentPlayer] += totalPoints;

  // Record move
  const move: Par55Move = {
    player: state.currentPlayer,
    block,
    baseId,
    pointsScored: totalPoints,
    matchDetails,
    moveNumber: state.moveHistory.length + 1,
  };

  // Check for winner
  let winner: Player | null = null;
  let phase: Par55State['phase'] = 'selectingBlock';

  if (newScores.player1 >= CONFIG.TARGET_SCORE || newScores.player2 >= CONFIG.TARGET_SCORE) {
    // Check if tie is possible (opponent gets one more turn)
    if (state.currentPlayer === 'player1' && newScores.player1 >= CONFIG.TARGET_SCORE) {
      // Player 2 hasn't had their turn this round yet
      // For simplicity, if either reaches 55, they win
      winner = 'player1';
      phase = 'gameOver';
    } else if (state.currentPlayer === 'player2' && newScores.player2 >= CONFIG.TARGET_SCORE) {
      // Both had a turn, check tie
      if (newScores.player1 >= CONFIG.TARGET_SCORE && newScores.player1 === newScores.player2) {
        // Tie - continue playing
      } else if (newScores.player2 >= CONFIG.TARGET_SCORE) {
        winner = newScores.player2 > newScores.player1 ? 'player2' : 'player1';
        if (newScores.player1 === newScores.player2) winner = null; // Tie
        phase = 'gameOver';
      }
    } else {
      winner = newScores.player1 > newScores.player2 ? 'player1' : 'player2';
      if (newScores.player1 === newScores.player2) winner = null;
      phase = 'gameOver';
    }
  }

  // Check for game over due to no more moves
  if (newHand.length === 0 && !winner) {
    const opponentHand = state.currentPlayer === 'player1'
      ? state.hands.player2
      : state.hands.player1;

    if (opponentHand.length === 0) {
      winner = newScores.player1 > newScores.player2 ? 'player1' :
               newScores.player2 > newScores.player1 ? 'player2' : null;
      phase = 'gameOver';
    }
  }

  return {
    ...state,
    bases: newBases,
    hands: {
      ...state.hands,
      [state.currentPlayer]: newHand,
    },
    currentPlayer: phase === 'gameOver' ? state.currentPlayer : getOpponent(state.currentPlayer),
    selectedBlock: null,
    phase,
    scores: newScores,
    winner,
    moveHistory: [...state.moveHistory, move],
    lastMoveBaseId: baseId,
  };
}

/**
 * Pass turn (if no valid moves)
 */
export function passTurn(state: Par55State): Par55State {
  return {
    ...state,
    currentPlayer: getOpponent(state.currentPlayer),
    selectedBlock: null,
    phase: 'selectingBlock',
  };
}

// =============================================================================
// Game Queries
// =============================================================================

/**
 * Check if player has any valid moves
 */
export function hasValidMoves(state: Par55State): boolean {
  const validPlacements = getValidPlacements(state);
  return validPlacements.length > 0 && state.hands[state.currentPlayer].length > 0;
}

/**
 * Format move for display
 */
export function formatMove(move: Par55Move): string {
  const b = move.block;
  const attrs = `${b.size} ${b.thickness} ${b.color} ${b.shape}`;
  return `${attrs} → ${move.pointsScored} pts`;
}

/**
 * Get attribute display name
 */
export function getAttributeDisplayName(attr: string): string {
  const names: Record<string, string> = {
    shape: 'Shape',
    color: 'Color',
    size: 'Size',
    thickness: 'Thickness',
  };
  return names[attr] || attr;
}
