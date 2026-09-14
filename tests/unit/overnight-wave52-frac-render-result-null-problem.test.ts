/**
 * Overnight HEAVY leftover after #234 — renderResult gate with showingResult + null problem.
 * Wave50 empty-phase only covered playing. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderResult } from '../../src/games/frac-fact/board-ui';

describe('Wave 52 frac — result null problem', () => {
  it('returns empty container when showingResult but currentProblem is null', () => {
    const state = {
      ...createInitialState('medium'),
      phase: 'showingResult' as const,
      currentProblem: null,
    };
    const el = renderResult(state, () => undefined);
    expect(el.className).toBe('frac-result');
    expect(el.children.length).toBe(0);
    expect(el.querySelector('.frac-feedback')).toBeNull();
    expect(el.querySelector('.frac-continue-btn')).toBeNull();
  });
});
