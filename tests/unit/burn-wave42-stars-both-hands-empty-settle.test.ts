/**
 * Wave 42 — Stars & Bars both hands empty settle by score. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import type { AttributeCard, StarsState } from '../../src/games/stars-bars/types';

function card(id: string): AttributeCard {
  return {
    id,
    shape: 'circle',
    color: 'red',
    size: 'small',
    thickness: 'thin',
  };
}

describe('Wave 42 stars — both hands empty settle', () => {
  it('last place with both hands empty crowns higher score', () => {
    const base = createInitialState();
    const only: AttributeCard = card('last-p1');
    const seeded: StarsState = {
      ...base,
      deck: [],
      playerHands: { player1: [only], player2: [] },
      playerScores: { player1: 4, player2: 1 },
      currentPlayer: 'player1',
      selectedCard: null,
      phase: 'selectingCard',
    };
    let state = selectCard(seeded, only.id);
    state = placeCard(state, 2, 2);
    expect(state.playerHands.player1).toHaveLength(0);
    expect(state.playerHands.player2).toHaveLength(0);
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
  });

  it('tied scores leave winner null on dual empty hands', () => {
    const base = createInitialState();
    const only: AttributeCard = card('tie-last');
    const seeded: StarsState = {
      ...base,
      deck: [],
      playerHands: { player1: [only], player2: [] },
      playerScores: { player1: 3, player2: 3 },
      currentPlayer: 'player1',
      phase: 'selectingCard',
      selectedCard: null,
    };
    let state = selectCard(seeded, only.id);
    state = placeCard(state, 0, 0);
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBeNull();
  });
});
