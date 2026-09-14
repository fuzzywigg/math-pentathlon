/**
 * Overnight TOKENMAXX — Frac-Fact renderScores leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { generateProblem } from '../../src/games/frac-fact/rules';
import { renderScores } from '../../src/games/frac-fact/board-ui';

describe('Overnight frac-fact — renderScores', () => {
  it('marks active seat', () => {
    const s = {
      ...createInitialState('easy'),
      currentProblem: generateProblem('easy', 1),
      phase: 'playing' as const,
    };
    const el = renderScores(s);
    expect(el.querySelector('.active')).toBeTruthy();
    expect(el.textContent).toMatch(/Blue|Red/i);
  });
});
