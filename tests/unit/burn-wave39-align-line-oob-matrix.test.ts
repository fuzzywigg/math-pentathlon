/**
 * Wave 39 — getLinePositions OOB / diagonal-up leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getLinePositions } from '../../src/core/alignment';

describe('Wave 39 align — line positions OOB', () => {
  const dims = { rows: 4, cols: 4 };

  it('horizontal in-bounds returns consecutive cells', () => {
    const line = getLinePositions(
      { row: 1, col: 0 },
      'horizontal',
      3,
      dims
    );
    expect(line).toEqual([
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ]);
  });

  it('horizontal overrun returns null', () => {
    expect(
      getLinePositions({ row: 0, col: 2 }, 'horizontal', 3, dims)
    ).toBeNull();
  });

  it('diagonal-up near top returns null mid-line', () => {
    expect(
      getLinePositions({ row: 0, col: 0 }, 'diagonal-up', 2, dims)
    ).toBeNull();
  });

  it('diagonal-down fits from corner', () => {
    const line = getLinePositions(
      { row: 0, col: 0 },
      'diagonal-down',
      3,
      dims
    );
    expect(line).toEqual([
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 2 },
    ]);
  });

  it('vertical overrun returns null', () => {
    expect(
      getLinePositions({ row: 3, col: 1 }, 'vertical', 2, dims)
    ).toBeNull();
  });
});
