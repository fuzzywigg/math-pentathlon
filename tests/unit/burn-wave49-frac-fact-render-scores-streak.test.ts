/**
 * Wave 49 — Frac-fact scores streak + progress. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderScores } from '../../src/games/frac-fact/board-ui';

describe('Wave 49 frac-fact — scores', () => {
  it('shows streak and progress text', () => {
    const s = createInitialState();
    s.player1Stats = { ...s.player1Stats, score: 12, currentStreak: 3 };
    s.problemsCompleted = 2;
    const el = renderScores(s);
    expect(el.querySelector('.frac-score-value')?.textContent).toBe('12');
    expect(el.querySelector('.frac-streak')?.textContent).toContain('3');
    expect(el.querySelector('.frac-progress-text')?.textContent).toMatch(/Problem 3 of/);
    expect(el.querySelector('.frac-player-score')?.classList.contains('active')).toBe(true);
  });
});
