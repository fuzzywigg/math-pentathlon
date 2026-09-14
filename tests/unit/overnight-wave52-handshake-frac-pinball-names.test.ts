/**
 * Overnight HEAVY leftover after #234 — Frac Fact + Pinball Blue/Red names cross.
 * Distinct from wave48 four-engine and wave50 prime/frac/pent sets. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as fracName } from '../../src/games/frac-fact/board-ui';
import { getPlayerName as pinName } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 52 handshake — frac/pinball names', () => {
  it('maps player1→Blue / player2→Red in both engines', () => {
    for (const get of [fracName, pinName]) {
      expect(get('player1')).toBe('Blue');
      expect(get('player2')).toBe('Red');
    }
  });
});
