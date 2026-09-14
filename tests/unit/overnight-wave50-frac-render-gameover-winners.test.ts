/**
 * Overnight HEAVY leftover after #229 — Frac Fact game-over banners. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

function over(winner: 'player1' | 'player2' | null) {
  return {
    ...createInitialState('easy'),
    phase: 'gameOver' as const,
    winner,
    player1Stats: {
      score: 40,
      correctAnswers: 4,
      wrongAnswers: 1,
      currentStreak: 0,
      bestStreak: 3,
    },
    player2Stats: {
      score: 30,
      correctAnswers: 3,
      wrongAnswers: 2,
      currentStreak: 0,
      bestStreak: 2,
    },
  };
}

describe('Wave 50 frac — game over', () => {
  it('Blue / Red / Draw banners + final score chrome', () => {
    expect(renderGameOver(over('player1')).querySelector('.frac-winner-banner')?.textContent).toMatch(
      /Blue Wins/
    );
    expect(renderGameOver(over('player2')).querySelector('.frac-winner-banner')?.textContent).toMatch(
      /Red Wins/
    );
    expect(renderGameOver(over(null)).querySelector('.frac-winner-banner')?.textContent).toMatch(
      /It's a Draw!/
    );
    const el = renderGameOver(over('player1'));
    expect(el.querySelector('.frac-final-score.player1')?.textContent).toMatch(/40 points/);
    expect(el.querySelector('.frac-final-score.player1')?.textContent).toMatch(/4\/5 correct/);
    expect(el.querySelector('.frac-final-score.player1')?.textContent).toMatch(/Best streak: 3/);
  });
});
