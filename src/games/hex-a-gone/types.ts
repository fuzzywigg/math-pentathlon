// Hex-a-Gone! Game Types
// Pattern block placement game where last player to place wins

export type Player = 'player1' | 'player2';

// Pattern block shapes based on standard pattern blocks
export type BlockShape = 'hexagon' | 'trapezoid' | 'rhombus' | 'triangle' | 'square';

// Block colors matching standard pattern blocks
export const BLOCK_COLORS: Record<BlockShape, string> = {
  hexagon: '#FFD700',      // Yellow
  trapezoid: '#FF4444',    // Red
  rhombus: '#4169E1',      // Blue (wide rhombus)
  triangle: '#32CD32',     // Green
  square: '#FF8C00',       // Orange
};

// How many unit triangles each shape covers
export const BLOCK_SIZES: Record<BlockShape, number> = {
  hexagon: 6,
  trapezoid: 3,
  rhombus: 2,
  triangle: 1,
  square: 2,  // Actually covers 2 triangular units in our hex grid
};

// Starting inventory for each shape in the bank
export const INITIAL_BANK: Record<BlockShape, number> = {
  hexagon: 3,
  trapezoid: 6,
  rhombus: 6,
  triangle: 12,
  square: 6,
};

// A placed block on the board
export interface PlacedBlock {
  shape: BlockShape;
  player: Player;
  // Position in the grid (using axial coordinates for hex grid)
  q: number;  // Column
  r: number;  // Row
  rotation: number;  // 0-5 for 60-degree increments
}

// A cell on the board that can be filled
export interface BoardCell {
  q: number;
  r: number;
  filled: boolean;
  filledBy: Player | null;
  blockId: number | null;  // Which placed block fills this cell
}

// Player's selection during a turn (1-3 different blocks)
export interface TurnSelection {
  blocks: BlockShape[];  // Max 3, must be different shapes
  committed: boolean;    // Once placed, can't select more
}

// Game phases
export type GamePhase = 'selectBlocks' | 'placeBlocks' | 'gameOver';

// Game state
export interface HexAGoneGameState {
  // Board state - hexagonal grid of cells
  board: BoardCell[];
  boardWidth: number;
  boardHeight: number;

  // Placed blocks
  placedBlocks: PlacedBlock[];
  nextBlockId: number;

  // Bank of available blocks
  bank: Record<BlockShape, number>;

  // Current turn
  currentPlayer: Player;
  phase: GamePhase;
  turnSelection: TurnSelection;

  // Selected block for placement preview
  selectedBlockForPlacement: BlockShape | null;

  // Move history
  moveHistory: MoveRecord[];

  // Winner
  winner: Player | null;
}

export interface MoveRecord {
  player: Player;
  blocksPlaced: BlockShape[];
  moveNumber: number;
}

// Create initial hexagonal board layout
// The board is a pattern of hexagonal cells
function createHexBoard(): BoardCell[] {
  const cells: BoardCell[] = [];

  // Create a hex-shaped board with radius 3
  // Using axial coordinates
  const radius = 3;

  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      cells.push({
        q,
        r,
        filled: false,
        filledBy: null,
        blockId: null,
      });
    }
  }

  return cells;
}

// Create initial game state
export function createInitialState(): HexAGoneGameState {
  return {
    board: createHexBoard(),
    boardWidth: 7,  // Diameter of hex board
    boardHeight: 7,
    placedBlocks: [],
    nextBlockId: 1,
    bank: { ...INITIAL_BANK },
    currentPlayer: 'player1',
    phase: 'selectBlocks',
    turnSelection: {
      blocks: [],
      committed: false,
    },
    selectedBlockForPlacement: null,
    moveHistory: [],
    winner: null,
  };
}

// Get opponent
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

// Get cell at position
export function getCellAt(state: HexAGoneGameState, q: number, r: number): BoardCell | undefined {
  return state.board.find(cell => cell.q === q && cell.r === r);
}

// Check if position is valid on board
export function isValidPosition(state: HexAGoneGameState, q: number, r: number): boolean {
  return getCellAt(state, q, r) !== undefined;
}

// Get all shapes available to select (in bank and not already selected)
export function getAvailableShapes(state: HexAGoneGameState): BlockShape[] {
  const shapes: BlockShape[] = ['hexagon', 'trapezoid', 'rhombus', 'triangle', 'square'];
  return shapes.filter(shape =>
    state.bank[shape] > 0 &&
    !state.turnSelection.blocks.includes(shape)
  );
}

// Get the cells that a shape would cover at a given position
export function getShapeCells(shape: BlockShape, q: number, r: number, _rotation: number): { q: number; r: number }[] {
  // Define shape footprints in axial coordinates
  // Each shape is defined relative to its anchor point (0, 0)
  const footprints: Record<BlockShape, { q: number; r: number }[]> = {
    hexagon: [{ q: 0, r: 0 }],  // Single hex cell
    trapezoid: [{ q: 0, r: 0 }],  // Simplified - covers one hex
    rhombus: [{ q: 0, r: 0 }],    // Simplified - covers one hex
    triangle: [{ q: 0, r: 0 }],   // Simplified - covers one hex
    square: [{ q: 0, r: 0 }],     // Simplified - covers one hex
  };

  const baseCells = footprints[shape];

  // Apply rotation (simplified - just return base position for now)
  // In a full implementation, we'd rotate around the anchor
  return baseCells.map(cell => ({
    q: q + cell.q,
    r: r + cell.r,
  }));
}
