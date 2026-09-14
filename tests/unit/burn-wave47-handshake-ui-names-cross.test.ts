/**
 * Wave 47 leftover after #214/#215 — UI names cross leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as starsN } from '../../src/games/stars-bars/board-ui';
import { getPlayerName as sumN } from '../../src/games/sum-dominoes/board-ui';
import { getPlayerName as parN } from '../../src/games/par-55/board-ui';
import { getPlayerName as kwaN } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 47 handshake — ui names cross', () => {
  it('distinct p1/p2 labels across leftovers', () => {
    for (const gn of [starsN, sumN, parN, kwaN]) {
      expect(gn('player1')).not.toBe(gn('player2'));
      expect(gn('player1').length).toBeGreaterThan(0);
    }
  });
});
