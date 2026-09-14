/**
 * Wave 38 — filterPieces + findMatchingAttribute stress on SOME_SUM deck.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  filterPieces,
  findMatchingAttribute,
  matchesPiece,
} from '../../src/core/attributes/logic';
import {
  SOME_SUM_ATTRIBUTES,
  generateAllPieces,
} from '../../src/core/attributes/types';

describe('Wave 38 attr-filter — SOME_SUM deck stress', () => {
  const deck = generateAllPieces(SOME_SUM_ATTRIBUTES);

  it('deck is 54 and filter by parity splits 27/27', () => {
    expect(deck).toHaveLength(54);
    const odd = filterPieces(deck, {
      attribute: 'parity',
      operator: 'equals',
      value: 'odd',
    });
    const even = filterPieces(deck, {
      attribute: 'parity',
      operator: 'equals',
      value: 'even',
    });
    expect(odd).toHaveLength(27);
    expect(even).toHaveLength(27);
  });

  it('compound size×parity filters are consistent with matchesPiece', () => {
    const cond = {
      operator: 'and' as const,
      conditions: [
        { attribute: 'size', operator: 'equals' as const, value: 'large' },
        { attribute: 'parity', operator: 'equals' as const, value: 'even' },
      ],
    };
    const filtered = filterPieces(deck, cond);
    expect(filtered.length).toBeGreaterThan(0);
    for (const p of deck) {
      expect(matchesPiece(p, cond)).toBe(filtered.some((f) => f.id === p.id));
    }
    expect(filtered.every((p) => p.attributes.size === 'large')).toBe(true);
    expect(filtered.every((p) => p.attributes.parity === 'even')).toBe(true);
  });

  it('findMatchingAttribute on value yields other pieces with same number', () => {
    const target = deck.find((p) => p.attributes.value === 5)!;
    const hits = findMatchingAttribute(target, deck, 'value');
    expect(hits.every((p) => p.attributes.value === 5)).toBe(true);
    expect(hits.every((p) => p.id !== target.id)).toBe(true);
    // 5 appears once per parity×size = 2*3 = 6 total → 5 others
    expect(hits).toHaveLength(5);
  });
});
