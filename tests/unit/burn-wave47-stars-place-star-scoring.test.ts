/**
 * Wave 47 leftover after #214/#215 — Stars & Bars placeCard star scoring leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import { countDifferences } from '../../src/games/stars-bars/types';

describe('Wave 47 stars deepen 5 — stars — place star scoring', () => {
  it('first card scores 0 with first-card breakdown', () => {
    let state = createInitialState();
    const card = state.playerHands.player1[0];
    state = selectCard(state, card.id);
    state = placeCard(state, 1, 1);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0].score).toBe(0);
    expect(state.moveHistory[0].breakdown).toBe('first card');
    expect(state.playerScores.player1).toBe(0);
  });

  it('star cell doubles positive adjacency score', () => {
    // Seed a non-star cell at (1,1), then place on star (0,0) adjacent diagonally
    let state = createInitialState();
    const seedCard = state.playerHands.player1[0];
    state = selectCard(state, seedCard.id);
    state = placeCard(state, 1, 1);

    const placeCard2 = state.playerHands.player2[0];
    const seeded = state.cells[1][1].card!;
    const baseDiff = countDifferences(placeCard2, seeded);

    state = selectCard(state, placeCard2.id);
    // (0,0) is a star and adjacent to (1,1)
    expect(state.cells[0][0].isStar).toBe(true);
    state = placeCard(state, 0, 0);

    expect(state.moveHistory.at(-1)!.breakdown).toContain('star x2');
    expect(state.moveHistory.at(-1)!.score).toBe(baseDiff * 2);
    expect(state.playerScores.player2).toBe(baseDiff * 2);
  });

  it('star with zero adjacency score stays zero (no x2 inflate)', () => {
    // Place first card ON a star — still first card, score 0
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    expect(state.cells[0][0].isStar).toBe(true);
    state = placeCard(state, 0, 0);
    expect(state.moveHistory[0].score).toBe(0);
    expect(state.moveHistory[0].breakdown).toBe('first card');
    expect(state.moveHistory[0].breakdown).not.toContain('star');
  });
});
