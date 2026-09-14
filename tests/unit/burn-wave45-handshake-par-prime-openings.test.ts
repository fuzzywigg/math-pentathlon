/**
 * Wave 45 — Handshake Par/Prime openings leftovers after #208. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { createInitialState as primeInit } from '../../src/games/prime-gold/rules';

describe('Wave 45 handshake — par/prime openings', () => {
  it('both start p1 with empty winners', () => {
    const par = parInit();
    const prime = primeInit();
    expect(par.currentPlayer).toBe('player1');
    expect(prime.currentPlayer).toBe('player1');
    expect(par.winner).toBeNull();
    expect(prime.winner).toBeNull();
    expect(par.phase).toBe('selectingBlock');
    expect(prime.phase).toBe('rolling');
  });
});
