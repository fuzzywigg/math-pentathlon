/**
 * Wave 43 — Hex-a-Gone getAvailableShapes bank deplete. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  getAvailableShapes,
} from '../../src/games/hex-a-gone/types';
import { selectBlock } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — bank deplete available', () => {
  it('zero bank shape excluded; selected shape excluded', () => {
    const depleted = {
      ...createInitialState(),
      bank: { ...createInitialState().bank, hexagon: 0 },
    };
    expect(getAvailableShapes(depleted)).not.toContain('hexagon');
    const selected = selectBlock(createInitialState(), 'triangle');
    expect(getAvailableShapes(selected)).not.toContain('triangle');
    expect(getAvailableShapes(selected)).toContain('square');
  });
});
