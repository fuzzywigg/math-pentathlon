// Contiguous Region Detection (Flood Fill)

import {
  GridPosition,
  CellValue,
  CellGetter,
  ContiguousConfig,
  Region,
  NEIGHBORS_4WAY,
  NEIGHBORS_8WAY,
  HEX_NEIGHBORS_EVEN_ROW,
  HEX_NEIGHBORS_ODD_ROW,
} from './types';
import { isInBounds, wrapPosition } from './grid-alignment';

/**
 * Get neighbors for a position based on configuration
 */
export function getNeighbors(
  row: number,
  col: number,
  config: ContiguousConfig
): GridPosition[] {
  const { rows, cols, includeDiagonals = false, wrap = false } = config;
  const offsets = includeDiagonals ? NEIGHBORS_8WAY : NEIGHBORS_4WAY;
  const neighbors: GridPosition[] = [];

  for (const offset of offsets) {
    let newRow = row + offset.row;
    let newCol = col + offset.col;

    if (wrap) {
      const wrapped = wrapPosition(newRow, newCol, rows, cols);
      newRow = wrapped.row;
      newCol = wrapped.col;
    }

    if (isInBounds(newRow, newCol, rows, cols)) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }

  return neighbors;
}

/**
 * Get hex neighbors for a position (handles odd/even row offset)
 */
export function getHexNeighbors(
  row: number,
  col: number,
  config: ContiguousConfig
): GridPosition[] {
  const { rows, cols, wrap = false } = config;
  const offsets = row % 2 === 0 ? HEX_NEIGHBORS_EVEN_ROW : HEX_NEIGHBORS_ODD_ROW;
  const neighbors: GridPosition[] = [];

  for (const offset of offsets) {
    let newRow = row + offset.row;
    let newCol = col + offset.col;

    if (wrap) {
      const wrapped = wrapPosition(newRow, newCol, rows, cols);
      newRow = wrapped.row;
      newCol = wrapped.col;
    }

    if (isInBounds(newRow, newCol, rows, cols)) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }

  return neighbors;
}

/**
 * Find a contiguous region starting from a position using flood fill
 */
export function findRegion(
  startRow: number,
  startCol: number,
  getCell: CellGetter,
  config: ContiguousConfig,
  getNeighborsFn: (row: number, col: number, config: ContiguousConfig) => GridPosition[] = getNeighbors
): Region | null {
  const startValue = getCell(startRow, startCol);

  if (startValue === null || startValue === undefined) {
    return null;
  }

  const positions: GridPosition[] = [];
  const visited = new Set<string>();
  const queue: GridPosition[] = [{ row: startRow, col: startCol }];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.row},${current.col}`;

    if (visited.has(key)) {
      continue;
    }

    const cellValue = getCell(current.row, current.col);

    if (cellValue !== startValue) {
      continue;
    }

    visited.add(key);
    positions.push(current);

    // Add unvisited neighbors to queue
    const neighbors = getNeighborsFn(current.row, current.col, config);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      if (!visited.has(neighborKey)) {
        queue.push(neighbor);
      }
    }
  }

  return {
    value: startValue,
    positions,
    size: positions.length,
  };
}

/**
 * Find all distinct regions on the board
 */
export function findAllRegions(
  getCell: CellGetter,
  config: ContiguousConfig,
  getNeighborsFn: (row: number, col: number, config: ContiguousConfig) => GridPosition[] = getNeighbors
): Region[] {
  const { rows, cols } = config;
  const visited = new Set<string>();
  const regions: Region[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const key = `${row},${col}`;

      if (visited.has(key)) {
        continue;
      }

      const cellValue = getCell(row, col);

      if (cellValue === null || cellValue === undefined) {
        visited.add(key);
        continue;
      }

      const region = findRegion(row, col, getCell, config, getNeighborsFn);

      if (region) {
        regions.push(region);
        // Mark all positions in region as visited
        for (const pos of region.positions) {
          visited.add(`${pos.row},${pos.col}`);
        }
      }
    }
  }

  return regions;
}

/**
 * Find regions for a specific value
 */
export function findRegionsForValue(
  value: CellValue,
  getCell: CellGetter,
  config: ContiguousConfig,
  getNeighborsFn: (row: number, col: number, config: ContiguousConfig) => GridPosition[] = getNeighbors
): Region[] {
  const allRegions = findAllRegions(getCell, config, getNeighborsFn);
  return allRegions.filter(region => region.value === value);
}

/**
 * Get the largest region for a value
 */
export function getLargestRegion(
  value: CellValue,
  getCell: CellGetter,
  config: ContiguousConfig,
  getNeighborsFn: (row: number, col: number, config: ContiguousConfig) => GridPosition[] = getNeighbors
): Region | null {
  const regions = findRegionsForValue(value, getCell, config, getNeighborsFn);

  if (regions.length === 0) {
    return null;
  }

  return regions.reduce((largest, current) =>
    current.size > largest.size ? current : largest
  );
}

/**
 * Check if two positions are connected (same region)
 */
export function areConnected(
  pos1: GridPosition,
  pos2: GridPosition,
  getCell: CellGetter,
  config: ContiguousConfig,
  getNeighborsFn: (row: number, col: number, config: ContiguousConfig) => GridPosition[] = getNeighbors
): boolean {
  const region = findRegion(pos1.row, pos1.col, getCell, config, getNeighborsFn);

  if (!region) {
    return false;
  }

  return region.positions.some(
    pos => pos.row === pos2.row && pos.col === pos2.col
  );
}

/**
 * Check if a region touches a specific edge of the board
 */
export function regionTouchesEdge(
  region: Region,
  edge: 'top' | 'bottom' | 'left' | 'right',
  config: ContiguousConfig
): boolean {
  const { rows, cols } = config;

  return region.positions.some(pos => {
    switch (edge) {
      case 'top':
        return pos.row === 0;
      case 'bottom':
        return pos.row === rows - 1;
      case 'left':
        return pos.col === 0;
      case 'right':
        return pos.col === cols - 1;
    }
  });
}

/**
 * Check if a region connects two opposite edges (for Hex-style games)
 */
export function regionConnectsEdges(
  region: Region,
  edge1: 'top' | 'bottom' | 'left' | 'right',
  edge2: 'top' | 'bottom' | 'left' | 'right',
  config: ContiguousConfig
): boolean {
  return regionTouchesEdge(region, edge1, config) &&
         regionTouchesEdge(region, edge2, config);
}

/**
 * Find a path from one position to another within connected cells
 * Returns the path or null if not connected
 */
export function findPath(
  start: GridPosition,
  end: GridPosition,
  getCell: CellGetter,
  config: ContiguousConfig,
  getNeighborsFn: (row: number, col: number, config: ContiguousConfig) => GridPosition[] = getNeighbors
): GridPosition[] | null {
  const startValue = getCell(start.row, start.col);
  const endValue = getCell(end.row, end.col);

  // Both positions must have the same value
  if (startValue !== endValue || startValue === null) {
    return null;
  }

  // BFS to find path
  const visited = new Set<string>();
  const queue: { pos: GridPosition; path: GridPosition[] }[] = [
    { pos: start, path: [start] }
  ];

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;
    const key = `${pos.row},${pos.col}`;

    if (pos.row === end.row && pos.col === end.col) {
      return path;
    }

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    const neighbors = getNeighborsFn(pos.row, pos.col, config);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      if (!visited.has(neighborKey) && getCell(neighbor.row, neighbor.col) === startValue) {
        queue.push({
          pos: neighbor,
          path: [...path, neighbor]
        });
      }
    }
  }

  return null;
}

/**
 * Count the number of separate regions for each value
 */
export function countRegionsByValue(
  getCell: CellGetter,
  config: ContiguousConfig,
  getNeighborsFn: (row: number, col: number, config: ContiguousConfig) => GridPosition[] = getNeighbors
): Map<CellValue, number> {
  const allRegions = findAllRegions(getCell, config, getNeighborsFn);
  const counts = new Map<CellValue, number>();

  for (const region of allRegions) {
    const current = counts.get(region.value) || 0;
    counts.set(region.value, current + 1);
  }

  return counts;
}
