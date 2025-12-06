/**
 * Polyomino System Unit Tests
 */

import { describe, it, expect } from 'vitest';
import {
  // Types
  TETROMINOES,
  PENTOMINOES,
  getPolyominoesByOrder,
  getPolyominoById,
  // Transformations
  getBounds,
  normalizeCells,
  sortCells,
  canonicalizeCells,
  rotateCells90CW,
  rotateCells,
  flipCellsHorizontal,
  transformCells,
  rotatePolyomino,
  flipPolyomino,
  getTransformedPolyomino,
  getAllTransformations,
  cellsToKey,
  areCellsEquivalent,
  arePolyominoesEquivalent,
  getSymmetryCount,
  translateCells,
  getAbsoluteCells,
  areCellsInBounds,
  // Placement
  createGrid,
  isCellOccupied,
  isValidPlacement,
  placePolyomino,
  removePolyomino,
  getAllValidPositions,
  getPlacementCells,
  doPlacementsOverlap,
  getAdjacentCells,
} from '../../src/core/polyomino';

describe('getPolyominoesByOrder', () => {
  it('should return 1 monomino', () => {
    const monominoes = getPolyominoesByOrder(1);
    expect(monominoes).toHaveLength(1);
    expect(monominoes[0].cells).toHaveLength(1);
  });

  it('should return 1 domino', () => {
    const dominoes = getPolyominoesByOrder(2);
    expect(dominoes).toHaveLength(1);
    expect(dominoes[0].cells).toHaveLength(2);
  });

  it('should return 2 trominoes', () => {
    const trominoes = getPolyominoesByOrder(3);
    expect(trominoes).toHaveLength(2);
    trominoes.forEach((t) => expect(t.cells).toHaveLength(3));
  });

  it('should return 7 tetrominoes', () => {
    expect(TETROMINOES).toHaveLength(7);
    TETROMINOES.forEach((t) => expect(t.cells).toHaveLength(4));
  });

  it('should return 12 pentominoes', () => {
    expect(PENTOMINOES).toHaveLength(12);
    PENTOMINOES.forEach((p) => expect(p.cells).toHaveLength(5));
  });
});

describe('getPolyominoById', () => {
  it('should find tetromino by ID', () => {
    const tPiece = getPolyominoById('T');
    expect(tPiece).toBeDefined();
    expect(tPiece?.name).toBe('T-tetromino');
  });

  it('should find pentomino by ID', () => {
    const xPiece = getPolyominoById('X');
    expect(xPiece).toBeDefined();
    expect(xPiece?.order).toBe(5);
  });

  it('should return undefined for unknown ID', () => {
    expect(getPolyominoById('UNKNOWN')).toBeUndefined();
  });
});

describe('getBounds', () => {
  it('should calculate bounds correctly', () => {
    const cells = [
      { row: 1, col: 2 },
      { row: 3, col: 4 },
      { row: 2, col: 3 },
    ];
    const bounds = getBounds(cells);
    expect(bounds.minRow).toBe(1);
    expect(bounds.maxRow).toBe(3);
    expect(bounds.minCol).toBe(2);
    expect(bounds.maxCol).toBe(4);
    expect(bounds.width).toBe(3);
    expect(bounds.height).toBe(3);
  });

  it('should handle empty cells', () => {
    const bounds = getBounds([]);
    expect(bounds.width).toBe(0);
    expect(bounds.height).toBe(0);
  });
});

describe('normalizeCells', () => {
  it('should normalize cells to start at origin', () => {
    const cells = [
      { row: 2, col: 3 },
      { row: 3, col: 4 },
    ];
    const normalized = normalizeCells(cells);
    expect(normalized).toContainEqual({ row: 0, col: 0 });
    expect(normalized).toContainEqual({ row: 1, col: 1 });
  });
});

describe('sortCells', () => {
  it('should sort cells top-to-bottom, left-to-right', () => {
    const cells = [
      { row: 1, col: 1 },
      { row: 0, col: 1 },
      { row: 0, col: 0 },
    ];
    const sorted = sortCells(cells);
    expect(sorted[0]).toEqual({ row: 0, col: 0 });
    expect(sorted[1]).toEqual({ row: 0, col: 1 });
    expect(sorted[2]).toEqual({ row: 1, col: 1 });
  });
});

describe('rotateCells', () => {
  it('should rotate 90 degrees clockwise', () => {
    // L-shape: (0,0), (1,0), (1,1)
    const cells = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    const rotated = normalizeCells(rotateCells90CW(cells));
    // After 90 CW rotation, should be mirrored/rotated shape
    expect(rotated).toHaveLength(3);
  });

  it('should rotate 180 degrees', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ];
    const rotated = normalizeCells(rotateCells(cells, 180));
    // Same shape after 180 for a horizontal domino
    expect(rotated).toContainEqual({ row: 0, col: 0 });
    expect(rotated).toContainEqual({ row: 0, col: 1 });
  });

  it('should return same cells for 0 rotation', () => {
    const cells = [{ row: 0, col: 0 }];
    expect(rotateCells(cells, 0)).toEqual(cells);
  });
});

describe('flipCellsHorizontal', () => {
  it('should flip cells horizontally', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
    ];
    const flipped = normalizeCells(flipCellsHorizontal(cells));
    // L becomes J after horizontal flip
    expect(flipped).toHaveLength(3);
  });
});

describe('transformCells', () => {
  it('should apply combined rotation and flip', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ];
    const transformed = transformCells(cells, 90, true);
    expect(transformed).toHaveLength(2);
  });
});

describe('rotatePolyomino', () => {
  it('should rotate a polyomino 90 degrees', () => {
    const iPiece = TETROMINOES.find((t) => t.id === 'I')!;
    const rotated = rotatePolyomino(iPiece);
    // I-piece rotates from horizontal to vertical
    const bounds = getBounds(rotated.cells);
    expect(bounds.height).toBe(4);
    expect(bounds.width).toBe(1);
  });
});

describe('flipPolyomino', () => {
  it('should flip a polyomino', () => {
    const lPiece = TETROMINOES.find((t) => t.id === 'L')!;
    const flipped = flipPolyomino(lPiece);
    expect(flipped.cells).toHaveLength(4);
  });
});

describe('getAllTransformations', () => {
  it('should return 1 transformation for O-tetromino (4-fold symmetry)', () => {
    const oPiece = TETROMINOES.find((t) => t.id === 'O')!;
    const transformations = getAllTransformations(oPiece);
    expect(transformations).toHaveLength(1);
  });

  it('should return 2 transformations for I-tetromino', () => {
    const iPiece = TETROMINOES.find((t) => t.id === 'I')!;
    const transformations = getAllTransformations(iPiece);
    expect(transformations).toHaveLength(2);
  });

  it('should return 4 transformations for T-tetromino', () => {
    const tPiece = TETROMINOES.find((t) => t.id === 'T')!;
    const transformations = getAllTransformations(tPiece);
    expect(transformations).toHaveLength(4);
  });

  it('should return 8 transformations for L-tetromino (chiral)', () => {
    // L-tetromino is chiral (not symmetric under reflection)
    // So it has 4 rotations × 2 (with/without flip) = 8 unique orientations
    const lPiece = TETROMINOES.find((t) => t.id === 'L')!;
    const transformations = getAllTransformations(lPiece);
    expect(transformations).toHaveLength(8);
  });
});

describe('getSymmetryCount', () => {
  it('should return correct symmetry count', () => {
    const oPiece = TETROMINOES.find((t) => t.id === 'O')!;
    expect(getSymmetryCount(oPiece)).toBe(1);

    const iPiece = TETROMINOES.find((t) => t.id === 'I')!;
    expect(getSymmetryCount(iPiece)).toBe(2);
  });
});

describe('cellsToKey', () => {
  it('should create consistent key for same cells', () => {
    const cells1 = [
      { row: 1, col: 0 },
      { row: 0, col: 0 },
    ];
    const cells2 = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
    ];
    expect(cellsToKey(cells1)).toBe(cellsToKey(cells2));
  });
});

describe('areCellsEquivalent', () => {
  it('should detect equivalent cells', () => {
    const cells1 = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ];
    const cells2 = [
      { row: 5, col: 5 },
      { row: 5, col: 6 },
    ];
    expect(areCellsEquivalent(cells1, cells2)).toBe(true);
  });
});

describe('arePolyominoesEquivalent', () => {
  it('should detect equivalent polyominoes', () => {
    const tPiece = TETROMINOES.find((t) => t.id === 'T')!;
    const rotatedT = rotatePolyomino(tPiece);
    expect(arePolyominoesEquivalent(tPiece, rotatedT)).toBe(true);
  });

  it('should detect non-equivalent polyominoes', () => {
    const tPiece = TETROMINOES.find((t) => t.id === 'T')!;
    const oPiece = TETROMINOES.find((t) => t.id === 'O')!;
    expect(arePolyominoesEquivalent(tPiece, oPiece)).toBe(false);
  });
});

describe('translateCells', () => {
  it('should translate cells by offset', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ];
    const translated = translateCells(cells, { row: 2, col: 3 });
    expect(translated).toContainEqual({ row: 2, col: 3 });
    expect(translated).toContainEqual({ row: 2, col: 4 });
  });
});

describe('getAbsoluteCells', () => {
  it('should get absolute cell positions with transformation', () => {
    const iPiece = TETROMINOES.find((t) => t.id === 'I')!;
    const cells = getAbsoluteCells(iPiece, { row: 2, col: 3 }, 0, false);
    expect(cells[0].row).toBe(2);
    expect(cells[0].col).toBe(3);
  });
});

describe('areCellsInBounds', () => {
  it('should return true for cells within bounds', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 4, col: 4 },
    ];
    expect(areCellsInBounds(cells, 5, 5)).toBe(true);
  });

  it('should return false for cells outside bounds', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 5, col: 0 },
    ];
    expect(areCellsInBounds(cells, 5, 5)).toBe(false);
  });
});

describe('createGrid', () => {
  it('should create an empty grid', () => {
    const grid = createGrid(4, 5);
    expect(grid.rows).toBe(4);
    expect(grid.cols).toBe(5);
    expect(grid.cells).toHaveLength(4);
    expect(grid.cells[0]).toHaveLength(5);
    expect(grid.cells[0][0].occupied).toBe(false);
  });
});

describe('isCellOccupied', () => {
  it('should return false for empty cell', () => {
    const grid = createGrid(3, 3);
    expect(isCellOccupied(grid, 1, 1)).toBe(false);
  });

  it('should return true for out of bounds', () => {
    const grid = createGrid(3, 3);
    expect(isCellOccupied(grid, -1, 0)).toBe(true);
    expect(isCellOccupied(grid, 3, 0)).toBe(true);
  });
});

describe('isValidPlacement', () => {
  it('should return true for valid placement', () => {
    const grid = createGrid(10, 10);
    const tPiece = TETROMINOES.find((t) => t.id === 'T')!;
    expect(isValidPlacement(grid, tPiece, { row: 0, col: 0 })).toBe(true);
  });

  it('should return false for out of bounds placement', () => {
    const grid = createGrid(3, 3);
    const iPiece = TETROMINOES.find((t) => t.id === 'I')!;
    // I-piece is 4 wide, won't fit in 3x3
    expect(isValidPlacement(grid, iPiece, { row: 0, col: 0 })).toBe(false);
  });

  it('should return false for overlapping placement', () => {
    const tPiece = TETROMINOES.find((t) => t.id === 'T')!;
    let grid = createGrid(10, 10);
    grid = placePolyomino(grid, tPiece, { row: 0, col: 0 });

    expect(isValidPlacement(grid, tPiece, { row: 0, col: 0 })).toBe(false);
  });
});

describe('placePolyomino', () => {
  it('should place a polyomino on the grid', () => {
    const grid = createGrid(10, 10);
    const tPiece = TETROMINOES.find((t) => t.id === 'T')!;
    const newGrid = placePolyomino(grid, tPiece, { row: 0, col: 0 });

    expect(newGrid.cells[0][0].occupied).toBe(true);
    expect(newGrid.cells[0][0].polyominoId).toBe('T');
    expect(newGrid.cells[1][1].occupied).toBe(true);
  });

  it('should not modify original grid', () => {
    const grid = createGrid(10, 10);
    const tPiece = TETROMINOES.find((t) => t.id === 'T')!;
    placePolyomino(grid, tPiece, { row: 0, col: 0 });

    expect(grid.cells[0][0].occupied).toBe(false);
  });
});

describe('removePolyomino', () => {
  it('should remove a polyomino from the grid', () => {
    const tPiece = TETROMINOES.find((t) => t.id === 'T')!;
    let grid = createGrid(10, 10);
    grid = placePolyomino(grid, tPiece, { row: 0, col: 0 });
    grid = removePolyomino(grid, 'T');

    expect(grid.cells[0][0].occupied).toBe(false);
    expect(grid.cells[1][1].occupied).toBe(false);
  });
});

describe('getAllValidPositions', () => {
  it('should find all valid positions', () => {
    const grid = createGrid(4, 4);
    const domino = getPolyominoesByOrder(2)[0];
    const positions = getAllValidPositions(grid, domino, 0, false);
    // Horizontal domino (1x2) can be placed in 4 rows × 3 columns = 12 positions
    expect(positions).toHaveLength(12);
  });
});

describe('getPlacementCells', () => {
  it('should return cells for a placement', () => {
    const tPiece = TETROMINOES.find((t) => t.id === 'T')!;
    const placement = {
      polyomino: tPiece,
      position: { row: 2, col: 3 },
      rotation: 0 as const,
      flipped: false,
    };
    const cells = getPlacementCells(placement);
    expect(cells).toHaveLength(4);
    expect(cells[0].row).toBeGreaterThanOrEqual(2);
    expect(cells[0].col).toBeGreaterThanOrEqual(3);
  });
});

describe('doPlacementsOverlap', () => {
  it('should detect overlapping placements', () => {
    const tPiece = TETROMINOES.find((t) => t.id === 'T')!;
    const p1 = {
      polyomino: tPiece,
      position: { row: 0, col: 0 },
      rotation: 0 as const,
      flipped: false,
    };
    const p2 = {
      polyomino: tPiece,
      position: { row: 0, col: 1 },
      rotation: 0 as const,
      flipped: false,
    };
    expect(doPlacementsOverlap(p1, p2)).toBe(true);
  });

  it('should detect non-overlapping placements', () => {
    const tPiece = TETROMINOES.find((t) => t.id === 'T')!;
    const p1 = {
      polyomino: tPiece,
      position: { row: 0, col: 0 },
      rotation: 0 as const,
      flipped: false,
    };
    const p2 = {
      polyomino: tPiece,
      position: { row: 5, col: 5 },
      rotation: 0 as const,
      flipped: false,
    };
    expect(doPlacementsOverlap(p1, p2)).toBe(false);
  });
});

describe('getAdjacentCells', () => {
  it('should find adjacent cells (4-connected)', () => {
    const grid = createGrid(10, 10);
    const monomino = getPolyominoesByOrder(1)[0];
    const placement = {
      polyomino: monomino,
      position: { row: 5, col: 5 },
      rotation: 0 as const,
      flipped: false,
    };
    const adjacent = getAdjacentCells(grid, placement, false);
    expect(adjacent).toHaveLength(4); // N, S, E, W
  });

  it('should find adjacent cells (8-connected)', () => {
    const grid = createGrid(10, 10);
    const monomino = getPolyominoesByOrder(1)[0];
    const placement = {
      polyomino: monomino,
      position: { row: 5, col: 5 },
      rotation: 0 as const,
      flipped: false,
    };
    const adjacent = getAdjacentCells(grid, placement, true);
    expect(adjacent).toHaveLength(8); // N, NE, E, SE, S, SW, W, NW
  });
});
