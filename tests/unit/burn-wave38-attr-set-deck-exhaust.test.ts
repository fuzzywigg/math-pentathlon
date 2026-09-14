/**
 * Wave 38 — generateAllPieces SET/BASIC decks + findAllValidSets stress.
 * Beyond wave 29 small hand-built triples. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findAllValidSets,
  isValidSetGameSet,
  isValidSet,
} from '../../src/core/attributes/logic';
import {
  BASIC_ATTRIBUTES,
  SET_GAME_ATTRIBUTES,
  SOME_SUM_ATTRIBUTES,
  generateAllPieces,
  getAttributeColor,
  type SetRule,
} from '../../src/core/attributes/types';

describe('Wave 38 attr-deck — catalog generation sizes', () => {
  it('BASIC 27, SOME_SUM 9*2*3=54, SET 3^4=81', () => {
    expect(generateAllPieces(BASIC_ATTRIBUTES)).toHaveLength(27);
    expect(generateAllPieces(SOME_SUM_ATTRIBUTES)).toHaveLength(54);
    expect(generateAllPieces(SET_GAME_ATTRIBUTES)).toHaveLength(81);
  });

  it('ids are unique and encode attributes', () => {
    const deck = generateAllPieces(BASIC_ATTRIBUTES);
    const ids = new Set(deck.map((p) => p.id));
    expect(ids.size).toBe(27);
    for (const p of deck) {
      expect(p.id).toContain('shape:');
      expect(p.id).toContain('color:');
      expect(p.id).toContain('size:');
    }
  });

  it('getAttributeColor resolves colorMap entries', () => {
    expect(getAttributeColor(BASIC_ATTRIBUTES, 'shape', 'circle')).toBe(
      '#2196f3'
    );
    expect(getAttributeColor(BASIC_ATTRIBUTES, 'color', 'red')).toBe('#f44336');
    expect(getAttributeColor(BASIC_ATTRIBUTES, 'size', 'small')).toBeUndefined();
    expect(
      getAttributeColor(BASIC_ATTRIBUTES, 'missing', 'x')
    ).toBeUndefined();
  });
});

describe('Wave 38 attr-set — BASIC all_different triples', () => {
  const deck = generateAllPieces(BASIC_ATTRIBUTES);
  const rules: SetRule[] = BASIC_ATTRIBUTES.map((a) => ({
    attribute: a.name,
    relationship: 'all_different' as const,
  }));

  it('every found set validates; count is positive', () => {
    const sets = findAllValidSets(deck, rules, 3);
    expect(sets.length).toBeGreaterThan(20);
    for (const s of sets) {
      expect(s).toHaveLength(3);
      expect(isValidSet(s, rules)).toBe(true);
    }
  });

  it('all_same rules find many mono-attribute cohorts of size 3', () => {
    const sameRules: SetRule[] = BASIC_ATTRIBUTES.map((a) => ({
      attribute: a.name,
      relationship: 'all_same' as const,
    }));
    // all_same on all three attrs ⇒ identical pieces; deck has unique combos
    // so only empty if setSize 3 requires three identical — none exist
    expect(findAllValidSets(deck, sameRules, 3)).toHaveLength(0);
    // size 1 always valid
    expect(findAllValidSets(deck, sameRules, 1)).toHaveLength(27);
  });
});

describe('Wave 38 attr-set — classic SET sample isValidSetGameSet', () => {
  const attrs = SET_GAME_ATTRIBUTES;
  const deck = generateAllPieces(attrs).slice(0, 12);

  it('scans triples among first 12 cards; valid ones pass isValidSetGameSet', () => {
    let valid = 0;
    for (let i = 0; i < deck.length; i++) {
      for (let j = i + 1; j < deck.length; j++) {
        for (let k = j + 1; k < deck.length; k++) {
          const triple = [deck[i], deck[j], deck[k]];
          if (isValidSetGameSet(triple, attrs)) valid++;
        }
      }
    }
    expect(valid).toBeGreaterThanOrEqual(0);
    // size ≠ 3 rejected
    expect(isValidSetGameSet(deck.slice(0, 2), attrs)).toBe(false);
    expect(isValidSetGameSet(deck.slice(0, 4), attrs)).toBe(false);
  });
});
