/**
 * Wave 38 — count/get matching + differing attributes pairwise matrix.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  countMatchingAttributes,
  getMatchingAttributes,
  getDifferingAttributes,
  findMatchingAttribute,
} from '../../src/core/attributes/logic';
import { createPiece, BASIC_ATTRIBUTES, generateAllPieces } from '../../src/core/attributes/types';

describe('Wave 38 attr-diff — pairwise BASIC deck sample', () => {
  const deck = generateAllPieces(BASIC_ATTRIBUTES); // 27 pieces
  it('deck size is 3^3=27', () => {
    expect(deck).toHaveLength(27);
  });

  it('self-match counts all keys; differing empty', () => {
    for (const p of deck) {
      expect(countMatchingAttributes(p, p)).toBe(3);
      expect(getMatchingAttributes(p, p).sort()).toEqual([
        'color',
        'shape',
        'size',
      ]);
      expect(getDifferingAttributes(p, p)).toEqual([]);
    }
  });

  it('pairwise match+differ partition the left keys', () => {
    // sample every 3rd pair for density without O(n^2) explosion in runtime
    for (let i = 0; i < deck.length; i += 3) {
      for (let j = 0; j < deck.length; j += 3) {
        const a = deck[i];
        const b = deck[j];
        const match = getMatchingAttributes(a, b);
        const differ = getDifferingAttributes(a, b);
        expect(match.length + differ.length).toBe(3);
        expect(countMatchingAttributes(a, b)).toBe(match.length);
        for (const k of match) expect(a.attributes[k]).toBe(b.attributes[k]);
        for (const k of differ) expect(a.attributes[k]).not.toBe(b.attributes[k]);
      }
    }
  });
});

describe('Wave 38 attr-findMatching — same attribute cohort', () => {
  const bag = [
    createPiece('a', { color: 'red', size: 1 }),
    createPiece('b', { color: 'red', size: 2 }),
    createPiece('c', { color: 'blue', size: 1 }),
    createPiece('d', { color: 'red', size: 3 }),
  ];

  it('excludes self and requires exact attribute value', () => {
    const hits = findMatchingAttribute(bag[0], bag, 'color');
    expect(hits.map((p) => p.id).sort()).toEqual(['b', 'd']);
    expect(findMatchingAttribute(bag[0], bag, 'size').map((p) => p.id)).toEqual(
      ['c']
    );
    expect(findMatchingAttribute(bag[0], bag, 'missing')).toEqual([]);
  });
});
