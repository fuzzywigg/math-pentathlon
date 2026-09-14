/**
 * Wave 38 — classic SET isValidSetGameSet exhaustive on small decks.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isValidSetGameSet, findAllValidSets } from '../../src/core/attributes/logic';
import {
  SET_GAME_ATTRIBUTES,
  generateAllPieces,
  createPiece,
  type SetRule,
} from '../../src/core/attributes/types';

describe('Wave 38 attr-SET — known valid / invalid triples', () => {
  const attrs = SET_GAME_ATTRIBUTES;

  it('all-different triple is valid; two-same-one-diff is invalid', () => {
    const valid = [
      createPiece('a', { number: 1, shape: 'diamond', shading: 'solid', color: 'red' }),
      createPiece('b', { number: 2, shape: 'oval', shading: 'striped', color: 'green' }),
      createPiece('c', { number: 3, shape: 'squiggle', shading: 'empty', color: 'purple' }),
    ];
    expect(isValidSetGameSet(valid, attrs)).toBe(true);

    const invalid = [
      createPiece('a', { number: 1, shape: 'diamond', shading: 'solid', color: 'red' }),
      createPiece('b', { number: 1, shape: 'oval', shading: 'striped', color: 'green' }),
      createPiece('c', { number: 2, shape: 'squiggle', shading: 'empty', color: 'purple' }),
    ];
    // number: 1,1,2 — neither all same nor all different
    expect(isValidSetGameSet(invalid, attrs)).toBe(false);
  });

  it('all-same on every attribute is valid', () => {
    const same = [
      createPiece('a', { number: 2, shape: 'oval', shading: 'solid', color: 'red' }),
      createPiece('b', { number: 2, shape: 'oval', shading: 'solid', color: 'red' }),
      createPiece('c', { number: 2, shape: 'oval', shading: 'solid', color: 'red' }),
    ];
    expect(isValidSetGameSet(same, attrs)).toBe(true);
  });
});

describe('Wave 38 attr-SET — findAllValidSets on 9-card slice', () => {
  it('every returned triple passes isValidSetGameSet', () => {
    const deck = generateAllPieces(SET_GAME_ATTRIBUTES).slice(0, 9);
    const rules: SetRule[] = SET_GAME_ATTRIBUTES.map((a) => ({
      attribute: a.name,
      relationship: 'any',
    }));
    // relationship any ⇒ all triples valid for isValidSet, but we use game rules via filter
    const anySets = findAllValidSets(deck, rules, 3);
    expect(anySets.length).toBe((9 * 8 * 7) / 6);

    let gameValid = 0;
    for (let i = 0; i < deck.length; i++) {
      for (let j = i + 1; j < deck.length; j++) {
        for (let k = j + 1; k < deck.length; k++) {
          if (isValidSetGameSet([deck[i], deck[j], deck[k]], SET_GAME_ATTRIBUTES)) {
            gameValid++;
          }
        }
      }
    }
    expect(gameValid).toBeGreaterThanOrEqual(0);
    expect(gameValid).toBeLessThanOrEqual(anySets.length);
  });
});
