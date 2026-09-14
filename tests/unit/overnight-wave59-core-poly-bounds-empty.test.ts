/**
 * Overnight HEAVY leftover after #280 — empty getBounds / getBoundingBox.
 * Distinct from wave57 empty COM origin leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getBounds, getBoundingBox } from '../../src/core/polyomino';

describe('Wave 59 core poly — bounds empty', () => {
  it('empty cell lists return zero-box sentinels', () => {
    expect(getBounds([])).toEqual({
      minRow: 0,
      maxRow: 0,
      minCol: 0,
      maxCol: 0,
      width: 0,
      height: 0,
    });
    expect(getBoundingBox([])).toEqual({
      width: 0,
      height: 0,
      minRow: 0,
      minCol: 0,
    });
  });
});
