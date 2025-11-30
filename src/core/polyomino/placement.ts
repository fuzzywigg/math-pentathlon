/**
 * Polyomino Placement
 * Grid placement, collision detection, and validation
 */

import type { Cell, Polyomino, PolyominoPlacement } from './types';
import {
  getAbsoluteCells,
  areCellsInBounds,
  transformCells,
  getBounds,
} from './transformations';

// Grid cell state
export type GridCell<T = unknown> = {
  occupied: boolean;
  polyominoId?: string;
  value?: T;
};

// Grid representation
export interface PolyominoGrid<T = unknown> {
  rows: number;
  cols: number;
  cells: GridCell<T>[][];
}

/**
 * Create an empty grid
 */
export function createGrid<T = unknown>(rows: number, cols: number): PolyominoGrid<T> {
  const cells: GridCell<T>[][] = [];
  for (let r = 0; r < rows; r++) {
    cells[r] = [];
    for (let c = 0; c < cols; c++) {
      cells[r][c] = { occupied: false };
    }
  }
  return { rows, cols, cells };
}

/**
 * Check if a cell is occupied on the grid
 */
export function isCellOccupied<T>(grid: PolyominoGrid<T>, row: number, col: number): boolean {
  if (row < 0 || row >= grid.rows || col < 0 || col >= grid.cols) {
    return true; // Out of bounds = occupied
  }
  return grid.cells[row][col].occupied;
}

/**
 * Check if a placement is valid (all cells in bounds and unoccupied)
 */
export function isValidPlacement<T>(
  grid: PolyominoGrid<T>,
  polyomino: Polyomino,
  position: Cell,
  rotation: 0 | 90 | 180 | 270 = 0,
  flipped: boolean = false
): boolean {
  const absoluteCells = getAbsoluteCells(polyomino, position, rotation, flipped);

  // Check bounds
  if (!areCellsInBounds(absoluteCells, grid.rows, grid.cols)) {
    return false;
  }

  // Check collisions
  for (const cell of absoluteCells) {
    if (isCellOccupied(grid, cell.row, cell.col)) {
      return false;
    }
  }

  return true;
}

/**
 * Place a polyomino on the grid
 */
export function placePolyomino<T>(
  grid: PolyominoGrid<T>,
  polyomino: Polyomino,
  position: Cell,
  rotation: 0 | 90 | 180 | 270 = 0,
  flipped: boolean = false,
  value?: T
): PolyominoGrid<T> {
  const absoluteCells = getAbsoluteCells(polyomino, position, rotation, flipped);

  // Create a new grid (immutable update)
  const newCells = grid.cells.map((row) => row.map((cell) => ({ ...cell })));

  for (const cell of absoluteCells) {
    newCells[cell.row][cell.col] = {
      occupied: true,
      polyominoId: polyomino.id,
      value,
    };
  }

  return { ...grid, cells: newCells };
}

/**
 * Remove a polyomino from the grid by its ID
 */
export function removePolyomino<T>(grid: PolyominoGrid<T>, polyominoId: string): PolyominoGrid<T> {
  const newCells = grid.cells.map((row) =>
    row.map((cell) =>
      cell.polyominoId === polyominoId ? { occupied: false } : { ...cell }
    )
  );

  return { ...grid, cells: newCells };
}

/**
 * Get all valid positions for placing a polyomino on the grid
 */
export function getAllValidPositions<T>(
  grid: PolyominoGrid<T>,
  polyomino: Polyomino,
  rotation: 0 | 90 | 180 | 270 = 0,
  flipped: boolean = false
): Cell[] {
  const validPositions: Cell[] = [];
  const transformedCells = transformCells(polyomino.cells, rotation, flipped);
  const bounds = getBounds(transformedCells);

  // Only check positions where the polyomino could fit
  for (let row = 0; row <= grid.rows - bounds.height; row++) {
    for (let col = 0; col <= grid.cols - bounds.width; col++) {
      const position = { row, col };
      if (isValidPlacement(grid, polyomino, position, rotation, flipped)) {
        validPositions.push(position);
      }
    }
  }

  return validPositions;
}

/**
 * Get all valid placements for a polyomino (including all rotations and flips)
 */
export function getAllValidPlacements<T>(
  grid: PolyominoGrid<T>,
  polyomino: Polyomino
): PolyominoPlacement[] {
  const placements: PolyominoPlacement[] = [];
  const rotations: (0 | 90 | 180 | 270)[] = [0, 90, 180, 270];
  const flips = [false, true];

  for (const flipped of flips) {
    for (const rotation of rotations) {
      const positions = getAllValidPositions(grid, polyomino, rotation, flipped);
      for (const position of positions) {
        placements.push({
          polyomino,
          position,
          rotation,
          flipped,
        });
      }
    }
  }

  return placements;
}

/**
 * Check if a set of polyominoes can tile a region perfectly
 * (covers all cells exactly once)
 */
export function checkPerfectCoverage<T>(
  grid: PolyominoGrid<T>,
  placements: PolyominoPlacement[]
): boolean {
  // Create a temporary grid to track coverage
  const coverage: boolean[][] = [];
  for (let r = 0; r < grid.rows; r++) {
    coverage[r] = [];
    for (let c = 0; c < grid.cols; c++) {
      coverage[r][c] = false;
    }
  }

  // Mark all cells covered by placements
  let totalCells = 0;
  for (const placement of placements) {
    const cells = getAbsoluteCells(
      placement.polyomino,
      placement.position,
      placement.rotation,
      placement.flipped
    );

    for (const cell of cells) {
      // Check bounds
      if (cell.row < 0 || cell.row >= grid.rows || cell.col < 0 || cell.col >= grid.cols) {
        return false; // Out of bounds
      }

      // Check overlap
      if (coverage[cell.row][cell.col]) {
        return false; // Overlap detected
      }

      coverage[cell.row][cell.col] = true;
      totalCells++;
    }
  }

  // Check if all unoccupied cells are covered
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      if (!grid.cells[r][c].occupied && !coverage[r][c]) {
        return false; // Uncovered cell
      }
    }
  }

  return true;
}

/**
 * Get the cells that would be occupied by a placement
 */
export function getPlacementCells(placement: PolyominoPlacement): Cell[] {
  return getAbsoluteCells(
    placement.polyomino,
    placement.position,
    placement.rotation,
    placement.flipped
  );
}

/**
 * Check if two placements overlap
 */
export function doPlacementsOverlap(p1: PolyominoPlacement, p2: PolyominoPlacement): boolean {
  const cells1 = getPlacementCells(p1);
  const cells2 = getPlacementCells(p2);

  const set1 = new Set(cells1.map((c) => `${c.row},${c.col}`));

  for (const cell of cells2) {
    if (set1.has(`${cell.row},${cell.col}`)) {
      return true;
    }
  }

  return false;
}

/**
 * Find cells adjacent to a polyomino placement
 */
export function getAdjacentCells(
  grid: PolyominoGrid,
  placement: PolyominoPlacement,
  diagonal: boolean = false
): Cell[] {
  const placementCells = getPlacementCells(placement);
  const placementSet = new Set(placementCells.map((c) => `${c.row},${c.col}`));
  const adjacentSet = new Set<string>();

  const directions = diagonal
    ? [
        { row: -1, col: -1 },
        { row: -1, col: 0 },
        { row: -1, col: 1 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ]
    : [
        { row: -1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
      ];

  for (const cell of placementCells) {
    for (const dir of directions) {
      const adjacent = { row: cell.row + dir.row, col: cell.col + dir.col };
      const key = `${adjacent.row},${adjacent.col}`;

      // Check bounds and not part of the polyomino itself
      if (
        adjacent.row >= 0 &&
        adjacent.row < grid.rows &&
        adjacent.col >= 0 &&
        adjacent.col < grid.cols &&
        !placementSet.has(key)
      ) {
        adjacentSet.add(key);
      }
    }
  }

  return Array.from(adjacentSet).map((key) => {
    const [row, col] = key.split(',').map(Number);
    return { row, col };
  });
}

/**
 * Calculate the center position of a placed polyomino
 */
export function getPlacementCenter(placement: PolyominoPlacement): { row: number; col: number } {
  const cells = getPlacementCells(placement);
  const avgRow = cells.reduce((sum, c) => sum + c.row, 0) / cells.length;
  const avgCol = cells.reduce((sum, c) => sum + c.col, 0) / cells.length;
  return { row: avgRow, col: avgCol };
}

/**
 * Snap a position to the nearest valid placement
 */
export function snapToNearestValid<T>(
  grid: PolyominoGrid<T>,
  polyomino: Polyomino,
  targetPosition: Cell,
  rotation: 0 | 90 | 180 | 270 = 0,
  flipped: boolean = false,
  maxDistance: number = 3
): Cell | null {
  // Check if target is already valid
  if (isValidPlacement(grid, polyomino, targetPosition, rotation, flipped)) {
    return targetPosition;
  }

  // Search in expanding squares
  for (let dist = 1; dist <= maxDistance; dist++) {
    for (let dr = -dist; dr <= dist; dr++) {
      for (let dc = -dist; dc <= dist; dc++) {
        if (Math.abs(dr) !== dist && Math.abs(dc) !== dist) continue; // Only check perimeter

        const candidate = { row: targetPosition.row + dr, col: targetPosition.col + dc };
        if (isValidPlacement(grid, polyomino, candidate, rotation, flipped)) {
          return candidate;
        }
      }
    }
  }

  return null;
}
