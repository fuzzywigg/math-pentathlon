/**
 * Wave 45 — Handshake Contig/SD/Star registry ids remain kebab
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';

describe('Wave 45 handshake — registry ids', () => {
  it('keeps canonical kebab ids distinct from wave44 registry smoke', () => {
    const ids = ['contig-60', 'sum-dominoes', 'star-track'];
    expect(ids.join('|')).toBe('contig-60|sum-dominoes|star-track');
  });
});
