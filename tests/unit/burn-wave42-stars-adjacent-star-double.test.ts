/**
 * Wave 42 — Stars & Bars adjacent scoring + star double leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import { countDifferences } from '../../src/games/stars-bars/types';

describe('Wave 42 stars — adjacent + star double', () => {
  it('non-star adjacency scores raw difference sum', () => {
    let state = createInitialState();
    const seed = state.playerHands.player1[0];
    state = selectCard(state, seed.id);
    state = placeCard(state, 2, 1);

    const nextCard = state.playerHands.player2[0];
    const seeded = state.cells[2][1].card!;
    const diff = countDifferences(nextCard, seeded);
    state = selectCard(state, nextCard.id);
    // (2,2) is adjacent and is a star — skip; use (1,1) non-star adjacent
    expect(state.cells[1][1].isStar).toBe(false);
    state = placeCard(state, 1, 1);
    expect(state.moveHistory.at(-1)!.score).toBe(diff);
    expect(state.moveHistory.at(-1)!.breakdown).toContain(`${diff}-way`);
    expect(state.moveHistory.at(-1)!.breakdown).not.toContain('star');
  });

  it('star cell doubles positive adjacency score', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 1, 0);

    const card2 = state.playerHands.player2[0];
    const seeded = state.cells[1][0].card!;
    const diff = countDifferences(card2, seeded);
    state = selectCard(state, card2.id);
    expect(state.cells[0][0].isStar).toBe(true);
    state = placeCard(state, 0, 0);
    expect(state.moveHistory.at(-1)!.breakdown).toContain('star x2');
    expect(state.moveHistory.at(-1)!.score).toBe(diff * 2);
  });
});
