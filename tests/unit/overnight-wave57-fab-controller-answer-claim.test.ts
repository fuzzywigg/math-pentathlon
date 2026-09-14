/**
 * Wave 57 leftover after #257 — Fab controller answer claim happy path. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';
import {
  calculateResult,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

function findMatch(state: ReturnType<typeof newGameVsHuman>['state']) {
  const unused = [...state.fractionBars.values()].filter((b) => !b.used);
  for (let i = 0; i < unused.length; i++) {
    for (let j = 0; j < unused.length; j++) {
      if (i === j) continue;
      for (const op of ['add', 'subtract', 'multiply', 'divide'] as const) {
        const result = calculateResult(
          unused[i].fraction,
          unused[j].fraction,
          op
        );
        if (!result || result.numerator < 0) continue;
        const matches = findMatchingAnswers(state, result);
        if (matches.length) {
          return { b1: unused[i].id, b2: unused[j].id, ans: matches[0] };
        }
      }
    }
  }
  return null;
}

describe('Wave 57 fab — answer claim', () => {
  it('bar→op→matchable claim grows history and score chrome', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    const found = findMatch(ctrl.state);
    expect(found).not.toBeNull();

    (
      container.querySelector(`[data-bar-id="${found!.b1}"]`) as HTMLElement
    ).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    (
      container.querySelector(`[data-bar-id="${found!.b2}"]`) as HTMLElement
    ).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    (container.querySelector('.fab-op-valid') as HTMLElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(ctrl.state.phase).toBe('confirmingMove');

    const matchable = container.querySelector(
      `.fab-answer-matchable[data-answer-id="${found!.ans}"]`
    ) as HTMLElement;
    expect(matchable).toBeTruthy();
    matchable.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(ctrl.state.moveHistory.length).toBe(1);
    expect(ctrl.state.scores.player1).toBe(1);
    expect(container.querySelector('.fab-history')).toBeTruthy();
    expect(container.querySelector('.fab-score-p1')?.textContent).toMatch(/1/);
  });
});
