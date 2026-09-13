/**
 * Wave 21 — core attribute logic (compare / SET / math pieces).
 * Distinct from #120 persist/serialize/lookup and #121 seat-handoff/history-DOM.
 * Powers Par-55-style attribute matching. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  compare,
  evaluateCondition,
  evaluateCompound,
  matchesPiece,
  getMatchDetails,
  filterPieces,
  findMatchingAttribute,
  countMatchingAttributes,
  getMatchingAttributes,
  getDifferingAttributes,
  checkSetRelationship,
  isValidSet,
  isValidSetGameSet,
  findAllValidSets,
  isPrime,
  isPerfectSquare,
  getDigitSum,
  getFactors,
  areCoprime,
  createMathPiece,
  groupByAttribute,
  getUniqueValues,
  sortByAttribute,
} from '../../src/core/attributes/logic';
import {
  SET_GAME_ATTRIBUTES,
  BASIC_ATTRIBUTES,
  SOME_SUM_ATTRIBUTES,
  createPiece,
  generateAllPieces,
  getAttributeColor,
  type AttributePiece,
  type SetRule,
} from '../../src/core/attributes/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 21 attribute-logic — compare / condition matrix', () => {
  it('covers equality and numeric operators including type guards', () => {
    expect(compare(3, 'equals', 3)).toBe(true);
    expect(compare('a', 'not_equals', 'b')).toBe(true);
    expect(compare(5, 'greater_than', 2)).toBe(true);
    expect(compare(2, 'less_than', 5)).toBe(true);
    expect(compare(5, 'greater_equal', 5)).toBe(true);
    expect(compare(2, 'less_equal', 5)).toBe(true);
    expect(compare('x', 'greater_than', 1)).toBe(false);
    expect(compare(1, 'less_than', 'y')).toBe(false);
    expect(compare(1, 'equals', 2)).toBe(false);
  });

  it('evaluateCondition / matchesPiece handle missing attrs and compounds', () => {
    const piece = createPiece('p1', { color: 'red', size: 2 });
    expect(
      evaluateCondition(piece, {
        attribute: 'color',
        operator: 'equals',
        value: 'red',
      })
    ).toBe(true);
    expect(
      evaluateCondition(piece, {
        attribute: 'missing',
        operator: 'equals',
        value: 1,
      })
    ).toBe(false);

    const andOk = evaluateCompound(piece, {
      operator: 'and',
      conditions: [
        { attribute: 'color', operator: 'equals', value: 'red' },
        { attribute: 'size', operator: 'greater_equal', value: 2 },
      ],
    });
    expect(andOk).toBe(true);

    const orXor = evaluateCompound(piece, {
      operator: 'xor',
      conditions: [
        { attribute: 'color', operator: 'equals', value: 'red' },
        { attribute: 'size', operator: 'equals', value: 99 },
      ],
    });
    expect(orXor).toBe(true);

    expect(
      evaluateCompound(piece, {
        operator: 'not',
        conditions: [
          { attribute: 'color', operator: 'equals', value: 'blue' },
        ],
      })
    ).toBe(true);

    expect(
      evaluateCompound(piece, {
        operator: 'or',
        conditions: [
          {
            operator: 'and',
            conditions: [
              { attribute: 'color', operator: 'equals', value: 'red' },
            ],
          },
          { attribute: 'size', operator: 'equals', value: 0 },
        ],
      })
    ).toBe(true);

    expect(
      matchesPiece(piece, {
        attribute: 'color',
        operator: 'not_equals',
        value: 'blue',
      })
    ).toBe(true);
  });
});

describe('Wave 21 attribute-logic — match details / filter / pairwise', () => {
  const red = createPiece('r', { color: 'red', size: 'small', shape: 'circle' });
  const blue = createPiece('b', {
    color: 'blue',
    size: 'small',
    shape: 'square',
  });
  const yellow = createPiece('y', {
    color: 'yellow',
    size: 'large',
    shape: 'circle',
  });

  it('getMatchDetails splits matched vs unmatched', () => {
    const details = getMatchDetails(red, [
      { attribute: 'color', operator: 'equals', value: 'red' },
      { attribute: 'size', operator: 'equals', value: 'large' },
    ]);
    expect(details.matches).toBe(false);
    expect(details.matchedAttributes).toEqual(['color']);
    expect(details.unmatchedAttributes).toEqual(['size']);
  });

  it('filter / findMatchingAttribute / pairwise helpers', () => {
    const pieces = [red, blue, yellow];
    const smalls = filterPieces(pieces, {
      attribute: 'size',
      operator: 'equals',
      value: 'small',
    });
    expect(smalls.map((p) => p.id).sort()).toEqual(['b', 'r']);

    expect(findMatchingAttribute(red, pieces, 'size').map((p) => p.id)).toEqual(
      ['b']
    );
    expect(findMatchingAttribute(red, pieces, 'missing')).toEqual([]);

    expect(countMatchingAttributes(red, blue)).toBe(1);
    expect(getMatchingAttributes(red, blue)).toEqual(['size']);
    expect(getDifferingAttributes(red, yellow).sort()).toEqual([
      'color',
      'size',
    ]);
  });
});

describe('Wave 21 attribute-logic — SET validation / findAllValidSets', () => {
  const rules: SetRule[] = SET_GAME_ATTRIBUTES.map((a) => ({
    attribute: a.name,
    relationship: 'all_different' as const,
  }));

  it('checkSetRelationship / isValidSet / isValidSetGameSet edges', () => {
    const a = createPiece('a', {
      number: 1,
      shape: 'diamond',
      shading: 'solid',
      color: 'red',
    });
    const b = createPiece('b', {
      number: 2,
      shape: 'oval',
      shading: 'striped',
      color: 'green',
    });
    const c = createPiece('c', {
      number: 3,
      shape: 'squiggle',
      shading: 'empty',
      color: 'purple',
    });
    expect(checkSetRelationship([a, b, c], 'color', 'all_different')).toBe(
      true
    );
    expect(checkSetRelationship([a, a, a], 'color', 'all_same')).toBe(true);
    expect(checkSetRelationship([], 'color', 'all_same')).toBe(true);
    expect(checkSetRelationship([a, b], 'color', 'any')).toBe(true);

    expect(isValidSet([a, b, c], rules)).toBe(true);
    expect(isValidSetGameSet([a, b, c], SET_GAME_ATTRIBUTES)).toBe(true);

    const bad = createPiece('bad', {
      number: 1,
      shape: 'diamond',
      shading: 'solid',
      color: 'red',
    });
    expect(isValidSetGameSet([a, b, bad], SET_GAME_ATTRIBUTES)).toBe(false);
    expect(isValidSetGameSet([a, b], SET_GAME_ATTRIBUTES)).toBe(false);
  });

  it('findAllValidSets enumerates all-same color triples under loose rules', () => {
    const pieces: AttributePiece[] = [
      createPiece('1', { color: 'red', size: 's' }),
      createPiece('2', { color: 'red', size: 'm' }),
      createPiece('3', { color: 'red', size: 'l' }),
      createPiece('4', { color: 'blue', size: 's' }),
    ];
    const found = findAllValidSets(
      pieces,
      [{ attribute: 'color', relationship: 'all_same' }],
      3
    );
    expect(found).toHaveLength(1);
    expect(found[0].map((p) => p.id).sort()).toEqual(['1', '2', '3']);
    expect(
      findAllValidSets(pieces, [{ attribute: 'color', relationship: 'all_same' }], 4)
    ).toEqual([]);
  });
});

describe('Wave 21 attribute-logic — math pieces / grouping / catalogs', () => {
  it('prime / square / digit / factor / coprime + createMathPiece', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(9)).toBe(false);
    expect(isPerfectSquare(16)).toBe(true);
    expect(isPerfectSquare(-1)).toBe(false);
    expect(getDigitSum(99)).toBe(18);
    expect(getDigitSum(-12)).toBe(3);
    expect(getFactors(6)).toEqual([1, 2, 3, 6]);
    expect(areCoprime(8, 15)).toBe(true);
    expect(areCoprime(8, 12)).toBe(false);

    const mp = createMathPiece(9);
    expect(mp.id).toBe('num-9');
    expect(mp.attributes.isPrime).toBe(false);
    expect(mp.attributes.isSquare).toBe(true);
    expect(mp.attributes.digitSum).toBe(9);
    expect(mp.attributes.isEven).toBe(false);
    expect(mp.attributes.divisibleBy3).toBe(true);
    expect(mp.attributes.factorCount).toBe(getFactors(9).length);
  });

  it('group / unique / sort + generateAllPieces catalogs', () => {
    const pieces = [
      createPiece('a', { size: 'small', color: 'red' }),
      createPiece('b', { size: 'large', color: 'red' }),
      createPiece('c', { size: 'small', color: 'blue' }),
    ];
    const groups = groupByAttribute(pieces, 'size');
    expect(groups.get('small')?.map((p) => p.id).sort()).toEqual(['a', 'c']);
    expect(getUniqueValues(pieces, 'color').sort()).toEqual(['blue', 'red']);

    const asc = sortByAttribute(
      [createPiece('z', { n: 3 }), createPiece('y', { n: 1 })],
      'n'
    );
    expect(asc.map((p) => p.id)).toEqual(['y', 'z']);
    const desc = sortByAttribute(
      [createPiece('z', { label: 'a' }), createPiece('y', { label: 'b' })],
      'label',
      true
    );
    expect(desc.map((p) => p.id)).toEqual(['y', 'z']);

    const basic = generateAllPieces(BASIC_ATTRIBUTES);
    expect(basic.length).toBe(3 * 3 * 3);
    expect(getAttributeColor(BASIC_ATTRIBUTES, 'color', 'red')).toBe('#f44336');
    expect(getAttributeColor(SOME_SUM_ATTRIBUTES, 'parity', 'odd')).toBe(
      '#2196f3'
    );
    expect(getAttributeColor(SET_GAME_ATTRIBUTES, 'missing', 'x')).toBeUndefined();
  });
});
