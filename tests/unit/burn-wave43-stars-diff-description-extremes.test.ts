/**
 * Wave 43 — getDifferenceDescription extremes leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getDifferenceDescription,
  type AttributeCard,
} from '../../src/games/stars-bars/types';

describe('Wave 43 stars — diff description', () => {
  it('identical → empty; 4-diff lists attrs', () => {
    const a: AttributeCard = {
      id: 'a',
      shape: 'circle',
      color: 'red',
      size: 'small',
      thickness: 'thin',
    };
    const b: AttributeCard = { ...a, id: 'b' };
    expect(getDifferenceDescription(a, b)).toBe('');
    const c: AttributeCard = {
      id: 'c',
      shape: 'square',
      color: 'blue',
      size: 'large',
      thickness: 'thick',
    };
    const desc = getDifferenceDescription(a, c);
    expect(desc.length).toBeGreaterThan(0);
  });
});
