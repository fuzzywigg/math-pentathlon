// Hex Grid Types and Coordinate Systems
// Supports axial, cube, and offset coordinates with conversion utilities

// =============================================================================
// Coordinate Types
// =============================================================================

/**
 * Axial coordinates (q, r) - most commonly used for hex grids
 * q = column, r = row (diagonal)
 */
export interface AxialCoord {
  q: number;
  r: number;
}

/**
 * Cube coordinates (x, y, z) - useful for calculations
 * Constraint: x + y + z = 0
 */
export interface CubeCoord {
  x: number;
  y: number;
  z: number;
}

/**
 * Offset coordinates (col, row) - grid-like, easier for arrays
 * Two common layouts: odd-q and even-q (or odd-r, even-r)
 */
export interface OffsetCoord {
  col: number;
  row: number;
}

/**
 * Pixel coordinates for rendering
 */
export interface PixelCoord {
  x: number;
  y: number;
}

// =============================================================================
// Hex Orientation
// =============================================================================

/**
 * Hex can be pointy-top or flat-top oriented
 */
export type HexOrientation = 'pointy' | 'flat';

/**
 * Offset coordinate parity (which columns/rows are offset)
 */
export type OffsetParity = 'odd' | 'even';

/**
 * Hex layout configuration
 */
export interface HexLayout {
  orientation: HexOrientation;
  size: number; // Hex radius (center to vertex for pointy, center to edge for flat)
  origin: PixelCoord;
  spacing?: number; // Optional gap between hexes
}

// =============================================================================
// Direction Constants
// =============================================================================

/**
 * The 6 hex directions in axial coordinates
 * For pointy-top hexes starting from right, going counter-clockwise
 */
export const AXIAL_DIRECTIONS: readonly AxialCoord[] = [
  { q: 1, r: 0 },   // East
  { q: 1, r: -1 },  // Northeast
  { q: 0, r: -1 },  // Northwest
  { q: -1, r: 0 },  // West
  { q: -1, r: 1 },  // Southwest
  { q: 0, r: 1 },   // Southeast
] as const;

/**
 * Direction names for pointy-top hexes
 */
export const DIRECTION_NAMES = ['E', 'NE', 'NW', 'W', 'SW', 'SE'] as const;

/**
 * Cube directions
 */
export const CUBE_DIRECTIONS: readonly CubeCoord[] = [
  { x: 1, y: -1, z: 0 },
  { x: 1, y: 0, z: -1 },
  { x: 0, y: 1, z: -1 },
  { x: -1, y: 1, z: 0 },
  { x: -1, y: 0, z: 1 },
  { x: 0, y: -1, z: 1 },
] as const;

/**
 * Diagonal directions (between main 6)
 */
export const CUBE_DIAGONALS: readonly CubeCoord[] = [
  { x: 2, y: -1, z: -1 },
  { x: 1, y: 1, z: -2 },
  { x: -1, y: 2, z: -1 },
  { x: -2, y: 1, z: 1 },
  { x: -1, y: -1, z: 2 },
  { x: 1, y: -2, z: 1 },
] as const;

// =============================================================================
// Hex Cell State
// =============================================================================

export interface HexCell<T = unknown> {
  coord: AxialCoord;
  data?: T;
}

export interface HexGrid<T = unknown> {
  cells: Map<string, HexCell<T>>;
  layout: HexLayout;
}

// =============================================================================
// Factory Functions
// =============================================================================

export function createAxial(q: number, r: number): AxialCoord {
  return { q, r };
}

export function createCube(x: number, y: number, z: number): CubeCoord {
  if (Math.round(x + y + z) !== 0) {
    throw new Error(`Invalid cube coordinates: ${x} + ${y} + ${z} = ${x + y + z} (must equal 0)`);
  }
  return { x, y, z };
}

export function createOffset(col: number, row: number): OffsetCoord {
  return { col, row };
}

export function createLayout(
  orientation: HexOrientation = 'pointy',
  size: number = 30,
  originX: number = 0,
  originY: number = 0
): HexLayout {
  return {
    orientation,
    size,
    origin: { x: originX, y: originY },
  };
}

/**
 * Create a unique string key for a hex coordinate
 */
export function coordKey(coord: AxialCoord): string {
  return `${coord.q},${coord.r}`;
}

/**
 * Parse a coordinate key back to AxialCoord
 */
export function parseCoordKey(key: string): AxialCoord {
  const [q, r] = key.split(',').map(Number);
  return { q, r };
}
