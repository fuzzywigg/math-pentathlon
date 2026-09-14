/**
 * Overnight TOKENMAXX — Stars placeCard reject leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, placeCard, selectCard } from '../../src/games/stars-bars/rules';

describe('Overnight stars — place reject', () => {
  it('no selection / wrong phase identity', () => {
    const s = createInitialState();
    expect(placeCard(s, 0, 0)).toBe(s);
    const sel = selectCard(s, s.playerHands.player1[0].id);
    // occupied after place then reject
    const placed = placeCard(sel, 2, 2);
    expect(placed).not.toBe(sel);
    // wrong player trying occupied on next — forge selecting with occupied
    const again = selectCard(placed, placed.playerHands.player2[0].id);
    expect(placeCard(again, 2, 2)).toBe(again);
  });
});
