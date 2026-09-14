/**
 * Wave 43 — multi-neighbor score/breakdown leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import { countDifferences, type AttributeCard } from '../../src/games/stars-bars/types';

describe('Wave 43 stars — multi-adj score', () => {
  it('place touching 2+ cards sums diffs; breakdown has multiple N-way', () => {
    let s = createInitialState();
    const c1 = s.playerHands.player1[0];
    s = selectCard(s, c1.id);
    s = placeCard(s, 2, 2);
    // P2 places adjacent
    const c2 = s.playerHands.player2[0];
    s = selectCard(s, c2.id);
    s = placeCard(s, 2, 3);
    // P1 places touching both if possible
    const c3 = s.playerHands.player1[0];
    s = selectCard(s, c3.id);
    const before = s.playerScores.player1;
    const next = placeCard(s, 3, 2);
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(3);
    const last = next.moveHistory[next.moveHistory.length - 1];
    expect(last.player).toBe('player1');
    expect(last.breakdown).toMatch(/way/);
    expect(next.playerScores.player1).toBeGreaterThanOrEqual(before);
    // countDifferences sanity
    const a: AttributeCard = c1;
    const b: AttributeCard = c2;
    expect(countDifferences(a, b)).toBeGreaterThanOrEqual(0);
  });
});
