/**
 * Wave 39 — checkSetRelationship any/default + empty leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  checkSetRelationship,
  isValidSet,
} from '../../src/core/attributes';
import type {
  AttributePiece,
  SetRelationship,
  SetRule,
} from '../../src/core/attributes';

describe('Wave 39 attr — set relationship any/default', () => {
  const pieces: AttributePiece[] = [
    { id: '1', attributes: { color: 'red', shape: 'circle' } },
    { id: '2', attributes: { color: 'blue', shape: 'circle' } },
    { id: '3', attributes: { color: 'green', shape: 'circle' } },
  ];

  it('empty pieces always true for any relationship', () => {
    expect(checkSetRelationship([], 'color', 'all_same')).toBe(true);
    expect(checkSetRelationship([], 'color', 'any')).toBe(true);
  });

  it('any relationship always true for non-empty', () => {
    expect(checkSetRelationship(pieces, 'color', 'any')).toBe(true);
  });

  it('unknown relationship returns false', () => {
    expect(
      checkSetRelationship(pieces, 'color', 'mostly' as SetRelationship)
    ).toBe(false);
  });

  it('all_different on colors passes', () => {
    expect(checkSetRelationship(pieces, 'color', 'all_different')).toBe(true);
    expect(checkSetRelationship(pieces, 'shape', 'all_same')).toBe(true);
  });

  it('isValidSet with mixed rules', () => {
    const rules: SetRule[] = [
      { attribute: 'color', relationship: 'all_different' },
      { attribute: 'shape', relationship: 'all_same' },
    ];
    expect(isValidSet(pieces, rules)).toBe(true);
  });
});
