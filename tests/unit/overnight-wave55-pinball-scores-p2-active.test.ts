/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball scores player2 active leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderScores } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 55 pinball board — p2 active', () => {
  it('marks player2 score active leftover', () => {
    const el = renderScores({
      ...createInitialState(),
      currentPlayer: 'player2',
      roundNumber: 4,
      player2Stats: {
        score: 60,
        correctAnswers: 2,
        wrongAnswers: 0,
        ballsRemaining: 5,
      },
    });
    expect(el.querySelector('.pinball-player-score.player1')?.classList.contains('active')).toBe(
      false
    );
    expect(el.querySelector('.pinball-player-score.player2')?.classList.contains('active')).toBe(
      true
    );
    expect(el.querySelector('.pinball-round-value')?.textContent).toBe('4/10');
    expect(el.querySelector('.pinball-player-score.player2 .pinball-score-value')?.textContent).toBe(
      '60'
    );
  });
});
