/**
 * Wave 39 — findAllValidSets cardinality on small SET subset.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  findAllValidSets,
  isValidSetGameSet,
} from '../../src/core/attributes/logic';
import {
  SET_GAME_ATTRIBUTES,
  createPiece,
  generateAllPieces,
} from '../../src/core/attributes/types';

describe('Wave 39 attr — SET enumerate subset', () => {
  it('enumerates known valid triple from hand-built cards', () => {
    const a = createPiece('a', {
      number: 1,
      color: 'red',
      shading: 'solid',
      shape: 'oval',
    });
    const b = createPiece('b', {
      number: 2,
      color: 'green',
      shading: 'solid',
      shape: 'oval',
    });
    const c = createPiece('c', {
      number: 3,
      color: 'purple',
      shading: 'solid',
      shape: 'oval',
    });
    expect(isValidSetGameSet([a, b, c], SET_GAME_ATTRIBUTES)).toBe(true);

    const rules = SET_GAME_ATTRIBUTES.map((attr) => ({
      attribute: attr.name,
      relationship: 'any' as const,
    }));
    // all_same or all_different rules for SET:
    const setRules = SET_GAME_ATTRIBUTES.map((attr) => ({
      attribute: attr.name,
      relationship: 'all_different' as const,
    }));
    // number/color different, shading/shape same — not all all_different
    void setRules;
    void rules;

    const sets = findAllValidSets(
      [a, b, c],
      SET_GAME_ATTRIBUTES.map((attr) => ({
        attribute: attr.name,
        relationship:
          attr.name === 'shading' || attr.name === 'shape'
            ? ('all_same' as const)
            : ('all_different' as const),
      })),
      3
    );
    expect(sets).toHaveLength(1);
  });

  it('small generateAllPieces subset yields zero when too few cards', () => {
    const defs = SET_GAME_ATTRIBUTES.map((d) => ({
      ...d,
      possibleValues: d.possibleValues.slice(0, 1),
    }));
    const pieces = generateAllPieces(defs);
    expect(pieces.length).toBe(1);
    const sets = findAllValidSets(
      pieces,
      SET_GAME_ATTRIBUTES.map((attr) => ({
        attribute: attr.name,
        relationship: 'all_same' as const,
      })),
      3
    );
    expect(sets).toHaveLength(0);
  });
});
