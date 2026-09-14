/**
 * Overnight TOKENMAXX — Hex-a-Gone getValidPlacements empty leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { getValidPlacements } from '../../src/games/hex-a-gone/rules';

describe('Overnight hexagone — valids empty', () => {
  it('opening without placement selection yields []', () => {
    expect(getValidPlacements(createInitialState())).toEqual([]);
  });
});
