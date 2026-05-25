// Queens & Guards Game Rules
// Movement, capture, and win condition logic

import {
  QueensGuardsState,
  Player,
  BoardCoord,
  QGMove,
  CONFIG,
  cellKey,
  parseKey,
  getAdjacent,
  cellsInRing,
  getOpponent,
  isMoveValid,
} from './types';

// =============================================================================
// Valid Moves
// =============================================================================

/**
 * Get all valid moves for a piece
 */
export function getValidMoves(state: QueensGuardsState, from: BoardCoord): BoardCoord[] {
  const cell = state.cells.get(cellKey(from.ring, from.position));
  if (!cell?.piece) return [];

  const piece = cell.piece;

  // If not current player's piece, no moves
  if (piece.player !== state.currentPlayer) return [];

  // Get adjacent cells
  const adjacent = getAdjacent(from);
  const validMoves: BoardCoord[] = [];

  for (const to of adjacent) {
    // Check if cell exists and is empty
    const targetCell = state.cells.get(cellKey(to.ring, to.position));
    if (!targetCell || targetCell.piece) continue;

    // Check movement direction rules
    if (!isMoveValid(from, to)) continue;

    // Only queen can move to center (throne)
    if (to.ring === 0 && piece.type !== 'queen') continue;

    // Check if move would result in being sandwiched (self-capture)
    if (wouldBeSandwiched(state, to, piece.player)) continue;

    validMoves.push(to);
  }

  return validMoves;
}

/**
 * Check if placing a piece at coord would result in being sandwiched
 */
function wouldBeSandwiched(state: QueensGuardsState, coord: BoardCoord, player: Player): boolean {
  const opponent = getOpponent(player);

  // Check all three directions through this hex
  const directions = getDirectionPairs(coord);

  for (const [dir1, dir2] of directions) {
    const cell1 = state.cells.get(cellKey(dir1.ring, dir1.position));
    const cell2 = state.cells.get(cellKey(dir2.ring, dir2.position));

    if (
      cell1?.piece?.player === opponent &&
      cell2?.piece?.player === opponent
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Get pairs of opposite directions from a cell for sandwich checking
 * Returns pairs of coordinates that form straight lines through the cell
 */
function getDirectionPairs(coord: BoardCoord): [BoardCoord, BoardCoord][] {
  const pairs: [BoardCoord, BoardCoord][] = [];
  const adjacent = getAdjacent(coord);

  // For each adjacent cell, find its "opposite" for sandwich check
  // This is simplified - in hex geometry, opposites depend on ring position
  for (let i = 0; i < adjacent.length; i++) {
    for (let j = i + 1; j < adjacent.length; j++) {
      // Check if these two form a straight line through coord
      // For now, approximate by checking if they're roughly opposite
      const a = adjacent[i];
      const b = adjacent[j];

      // Same ring, opposite sides
      if (a.ring === b.ring && a.ring === coord.ring) {
        const diff = Math.abs(a.position - b.position);
        const halfRing = cellsInRing(a.ring) / 2;
        if (Math.abs(diff - halfRing) < 2) {
          pairs.push([a, b]);
        }
      }

      // One inner, one outer
      if (
        (a.ring < coord.ring && b.ring > coord.ring) ||
        (a.ring > coord.ring && b.ring < coord.ring)
      ) {
        pairs.push([a, b]);
      }
    }
  }

  return pairs;
}

// =============================================================================
// Move Execution
// =============================================================================

/**
 * Execute a move
 */
export function makeMove(state: QueensGuardsState, from: BoardCoord, to: BoardCoord): QueensGuardsState {
  const validMoves = getValidMoves(state, from);
  const isValid = validMoves.some((m) => m.ring === to.ring && m.position === to.position);

  if (!isValid) return state;

  // Clone cells
  const newCells = new Map(state.cells);
  const fromKey = cellKey(from.ring, from.position);
  const toKey = cellKey(to.ring, to.position);

  const fromCell = { ...newCells.get(fromKey)! };
  const toCell = { ...newCells.get(toKey)! };
  const piece = fromCell.piece!;

  // Move piece
  fromCell.piece = null;
  toCell.piece = piece;

  newCells.set(fromKey, fromCell);
  newCells.set(toKey, toCell);

  // Check for captures (sandwiching opponent pieces)
  const captured = checkCaptures(newCells, to, state.currentPlayer);

  // Record move
  const move: QGMove = {
    player: state.currentPlayer,
    from,
    to,
    pieceType: piece.type,
    wasCapture: captured.length > 0,
    moveNumber: state.moveHistory.length + 1,
  };

  let newState: QueensGuardsState = {
    ...state,
    cells: newCells,
    selectedPiece: null,
    capturedPieces: [...state.capturedPieces, ...captured],
    currentPlayer: captured.length > 0 ? state.currentPlayer : getOpponent(state.currentPlayer),
    moveHistory: [...state.moveHistory, move],
  };

  // Check for winner
  const winner = checkWinner(newState);
  if (winner) {
    newState = { ...newState, winner };
  }

  return newState;
}

/**
 * Check for captures after a move and mark captured pieces
 */
function checkCaptures(cells: Map<string, { ring: number; position: number; piece: { id: string; player: Player; type: 'queen' | 'guard' } | null }>, movedTo: BoardCoord, mover: Player): BoardCoord[] {
  const captured: BoardCoord[] = [];
  const opponent = getOpponent(mover);

  // Check all adjacent cells for potential sandwiches
  const adjacent = getAdjacent(movedTo);

  for (const adj of adjacent) {
    const adjCell = cells.get(cellKey(adj.ring, adj.position));
    if (!adjCell?.piece || adjCell.piece.player !== opponent) continue;

    // Check if this opponent piece is now sandwiched
    const furtherAdjacent = getAdjacent(adj);

    for (const far of furtherAdjacent) {
      // Skip if it's the cell we just moved to
      if (far.ring === movedTo.ring && far.position === movedTo.position) continue;

      const farCell = cells.get(cellKey(far.ring, far.position));

      // Check if movedTo and far form a straight line through adj
      // and farCell has our piece
      if (farCell?.piece?.player === mover) {
        // Verify they form a line (simplified check)
        if (formsLine(movedTo, adj, far)) {
          captured.push(adj);
          break;
        }
      }
    }
  }

  return captured;
}

/**
 * Check if three coordinates form a straight line
 */
function formsLine(a: BoardCoord, b: BoardCoord, c: BoardCoord): boolean {
  // Simplified: check if b is "between" a and c geometrically
  // All three on same ring
  if (a.ring === b.ring && b.ring === c.ring) {
    const positions = [a.position, b.position, c.position].sort((x, y) => x - y);
    // Check if middle position is actually between
    return positions[1] === b.position || positions[1] === a.position || positions[1] === c.position;
  }

  // Line going through rings (radial)
  if (
    (a.ring < b.ring && b.ring < c.ring) ||
    (a.ring > b.ring && b.ring > c.ring)
  ) {
    return true;
  }

  return false;
}

/**
 * Move a captured piece to the outer ring
 */
export function restoreCapturedPiece(
  state: QueensGuardsState,
  capturedCoord: BoardCoord,
  targetCoord: BoardCoord
): QueensGuardsState {
  // Target must be on outer ring
  if (targetCoord.ring !== CONFIG.NUM_RINGS - 1) return state;

  // Target must be empty
  const targetKey = cellKey(targetCoord.ring, targetCoord.position);
  const targetCell = state.cells.get(targetKey);
  if (targetCell?.piece) return state;

  // Clone cells
  const newCells = new Map(state.cells);
  const capturedKey = cellKey(capturedCoord.ring, capturedCoord.position);

  const capturedCell = { ...newCells.get(capturedKey)! };
  const piece = capturedCell.piece;
  if (!piece) return state;

  // Move to outer ring
  capturedCell.piece = null;
  newCells.set(capturedKey, capturedCell);

  const newTarget = { ...newCells.get(targetKey)! };
  newTarget.piece = piece;
  newCells.set(targetKey, newTarget);

  // Remove from captured list
  const newCaptured = state.capturedPieces.filter(
    (c) => c.ring !== capturedCoord.ring || c.position !== capturedCoord.position
  );

  return {
    ...state,
    cells: newCells,
    capturedPieces: newCaptured,
    currentPlayer: newCaptured.length > 0 ? state.currentPlayer : getOpponent(state.currentPlayer),
  };
}

// =============================================================================
// Win Condition
// =============================================================================

/**
 * Check for a winner
 * Win: Queen in center with all 6 guards surrounding it
 */
export function checkWinner(state: QueensGuardsState): Player | null {
  // Check if either queen is in the center
  const centerCell = state.cells.get(cellKey(0, 0));
  if (!centerCell?.piece || centerCell.piece.type !== 'queen') return null;

  const queenOwner = centerCell.piece.player;

  // Check if all 6 cells in ring 1 have guards of the same player
  for (let pos = 0; pos < 6; pos++) {
    const guardCell = state.cells.get(cellKey(1, pos));
    if (!guardCell?.piece) return null;
    if (guardCell.piece.player !== queenOwner) return null;
    if (guardCell.piece.type !== 'guard') return null;
  }

  return queenOwner;
}

/**
 * Check if current player has any valid moves
 */
export function hasValidMoves(state: QueensGuardsState): boolean {
  for (const [key, cell] of state.cells) {
    if (cell.piece?.player === state.currentPlayer) {
      const coord = parseKey(key);
      const moves = getValidMoves(state, coord);
      if (moves.length > 0) return true;
    }
  }
  return false;
}

/**
 * Select a piece
 */
export function selectPiece(state: QueensGuardsState, coord: BoardCoord): QueensGuardsState {
  const key = cellKey(coord.ring, coord.position);
  const cell = state.cells.get(key);

  // Can only select own pieces
  if (!cell?.piece || cell.piece.player !== state.currentPlayer) {
    return { ...state, selectedPiece: null };
  }

  // Check if piece has valid moves
  const moves = getValidMoves(state, coord);
  if (moves.length === 0) {
    return { ...state, selectedPiece: null };
  }

  return {
    ...state,
    selectedPiece: state.selectedPiece === key ? null : key,
  };
}
