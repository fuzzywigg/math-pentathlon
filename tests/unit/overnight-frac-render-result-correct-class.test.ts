/**
 * Overnight TOKENMAXX HEAVY — frac-fact render result classes leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { generateProblem } from '../../src/games/frac-fact/rules';
import { renderResult } from '../../src/games/frac-fact/board-ui';

beforeEach(() => { document.body.innerHTML = ''; });
afterEach(() => { document.body.innerHTML = ''; });

describe('Overnight frac-fact — render result classes', () => {
  it('correct feedback uses .correct class', () => {
    const problem = generateProblem('easy', 1);
    const state = {
      ...createInitialState(),
      phase: 'showingResult' as const,
      currentProblem: problem,
      isCorrect: true,
    };
    const el = renderResult(state, () => {});
    expect(el.querySelector('.frac-feedback.correct')).toBeTruthy();
  });

  it('incorrect feedback uses .incorrect class', () => {
    const problem = generateProblem('easy', 2);
    const state = {
      ...createInitialState(),
      phase: 'showingResult' as const,
      currentProblem: problem,
      isCorrect: false,
    };
    const el = renderResult(state, () => {});
    expect(el.querySelector('.frac-feedback.incorrect')).toBeTruthy();
  });
});
