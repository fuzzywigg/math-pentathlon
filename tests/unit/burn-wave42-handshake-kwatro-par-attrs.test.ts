/**
 * Wave 42 — Kwatro isWinningValue × Par attribute catalogs handshake after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  isWinningValue,
  PLAYER_CHIPS,
  CONFIG as KWA_CONFIG,
} from '../../src/games/kwatro-sinko/types';
import {
  SHAPES,
  COLORS,
  SIZES,
  THICKNESSES,
  CONFIG as PAR_CONFIG,
  countMatchingAttributes,
  createBlockSet,
} from '../../src/games/par-55/types';

describe('Wave 42 handshake — kwatro × par catalogs', () => {
  it('kwatro targets are exactly CONFIG.TARGET_VALUES and exclude 0/1/2/3/6', () => {
    for (const v of KWA_CONFIG.TARGET_VALUES) {
      expect(isWinningValue(v)).toBe(true);
    }
    for (const v of [0, 1, 2, 3, 6, 7, 10]) {
      expect(isWinningValue(v)).toBe(false);
    }
  });

  it('player chip sets are disjoint even/odd partitions of expected size', () => {
    expect(PLAYER_CHIPS.player1).toHaveLength(5);
    expect(PLAYER_CHIPS.player2).toHaveLength(5);
    expect(PLAYER_CHIPS.player1.every((n) => n % 2 === 0)).toBe(true);
    expect(PLAYER_CHIPS.player2.every((n) => n % 2 === 1)).toBe(true);
  });

  it('par block set is 5×3×2×2 and TARGET_SCORE is 55', () => {
    expect(SHAPES).toHaveLength(5);
    expect(COLORS).toHaveLength(3);
    expect(SIZES).toHaveLength(2);
    expect(THICKNESSES).toHaveLength(2);
    expect(createBlockSet()).toHaveLength(60);
    expect(PAR_CONFIG.TARGET_SCORE).toBe(55);
  });

  it('identical blocks match all four attributes', () => {
    const [a] = createBlockSet();
    const matches = countMatchingAttributes(a, { ...a });
    expect(matches.sort()).toEqual(
      ['shape', 'color', 'size', 'thickness'].sort()
    );
  });
});
