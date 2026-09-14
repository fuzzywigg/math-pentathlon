/**
 * Wave 45 — Par 55 countMatchingAttributes 0–4 lattice leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { countMatchingAttributes, type AttributeBlock } from '../../src/games/par-55/types';

const base: AttributeBlock = { id: 'a', shape: 'circle', color: 'red', size: 'small', thickness: 'thin' };

describe('Wave 45 par — attribute match lattice', () => {
  it('returns empty when no attrs match', () => {
    const other: AttributeBlock = { id: 'b', shape: 'square', color: 'blue', size: 'large', thickness: 'thick' };
    expect(countMatchingAttributes(base, other)).toEqual([]);
  });

  it('returns all four when identical attrs', () => {
    const twin: AttributeBlock = { ...base, id: 'c' };
    expect(countMatchingAttributes(base, twin).sort()).toEqual(['color', 'shape', 'size', 'thickness']);
  });

  it('returns only shared subset', () => {
    const partial: AttributeBlock = { id: 'd', shape: 'circle', color: 'blue', size: 'small', thickness: 'thick' };
    expect(countMatchingAttributes(base, partial).sort()).toEqual(['shape', 'size']);
  });
});
