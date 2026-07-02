// Hex Game Rules
// Player 1 (Blue) wins by connecting top edge to bottom edge
// Player 2 (Red) wins by connecting left edge to right edge

import { HexBoard, HexPosition, Player, HexGameState, getOpponent } from './types';

// Check if a position is valid on the board
export function isValidPosition(pos: HexPosition, boardSize: number): boolean {
  return pos.row >= 0 && pos.row < boardSize && pos.col >= 0 && pos.col < boardSize;
}

// Check if a cell is empty
export function isCellEmpty(board: HexBoard, pos: HexPosition): boolean {
  return board[pos.row][pos.col] === null;
}

// Check if a move is valid (cell exists and is empty)
export function isValidMove(state: HexGameState, pos: HexPosition): boolean {
  if (!isValidPosition(pos, state.boardSize)) return false;
  if (!isCellEmpty(state.board, pos)) return false;
  if (state.winner !== null) return false;
  return true;
}

// Get all 6 neighbors of a hex cell.
// The board is rendered as a parallelogram/rhombus (pointy-top hexes) where each
// row is shifted right by half a hex-width relative to the previous row.  In this
// layout the coordinate system is axial: the six neighbors have FIXED offsets that
// do not depend on row parity:
//
//   (-1, 0)  upper-left      (-1, +1)  upper-right
//   ( 0,-1)  left            ( 0, +1)  right
//   (+1,-1)  lower-left      (+1,  0)  lower-right
//
// (The old code had the same offsets but labelled them incorrectly as
// "top/bottom/left/right", implying a rectangular grid.)
export function getNeighbors(pos: HexPosition, boardSize: number): HexPosition[] {
  const offsets = [
    { row: -1, col:  0 }, // upper-left
    { row: -1, col: +1 }, // upper-right
    { row:  0, col: -1 }, // left
    { row:  0, col: +1 }, // right
    { row: +1, col: -1 }, // lower-left
    { row: +1, col:  0 }, // lower-right
  ];

  return offsets
    .map(o => ({ row: pos.row + o.row, col: pos.col + o.col }))
    .filter(p => isValidPosition(p, boardSize));
}

// Check if player has won using BFS/flood fill
export function checkWinner(board: HexBoard, player: Player, boardSize: number): boolean {
  // Player 1 connects top (row 0) to bottom (row boardSize-1)
  // Player 2 connects left (col 0) to right (col boardSize-1)

  const visited = new Set<string>();
  const queue: HexPosition[] = [];

  const posKey = (pos: HexPosition) => `${pos.row},${pos.col}`;

  if (player === 'player1') {
    // Start from top edge (row 0)
    for (let col = 0; col < boardSize; col++) {
      if (board[0][col] === player) {
        queue.push({ row: 0, col });
        visited.add(posKey({ row: 0, col }));
      }
    }

    // BFS to find path to bottom edge
    while (queue.length > 0) {
      const current = queue.shift()!;

      // Check if reached bottom edge
      if (current.row === boardSize - 1) {
        return true;
      }

      // Explore neighbors
      for (const neighbor of getNeighbors(current, boardSize)) {
        const key = posKey(neighbor);
        if (!visited.has(key) && board[neighbor.row][neighbor.col] === player) {
          visited.add(key);
          queue.push(neighbor);
        }
      }
    }
  } else {
    // Player 2: Start from left edge (col 0)
    for (let row = 0; row < boardSize; row++) {
      if (board[row][0] === player) {
        queue.push({ row, col: 0 });
        visited.add(posKey({ row, col: 0 }));
      }
    }

    // BFS to find path to right edge
    while (queue.length > 0) {
      const current = queue.shift()!;

      // Check if reached right edge
      if (current.col === boardSize - 1) {
        return true;
      }

      // Explore neighbors
      for (const neighbor of getNeighbors(current, boardSize)) {
        const key = posKey(neighbor);
        if (!visited.has(key) && board[neighbor.row][neighbor.col] === player) {
          visited.add(key);
          queue.push(neighbor);
        }
      }
    }
  }

  return false;
}

// Make a move and return the new game state
export function makeMove(state: HexGameState, pos: HexPosition): HexGameState {
  if (!isValidMove(state, pos)) {
    return state;
  }

  // Create new board with the move
  const newBoard = state.board.map(row => [...row]);
  newBoard[pos.row][pos.col] = state.currentPlayer;

  // Check for winner
  const winner = checkWinner(newBoard, state.currentPlayer, state.boardSize)
    ? state.currentPlayer
    : null;

  // Create move record
  const move = {
    player: state.currentPlayer,
    position: pos,
    moveNumber: state.moveHistory.length + 1,
  };

  return {
    board: newBoard,
    currentPlayer: winner ? state.currentPlayer : getOpponent(state.currentPlayer),
    winner,
    boardSize: state.boardSize,
    moveHistory: [...state.moveHistory, move],
  };
}

// Get all valid moves (empty cells)
export function getValidMoves(state: HexGameState): HexPosition[] {
  const moves: HexPosition[] = [];

  if (state.winner !== null) return moves;

  for (let row = 0; row < state.boardSize; row++) {
    for (let col = 0; col < state.boardSize; col++) {
      if (state.board[row][col] === null) {
        moves.push({ row, col });
      }
    }
  }

  return moves;
}

// Get cells that form the winning path (for highlighting)
export function getWinningPath(board: HexBoard, player: Player, boardSize: number): HexPosition[] {
  if (!checkWinner(board, player, boardSize)) return [];

  const visited = new Set<string>();
  const parent = new Map<string, HexPosition | null>();
  const queue: HexPosition[] = [];

  const posKey = (pos: HexPosition) => `${pos.row},${pos.col}`;

  let endPos: HexPosition | null = null;

  if (player === 'player1') {
    // Start from top edge
    for (let col = 0; col < boardSize; col++) {
      if (board[0][col] === player) {
        const pos = { row: 0, col };
        queue.push(pos);
        visited.add(posKey(pos));
        parent.set(posKey(pos), null);
      }
    }

    // BFS to find path to bottom
    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.row === boardSize - 1) {
        endPos = current;
        break;
      }

      for (const neighbor of getNeighbors(current, boardSize)) {
        const key = posKey(neighbor);
        if (!visited.has(key) && board[neighbor.row][neighbor.col] === player) {
          visited.add(key);
          parent.set(key, current);
          queue.push(neighbor);
        }
      }
    }
  } else {
    // Player 2: Start from left edge
    for (let row = 0; row < boardSize; row++) {
      if (board[row][0] === player) {
        const pos = { row, col: 0 };
        queue.push(pos);
        visited.add(posKey(pos));
        parent.set(posKey(pos), null);
      }
    }

    // BFS to find path to right
    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.col === boardSize - 1) {
        endPos = current;
        break;
      }

      for (const neighbor of getNeighbors(current, boardSize)) {
        const key = posKey(neighbor);
        if (!visited.has(key) && board[neighbor.row][neighbor.col] === player) {
          visited.add(key);
          parent.set(key, current);
          queue.push(neighbor);
        }
      }
    }
  }

  // Reconstruct path
  const path: HexPosition[] = [];
  let current = endPos;

  while (current !== null) {
    path.push(current);
    current = parent.get(posKey(current)) || null;
  }

  return path;
}
