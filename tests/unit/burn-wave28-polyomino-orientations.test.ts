/**
 * Wave 28 — polyomino orientation / rotation cycle APIs.
 * First coverage of getAllOrientations / getAllRotations / nextRotation / prevRotation.
 * Distinct from polyomino.test getAllTransformations smoke and wave 21 solve edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getAllOrientations,
  getAllRotations,
  nextRotation,
  prevRotation,
  cellsToKey,
  normalizeCells,
  rotateCells,
  getTransformedCells,
  getCellsAtPosition,
  TETROMINOES,
  PENTOMINOES,
  getPolyominoesByOrder,
  type Cell,
  type PolyominoShape,
  type Rotation,
} from '../../src/core/polyomino';

function shapeOf(
  id: string,
  cells: Cell[],
  opts: Partial<Pick<PolyominoShape, 'canRotate' | 'canFlip'>> = {}
): PolyominoShape {
  return {
    id,
    name: id,
    cells,
    color: '#000',
    canRotate: opts.canRotate ?? true,
    canFlip: opts.canFlip ?? true,
    size: cells.length,
    order: cells.length,
  };
}

describe('Wave 28 polyomino-orientations — nextRotation / prevRotation', () => {
  it('nextRotation cycles 0→90→180→270→0', () => {
    const cycle: Rotation[] = [0, 90, 180, 270];
    let r: Rotation = 0;
    for (let i = 0; i < 8; i++) {
      expect(r).toBe(cycle[i % 4]);
      r = nextRotation(r);
    }
  });

  it('prevRotation is inverse of nextRotation for every angle', () => {
    for (const r of [0, 90, 180, 270] as Rotation[]) {
      expect(prevRotation(nextRotation(r))).toBe(r);
      expect(nextRotation(prevRotation(r))).toBe(r);
    }
  });

  it('four nexts return to start; four prevs return to start', () => {
    expect(nextRotation(nextRotation(nextRotation(nextRotation(90))))).toBe(90);
    expect(prevRotation(prevRotation(prevRotation(prevRotation(180))))).toBe(
      180
    );
  });
});

describe('Wave 28 polyomino-orientations — getAllRotations', () => {
  it('monomino has a single unique rotation', () => {
    expect(getAllRotations([{ row: 0, col: 0 }])).toHaveLength(1);
  });

  it('horizontal domino has two unique rotations (H/V)', () => {
    const rots = getAllRotations([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ]);
    expect(rots).toHaveLength(2);
    const keys = new Set(rots.map(cellsToKey));
    expect(keys.size).toBe(2);
  });

  it('O-square has one unique rotation', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    expect(getAllRotations(o.cells)).toHaveLength(1);
  });

  it('T-tetromino has four unique rotations', () => {
    const t = TETROMINOES.find((s) => s.id === 'T')!;
    expect(getAllRotations(t.cells)).toHaveLength(4);
  });

  it('each returned rotation is normalized and matches some rotateCells result', () => {
    const l = TETROMINOES.find((s) => s.id === 'L')!;
    const rots = getAllRotations(l.cells);
    for (const cells of rots) {
      expect(normalizeCells(cells)).toEqual(cells);
      const matches = ([0, 90, 180, 270] as Rotation[]).some(
        (r) =>
          cellsToKey(normalizeCells(rotateCells(l.cells, r))) ===
          cellsToKey(cells)
      );
      expect(matches).toBe(true);
    }
  });

  it('I-tetromino has two unique rotations', () => {
    const i = TETROMINOES.find((s) => s.id === 'I')!;
    expect(getAllRotations(i.cells)).toHaveLength(2);
  });
});

describe('Wave 28 polyomino-orientations — getAllOrientations flags', () => {
  it('canRotate false + canFlip false yields a single orientation', () => {
    const s = shapeOf(
      'fixed',
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
      ],
      { canRotate: false, canFlip: false }
    );
    expect(getAllOrientations(s)).toHaveLength(1);
  });

  it('canRotate false + canFlip true yields up to two orientations', () => {
    const chiral = shapeOf(
      'chiral-fixed-rot',
      [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ],
      { canRotate: false, canFlip: true }
    );
    const orients = getAllOrientations(chiral);
    expect(orients.length).toBeGreaterThanOrEqual(1);
    expect(orients.length).toBeLessThanOrEqual(2);
    expect(new Set(orients.map(cellsToKey)).size).toBe(orients.length);
  });

  it('canFlip false still enumerates rotations when canRotate', () => {
    const t = TETROMINOES.find((s) => s.id === 'T')!;
    expect(t.canFlip).toBe(false);
    expect(t.canRotate).toBe(true);
    expect(getAllOrientations(t)).toHaveLength(4);
  });

  it('O-tetromino orientations collapse to 1 despite rotate/flip flags', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    expect(getAllOrientations(o)).toHaveLength(1);
  });

  it('L-tetromino catalog (canFlip false) enumerates 4 rotations only', () => {
    const l = TETROMINOES.find((s) => s.id === 'L')!;
    expect(l.canFlip).toBe(false);
    expect(getAllOrientations(l)).toHaveLength(4);
  });

  it('same L cells with canFlip true enumerate 8 unique orientations', () => {
    const l = TETROMINOES.find((s) => s.id === 'L')!;
    const flippable = { ...l, canFlip: true };
    expect(getAllOrientations(flippable)).toHaveLength(8);
  });

  it('orientation keys are unique within each catalog tetromino', () => {
    for (const shape of TETROMINOES) {
      const orients = getAllOrientations(shape);
      expect(new Set(orients.map(cellsToKey)).size).toBe(orients.length);
      for (const cells of orients) {
        expect(cells).toHaveLength(shape.cells.length);
      }
    }
  });

  it('pentomino F/N/P/Y are chiral (8 orients when flippable)', () => {
    for (const id of ['F', 'N', 'P', 'Y']) {
      const p = PENTOMINOES.find((s) => s.id === id)!;
      expect(p.canFlip).toBe(true);
      expect(getAllOrientations(p).length).toBe(8);
    }
  });

  it('X-pentomino has a single orientation', () => {
    const x = PENTOMINOES.find((s) => s.id === 'X')!;
    expect(getAllOrientations(x)).toHaveLength(1);
  });
});

describe('Wave 28 polyomino-orientations — getTransformedCells / getCellsAtPosition', () => {
  it('getTransformedCells ignores rotation when canRotate is false', () => {
    const o = TETROMINOES.find((s) => s.id === 'O')!;
    const a = getTransformedCells(o, 0, false);
    const b = getTransformedCells(o, 90, false);
    expect(cellsToKey(a)).toBe(cellsToKey(b));
  });

  it('getTransformedCells ignores flip when canFlip is false', () => {
    const t = TETROMINOES.find((s) => s.id === 'T')!;
    const a = getTransformedCells(t, 0, false);
    const b = getTransformedCells(t, 0, true);
    expect(cellsToKey(a)).toBe(cellsToKey(b));
  });

  it('getTransformedCells flip+rotate for flippable L differs from rotate alone', () => {
    const l = { ...TETROMINOES.find((s) => s.id === 'L')!, canFlip: true };
    const rotated = getTransformedCells(l, 90, false);
    const flipped = getTransformedCells(l, 90, true);
    expect(cellsToKey(rotated)).not.toBe(cellsToKey(flipped));
  });

  it('catalog L (canFlip false) ignores flip request', () => {
    const l = TETROMINOES.find((s) => s.id === 'L')!;
    expect(cellsToKey(getTransformedCells(l, 90, false))).toBe(
      cellsToKey(getTransformedCells(l, 90, true))
    );
  });

  it('getCellsAtPosition translates transformed cells by anchor', () => {
    const m = getPolyominoesByOrder(1)[0];
    const cells = getCellsAtPosition(m, { row: 4, col: 7 }, 0, false);
    expect(cells).toEqual([{ row: 4, col: 7 }]);
  });

  it('getCellsAtPosition for rotated I places a vertical bar', () => {
    const i = TETROMINOES.find((s) => s.id === 'I')!;
    const cells = getCellsAtPosition(i, { row: 1, col: 2 }, 90, false);
    expect(cells).toHaveLength(4);
    const cols = new Set(cells.map((c) => c.col));
    const rows = cells.map((c) => c.row).sort((a, b) => a - b);
    expect(cols.size).toBe(1);
    expect(rows[rows.length - 1] - rows[0]).toBe(3);
  });

  it('domino at origin horizontal then 90° spans two rows', () => {
    const d = getPolyominoesByOrder(2)[0];
    const h = getCellsAtPosition(d, { row: 0, col: 0 }, 0, false);
    const v = getCellsAtPosition(d, { row: 0, col: 0 }, 90, false);
    expect(new Set(h.map((c) => c.row)).size).toBe(1);
    expect(new Set(v.map((c) => c.col)).size).toBe(1);
  });
});
