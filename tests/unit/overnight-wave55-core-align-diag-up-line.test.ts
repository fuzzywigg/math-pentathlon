/**
 * Overnight HEAVY leftover after #250 — getLinePositions diagonal-up in-bounds vs OOB.
 * Distinct from wave52 horizontal len1/oob. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getLinePositions } from '../../src/core/alignment';

describe('Wave 55 core align — diagonal-up line', () => {
  it('from bottom-left climbs; from top-left is immediately null', () => {
    const dim = { rows: 3, cols: 3 };
    expect(getLinePositions({ row: 2, col: 0 }, 'diagonal-up', 3, dim)).toEqual([
      { row: 2, col: 0 },
      { row: 1, col: 1 },
      { row: 0, col: 2 },
    ]);
    expect(getLinePositions({ row: 0, col: 0 }, 'diagonal-up', 2, dim)).toBeNull();
  });
});
