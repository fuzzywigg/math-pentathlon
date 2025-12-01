// Hex Coordinate Conversions and Operations
// Full coordinate system utilities for hex grids

import {
  AxialCoord,
  CubeCoord,
  OffsetCoord,
  PixelCoord,
  HexLayout,
  OffsetParity,
  AXIAL_DIRECTIONS,
  CUBE_DIAGONALS,
  createAxial,
  createCube,
} from './types';

// =============================================================================
// Coordinate Conversions
// =============================================================================

/**
 * Convert axial to cube coordinates
 */
export function axialToCube(axial: AxialCoord): CubeCoord {
  const x = axial.q;
  const z = axial.r;
  const y = -x - z;
  return { x, y, z };
}

/**
 * Convert cube to axial coordinates
 */
export function cubeToAxial(cube: CubeCoord): AxialCoord {
  return { q: cube.x, r: cube.z };
}

/**
 * Convert axial to offset coordinates (odd-q layout)
 */
export function axialToOffset(axial: AxialCoord, parity: OffsetParity = 'odd'): OffsetCoord {
  const col = axial.q;
  const offset = parity === 'odd' ? axial.q & 1 : (axial.q + 1) & 1;
  const row = axial.r + Math.floor((axial.q + offset) / 2);
  return { col, row };
}

/**
 * Convert offset to axial coordinates (odd-q layout)
 */
export function offsetToAxial(offset: OffsetCoord, parity: OffsetParity = 'odd'): AxialCoord {
  const q = offset.col;
  const parityOffset = parity === 'odd' ? offset.col & 1 : (offset.col + 1) & 1;
  const r = offset.row - Math.floor((offset.col + parityOffset) / 2);
  return { q, r };
}

// =============================================================================
// Pixel Conversions
// =============================================================================

/**
 * Convert axial to pixel coordinates (pointy-top orientation)
 */
export function axialToPixelPointy(axial: AxialCoord, layout: HexLayout): PixelCoord {
  const size = layout.size;
  const x = size * (Math.sqrt(3) * axial.q + (Math.sqrt(3) / 2) * axial.r);
  const y = size * ((3 / 2) * axial.r);
  return {
    x: x + layout.origin.x,
    y: y + layout.origin.y,
  };
}

/**
 * Convert axial to pixel coordinates (flat-top orientation)
 */
export function axialToPixelFlat(axial: AxialCoord, layout: HexLayout): PixelCoord {
  const size = layout.size;
  const x = size * ((3 / 2) * axial.q);
  const y = size * ((Math.sqrt(3) / 2) * axial.q + Math.sqrt(3) * axial.r);
  return {
    x: x + layout.origin.x,
    y: y + layout.origin.y,
  };
}

/**
 * Convert axial to pixel (auto-selects based on layout orientation)
 */
export function axialToPixel(axial: AxialCoord, layout: HexLayout): PixelCoord {
  return layout.orientation === 'pointy'
    ? axialToPixelPointy(axial, layout)
    : axialToPixelFlat(axial, layout);
}

/**
 * Convert pixel to axial coordinates (pointy-top)
 */
export function pixelToAxialPointy(pixel: PixelCoord, layout: HexLayout): AxialCoord {
  const pt = {
    x: (pixel.x - layout.origin.x) / layout.size,
    y: (pixel.y - layout.origin.y) / layout.size,
  };
  const q = (Math.sqrt(3) / 3) * pt.x - (1 / 3) * pt.y;
  const r = (2 / 3) * pt.y;
  return hexRound({ q, r });
}

/**
 * Convert pixel to axial coordinates (flat-top)
 */
export function pixelToAxialFlat(pixel: PixelCoord, layout: HexLayout): AxialCoord {
  const pt = {
    x: (pixel.x - layout.origin.x) / layout.size,
    y: (pixel.y - layout.origin.y) / layout.size,
  };
  const q = (2 / 3) * pt.x;
  const r = (-1 / 3) * pt.x + (Math.sqrt(3) / 3) * pt.y;
  return hexRound({ q, r });
}

/**
 * Convert pixel to axial (auto-selects based on layout orientation)
 */
export function pixelToAxial(pixel: PixelCoord, layout: HexLayout): AxialCoord {
  return layout.orientation === 'pointy'
    ? pixelToAxialPointy(pixel, layout)
    : pixelToAxialFlat(pixel, layout);
}

// =============================================================================
// Hex Rounding (for pixel-to-hex conversion)
// =============================================================================

/**
 * Round fractional cube coordinates to nearest hex
 */
export function cubeRound(cube: CubeCoord): CubeCoord {
  let rx = Math.round(cube.x);
  let ry = Math.round(cube.y);
  let rz = Math.round(cube.z);

  const xDiff = Math.abs(rx - cube.x);
  const yDiff = Math.abs(ry - cube.y);
  const zDiff = Math.abs(rz - cube.z);

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }

  return { x: rx, y: ry, z: rz };
}

/**
 * Round fractional axial coordinates to nearest hex
 */
export function hexRound(axial: AxialCoord): AxialCoord {
  const cube = axialToCube(axial);
  const rounded = cubeRound(cube);
  return cubeToAxial(rounded);
}

// =============================================================================
// Neighbor Operations
// =============================================================================

/**
 * Get all 6 neighbors of a hex
 */
export function getNeighbors(coord: AxialCoord): AxialCoord[] {
  return AXIAL_DIRECTIONS.map((dir) => createAxial(coord.q + dir.q, coord.r + dir.r));
}

/**
 * Get a specific neighbor by direction index (0-5)
 */
export function getNeighbor(coord: AxialCoord, direction: number): AxialCoord {
  const dir = AXIAL_DIRECTIONS[direction % 6];
  return createAxial(coord.q + dir.q, coord.r + dir.r);
}

/**
 * Get diagonal neighbors (6 hexes that share only a vertex)
 */
export function getDiagonalNeighbors(coord: AxialCoord): AxialCoord[] {
  return CUBE_DIAGONALS.map((dir) => {
    const cube = axialToCube(coord);
    const diagonal = createCube(cube.x + dir.x, cube.y + dir.y, cube.z + dir.z);
    return cubeToAxial(diagonal);
  });
}

/**
 * Check if two hexes are neighbors
 */
export function areNeighbors(a: AxialCoord, b: AxialCoord): boolean {
  const dx = a.q - b.q;
  const dy = a.r - b.r;
  return (
    (dx === 0 && Math.abs(dy) === 1) ||
    (dy === 0 && Math.abs(dx) === 1) ||
    (dx === 1 && dy === -1) ||
    (dx === -1 && dy === 1)
  );
}

// =============================================================================
// Distance and Range
// =============================================================================

/**
 * Calculate distance between two hexes (in hex steps)
 */
export function hexDistance(a: AxialCoord, b: AxialCoord): number {
  const ac = axialToCube(a);
  const bc = axialToCube(b);
  return Math.max(Math.abs(ac.x - bc.x), Math.abs(ac.y - bc.y), Math.abs(ac.z - bc.z));
}

/**
 * Get all hexes within a given range from center
 */
export function hexesInRange(center: AxialCoord, range: number): AxialCoord[] {
  const results: AxialCoord[] = [];

  for (let q = -range; q <= range; q++) {
    for (let r = Math.max(-range, -q - range); r <= Math.min(range, -q + range); r++) {
      results.push(createAxial(center.q + q, center.r + r));
    }
  }

  return results;
}

/**
 * Get all hexes at exactly the given distance (ring)
 */
export function hexRing(center: AxialCoord, radius: number): AxialCoord[] {
  if (radius === 0) return [center];

  const results: AxialCoord[] = [];
  let current = createAxial(center.q + AXIAL_DIRECTIONS[4].q * radius, center.r + AXIAL_DIRECTIONS[4].r * radius);

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      results.push(current);
      current = getNeighbor(current, i);
    }
  }

  return results;
}

/**
 * Get spiral of hexes (center outward)
 */
export function hexSpiral(center: AxialCoord, radius: number): AxialCoord[] {
  const results: AxialCoord[] = [center];

  for (let r = 1; r <= radius; r++) {
    results.push(...hexRing(center, r));
  }

  return results;
}

// =============================================================================
// Line Drawing
// =============================================================================

/**
 * Linear interpolation for cube coordinates
 */
function cubeLerp(a: CubeCoord, b: CubeCoord, t: number): CubeCoord {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

/**
 * Draw a line between two hexes
 */
export function hexLine(a: AxialCoord, b: AxialCoord): AxialCoord[] {
  const n = hexDistance(a, b);
  if (n === 0) return [a];

  const ac = axialToCube(a);
  const bc = axialToCube(b);
  const results: AxialCoord[] = [];

  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const lerped = cubeLerp(ac, bc, t);
    const rounded = cubeRound(lerped);
    results.push(cubeToAxial(rounded));
  }

  return results;
}

// =============================================================================
// Rotation
// =============================================================================

/**
 * Rotate a hex coordinate around origin by 60 degrees clockwise
 */
export function rotateRight(coord: AxialCoord): AxialCoord {
  const cube = axialToCube(coord);
  return cubeToAxial({ x: -cube.z, y: -cube.x, z: -cube.y });
}

/**
 * Rotate a hex coordinate around origin by 60 degrees counter-clockwise
 */
export function rotateLeft(coord: AxialCoord): AxialCoord {
  const cube = axialToCube(coord);
  return cubeToAxial({ x: -cube.y, y: -cube.z, z: -cube.x });
}

/**
 * Rotate a hex coordinate around a center point
 */
export function rotateAround(coord: AxialCoord, center: AxialCoord, steps: number): AxialCoord {
  // Translate to origin
  let relative = createAxial(coord.q - center.q, coord.r - center.r);

  // Rotate
  const normalizedSteps = ((steps % 6) + 6) % 6;
  for (let i = 0; i < normalizedSteps; i++) {
    relative = rotateRight(relative);
  }

  // Translate back
  return createAxial(relative.q + center.q, relative.r + center.r);
}

/**
 * Reflect a hex coordinate across an axis
 */
export function reflect(coord: AxialCoord, axis: 'q' | 'r' | 's'): AxialCoord {
  const cube = axialToCube(coord);
  switch (axis) {
    case 'q':
      return cubeToAxial({ x: cube.x, y: cube.z, z: cube.y });
    case 'r':
      return cubeToAxial({ x: cube.z, y: cube.y, z: cube.x });
    case 's':
      return cubeToAxial({ x: cube.y, y: cube.x, z: cube.z });
  }
}

// =============================================================================
// Hex Equality and Comparison
// =============================================================================

export function hexEquals(a: AxialCoord, b: AxialCoord): boolean {
  return a.q === b.q && a.r === b.r;
}

export function hexInArray(hex: AxialCoord, array: AxialCoord[]): boolean {
  return array.some((h) => hexEquals(h, hex));
}
