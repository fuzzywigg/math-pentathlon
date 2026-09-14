/**
 * Wave 46 — Handshake par/prime pass flip leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as parInit, passTurn as parPass } from '../../src/games/par-55/rules';
import { createInitialState as primeInit, passTurn as primePass } from '../../src/games/prime-gold/rules';

describe('Wave 46 handshake — pass flip pair', () => {
  it('both pass flip to player2', () => {
    expect(parPass(parInit()).currentPlayer).toBe('player2');
    expect(primePass(primeInit()).currentPlayer).toBe('player2');
  });
});
