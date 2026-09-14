/**
 * Wave 42 handshake — remainder × star-track × par-55 openings.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as remInit } from '../../src/games/remainder-islands/types';
import { createInitialState as starInit } from '../../src/games/star-track/types';
import { createInitialState as parInit } from '../../src/games/par-55/rules';

describe('Wave 42 handshake — remainder × star × par', () => {
  it('all open on player1 with distinct phases', () => {
    const r = remInit();
    const s = starInit();
    const p = parInit();
    expect(r.currentPlayer).toBe('player1');
    expect(s.currentPlayer).toBe('player1');
    expect(p.currentPlayer).toBe('player1');
    expect(r.phase).toBe('rolling');
    expect(s.phase).toBe('drawChains');
    expect(p.phase).toBe('selectingBlock');
  });

  it('fresh winners null; scores zero', () => {
    expect(remInit().winner).toBeNull();
    expect(starInit().winner).toBeNull();
    expect(parInit().winner).toBeNull();
    expect(parInit().scores).toEqual({ player1: 0, player2: 0 });
  });
});
