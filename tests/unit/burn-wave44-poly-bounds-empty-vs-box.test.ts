/**
 * Wave 44 — getBounds vs getBoundingBox empty leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getBounds, getBoundingBox } from '../../src/core/polyomino';

describe('Wave 44 poly — empty bounds dual', () => {
  it('empty cells yield zero dimensions on both helpers', () => {
    expect(getBoundingBox([])).toEqual({
      width: 0,
      height: 0,
      minRow: 0,
      minCol: 0,
    });
    expect(getBounds([])).toEqual({
      minRow: 0,
      maxRow: 0,
      minCol: 0,
      maxCol: 0,
      width: 0,
      height: 0,
    });
  });

  it('I tromino width 3 height 1', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ];
    expect(getBoundingBox(cells).width).toBe(3);
    expect(getBounds(cells).height).toBe(1);
  });
});
