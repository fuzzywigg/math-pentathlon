/**
 * Game State Serialization
 *
 * Provides save/load functionality for Kings & Quadraphages game state.
 */

import { GameState, Board, TurnPhase, MoveHistoryEntry } from './game-state';
import { PlayerOwner } from './pieces';

const SAVE_VERSION = 1;
const BOARD_SIZE = 9;

/** Metadata that can be included with a save. */
export interface SaveMetadata {
  gameName?: string;
  player1Name?: string;
  player2Name?: string;
  notes?: string;
}

/** The serialized form of a game state. */
export interface SerializedGameState {
  version: number;
  savedAt: string;
  board: (null | { type: string; owner: string })[][];
  currentPlayer: string;
  turnPhase: string;
  player1Supply: number;
  player2Supply: number;
  selectedKingPosition: { row: number; col: number } | null;
  winner: string | null;
  moveHistory: MoveHistoryEntry[];
  metadata?: SaveMetadata;
}

/** Human-readable summary of a serialized save. */
export interface SaveInfo {
  turnCount: number;
  currentPlayer: string;
  isGameOver: boolean;
  winner: string | null;
  savedAt: Date;
  metadata?: SaveMetadata;
}

/**
 * Serialize a GameState to a plain object ready for JSON storage.
 */
export function serializeGameState(
  state: GameState,
  metadata?: SaveMetadata
): SerializedGameState {
  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    board: state.board.map((row) =>
      row.map((cell) => (cell ? { type: cell.type, owner: cell.owner } : null))
    ),
    currentPlayer: state.currentPlayer,
    turnPhase: state.turnPhase,
    player1Supply: state.player1Supply,
    player2Supply: state.player2Supply,
    selectedKingPosition: state.selectedKingPosition,
    winner: state.winner,
    moveHistory: state.moveHistory.map((entry) => ({ ...entry })),
    ...(metadata !== undefined ? { metadata } : {}),
  };
}

/**
 * Deserialize a plain object back into a GameState.
 * Throws if the version is unsupported or the board dimensions are invalid.
 */
export function deserializeGameState(data: SerializedGameState): GameState {
  if (data.version !== SAVE_VERSION) {
    throw new Error(`Unsupported save version: ${data.version}`);
  }

  if (
    !Array.isArray(data.board) ||
    data.board.length !== BOARD_SIZE ||
    data.board.some((row) => !Array.isArray(row) || row.length !== BOARD_SIZE)
  ) {
    throw new Error(`Invalid board size: expected ${BOARD_SIZE}x${BOARD_SIZE}`);
  }

  const board: Board = data.board.map((row) =>
    row.map((cell) => {
      if (!cell) return null;
      return {
        type: cell.type as 'king' | 'quadraphage',
        owner: cell.owner as PlayerOwner,
      };
    })
  );

  return {
    board,
    currentPlayer: data.currentPlayer as PlayerOwner,
    turnPhase: data.turnPhase as TurnPhase,
    player1Supply: data.player1Supply,
    player2Supply: data.player2Supply,
    selectedKingPosition: data.selectedKingPosition,
    winner: data.winner as PlayerOwner | null,
    moveHistory: data.moveHistory,
  };
}

/**
 * Serialize a GameState to a formatted JSON string.
 */
export function gameStateToJSON(
  state: GameState,
  metadata?: SaveMetadata
): string {
  return JSON.stringify(serializeGameState(state, metadata), null, 2);
}

/**
 * Deserialize a GameState from a JSON string.
 * Throws if the JSON is invalid or the state is invalid.
 */
export function gameStateFromJSON(json: string): GameState {
  const data = JSON.parse(json) as SerializedGameState;
  return deserializeGameState(data);
}

const VALID_TURN_PHASES: TurnPhase[] = ['moveKing', 'placeQuadraphage', 'gameOver'];
const VALID_PLAYERS: PlayerOwner[] = ['player1', 'player2'];

/**
 * Validate that an unknown value is a well-formed SerializedGameState.
 * Returns true if valid, false otherwise.
 */
export function validateSerializedState(data: unknown): boolean {
  if (data === null || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  if (typeof obj['version'] !== 'number') return false;
  if (!VALID_PLAYERS.includes(obj['currentPlayer'] as PlayerOwner)) return false;
  if (!VALID_TURN_PHASES.includes(obj['turnPhase'] as TurnPhase)) return false;

  if (
    !Array.isArray(obj['board']) ||
    (obj['board'] as unknown[]).length !== BOARD_SIZE ||
    (obj['board'] as unknown[][]).some(
      (row) => !Array.isArray(row) || row.length !== BOARD_SIZE
    )
  ) {
    return false;
  }

  return true;
}

/**
 * Generate a filename for a save file.
 * Format: `<prefix>-YYYY-MM-DD-HHMM.json`
 */
export function generateSaveFileName(prefix = 'kings-quadraphages'): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${prefix}-${yyyy}-${mm}-${dd}-${hh}${min}.json`;
}

/**
 * Build a human-readable summary of a serialized save.
 */
export function getSaveInfo(data: SerializedGameState): SaveInfo {
  const moveCount = data.moveHistory.length;
  // Each full turn = king move + quadraphage placement; count distinct turns
  const turnCount = moveCount;

  const playerLabel =
    data.currentPlayer === 'player1' ? 'Player 1' : 'Player 2';

  return {
    turnCount,
    currentPlayer: playerLabel,
    isGameOver: data.turnPhase === 'gameOver',
    winner: data.winner,
    savedAt: new Date(data.savedAt),
    ...(data.metadata !== undefined ? { metadata: data.metadata } : {}),
  };
}
