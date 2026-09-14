/**
 * Wave 42 — handshake: kings × remainder opponent after select.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent as kingsOpp } from '../../src/games/kings-quadraphages/rules';
import {
  createInitialState as remInit,
  getOpponent as remOpp,
} from '../../src/games/remainder-islands/types';
import { selectIsland } from '../../src/games/remainder-islands/rules';

describe('Wave 42 handshake — kings × remainder seat', () => {
  it('helpers agree on both seats', () => {
    expect(kingsOpp('player1')).toBe(remOpp('player1'));
    expect(kingsOpp('player2')).toBe(remOpp('player2'));
  });

  it('selectIsland advances to kingsOpp(current)', () => {
    const base = remInit();
    const island = base.islands[0];
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 3, total: 5 },
      validIslands: [island.id],
      turnsRemaining: 10,
    };
    const next = selectIsland(state, island.id);
    expect(next.currentPlayer).toBe(kingsOpp(state.currentPlayer));
    expect(next.currentPlayer).toBe(remOpp('player1'));
  });
});
