/**
 * Wave 44 overnight HEAVY — board-a11y buildCellAriaLabel matrix.
 */
import { describe, it, expect } from 'vitest';
import { buildCellAriaLabel } from '../../src/ui/board-a11y';

describe('Wave 44 UI — a11y labels', () => {
  it('empty / owner-piece / extras / valid flags', () => {
    expect(buildCellAriaLabel({ coord: 'A1', empty: true })).toBe('A1, empty');
    expect(buildCellAriaLabel({ coord: 'E2', owner: 'Blue', piece: 'King' })).toBe('E2, Blue King');
    expect(
      buildCellAriaLabel({
        coord: '3',
        empty: true,
        extras: ['prime'],
        validMove: true,
        validPlacement: true,
      })
    ).toBe('3, empty, prime, valid move, valid placement');
    expect(buildCellAriaLabel({ coord: 'B2', extras: ['', 'hot'] })).toBe('B2, hot');
  });
});
