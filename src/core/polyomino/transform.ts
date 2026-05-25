// Polyomino Transform - Rotation, Reflection, and Transformation
// Handles all shape manipulations for polyominoes

import { Cell, Rotation, PolyominoShape } from './types';

/**
 * Rotate a set of cells by the given angle around the origin
 */
export function rotateCells(cells: Cell[], rotation: Rotation): Cell[] {
  if (rotation === 0) return cells.map(c => ({ ...c }));

  return cells.map(cell => {
    switch (rotation) {
      case 90:
        return { row: cell.col, col: -cell.row };
      case 180:
        return { row: -cell.row, col: -cell.col };
      case 270:
        return { row: -cell.col, col: cell.row };
      default:
        return { ...cell };
    }
  });
}

/**
 * Flip cells horizontally (mirror across Y axis)
 */
export function flipCellsHorizontal(cells: Cell[]): Cell[] {
  return cells.map(cell => ({ row: cell.row, col: -cell.col }));
}

/**
 * Flip cells vertically (mirror across X axis)
 */
export function flipCellsVertical(cells: Cell[]): Cell[] {
  return cells.map(cell => ({ row: -cell.row, col: cell.col }));
}

/**
 * Normalize cells so the minimum row and col are both 0
 * This ensures shapes are positioned consistently
 */
export function normalizeCells(cells: Cell[]): Cell[] {
  if (cells.length === 0) return [];

  const minRow = Math.min(...cells.map(c => c.row));
  const minCol = Math.min(...cells.map(c => c.col));

  return cells.map(cell => ({
    row: cell.row - minRow,
    col: cell.col - minCol,
  }));
}

/**
 * Get the bounding box of a set of cells
 */
export function getBoundingBox(cells: Cell[]): { width: number; height: number; minRow: number; minCol: number } {
  if (cells.length === 0) {
    return { width: 0, height: 0, minRow: 0, minCol: 0 };
  }

  const rows = cells.map(c => c.row);
  const cols = cells.map(c => c.col);

  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);

  return {
    width: maxCol - minCol + 1,
    height: maxRow - minRow + 1,
    minRow,
    minCol,
  };
}

/**
 * Center cells around origin (0,0)
 */
export function centerCells(cells: Cell[]): Cell[] {
  const { width, height, minRow, minCol } = getBoundingBox(cells);

  const offsetRow = minRow + Math.floor(height / 2);
  const offsetCol = minCol + Math.floor(width / 2);

  return cells.map(cell => ({
    row: cell.row - offsetRow,
    col: cell.col - offsetCol,
  }));
}

/**
 * Translate cells by an offset
 */
export function translateCells(cells: Cell[], rowOffset: number, colOffset: number): Cell[] {
  return cells.map(cell => ({
    row: cell.row + rowOffset,
    col: cell.col + colOffset,
  }));
}

/**
 * Get all unique rotations of a shape
 */
export function getAllRotations(cells: Cell[]): Cell[][] {
  const rotations: Cell[][] = [];
  const seen = new Set<string>();

  for (const rotation of [0, 90, 180, 270] as Rotation[]) {
    const rotated = normalizeCells(rotateCells(cells, rotation));
    const key = cellsToKey(rotated);

    if (!seen.has(key)) {
      seen.add(key);
      rotations.push(rotated);
    }
  }

  return rotations;
}

/**
 * Get all unique orientations (rotations + flips) of a shape
 */
export function getAllOrientations(shape: PolyominoShape): Cell[][] {
  const orientations: Cell[][] = [];
  const seen = new Set<string>();

  const baseCells = shape.cells;
  const cellVariants = [baseCells];

  // Add flipped variant if allowed
  if (shape.canFlip) {
    cellVariants.push(flipCellsHorizontal(baseCells));
  }

  for (const cells of cellVariants) {
    if (shape.canRotate) {
      for (const rotation of [0, 90, 180, 270] as Rotation[]) {
        const transformed = normalizeCells(rotateCells(cells, rotation));
        const key = cellsToKey(transformed);

        if (!seen.has(key)) {
          seen.add(key);
          orientations.push(transformed);
        }
      }
    } else {
      const normalized = normalizeCells(cells);
      const key = cellsToKey(normalized);

      if (!seen.has(key)) {
        seen.add(key);
        orientations.push(normalized);
      }
    }
  }

  return orientations;
}

/**
 * Create a canonical string key for a set of cells (for deduplication)
 */
export function cellsToKey(cells: Cell[]): string {
  const normalized = normalizeCells(cells);
  const sorted = [...normalized].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
  return sorted.map(c => `${c.row},${c.col}`).join('|');
}

/**
 * Check if two cell sets are equivalent (same shape)
 */
export function areCellsEquivalent(a: Cell[], b: Cell[]): boolean {
  return cellsToKey(a) === cellsToKey(b);
}

/**
 * Rotate a shape to the next rotation
 */
export function nextRotation(current: Rotation): Rotation {
  const rotations: Rotation[] = [0, 90, 180, 270];
  const index = rotations.indexOf(current);
  return rotations[(index + 1) % 4];
}

/**
 * Rotate a shape to the previous rotation
 */
export function prevRotation(current: Rotation): Rotation {
  const rotations: Rotation[] = [0, 90, 180, 270];
  const index = rotations.indexOf(current);
  return rotations[(index + 3) % 4];
}

/**
 * Get the transformed cells for a shape with given rotation and flip
 */
export function getTransformedCells(
  shape: PolyominoShape,
  rotation: Rotation,
  flipped: boolean
): Cell[] {
  let cells = shape.cells;

  // Apply flip first
  if (flipped && shape.canFlip) {
    cells = flipCellsHorizontal(cells);
  }

  // Then apply rotation
  if (shape.canRotate) {
    cells = rotateCells(cells, rotation);
  }

  return normalizeCells(cells);
}

/**
 * Get cells at a specific board position
 */
export function getCellsAtPosition(
  shape: PolyominoShape,
  position: Cell,
  rotation: Rotation,
  flipped: boolean
): Cell[] {
  const transformed = getTransformedCells(shape, rotation, flipped);
  return translateCells(transformed, position.row, position.col);
}

/**
 * Calculate the center of mass of cells
 */
export function getCenterOfMass(cells: Cell[]): { row: number; col: number } {
  if (cells.length === 0) return { row: 0, col: 0 };

  const sumRow = cells.reduce((sum, c) => sum + c.row, 0);
  const sumCol = cells.reduce((sum, c) => sum + c.col, 0);

  return {
    row: sumRow / cells.length,
    col: sumCol / cells.length,
  };
}

/**
 * Check if a cell is adjacent to any cell in the set (4-way adjacency)
 */
export function isAdjacent(cell: Cell, cells: Cell[]): boolean {
  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  return cells.some(c =>
    directions.some(d => c.row + d.row === cell.row && c.col + d.col === cell.col)
  );
}

/**
 * Check if all cells are connected (4-way connectivity)
 */
export function areCellsConnected(cells: Cell[]): boolean {
  if (cells.length <= 1) return true;

  const cellSet = new Set(cells.map(c => `${c.row},${c.col}`));
  const visited = new Set<string>();
  const queue: Cell[] = [cells[0]];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.row},${current.col}`;

    if (visited.has(key)) continue;
    visited.add(key);

    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
    ];

    for (const d of directions) {
      const neighbor = { row: current.row + d.row, col: current.col + d.col };
      const neighborKey = `${neighbor.row},${neighbor.col}`;

      if (cellSet.has(neighborKey) && !visited.has(neighborKey)) {
        queue.push(neighbor);
      }
    }
  }

  return visited.size === cells.length;
}
