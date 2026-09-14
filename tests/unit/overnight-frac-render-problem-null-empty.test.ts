/**
 * Overnight TOKENMAXX HEAVY — frac-fact render problem null leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderProblem, renderAnswerChoices } from '../../src/games/frac-fact/board-ui';

beforeEach(() => { document.body.innerHTML = ''; });
afterEach(() => { document.body.innerHTML = ''; });

describe('Overnight frac-fact — render empty states', () => {
  it('null problem shows no-problem chrome', () => {
    const state = { ...createInitialState(), currentProblem: null };
    const el = renderProblem(state);
    expect(el.querySelector('.frac-no-problem')).toBeTruthy();
  });

  it('non-playing phase yields empty choices container', () => {
    const open = createInitialState();
    const state = { ...open, phase: 'showingResult' as const };
    const el = renderAnswerChoices(state, () => {});
    expect(el.querySelectorAll('.frac-choice-btn').length).toBe(0);
  });
});
