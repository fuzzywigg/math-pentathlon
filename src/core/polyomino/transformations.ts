/**
 * Polyomino Transformations
 * Rotation, reflection, and normalization operations
 */

import type { Cell, Polyomino, PolyominoBounds, TransformedPolyomino } from './types';

/**
 * Get the bounding box of a set of cells
 */
export function getBounds(cells: Cell[]): PolyominoBounds {
  if (cells.length === 0) {
    return { minRow: 0, maxRow: 0, minCol: 0, maxCol: 0, width: 0, height: 0 };
  }

  const rows = cells.map((c) => c.row);
  const cols = cells.map((c) => c.col);
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);

  return {
    minRow,
    maxRow,
    minCol,
    maxCol,
    width: maxCol - minCol + 1,
    height: maxRow - minRow + 1,
  };
}

/**
 * Normalize cells so that minimum row and column are 0
 */
export function normalizeCells(cells: Cell[]): Cell[] {
  const bounds = getBounds(cells);
  return cells.map((c) => ({
    row: c.row - bounds.minRow,
    col: c.col - bounds.minCol,
  }));
}

/**
 * Sort cells in a canonical order (top-to-bottom, left-to-right)
 */
export function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
}

/**
 * Canonicalize cells (normalize and sort)
 */
export function canonicalizeCells(cells: Cell[]): Cell[] {
  return sortCells(normalizeCells(cells));
}

/**
 * Rotate cells 90 degrees clockwise around origin
 */
export function rotateCells90CW(cells: Cell[]): Cell[] {
  // (row, col) -> (col, -row)
  return cells.map((c) => ({
    row: c.col,
    col: -c.row,
  }));
}

/**
 * Rotate cells 90 degrees counter-clockwise around origin
 */
export function rotateCells90CCW(cells: Cell[]): Cell[] {
  // (row, col) -> (-col, row)
  return cells.map((c) => ({
    row: -c.col,
    col: c.row,
  }));
}

/**
 * Rotate cells 180 degrees around origin
 */
export function rotateCells180(cells: Cell[]): Cell[] {
  // (row, col) -> (-row, -col)
  return cells.map((c) => ({
    row: -c.row,
    col: -c.col,
  }));
}

/**
 * Rotate cells by specified degrees (must be 0, 90, 180, or 270)
 */
export function rotateCells(cells: Cell[], degrees: 0 | 90 | 180 | 270): Cell[] {
  switch (degrees) {
    case 0:
      return cells;
    case 90:
      return rotateCells90CW(cells);
    case 180:
      return rotateCells180(cells);
    case 270:
      return rotateCells90CCW(cells);
    default:
      throw new Error(`Invalid rotation: ${degrees}. Must be 0, 90, 180, or 270.`);
  }
}

/**
 * Flip cells horizontally (reflect across vertical axis)
 */
export function flipCellsHorizontal(cells: Cell[]): Cell[] {
  return cells.map((c) => ({
    row: c.row,
    col: -c.col,
  }));
}

/**
 * Flip cells vertically (reflect across horizontal axis)
 */
export function flipCellsVertical(cells: Cell[]): Cell[] {
  return cells.map((c) => ({
    row: -c.row,
    col: c.col,
  }));
}

/**
 * Apply transformation to a polyomino's cells
 */
export function transformCells(
  cells: Cell[],
  rotation: 0 | 90 | 180 | 270,
  flipped: boolean
): Cell[] {
  let result = [...cells];

  // Apply flip first (if any)
  if (flipped) {
    result = flipCellsHorizontal(result);
  }

  // Then apply rotation
  result = rotateCells(result, rotation);

  // Normalize to origin
  return normalizeCells(result);
}

/**
 * Rotate a polyomino 90 degrees clockwise
 */
export function rotatePolyomino(polyomino: Polyomino): Polyomino {
  const rotatedCells = normalizeCells(rotateCells90CW(polyomino.cells));
  return {
    ...polyomino,
    cells: sortCells(rotatedCells),
  };
}

/**
 * Flip a polyomino horizontally
 */
export function flipPolyomino(polyomino: Polyomino): Polyomino {
  const flippedCells = normalizeCells(flipCellsHorizontal(polyomino.cells));
  return {
    ...polyomino,
    cells: sortCells(flippedCells),
  };
}

/**
 * Get a transformed polyomino with specific rotation and flip
 */
export function getTransformedPolyomino(
  polyomino: Polyomino,
  rotation: 0 | 90 | 180 | 270,
  flipped: boolean
): TransformedPolyomino {
  const transformedCells = transformCells(polyomino.cells, rotation, flipped);

  return {
    ...polyomino,
    id: `${polyomino.id}_r${rotation}${flipped ? '_f' : ''}`,
    cells: sortCells(transformedCells),
    rotation,
    flipped,
    originalId: polyomino.id,
  };
}

/**
 * Get all unique transformations of a polyomino
 * Some polyominoes have symmetry, so not all 8 transformations are unique
 */
export function getAllTransformations(polyomino: Polyomino): TransformedPolyomino[] {
  const transformations: TransformedPolyomino[] = [];
  const seen = new Set<string>();

  const rotations: (0 | 90 | 180 | 270)[] = [0, 90, 180, 270];
  const flips = [false, true];

  for (const flipped of flips) {
    for (const rotation of rotations) {
      const transformed = getTransformedPolyomino(polyomino, rotation, flipped);
      const key = cellsToKey(transformed.cells);

      if (!seen.has(key)) {
        seen.add(key);
        transformations.push(transformed);
      }
    }
  }

  return transformations;
}

/**
 * Convert cells to a unique string key for comparison
 */
export function cellsToKey(cells: Cell[]): string {
  const sorted = sortCells(normalizeCells(cells));
  return sorted.map((c) => `${c.row},${c.col}`).join('|');
}

/**
 * Check if two sets of cells are equivalent (same shape)
 */
export function areCellsEquivalent(cells1: Cell[], cells2: Cell[]): boolean {
  return cellsToKey(cells1) === cellsToKey(cells2);
}

/**
 * Check if two polyominoes are the same shape (ignoring transformation)
 */
export function arePolyominoesEquivalent(p1: Polyomino, p2: Polyomino): boolean {
  if (p1.order !== p2.order) return false;

  // Check if any transformation of p1 matches p2
  const p1Transformations = getAllTransformations(p1);
  const p2Key = cellsToKey(p2.cells);

  return p1Transformations.some((t) => cellsToKey(t.cells) === p2Key);
}

/**
 * Get the symmetry group of a polyomino
 * Returns number of unique orientations (1, 2, 4, or 8)
 */
export function getSymmetryCount(polyomino: Polyomino): number {
  return getAllTransformations(polyomino).length;
}

/**
 * Translate cells by an offset
 */
export function translateCells(cells: Cell[], offset: Cell): Cell[] {
  return cells.map((c) => ({
    row: c.row + offset.row,
    col: c.col + offset.col,
  }));
}

/**
 * Get the absolute positions of cells when placed at a position on a grid
 */
export function getAbsoluteCells(
  polyomino: Polyomino,
  position: Cell,
  rotation: 0 | 90 | 180 | 270 = 0,
  flipped: boolean = false
): Cell[] {
  const transformed = transformCells(polyomino.cells, rotation, flipped);
  return translateCells(transformed, position);
}

/**
 * Check if a cell is within grid bounds
 */
export function isCellInBounds(cell: Cell, gridRows: number, gridCols: number): boolean {
  return cell.row >= 0 && cell.row < gridRows && cell.col >= 0 && cell.col < gridCols;
}

/**
 * Check if all cells are within grid bounds
 */
export function areCellsInBounds(cells: Cell[], gridRows: number, gridCols: number): boolean {
  return cells.every((c) => isCellInBounds(c, gridRows, gridCols));
}
