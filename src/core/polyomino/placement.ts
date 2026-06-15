// Polyomino Placement - Validation and Board Management
// Handles placement rules, collision detection, and board state

import { Cell, PolyominoShape, PlacedPolyomino, PlacementResult, Rotation } from './types';
import { getCellsAtPosition, getTransformedCells, transformCells, translateCells } from './transform';

// =============================================================================
// Legacy Board API (kept for backward compatibility with juggle and other games)
// =============================================================================

/** Board representation for placement validation */
export interface Board {
  rows: number;
  cols: number;
  cells: boolean[][]; // true = occupied
  placements: PlacedPolyomino[];
}

// =============================================================================
// New Grid API
// =============================================================================

/** A cell in the new Grid */
export interface GridCell {
  occupied: boolean;
  polyominoId?: string;
}

/** A placement record for the new Grid API */
export interface Placement {
  polyomino: PolyominoShape;
  position: Cell;
  rotation: Rotation;
  flipped: boolean;
}

/** New grid representation */
export interface Grid {
  kind: 'grid';
  rows: number;
  cols: number;
  cells: GridCell[][];
  placements: Placement[];
}

/**
 * Create an empty Grid
 */
export function createGrid(rows: number, cols: number): Grid {
  const cells: GridCell[][] = [];
  for (let r = 0; r < rows; r++) {
    cells.push(new Array(cols).fill(null).map(() => ({ occupied: false })));
  }
  return { kind: 'grid', rows, cols, cells, placements: [] };
}

/**
 * Check if a grid cell is occupied (out-of-bounds counts as occupied)
 */
export function isCellOccupied(grid: Grid, row: number, col: number): boolean {
  if (row < 0 || row >= grid.rows || col < 0 || col >= grid.cols) return true;
  return grid.cells[row][col].occupied;
}

/**
 * Check if a placement is valid on a Grid
 */
export function isValidPlacement(grid: Grid, polyomino: PolyominoShape, position: Cell): boolean {
  const cells = translateCells(transformCells(polyomino.cells, 0, false), position);
  for (const c of cells) {
    if (isCellOccupied(grid, c.row, c.col)) return false;
  }
  return true;
}

/**
 * Place a polyomino on a Grid (immutable) or on a Board (legacy, mutable-style)
 */
export function placePolyomino(grid: Grid, shape: PolyominoShape, position: Cell): Grid;
export function placePolyomino(
  board: Board,
  shape: PolyominoShape,
  position: Cell,
  rotation?: Rotation,
  flipped?: boolean,
  playerId?: number
): Board;
export function placePolyomino(
  boardOrGrid: Board | Grid,
  shape: PolyominoShape,
  position: Cell,
  rotation: Rotation = 0,
  flipped: boolean = false,
  playerId?: number
): Board | Grid {
  if ('kind' in boardOrGrid && boardOrGrid.kind === 'grid') {
    // New Grid API
    const grid = boardOrGrid as Grid;
    const shapeCells = translateCells(transformCells(shape.cells, 0, false), position);
    // Deep-copy cells
    const newCells: GridCell[][] = grid.cells.map(row => row.map(cell => ({ ...cell })));
    for (const c of shapeCells) {
      newCells[c.row][c.col] = { occupied: true, polyominoId: shape.id };
    }
    const placement: Placement = { polyomino: shape, position, rotation: 0, flipped: false };
    return { ...grid, cells: newCells, placements: [...grid.placements, placement] };
  }

  // Legacy Board API
  const board = boardOrGrid as Board;
  const validation = validatePlacement(board, shape, position, rotation, flipped);
  if (!validation.valid) {
    throw new Error(validation.reason || 'Invalid placement');
  }
  const newCells = board.cells.map(row => [...row]);
  for (const cell of validation.cells) {
    newCells[cell.row][cell.col] = true;
  }
  const placement: PlacedPolyomino = { shapeId: shape.id, position, rotation, flipped, playerId };
  return { ...board, cells: newCells, placements: [...board.placements, placement] };
}

/**
 * Remove a polyomino by ID from a Grid
 */
export function removePolyomino(grid: Grid, polyominoId: string): Grid {
  const newCells: GridCell[][] = grid.cells.map(row => row.map(cell => ({ ...cell })));
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      if (newCells[r][c].polyominoId === polyominoId) {
        newCells[r][c] = { occupied: false };
      }
    }
  }
  const newPlacements = grid.placements.filter(p => p.polyomino.id !== polyominoId);
  return { ...grid, cells: newCells, placements: newPlacements };
}

/**
 * Get all valid positions for a polyomino on a Grid with given rotation/flip
 */
export function getAllValidPositions(
  grid: Grid,
  polyomino: PolyominoShape,
  rotation: Rotation,
  flipped: boolean
): Cell[] {
  const transformed = transformCells(polyomino.cells, rotation, flipped);
  const minRow = Math.min(...transformed.map(c => c.row));
  const maxRow = Math.max(...transformed.map(c => c.row));
  const minCol = Math.min(...transformed.map(c => c.col));
  const maxCol = Math.max(...transformed.map(c => c.col));

  const valid: Cell[] = [];
  for (let row = -minRow; row <= grid.rows - 1 - maxRow; row++) {
    for (let col = -minCol; col <= grid.cols - 1 - maxCol; col++) {
      const pos = { row, col };
      const cells = translateCells(transformed, pos);
      if (cells.every(c => !isCellOccupied(grid, c.row, c.col))) {
        valid.push(pos);
      }
    }
  }
  return valid;
}

/**
 * Get cells for a Placement (new API) or legacy PlacedPolyomino+shapes
 */
export function getPlacementCells(placement: Placement): Cell[];
export function getPlacementCells(placement: PlacedPolyomino, shapes: PolyominoShape[]): Cell[];
export function getPlacementCells(
  placement: Placement | PlacedPolyomino,
  shapes?: PolyominoShape[]
): Cell[] {
  if ('polyomino' in placement) {
    // New Placement API
    return translateCells(
      transformCells(placement.polyomino.cells, placement.rotation, placement.flipped),
      placement.position
    );
  }
  // Legacy PlacedPolyomino API
  const shape = shapes?.find(s => s.id === placement.shapeId);
  if (!shape) return [];
  return getCellsAtPosition(shape, placement.position, placement.rotation, placement.flipped);
}

/**
 * Check if two Placements overlap
 */
export function doPlacementsOverlap(p1: Placement, p2: Placement): boolean {
  const cells1 = getPlacementCells(p1);
  const keys1 = new Set(cells1.map(c => `${c.row},${c.col}`));
  const cells2 = getPlacementCells(p2);
  return cells2.some(c => keys1.has(`${c.row},${c.col}`));
}

/**
 * Get cells adjacent to all cells in a placement (4 or 8 connected, excluding placement cells)
 */
export function getAdjacentCells(grid: Grid, placement: Placement, diagonal: boolean): Cell[] {
  const occupiedCells = getPlacementCells(placement);
  const occupied = new Set(occupiedCells.map(c => `${c.row},${c.col}`));

  const directions = diagonal
    ? [
        { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
        { row: 0, col: -1 },                        { row: 0, col: 1 },
        { row: 1, col: -1 },  { row: 1, col: 0 },  { row: 1, col: 1 },
      ]
    : [
        { row: -1, col: 0 }, { row: 1, col: 0 },
        { row: 0, col: -1 }, { row: 0, col: 1 },
      ];

  const seen = new Set<string>();
  const adjacent: Cell[] = [];

  for (const cell of occupiedCells) {
    for (const dir of directions) {
      const neighbor = { row: cell.row + dir.row, col: cell.col + dir.col };
      const key = `${neighbor.row},${neighbor.col}`;
      if (!occupied.has(key) && !seen.has(key) &&
          neighbor.row >= 0 && neighbor.row < grid.rows &&
          neighbor.col >= 0 && neighbor.col < grid.cols) {
        seen.add(key);
        adjacent.push(neighbor);
      }
    }
  }

  return adjacent;
}

/**
 * Create an empty board
 */
export function createBoard(rows: number, cols: number): Board {
  const cells: boolean[][] = [];
  for (let r = 0; r < rows; r++) {
    cells.push(new Array(cols).fill(false));
  }
  return { rows, cols, cells, placements: [] };
}

/**
 * Check if a cell is within board bounds
 */
export function isInBounds(board: Board, cell: Cell): boolean {
  return cell.row >= 0 && cell.row < board.rows && cell.col >= 0 && cell.col < board.cols;
}

/**
 * Check if a cell is occupied
 */
export function isOccupied(board: Board, cell: Cell): boolean {
  if (!isInBounds(board, cell)) return true; // Out of bounds counts as occupied
  return board.cells[cell.row][cell.col];
}

/**
 * Validate placement of a polyomino at a position
 */
export function validatePlacement(
  board: Board,
  shape: PolyominoShape,
  position: Cell,
  rotation: Rotation = 0,
  flipped: boolean = false
): PlacementResult {
  const cells = getCellsAtPosition(shape, position, rotation, flipped);

  // Check all cells are in bounds and unoccupied
  for (const cell of cells) {
    if (!isInBounds(board, cell)) {
      return {
        valid: false,
        cells,
        reason: 'Shape extends beyond board boundaries',
      };
    }
    if (isOccupied(board, cell)) {
      return {
        valid: false,
        cells,
        reason: 'Space is already occupied',
      };
    }
  }

  return { valid: true, cells };
}

/**
 * Remove the last placed polyomino (undo)
 */
export function removeLastPolyomino(board: Board, shapes: PolyominoShape[]): Board {
  if (board.placements.length === 0) return board;

  const placements = [...board.placements];
  const removed = placements.pop()!;

  const shape = shapes.find(s => s.id === removed.shapeId);
  if (!shape) return board;

  const cells = getCellsAtPosition(shape, removed.position, removed.rotation, removed.flipped);
  const newCells = board.cells.map(row => [...row]);

  for (const cell of cells) {
    if (isInBounds(board, cell)) {
      newCells[cell.row][cell.col] = false;
    }
  }

  return {
    ...board,
    cells: newCells,
    placements,
  };
}

/**
 * Find all valid placement positions for a shape
 */
export function findValidPlacements(
  board: Board,
  shape: PolyominoShape,
  rotation: Rotation = 0,
  flipped: boolean = false
): Cell[] {
  const validPositions: Cell[] = [];
  const transformed = getTransformedCells(shape, rotation, flipped);

  // Get bounding box to optimize search
  const minRow = Math.min(...transformed.map(c => c.row));
  const maxRow = Math.max(...transformed.map(c => c.row));
  const minCol = Math.min(...transformed.map(c => c.col));
  const maxCol = Math.max(...transformed.map(c => c.col));

  // Check all possible anchor positions
  for (let row = -minRow; row < board.rows - maxRow; row++) {
    for (let col = -minCol; col < board.cols - maxCol; col++) {
      const position = { row, col };
      const result = validatePlacement(board, shape, position, rotation, flipped);
      if (result.valid) {
        validPositions.push(position);
      }
    }
  }

  return validPositions;
}

/**
 * Check if any valid placement exists for a shape (any orientation)
 */
export function canPlaceShape(board: Board, shape: PolyominoShape): boolean {
  const rotations: Rotation[] = shape.canRotate ? [0, 90, 180, 270] : [0];
  const flips = shape.canFlip ? [false, true] : [false];

  for (const rotation of rotations) {
    for (const flipped of flips) {
      const positions = findValidPlacements(board, shape, rotation, flipped);
      if (positions.length > 0) return true;
    }
  }

  return false;
}

/**
 * Count empty cells on the board
 */
export function countEmptyCells(board: Board): number {
  let count = 0;
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (!board.cells[r][c]) count++;
    }
  }
  return count;
}

/**
 * Get all empty cells on the board
 */
export function getEmptyCells(board: Board): Cell[] {
  const empty: Cell[] = [];
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (!board.cells[r][c]) {
        empty.push({ row: r, col: c });
      }
    }
  }
  return empty;
}

/**
 * Check if board is completely filled
 */
export function isBoardFilled(board: Board): boolean {
  return countEmptyCells(board) === 0;
}

/**
 * Find which placement (if any) occupies a cell
 */
export function findPlacementAtCell(
  board: Board,
  cell: Cell,
  shapes: PolyominoShape[]
): PlacedPolyomino | undefined {
  for (const placement of board.placements) {
    const cells = getPlacementCells(placement, shapes);
    if (cells.some(c => c.row === cell.row && c.col === cell.col)) {
      return placement;
    }
  }
  return undefined;
}

/**
 * Create a board with specific cells blocked (for irregular board shapes)
 */
export function createBoardWithBlockedCells(
  rows: number,
  cols: number,
  blockedCells: Cell[]
): Board {
  const board = createBoard(rows, cols);

  for (const cell of blockedCells) {
    if (isInBounds(board, cell)) {
      board.cells[cell.row][cell.col] = true;
    }
  }

  return board;
}

/**
 * Create a hexagonal board shape (for Hex-a-Gone!)
 */
export function createHexagonalBoard(radius: number): Board {
  const size = radius * 2 + 1;
  const blocked: Cell[] = [];

  // Block corners to create hexagonal shape
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Calculate distance from center using hex coordinates
      const dr = r - radius;
      const dc = c - radius;

      // For pointy-top hex, check if outside hexagon
      if (Math.abs(dr) + Math.abs(dc) + Math.abs(-dr - dc) > radius * 2) {
        blocked.push({ row: r, col: c });
      }
    }
  }

  return createBoardWithBlockedCells(size, size, blocked);
}

/**
 * Solve placement puzzle - find if shapes can fill a board exactly
 * Uses backtracking algorithm
 */
export function solvePlacement(
  initialBoard: Board,
  shapes: PolyominoShape[],
  maxSolutions: number = 1
): PlacedPolyomino[][] {
  const solutions: PlacedPolyomino[][] = [];

  function solve(currentBoard: Board, remainingShapes: PolyominoShape[]): boolean {
    // Check if we have enough solutions
    if (solutions.length >= maxSolutions) return true;

    // Check if board is filled
    if (isBoardFilled(currentBoard)) {
      solutions.push([...currentBoard.placements]);
      return solutions.length >= maxSolutions;
    }

    // No more shapes to place
    if (remainingShapes.length === 0) return false;

    // Find first empty cell
    const empty = getEmptyCells(currentBoard);
    if (empty.length === 0) return false;

    const targetCell = empty[0];

    // Try each remaining shape
    for (let i = 0; i < remainingShapes.length; i++) {
      const shape = remainingShapes[i];
      const rotations: Rotation[] = shape.canRotate ? [0, 90, 180, 270] : [0];
      const flips = shape.canFlip ? [false, true] : [false];

      for (const rotation of rotations) {
        for (const flipped of flips) {
          // Find placements that cover the target cell
          const positions = findValidPlacements(currentBoard, shape, rotation, flipped);

          for (const position of positions) {
            const cells = getCellsAtPosition(shape, position, rotation, flipped);

            // Only consider placements that cover the first empty cell
            if (!cells.some(c => c.row === targetCell.row && c.col === targetCell.col)) {
              continue;
            }

            try {
              const newBoard = placePolyomino(currentBoard, shape, position, rotation, flipped);
              const newRemaining = [...remainingShapes.slice(0, i), ...remainingShapes.slice(i + 1)];

              if (solve(newBoard, newRemaining)) {
                return true;
              }
            } catch {
              // Invalid placement, continue
            }
          }
        }
      }
    }

    return false;
  }

  solve(initialBoard, shapes);
  return solutions;
}
