/**
 * Wave 40 — groupByAttribute / filterPieces / findMatchingAttribute leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  groupByAttribute,
  filterPieces,
  findMatchingAttribute,
} from '../../src/core/attributes';

describe('Wave 40 attr — group / filter / match', () => {
  const pieces = [
    { id: 'a', attributes: { color: 'red', shape: 'circle' } },
    { id: 'b', attributes: { color: 'red', shape: 'square' } },
    { id: 'c', attributes: { color: 'blue', shape: 'circle' } },
  ];

  it('groupByAttribute buckets by color', () => {
    const groups = groupByAttribute(pieces, 'color');
    expect(groups.get('red')).toHaveLength(2);
    expect(groups.get('blue')).toHaveLength(1);
  });

  it('filterPieces keeps matching condition', () => {
    const filtered = filterPieces(pieces, {
      attribute: 'shape',
      operator: 'equals',
      value: 'circle',
    });
    expect(filtered.map((p) => p.id).sort()).toEqual(['a', 'c']);
  });

  it('findMatchingAttribute misses when attr absent', () => {
    expect(
      findMatchingAttribute(pieces[0], pieces, 'missing')
    ).toEqual([]);
    expect(findMatchingAttribute(pieces[0], pieces, 'color').map((p) => p.id)).toEqual([
      'b',
    ]);
  });
});
