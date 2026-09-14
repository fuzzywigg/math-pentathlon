/**
 * Overnight TOKENMAXX — SET validation / findAllValidSets leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  isValidSetGameSet,
  isValidSet,
  findAllValidSets,
  checkSetRelationship,
} from '../../src/core/attributes/logic';
import type { AttributePiece, AttributeDefinition, SetRule } from '../../src/core/attributes/types';

const attrs: AttributeDefinition[] = [
  { name: 'color', possibleValues: ['r', 'g', 'b'] },
  { name: 'shape', possibleValues: ['c', 'd', 's'] },
];

function p(id: string, color: string, shape: string): AttributePiece {
  return { id, attributes: { color, shape } };
}

describe('Overnight attr — SET size variants', () => {
  it('isValidSetGameSet requires length 3 and all-same/all-diff', () => {
    const valid = [p('1', 'r', 'c'), p('2', 'g', 'd'), p('3', 'b', 's')];
    expect(isValidSetGameSet(valid, attrs)).toBe(true);
    expect(isValidSetGameSet(valid.slice(0, 2), attrs)).toBe(false);
    const bad = [p('1', 'r', 'c'), p('2', 'r', 'd'), p('3', 'b', 's')];
    expect(isValidSetGameSet(bad, attrs)).toBe(false);
  });

  it('findAllValidSets enumerates setSize 2 all_same color', () => {
    const pieces = [p('a', 'r', 'c'), p('b', 'r', 'd'), p('c', 'g', 'c')];
    const rules: SetRule[] = [{ attribute: 'color', relationship: 'all_same' }];
    const sets = findAllValidSets(pieces, rules, 2);
    expect(sets).toHaveLength(1);
    expect(sets[0].map((x) => x.id).sort()).toEqual(['a', 'b']);
  });

  it('checkSetRelationship any/empty/all_different', () => {
    expect(checkSetRelationship([], 'color', 'all_same')).toBe(true);
    expect(checkSetRelationship([p('1', 'r', 'c')], 'color', 'any')).toBe(true);
    expect(
      checkSetRelationship(
        [p('1', 'r', 'c'), p('2', 'g', 'c')],
        'color',
        'all_different'
      )
    ).toBe(true);
  });

  it('isValidSet with all_different shape', () => {
    const pieces = [p('1', 'r', 'c'), p('2', 'r', 'd')];
    expect(
      isValidSet(pieces, [{ attribute: 'shape', relationship: 'all_different' }])
    ).toBe(true);
  });
});
