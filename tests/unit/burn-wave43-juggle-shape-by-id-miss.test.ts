/**
 * Wave 43 — getShapeById miss leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getShapeById, ALL_SHAPES } from '../../src/games/juggle/types';

describe('Wave 43 juggle — shape by id', () => {
  it('known ids resolve; unknown → undefined', () => {
    expect(ALL_SHAPES.length).toBeGreaterThan(0);
    expect(getShapeById(ALL_SHAPES[0].id)?.id).toBe(ALL_SHAPES[0].id);
    expect(getShapeById('no-such-shape-xyz')).toBeUndefined();
  });
});
