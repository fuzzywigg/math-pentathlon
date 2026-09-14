/**
 * Wave 44 — Sum Dominoes createDominoSet leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createDominoSet, isDouble, getDominoPips } from '../../src/games/sum-dominoes/types';

describe('Wave 44 Sum Dominoes — domino set counts', () => {
  it('28 tiles with 7 doubles and unique ids', () => {
    const set = createDominoSet();
    expect(set).toHaveLength(28);
    expect(set.filter(isDouble)).toHaveLength(7);
    expect(new Set(set.map((d) => d.id)).size).toBe(28);
    expect(set.every((d) => getDominoPips(d) === d.face1 + d.face2)).toBe(true);
  });

  it('faces stay within 0..MAX', () => {
    const set = createDominoSet();
    expect(
      set.every(
        (d) =>
          d.face1 >= 0 &&
          d.face2 >= 0 &&
          d.face1 <= 6 &&
          d.face2 <= 6 &&
          d.face1 <= d.face2
      )
    ).toBe(true);
  });
});
