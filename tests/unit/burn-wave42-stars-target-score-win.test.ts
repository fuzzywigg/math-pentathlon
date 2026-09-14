/**
 * Wave 42 — Stars & Bars TARGET_SCORE win via score bump. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';
import { CONFIG, countDifferences } from '../../src/games/stars-bars/types';
import type { StarsState } from '../../src/games/stars-bars/types';

describe('Wave 42 stars — TARGET_SCORE win', () => {
  it('reaching TARGET_SCORE ends game for placer', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 2, 1);

    const card2 = state.playerHands.player2[0];
    const seeded = state.cells[2][1].card!;
    const diff = countDifferences(card2, seeded);
    expect(diff).toBeGreaterThan(0);

    // Bump so this placement crosses the threshold
    const bumped: StarsState = {
      ...state,
      playerScores: {
        ...state.playerScores,
        player2: CONFIG.TARGET_SCORE - diff,
      },
    };
    let next = selectCard(bumped, card2.id);
    next = placeCard(next, 1, 1);
    expect(next.playerScores.player2).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
    expect(next.currentPlayer).toBe('player2');
  });

  it('score below TARGET_SCORE keeps selectingCard phase', () => {
    let state = createInitialState();
    state = selectCard(state, state.playerHands.player1[0].id);
    state = placeCard(state, 0, 1);
    expect(state.phase).toBe('selectingCard');
    expect(state.winner).toBeNull();
    expect(state.playerScores.player1).toBeLessThan(CONFIG.TARGET_SCORE);
  });
});
