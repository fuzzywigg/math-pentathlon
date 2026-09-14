/**
 * Wave 43 TOKENMAXX — Fab × Sum Dominoes opening handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as fabInit } from '../../src/games/fab-a-diffy/rules';
import { createInitialState as sdInit } from '../../src/games/sum-dominoes/rules';

describe('Wave 43 handshake — fab × sd openings', () => {
  it('both open on player1 without winners', () => {
    const fab = fabInit();
    const sd = sdInit();
    expect(fab.currentPlayer).toBe('player1');
    expect(sd.currentPlayer).toBe('player1');
    expect(fab.winner).toBeNull();
    expect(sd.winner).toBeNull();
    expect(fab.phase).toBe('selectingBar1');
    expect(sd.phase).toBe('rolling');
  });
});
