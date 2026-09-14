/**
 * Wave 40 — findAlignmentsForValue dedupe leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findAlignmentsForValue,
  createArrayGetter,
} from '../../src/core/alignment/grid-alignment';
import { DIRECTIONS } from '../../src/core/alignment/types';

describe('Wave 40 align core — for-value dedupe', () => {
  it('row of three yields one horizontal alignment', () => {
    const board = [
      ['A', 'A', 'A'],
      [null, null, null],
      [null, null, null],
    ];
    const alignments = findAlignmentsForValue('A', createArrayGetter(board), {
      rows: 3,
      cols: 3,
      targetLength: 3,
      directions: [DIRECTIONS.HORIZONTAL],
    });
    expect(alignments).toHaveLength(1);
    expect(alignments[0].length).toBe(3);
    expect(alignments[0].value).toBe('A');
  });
});
