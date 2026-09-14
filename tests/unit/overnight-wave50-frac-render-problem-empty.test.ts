/**
 * Overnight HEAVY leftover after #229 — Frac Fact empty problem chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem } from '../../src/games/frac-fact/board-ui';

describe('Wave 50 frac — problem empty', () => {
  it('shows No problem loaded when currentProblem is null', () => {
    const el = renderProblem(createInitialState('easy'));
    expect(el.classList.contains('frac-problem')).toBe(true);
    expect(el.querySelector('.frac-no-problem')?.textContent).toBe('No problem loaded');
  });
});
