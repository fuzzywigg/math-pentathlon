/**
 * Wave 43 — non-star adjacency raw diffs leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import { countDifferences } from '../../src/games/stars-bars/types';

describe('Wave 43 stars — nonstar adj no double', () => {
  it('non-star adjacency scores raw diffs (not ×2)', () => {
    let s = createInitialState();
    const c1 = s.playerHands.player1[0];
    s = selectCard(s, c1.id);
    s = placeCard(s, 1, 1); // non-star
    const c2 = s.playerHands.player2[0];
    s = selectCard(s, c2.id);
    const next = placeCard(s, 1, 2); // non-star adjacent
    const last = next.moveHistory[next.moveHistory.length - 1];
    expect(last.breakdown).not.toMatch(/star x2/i);
    const expected = countDifferences(c2, c1);
    expect(last.score).toBe(expected);
  });
});
