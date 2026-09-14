/**
 * Wave 44 — Star Track opening bucket leftovers (rules vs #196 AI).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  createChainBucket,
  TRACK_LENGTH,
  CHAINS_PER_LENGTH,
} from '../../src/games/star-track/types';

describe('Wave 44 Star Track — initial bucket', () => {
  it('24 chains and TRACK_LENGTH 12', () => {
    expect(TRACK_LENGTH).toBe(12);
    expect(createChainBucket()).toHaveLength(6 * CHAINS_PER_LENGTH);
    const s = createInitialState();
    expect(s.phase).toBe('drawChains');
    expect(s.chainBucket).toHaveLength(24);
    expect(s.player1Position).toBe(0);
  });
});
