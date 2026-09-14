/**
 * Wave 43 — Stars reject selecting opponent card. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, selectCard } from '../../src/games/stars-bars/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 stars-bars — opponent card reject', () => {
  it('cannot select a card from the other hand', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const oppCard = s.playerHands.player2[0];
    expect(selectCard(s, oppCard.id)).toBe(s);
  });
});
