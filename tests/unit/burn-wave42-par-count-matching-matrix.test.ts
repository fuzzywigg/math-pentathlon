/**
 * Wave 42 — Par 55 countMatchingAttributes 0–4 matrix leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  countMatchingAttributes,
  createBlockSet,
  type AttributeBlock,
} from '../../src/games/par-55/types';

function blockWith(
  base: AttributeBlock,
  overrides: Partial<AttributeBlock>
): AttributeBlock {
  return { ...base, ...overrides, id: `probe-${overrides.id ?? 'x'}` };
}

describe('Wave 42 par — countMatchingAttributes matrix', () => {
  const catalog = createBlockSet();
  const anchor = catalog[0];

  it('identical blocks match all four attributes', () => {
    expect(countMatchingAttributes(anchor, anchor)).toEqual([
      'shape',
      'color',
      'size',
      'thickness',
    ]);
  });

  it('zero overlap when all four attrs differ', () => {
    const zero = blockWith(anchor, {
      shape: anchor.shape === 'circle' ? 'square' : 'circle',
      color: anchor.color === 'red' ? 'blue' : 'red',
      size: anchor.size === 'small' ? 'large' : 'small',
      thickness: anchor.thickness === 'thin' ? 'thick' : 'thin',
    });
    expect(countMatchingAttributes(anchor, zero)).toEqual([]);
  });

  it('exactly one attribute match', () => {
    const one = blockWith(anchor, {
      shape: anchor.shape,
      color: anchor.color === 'red' ? 'blue' : 'red',
      size: anchor.size === 'small' ? 'large' : 'small',
      thickness: anchor.thickness === 'thin' ? 'thick' : 'thin',
    });
    expect(countMatchingAttributes(anchor, one)).toEqual(['shape']);
  });

  it('exactly two attribute matches', () => {
    const two = blockWith(anchor, {
      shape: anchor.shape,
      color: anchor.color,
      size: anchor.size === 'small' ? 'large' : 'small',
      thickness: anchor.thickness === 'thin' ? 'thick' : 'thin',
    });
    expect(countMatchingAttributes(anchor, two).sort()).toEqual(
      ['shape', 'color'].sort()
    );
  });

  it('exactly three attribute matches', () => {
    const three = blockWith(anchor, {
      shape: anchor.shape,
      color: anchor.color,
      size: anchor.size,
      thickness: anchor.thickness === 'thin' ? 'thick' : 'thin',
    });
    expect(countMatchingAttributes(anchor, three).sort()).toEqual(
      ['shape', 'color', 'size'].sort()
    );
  });

  it('catalog pair with partial overlap returns 1–3 attrs', () => {
    const partial = catalog.find(
      (b) =>
        b.id !== anchor.id &&
        countMatchingAttributes(anchor, b).length > 0 &&
        countMatchingAttributes(anchor, b).length < 4
    );
    expect(partial).toBeTruthy();
    const matches = countMatchingAttributes(anchor, partial!);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches.length).toBeLessThanOrEqual(3);
    for (const attr of matches) {
      expect(['shape', 'color', 'size', 'thickness']).toContain(attr);
    }
  });
});
