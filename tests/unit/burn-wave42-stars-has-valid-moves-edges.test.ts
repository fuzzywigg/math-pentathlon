/**
 * Wave 42 — Stars & Bars hasValidMoves empty-hand vs opening. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  hasValidMoves,
  getValidPlacements,
} from '../../src/games/stars-bars/rules';
import type { StarsState } from '../../src/games/stars-bars/types';

describe('Wave 42 stars — hasValidMoves edges', () => {
  it('opening state has valid moves', () => {
    const state = createInitialState();
    expect(getValidPlacements(state).length).toBe(25);
    expect(hasValidMoves(state)).toBe(true);
  });

  it('empty current hand is false even with empty board', () => {
    const base = createInitialState();
    const empty: StarsState = {
      ...base,
      playerHands: { player1: [], player2: base.playerHands.player2 },
    };
    expect(hasValidMoves(empty)).toBe(false);
  });

  it('player2 empty hand after seat flip is false', () => {
    const base = createInitialState();
    const emptyP2: StarsState = {
      ...base,
      currentPlayer: 'player2',
      playerHands: { player1: base.playerHands.player1, player2: [] },
    };
    expect(hasValidMoves(emptyP2)).toBe(false);
  });
});
