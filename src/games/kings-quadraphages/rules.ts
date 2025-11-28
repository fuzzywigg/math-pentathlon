import {
  GameState,
  Position,
  Board,
  BOARD_SIZE,
  isValidPosition,
  isEmpty,
  getPiece,
  getSupply,
  PlayerOwner,
} from './board';

// All 8 possible directions a King can move
const KING_DIRECTIONS: Position[] = [
  { row: -1, col: 0 }, // Up
  { row: 1, col: 0 }, // Down
  { row: 0, col: -1 }, // Left
  { row: 0, col: 1 }, // Right
  { row: -1, col: -1 }, // Up-Left
  { row: -1, col: 1 }, // Up-Right
  { row: 1, col: -1 }, // Down-Left
  { row: 1, col: 1 }, // Down-Right
];

// Find a player's King position on the board
export function findKingPosition(board: Board, player: PlayerOwner): Position | null {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.owner === player) {
        return { row, col };
      }
    }
  }
  return null;
}

// Get all valid positions a King can move to
export function getValidKingMoves(state: GameState, player: PlayerOwner): Position[] {
  const kingPos = findKingPosition(state.board, player);
  if (!kingPos) {
    return [];
  }

  const validMoves: Position[] = [];

  for (const dir of KING_DIRECTIONS) {
    const destination: Position = {
      row: kingPos.row + dir.row,
      col: kingPos.col + dir.col,
    };

    if (isValidKingMove(state, player, destination)) {
      validMoves.push(destination);
    }
  }

  return validMoves;
}

// Check if a specific King move is valid
export function isValidKingMove(
  state: GameState,
  player: PlayerOwner,
  destination: Position
): boolean {
  // Check if destination is within the board
  if (!isValidPosition(destination)) {
    return false;
  }

  // Check if destination is empty (no King, no Quadraphage)
  if (!isEmpty(state.board, destination)) {
    return false;
  }

  // Get current King position
  const kingPos = findKingPosition(state.board, player);
  if (!kingPos) {
    return false;
  }

  // Check if destination is exactly 1 cell away (adjacent)
  const rowDiff = Math.abs(destination.row - kingPos.row);
  const colDiff = Math.abs(destination.col - kingPos.col);

  // Must be exactly 1 cell away in at least one direction, and at most 1 in the other
  if (rowDiff > 1 || colDiff > 1) {
    return false;
  }

  // Can't stay in place
  if (rowDiff === 0 && colDiff === 0) {
    return false;
  }

  return true;
}

// Get all valid positions where a Quadraphage can be placed
export function getValidQuadraphagePlacements(state: GameState): Position[] {
  const validPlacements: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const position = { row, col };
      if (isEmpty(state.board, position)) {
        validPlacements.push(position);
      }
    }
  }

  return validPlacements;
}

// Check if a Quadraphage can be placed at a specific position
export function isValidQuadraphagePlacement(
  state: GameState,
  position: Position
): boolean {
  // Check if position is within the board
  if (!isValidPosition(position)) {
    return false;
  }

  // Check if the cell is empty
  return isEmpty(state.board, position);
}

// Check the win condition - returns the winner or null if game continues
export function checkWinCondition(state: GameState): PlayerOwner | null {
  // Player 1 wins if Player 2's King has zero valid moves
  const player2Moves = getValidKingMoves(state, 'player2');
  if (player2Moves.length === 0) {
    return 'player1';
  }

  // Player 2 wins if Player 1's King has zero valid moves
  const player1Moves = getValidKingMoves(state, 'player1');
  if (player1Moves.length === 0) {
    return 'player2';
  }

  // Game continues
  return null;
}

// Check if a player can complete a full turn (move King + place Quadraphage)
export function canCompleteTurn(state: GameState, player: PlayerOwner): boolean {
  // Check if King has at least 1 valid move
  const validMoves = getValidKingMoves(state, player);
  if (validMoves.length === 0) {
    return false;
  }

  // Check if player has at least 1 Quadraphage in supply
  const supply = getSupply(state, player);
  if (supply <= 0) {
    return false;
  }

  return true;
}

// Check if the game should end in a draw (extremely rare)
export function isDrawCondition(state: GameState): boolean {
  // Check if both players have no valid King moves (shouldn't happen normally)
  const player1Moves = getValidKingMoves(state, 'player1');
  const player2Moves = getValidKingMoves(state, 'player2');

  // If both Kings are trapped simultaneously (theoretically impossible in normal play)
  if (player1Moves.length === 0 && player2Moves.length === 0) {
    return true;
  }

  // Check if board is completely full except Kings and neither is trapped
  const emptyCount = getValidQuadraphagePlacements(state).length;
  if (
    emptyCount === 0 &&
    player1Moves.length > 0 &&
    player2Moves.length > 0
  ) {
    // Board is full, but both Kings can still move (into each other's space)
    // This is actually impossible since Kings can't occupy the same space
    // But handle it as a draw just in case
    return true;
  }

  return false;
}

// Get the opponent player
export function getOpponent(player: PlayerOwner): PlayerOwner {
  return player === 'player1' ? 'player2' : 'player1';
}
