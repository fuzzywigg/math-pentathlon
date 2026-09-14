/**
 * Wave 53 leftover after #235 — Fab answer board shell + ids. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderAnswerBoard } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — answer shell', () => {
  it('renders Answer Bars header, grid, and data-answer-id stamps', () => {
    const state = createInitialState();
    const el = renderAnswerBoard(state, () => undefined);
    expect(el.classList.contains('fab-answer-board')).toBe(true);
    expect(el.querySelector('.fab-section-header')?.textContent).toBe('Answer Bars');
    expect(el.querySelector('.fab-answer-grid')).toBeTruthy();
    const ids = [...el.querySelectorAll('.fab-answer-wrapper')].map(
      (n) => (n as HTMLElement).dataset.answerId
    );
    expect(ids.sort()).toEqual([...state.answerBars.keys()].sort());
  });
});
