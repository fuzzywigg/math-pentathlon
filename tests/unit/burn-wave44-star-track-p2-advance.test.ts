/**
 * Wave 44 — Star Track player2 advance leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, ChainLink } from '../../src/games/star-track/types';
import { selectChain } from '../../src/games/star-track/rules';

describe('Wave 44 Star Track — p2 advance', () => {
  it('updates player2Position only', () => {
    const c0: ChainLink = { id: 1, length: 3 };
    const c1: ChainLink = { id: 2, length: 4 };
    const next = selectChain(
      {
        ...createInitialState(),
        currentPlayer: 'player2',
        phase: 'selectChain',
        drawnChains: [c0, c1],
      },
      0
    );
    expect(next.player2Position).toBe(3);
    expect(next.player1Position).toBe(0);
    expect(next.currentPlayer).toBe('player1');
  });
});
