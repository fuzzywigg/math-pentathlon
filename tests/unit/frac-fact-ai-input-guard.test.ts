/**
 * Human answer taps must not succeed during the computer think pause.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, submitAnswer, nextProblem } from '../../src/games/frac-fact/rules';
import { renderAnswerChoices } from '../../src/games/frac-fact/board-ui';

describe('Frac Fact AI-turn input guard', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('frac-fact-styles')?.remove();
    document.getElementById('app')?.remove();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.getElementById('frac-fact-styles')?.remove();
    document.getElementById('app')?.remove();
  });

  it('renderAnswerChoices with allowInput false disables choice buttons', () => {
    const state = startGame(createInitialState('easy'));
    expect(state.phase).toBe('playing');
    expect(state.currentProblem).not.toBeNull();

    const el = renderAnswerChoices(state, () => undefined, {
      allowInput: false,
    });
    const buttons = el.querySelectorAll('.frac-choice-btn');
    expect(buttons.length).toBeGreaterThan(0);
    expect(el.querySelectorAll('.frac-choice-btn.disabled').length).toBe(
      buttons.length
    );
    expect(el.querySelector('[aria-disabled="true"]')).toBeTruthy();
    expect(
      [...buttons].every((b) => (b as HTMLButtonElement).disabled)
    ).toBe(true);
  });

  it('blocks answering during the 1000ms AI pause', async () => {
    const { initGame, newGameVsAI, getCurrentState, __setStateForTests } =
      await import('../../src/games/frac-fact/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const root = document.createElement('div');
    document.body.appendChild(root);

    initGame(root);
    newGameVsAI('easy', 'easy');

    // Drive Blue through one answer so Red (computer) is up.
    let state = getCurrentState();
    const answer = state.currentProblem!.answerChoices[0]!;
    state = submitAnswer(state, answer);
    state = nextProblem(state);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('playing');
    __setStateForTests(state);

    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(root.querySelector('.frac-status')?.textContent).toMatch(
      /Computer is thinking/
    );
    expect(root.querySelectorAll('.frac-choice-btn:not(:disabled)')).toHaveLength(
      0
    );
    expect(root.querySelectorAll('.frac-choice-btn.disabled').length).toBeGreaterThan(
      0
    );

    const problemsCompleted = getCurrentState().problemsCompleted;
    const problemId = getCurrentState().currentProblem!.id;
    const disabled = root.querySelector(
      '.frac-choice-btn'
    ) as HTMLButtonElement;
    disabled?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    // Also try forcing click on a cloned enabled-looking path — handler is guarded.
    expect(getCurrentState().phase).toBe('playing');
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().problemsCompleted).toBe(problemsCompleted);
    expect(getCurrentState().currentProblem!.id).toBe(problemId);
    expect(getCurrentState().selectedAnswer).toBeNull();

    await vi.advanceTimersByTimeAsync(1000);
    expect(getCurrentState().phase).toBe('showingResult');
    expect(getCurrentState().selectedAnswer).not.toBeNull();
  });
});
