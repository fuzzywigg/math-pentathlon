/**
 * Wave 46 — Handshake opening hand/tray sizes leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as parInit, CONFIG as _ } from '../../src/games/par-55/rules';
import { CONFIG as parCfg } from '../../src/games/par-55/types';
import { createInitialState as primeInit } from '../../src/games/prime-gold/rules';
import { createInitialState as pentInit } from '../../src/games/pent-em-in/types';
import { createInitialState as kwaInit } from '../../src/games/kwatro-sinko/rules';

describe('Wave 46 handshake — opening hands', () => {
  it('par hand size; prime chips; pent trays; kwatro chips', () => {
    expect(parInit().hands.player1).toHaveLength(parCfg.HAND_SIZE);
    expect(primeInit().playerChips.player1).toBeGreaterThan(0);
    expect(pentInit().player1Pieces.available).toHaveLength(12);
    expect(kwaInit().chips.size).toBe(10);
  });
});
