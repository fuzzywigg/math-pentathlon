/**
 * Wave 42 — FIAR AI null when movement has no own chips.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getAIMove } from '../../src/games/fiar/ai';

describe('Wave 42 FIAR AI — movement null', () => {
  it('returns null when current player has no chips to move', () => {
    const state = {
      ...createInitialState(),
      phase: 'movement' as const,
      chipsPlaced: { player1: 4, player2: 4 },
    };
    // Board empty of chips → no moves
    expect(getAIMove(state, 'player1', 'easy')).toBeNull();
  });
});
