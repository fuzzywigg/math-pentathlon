/**
 * Wave 42 — Star Track bucket size invariant CHAINS_PER_LENGTH. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createChainBucket,
  createInitialState,
  CHAINS_PER_LENGTH,
} from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';

describe('Wave 42 star-track — bucket size', () => {
  it('bucket has 24 chains; draw removes 2', () => {
    const bucket = createChainBucket();
    expect(bucket.length).toBe(6 * CHAINS_PER_LENGTH);
    const counts = new Map<number, number>();
    for (const c of bucket) {
      counts.set(c.length, (counts.get(c.length) ?? 0) + 1);
    }
    for (let len = 1; len <= 6; len++) {
      expect(counts.get(len)).toBe(CHAINS_PER_LENGTH);
    }
    const drawn = drawChains(createInitialState());
    expect(drawn.chainBucket.length).toBe(bucket.length - 2);
    expect(drawn.drawnChains).toHaveLength(2);
  });
});
