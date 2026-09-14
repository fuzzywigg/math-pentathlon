/**
 * Overnight HEAVY after #214/#215 — registry handshake for leftover six engines. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { GAMES } from '../../src/core/game-registry';

const IDS = ['calla', 'juggle', 'hex-a-gone', 'ramrod', 'stars-bars', 'sum-dominoes'] as const;

describe('Overnight handshake — six-engine registry', () => {
  it('all six leftover engines are registered and available', () => {
    for (const id of IDS) {
      const g = GAMES.find((x) => x.id === id);
      expect(g, id).toBeTruthy();
      expect(g!.available).toBe(true);
      expect(g!.name.length).toBeGreaterThan(0);
    }
  });
});
