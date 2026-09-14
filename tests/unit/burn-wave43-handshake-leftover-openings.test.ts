/**
 * Wave 43 — Handshake openings across juggle/hexagone/calla/ramrod/stars. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as hexInit } from '../../src/games/hex-a-gone/types';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 handshake — leftover openings', () => {
  it('all five engines open with player1 and no winner', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const engines = [juggleInit(), hexInit(), callaInit(), ramrodInit(), starsInit()];
    for (const s of engines) {
      expect(s.currentPlayer).toBe('player1');
      expect(s.winner).toBeNull();
    }
  });
});
