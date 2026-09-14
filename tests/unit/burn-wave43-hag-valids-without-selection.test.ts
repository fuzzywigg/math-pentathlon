/**
 * Wave 43 — getValidPlacements without selection leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { getValidPlacements } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hag — valids without selection', () => {
  it('no selectedBlockForPlacement → empty list', () => {
    expect(getValidPlacements(createInitialState())).toEqual([]);
  });
});
