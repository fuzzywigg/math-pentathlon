/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact final-stats bullet separator.
 * Wave55/56 matched correct and Best streak separately. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Wave 57 frac board — final stats bullet', () => {
  it('joins correct ratio and Best streak with bullet leftover', () => {
    const el = renderGameOver({
      ...createInitialState('easy'),
      phase: 'gameOver',
      winner: 'player1',
      player1Stats: {
        score: 40,
        correctAnswers: 3,
        wrongAnswers: 2,
        currentStreak: 0,
        bestStreak: 2,
      },
    });
    const stats = el.querySelector(
      '.frac-final-score.player1 .frac-final-stats'
    )?.textContent;
    expect(stats?.replace(/\s+/g, ' ').trim()).toBe(
      '3/5 correct • Best streak: 2'
    );
  });
});
