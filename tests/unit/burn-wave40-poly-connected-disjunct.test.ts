/**
 * Wave 40 — areCellsConnected disjunct leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { areCellsConnected } from '../../src/core/polyomino';

describe('Wave 40 poly — connected / disjunct', () => {
  it('empty and singleton are connected', () => {
    expect(areCellsConnected([])).toBe(true);
    expect(areCellsConnected([{ row: 0, col: 0 }])).toBe(true);
  });

  it('ortho neighbors connected; diagonal-only not', () => {
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ])
    ).toBe(true);
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 1, col: 1 },
      ])
    ).toBe(false);
  });
});
