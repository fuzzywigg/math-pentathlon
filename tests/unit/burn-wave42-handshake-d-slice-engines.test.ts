/**
 * Wave 42 leftovers D — handshake across D-slice engines + catalogs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState as hexInit,
  INITIAL_BANK,
} from '../../src/games/hex-a-gone/types';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';
import {
  createRodSet,
  CONFIG as RAMROD_CONFIG,
} from '../../src/games/ramrod/types';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as contigInit } from '../../src/games/contig-60/types';
import {
  createInitialState as starTrackInit,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';

describe('Wave 42 D handshake — leftover engine openings', () => {
  it('hexagone / stars / ramrod / juggle / contig / star-track open coherently', () => {
    const hex = hexInit();
    expect(hex.board).toHaveLength(37);
    expect(Object.values(INITIAL_BANK).reduce((a, b) => a + b, 0)).toBe(33);

    const stars = starsInit();
    expect(stars.phase).toBe('selectingCard');
    expect(stars.cells.flat().filter((c) => c.isStar)).toHaveLength(5);

    expect(createRodSet().length).toBe(39);
    expect(RAMROD_CONFIG.TARGET_SCORE).toBe(24);

    expect(juggleInit().phase).toBe('rolling');
    expect(contigInit().phase).toBe('rolling');
    expect(starTrackInit().phase).toBe('drawChains');
    expect(TRACK_LENGTH).toBe(12);
  });
});
