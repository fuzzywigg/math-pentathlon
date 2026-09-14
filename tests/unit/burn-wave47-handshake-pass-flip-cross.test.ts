/**
 * Wave 47 leftover after #214/#215 — pass flip cross leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as stars, passTurn as starsPass } from '../../src/games/stars-bars/rules';
import { createInitialState as par, passTurn as parPass } from '../../src/games/par-55/rules';
import { createInitialState as kwa, passTurn as kwaPass } from '../../src/games/kwatro-sinko/rules';
import { createInitialState as hex } from '../../src/games/hex-a-gone/types';
import { passTurn as hexPass } from '../../src/games/hex-a-gone/rules';

describe('Wave 47 handshake — pass flip cross', () => {
  it('pass flips seat on stars/par/kwatro/hexagone', () => {
    expect(starsPass(stars()).currentPlayer).toBe('player2');
    expect(parPass(par()).currentPlayer).toBe('player2');
    expect(kwaPass(kwa()).currentPlayer).toBe('player2');
    expect(hexPass(hex()).currentPlayer).toBe('player2');
  });
});
