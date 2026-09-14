/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact choice buttons type=button leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderAnswerChoices } from '../../src/games/frac-fact/board-ui';

describe('Wave 55 frac board — choice type button', () => {
  it('sets type=button on every choice leftover', () => {
    const el = renderAnswerChoices(
      {
        ...createInitialState('easy'),
        phase: 'playing',
        currentProblem: {
          id: 't',
          operand1: { numerator: 1, denominator: 2 },
          operand2: { numerator: 1, denominator: 4 },
          operation: 'add',
          correctAnswer: { numerator: 3, denominator: 4 },
          answerChoices: [
            { numerator: 3, denominator: 4 },
            { numerator: 1, denominator: 2 },
          ],
        },
      },
      () => undefined
    );
    const btns = el.querySelectorAll('.frac-choice-btn');
    expect(btns.length).toBe(2);
    btns.forEach((b) => expect(b.getAttribute('type')).toBe('button'));
  });
});
