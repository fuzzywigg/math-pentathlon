/**
 * q-mp-500 / UI coverage round 45 — fraction-pinball controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. Skip ai.ts / rules.ts product paths.
 *
 * Live tip remeasure: board-ui / tutorial / types already 100%; controller
 * branch residuals were V8 lines 177 (`??` → null) and 246 (`step-changed`
 * soft-miss on the completed||exited compound). #868 r23 left open (contained).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell } from './helpers/dom';
import type { FractionPinballState } from '../../src/games/fraction-pinball/types';
import {
  injectFractionPinballStyles,
  renderChallenge,
  renderGameOver,
  renderPinballBoard,
  renderResult,
  renderScores,
} from '../../src/games/fraction-pinball/board-ui';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import * as pinballAi from '../../src/games/fraction-pinball/ai';

installDomHooks({
  styleIds: ['fraction-pinball-styles'],
  fakeTimers: true,
});

afterEach(async () => {
  vi.restoreAllMocks();
  try {
    const mod =
      await import('../../src/games/fraction-pinball/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  try {
    const { tutorialManager } = await import('../../src/core/tutorial');
    if (tutorialManager.getIsActive()) {
      tutorialManager.exit();
    }
  } catch {
    // ignore
  }
});

function challengeFixture(
  overrides: Partial<NonNullable<FractionPinballState['currentChallenge']>> = {}
): NonNullable<FractionPinballState['currentChallenge']> {
  return {
    id: 'r45-chal',
    type: 'fractionToDecimal',
    fraction: { numerator: 1, denominator: 2 },
    decimal: 0.5,
    answerChoices: ['0.5', '0.25', '0.75', '0.2'],
    correctAnswer: '0.5',
    ...overrides,
  };
}

async function advanceToComputerAnswering(
  root: HTMLElement,
  getCurrentState: () => FractionPinballState
): Promise<void> {
  const choice = root.querySelector(
    '.pinball-choice-btn'
  ) as HTMLButtonElement | null;
  expect(choice).toBeTruthy();
  choice!.click();
  const cont = root.querySelector(
    '.pinball-continue-btn'
  ) as HTMLButtonElement | null;
  expect(cont).toBeTruthy();
  cont!.click();
  expect(getCurrentState().phase).toBe('answering');
  expect(getCurrentState().currentPlayer).toBe('player2');
  expect(root.querySelector('.status-ai-thinking')).toBeTruthy();
}

describe('q-mp-500 ui-cov-r45 fraction-pinball board-ui soft edges', () => {
  it('decimal challenge / result early-return / board targets / p1 gameOver', () => {
    const decimalChal = renderChallenge(
      {
        ...createInitialState(),
        phase: 'answering',
        currentChallenge: challengeFixture({
          type: 'decimalToFraction',
          answerChoices: ['1/2', '1/4', '3/4', '1/5'],
          correctAnswer: '1/2',
        }),
      },
      () => undefined
    );
    expect(decimalChal.querySelector('.pinball-decimal')).toBeTruthy();
    expect(decimalChal.querySelector('.pinball-fraction')).toBeNull();
    expect(decimalChal.querySelectorAll('.pinball-choice-btn').length).toBe(4);

    const emptyResult = renderResult(createInitialState(), () => undefined);
    expect(emptyResult.classList.contains('pinball-result')).toBe(true);
    expect(emptyResult.querySelector('.pinball-continue-btn')).toBeNull();

    const board = renderPinballBoard(createInitialState());
    expect(board.classList.contains('pinball-board')).toBe(true);
    expect(board.querySelectorAll('circle').length).toBeGreaterThan(0);
    expect(board.getAttribute('viewBox')).toMatch(/^0 0 /);

    const p1Over = renderGameOver({
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
      player1Stats: {
        score: 120,
        correctAnswers: 4,
        wrongAnswers: 0,
        ballsRemaining: 2,
      },
    });
    expect(p1Over.querySelector('.pinball-winner-banner')).toBeTruthy();
    expect(p1Over.querySelector('.pinball-final-score.player1')).toBeTruthy();
    expect(
      p1Over.querySelector('.pinball-final-score.player1 .pinball-final-value')
        ?.textContent
    ).toMatch(/120/);

    const p1Scores = renderScores({
      ...createInitialState(),
      currentPlayer: 'player1',
    });
    expect(
      p1Scores
        .querySelector('.pinball-player-score.player1')
        ?.classList.contains('active')
    ).toBe(true);

    injectFractionPinballStyles();
    expect(document.getElementById('fraction-pinball-styles')).toBeTruthy();
  });
});

describe('q-mp-500 ui-cov-r45 fraction-pinball controller residuals', () => {
  it('nullish ?? chain soft-return + vs-AI chrome + clearAiTimers idle destroy', async () => {
    const { initGame, newGameVsAI, getCurrentState, destroyGame } =
      await import('../../src/games/fraction-pinball/game-controller');

    const root = mountAppShell();
    initGame(root);
    newGameVsAI('hard');

    // Structural chrome — human-vs-ai mode on #app (no copy pins).
    const app = document.getElementById('app');
    expect(app).toBeTruthy();
    expect(app!.className.length).toBeGreaterThan(0);
    expect(root.querySelector('.pinball-status')).toBeTruthy();

    await advanceToComputerAnswering(root, getCurrentState);

    // L177 residual: empty choices + nullish correctAnswer → `?? null`, then
    // soft return (phase stays answering / computer). Empty-string correctAnswer
    // is NOT nullish for `??` and was already covered by r23.
    const st = getCurrentState();
    expect(st.currentChallenge).toBeTruthy();
    st.currentChallenge = {
      ...st.currentChallenge!,
      answerChoices: [],
      correctAnswer: undefined as unknown as string,
    };
    vi.spyOn(pinballAi, 'getAIAnswer').mockReturnValue(null);
    const phaseBefore = st.phase;
    const seatBefore = st.currentPlayer;
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    expect(getCurrentState().phase).toBe(phaseBefore);
    expect(getCurrentState().currentPlayer).toBe(seatBefore);
    expect(pinballAi.getAIAnswer).toHaveBeenCalled();

    // Destroy with no armed timers → clearAiTimers both-null arms.
    destroyGame();
    expect(root.innerHTML).toBe('');
    destroyGame(); // idempotent second destroy
  });

  it('tutorial step-changed soft-miss keeps listener; exit/complete still work', async () => {
    const {
      initGame,
      startTutorial,
      isTutorialActive,
      destroyGame,
      getCurrentState,
    } = await import('../../src/games/fraction-pinball/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const shell = mountAppShell();
    initGame(shell);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(shell.querySelector('.pinball-game-container')).toBeTruthy();

    // L246 residual: start() does not emit step-changed; nextStep does.
    // Handler must soft-miss (stay subscribed) on step-changed.
    const beforeIdx = tutorialManager.getCurrentStepIndex();
    const total = tutorialManager.getTotalSteps();
    expect(total).toBeGreaterThan(1);
    tutorialManager.nextStep();
    expect(isTutorialActive()).toBe(true);
    expect(tutorialManager.getCurrentStepIndex()).toBe(beforeIdx + 1);

    // Still subscribed → exit unsubscribes without remount (phase stays live).
    const phaseBeforeExit = getCurrentState().phase;
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(getCurrentState().phase).toBe(phaseBeforeExit);

    // completed arm remounts via newGameVsHuman (structure only).
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(shell.querySelector('.pinball-game-container')).toBeTruthy();
    expect(shell.querySelector('.pinball-status.player1')).toBeTruthy();

    destroyGame();
  });

  it('aiTurn seat guard when player1 forged during computer think', async () => {
    const { initGame, newGameVsAI, getCurrentState, destroyGame } =
      await import('../../src/games/fraction-pinball/game-controller');

    const root = mountAppShell();
    initGame(root);
    newGameVsAI('easy');
    await advanceToComputerAnswering(root, getCurrentState);

    // Forge seat away from player2 before think fires → aiTurn seat guard.
    getCurrentState().currentPlayer = 'player1';
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    expect(getCurrentState().phase).toBe('answering');
    expect(getCurrentState().currentPlayer).toBe('player1');
    // No result chrome when AI think soft-returns.
    expect(root.querySelector('.pinball-continue-btn')).toBeNull();

    destroyGame();
  });
});
