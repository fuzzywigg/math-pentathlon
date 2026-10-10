/**
 * q-mp-520 / UI coverage round 51 — frac-fact board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. Skip ai.ts / rules.ts product paths.
 *
 * Live tip remeasure (post949): board-ui 100% lines / 39/40 branches;
 * controller 105/107 lines / 45/47 branches. Residuals: progress-fill
 * instanceof false arm (board-ui L304), clearResultTimer true arm
 * (controller L55–57), tutorial step-changed soft-miss (L252 outer false).
 * Prior #870 / r26 left open (contained) — do not comment/close.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell } from './helpers/dom';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderScores } from '../../src/games/frac-fact/board-ui';
import {
  nextProblem,
  startGame,
  submitAnswer,
} from '../../src/games/frac-fact/rules';
import * as fracAi from '../../src/games/frac-fact/ai';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  styleIds: ['frac-fact-styles'],
  fakeTimers: true,
});

afterEach(async () => {
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/frac-fact/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

describe('q-mp-520 ui-cov-r51 frac-fact board-ui residuals', () => {
  it('renderScores soft-misses when progress-fill query returns null', () => {
    const playing = startGame(createInitialState('easy'));
    expect(playing.currentProblem).not.toBeNull();

    const original = Element.prototype.querySelector;
    const spy = vi
      .spyOn(Element.prototype, 'querySelector')
      .mockImplementation(function (this: Element, selectors: string) {
        if (selectors === '.frac-progress-fill') {
          return null;
        }
        return original.call(this, selectors);
      });

    const scores = renderScores(playing);
    spy.mockRestore();

    expect(scores.classList.contains('frac-scores')).toBe(true);
    expect(scores.querySelectorAll('.frac-player-score')).toHaveLength(2);
    expect(scores.querySelector('.frac-progress')).toBeTruthy();
    // Markup still has the fill node; the L304 false arm skipped the width write.
    const fill = scores.querySelector('.frac-progress-fill');
    expect(fill).toBeInstanceOf(HTMLElement);
    expect((fill as HTMLElement).style.width).toBe('');
  });
});

describe('q-mp-520 ui-cov-r51 frac-fact controller residuals', () => {
  it('clearResultTimer true arm via destroy while AI resultTimer pending', async () => {
    const {
      initGame,
      newGameVsAI,
      getCurrentState,
      __setStateForTests,
      destroyGame,
    } = await import('../../src/games/frac-fact/game-controller');

    const shell = mountAppShell();
    initGame(shell);
    newGameVsAI('easy', 'easy');

    let state = getCurrentState();
    state = submitAnswer(state, state.currentProblem!.answerChoices[0]!);
    state = nextProblem(state);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('playing');

    const pick = state.currentProblem!.answerChoices[0]!;
    vi.spyOn(fracAi, 'getAIAnswer').mockReturnValue(pick);
    __setStateForTests(state);
    await vi.advanceTimersByTimeAsync(1000);
    expect(getCurrentState().phase).toBe('showingResult');
    expect(shell.querySelector('.frac-continue-btn')).toBeTruthy();
    // resultTimer armed at 1500ms — destroy must clear it (L55–57 true arm).
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    destroyGame();
    expect(shell.querySelector('.frac-game-container')).toBeTruthy();
  });

  it('clearResultTimer true arm via newGameVsHuman while resultTimer pending', async () => {
    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      getCurrentState,
      __setStateForTests,
      destroyGame,
    } = await import('../../src/games/frac-fact/game-controller');

    const shell = mountAppShell();
    initGame(shell);
    newGameVsAI('easy', 'medium');

    let state = getCurrentState();
    state = submitAnswer(state, state.currentProblem!.answerChoices[0]!);
    state = nextProblem(state);
    vi.spyOn(fracAi, 'getAIAnswer').mockReturnValue(
      state.currentProblem!.answerChoices[0]!
    );
    __setStateForTests(state);
    await vi.advanceTimersByTimeAsync(1000);
    expect(getCurrentState().phase).toBe('showingResult');

    newGameVsHuman('easy');
    expect(getCurrentState().phase).toBe('playing');
    expect(getCurrentState().problemsCompleted).toBe(0);
    expect(shell.querySelector('.frac-game-container')).toBeTruthy();
    expect(shell.querySelector('.frac-choice-btn')).toBeTruthy();

    destroyGame();
  });

  it('tutorial step-changed soft-miss keeps listener; exit skips remount', async () => {
    const {
      initGame,
      startTutorial,
      isTutorialActive,
      getCurrentState,
      destroyGame,
    } = await import('../../src/games/frac-fact/game-controller');

    const shell = mountAppShell();
    initGame(shell);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(shell.querySelector('.frac-game-container')).toBeTruthy();

    // Outer L252 false arm: step-changed is neither completed nor exited.
    const beforeIdx = tutorialManager.getCurrentStepIndex();
    const total = tutorialManager.getTotalSteps();
    expect(total).toBeGreaterThan(1);
    tutorialManager.nextStep();
    expect(isTutorialActive()).toBe(true);
    expect(tutorialManager.getCurrentStepIndex()).toBe(beforeIdx + 1);

    // Still subscribed → exit unsubscribes without completed remount path.
    const phaseBeforeExit = getCurrentState().phase;
    const completedBeforeExit = getCurrentState().problemsCompleted;
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(getCurrentState().phase).toBe(phaseBeforeExit);
    expect(getCurrentState().problemsCompleted).toBe(completedBeforeExit);
    expect(shell.querySelector('.frac-game-container')).toBeTruthy();

    // completed arm still remounts (structure only; no copy pins).
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(getCurrentState().phase).toBe('playing');
    expect(shell.querySelector('.frac-status')).toBeTruthy();

    destroyGame();
  });
});
