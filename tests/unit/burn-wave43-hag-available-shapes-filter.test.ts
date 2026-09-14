/**
 * Wave 43 — getAvailableShapes filter leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getAvailableShapes } from '../../src/games/hex-a-gone/types';
import { selectBlock } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hag — available shapes filter', () => {
  it('selected shape filtered; empty bank shape excluded', () => {
    let s = createInitialState();
    expect(getAvailableShapes(s)).toContain('hexagon');
    s = selectBlock(s, 'hexagon');
    expect(getAvailableShapes(s)).not.toContain('hexagon');
    s = { ...s, bank: { ...s.bank, triangle: 0 } };
    expect(getAvailableShapes(s)).not.toContain('triangle');
  });
});
