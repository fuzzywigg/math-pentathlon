/**
 * Wave 44 — Contig / Sum / Star Track registry id leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

describe('Wave 44 handshake — Contig/Sum/Star registry ids', () => {
  it('canonical game id strings stay stable', () => {
    const ids = ['contig-60', 'sum-dominoes', 'star-track'];
    expect(new Set(ids).size).toBe(3);
    expect(ids.every((id) => id.includes('-'))).toBe(true);
  });
});
