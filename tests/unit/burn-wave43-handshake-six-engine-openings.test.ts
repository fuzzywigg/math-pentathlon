/**
 * Wave 43 — Handshake six leftover engines open player1. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as juggle } from '../../src/games/juggle/rules';
import { createInitialState as hag } from '../../src/games/hex-a-gone/types';
import { createInitialState as calla } from '../../src/games/calla/types';
import { createInitialState as ramrod } from '../../src/games/ramrod/rules';
import { createInitialState as sum } from '../../src/games/sum-dominoes/rules';
import { createInitialState as contig } from '../../src/games/contig-60/types';

describe('Wave 43 handshake — six leftover openings', () => {
  it('all boot player1 without winner', () => {
    for (const s of [juggle(), hag(), calla(), ramrod(), sum(), contig()]) {
      expect(s.currentPlayer).toBe('player1');
      expect(s.winner).toBeNull();
    }
  });
});
