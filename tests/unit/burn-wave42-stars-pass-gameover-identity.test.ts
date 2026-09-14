/**
 * Wave 42 — Stars & Bars passTurn flip / clear / gameOver identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  passTurn,
} from '../../src/games/stars-bars/rules';

describe('Wave 42 stars — pass gameOver identity', () => {
  it('passTurn flips player and clears selection mid-place', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    expect(state.phase).toBe('placingCard');
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedCard).toBeNull();
    expect(next.phase).toBe('selectingCard');
  });

  it('passTurn identity when already gameOver', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(passTurn(over)).toBe(over);
  });

  it('double pass returns seat to original player', () => {
    const state = createInitialState();
    const once = passTurn(state);
    const twice = passTurn(once);
    expect(twice.currentPlayer).toBe('player1');
  });
});
