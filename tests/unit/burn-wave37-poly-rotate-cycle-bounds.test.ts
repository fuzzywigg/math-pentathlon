/**
 * Wave 37 — transform rotation cycle / next-prev / bounds stress.
 * Distinct from wave 28 rotate-matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  TETROMINOES,
  PENTOMINOES,
  SIMPLE_SHAPES,
  nextRotation,
  prevRotation,
  rotateCells,
  normalizeCells,
  cellsToKey,
  getBoundingBox,
  getBounds,
  transformCells,
  getAllRotations,
  areCellsEquivalent,
  type Rotation,
} from '../../src/core/polyomino';

const ROTATIONS: Rotation[] = [0, 90, 180, 270];

describe('Wave 37 poly-rotate — next/prev cycle group', () => {
  it('nextRotation cycles 0→90→180→270→0', () => {
    let r: Rotation = 0;
    const seen: Rotation[] = [];
    for (let i = 0; i < 4; i++) {
      seen.push(r);
      r = nextRotation(r);
    }
    expect(seen).toEqual(ROTATIONS);
    expect(r).toBe(0);
  });

  it('prevRotation is inverse of nextRotation', () => {
    for (const r of ROTATIONS) {
      expect(prevRotation(nextRotation(r))).toBe(r);
      expect(nextRotation(prevRotation(r))).toBe(r);
    }
  });

  it('four nexts equal identity; two nexts equal 180', () => {
    expect(nextRotation(nextRotation(0))).toBe(180);
    expect(
      nextRotation(nextRotation(nextRotation(nextRotation(90))))
    ).toBe(90);
  });
});

describe('Wave 37 poly-rotate — 360° cell identity', () => {
  it('rotateCells 4×90 returns original key for every tetromino/pentomino', () => {
    for (const shape of [...TETROMINOES, ...PENTOMINOES, ...SIMPLE_SHAPES]) {
      let cells = shape.cells;
      for (let i = 0; i < 4; i++) cells = rotateCells(cells, 90);
      expect(cellsToKey(normalizeCells(cells))).toBe(
        cellsToKey(normalizeCells(shape.cells))
      );
    }
  });

  it('getAllRotations ⊆ transformCells rotation set', () => {
    for (const shape of TETROMINOES) {
      const all = getAllRotations(shape.cells);
      const manual = new Set(
        ROTATIONS.map((r) => cellsToKey(transformCells(shape.cells, r, false)))
      );
      for (const rot of all) {
        expect(manual.has(cellsToKey(rot))).toBe(true);
      }
    }
  });

  it('O tetromino all rotations are equivalent', () => {
    const O = TETROMINOES.find((s) => s.id === 'O')!;
    for (const r of ROTATIONS) {
      expect(
        areCellsEquivalent(O.cells, transformCells(O.cells, r, false))
      ).toBe(true);
    }
    expect(getAllRotations(O.cells)).toHaveLength(1);
  });
});

describe('Wave 37 poly-rotate — bounding box invariants', () => {
  it('getBoundingBox and getBounds agree on min/size', () => {
    for (const shape of [...TETROMINOES, ...PENTOMINOES]) {
      const box = getBoundingBox(shape.cells);
      const b = getBounds(shape.cells);
      expect(box.minRow).toBe(b.minRow);
      expect(box.minCol).toBe(b.minCol);
      expect(box.width).toBe(b.width);
      expect(box.height).toBe(b.height);
    }
  });

  it('I tetromino swaps width/height under 90°', () => {
    const I = TETROMINOES.find((s) => s.id === 'I')!;
    const base = getBounds(normalizeCells(I.cells));
    const turned = getBounds(
      normalizeCells(transformCells(I.cells, 90, false))
    );
    expect(base.width).toBe(turned.height);
    expect(base.height).toBe(turned.width);
  });
});
