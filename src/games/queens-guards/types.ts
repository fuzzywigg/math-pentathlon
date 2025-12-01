// Queens & Guards Game Types
// Hexagonal strategy game based on Agon - get your Queen to the center surrounded by Guards

export type Player = 'player1' | 'player2';

export type PieceType = 'queen' | 'guard';

// A piece on the board
export interface Piece {
  id: string;
  player: Player;
  type: PieceType;
}

// Hex cell using ring-based coordinates
// Ring 0 = center (throne), Ring 1 = inner ring (6 cells), etc.
export interface HexCell {
  ring: number;      // 0 = center, 1-5 = outer rings
  position: number;  // Position within ring (0 to 6*ring - 1, or 0 for center)
  piece: Piece | null;
}

// Coordinate for board position
export interface BoardCoord {
  ring: number;
  position: number;
}

// Game state
export interface QueensGuardsState {
  cells: Map<string, HexCell>;
  currentPlayer: Player;
  selectedPiece: string | null;  // Cell key of selected piece
  capturedPieces: BoardCoord[];  // Pieces that must be moved to outer ring
  winner: Player | null;
  moveHistory: QGMove[];
}

// A move in the game
export interface QGMove {
  player: Player;
  from: BoardCoord;
  to: BoardCoord;
  pieceType: PieceType;
  wasCapture: boolean;
  moveNumber: number;
}

// Configuration
export const CONFIG = {
  NUM_RINGS: 6,       // 0 (center) + 5 outer rings
  GUARDS_PER_PLAYER: 6,
  HEX_SIZE: 32,       // Visual hex size
};

// =============================================================================
// Coordinate Utilities
// =============================================================================

/**
 * Create a cell key from coordinates
 */
export function cellKey(ring: number, position: number): string {
  return `${ring}-${position}`;
}

/**
 * Parse a cell key to coordinates
 */
export function parseKey(key: string): BoardCoord {
  const [ring, position] = key.split('-').map(Number);
  return { ring, position };
}

/**
 * Get the number of cells in a ring
 */
export function cellsInRing(ring: number): number {
  return ring === 0 ? 1 : 6 * ring;
}

/**
 * Normalize position within a ring (handle wrap-around)
 */
export function normalizePosition(ring: number, position: number): number {
  if (ring === 0) return 0;
  const count = cellsInRing(ring);
  return ((position % count) + count) % count;
}

/**
 * Get all adjacent cell coordinates
 */
export function getAdjacent(coord: BoardCoord): BoardCoord[] {
  const { ring, position } = coord;
  const adjacent: BoardCoord[] = [];

  if (ring === 0) {
    // Center: adjacent to all cells in ring 1
    for (let i = 0; i < 6; i++) {
      adjacent.push({ ring: 1, position: i });
    }
  } else {
    const count = cellsInRing(ring);

    // Same ring neighbors (left and right)
    adjacent.push({ ring, position: normalizePosition(ring, position - 1) });
    adjacent.push({ ring, position: normalizePosition(ring, position + 1) });

    // Inner ring neighbors (moving toward center)
    if (ring > 1) {
      // Calculate which cells in inner ring are adjacent
      // Each ring has 6*ring cells, inner ring has 6*(ring-1) cells
      const innerCount = cellsInRing(ring - 1);
      // Approximate inner position
      const innerPos = Math.floor((position / count) * innerCount);
      adjacent.push({ ring: ring - 1, position: normalizePosition(ring - 1, innerPos) });
      // Sometimes two inner cells are adjacent
      const nextInnerPos = (innerPos + 1) % innerCount;
      if (!adjacent.some((a) => a.ring === ring - 1 && a.position === nextInnerPos)) {
        // Check if actually adjacent based on geometry
        const ratio = position / count;
        const innerRatio2 = nextInnerPos / innerCount;
        if (Math.abs(ratio - innerRatio2) < 1 / ring || ratio > innerRatio2) {
          adjacent.push({ ring: ring - 1, position: nextInnerPos });
        }
      }
    } else if (ring === 1) {
      // Ring 1 is adjacent to center
      adjacent.push({ ring: 0, position: 0 });
    }

    // Outer ring neighbors (moving away from center)
    if (ring < CONFIG.NUM_RINGS - 1) {
      const outerCount = cellsInRing(ring + 1);
      // Each cell connects to ~2 outer cells
      const outerPos1 = Math.floor((position / count) * outerCount);
      const outerPos2 = Math.ceil(((position + 0.5) / count) * outerCount);
      adjacent.push({ ring: ring + 1, position: normalizePosition(ring + 1, outerPos1) });
      if (outerPos2 !== outerPos1) {
        adjacent.push({ ring: ring + 1, position: normalizePosition(ring + 1, outerPos2) });
      }
    }
  }

  return adjacent;
}

/**
 * Check if a move is inward (toward center) or sideways (same ring)
 * Returns false if move is outward (invalid in normal play)
 */
export function isMoveValid(from: BoardCoord, to: BoardCoord): boolean {
  // Sideways in same ring: always valid
  if (from.ring === to.ring) return true;

  // Moving inward (toward center): valid
  if (to.ring < from.ring) return true;

  // Moving outward: only valid for captured pieces being restored
  return false;
}

// =============================================================================
// Board Creation
// =============================================================================

/**
 * Create the hexagonal board with initial piece placement
 */
export function createBoard(): Map<string, HexCell> {
  const cells = new Map<string, HexCell>();

  // Create all cells
  for (let ring = 0; ring < CONFIG.NUM_RINGS; ring++) {
    const count = cellsInRing(ring);
    for (let pos = 0; pos < count; pos++) {
      cells.set(cellKey(ring, pos), {
        ring,
        position: pos,
        piece: null,
      });
    }
  }

  // Place pieces on outer ring (ring 5)
  // Player 1 (Blue) on one half, Player 2 (Red) on the other
  const outerRing = CONFIG.NUM_RINGS - 1;
  const outerCount = cellsInRing(outerRing);

  // Player 1: positions 0-14 (queen at 7)
  for (let i = 0; i <= 14; i++) {
    const cell = cells.get(cellKey(outerRing, i))!;
    if (i === 7) {
      cell.piece = { id: 'p1-queen', player: 'player1', type: 'queen' };
    } else if (i % 2 === 1 && i !== 7) {
      cell.piece = { id: `p1-guard-${i}`, player: 'player1', type: 'guard' };
    }
  }

  // Player 2: positions 15-29 (queen at 22)
  for (let i = 15; i < outerCount; i++) {
    const cell = cells.get(cellKey(outerRing, i))!;
    if (i === 22) {
      cell.piece = { id: 'p2-queen', player: 'player2', type: 'queen' };
    } else if (i % 2 === 0 && i !== 22) {
      cell.piece = { id: `p2-guard-${i}`, player: 'player2', type: 'guard' };
    }
  }

  return cells;
}

/**
 * Create initial game state
 */
export function createInitialState(): QueensGuardsState {
  return {
    cells: createBoard(),
    currentPlayer: 'player1',
    selectedPiece: null,
    capturedPieces: [],
    winner: null,
    moveHistory: [],
  };
}

/**
 * Get opponent
 */
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}
