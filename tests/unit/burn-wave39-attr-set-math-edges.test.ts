/**
 * Wave 39 — attribute SET relationships + math predicate leftovers.
 * After wave 21/29; edges not burned in 36–38. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  checkSetRelationship,
  isValidSet,
  isValidSetGameSet,
  findAllValidSets,
  getDifferingAttributes,
  evaluateCompound,
  isPerfectSquare,
  getDigitSum,
  isPrime,
  getFactors,
  areCoprime,
  createMathPiece,
} from '../../src/core/attributes/logic';
import {
  createPiece,
  SET_GAME_ATTRIBUTES,
  type AttributePiece,
  type SetRule,
} from '../../src/core/attributes/types';

function trio(
  a: Record<string, string | number | boolean>,
  b: Record<string, string | number | boolean>,
  c: Record<string, string | number | boolean>
): AttributePiece[] {
  return [createPiece('a', a), createPiece('b', b), createPiece('c', c)];
}

describe('Wave 39 attr — set relationship edges', () => {
  it('empty pieces are vacuously all_same / all_different / any', () => {
    expect(checkSetRelationship([], 'color', 'all_same')).toBe(true);
    expect(checkSetRelationship([], 'color', 'all_different')).toBe(true);
    expect(checkSetRelationship([], 'color', 'any')).toBe(true);
  });

  it('all_same / all_different / any matrix on color', () => {
    const same = trio(
      { color: 'red', shape: 'oval' },
      { color: 'red', shape: 'diamond' },
      { color: 'red', shape: 'squiggle' }
    );
    const mixed = trio(
      { color: 'red', shape: 'oval' },
      { color: 'green', shape: 'oval' },
      { color: 'purple', shape: 'oval' }
    );
    const dup = trio(
      { color: 'red', shape: 'oval' },
      { color: 'red', shape: 'diamond' },
      { color: 'green', shape: 'squiggle' }
    );
    expect(checkSetRelationship(same, 'color', 'all_same')).toBe(true);
    expect(checkSetRelationship(same, 'color', 'all_different')).toBe(false);
    expect(checkSetRelationship(mixed, 'color', 'all_different')).toBe(true);
    expect(checkSetRelationship(dup, 'color', 'all_different')).toBe(false);
    expect(checkSetRelationship(dup, 'color', 'any')).toBe(true);
  });

  it('unknown relationship falls through to false', () => {
    const pieces = trio({ color: 'red' }, { color: 'red' }, { color: 'red' });
    expect(
      checkSetRelationship(
        pieces,
        'color',
        'not_a_real_rel' as 'all_same'
      )
    ).toBe(false);
  });

  it('isValidSetGameSet rejects wrong cardinality and partial mismatch', () => {
    const two = [createPiece('1', { color: 'red' }), createPiece('2', { color: 'green' })];
    expect(isValidSetGameSet(two, SET_GAME_ATTRIBUTES)).toBe(false);
    const bad = trio(
      { color: 'red', shape: 'oval', shading: 'solid', number: 1 },
      { color: 'red', shape: 'oval', shading: 'solid', number: 2 },
      { color: 'green', shape: 'diamond', shading: 'striped', number: 3 }
    );
    expect(isValidSetGameSet(bad, SET_GAME_ATTRIBUTES)).toBe(false);
  });

  it('findAllValidSets returns [] for empty catalog; isValidSet honors rules', () => {
    expect(findAllValidSets([], [], 3)).toEqual([]);
    const rules: SetRule[] = [
      { attribute: 'color', relationship: 'all_same' },
    ];
    const ok = trio({ color: 'blue' }, { color: 'blue' }, { color: 'blue' });
    const no = trio({ color: 'blue' }, { color: 'red' }, { color: 'blue' });
    expect(isValidSet(ok, rules)).toBe(true);
    expect(isValidSet(no, rules)).toBe(false);
  });
});

describe('Wave 39 attr — differ / compound / math leftovers', () => {
  it('getDifferingAttributes lists only mismatched keys', () => {
    const p1 = createPiece('p1', { color: 'red', shape: 'oval', fill: 'solid' });
    const p2 = createPiece('p2', { color: 'red', shape: 'diamond', fill: 'solid' });
    expect(getDifferingAttributes(p1, p2)).toEqual(['shape']);
    expect(getDifferingAttributes(p1, p1)).toEqual([]);
  });

  it('evaluateCompound AND/OR/XOR short edges', () => {
    const piece = createPiece('m', { color: 'red', count: 2 });
    const eqRed = {
      attribute: 'color',
      operator: 'equals' as const,
      value: 'red',
    };
    const eqBlue = {
      attribute: 'color',
      operator: 'equals' as const,
      value: 'blue',
    };
    expect(
      evaluateCompound(piece, { operator: 'and', conditions: [eqRed, eqBlue] })
    ).toBe(false);
    expect(
      evaluateCompound(piece, { operator: 'or', conditions: [eqRed, eqBlue] })
    ).toBe(true);
    expect(
      evaluateCompound(piece, { operator: 'xor', conditions: [eqRed, eqBlue] })
    ).toBe(true);
    expect(
      evaluateCompound(piece, { operator: 'xor', conditions: [eqRed, eqRed] })
    ).toBe(false);
  });

  it('isPerfectSquare / getDigitSum / isPrime / factors / coprime edges', () => {
    expect(isPerfectSquare(0)).toBe(true);
    expect(isPerfectSquare(1)).toBe(true);
    expect(isPerfectSquare(2)).toBe(false);
    expect(isPerfectSquare(-4)).toBe(false);
    expect(getDigitSum(0)).toBe(0);
    expect(getDigitSum(-99)).toBe(18);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(2)).toBe(true);
    expect(isPrime(9)).toBe(false);
    expect(getFactors(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(areCoprime(14, 15)).toBe(true);
    expect(areCoprime(14, 21)).toBe(false);
    const mp = createMathPiece(16);
    expect(mp.attributes.isSquare).toBe(true);
    expect(mp.attributes.digitSum).toBe(7);
  });
});
