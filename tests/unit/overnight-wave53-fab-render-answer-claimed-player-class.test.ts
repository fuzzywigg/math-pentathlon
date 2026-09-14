/**
 * Wave 53 leftover after #235 — Fab answer claimed player classes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderAnswerBoard } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — answer claimed classes', () => {
  it('adds fab-answer-player1 / player2 on claimed wrappers', () => {
    const base = createInitialState();
    const [a, b] = [...base.answerBars.keys()];
    const answers = new Map(base.answerBars);
    answers.set(a, { ...answers.get(a)!, claimedBy: 'player1' });
    answers.set(b, { ...answers.get(b)!, claimedBy: 'player2' });
    const el = renderAnswerBoard({ ...base, answerBars: answers }, () => undefined);
    expect(el.querySelector(`[data-answer-id="${a}"]`)?.classList.contains('fab-answer-player1')).toBe(true);
    expect(el.querySelector(`[data-answer-id="${b}"]`)?.classList.contains('fab-answer-player2')).toBe(true);
  });
});
