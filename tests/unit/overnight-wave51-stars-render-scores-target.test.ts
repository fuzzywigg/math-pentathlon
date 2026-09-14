/**
 * Wave 51 leftover after #233 — Stars-Bars scores target copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { CONFIG } from '../../src/games/stars-bars/types';
import { renderScores } from '../../src/games/stars-bars/board-ui';

describe('Wave 51 stars — scores target', () => {
  it('shows Blue/Red with / TARGET_SCORE', () => {
    const el = renderScores({
      ...createInitialState(),
      playerScores: { player1: 3, player2: 7 },
    });
    expect(el.querySelector('.stars-score.player1')?.textContent).toMatch(
      new RegExp(`Blue: 3 / ${CONFIG.TARGET_SCORE}`)
    );
    expect(el.querySelector('.stars-score.player2')?.textContent).toMatch(
      new RegExp(`Red: 7 / ${CONFIG.TARGET_SCORE}`)
    );
  });
});
