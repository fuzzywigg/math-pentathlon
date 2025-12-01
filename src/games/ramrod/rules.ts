// Ramrod Game Rules
// Place rods to complete sum boxes, capture with addend combinations

import {
  RamrodState,
  SumBox,
  Rod,
  RamrodMove,
  Player,
  CONFIG,
  createRodSet,
  shuffleArray,
  getOpponent,
  createBoxId,
} from './types';

// =============================================================================
// State Creation
// =============================================================================

/**
 * Create the game board with sum boxes
 */
function createBoard(): Map<string, SumBox> {
  const boxes = new Map<string, SumBox>();

  // Create sum boxes with various target sums (2-12 range)
  const targetSums = [
    [5, 6, 7, 8],
    [6, 7, 8, 9],
    [7, 8, 9, 10],
  ];

  for (let row = 0; row < CONFIG.BOARD_ROWS; row++) {
    for (let col = 0; col < CONFIG.BOARD_COLS; col++) {
      const id = createBoxId(row, col);
      boxes.set(id, {
        id,
        targetSum: targetSums[row][col],
        row,
        col,
        rods: [null, null],
        completedBy: null,
      });
    }
  }

  return boxes;
}

/**
 * Create initial game state
 */
export function createInitialState(): RamrodState {
  const boxes = createBoard();
  const allRods = shuffleArray(createRodSet());
  const rods = new Map<string, Rod>();

  // Put all rods in the map
  for (const rod of allRods) {
    rods.set(rod.id, rod);
  }

  // Deal starting rods to players
  const player1Rods: string[] = [];
  const player2Rods: string[] = [];

  for (let i = 0; i < CONFIG.STARTING_RODS_PER_PLAYER; i++) {
    const rod1 = allRods[i * 2];
    const rod2 = allRods[i * 2 + 1];

    rod1.owner = 'player1';
    player1Rods.push(rod1.id);

    rod2.owner = 'player2';
    player2Rods.push(rod2.id);
  }

  return {
    boxes,
    rods,
    playerRods: {
      player1: player1Rods,
      player2: player2Rods,
    },
    currentPlayer: 'player1',
    selectedRod: null,
    phase: 'selectingRod',
    scores: { player1: 0, player2: 0 },
    winner: null,
    moveHistory: [],
  };
}

// =============================================================================
// Rod Selection
// =============================================================================

/**
 * Select a rod from the player's collection
 */
export function selectRod(state: RamrodState, rodId: string): RamrodState {
  if (state.phase !== 'selectingRod') return state;

  const playerRods = state.playerRods[state.currentPlayer];
  if (!playerRods.includes(rodId)) return state;

  return {
    ...state,
    selectedRod: rodId,
    phase: 'placingRod',
  };
}

/**
 * Clear rod selection
 */
export function clearSelection(state: RamrodState): RamrodState {
  return {
    ...state,
    selectedRod: null,
    phase: 'selectingRod',
  };
}

// =============================================================================
// Placement Validation
// =============================================================================

/**
 * Check if a rod can be placed in a box slot
 */
export function isValidPlacement(
  state: RamrodState,
  rodId: string,
  boxId: string,
  slot: number
): boolean {
  const box = state.boxes.get(boxId);
  const rod = state.rods.get(rodId);

  if (!box || !rod) return false;
  if (box.completedBy) return false; // Box already captured
  if (box.rods[slot]) return false; // Slot already occupied

  // Check if rod fits (single rod can't exceed target)
  if (rod.length > box.targetSum) return false;

  // If there's already a rod in the other slot, check if they can sum correctly
  const otherSlot = slot === 0 ? 1 : 0;
  const otherRod = box.rods[otherSlot];

  if (otherRod) {
    // Check if this would complete the box correctly
    if (otherRod.length + rod.length !== box.targetSum) {
      return false;
    }
  }

  return true;
}

/**
 * Get all valid placements for a rod
 */
export function getValidPlacements(
  state: RamrodState,
  rodId: string
): Array<{ boxId: string; slot: number }> {
  const placements: Array<{ boxId: string; slot: number }> = [];

  for (const box of state.boxes.values()) {
    for (const slot of [0, 1]) {
      if (isValidPlacement(state, rodId, box.id, slot)) {
        placements.push({ boxId: box.id, slot });
      }
    }
  }

  return placements;
}

// =============================================================================
// Move Execution
// =============================================================================

/**
 * Place a rod in a box
 */
export function placeRod(
  state: RamrodState,
  boxId: string,
  slot: number
): RamrodState {
  if (state.phase !== 'placingRod' || !state.selectedRod) return state;
  if (!isValidPlacement(state, state.selectedRod, boxId, slot)) return state;

  const rod = state.rods.get(state.selectedRod);
  const box = state.boxes.get(boxId);
  if (!rod || !box) return state;

  // Update rod
  const newRods = new Map(state.rods);
  const updatedRod: Rod = {
    ...rod,
    position: { boxId, slot },
  };
  newRods.set(rod.id, updatedRod);

  // Update box
  const newBoxes = new Map(state.boxes);
  const newBoxRods: [Rod | null, Rod | null] = [...box.rods];
  newBoxRods[slot] = updatedRod;

  // Check if box is completed
  let captured = false;
  let pointsScored = 0;

  if (newBoxRods[0] && newBoxRods[1]) {
    const sum = newBoxRods[0].length + newBoxRods[1].length;
    if (sum === box.targetSum) {
      captured = true;
      pointsScored = box.targetSum;
    }
  }

  const updatedBox: SumBox = {
    ...box,
    rods: newBoxRods,
    completedBy: captured ? state.currentPlayer : null,
  };
  newBoxes.set(boxId, updatedBox);

  // Remove rod from player's collection
  const newPlayerRods = { ...state.playerRods };
  newPlayerRods[state.currentPlayer] = state.playerRods[state.currentPlayer].filter(
    (id) => id !== state.selectedRod
  );

  // Draw a new rod if available
  const usedRodIds = new Set<string>();
  for (const r of state.rods.values()) {
    if (r.owner || r.position) usedRodIds.add(r.id);
  }

  // Find an available rod
  for (const r of state.rods.values()) {
    if (!usedRodIds.has(r.id) && !r.owner && !r.position) {
      const drawnRod: Rod = { ...r, owner: state.currentPlayer };
      newRods.set(r.id, drawnRod);
      newPlayerRods[state.currentPlayer].push(r.id);
      break;
    }
  }

  // Update scores
  const newScores = { ...state.scores };
  if (captured) {
    newScores[state.currentPlayer] += pointsScored;
  }

  // Record move
  const move: RamrodMove = {
    player: state.currentPlayer,
    rod: updatedRod,
    boxId,
    slot,
    capturedBox: captured,
    pointsScored,
    moveNumber: state.moveHistory.length + 1,
  };

  // Check for winner
  let winner: Player | null = null;
  let phase: RamrodState['phase'] = 'selectingRod';

  if (newScores.player1 >= CONFIG.TARGET_SCORE) {
    winner = 'player1';
    phase = 'gameOver';
  } else if (newScores.player2 >= CONFIG.TARGET_SCORE) {
    winner = 'player2';
    phase = 'gameOver';
  }

  // Check if game should end (no more moves possible)
  if (!winner) {
    const nextPlayer = getOpponent(state.currentPlayer);
    const nextPlayerHasRods = newPlayerRods[nextPlayer].length > 0;
    const currentPlayerHasRods = newPlayerRods[state.currentPlayer].length > 0;

    if (!nextPlayerHasRods && !currentPlayerHasRods) {
      // Both players out of rods
      winner = newScores.player1 > newScores.player2 ? 'player1' :
               newScores.player2 > newScores.player1 ? 'player2' : null;
      phase = 'gameOver';
    }
  }

  return {
    ...state,
    boxes: newBoxes,
    rods: newRods,
    playerRods: newPlayerRods,
    currentPlayer: phase === 'gameOver' ? state.currentPlayer : getOpponent(state.currentPlayer),
    selectedRod: null,
    phase,
    scores: newScores,
    winner,
    moveHistory: [...state.moveHistory, move],
  };
}

/**
 * Pass turn (if no valid moves)
 */
export function passTurn(state: RamrodState): RamrodState {
  return {
    ...state,
    currentPlayer: getOpponent(state.currentPlayer),
    selectedRod: null,
    phase: 'selectingRod',
  };
}

// =============================================================================
// Game Queries
// =============================================================================

/**
 * Check if player has any valid moves
 */
export function hasValidMoves(state: RamrodState): boolean {
  const playerRods = state.playerRods[state.currentPlayer];

  for (const rodId of playerRods) {
    const placements = getValidPlacements(state, rodId);
    if (placements.length > 0) return true;
  }

  return false;
}

/**
 * Format move for display
 */
export function formatMove(move: RamrodMove): string {
  const rodLen = move.rod.length;
  const captured = move.capturedBox ? ` (+${move.pointsScored}cm)` : '';
  return `Rod ${rodLen}cm${captured}`;
}

/**
 * Get the sum of two rods in a box (if both present)
 */
export function getBoxSum(box: SumBox): number | null {
  if (box.rods[0] && box.rods[1]) {
    return box.rods[0].length + box.rods[1].length;
  }
  return null;
}

/**
 * Get remaining needed value for a box
 */
export function getRemainingValue(box: SumBox): number {
  if (box.rods[0] && !box.rods[1]) {
    return box.targetSum - box.rods[0].length;
  }
  if (!box.rods[0] && box.rods[1]) {
    return box.targetSum - box.rods[1].length;
  }
  return box.targetSum;
}
