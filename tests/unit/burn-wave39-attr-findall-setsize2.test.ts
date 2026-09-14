/**
 * Wave 39 — findAllValidSets setSize 2 leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { findAllValidSets } from '../../src/core/attributes';
import type { AttributePiece, SetRule } from '../../src/core/attributes';

describe('Wave 39 attr — findAllValidSets setSize 2', () => {
  const pieces: AttributePiece[] = [
    { id: 'a', attributes: { color: 'red' } },
    { id: 'b', attributes: { color: 'red' } },
    { id: 'c', attributes: { color: 'blue' } },
  ];
  const sameColor: SetRule[] = [
    { attribute: 'color', relationship: 'all_same' },
  ];

  it('setSize 2 finds matching pairs', () => {
    const sets = findAllValidSets(pieces, sameColor, 2);
    expect(sets).toHaveLength(1);
    expect(sets[0].map((p) => p.id).sort()).toEqual(['a', 'b']);
  });

  it('default setSize 3 finds none for only three mismatched', () => {
    const sets = findAllValidSets(pieces, sameColor);
    expect(sets).toHaveLength(0);
  });

  it('empty pieces yields empty', () => {
    expect(findAllValidSets([], sameColor, 2)).toEqual([]);
  });
});
