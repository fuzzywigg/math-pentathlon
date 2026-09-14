/**
 * Wave 29 — attribute catalog helpers (MATHERACY / SOME_SUM / generate / colors).
 * Distinct from wave 21 (BASIC/SET/SOME_SUM smoke only; MATHERACY never exercised).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  MATHERACY_ATTRIBUTES,
  SOME_SUM_ATTRIBUTES,
  SET_GAME_ATTRIBUTES,
  BASIC_ATTRIBUTES,
  generateAllPieces,
  getAttributeColor,
  createPiece,
  type AttributeDefinition,
} from '../../src/core/attributes/types';
import { createMathPiece } from '../../src/core/attributes/logic';

describe('Wave 29 attr-catalog — MATHERACY_ATTRIBUTES shape', () => {
  it('exposes expected attribute names and boolean domains', () => {
    const names = MATHERACY_ATTRIBUTES.map((a) => a.name);
    expect(names).toEqual([
      'number',
      'isPrime',
      'isSquare',
      'digitSum',
      'divisibleBy3',
    ]);

    const numberAttr = MATHERACY_ATTRIBUTES.find((a) => a.name === 'number')!;
    expect(numberAttr.possibleValues).toHaveLength(100);
    expect(numberAttr.possibleValues[0]).toBe(1);
    expect(numberAttr.possibleValues[99]).toBe(100);

    const primeAttr = MATHERACY_ATTRIBUTES.find((a) => a.name === 'isPrime')!;
    expect(primeAttr.possibleValues).toEqual([true, false]);

    const digitSum = MATHERACY_ATTRIBUTES.find((a) => a.name === 'digitSum')!;
    expect(digitSum.possibleValues).toHaveLength(18);
    expect(digitSum.possibleValues[0]).toBe(1);
    expect(digitSum.possibleValues[17]).toBe(18);
  });

  it('createMathPiece attributes align with MATHERACY boolean flags', () => {
    for (const n of [1, 2, 4, 9, 11, 15, 16, 25, 49, 97]) {
      const piece = createMathPiece(n);
      expect(typeof piece.attributes.isPrime).toBe('boolean');
      expect(typeof piece.attributes.isSquare).toBe('boolean');
      expect(typeof piece.attributes.divisibleBy3).toBe('boolean');
      expect(piece.attributes.number).toBe(n);
    }
  });
});

describe('Wave 29 attr-catalog — generateAllPieces combinatorics', () => {
  it('SOME_SUM full catalog is 9 * 2 * 3 = 54', () => {
    const pieces = generateAllPieces(SOME_SUM_ATTRIBUTES);
    expect(pieces).toHaveLength(54);
    const ids = new Set(pieces.map((p) => p.id));
    expect(ids.size).toBe(54);
    expect(pieces.every((p) => p.id.includes('value:'))).toBe(true);
  });

  it('SET_GAME full catalog is 3^4 = 81', () => {
    const pieces = generateAllPieces(SET_GAME_ATTRIBUTES);
    expect(pieces).toHaveLength(81);
    expect(pieces.filter((p) => p.attributes.color === 'red').length).toBe(27);
  });

  it('empty definitions yield a single empty piece; single attr expands', () => {
    expect(generateAllPieces([])).toEqual([{ id: '', attributes: {} }]);

    const mono: AttributeDefinition[] = [
      { name: 'parity', possibleValues: ['odd', 'even'] },
    ];
    const pieces = generateAllPieces(mono);
    expect(pieces).toHaveLength(2);
    expect(pieces.map((p) => p.id).sort()).toEqual([
      'parity:even',
      'parity:odd',
    ]);
  });

  it('subset of MATHERACY (booleans only) generates 8 pieces', () => {
    const boolOnly = MATHERACY_ATTRIBUTES.filter((a) =>
      ['isPrime', 'isSquare', 'divisibleBy3'].includes(a.name)
    );
    const pieces = generateAllPieces(boolOnly);
    expect(pieces).toHaveLength(8);
    expect(
      pieces.some(
        (p) =>
          p.attributes.isPrime === true &&
          p.attributes.isSquare === true &&
          p.attributes.divisibleBy3 === false
      )
    ).toBe(true);
  });
});

describe('Wave 29 attr-catalog — getAttributeColor / createPiece', () => {
  it('resolves colorMap hits and misses across catalogs', () => {
    expect(getAttributeColor(BASIC_ATTRIBUTES, 'shape', 'circle')).toBe(
      '#2196f3'
    );
    expect(
      getAttributeColor(BASIC_ATTRIBUTES, 'size', 'small')
    ).toBeUndefined();
    expect(getAttributeColor(SOME_SUM_ATTRIBUTES, 'parity', 'even')).toBe(
      '#f44336'
    );
    expect(getAttributeColor(SET_GAME_ATTRIBUTES, 'color', 'purple')).toBe(
      '#9c27b0'
    );
    expect(
      getAttributeColor(MATHERACY_ATTRIBUTES, 'isPrime', true)
    ).toBeUndefined();
    expect(getAttributeColor([], 'color', 'red')).toBeUndefined();
  });

  it('createPiece returns independent attribute objects', () => {
    const attrs = { color: 'red', n: 1 };
    const p = createPiece('x', attrs);
    expect(p).toEqual({ id: 'x', attributes: attrs });
    attrs.n = 99;
    // Shared reference by design (no clone) — document current contract
    expect(p.attributes.n).toBe(99);
  });
});
