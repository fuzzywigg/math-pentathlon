/**
 * Overnight HEAVY leftover after #250 — createAlignmentLine animate class +
 * hasAlignment requiredLength. Distinct from wave40 line without animate. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createAlignmentLine,
  hasAlignment,
  createArrayAccessor,
  getArrayDimensions,
  HIGHLIGHT_STYLES,
} from '../../src/core/alignment';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 core align — line animate + hasAlignment', () => {
  it('winning style adds animated; length-5 scan misses a 4-run', () => {
    const line = createAlignmentLine(
      {
        value: 'X',
        start: { row: 0, col: 0 },
        end: { row: 0, col: 3 },
        positions: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 },
        ],
        direction: { name: 'horizontal', dRow: 0, dCol: 1 },
        length: 4,
      },
      (r, c) => ({ x: c * 10, y: r * 10 }),
      HIGHLIGHT_STYLES.winning
    );
    expect(line.getAttribute('class')).toMatch(/animated/);

    const grid = [
      ['X', 'X', 'X', 'X'],
      [null, null, null, null],
    ];
    const dim = getArrayDimensions(grid);
    const get = createArrayAccessor(grid);
    expect(hasAlignment(dim, get, { requiredLength: 4 })).toBe(true);
    expect(hasAlignment(dim, get, { requiredLength: 5 })).toBe(false);
  });
});
