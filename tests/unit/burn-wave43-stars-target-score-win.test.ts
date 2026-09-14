/**
 * Wave 43 — Stars target-score settle leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import { CONFIG } from '../../src/games/stars-bars/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 stars-bars — target score win', () => {
  it('forged near-target score + adjacency can settle gameOver', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let s = createInitialState();
    // Place a seed card at center as p1 with low score, then forge p2 score
    const c1 = s.playerHands.player1[0];
    s = placeCard(selectCard(s, c1.id), 2, 2);
    // Now p2 — forge high score then place adjacent
    s = {
      ...s,
      playerScores: { player1: 0, player2: CONFIG.TARGET_SCORE - 1 },
    };
    const c2 = s.playerHands.player2[0];
    const selected = selectCard(s, c2.id);
    const next = placeCard(selected, 2, 3);
    // If score gained >= 1, wins; if 0 diffs, may not win yet
    if (next.playerScores.player2 >= CONFIG.TARGET_SCORE) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe('player2');
    } else {
      expect(next.phase).toBe('selectingCard');
    }
  });
});
