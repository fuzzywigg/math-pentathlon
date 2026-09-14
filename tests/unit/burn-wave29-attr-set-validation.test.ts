/**
 * Wave 29 — SET relationship / isValidSet / findAllValidSets edges.
 * Distinct from wave 21 SET smoke (one all-different triple + one all-same find).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  checkSetRelationship,
  isValidSet,
  isValidSetGameSet,
  findAllValidSets,
} from '../../src/core/attributes/logic';
import {
  SET_GAME_ATTRIBUTES,
  createPiece,
  type AttributePiece,
  type SetRelationship,
  type SetRule,
} from '../../src/core/attributes/types';

function setCard(
  id: string,
  number: number,
  shape: string,
  shading: string,
  color: string
): AttributePiece {
  return createPiece(id, { number, shape, shading, color });
}

describe('Wave 29 attr-set — checkSetRelationship matrix', () => {
  const red1 = setCard('r1', 1, 'diamond', 'solid', 'red');
  const red2 = setCard('r2', 2, 'oval', 'striped', 'red');
  const blue1 = setCard('b1', 1, 'diamond', 'empty', 'blue');

  it('all_same requires identical values including undefined', () => {
    expect(checkSetRelationship([red1, red2], 'color', 'all_same')).toBe(true);
    expect(checkSetRelationship([red1, blue1], 'color', 'all_same')).toBe(
      false
    );
    expect(checkSetRelationship([red1], 'color', 'all_same')).toBe(true);
    expect(checkSetRelationship([], 'color', 'all_same')).toBe(true);

    // Missing attribute → all undefined → all_same
    expect(checkSetRelationship([red1, red2], 'weight', 'all_same')).toBe(true);
  });

  it('all_different rejects duplicates and undefined collisions', () => {
    expect(
      checkSetRelationship([red1, red2, blue1], 'color', 'all_different')
    ).toBe(false); // red, red, blue
    expect(
      checkSetRelationship(
        [red1, blue1, setCard('g1', 3, 'squiggle', 'solid', 'green')],
        'color',
        'all_different'
      )
    ).toBe(true);
    expect(checkSetRelationship([red1, red2], 'weight', 'all_different')).toBe(
      false
    ); // both undefined
  });

  it('any always true; unknown relationship false', () => {
    expect(checkSetRelationship([red1, blue1], 'color', 'any')).toBe(true);
    expect(checkSetRelationship([], 'color', 'any')).toBe(true);
    expect(
      checkSetRelationship([red1], 'color', 'all_similar' as SetRelationship)
    ).toBe(false);
  });
});

describe('Wave 29 attr-set — isValidSet / isValidSetGameSet', () => {
  const classicRules: SetRule[] = SET_GAME_ATTRIBUTES.map((a) => ({
    attribute: a.name,
    relationship: 'all_different' as const,
  }));

  const mixedRules: SetRule[] = [
    { attribute: 'color', relationship: 'all_same' },
    { attribute: 'number', relationship: 'all_different' },
    { attribute: 'shape', relationship: 'any' },
  ];

  it('isValidSet requires every rule; empty rules always pass', () => {
    const a = setCard('a', 1, 'diamond', 'solid', 'red');
    const b = setCard('b', 2, 'oval', 'striped', 'red');
    const c = setCard('c', 3, 'squiggle', 'empty', 'red');

    expect(isValidSet([a, b, c], mixedRules)).toBe(true);
    expect(isValidSet([a, b, c], classicRules)).toBe(false); // color all same
    expect(isValidSet([a, b, c], [])).toBe(true);
  });

  it('isValidSetGameSet requires length 3 and all-same-or-all-different', () => {
    const good = [
      setCard('a', 1, 'diamond', 'solid', 'red'),
      setCard('b', 2, 'oval', 'striped', 'green'),
      setCard('c', 3, 'squiggle', 'empty', 'purple'),
    ];
    expect(isValidSetGameSet(good, SET_GAME_ATTRIBUTES)).toBe(true);

    // Two same color, third different → invalid on color
    const badColor = [
      setCard('a', 1, 'diamond', 'solid', 'red'),
      setCard('b', 2, 'oval', 'striped', 'red'),
      setCard('c', 3, 'squiggle', 'empty', 'purple'),
    ];
    expect(isValidSetGameSet(badColor, SET_GAME_ATTRIBUTES)).toBe(false);

    // All same on every attr is valid
    const allSame = [
      setCard('a', 1, 'diamond', 'solid', 'red'),
      setCard('b', 1, 'diamond', 'solid', 'red'),
      setCard('c', 1, 'diamond', 'solid', 'red'),
    ];
    expect(isValidSetGameSet(allSame, SET_GAME_ATTRIBUTES)).toBe(true);

    expect(isValidSetGameSet(good.slice(0, 2), SET_GAME_ATTRIBUTES)).toBe(
      false
    );
    expect(
      isValidSetGameSet(
        [...good, setCard('d', 1, 'oval', 'solid', 'red')],
        SET_GAME_ATTRIBUTES
      )
    ).toBe(false);
  });
});

describe('Wave 29 attr-set — findAllValidSets enumeration', () => {
  it('setSize 2 enumerates pairs under all_same color', () => {
    const pieces = [
      createPiece('1', { color: 'red' }),
      createPiece('2', { color: 'red' }),
      createPiece('3', { color: 'blue' }),
      createPiece('4', { color: 'blue' }),
    ];
    const pairs = findAllValidSets(
      pieces,
      [{ attribute: 'color', relationship: 'all_same' }],
      2
    );
    const ids = pairs
      .map((set) =>
        set
          .map((p) => p.id)
          .sort()
          .join('+')
      )
      .sort();
    expect(ids).toEqual(['1+2', '3+4']);
  });

  it('empty deck / oversized setSize / empty rules edges', () => {
    expect(
      findAllValidSets(
        [],
        [{ attribute: 'color', relationship: 'all_same' }],
        3
      )
    ).toEqual([]);
    expect(
      findAllValidSets(
        [createPiece('1', { color: 'red' })],
        [{ attribute: 'color', relationship: 'all_same' }],
        3
      )
    ).toEqual([]);

    const three = [
      createPiece('a', { color: 'red', size: 1 }),
      createPiece('b', { color: 'blue', size: 2 }),
      createPiece('c', { color: 'green', size: 3 }),
    ];
    // Empty rules → every combination of setSize is valid
    expect(findAllValidSets(three, [], 3)).toHaveLength(1);
    expect(findAllValidSets(three, [], 2)).toHaveLength(3);
  });

  it('classic all-different SET finds the unique triple in a 4-card board', () => {
    const board = [
      setCard('a', 1, 'diamond', 'solid', 'red'),
      setCard('b', 2, 'oval', 'striped', 'green'),
      setCard('c', 3, 'squiggle', 'empty', 'purple'),
      setCard('d', 1, 'oval', 'solid', 'purple'), // spoiler
    ];
    const rules: SetRule[] = SET_GAME_ATTRIBUTES.map((attr) => ({
      attribute: attr.name,
      relationship: 'all_different' as const,
    }));
    const found = findAllValidSets(board, rules, 3);
    expect(found).toHaveLength(1);
    expect(found[0].map((p) => p.id).sort()).toEqual(['a', 'b', 'c']);
  });
});
