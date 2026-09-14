/**
 * Overnight TOKENMAXX — groupBy / sort / unique mixed-type leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  groupByAttribute,
  getUniqueValues,
  sortByAttribute,
  filterPieces,
  getMatchDetails,
  countMatchingAttributes,
  getMatchingAttributes,
  getDifferingAttributes,
  findMatchingAttribute,
} from '../../src/core/attributes/logic';
import type { AttributePiece } from '../../src/core/attributes/types';

const pieces: AttributePiece[] = [
  { id: 'a', attributes: { color: 'red', rank: 2 } },
  { id: 'b', attributes: { color: 'blue', rank: 1 } },
  { id: 'c', attributes: { color: 'red', rank: 3 } },
  { id: 'd', attributes: { color: 'green', rank: 2 } },
];

describe('Overnight attr — group/sort/match helpers', () => {
  it('groupByAttribute and unique values', () => {
    const groups = groupByAttribute(pieces, 'color');
    expect(groups.get('red')).toHaveLength(2);
    expect(getUniqueValues(pieces, 'color').sort()).toEqual(['blue', 'green', 'red']);
  });

  it('sort ascending/descending by rank', () => {
    expect(sortByAttribute(pieces, 'rank').map((p) => p.id)).toEqual(['b', 'a', 'd', 'c']);
    expect(sortByAttribute(pieces, 'rank', true).map((p) => p.id)).toEqual(['c', 'a', 'd', 'b']);
  });

  it('filter / match details / attribute diffs', () => {
    const reds = filterPieces(pieces, { attribute: 'color', operator: 'equals', value: 'red' });
    expect(reds.map((p) => p.id).sort()).toEqual(['a', 'c']);
    const details = getMatchDetails(pieces[0], [
      { attribute: 'color', operator: 'equals', value: 'red' },
      { attribute: 'rank', operator: 'equals', value: 9 },
    ]);
    expect(details.matches).toBe(false);
    expect(details.matchedAttributes).toEqual(['color']);
    expect(countMatchingAttributes(pieces[0], pieces[2])).toBe(1);
    expect(getMatchingAttributes(pieces[0], pieces[3])).toEqual(['rank']);
    expect(getDifferingAttributes(pieces[0], pieces[1]).sort()).toEqual(['color', 'rank']);
    expect(findMatchingAttribute(pieces[0], pieces, 'color').map((p) => p.id)).toEqual(['c']);
  });
});
