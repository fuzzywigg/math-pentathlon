/**
 * Wave 46 — Par 55 countMatchingAttributes single-attr leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { countMatchingAttributes, type AttributeBlock } from '../../src/games/par-55/types';

describe('Wave 46 par — single attr match', () => {
  it('only color match returns [color]', () => {
    const a: AttributeBlock = {
      id: '1',
      shape: 'circle',
      color: 'red',
      size: 'small',
      thickness: 'thin',
    };
    const b: AttributeBlock = {
      id: '2',
      shape: 'square',
      color: 'red',
      size: 'large',
      thickness: 'thick',
    };
    expect(countMatchingAttributes(a, b)).toEqual(['color']);
  });
});
