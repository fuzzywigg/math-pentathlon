import { PlayerOwner } from './pieces';
import {
  isValidKingMove,
  isValidQuadraphagePlacement,
  checkWinCondition,
  getOpponent,
} from './rules';

// Board dimensions
const BOARD_SIZE = 9;

// Piece on the board
export interface GamePiece {
  type: 'king' | 'quadraphage';
  owner: PlayerOwner;
}

// Cell is either empty or has a piece
export type Cell = GamePiece | null;

// Board is a 9x9 grid (1-based indexing: rows 1-9, cols 1-9)
// Stored as 0-indexed internally
export type Board = Cell[][];

// Position using 1-based indexing (to match official game board)
export interface Position {
  row: number; // 1-9
  col: number; // 1-9
}

// Turn phases
export type TurnPhase = 'moveKing' | 'placeQuadraphage' | 'gameOver';

// Move history entry
export interface MoveHistoryEntry {
  player: PlayerOwner;
  action: 'moveKing' | 'placeQuadraphage';
  from?: Position;
  to: Position;
}

// Complete game state
export interface GameState {
  board: Board;
  currentPlayer: PlayerOwner;
  turnPhase: TurnPhase;
  player1Supply: number;
  player2Supply: number;
  selectedKingPosition: Position | null;
  winner: PlayerOwner | null;
  moveHistory: MoveHistoryEntry[];
}

// Convert 1-based position to 0-based index
function toIndex(pos: Position): { row: number; col: number } {
  return { row: pos.row - 1, col: pos.col - 1 };
}

// Convert 0-based index to 1-based position
function toPosition(index: { row: number; col: number }): Position {
  return { row: index.row + 1, col: index.col + 1 };
}

// Create a deep copy of the board
function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

// Create the initial game state
export function createInitialGameState(): GameState {
  // Create empty 9x9 board
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );

  // Place Player 1 King at row 1, col 5 (0-indexed: row 0, col 4)
  board[0][4] = { type: 'king', owner: 'player1' };

  // Place Player 2 King at row 9, col 5 (0-indexed: row 8, col 4)
  board[8][4] = { type: 'king', owner: 'player2' };

  return {
    board,
    currentPlayer: 'player1',
    turnPhase: 'moveKing',
    player1Supply: 30,
    player2Supply: 30,
    selectedKingPosition: null,
    winner: null,
    moveHistory: [],
  };
}

// Get king position for a player (returns 1-based position)
export function getKingPosition(state: GameState, player: PlayerOwner): Position | null {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = state.board[row][col];
      if (cell && cell.type === 'king' && cell.owner === player) {
        return toPosition({ row, col });
      }
    }
  }
  return null;
}

// Get supply for a player
export function getSupply(state: GameState, player: PlayerOwner): number {
  return player === 'player1' ? state.player1Supply : state.player2Supply;
}

// Get current phase message
export function getCurrentPhaseMessage(state: GameState): string {
  const playerName = state.currentPlayer === 'player1' ? 'Player 1' : 'Player 2';

  switch (state.turnPhase) {
    case 'moveKing':
      return `${playerName}: Move your King`;
    case 'placeQuadraphage':
      return `${playerName}: Place a Quadraphage`;
    case 'gameOver': {
      const winnerName = state.winner === 'player1' ? 'Player 1' : 'Player 2';
      return `Game Over! ${winnerName} wins!`;
    }
  }
}

// Convert GameState to rules engine format
function toRulesGameState(state: GameState) {
  return {
    board: state.board,
    player1Supply: state.player1Supply,
    player2Supply: state.player2Supply,
  };
}

// Select the current player's king
export function selectKing(state: GameState): GameState {
  if (state.turnPhase !== 'moveKing') {
    return state;
  }

  const kingPos = getKingPosition(state, state.currentPlayer);
  if (!kingPos) {
    return state;
  }

  return {
    ...state,
    selectedKingPosition: kingPos,
  };
}

// Move the king to a new position
export function moveKing(state: GameState, destination: Position): GameState {
  if (state.turnPhase !== 'moveKing') {
    return state;
  }

  const kingPos = getKingPosition(state, state.currentPlayer);
  if (!kingPos) {
    return state;
  }

  // Convert to 0-based for rules engine
  const destIndex = toIndex(destination);
  const rulesState = toRulesGameState(state);

  // Validate the move
  if (!isValidKingMove(rulesState, state.currentPlayer, destIndex)) {
    return state;
  }

  // Create new board with king moved
  const newBoard = cloneBoard(state.board);
  const fromIndex = toIndex(kingPos);

  // Clear old position
  newBoard[fromIndex.row][fromIndex.col] = null;

  // Place king at new position
  newBoard[destIndex.row][destIndex.col] = { type: 'king', owner: state.currentPlayer };

  // Create move history entry
  const moveEntry: MoveHistoryEntry = {
    player: state.currentPlayer,
    action: 'moveKing',
    from: kingPos,
    to: destination,
  };

  return {
    ...state,
    board: newBoard,
    selectedKingPosition: null,
    turnPhase: 'placeQuadraphage',
    moveHistory: [...state.moveHistory, moveEntry],
  };
}

// Place a quadraphage at a position
export function placeQuadraphage(state: GameState, position: Position): GameState {
  if (state.turnPhase !== 'placeQuadraphage') {
    return state;
  }

  // Check supply
  const supply = getSupply(state, state.currentPlayer);
  if (supply <= 0) {
    return state;
  }

  // Convert to 0-based for rules engine
  const posIndex = toIndex(position);
  const rulesState = toRulesGameState(state);

  // Validate the placement
  if (!isValidQuadraphagePlacement(rulesState, posIndex)) {
    return state;
  }

  // Create new board with quadraphage placed
  const newBoard = cloneBoard(state.board);
  newBoard[posIndex.row][posIndex.col] = { type: 'quadraphage', owner: state.currentPlayer };

  // Update supply
  const newPlayer1Supply =
    state.currentPlayer === 'player1' ? state.player1Supply - 1 : state.player1Supply;
  const newPlayer2Supply =
    state.currentPlayer === 'player2' ? state.player2Supply - 1 : state.player2Supply;

  // Create move history entry
  const moveEntry: MoveHistoryEntry = {
    player: state.currentPlayer,
    action: 'placeQuadraphage',
    to: position,
  };

  // Create intermediate state
  const intermediateState: GameState = {
    ...state,
    board: newBoard,
    player1Supply: newPlayer1Supply,
    player2Supply: newPlayer2Supply,
    moveHistory: [...state.moveHistory, moveEntry],
  };

  // End the turn
  return endTurn(intermediateState);
}

// End the current turn
export function endTurn(state: GameState): GameState {
  const opponent = getOpponent(state.currentPlayer);

  // Check win condition using the rules engine
  const rulesState = toRulesGameState(state);
  const winner = checkWinCondition(rulesState);

  if (winner) {
    return {
      ...state,
      winner,
      turnPhase: 'gameOver',
      currentPlayer: opponent, // Switch player even though game is over
    };
  }

  // Continue game
  return {
    ...state,
    currentPlayer: opponent,
    turnPhase: 'moveKing',
  };
}

// Reset the game to initial state
export function resetGame(): GameState {
  return createInitialGameState();
}

// Check if a move is valid for the current player's king
export function isValidMove(state: GameState, destination: Position): boolean {
  if (state.turnPhase !== 'moveKing') {
    return false;
  }

  const destIndex = toIndex(destination);
  const rulesState = toRulesGameState(state);

  return isValidKingMove(rulesState, state.currentPlayer, destIndex);
}

// Check if a placement is valid
export function isValidPlacement(state: GameState, position: Position): boolean {
  if (state.turnPhase !== 'placeQuadraphage') {
    return false;
  }

  const posIndex = toIndex(position);
  const rulesState = toRulesGameState(state);

  return isValidQuadraphagePlacement(rulesState, posIndex);
}
