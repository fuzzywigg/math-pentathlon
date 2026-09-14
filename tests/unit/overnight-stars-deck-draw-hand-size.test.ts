/**
 * Overnight TOKENMAXX — Stars place draws to HAND_SIZE leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import { CONFIG } from '../../src/games/stars-bars/types';

describe('Overnight stars — deck draw hand size', () => {
  it('after place, hand refill keeps HAND_SIZE when deck nonempty', () => {
    const s = createInitialState();
    expect(s.deck.length).toBeGreaterThan(0);
    const cardId = s.playerHands.player1[0].id;
    const sel = selectCard(s, cardId);
    const next = placeCard(sel, 2, 2);
    // after p1 place, it's p2 turn; p1 hand should be refilled
    expect(next.playerHands.player1.length).toBe(CONFIG.HAND_SIZE);
  });
});
