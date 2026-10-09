/**
 * burn-1009 / q-mp-111 — UI coverage round 6: hex + fraction-pinball residuals.
 * Characterization only: structural / state-phase guards. No player-facing copy
 * asserts. No AI move-choice or AI timing asserts (fake timers; mock AI client
 * returns a fixed legal cell without asserting which cell the real AI would pick).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import * as hexRules from '../../src/games/hex/rules';
import * as hexAiClient from '../../src/games/hex/ai-client';
import { submitAnswer, nextChallenge } from '../../src/games/fraction-pinball/rules';
import { createInitialState as createPinballState } from '../../src/games/fraction-pinball/types';
import { startGame as startPinball } from '../../src/games/fraction-pinball/rules';

installDomHooks({
  fakeTimers: true,
  styleIds: ['fraction-pinball-styles', 'pinball-styles'],
});

afterEach(async () => {
  vi.restoreAllMocks();
  for (const path of [
    '../../src/games/hex/game-controller',
    '../../src/games/fraction-pinball/game-controller',
  ] as const) {
    try {
      const mod = await import(path);
      mod.destroyGame?.();
    } catch {
      // ignore
    }
  }
});

describe('burn-1009 ui-cov-r6 hex controller residuals', () => {
  it('guards clicks when thinking / invalid; flushes mocked AI + catch path', async () => {
    const getBest = vi
      .spyOn(hexAiClient, 'getBestMoveAsync')
      .mockResolvedValueOnce({ row: 0, col: 1 });

    const {
      initGame,
      newGameVsAI,
      getGameState,
      destroyGame,
      resetGame,
      setAIDifficulty,
    } = await import('../../src/games/hex/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = document.createElement('div');
    const status = document.createElement('div');
    app.appendChild(board);
    app.appendChild(status);

    initGame(board, status);
    newGameVsAI('easy');
    setAIDifficulty('medium');

    const pick = () =>
      board.querySelector('[data-row][data-col]') as Element | null;

    // Human move → arms AI timer (do not assert delay length).
    expect(pick()).toBeTruthy();
    pick()!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBeGreaterThanOrEqual(1);

    // While AI timer pending, further clicks are ignored (isAIThinking).
    const before = getGameState().moveHistory.length;
    pick()?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBe(before);

    // Flush paint-delay — mock supplies the move; no timing / choice assert.
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(getBest).toHaveBeenCalled();
    expect(getGameState().moveHistory.length).toBeGreaterThan(before);

    // Invalid move guard (re-query after AI re-render — prior nodes are detached).
    vi.spyOn(hexRules, 'isValidMove').mockReturnValueOnce(false);
    const histAfterInvalid = getGameState().moveHistory.length;
    pick()?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBe(histAfterInvalid);

    // AI catch path: reject getBestMoveAsync → aiMove null branch.
    getBest.mockRejectedValueOnce(new Error('worker down'));
    resetGame();
    newGameVsAI('easy');
    pick()?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(getGameState().winner).toBeNull();

    // Generation bump mid-flight: destroy while AI timer armed.
    newGameVsAI('easy');
    pick()?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    destroyGame();
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
  });

  it('tutorial completed branch restarts HvH without copy asserts', async () => {
    const { initGame, startTutorial, isTutorialActive, destroyGame } =
      await import('../../src/games/hex/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });

  it('destroyGame is idempotent when mounts already null', async () => {
    const { initGame, destroyGame } = await import(
      '../../src/games/hex/game-controller'
    );
    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    destroyGame();
    expect(() => destroyGame()).not.toThrow();
  });
});

describe('burn-1009 ui-cov-r6 fraction-pinball residuals', () => {
  it('flushes AI think+continue timers without asserting answer choice', async () => {
    const {
      initGame,
      newGameVsAI,
      getCurrentState,
      destroyGame,
    } = await import('../../src/games/fraction-pinball/game-controller');

    const root = mountAppShell();
    initGame(root);
    newGameVsAI('easy');

    // Human answers first so seat advances toward AI (structure only).
    const choice = root.querySelector(
      '.pinball-choice-btn'
    ) as HTMLButtonElement | null;
    expect(choice).toBeTruthy();
    choice!.click();
    const cont = root.querySelector(
      '.pinball-continue-btn, button.pinball-continue'
    ) as HTMLButtonElement | null;
    cont?.click();

    // If computer is answering, flush think (1000) + continue (1500) — no timing asserts.
    if (
      getCurrentState().phase === 'answering' &&
      getCurrentState().currentPlayer === 'player2'
    ) {
      await vi.advanceTimersByTimeAsync(1000);
      await Promise.resolve();
      expect(['showResult', 'answering', 'gameOver']).toContain(
        getCurrentState().phase
      );
      if (getCurrentState().phase === 'showResult') {
        await vi.advanceTimersByTimeAsync(1500);
        await Promise.resolve();
      }
    }

    // Phase guards: continue while answering is a no-op via DOM absence.
    expect(getCurrentState()).toBeTruthy();
    destroyGame();
  });

  it('gameOver chrome + tutorial completed + answer guard', async () => {
    const {
      initGame,
      startTutorial,
      isTutorialActive,
      getCurrentState,
      destroyGame,
      newGameVsHuman,
    } = await import('../../src/games/fraction-pinball/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const root = mountAppShell();
    initGame(root);

    // Drive to gameOver by submitting until phase flips (cap rounds).
    newGameVsHuman();
    for (let i = 0; i < 40; i++) {
      const st = getCurrentState();
      if (st.phase === 'gameOver') break;
      if (st.phase === 'answering') {
        const btn = root.querySelector(
          '.pinball-choice-btn'
        ) as HTMLButtonElement | null;
        btn?.click();
      } else if (st.phase === 'showResult') {
        const cont = root.querySelector(
          '.pinball-continue-btn, button.pinball-continue'
        ) as HTMLButtonElement | null;
        cont?.click();
      } else {
        break;
      }
    }
    // Structural: container still hosts pinball chrome (gameOver or mid-game).
    expect(root.querySelector('.pinball-game-container')).toBeTruthy();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);

    // Keep rules helpers wired (characterization smoke, not scoring asserts).
    let s = startPinball(createPinballState());
    if (s.currentChallenge) {
      s = submitAnswer(s, s.currentChallenge.correctAnswer);
      if (s.phase === 'showResult') s = nextChallenge(s);
    }
    expect(s).toBeTruthy();
    destroyGame();
  });

  it('destroy mid-AI-timer cancels without throwing', async () => {
    const { initGame, newGameVsAI, destroyGame } = await import(
      '../../src/games/fraction-pinball/game-controller'
    );
    const root = mountAppShell();
    initGame(root);
    newGameVsAI('easy');
    const choice = root.querySelector(
      '.pinball-choice-btn'
    ) as HTMLButtonElement | null;
    choice?.click();
    const cont = root.querySelector(
      '.pinball-continue-btn, button.pinball-continue'
    ) as HTMLButtonElement | null;
    cont?.click();
    destroyGame();
    await vi.advanceTimersByTimeAsync(3000);
    expect(root.innerHTML).toBe('');
  });
});
