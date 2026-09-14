/**
 * Wave 41 — Stars & Bars passTurn / hasValidMoves / empty hand leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  passTurn,
  hasValidMoves,
  selectCard,
  placeCard,
  getValidPlacements,
} from '../../src/games/stars-bars/rules';
import type { StarsState } from '../../src/games/stars-bars/types';

describe('Wave 41 stars — pass / hasValidMoves / empty hand', () => {
  it('passTurn identity on gameOver; otherwise flips seat and clears selection', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(passTurn(over)).toBe(over);

    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedCard).toBeNull();
    expect(next.phase).toBe('selectingCard');
  });

  it('hasValidMoves true with cards and empty board', () => {
    const state = createInitialState();
    expect(state.playerHands.player1.length).toBeGreaterThan(0);
    expect(getValidPlacements(state).length).toBeGreaterThan(0);
    expect(hasValidMoves(state)).toBe(true);
  });

  it('hasValidMoves false when current hand empty', () => {
    const state: StarsState = {
      ...createInitialState(),
      playerHands: {
        player1: [],
        player2: createInitialState().playerHands.player2,
      },
    };
    expect(hasValidMoves(state)).toBe(false);
  });

  it('hasValidMoves false when board full (no placements)', () => {
    const base = createInitialState();
    const filler = base.playerHands.player1[0];
    const cells = base.cells.map((row, r) =>
      row.map((c, col) => ({
        ...c,
        card: { ...filler, id: `occ-${r}-${col}` },
        owner: 'player1' as const,
      }))
    );
    const full: StarsState = { ...base, cells };
    expect(getValidPlacements(full)).toEqual([]);
    expect(hasValidMoves(full)).toBe(false);
  });
});
