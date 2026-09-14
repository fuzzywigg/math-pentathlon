/**
 * Wave 43 — Calla free-turn keeps seat. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 43 calla — free turn chain', () => {
  it('opening pit2 grants free turn so currentPlayer stays player1', () => {
    const next = makeMove(createInitialState(), 2);
    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
    expect(next.currentPlayer).toBe('player1');
    expect(next.player1Calla).toBe(1);
  });
});
