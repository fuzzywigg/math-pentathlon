/**
 * Overnight HEAVY leftover after #234 — rotateCells default branch copies cells unchanged.
 * Distinct from burn-wave28-poly-rotate-matrix / burn-wave40-poly-rotation-wrap. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { rotateCells, type Rotation } from '../../src/core/polyomino';

describe('Wave 52 core poly — rotate default passthrough', () => {
  it('garbage rotation angle returns deep copy of cells', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    const out = rotateCells(cells, 45 as Rotation);
    expect(out).toEqual(cells);
    expect(out).not.toBe(cells);
    expect(out[0]).not.toBe(cells[0]);
  });
});
