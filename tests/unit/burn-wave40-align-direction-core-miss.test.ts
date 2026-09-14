/**
 * Wave 40 — grid-alignment findAlignmentInDirection miss leftovers after #176.
 * Tests-only. Imports core (not compat).
 */
import { describe, it, expect } from 'vitest';

import {
  findAlignmentInDirection,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import { DIRECTIONS } from '../../src/core/alignment/types';

describe('Wave 40 align core — direction miss', () => {
  const board = [
    [null, 'X', 'X'],
    ['O', 'O', null],
    [null, null, null],
  ];
  const get = createArrayGetter(board);
  const config = { rows: 3, cols: 3, targetLength: 3 };

  it('empty start returns null', () => {
    expect(
      findAlignmentInDirection(0, 0, DIRECTIONS.HORIZONTAL, get, config)
    ).toBeNull();
  });

  it('short line under targetLength returns null', () => {
    expect(
      findAlignmentInDirection(0, 1, DIRECTIONS.HORIZONTAL, get, config)
    ).toBeNull();
  });
});
