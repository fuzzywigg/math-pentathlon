/**
 * Overnight HEAVY leftover after #234 — Frac Fact progress bar at problemsCompleted 0.
 * Wave50 used problemsCompleted: 3 → 30%. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderScores } from '../../src/games/frac-fact/board-ui';

describe('Wave 52 frac — progress zero', () => {
  it('shows Problem 1 of N and width: 0% at start', () => {
    const state = {
      ...createInitialState('medium'),
      problemsCompleted: 0,
      maxProblems: 10,
    };
    const el = renderScores(state);
    expect(el.querySelector('.frac-progress-text')?.textContent).toBe(
      'Problem 1 of 10'
    );
    expect(el.querySelector('.frac-progress-fill')?.getAttribute('style')).toMatch(
      /width: 0%/
    );
  });
});
