/**
 * Overnight TOKENMAXX — registry ids for fiar/hex/frac/stars/hag/calla. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { GAMES } from '../../src/core/game-registry';

describe('Overnight handshake — registry ids', () => {
  it('slice games are registered and available', () => {
    const byId = Object.fromEntries(GAMES.map((g) => [g.id, g]));
    for (const id of ['fiar', 'hex', 'frac-fact', 'stars-bars', 'hex-a-gone', 'calla']) {
      expect(byId[id]).toBeTruthy();
      expect(byId[id].available).toBe(true);
    }
  });
});
