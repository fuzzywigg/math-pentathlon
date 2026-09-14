/**
 * Wave 29 — attribute match details / filter / pairwise edges.
 * Distinct from wave 21 pairwise smoke and forbidden fractions/expr/timer/dice/graph.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getMatchDetails,
  filterPieces,
  findMatchingAttribute,
  countMatchingAttributes,
  getMatchingAttributes,
  getDifferingAttributes,
  groupByAttribute,
  getUniqueValues,
  sortByAttribute,
} from '../../src/core/attributes/logic';
import { createPiece } from '../../src/core/attributes/types';

const a = createPiece('a', { color: 'red', size: 's', shape: 'circle', n: 1 });
const b = createPiece('b', { color: 'red', size: 'm', shape: 'square', n: 2 });
const c = createPiece('c', { color: 'blue', size: 's', shape: 'circle', n: 3 });
const d = createPiece('d', {
  color: 'blue',
  size: 'l',
  shape: 'triangle',
  n: 2,
});

describe('Wave 29 attr-match — getMatchDetails full / empty / partial', () => {
  it('all conditions match yields empty unmatched', () => {
    const details = getMatchDetails(a, [
      { attribute: 'color', operator: 'equals', value: 'red' },
      { attribute: 'shape', operator: 'equals', value: 'circle' },
      { attribute: 'n', operator: 'less_equal', value: 1 },
    ]);
    expect(details.matches).toBe(true);
    expect(details.matchedAttributes).toEqual(['color', 'shape', 'n']);
    expect(details.unmatchedAttributes).toEqual([]);
  });

  it('empty condition list is a vacuous match', () => {
    const details = getMatchDetails(a, []);
    expect(details.matches).toBe(true);
    expect(details.matchedAttributes).toEqual([]);
    expect(details.unmatchedAttributes).toEqual([]);
  });

  it('missing attribute lands in unmatched', () => {
    const details = getMatchDetails(a, [
      { attribute: 'color', operator: 'equals', value: 'red' },
      { attribute: 'weight', operator: 'equals', value: 1 },
    ]);
    expect(details.matches).toBe(false);
    expect(details.matchedAttributes).toEqual(['color']);
    expect(details.unmatchedAttributes).toEqual(['weight']);
  });
});

describe('Wave 29 attr-match — filterPieces compounds', () => {
  const pieces = [a, b, c, d];

  it('filters by single condition and by nested compound', () => {
    expect(
      filterPieces(pieces, {
        attribute: 'color',
        operator: 'equals',
        value: 'red',
      }).map((p) => p.id)
    ).toEqual(['a', 'b']);

    const redOrLarge = filterPieces(pieces, {
      operator: 'or',
      conditions: [
        { attribute: 'color', operator: 'equals', value: 'red' },
        { attribute: 'size', operator: 'equals', value: 'l' },
      ],
    });
    expect(redOrLarge.map((p) => p.id).sort()).toEqual(['a', 'b', 'd']);

    expect(
      filterPieces(pieces, {
        operator: 'and',
        conditions: [
          { attribute: 'shape', operator: 'equals', value: 'circle' },
          { attribute: 'color', operator: 'equals', value: 'green' },
        ],
      })
    ).toEqual([]);
  });

  it('empty input yields empty output', () => {
    expect(
      filterPieces([], {
        attribute: 'color',
        operator: 'equals',
        value: 'red',
      })
    ).toEqual([]);
  });
});

describe('Wave 29 attr-match — findMatchingAttribute / pairwise', () => {
  const pieces = [a, b, c, d];

  it('excludes self and requires shared attribute presence', () => {
    expect(findMatchingAttribute(a, pieces, 'color').map((p) => p.id)).toEqual([
      'b',
    ]);
    expect(findMatchingAttribute(a, pieces, 'size').map((p) => p.id)).toEqual([
      'c',
    ]);
    expect(findMatchingAttribute(a, pieces, 'missing')).toEqual([]);
    expect(findMatchingAttribute(a, [], 'color')).toEqual([]);
  });

  it('pairwise count / match / differ only walk left-hand keys', () => {
    const leftOnly = createPiece('left', { x: 1, y: 2 });
    const rightExtra = createPiece('right', { x: 1, y: 9, z: 3 });

    expect(countMatchingAttributes(leftOnly, rightExtra)).toBe(1);
    expect(getMatchingAttributes(leftOnly, rightExtra)).toEqual(['x']);
    expect(getDifferingAttributes(leftOnly, rightExtra)).toEqual(['y']);

    // Right-only keys are ignored when walking piece1 keys
    expect(getMatchingAttributes(rightExtra, leftOnly).sort()).toEqual(['x']);
    expect(getDifferingAttributes(rightExtra, leftOnly).sort()).toEqual([
      'y',
      'z',
    ]);
  });

  it('identical pieces match on every key; empty attrs count 0', () => {
    expect(countMatchingAttributes(a, a)).toBe(4);
    expect(getDifferingAttributes(a, a)).toEqual([]);
    const empty = createPiece('e', {});
    expect(countMatchingAttributes(empty, a)).toBe(0);
  });
});

describe('Wave 29 attr-match — group / unique / sort edges', () => {
  const pieces = [a, b, c, d];

  it('groupByAttribute collects undefined key for missing attrs', () => {
    const groups = groupByAttribute(pieces, 'color');
    expect(
      groups
        .get('red')
        ?.map((p) => p.id)
        .sort()
    ).toEqual(['a', 'b']);
    expect(
      groups
        .get('blue')
        ?.map((p) => p.id)
        .sort()
    ).toEqual(['c', 'd']);

    const missing = groupByAttribute(pieces, 'absent');
    expect(missing.size).toBe(1);
    expect([...missing.values()][0]).toHaveLength(4);
  });

  it('getUniqueValues preserves first-seen order and includes undefined', () => {
    expect(getUniqueValues(pieces, 'color')).toEqual(['red', 'blue']);
    expect(getUniqueValues(pieces, 'n')).toEqual([1, 2, 3]);
    expect(getUniqueValues([], 'color')).toEqual([]);
  });

  it('sortByAttribute is stable for ties and handles missing as string', () => {
    const tied = [
      createPiece('z', { n: 2, label: 'z' }),
      createPiece('y', { n: 2, label: 'y' }),
      createPiece('x', { n: 1, label: 'x' }),
    ];
    expect(sortByAttribute(tied, 'n').map((p) => p.id)).toEqual([
      'x',
      'z',
      'y',
    ]);
    expect(sortByAttribute(tied, 'n', true).map((p) => p.id)).toEqual([
      'z',
      'y',
      'x',
    ]);
    expect(sortByAttribute(tied, 'label').map((p) => p.id)).toEqual([
      'x',
      'y',
      'z',
    ]);

    // Does not mutate input
    const before = tied.map((p) => p.id);
    sortByAttribute(tied, 'n', true);
    expect(tied.map((p) => p.id)).toEqual(before);
  });
});
