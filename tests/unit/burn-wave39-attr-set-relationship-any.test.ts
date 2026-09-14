/**
 * Wave 39 — attributes set relationship / findAllValidSets leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  checkSetRelationship,
  isValidSet,
  isValidSetGameSet,
  findAllValidSets,
  SET_GAME_ATTRIBUTES,
} from '../../src/core/attributes';

describe('Wave 39 attributes — set relationship', () => {
  const a = { id: 'a', attributes: { color: 'red', shape: 'oval', number: 1 } };
  const b = {
    id: 'b',
    attributes: { color: 'green', shape: 'diamond', number: 2 },
  };
  const c = {
    id: 'c',
    attributes: { color: 'purple', shape: 'squiggle', number: 3 },
  };
  const d = { id: 'd', attributes: { color: 'red', shape: 'oval', number: 1 } };

  it('all_same / all_different / any', () => {
    expect(checkSetRelationship([a, d], 'color', 'all_same')).toBe(true);
    expect(checkSetRelationship([a, b, c], 'color', 'all_different')).toBe(
      true
    );
    expect(checkSetRelationship([a, d], 'color', 'all_different')).toBe(false);
    expect(checkSetRelationship([a, b], 'color', 'any')).toBe(true);
  });

  it('isValidSet with mixed rules', () => {
    const rules = [
      { attribute: 'color', relationship: 'all_different' as const },
      { attribute: 'shape', relationship: 'all_different' as const },
      { attribute: 'number', relationship: 'all_different' as const },
    ];
    expect(isValidSet([a, b, c], rules)).toBe(true);
    expect(isValidSet([a, d, b], rules)).toBe(false);
  });

  it('isValidSetGameSet / findAllValidSets on small deck', () => {
    expect(SET_GAME_ATTRIBUTES.length).toBeGreaterThan(0);
    const rules = [
      { attribute: 'color', relationship: 'all_different' as const },
      { attribute: 'shape', relationship: 'all_different' as const },
      { attribute: 'number', relationship: 'all_different' as const },
    ];
    const sets = findAllValidSets([a, b, c, d], rules);
    expect(Array.isArray(sets)).toBe(true);
    expect(sets.length).toBeGreaterThanOrEqual(1);
    expect(isValidSetGameSet([a, b, c], SET_GAME_ATTRIBUTES)).toBeTypeOf(
      'boolean'
    );
  });
});
