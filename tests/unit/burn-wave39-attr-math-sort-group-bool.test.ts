/**
 * Wave 39 — sortByAttribute / groupByAttribute bool + missing attr leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createMathPiece,
  sortByAttribute,
  groupByAttribute,
  getUniqueValues,
} from '../../src/core/attributes/logic';
import { createPiece } from '../../src/core/attributes/types';

describe('Wave 39 attr — math sort/group bool', () => {
  it('createMathPiece ladder sorts by number ascending/descending', () => {
    const pieces = [7, 2, 11, 4].map(createMathPiece);
    const asc = sortByAttribute(pieces, 'number');
    expect(asc.map((p) => p.attributes.number)).toEqual([2, 4, 7, 11]);
    const desc = sortByAttribute(pieces, 'number', true);
    expect(desc.map((p) => p.attributes.number)).toEqual([11, 7, 4, 2]);
  });

  it('groupByAttribute on boolean isPrime buckets', () => {
    const pieces = [2, 3, 4, 9].map(createMathPiece);
    const groups = groupByAttribute(pieces, 'isPrime');
    expect(groups.get(true)?.map((p) => p.attributes.number).sort()).toEqual([
      2, 3,
    ]);
    expect(groups.get(false)?.map((p) => p.attributes.number).sort()).toEqual([
      4, 9,
    ]);
  });

  it('missing attribute groups under undefined key', () => {
    const pieces = [
      createPiece('a', { flag: true }),
      createPiece('b', {}),
      createPiece('c', { flag: false }),
    ];
    const groups = groupByAttribute(pieces, 'flag');
    expect(groups.has(undefined)).toBe(true);
    expect(groups.get(undefined)).toHaveLength(1);
    expect(getUniqueValues(pieces, 'flag')).toEqual(
      expect.arrayContaining([true, false, undefined])
    );
  });
});
