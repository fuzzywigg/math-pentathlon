/**
 * Wave 43 — Handshake leftover engines present in game registry. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { GAMES, getGameById } from '../../src/core/game-registry';

describe('Wave 43 handshake — registry ids slice', () => {
  it('registers juggle, hex-a-gone, calla, ramrod, stars-bars', () => {
    const ids = new Set(GAMES.map((g) => g.id));
    for (const id of ['juggle', 'hex-a-gone', 'calla', 'ramrod', 'stars-bars']) {
      expect(ids.has(id)).toBe(true);
      expect(getGameById(id)?.available).toBe(true);
    }
  });
});
