/**
 * Wave 53 leftover after #235 — Fab matchable answer click. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  calculateResult,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';
import { renderAnswerBoard } from '../../src/games/fab-a-diffy/board-ui';

function findMatch(state: ReturnType<typeof createInitialState>) {
  const unused = [...state.fractionBars.values()].filter((b) => !b.used);
  for (let i = 0; i < unused.length; i++) {
    for (let j = 0; j < unused.length; j++) {
      if (i === j) continue;
      for (const op of ['add', 'subtract', 'multiply', 'divide'] as const) {
        const result = calculateResult(unused[i].fraction, unused[j].fraction, op);
        if (!result || result.numerator < 0) continue;
        const matches = findMatchingAnswers(state, result);
        if (matches.length) {
          return { b1: unused[i].id, b2: unused[j].id, op, ans: matches[0] };
        }
      }
    }
  }
  return null;
}

describe('Wave 53 fab — answer matchable click', () => {
  it('fires onAnswerClick for unclaimed matchable', () => {
    const base = createInitialState();
    const found = findMatch(base);
    expect(found).not.toBeNull();
    let state = selectBar1(base, found!.b1);
    state = selectBar2(state, found!.b2);
    state = selectOperation(state, found!.op);
    const onClick = vi.fn();
    const el = renderAnswerBoard(state, onClick);
    (el.querySelector(`[data-answer-id="${found!.ans}"]`) as HTMLElement).click();
    expect(onClick).toHaveBeenCalledWith(found!.ans);
  });
});
