/**
 * Wave 28 — polyomino rotateCells / next|prevRotation exact cell matrices.
 * Distinct from #144 frac arithmetic, #143 graph algorithms, thin polyomino.test smoke.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  rotateCells,
  normalizeCells,
  sortCells,
  cellsToKey,
  nextRotation,
  prevRotation,
  rotateCells90CW,
  type Cell,
  type Rotation,
} from '../../src/core/polyomino';

function key(cells: Cell[]): string {
  return cellsToKey(cells);
}

function L(): Cell[] {
  return [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
  ];
}

describe('Wave 28 poly-rotate — exact 90/180/270 cell maps', () => {
  it('maps L tromino through full CW cycle with known coordinates', () => {
    const base = L();
    const r90 = normalizeCells(rotateCells(base, 90));
    expect(sortCells(r90)).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ]);

    const r180 = normalizeCells(rotateCells(base, 180));
    expect(sortCells(r180)).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
    ]);

    const r270 = normalizeCells(rotateCells(base, 270));
    expect(sortCells(r270)).toEqual([
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ]);
  });

  it('rotateCells90CW matches rotateCells(..., 90)', () => {
    const cells = L();
    expect(key(rotateCells90CW(cells))).toBe(key(rotateCells(cells, 90)));
  });

  it('four successive 90° rotations restore the original normalized shape', () => {
    let cells = L();
    const start = key(cells);
    for (let i = 0; i < 4; i++) {
      cells = normalizeCells(rotateCells(cells, 90));
    }
    expect(key(cells)).toBe(start);
  });

  it('180 twice is identity; 90 then 270 is identity', () => {
    const base = L();
    expect(key(normalizeCells(rotateCells(rotateCells(base, 180), 180)))).toBe(
      key(base)
    );
    expect(key(normalizeCells(rotateCells(rotateCells(base, 90), 270)))).toBe(
      key(base)
    );
  });

  it('rotation 0 returns a shallow copy, not the same array', () => {
    const cells = L();
    const copied = rotateCells(cells, 0);
    expect(copied).toEqual(cells);
    expect(copied).not.toBe(cells);
    expect(copied[0]).not.toBe(cells[0]);
  });
});

describe('Wave 28 poly-rotate — I / O / T known orientations', () => {
  it('I bar becomes column after 90 and back after 180', () => {
    const I: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ];
    const vertical = normalizeCells(rotateCells(I, 90));
    expect(sortCells(vertical)).toEqual([
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 3, col: 0 },
    ]);
    expect(key(normalizeCells(rotateCells(I, 180)))).toBe(key(I));
    expect(key(normalizeCells(rotateCells(I, 270)))).toBe(key(vertical));
  });

  it('O square is invariant under all rotations after normalize', () => {
    const O: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    for (const rot of [0, 90, 180, 270] as Rotation[]) {
      expect(key(normalizeCells(rotateCells(O, rot)))).toBe(key(O));
    }
  });

  it('T stem points north after 180 from flat-top south stem', () => {
    const T: Cell[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 1 },
    ];
    const flipped = normalizeCells(rotateCells(T, 180));
    expect(sortCells(flipped)).toEqual([
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ]);
  });
});

describe('Wave 28 poly-rotate — nextRotation / prevRotation cycles', () => {
  it('nextRotation walks 0→90→180→270→0', () => {
    let r: Rotation = 0;
    const seen: Rotation[] = [r];
    for (let i = 0; i < 4; i++) {
      r = nextRotation(r);
      seen.push(r);
    }
    expect(seen).toEqual([0, 90, 180, 270, 0]);
  });

  it('prevRotation walks 0→270→180→90→0', () => {
    let r: Rotation = 0;
    const seen: Rotation[] = [r];
    for (let i = 0; i < 4; i++) {
      r = prevRotation(r);
      seen.push(r);
    }
    expect(seen).toEqual([0, 270, 180, 90, 0]);
  });

  it('next then prev is identity for every rotation', () => {
    for (const r of [0, 90, 180, 270] as Rotation[]) {
      expect(prevRotation(nextRotation(r))).toBe(r);
      expect(nextRotation(prevRotation(r))).toBe(r);
    }
  });
});
