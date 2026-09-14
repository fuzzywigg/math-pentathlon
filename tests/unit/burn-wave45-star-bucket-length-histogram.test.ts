/**
 * Wave 45 — Star Track createChainBucket four of each length 1-6
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createChainBucket, CHAINS_PER_LENGTH } from '../../src/games/star-track/types';

describe('Wave 45 Star — bucket histogram', () => {
  it('contains four chains of each length 1 through 6', () => {
    const bucket = createChainBucket();
    const counts = new Map<number, number>();
    for (const c of bucket) counts.set(c.length, (counts.get(c.length) ?? 0) + 1);
    for (let n = 1; n <= 6; n++) {
      expect(counts.get(n)).toBe(CHAINS_PER_LENGTH);
    }
    expect(bucket).toHaveLength(24);
  });
});
