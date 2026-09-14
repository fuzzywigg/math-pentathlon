/**
 * Wave 43 — Handshake sum×ramrod empty-hand / empty-rod openings. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as sum } from '../../src/games/sum-dominoes/rules';
import { createInitialState as ramrod } from '../../src/games/ramrod/rules';
import { getRemainingCount } from '../../src/games/sum-dominoes/rules';
import { CONFIG as RCFG } from '../../src/games/ramrod/types';

describe('Wave 43 handshake — sum×ramrod empty endgame shapes', () => {
  it('openings deal hands; remaining helpers exist', () => {
    const s = sum();
    const r = ramrod();
    expect(getRemainingCount(s, 'player1')).toBe(7);
    expect(r.playerRods.player1).toHaveLength(RCFG.STARTING_RODS_PER_PLAYER);
    expect(s.winner).toBeNull();
    expect(r.winner).toBeNull();
  });
});
