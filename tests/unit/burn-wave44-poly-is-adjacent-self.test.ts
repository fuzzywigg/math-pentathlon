/**
 * Wave 44 — isAdjacent self/disjoint leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isAdjacent } from '../../src/core/polyomino';

describe('Wave 44 poly — isAdjacent', () => {
  it('cell not adjacent to itself; ortho yes; diagonal no', () => {
    const origin = { row: 1, col: 1 };
    expect(isAdjacent(origin, [origin])).toBe(false);
    expect(isAdjacent({ row: 1, col: 2 }, [origin])).toBe(true);
    expect(isAdjacent({ row: 2, col: 2 }, [origin])).toBe(false);
  });
});
