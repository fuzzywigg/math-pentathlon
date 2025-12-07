// Polyomino Placement - Validation and Board Management
// Handles placement rules, collision detection, and board state

import { Cell, PolyominoShape, PlacedPolyomino, PlacementResult, Rotation } from './types';
import { getCellsAtPosition, getTransformedCells } from './transform';

/** Board representation for placement validation */
export interface Board {
  rows: number;
  cols: number;
  cells: boolean[][]; // true = occupied
  placements: PlacedPolyomino[];
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
 * Place a polyomino on the board
 */
export function placePolyomino(
  board: Board,
  shape: PolyominoShape,
  position: Cell,
  rotation: Rotation = 0,
  flipped: boolean = false,
  playerId?: number
): Board {
  const validation = validatePlacement(board, shape, position, rotation, flipped);

  if (!validation.valid) {
    throw new Error(validation.reason || 'Invalid placement');
  }

  // Create new board state
  const newCells = board.cells.map(row => [...row]);

  for (const cell of validation.cells) {
    newCells[cell.row][cell.col] = true;
  }

  const placement: PlacedPolyomino = {
    shapeId: shape.id,
    position,
    rotation,
    flipped,
    playerId,
  };

  return {
    ...board,
    cells: newCells,
    placements: [...board.placements, placement],
  };
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
 * Get the cells occupied by a specific placement
 */
export function getPlacementCells(placement: PlacedPolyomino, shapes: PolyominoShape[]): Cell[] {
  const shape = shapes.find(s => s.id === placement.shapeId);
  if (!shape) return [];
  return getCellsAtPosition(shape, placement.position, placement.rotation, placement.flipped);
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
