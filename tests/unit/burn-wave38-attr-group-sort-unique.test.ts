/**
 * Wave 38 — groupByAttribute / sortByAttribute / getUniqueValues matrices.
 * Beyond wave 29 match-filter smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  groupByAttribute,
  sortByAttribute,
  getUniqueValues,
  createMathPiece,
} from '../../src/core/attributes';
import { createPiece } from '../../src/core/attributes/types';

describe('Wave 38 attr-group — math pieces by parity / divisibility', () => {
  const pieces = Array.from({ length: 40 }, (_, i) => createMathPiece(i + 1));

  it('groupBy isEven partitions 1..40 into 20/20', () => {
    const g = groupByAttribute(pieces, 'isEven');
    expect(g.get(true)!.length).toBe(20);
    expect(g.get(false)!.length).toBe(20);
    expect(g.size).toBe(2);
  });

  it('groupBy divisibleBy5 yields five buckets sized by residue', () => {
    const g = groupByAttribute(pieces, 'divisibleBy5');
    expect(g.get(true)!.every((p) => (p.attributes.number as number) % 5 === 0)).toBe(
      true
    );
    expect(g.get(true)!.length).toBe(8);
    expect(g.get(false)!.length).toBe(32);
  });

  it('missing attribute collapses to undefined key', () => {
    const bag = [
      createPiece('a', { color: 'red' }),
      createPiece('b', { color: 'blue' }),
      createPiece('c', {}),
    ];
    const g = groupByAttribute(bag, 'color');
    expect(g.get('red')!.map((p) => p.id)).toEqual(['a']);
    expect(g.get(undefined)!.map((p) => p.id)).toEqual(['c']);
  });
});

describe('Wave 38 attr-sort — numeric + string + descending', () => {
  it('sortBy number ascending and descending', () => {
    const shuffled = [7, 2, 9, 1, 5].map((n) => createMathPiece(n));
    const asc = sortByAttribute(shuffled, 'number');
    expect(asc.map((p) => p.attributes.number)).toEqual([1, 2, 5, 7, 9]);
    const desc = sortByAttribute(shuffled, 'number', true);
    expect(desc.map((p) => p.attributes.number)).toEqual([9, 7, 5, 2, 1]);
    // immutability
    expect(shuffled.map((p) => p.attributes.number)).toEqual([7, 2, 9, 1, 5]);
  });

  it('sortBy string uses localeCompare', () => {
    const bag = [
      createPiece('1', { shape: 'triangle' }),
      createPiece('2', { shape: 'circle' }),
      createPiece('3', { shape: 'square' }),
    ];
    const sorted = sortByAttribute(bag, 'shape');
    expect(sorted.map((p) => p.attributes.shape)).toEqual([
      'circle',
      'square',
      'triangle',
    ]);
  });
});

describe('Wave 38 attr-unique — value sets', () => {
  it('unique digitSum values for 1..30 match Set size', () => {
    const pieces = Array.from({ length: 30 }, (_, i) => createMathPiece(i + 1));
    const uniq = getUniqueValues(pieces, 'digitSum');
    const expected = new Set(pieces.map((p) => p.attributes.digitSum));
    expect(uniq.length).toBe(expected.size);
    for (const v of uniq) expect(expected.has(v)).toBe(true);
  });
});
