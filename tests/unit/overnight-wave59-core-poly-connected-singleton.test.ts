/**
 * Overnight HEAVY leftover after #280 — areCellsConnected empty/singleton/domino.
 * Distinct from wave57 corner-false connected. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { areCellsConnected } from '../../src/core/polyomino';

describe('Wave 59 core poly — connected singleton', () => {
  it('empty and singleton are connected; ortho domino too', () => {
    expect(areCellsConnected([])).toBe(true);
    expect(areCellsConnected([{ row: 0, col: 0 }])).toBe(true);
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ])
    ).toBe(true);
  });
});
