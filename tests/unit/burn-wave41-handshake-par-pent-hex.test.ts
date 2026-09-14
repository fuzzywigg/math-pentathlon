/**
 * Wave 41 — handshake par-55 / pent-em-in / hex registry availability.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById, getGamesByDivision } from '../../src/core/game-registry';
import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { createInitialState as pentInit } from '../../src/games/pent-em-in/types';
import { createInitialState as hexInit } from '../../src/games/hex/types';

describe('Wave 41 handshake — par/pent/hex', () => {
  it('available engines boot and appear in some division list', () => {
    expect(getGameById('par-55')?.difficulty).toBeTruthy();
    expect(getGameById('pent-em-in')?.playerCount).toMatch(/2/);
    expect(getGameById('hex')?.available).toBe(true);
    expect(parInit().hands.player1.length).toBeGreaterThan(0);
    expect(pentInit().player1Pieces.available.length).toBe(12);
    expect(hexInit().boardSize).toBeGreaterThan(0);
    const all = [
      'Division I',
      'Division II',
      'Division III',
      'Division IV',
    ].flatMap((d) => getGamesByDivision(d));
    expect(all.some((g) => g.id === 'hex')).toBe(true);
  });
});
