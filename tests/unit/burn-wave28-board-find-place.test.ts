/**
 * Wave 28 — findValidPlacements / canPlaceShape / findPlacementAtCell matrix.
 * Distinct from board-validate undo burn and wave 21 solve smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  createBoardWithBlockedCells,
  placePolyomino,
  findValidPlacements,
  canPlaceShape,
  findPlacementAtCell,
  getPlacementCells,
  SIMPLE_SHAPES,
  TETROMINOES,
  getPolyominoById,
  type Rotation,
} from '../../src/core/polyomino';

function mono() {
  return SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
}

describe('Wave 28 board-find — findValidPlacements counts', () => {
  it('monomino lists every empty cell', () => {
    const b = createBoard(2, 3);
    expect(findValidPlacements(b, mono())).toHaveLength(6);
  });

  it('O-tetromino positions on 4×4 empty board', () => {
    const b = createBoard(4, 4);
    const O = getPolyominoById('O')!;
    // anchors where 2×2 fits: 3×3 = 9
    expect(findValidPlacements(b, O)).toHaveLength(9);
  });

  it('rotation opens placements that flat orientation cannot use', () => {
    const b = createBoard(4, 2);
    const I = getPolyominoById('I')!;
    expect(findValidPlacements(b, I, 0)).toEqual([]);
    const vertical = findValidPlacements(b, I, 90);
    expect(vertical).toHaveLength(2);
    // normalize -0 from arithmetic to +0 for stable assertions
    expect(vertical.map((p) => ({ row: p.row || 0, col: p.col || 0 }))).toEqual(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ]
    );
  });

  it('blocked cells remove colliding anchors', () => {
    const b = createBoardWithBlockedCells(3, 3, [{ row: 1, col: 1 }]);
    const positions = findValidPlacements(b, mono());
    expect(positions).toHaveLength(8);
    expect(positions.some((p) => p.row === 1 && p.col === 1)).toBe(false);
  });

  it('after placing T, remaining monomino slots shrink by 4', () => {
    let b = createBoard(4, 4);
    const T = TETROMINOES.find((s) => s.id === 'T')!;
    expect(findValidPlacements(b, mono())).toHaveLength(16);
    b = placePolyomino(b, T, { row: 0, col: 0 });
    expect(findValidPlacements(b, mono())).toHaveLength(12);
  });
});

describe('Wave 28 board-find — canPlaceShape orientation search', () => {
  it('returns true when any orientation fits a narrow corridor', () => {
    const b = createBoard(4, 1);
    const I = getPolyominoById('I')!;
    expect(canPlaceShape(b, I)).toBe(true); // vertical
    expect(canPlaceShape(b, getPolyominoById('O')!)).toBe(false);
  });

  it('false on fully blocked / filled boards', () => {
    const filled = createBoardWithBlockedCells(2, 2, [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ]);
    expect(canPlaceShape(filled, mono())).toBe(false);
  });

  it('respects canRotate=false — O only tries identity', () => {
    const b = createBoard(2, 2);
    const O = getPolyominoById('O')!;
    expect(O.canRotate).toBe(false);
    expect(canPlaceShape(b, O)).toBe(true);
    expect(canPlaceShape(createBoard(1, 4), O)).toBe(false);
  });

  it('flippable chiral piece can still place when only mirrored fit works', () => {
    // 2×2 board with one blocked corner — L tromino orientations differ
    const b = createBoardWithBlockedCells(2, 2, [{ row: 0, col: 1 }]);
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    expect(canPlaceShape(b, L)).toBe(true);
  });
});

describe('Wave 28 board-find — findPlacementAtCell + legacy getPlacementCells', () => {
  it('resolves which placement covers a cell', () => {
    let b = createBoard(4, 4);
    const d = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    const T = TETROMINOES.find((s) => s.id === 'T')!;
    b = placePolyomino(b, d, { row: 0, col: 0 }, 0, false, 1);
    b = placePolyomino(b, T, { row: 2, col: 0 }, 0, false, 2);

    const hitDomino = findPlacementAtCell(
      b,
      { row: 0, col: 1 },
      SIMPLE_SHAPES.concat(TETROMINOES)
    );
    expect(hitDomino?.shapeId).toBe('domino');
    expect(hitDomino?.playerId).toBe(1);

    const hitT = findPlacementAtCell(
      b,
      { row: 2, col: 1 },
      SIMPLE_SHAPES.concat(TETROMINOES)
    );
    expect(hitT?.shapeId).toBe('T');

    expect(
      findPlacementAtCell(
        b,
        { row: 3, col: 3 },
        SIMPLE_SHAPES.concat(TETROMINOES)
      )
    ).toBeUndefined();
  });

  it('legacy getPlacementCells returns [] for unknown shapeId', () => {
    expect(
      getPlacementCells(
        {
          shapeId: 'nope',
          position: { row: 0, col: 0 },
          rotation: 0,
          flipped: false,
        },
        SIMPLE_SHAPES
      )
    ).toEqual([]);
  });

  it('legacy getPlacementCells mirrors rotate/flip for known shapes', () => {
    const L = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;
    for (const rot of [0, 90, 180, 270] as Rotation[]) {
      const cells = getPlacementCells(
        {
          shapeId: L.id,
          position: { row: 2, col: 2 },
          rotation: rot,
          flipped: true,
        },
        SIMPLE_SHAPES
      );
      expect(cells).toHaveLength(3);
      expect(cells.every((c) => c.row >= 2 && c.col >= 2)).toBe(true);
    }
  });
});
