/**
 * Overnight TOKENMAXX — Frac-Fact renderAnswerChoices leftover. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { generateProblem } from '../../src/games/frac-fact/rules';
import { renderAnswerChoices } from '../../src/games/frac-fact/board-ui';

describe('Overnight frac-fact — render choices', () => {
  it('off-phase empty; playing four buttons', () => {
    const idle = renderAnswerChoices(createInitialState('easy'), () => {});
    expect(idle.querySelectorAll('.frac-choice-btn')).toHaveLength(0);
    const s = {
      ...createInitialState('easy'),
      currentProblem: generateProblem('easy', 1),
      phase: 'playing' as const,
    };
    const spy = vi.fn();
    const el = renderAnswerChoices(s, spy);
    expect(el.querySelectorAll('.frac-choice-btn')).toHaveLength(4);
    (el.querySelector('.frac-choice-btn') as HTMLButtonElement).click();
    expect(spy).toHaveBeenCalled();
  });
});
