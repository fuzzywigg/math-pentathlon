/**
 * Wave 43 — Hex-a-Gone getAvailableShapes excludes selected. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getAvailableShapes } from '../../src/games/hex-a-gone/types';
import { selectBlock } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — available excludes selected', () => {
  it('selected shape drops from available even with bank remaining', () => {
    let state = createInitialState();
    state = selectBlock(state, 'hexagon');
    expect(state.bank.hexagon).toBeGreaterThan(0);
    expect(getAvailableShapes(state)).not.toContain('hexagon');
    expect(getAvailableShapes(state)).toContain('triangle');
  });
});
