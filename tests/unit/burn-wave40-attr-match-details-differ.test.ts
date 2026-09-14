/**
 * Wave 40 — getMatchDetails / getDifferingAttributes leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getMatchDetails,
  getDifferingAttributes,
} from '../../src/core/attributes';

describe('Wave 40 attr — match details / differ', () => {
  const a = { id: '1', attributes: { color: 'red', size: 2, shape: 'circle' } };
  const b = { id: '2', attributes: { color: 'red', size: 3, shape: 'square' } };

  it('getMatchDetails partial match reports unmatched', () => {
    const r = getMatchDetails(a, [
      { attribute: 'color', operator: 'equals', value: 'red' },
      { attribute: 'size', operator: 'equals', value: 9 },
    ]);
    expect(r.matches).toBe(false);
    expect(r.matchedAttributes).toEqual(['color']);
    expect(r.unmatchedAttributes).toEqual(['size']);
  });

  it('getDifferingAttributes lists non-equal keys', () => {
    expect(getDifferingAttributes(a, b).sort()).toEqual(['shape', 'size']);
  });
});
