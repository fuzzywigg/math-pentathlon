// Sum Dominoes & Dice Game Rules
// Matching dominoes to dice sums on the board

import {
  SumDominoesState,
  Domino,
  PlacedDomino,
  BoardPosition,
  SDMove,
  Player,
  CONFIG,
  createDominoSet,
  shuffleArray,
  getOpponent,
  rollDice,
  getDiceSum,
} from './types';

// =============================================================================
// State Creation
// =============================================================================

/**
 * Create initial game state
 */
export function createInitialState(): SumDominoesState {
  // Create and shuffle domino set
  const dominoes = shuffleArray(createDominoSet());

  // Deal hands
  const player1Hand = dominoes.slice(0, CONFIG.STARTING_HAND_SIZE).map((d) => ({
    ...d,
    owner: 'player1' as Player,
  }));
  const player2Hand = dominoes
    .slice(CONFIG.STARTING_HAND_SIZE, CONFIG.STARTING_HAND_SIZE * 2)
    .map((d) => ({
      ...d,
      owner: 'player2' as Player,
    }));

  // Create empty board
  const board: (PlacedDomino | null)[][] = [];
  for (let r = 0; r < CONFIG.BOARD_SIZE; r++) {
    board.push(new Array(CONFIG.BOARD_SIZE).fill(null));
  }

  // Place starting domino in center (double-six if available, otherwise highest double)
  const remainingDominoes = dominoes.slice(CONFIG.STARTING_HAND_SIZE * 2);
  let startingDomino = remainingDominoes.find((d) => d.face1 === 6 && d.face2 === 6);
  if (!startingDomino) {
    startingDomino = remainingDominoes.find((d) => d.face1 === d.face2);
  }
  if (!startingDomino) {
    startingDomino = remainingDominoes[0];
  }

  if (startingDomino) {
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = {
      domino: { ...startingDomino, orientation: 'horizontal' },
      position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
      orientation: 'horizontal',
    };
  }

  return {
    board,
    hands: {
      player1: player1Hand,
      player2: player2Hand,
    },
    currentPlayer: 'player1',
    currentDice: null,
    selectedDomino: null,
    phase: 'rolling',
    winner: null,
    moveHistory: [],
    passCount: 0,
  };
}

// =============================================================================
// Dice Rolling
// =============================================================================

/**
 * Roll dice for current turn
 */
export function doRollDice(state: SumDominoesState): SumDominoesState {
  if (state.phase !== 'rolling') return state;

  const dice = rollDice();
  const sum = getDiceSum(dice);

  // Check if player can play any domino
  const hand = state.hands[state.currentPlayer];
  const canPlay = hand.some((domino) => canPlayDomino(state, domino, sum));

  return {
    ...state,
    currentDice: dice,
    phase: canPlay ? 'placing' : 'passing',
  };
}

// =============================================================================
// Move Validation
// =============================================================================

/**
 * Check if a domino can be played anywhere on the board
 */
export function canPlayDomino(
  state: SumDominoesState,
  domino: Domino,
  targetSum: number
): boolean {
  // Check all possible positions
  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      if (state.board[row][col]) continue; // Cell occupied

      // Check both orientations
      for (const orientation of ['horizontal', 'vertical'] as const) {
        if (isValidPlacement(state, domino, { row, col }, orientation, targetSum)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Check if a specific placement is valid
 */
export function isValidPlacement(
  state: SumDominoesState,
  domino: Domino,
  position: BoardPosition,
  orientation: 'horizontal' | 'vertical',
  targetSum: number
): boolean {
  const { row, col } = position;

  // Check bounds
  if (row < 0 || row >= CONFIG.BOARD_SIZE || col < 0 || col >= CONFIG.BOARD_SIZE) {
    return false;
  }

  // For horizontal: check col+1 is also in bounds (domino occupies 2 cells)
  // For vertical: check row+1 is also in bounds
  if (orientation === 'horizontal' && col + 1 >= CONFIG.BOARD_SIZE) return false;
  if (orientation === 'vertical' && row + 1 >= CONFIG.BOARD_SIZE) return false;

  // Check cells are empty
  if (state.board[row][col]) return false;
  if (orientation === 'horizontal' && state.board[row][col + 1]) return false;
  if (orientation === 'vertical' && state.board[row + 1][col]) return false;

  // Find adjacent faces and check if any match the target sum
  const adjacentMatches = getAdjacentMatches(state, domino, position, orientation, targetSum);

  return adjacentMatches.length > 0;
}

/**
 * Get all adjacent faces that match the target sum
 */
function getAdjacentMatches(
  state: SumDominoesState,
  domino: Domino,
  position: BoardPosition,
  orientation: 'horizontal' | 'vertical',
  targetSum: number
): Array<{ myFace: number; adjacentFace: number; adjacentPos: BoardPosition }> {
  const matches: Array<{
    myFace: number;
    adjacentFace: number;
    adjacentPos: BoardPosition;
  }> = [];
  const { row, col } = position;

  // Get cells occupied by this domino
  const cells: Array<{ r: number; c: number; face: number }> = [];
  if (orientation === 'horizontal') {
    cells.push({ r: row, c: col, face: domino.face1 });
    cells.push({ r: row, c: col + 1, face: domino.face2 });
  } else {
    cells.push({ r: row, c: col, face: domino.face1 });
    cells.push({ r: row + 1, c: col, face: domino.face2 });
  }

  // Check all adjacent positions for each cell
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (const cell of cells) {
    for (const [dr, dc] of directions) {
      const nr = cell.r + dr;
      const nc = cell.c + dc;

      // Skip if out of bounds
      if (nr < 0 || nr >= CONFIG.BOARD_SIZE || nc < 0 || nc >= CONFIG.BOARD_SIZE) {
        continue;
      }

      // Skip if this is another cell of the same domino being placed
      if (cells.some((c) => c.r === nr && c.c === nc)) continue;

      const adjacentPlaced = state.board[nr][nc];
      if (adjacentPlaced) {
        // Get the face value that's adjacent to our cell
        const adjacentFace = getFaceAtPosition(adjacentPlaced, { row: nr, col: nc });
        if (adjacentFace !== null) {
          // Check if my face + adjacent face = target sum
          if (cell.face + adjacentFace === targetSum) {
            matches.push({
              myFace: cell.face,
              adjacentFace,
              adjacentPos: { row: nr, col: nc },
            });
          }
        }
      }
    }
  }

  return matches;
}

/**
 * Get the face value at a specific board position
 */
function getFaceAtPosition(placed: PlacedDomino, position: BoardPosition): number | null {
  const { row, col } = position;
  const pRow = placed.position.row;
  const pCol = placed.position.col;

  if (placed.orientation === 'horizontal') {
    if (row === pRow && col === pCol) return placed.domino.face1;
    if (row === pRow && col === pCol + 1) return placed.domino.face2;
  } else {
    if (row === pRow && col === pCol) return placed.domino.face1;
    if (row === pRow + 1 && col === pCol) return placed.domino.face2;
  }

  return null;
}

/**
 * Get all valid placements for a domino
 */
export function getValidPlacements(
  state: SumDominoesState,
  domino: Domino,
  targetSum: number
): Array<{ position: BoardPosition; orientation: 'horizontal' | 'vertical' }> {
  const placements: Array<{
    position: BoardPosition;
    orientation: 'horizontal' | 'vertical';
  }> = [];

  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      for (const orientation of ['horizontal', 'vertical'] as const) {
        if (isValidPlacement(state, domino, { row, col }, orientation, targetSum)) {
          placements.push({ position: { row, col }, orientation });
        }
      }
    }
  }

  return placements;
}

// =============================================================================
// Move Execution
// =============================================================================

/**
 * Select a domino from hand
 */
export function selectDomino(state: SumDominoesState, dominoId: string): SumDominoesState {
  if (state.phase !== 'placing') return state;

  const hand = state.hands[state.currentPlayer];
  const domino = hand.find((d) => d.id === dominoId);

  if (!domino) return state;
  if (!state.currentDice) return state;

  const sum = getDiceSum(state.currentDice);
  if (!canPlayDomino(state, domino, sum)) return state;

  return {
    ...state,
    selectedDomino: dominoId,
  };
}

/**
 * Place a domino on the board
 */
export function placeDomino(
  state: SumDominoesState,
  position: BoardPosition,
  orientation: 'horizontal' | 'vertical'
): SumDominoesState {
  if (state.phase !== 'placing' || !state.selectedDomino || !state.currentDice) {
    return state;
  }

  const hand = state.hands[state.currentPlayer];
  const domino = hand.find((d) => d.id === state.selectedDomino);

  if (!domino) return state;

  const sum = getDiceSum(state.currentDice);
  if (!isValidPlacement(state, domino, position, orientation, sum)) {
    return state;
  }

  // Get the match info for the move record
  const matches = getAdjacentMatches(state, domino, position, orientation, sum);
  const match = matches[0]; // Use first match

  // Place domino on board
  const newBoard = state.board.map((row) => [...row]);
  const placedDomino: PlacedDomino = {
    domino: { ...domino, orientation },
    position,
    orientation,
  };
  newBoard[position.row][position.col] = placedDomino;

  // For double-cell placement, mark second cell too (reference same object)
  if (orientation === 'horizontal') {
    newBoard[position.row][position.col + 1] = placedDomino;
  } else {
    newBoard[position.row + 1][position.col] = placedDomino;
  }

  // Remove domino from hand
  const newHand = hand.filter((d) => d.id !== domino.id);

  // Record move
  const move: SDMove = {
    player: state.currentPlayer,
    domino,
    position,
    orientation,
    matchedFace: match.myFace,
    adjacentFace: match.adjacentFace,
    diceSum: sum,
    moveNumber: state.moveHistory.length + 1,
  };

  // Check for winner
  const newHands = {
    ...state.hands,
    [state.currentPlayer]: newHand,
  };
  const winner = newHand.length === 0 ? state.currentPlayer : null;

  return {
    ...state,
    board: newBoard,
    hands: newHands,
    currentPlayer: winner ? state.currentPlayer : getOpponent(state.currentPlayer),
    currentDice: null,
    selectedDomino: null,
    phase: winner ? 'gameOver' : 'rolling',
    winner,
    moveHistory: [...state.moveHistory, move],
    passCount: 0,
  };
}

/**
 * Pass turn (when unable to play)
 */
export function passTurn(state: SumDominoesState): SumDominoesState {
  if (state.phase !== 'passing') return state;

  const newPassCount = state.passCount + 1;

  // If both players pass consecutively, game ends
  if (newPassCount >= 2) {
    // Count remaining pips to determine winner
    const p1Pips = state.hands.player1.reduce(
      (sum, d) => sum + d.face1 + d.face2,
      0
    );
    const p2Pips = state.hands.player2.reduce(
      (sum, d) => sum + d.face1 + d.face2,
      0
    );

    const winner = p1Pips < p2Pips ? 'player1' : p2Pips < p1Pips ? 'player2' : null;

    return {
      ...state,
      phase: 'gameOver',
      winner,
      passCount: newPassCount,
    };
  }

  return {
    ...state,
    currentPlayer: getOpponent(state.currentPlayer),
    currentDice: null,
    phase: 'rolling',
    passCount: newPassCount,
  };
}

// =============================================================================
// Display Helpers
// =============================================================================

/**
 * Format move for history display
 */
export function formatMove(move: SDMove): string {
  const d = move.domino;
  return `[${d.face1}|${d.face2}] (${move.matchedFace}+${move.adjacentFace}=${move.diceSum})`;
}

/**
 * Get remaining dominoes count
 */
export function getRemainingCount(state: SumDominoesState, player: Player): number {
  return state.hands[player].length;
}
