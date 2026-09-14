/**
 * Overnight HEAVY leftover after #250 — translateCells Cell vs numeric overload.
 * Distinct from wave52 rotate default passthrough. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { translateCells } from '../../src/core/polyomino';

describe('Wave 55 core poly — translate dual signature', () => {
  it('Cell offset and numeric pair agree; original cells are not mutated', () => {
    const cells = [
      { row: 1, col: 2 },
      { row: 3, col: 4 },
    ];
    const viaObj = translateCells(cells, { row: -1, col: 5 });
    const viaNums = translateCells(cells, -1, 5);
    expect(viaObj).toEqual(viaNums);
    expect(viaObj).toEqual([
      { row: 0, col: 7 },
      { row: 2, col: 9 },
    ]);
    expect(cells[0]).toEqual({ row: 1, col: 2 });
  });
});
