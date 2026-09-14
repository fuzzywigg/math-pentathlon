/**
 * Wave 55 leftover after #249/#250 — Fab matchable answer cursor + stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
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

describe('Wave 55 fab — matchable cursor stroke', () => {
  it('matchable unclaimed wrapper is pointer with #4caf50 stroke', () => {
    const base = createInitialState();
    const found = findMatch(base);
    expect(found).not.toBeNull();
    let state = selectBar1(base, found!.b1);
    state = selectBar2(state, found!.b2);
    state = selectOperation(state, found!.op);
    const el = renderAnswerBoard(state, () => undefined);
    const wrap = el.querySelector(
      `[data-answer-id="${found!.ans}"]`
    ) as HTMLElement;
    expect(wrap.style.cursor).toBe('pointer');
    const strokes = [...wrap.querySelectorAll('rect')].map((r) =>
      r.getAttribute('stroke')
    );
    expect(strokes).toContain('#4caf50');

    const claimedId = [...state.answerBars.values()].find(
      (a) => a.id !== found!.ans
    )!.id;
    const answers = new Map(state.answerBars);
    answers.set(claimedId, { ...answers.get(claimedId)!, claimedBy: 'player1' });
    const claimedEl = renderAnswerBoard(
      { ...state, answerBars: answers },
      () => undefined
    );
    const claimed = claimedEl.querySelector(
      `[data-answer-id="${claimedId}"]`
    ) as HTMLElement;
    expect(claimed.style.cursor).not.toBe('pointer');
  });
});
