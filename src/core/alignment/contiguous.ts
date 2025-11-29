/**
 * Contiguous Region Detection
 * Flood-fill based detection of connected regions
 */

import type {
  Position,
  FullDirection,
  ContiguousConfig,
  ContiguousRegion,
  GridAccessor,
  GridDimensions,
  CellMatcher,
} from './types';
import {
  CARDINAL_DIRECTIONS,
  ALL_DIRECTIONS,
  FULL_DIRECTION_VECTORS,
  DEFAULT_CONTIGUOUS_CONFIG,
} from './types';

/**
 * Get neighbors of a position based on connectivity
 */
export function getNeighbors(
  pos: Position,
  dimensions: GridDimensions,
  connectivity: 4 | 8 = 4
): Position[] {
  const directions: FullDirection[] = connectivity === 4 ? CARDINAL_DIRECTIONS : ALL_DIRECTIONS;
  const neighbors: Position[] = [];

  for (const dir of directions) {
    const vector = FULL_DIRECTION_VECTORS[dir];
    const neighbor: Position = {
      row: pos.row + vector.row,
      col: pos.col + vector.col,
    };

    // Check bounds
    if (
      neighbor.row >= 0 &&
      neighbor.row < dimensions.rows &&
      neighbor.col >= 0 &&
      neighbor.col < dimensions.cols
    ) {
      neighbors.push(neighbor);
    }
  }

  return neighbors;
}

/**
 * Create a position key for Set/Map operations
 */
function posKey(pos: Position): string {
  return `${pos.row},${pos.col}`;
}


/**
 * Find a single contiguous region starting from a position using flood-fill
 */
export function findRegionAt<T>(
  start: Position,
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config: ContiguousConfig = DEFAULT_CONTIGUOUS_CONFIG,
  matcher?: CellMatcher<T>
): ContiguousRegion | null {
  const startValue = getCell(start.row, start.col);

  // Can't start from empty cell
  if (startValue === null || startValue === undefined) {
    return null;
  }

  // Check if matches custom criteria
  if (matcher && !matcher(startValue, start.row, start.col)) {
    return null;
  }

  const visited = new Set<string>();
  const queue: Position[] = [start];
  const positions: Position[] = [];

  // Track bounds
  let minRow = start.row;
  let maxRow = start.row;
  let minCol = start.col;
  let maxCol = start.col;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = posKey(current);

    if (visited.has(key)) {
      continue;
    }

    const value = getCell(current.row, current.col);

    // Check if this cell matches
    if (value === null || value === undefined) {
      continue;
    }

    // Must match the starting value
    if (value !== startValue) {
      // Try JSON comparison for objects
      if (typeof value !== 'object' || typeof startValue !== 'object') {
        continue;
      }
      if (JSON.stringify(value) !== JSON.stringify(startValue)) {
        continue;
      }
    }

    // Check custom matcher
    if (matcher && !matcher(value, current.row, current.col)) {
      continue;
    }

    visited.add(key);
    positions.push(current);

    // Update bounds
    minRow = Math.min(minRow, current.row);
    maxRow = Math.max(maxRow, current.row);
    minCol = Math.min(minCol, current.col);
    maxCol = Math.max(maxCol, current.col);

    // Add neighbors to queue
    const neighbors = getNeighbors(current, dimensions, config.connectivity);
    for (const neighbor of neighbors) {
      if (!visited.has(posKey(neighbor))) {
        queue.push(neighbor);
      }
    }
  }

  // Check size constraints
  if (config.minSize && positions.length < config.minSize) {
    return null;
  }
  if (config.maxSize && positions.length > config.maxSize) {
    return null;
  }

  return {
    positions,
    size: positions.length,
    value: startValue,
    bounds: { minRow, maxRow, minCol, maxCol },
  };
}

/**
 * Find all contiguous regions on the grid
 */
export function findAllRegions<T>(
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config: ContiguousConfig = DEFAULT_CONTIGUOUS_CONFIG,
  matcher?: CellMatcher<T>
): ContiguousRegion[] {
  const visited = new Set<string>();
  const regions: ContiguousRegion[] = [];

  for (let row = 0; row < dimensions.rows; row++) {
    for (let col = 0; col < dimensions.cols; col++) {
      const key = posKey({ row, col });
      if (visited.has(key)) {
        continue;
      }

      const region = findRegionAt({ row, col }, dimensions, getCell, config, matcher);

      if (region) {
        regions.push(region);
        // Mark all positions in this region as visited
        for (const pos of region.positions) {
          visited.add(posKey(pos));
        }
      } else {
        // Mark this cell as visited even if no region formed
        visited.add(key);
      }
    }
  }

  return regions;
}

/**
 * Find the largest contiguous region
 */
export function findLargestRegion<T>(
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config: ContiguousConfig = DEFAULT_CONTIGUOUS_CONFIG,
  matcher?: CellMatcher<T>
): ContiguousRegion | null {
  const regions = findAllRegions(dimensions, getCell, config, matcher);

  if (regions.length === 0) {
    return null;
  }

  return regions.reduce((largest, region) =>
    region.size > largest.size ? region : largest
  );
}

/**
 * Find all regions of a specific value
 */
export function findRegionsOfValue<T>(
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  targetValue: T,
  config: ContiguousConfig = DEFAULT_CONTIGUOUS_CONFIG
): ContiguousRegion[] {
  const matcher: CellMatcher<T> = (value) => {
    if (typeof value === 'object' && typeof targetValue === 'object') {
      return JSON.stringify(value) === JSON.stringify(targetValue);
    }
    return value === targetValue;
  };

  return findAllRegions(dimensions, getCell, config, matcher);
}

/**
 * Check if two positions are in the same contiguous region
 */
export function areConnected<T>(
  pos1: Position,
  pos2: Position,
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config: ContiguousConfig = DEFAULT_CONTIGUOUS_CONFIG,
  matcher?: CellMatcher<T>
): boolean {
  const region = findRegionAt(pos1, dimensions, getCell, config, matcher);

  if (!region) {
    return false;
  }

  return region.positions.some((p) => p.row === pos2.row && p.col === pos2.col);
}

/**
 * Get the size of the region containing a position
 */
export function getRegionSize<T>(
  pos: Position,
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config: ContiguousConfig = DEFAULT_CONTIGUOUS_CONFIG,
  matcher?: CellMatcher<T>
): number {
  const region = findRegionAt(pos, dimensions, getCell, config, matcher);
  return region ? region.size : 0;
}

/**
 * Check if a position is isolated (region size of 1)
 */
export function isIsolated<T>(
  pos: Position,
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config: ContiguousConfig = DEFAULT_CONTIGUOUS_CONFIG,
  matcher?: CellMatcher<T>
): boolean {
  return getRegionSize(pos, dimensions, getCell, config, matcher) === 1;
}

/**
 * Find boundary cells of a region (cells with at least one non-matching neighbor)
 */
export function findRegionBoundary(
  region: ContiguousRegion,
  dimensions: GridDimensions,
  connectivity: 4 | 8 = 4
): Position[] {
  const regionSet = new Set(region.positions.map(posKey));
  const boundary: Position[] = [];

  for (const pos of region.positions) {
    const neighbors = getNeighbors(pos, dimensions, connectivity);
    const hasOutsideNeighbor = neighbors.some((n) => !regionSet.has(posKey(n)));

    // Also consider edge of grid as boundary
    const isEdge =
      pos.row === 0 ||
      pos.row === dimensions.rows - 1 ||
      pos.col === 0 ||
      pos.col === dimensions.cols - 1;

    if (hasOutsideNeighbor || isEdge) {
      boundary.push(pos);
    }
  }

  return boundary;
}

/**
 * Count the number of distinct regions on the grid
 */
export function countRegions<T>(
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config: ContiguousConfig = DEFAULT_CONTIGUOUS_CONFIG,
  matcher?: CellMatcher<T>
): number {
  return findAllRegions(dimensions, getCell, config, matcher).length;
}

/**
 * Get region statistics
 */
export function getRegionStats<T>(
  dimensions: GridDimensions,
  getCell: GridAccessor<T>,
  config: ContiguousConfig = DEFAULT_CONTIGUOUS_CONFIG,
  matcher?: CellMatcher<T>
): {
  count: number;
  totalSize: number;
  averageSize: number;
  minSize: number;
  maxSize: number;
  sizes: number[];
} {
  const regions = findAllRegions(dimensions, getCell, config, matcher);

  if (regions.length === 0) {
    return {
      count: 0,
      totalSize: 0,
      averageSize: 0,
      minSize: 0,
      maxSize: 0,
      sizes: [],
    };
  }

  const sizes = regions.map((r) => r.size);
  const totalSize = sizes.reduce((a, b) => a + b, 0);

  return {
    count: regions.length,
    totalSize,
    averageSize: totalSize / regions.length,
    minSize: Math.min(...sizes),
    maxSize: Math.max(...sizes),
    sizes,
  };
}
