/**
 * Wave 43 — initial deck remainder leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { CONFIG } from '../../src/games/stars-bars/types';

describe('Wave 43 stars — initial deck remainder', () => {
  it('after deal, deck.length === 60 - 2*HAND_SIZE', () => {
    const s = createInitialState();
    expect(s.deck.length).toBe(60 - 2 * CONFIG.HAND_SIZE);
    expect(s.playerHands.player1).toHaveLength(CONFIG.HAND_SIZE);
    expect(s.playerHands.player2).toHaveLength(CONFIG.HAND_SIZE);
  });
});
