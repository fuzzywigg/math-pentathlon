/**
 * Overnight HEAVY leftover after #234 — getLinePositions length 1 vs immediate OOB null.
 * Distinct from burn-wave39-align-line-oob-matrix / check-line-empty. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getLinePositions } from '../../src/core/alignment';

describe('Wave 52 core align — line len1 oob', () => {
  it('length 1 at origin → singleton; length 3 near edge → null', () => {
    expect(
      getLinePositions({ row: 0, col: 0 }, 'horizontal', 1, { rows: 3, cols: 3 })
    ).toEqual([{ row: 0, col: 0 }]);
    expect(
      getLinePositions({ row: 0, col: 2 }, 'horizontal', 3, { rows: 3, cols: 3 })
    ).toBeNull();
  });
});
