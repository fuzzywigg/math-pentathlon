/**
 * Overnight HEAVY — registry ids for prime/fiar/frac/pent slice still available.
 * Distinct leftover handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { GAMES } from '../../src/core/game-registry';

describe('Overnight handshake — slice registry ids', () => {
  it('four leftover engines are registered and available', () => {
    const ids = GAMES.filter((g) => g.available).map((g) => g.id);
    for (const id of [
      'prime-gold',
      'fiar',
      'frac-fact',
      'pent-em-in',
    ]) {
      expect(ids).toContain(id);
    }
  });
});
