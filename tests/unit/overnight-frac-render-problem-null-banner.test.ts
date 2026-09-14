/**
 * Overnight TOKENMAXX — Frac-Fact renderProblem null leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

describe('Overnight frac-fact — renderProblem null', () => {
  it('shows no-problem banner', () => {
    const el = renderProblem(createInitialState('easy'));
    expect(el.querySelector('.frac-no-problem') || el.textContent).toBeTruthy();
    expect(el.textContent).toMatch(/No problem/i);
  });
});
