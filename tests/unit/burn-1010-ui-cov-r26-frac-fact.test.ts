/**
 * q-mp-380 / UI coverage round 26 — frac-fact board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. Skip ai.ts / rules.ts product paths.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import { createInitialState } from '../../src/games/frac-fact/types';
import {
  injectFracFactStyles,
  renderAnswerChoices,
  renderGameOver,
  renderProblem,
  renderResult,
  renderScores,
} from '../../src/games/frac-fact/board-ui';
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

function playingState() {
  return startGame(createInitialState('easy'));
}

describe('q-mp-380 ui-cov-r26 frac-fact board-ui residuals', () => {
  it('renderProblem empty-problem chrome + inject idempotence', () => {
    const empty = renderProblem(createInitialState('medium'));
    expect(empty.classList.contains('frac-problem')).toBe(true);
    expect(empty.querySelector('.frac-no-problem')).toBeTruthy();
    expect(empty.querySelector('.frac-problem-display')).toBeNull();

    injectFracFactStyles();
    injectFracFactStyles();
    expect(document.querySelectorAll('#frac-fact-styles')).toHaveLength(1);
  });

  it('choices phase-gate / allowInput default / result + scores + gameOver chrome', () => {
    const onSelect = vi.fn();
    const playing = playingState();
    expect(playing.currentProblem).not.toBeNull();

    // Non-playing phase → empty choices container (no buttons).
    const gated = renderAnswerChoices(
      { ...playing, phase: 'showingResult' },
      onSelect
    );
    expect(gated.classList.contains('frac-choices')).toBe(true);
    expect(gated.querySelectorAll('.frac-choice-btn')).toHaveLength(0);

    // Default allowInput (omit options) wires click → onSelect.
    const live = renderAnswerChoices(playing, onSelect);
    const btn = live.querySelector('.frac-choice-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(false);
    btn.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]![0]).toEqual(
      playing.currentProblem!.answerChoices[0]
    );

    // Result early-return when not showingResult.
    const emptyResult = renderResult(playing, () => undefined);
    expect(emptyResult.classList.contains('frac-result')).toBe(true);
    expect(emptyResult.querySelector('.frac-continue-btn')).toBeNull();

    const answered = submitAnswer(
      playing,
      playing.currentProblem!.answerChoices[0]!
    );
    expect(answered.phase).toBe('showingResult');
    const result = renderResult(answered, () => undefined);
    expect(result.querySelector('.frac-continue-btn')).toBeTruthy();
    expect(result.querySelector('.frac-feedback')).toBeTruthy();
    expect(
      result
        .querySelector('.frac-feedback')!
        .classList.contains(answered.isCorrect ? 'correct' : 'incorrect')
    ).toBe(true);

    // Scores: p2 active + streak chrome when streak > 0.
    const streaked = {
      ...answered,
      currentPlayer: 'player2' as const,
      player2Stats: {
        ...answered.player2Stats,
        currentStreak: 2,
        score: 15,
      },
    };
    const scores = renderScores(streaked);
    expect(scores.querySelectorAll('.frac-player-score')).toHaveLength(2);
    expect(scores.querySelectorAll('.frac-player-score.active')).toHaveLength(
      1
    );
    expect(scores.querySelector('.frac-progress-fill')).toBeInstanceOf(
      HTMLElement
    );
    expect(
      (scores.querySelector('.frac-progress-fill') as HTMLElement).style.width
    ).toMatch(/%$/);

    // Game-over draw banner presence (class only).
    const draw = renderGameOver({
      ...answered,
      phase: 'gameOver',
      winner: null,
    });
    expect(draw.querySelector('.frac-winner-banner')).toBeTruthy();
    expect(draw.querySelectorAll('.frac-final-score')).toHaveLength(2);
  });
});

describe('q-mp-380 ui-cov-r26 frac-fact controller residuals', () => {
  it('post-destroy paint drop + stale choice/continue guards', async () => {
    const { initGame, destroyGame, getCurrentState, __setStateForTests } =
      await import('../../src/games/frac-fact/game-controller');

    const root = mountRoot();
    initGame(root);
    expect(root.querySelector('.frac-game-container')).toBeTruthy();

    const choice = root.querySelector('.frac-choice-btn') as HTMLButtonElement;
    expect(choice).toBeTruthy();

    // Answer → showingResult; keep stale choice reference for phase guard.
    choice.click();
    expect(getCurrentState().phase).toBe('showingResult');
    const continueBtn = root.querySelector(
      '.frac-continue-btn'
    ) as HTMLButtonElement;
    expect(continueBtn).toBeTruthy();

    // Stale choice after phase left playing → handleAnswerSelect early return.
    const phaseBeforeStale = getCurrentState().phase;
    choice.click();
    expect(getCurrentState().phase).toBe(phaseBeforeStale);

    continueBtn.click();
    expect(getCurrentState().phase).toBe('playing');

    // Stale continue after leaving showingResult → handleContinue early return.
    const completed = getCurrentState().problemsCompleted;
    continueBtn.click();
    expect(getCurrentState().problemsCompleted).toBe(completed);
    expect(getCurrentState().phase).toBe('playing');

    // destroyGame drops the mount; subsequent paint must no-op (DOM left as-is).
    const beforeDestroyHtml = root.innerHTML;
    destroyGame();
    const snapshot = getCurrentState();
    expect(() => {
      __setStateForTests({
        ...snapshot,
        currentPlayer: 'player2',
      });
    }).not.toThrow();
    expect(root.innerHTML).toBe(beforeDestroyHtml);
    expect(root.querySelectorAll('.frac-game-container')).toHaveLength(1);
  });

  it('computer-turn input guard via isAITurn stub + scheduleAiTurn coalesce', async () => {
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

    // Drive Blue through one answer so Red seat is up.
    let state = getCurrentState();
    const answer = state.currentProblem!.answerChoices[0]!;
    state = submitAnswer(state, answer);
    state = nextProblem(state);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('playing');
    __setStateForTests(state);

    expect(
      shell.querySelector('.frac-status')?.classList.contains('player2')
    ).toBe(true);
    // First render armed aiTimer; second paint must hit scheduleAiTurn early return.
    const timerCount = vi.getTimerCount();
    __setStateForTests(getCurrentState());
    expect(vi.getTimerCount()).toBe(timerCount);

    // Paint with allowInput true, then flip isAITurn for the click guard arm.
    vi.spyOn(fracAi, 'isAITurn').mockReturnValue(false);
    __setStateForTests(getCurrentState());
    const liveChoice = shell.querySelector(
      '.frac-choice-btn:not(:disabled)'
    ) as HTMLButtonElement | null;
    expect(liveChoice).toBeTruthy();
    vi.mocked(fracAi.isAITurn).mockReturnValue(true);
    const beforePhase = getCurrentState().phase;
    const beforeId = getCurrentState().currentProblem!.id;
    liveChoice!.click();
    expect(getCurrentState().phase).toBe(beforePhase);
    expect(getCurrentState().currentProblem!.id).toBe(beforeId);
    expect(getCurrentState().selectedAnswer).toBeNull();

    destroyGame();
  });

  it('stubbed AI null + auto-continue timer + aiTurn phase/problem guards', async () => {
    const {
      initGame,
      newGameVsAI,
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
    expect(state.currentPlayer).toBe('player2');

    // Null AI answer → aiTurn returns without submit (structure only).
    vi.spyOn(fracAi, 'getAIAnswer').mockReturnValue(null);
    __setStateForTests(state);
    await vi.advanceTimersByTimeAsync(1000);
    expect(getCurrentState().phase).toBe('playing');
    expect(getCurrentState().selectedAnswer).toBeNull();
    expect(fracAi.getAIAnswer).toHaveBeenCalled();

    // Non-null stub → showingResult + arm resultTimer auto-continue.
    const pick = getCurrentState().currentProblem!.answerChoices[0]!;
    vi.mocked(fracAi.getAIAnswer).mockReturnValue(pick);
    __setStateForTests(getCurrentState());
    await vi.advanceTimersByTimeAsync(1000);
    expect(getCurrentState().phase).toBe('showingResult');
    expect(shell.querySelector('.frac-continue-btn')).toBeTruthy();

    await vi.advanceTimersByTimeAsync(1500);
    expect(getCurrentState().phase).not.toBe('showingResult');
    expect(getCurrentState().problemsCompleted).toBeGreaterThan(0);

    // Re-arm AI → showingResult, then forge phase away before resultTimer fires
    // (covers resultTimer callback when phase !== showingResult).
    newGameVsAI('easy', 'medium');
    state = getCurrentState();
    state = submitAnswer(state, state.currentProblem!.answerChoices[0]!);
    state = nextProblem(state);
    vi.mocked(fracAi.getAIAnswer).mockReturnValue(
      state.currentProblem!.answerChoices[0]!
    );
    __setStateForTests(state);
    await vi.advanceTimersByTimeAsync(1000);
    expect(getCurrentState().phase).toBe('showingResult');
    const completedAtResult = getCurrentState().problemsCompleted;
    // Keep human seat so render does not re-arm scheduleAiTurn while resultTimer lives.
    __setStateForTests({
      ...getCurrentState(),
      phase: 'playing',
      currentPlayer: 'player1',
      selectedAnswer: null,
      isCorrect: null,
    });
    await vi.advanceTimersByTimeAsync(1500);
    expect(getCurrentState().phase).toBe('playing');
    expect(getCurrentState().currentPlayer).toBe('player1');
    expect(getCurrentState().problemsCompleted).toBe(completedAtResult);

    // Fresh AI-pending seat: arm timer, then flip phase before fire.
    newGameVsAI('easy', 'medium');
    state = getCurrentState();
    state = submitAnswer(state, state.currentProblem!.answerChoices[0]!);
    state = nextProblem(state);
    expect(state.currentPlayer).toBe('player2');
    vi.mocked(fracAi.getAIAnswer).mockReturnValue(
      state.currentProblem!.answerChoices[0]!
    );
    __setStateForTests(state);
    // Flip to showingResult before the 1000ms AI timer fires.
    __setStateForTests({
      ...getCurrentState(),
      phase: 'showingResult',
      selectedAnswer: state.currentProblem!.answerChoices[0]!,
      isCorrect: true,
    });
    const phaseGuard = getCurrentState().phase;
    await vi.advanceTimersByTimeAsync(1000);
    expect(getCurrentState().phase).toBe(phaseGuard);

    // Playing + player2 + null problem → aiTurn problem early return.
    vi.mocked(fracAi.getAIAnswer).mockClear();
    __setStateForTests({
      ...createInitialState('easy'),
      phase: 'playing',
      currentPlayer: 'player2',
      currentProblem: null,
    });
    await vi.advanceTimersByTimeAsync(1000);
    expect(getCurrentState().currentProblem).toBeNull();
    expect(getCurrentState().selectedAnswer).toBeNull();

    destroyGame();
  });

  it('startTutorial lifecycle + setDifficulty gate + resultTimer clear on continue', async () => {
    const {
      initGame,
      newGameVsHuman,
      setDifficulty,
      getCurrentState,
      startTutorial,
      isTutorialActive,
      destroyGame,
    } = await import('../../src/games/frac-fact/game-controller');

    const shell = mountAppShell();
    initGame(shell);

    setDifficulty('hard');
    expect(getCurrentState().difficulty).toBe('hard');

    // Human answer → showingResult → continue clears resultTimer path.
    (shell.querySelector('.frac-choice-btn') as HTMLButtonElement).click();
    expect(getCurrentState().phase).toBe('showingResult');
    (shell.querySelector('.frac-continue-btn') as HTMLButtonElement).click();
    expect(getCurrentState().phase).toBe('playing');
    expect(getCurrentState().problemsCompleted).toBe(1);

    // Gate: setDifficulty no-ops after progress.
    setDifficulty('easy');
    expect(getCurrentState().difficulty).toBe('hard');

    newGameVsHuman('medium');
    expect(getCurrentState().difficulty).toBe('medium');
    expect(getCurrentState().problemsCompleted).toBe(0);

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(shell.querySelector('.frac-game-container')).toBeTruthy();
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(getCurrentState().phase).toBe('playing');
    expect(shell.querySelector('.frac-game-container')).toBeTruthy();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);

    destroyGame();
  });
});
