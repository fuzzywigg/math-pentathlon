/**
 * Deep playtest regression — Fraction Pinball playability polish (2026-10-07).
 * No rules/scoring changes: UX, AI pacing, balls floor, vs-AI copy, touch CSS.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsAI,
  newGameVsHuman,
  getCurrentState,
} from '../../src/games/fraction-pinball/game-controller';
import {
  injectFractionPinballStyles,
  renderChallenge,
  renderGameOver,
  renderPinballBoard,
  renderResult,
  renderScores,
} from '../../src/games/fraction-pinball/board-ui';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import {
  startGame,
  submitAnswer,
} from '../../src/games/fraction-pinball/rules';
import * as pinballAi from '../../src/games/fraction-pinball/ai';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('fraction-pinball-styles')?.remove();
  document.getElementById('app')?.remove();
});

describe('Fraction Pinball deep playability', () => {
  it('floors ballsRemaining at 0 on extra misses', () => {
    let s = startGame(createInitialState());
    s = {
      ...s,
      player1Stats: { ...s.player1Stats, ballsRemaining: 0 },
    };
    const wrong = s.currentChallenge!.answerChoices.find(
      (c) => c !== s.currentChallenge!.correctAnswer
    )!;
    s = submitAnswer(s, wrong);
    expect(s.player1Stats.ballsRemaining).toBe(0);
    expect(s.player1Stats.wrongAnswers).toBe(1);
  });

  it('shows +points on hit and Continue for human result', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    newGameVsHuman();

    const correct = getCurrentState().currentChallenge!.correctAnswer;
    const btn = [
      ...root.querySelectorAll('.pinball-choice-btn'),
    ].find((el) => el.textContent === correct) as HTMLButtonElement;
    btn.click();

    expect(getCurrentState().phase).toBe('showResult');
    expect(root.querySelector('.pinball-points')?.textContent).toMatch(
      /^\+\d+ points$/
    );
    expect(root.querySelector('.pinball-continue-btn')).toBeTruthy();
    expect(root.querySelector('.pinball-status')?.textContent).toMatch(
      /Tap Continue/i
    );
  });

  it('vs-AI uses Your turn / You win labels and hides Continue on AI result', () => {
    vi.useFakeTimers();
    vi.spyOn(pinballAi, 'getAIAnswer').mockImplementation((state) => {
      return state.currentChallenge?.correctAnswer ?? null;
    });

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);
    newGameVsAI('hard');

    expect(root.querySelector('.pinball-status')?.textContent).toMatch(
      /Your turn/
    );
    expect(
      root.querySelector('.pinball-player-score.player1 .pinball-player-name')
        ?.textContent
    ).toBe('You');
    expect(
      root.querySelector('.pinball-player-score.player2 .pinball-player-name')
        ?.textContent
    ).toBe('Computer');

    const correct = getCurrentState().currentChallenge!.correctAnswer;
    (
      [...root.querySelectorAll('.pinball-choice-btn')].find(
        (el) => el.textContent === correct
      ) as HTMLButtonElement
    ).click();
    (root.querySelector('.pinball-continue-btn') as HTMLButtonElement).click();

    expect(root.textContent).toMatch(/Computer is thinking/i);
    vi.advanceTimersByTime(650);
    expect(getCurrentState().phase).toBe('showResult');
    expect(root.querySelector('.pinball-continue-btn')).toBeNull();
    expect(root.querySelector('.pinball-auto-advance')).toBeTruthy();

    vi.advanceTimersByTime(900);
    // After auto-continue, either next human turn or game over
    expect(['answering', 'gameOver']).toContain(getCurrentState().phase);
  });

  it('renderGameOver vs-AI says You win / Computer wins', () => {
    const you = renderGameOver(
      { ...createInitialState(), phase: 'gameOver', winner: 'player1' },
      'human-vs-ai'
    );
    expect(you.querySelector('.pinball-winner-banner')?.textContent).toBe(
      'You win! 🏆'
    );
    const ai = renderGameOver(
      { ...createInitialState(), phase: 'gameOver', winner: 'player2' },
      'human-vs-ai'
    );
    expect(ai.querySelector('.pinball-winner-banner')?.textContent).toBe(
      'Computer wins! 🏆'
    );
    // Default HvH leftovers unchanged
    const hvh = renderGameOver({
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
    });
    expect(hvh.querySelector('.pinball-winner-banner')?.textContent).toBe(
      'Blue Wins! 🏆'
    );
  });

  it('decorative board is inert (aria-hidden, no pointer events)', () => {
    const svg = renderPinballBoard(createInitialState());
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.style.pointerEvents).toBe('none');
  });

  it('choice buttons carry type=button and answer aria-label', () => {
    const el = renderChallenge(startGame(createInitialState()), () => undefined);
    const btn = el.querySelector('.pinball-choice-btn') as HTMLButtonElement;
    expect(btn.type).toBe('button');
    expect(btn.getAttribute('aria-label')).toMatch(/^Answer /);
  });

  it('CSS keeps coarse targets ≥48px and challenge-first layout', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')?.textContent || '';
    expect(css).toMatch(/min-height:\s*48px/);
    expect(css).toMatch(/pointer:\s*coarse/);
    expect(css).toMatch(/\.pinball-challenge[\s\S]*order:\s*1/);
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
  });

  it('renderScores vs-AI labels You / Computer; HvH Blue / Red', () => {
    const ai = renderScores(createInitialState(), 'human-vs-ai');
    expect(
      ai.querySelector('.pinball-player-score.player1 .pinball-player-name')
        ?.textContent
    ).toBe('You');
    const hvh = renderScores(createInitialState());
    expect(
      hvh.querySelector('.pinball-player-score.player1 .pinball-player-name')
        ?.textContent
    ).toBe('Blue');
  });

  it('omits Continue when showContinue is false', () => {
    const el = renderResult(
      {
        ...createInitialState(),
        phase: 'showResult',
        isCorrect: true,
        currentChallenge: {
          id: 'c',
          type: 'fractionToDecimal',
          fraction: { numerator: 1, denominator: 2 },
          decimal: 0.5,
          answerChoices: ['0.5'],
          correctAnswer: '0.5',
        },
      },
      () => undefined,
      { pointsAwarded: 20, showContinue: false }
    );
    expect(el.querySelector('.pinball-continue-btn')).toBeNull();
    expect(el.querySelector('.pinball-points')?.textContent).toBe('+20 points');
  });
});
