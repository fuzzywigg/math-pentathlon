/**
 * Wave 48 — Pinball renderResult correct/incorrect. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderResult } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 48 pinball — result banners', () => {
  it('empty outside showResult; correct/incorrect branches', () => {
    expect(renderResult(createInitialState(), () => undefined).children.length).toBe(0);
    const challenge = {
      id: 'c',
      type: 'fractionToDecimal' as const,
      fraction: { numerator: 1, denominator: 2 },
      decimal: 0.5,
      answerChoices: ['0.5'],
      correctAnswer: '0.5',
    };
    const onCont = vi.fn();
    const ok = renderResult(
      { ...createInitialState(), phase: 'showResult', currentChallenge: challenge, isCorrect: true },
      onCont
    );
    expect(ok.querySelector('.pinball-feedback.correct')).toBeTruthy();
    expect(ok.textContent).toMatch(/HIT/i);
    (ok.querySelector('.pinball-continue-btn') as HTMLElement).click();
    expect(onCont).toHaveBeenCalled();
    const bad = renderResult(
      { ...createInitialState(), phase: 'showResult', currentChallenge: challenge, isCorrect: false },
      () => undefined
    );
    expect(bad.querySelector('.pinball-feedback.incorrect')).toBeTruthy();
    expect(bad.textContent).toMatch(/Miss|0\.5/);
  });
});
