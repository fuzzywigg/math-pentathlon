/**
 * q-mp-369 / UI coverage round 23 — fraction-pinball board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. Skip ai.ts / rules.ts product paths.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import type { FractionPinballState } from '../../src/games/fraction-pinball/types';
import {
  getPlayerName,
  injectFractionPinballStyles,
  renderChallenge,
  renderGameOver,
  renderScores,
} from '../../src/games/fraction-pinball/board-ui';
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
});

function challengeFixture(
  overrides: Partial<NonNullable<FractionPinballState['currentChallenge']>> = {}
): NonNullable<FractionPinballState['currentChallenge']> {
  return {
    id: 'r23-chal',
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

describe('q-mp-369 ui-cov-r23 fraction-pinball board-ui residuals', () => {
  it('no-challenge / allowInput disabled / p2+draw gameOver / scores seat / inject', () => {
    const empty = renderChallenge(createInitialState(), () => undefined);
    expect(empty.querySelector('.pinball-no-challenge')).toBeTruthy();
    expect(empty.querySelector('.pinball-choices')).toBeNull();

    const onPick = vi.fn();
    const disabled = renderChallenge(
      {
        ...createInitialState(),
        phase: 'answering',
        currentChallenge: challengeFixture(),
      },
      onPick,
      { allowInput: false }
    );
    const btn = disabled.querySelector(
      '.pinball-choice-btn'
    ) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    btn.click();
    expect(onPick).not.toHaveBeenCalled();

    const p2Over = renderGameOver({
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player2',
      player2Stats: {
        score: 90,
        correctAnswers: 3,
        wrongAnswers: 1,
        ballsRemaining: 1,
      },
    });
    expect(p2Over.querySelector('.pinball-winner-banner')).toBeTruthy();
    expect(p2Over.querySelector('.pinball-final-score.player2')).toBeTruthy();
    expect(
      p2Over.querySelector('.pinball-final-score.player2 .pinball-final-value')
        ?.textContent
    ).toMatch(/90/);

    const draw = renderGameOver({
      ...createInitialState(),
      phase: 'gameOver',
      winner: null,
    });
    expect(draw.querySelector('.pinball-winner-banner')).toBeTruthy();
    expect(draw.querySelectorAll('.pinball-final-score').length).toBe(2);

    const p2Active = renderScores({
      ...createInitialState(),
      currentPlayer: 'player2',
    });
    expect(
      p2Active
        .querySelector('.pinball-player-score.player2')
        ?.classList.contains('active')
    ).toBe(true);
    expect(
      p2Active
        .querySelector('.pinball-player-score.player1')
        ?.classList.contains('active')
    ).toBe(false);

    // Exported helper — seat key only (no copy body pin).
    expect(typeof getPlayerName('player1')).toBe('string');
    expect(typeof getPlayerName('player2')).toBe('string');
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));

    injectFractionPinballStyles();
    injectFractionPinballStyles();
    expect(document.querySelectorAll('#fraction-pinball-styles').length).toBe(
      1
    );
  });
});

describe('q-mp-369 ui-cov-r23 fraction-pinball controller residuals', () => {
  it('bare mount sync chrome + stale handlers + post-destroy paint drop', async () => {
    const { initGame, getCurrentState, destroyGame, newGameVsHuman } =
      await import('../../src/games/fraction-pinball/game-controller');

    // No #app → syncOpponentChrome early return.
    const bare = mountRoot();
    initGame(bare);
    expect(bare.querySelector('.pinball-game-container')).toBeTruthy();
    expect(bare.querySelector('.pinball-status.player1')).toBeTruthy();

    const staleChoice = bare.querySelector(
      '.pinball-choice-btn'
    ) as HTMLButtonElement;
    expect(staleChoice).toBeTruthy();
    staleChoice.click();
    expect(getCurrentState().phase).toBe('showResult');

    // Detached choice while showResult → handleAnswerSelect phase guard.
    staleChoice.click();
    expect(getCurrentState().phase).toBe('showResult');

    const staleContinue = bare.querySelector(
      '.pinball-continue-btn'
    ) as HTMLButtonElement;
    expect(staleContinue).toBeTruthy();
    staleContinue.click();
    expect(getCurrentState().phase).toBe('answering');

    // Detached continue while answering → handleContinue phase guard.
    staleContinue.click();
    expect(getCurrentState().phase).toBe('answering');

    // Destroy then stale click → render() early-return (!gameContainer).
    const midChoice = bare.querySelector(
      '.pinball-choice-btn'
    ) as HTMLButtonElement;
    destroyGame();
    expect(bare.innerHTML).toBe('');
    expect(() => {
      midChoice.click();
    }).not.toThrow();

    // Remount HvH for chrome reset path.
    const shell = mountAppShell();
    initGame(shell);
    newGameVsHuman();
    expect(shell.querySelector('.pinball-game-container')).toBeTruthy();
    destroyGame();
  });

  it('AI timer gen cancel + null fallback + empty-choice soft return', async () => {
    const { initGame, newGameVsAI, getCurrentState, destroyGame } =
      await import('../../src/games/fraction-pinball/game-controller');

    const root = mountAppShell();
    initGame(root);
    newGameVsAI('easy');

    const humanChoice = root.querySelector(
      '.pinball-choice-btn'
    ) as HTMLButtonElement;
    await advanceToComputerAnswering(root, getCurrentState);

    // Stale human choice during computer answering → isComputerAnswering guard.
    humanChoice.click();
    expect(getCurrentState().phase).toBe('answering');
    expect(getCurrentState().currentPlayer).toBe('player2');

    // Generation bump mid-think → think-timer early return (no move-choice assert).
    newGameVsAI('medium');
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    expect(getCurrentState().currentPlayer).toBe('player1');

    // Drive again; stub AI null → choices[0] fallback (structure only).
    await advanceToComputerAnswering(root, getCurrentState);
    vi.spyOn(pinballAi, 'getAIAnswer').mockReturnValue(null);
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    expect(pinballAi.getAIAnswer).toHaveBeenCalled();
    expect(['showResult', 'gameOver']).toContain(getCurrentState().phase);

    // Continue-timer gen cancel: destroy while auto-continue armed.
    if (getCurrentState().phase === 'showResult') {
      destroyGame();
      await vi.advanceTimersByTimeAsync(1500);
      await Promise.resolve();
      expect(root.innerHTML).toBe('');
    }

    // Remount: null AI + empty choices → correctAnswer fallback arm.
    initGame(root);
    newGameVsAI('easy');
    await advanceToComputerAnswering(root, getCurrentState);
    const st = getCurrentState();
    expect(st.currentChallenge).toBeTruthy();
    st.currentChallenge = {
      ...st.currentChallenge!,
      answerChoices: [],
      correctAnswer: '0.5',
    };
    vi.mocked(pinballAi.getAIAnswer).mockReturnValue(null);
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    expect(['showResult', 'gameOver']).toContain(getCurrentState().phase);

    // null AI + empty choices + empty correct → soft return.
    initGame(root);
    newGameVsAI('easy');
    await advanceToComputerAnswering(root, getCurrentState);
    const st2 = getCurrentState();
    st2.currentChallenge = {
      ...st2.currentChallenge!,
      answerChoices: [],
      correctAnswer: '',
    };
    vi.mocked(pinballAi.getAIAnswer).mockReturnValue(null);
    const phaseBefore = st2.phase;
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    expect(getCurrentState().phase).toBe(phaseBefore);

    destroyGame();
  });

  it('aiTurn phase/challenge guards + continue when not showResult + tutorial exit', async () => {
    const {
      initGame,
      newGameVsAI,
      getCurrentState,
      destroyGame,
      startTutorial,
      isTutorialActive,
      newGameVsHuman,
    } = await import('../../src/games/fraction-pinball/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const root = mountAppShell();
    initGame(root);
    newGameVsAI('easy');
    await advanceToComputerAnswering(root, getCurrentState);

    // Mutate away from answering before think fires → aiTurn phase guard.
    getCurrentState().phase = 'showResult';
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    expect(getCurrentState().phase).toBe('showResult');

    // Re-arm think with answering + null challenge → aiTurn challenge guard.
    newGameVsHuman();
    newGameVsAI('easy');
    await advanceToComputerAnswering(root, getCurrentState);
    getCurrentState().currentChallenge = null;
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    expect(getCurrentState().phase).toBe('answering');
    expect(getCurrentState().currentPlayer).toBe('player2');

    // Fresh AI answer → continue timer; mutate phase so continue no-ops.
    newGameVsHuman();
    newGameVsAI('easy');
    vi.spyOn(pinballAi, 'getAIAnswer').mockImplementation((_s, _p, _d) => {
      const live = getCurrentState();
      return live.currentChallenge?.correctAnswer ?? null;
    });
    await advanceToComputerAnswering(root, getCurrentState);
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    expect(getCurrentState().phase).toBe('showResult');
    getCurrentState().phase = 'answering';
    await vi.advanceTimersByTimeAsync(1500);
    await Promise.resolve();
    expect(getCurrentState().phase).toBe('answering');

    // Continue-timer gen cancel: newGame bumps aiGeneration without clearAiTimers
    // (render only clears when computer-answering). Flush stale continue → return.
    newGameVsHuman();
    newGameVsAI('easy');
    await advanceToComputerAnswering(root, getCurrentState);
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    expect(getCurrentState().phase).toBe('showResult');
    newGameVsHuman();
    expect(getCurrentState().currentPlayer).toBe('player1');
    await vi.advanceTimersByTimeAsync(1500);
    await Promise.resolve();
    expect(getCurrentState().phase).toBe('answering');

    // Stacked continue clear inside aiTurn: capture 1000ms think callbacks,
    // let one arm a continue timer, forge answering/p2, re-invoke think cb.
    const thinkCbs: Array<() => void> = [];
    const wrappedSetTimeout = globalThis.setTimeout.bind(globalThis);
    vi.spyOn(globalThis, 'setTimeout').mockImplementation(((
      handler: TimerHandler,
      ms?: number,
      ...args: unknown[]
    ) => {
      if (typeof handler === 'function' && ms === 1000) {
        thinkCbs.push(handler as () => void);
      }
      return wrappedSetTimeout(
        handler as Parameters<typeof wrappedSetTimeout>[0],
        ms as number,
        ...(args as [])
      );
    }) as typeof setTimeout);

    newGameVsAI('easy');
    await advanceToComputerAnswering(root, getCurrentState);
    expect(thinkCbs.length).toBeGreaterThan(0);
    await vi.advanceTimersByTimeAsync(1000);
    await Promise.resolve();
    expect(getCurrentState().phase).toBe('showResult');
    getCurrentState().phase = 'answering';
    getCurrentState().currentPlayer = 'player2';
    if (!getCurrentState().currentChallenge) {
      getCurrentState().currentChallenge = challengeFixture();
    }
    thinkCbs[thinkCbs.length - 1]!();
    expect(['showResult', 'gameOver']).toContain(getCurrentState().phase);

    destroyGame();
    await vi.advanceTimersByTimeAsync(1500);
    await Promise.resolve();

    // Tutorial exited (not completed) → unsubscribe without remount.
    const shell = mountAppShell();
    initGame(shell);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);

    // Tutorial completed → remount via newGameVsHuman (structure only).
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(shell.querySelector('.pinball-game-container')).toBeTruthy();

    destroyGame();
  });
});
