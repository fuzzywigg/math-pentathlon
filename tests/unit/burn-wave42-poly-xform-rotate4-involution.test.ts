/**
 * Wave 42 — rotate 0/90/180/270 involution leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  rotateCells,
  nextRotation,
  prevRotation,
  cellsToKey,
  normalizeCells,
  TETROMINOES,
  type Rotation,
} from '../../src/core/polyomino';

const ROTS: Rotation[] = [0, 90, 180, 270];

describe('Wave 42 poly-xform — rotate4 involution', () => {
  it('four 90° rotates return to original key', () => {
    const L = TETROMINOES.find((s) => s.id === 'L')!;
    let cells = L.cells;
    for (let i = 0; i < 4; i++) cells = rotateCells(cells, 90);
    expect(cellsToKey(normalizeCells(cells))).toBe(cellsToKey(L.cells));
  });

  it('180 twice is identity', () => {
    const T = TETROMINOES.find((s) => s.id === 'T')!;
    const twice = rotateCells(rotateCells(T.cells, 180), 180);
    expect(cellsToKey(twice)).toBe(cellsToKey(T.cells));
  });

  it('nextRotation cycles all four', () => {
    let r: Rotation = 0;
    const seen: Rotation[] = [];
    for (let i = 0; i < 4; i++) {
      seen.push(r);
      r = nextRotation(r);
    }
    expect(seen).toEqual(ROTS);
    expect(r).toBe(0);
  });

  it('prevRotation is inverse of nextRotation', () => {
    for (const r of ROTS) {
      expect(prevRotation(nextRotation(r))).toBe(r);
    }
  });

  it('rotate 0 clones without mutating', () => {
    const I = TETROMINOES.find((s) => s.id === 'I')!;
    const cloned = rotateCells(I.cells, 0);
    expect(cloned).not.toBe(I.cells);
    expect(cloned).toEqual(I.cells);
  });
});
