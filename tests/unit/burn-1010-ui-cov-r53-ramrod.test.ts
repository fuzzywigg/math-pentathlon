/**
 * q-mp-566 / UI coverage round 53 — ramrod board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields / call counts.
 * No player-facing copy body asserts. No aria/label string pins.
 * No AI move-choice or timing asserts. Stub AI. Hex Hard 450ms untouched.
 * Zero src product edits. Skip ai.ts / rules.ts product paths.
 *
 * Live tip remeasure (post977 @ 67cc7802): board-ui 97.43% lines / 95%
 * branches (miss L72/231/242/345); controller 71.33% lines / 62.02%
 * branches (newGame / destroy / tutorial / click wires / AI-null pass /
 * sync without #app). Prior overnight/burn ramrod hosts left open
 * (contained) — do not comment/close.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import {
  ROD_COLORS,
  type RamrodMove,
  type RamrodState,
  type Rod,
} from '../../src/games/ramrod/types';
import { createInitialState, selectRod } from '../../src/games/ramrod/rules';
import {
  renderBoard,
  renderPlayerRods,
  renderRodLegend,
} from '../../src/games/ramrod/board-ui';
import * as ramrodAi from '../../src/games/ramrod/ai';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  styleIds: ['ramrod-styles'],
  fakeTimers: true,
});

afterEach(async () => {
  try {
    vi.clearAllTimers();
  } catch {
    // ignore
  }
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/ramrod/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

function forgeMove(partial: Partial<RamrodMove> = {}): RamrodMove {
  const rod: Rod = {
    id: 'hist-rod',
    length: 3,
    color: '#7cb342',
    owner: 'player1',
    position: { boxId: 'box-0-0', slot: 0 },
  };
  return {
    player: 'player1',
    rod,
    boxId: 'box-0-0',
    slot: 0,
    capturedBox: true,
    pointsScored: 7,
    moveNumber: 1,
    ...partial,
  };
}

describe('q-mp-566 ui-cov-r53 ramrod board-ui residuals', () => {
  it('renderBoard soft-misses when a board box id is absent from the map', () => {
    const state = createInitialState();
    const boxes = new Map(state.boxes);
    boxes.delete('box-0-0');
    const el = renderBoard({ ...state, boxes }, () => undefined);
    expect(el.classList.contains('ramrod-board')).toBe(true);
    // 3×4 grid minus one missing box → 11 slots wrappers × 2 = 22 slots.
    expect(el.querySelectorAll('.ramrod-box')).toHaveLength(11);
    expect(el.querySelectorAll('.ramrod-slot')).toHaveLength(22);
  });

  it('renderPlayerRods soft-misses ghost rod ids not present in rods map', () => {
    const state = createInitialState();
    const realId = state.playerRods.player1[0]!;
    const el = renderPlayerRods(
      {
        ...state,
        playerRods: {
          ...state.playerRods,
          player1: [realId, 'ghost-rod-missing'],
        },
      },
      'player1',
      () => undefined
    );
    expect(el.classList.contains('ramrod-player-player1')).toBe(true);
    // Only the real rod renders; ghost id hits the L231 continue.
    expect(el.querySelectorAll('.ramrod-rod-wrapper')).toHaveLength(1);
  });

  it('selectable hand rod click wires onRodClick (L242)', () => {
    const state = createInitialState();
    const rodId = state.playerRods.player1[0]!;
    const onRod = vi.fn();
    const el = renderPlayerRods(state, 'player1', onRod);
    const wrapper = el.querySelector(
      '.ramrod-rod-wrapper.selectable'
    ) as HTMLElement | null;
    expect(wrapper).toBeTruthy();
    wrapper!.click();
    expect(onRod).toHaveBeenCalledTimes(1);
    expect(onRod).toHaveBeenCalledWith(rodId);
  });

  it('renderRodLegend skips lengths with undefined ROD_COLORS entry', () => {
    const saved = ROD_COLORS[4];
    // Soft-miss L345 continue — omit key 4 for one legend render.
    delete ROD_COLORS[4];
    try {
      const legend = renderRodLegend();
      expect(legend.classList.contains('ramrod-legend')).toBe(true);
      expect(legend.querySelectorAll('.ramrod-legend-item')).toHaveLength(9);
    } finally {
      if (saved !== undefined) {
        ROD_COLORS[4] = saved;
      }
    }
  });
});

describe('q-mp-566 ui-cov-r53 ramrod controller residuals', () => {
  it('syncOpponentChrome soft-misses when #app is absent', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    const root = mountRoot();
    const ctrl = newGameVsHuman(root);
    expect(ctrl.state.phase).toBe('selectingRod');
    expect(root.querySelector('.ramrod-game-area')).toBeTruthy();
    expect(document.getElementById('app')).toBeNull();
    destroyGame();
  });

  it('controller.newGame resets state and flips AI chrome', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    const shell = mountAppShell();
    const ctrl = initGame(shell, false);
    const rodId = ctrl.state.playerRods.player1[0]!;
    ctrl.state = selectRod(ctrl.state, rodId);
    expect(ctrl.state.selectedRod).toBe(rodId);

    ctrl.newGame(true, 'easy');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(ctrl.aiDifficulty).toBe('easy');
    expect(ctrl.state.selectedRod).toBeNull();
    expect(ctrl.state.phase).toBe('selectingRod');
    expect(ctrl.state.moveHistory).toHaveLength(0);
    expect(shell.querySelector('.ramrod-game-area')).toBeTruthy();
    const app = document.getElementById('app');
    expect(app?.classList.contains('game-vs-ai')).toBe(true);
    expect(app?.dataset.opponent).toBe('ai');

    // L123 false arm: omit difficulty → keep prior aiDifficulty.
    ctrl.newGame(false);
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiPlayer).toBeNull();
    expect(ctrl.aiDifficulty).toBe('easy');
    expect(app?.classList.contains('game-vs-ai')).toBe(false);

    destroyGame();
  });

  it('destroyGame clears mount; subsequent update paints nothing', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    const shell = mountAppShell();
    const ctrl = newGameVsHuman(shell);
    expect(shell.querySelector('.ramrod-game-area')).toBeTruthy();

    destroyGame();
    expect(shell.querySelector('.ramrod-game-area')).toBeNull();
    // L139–140 remount safety: update after destroy is a no-op.
    ctrl.update();
    expect(shell.querySelector('.ramrod-game-area')).toBeNull();
    expect(() => destroyGame()).not.toThrow();
  });

  it('startTutorial lifecycle: no-mount soft-miss, step soft-miss, exit, complete', async () => {
    const { initGame, startTutorial, isTutorialActive, destroyGame } =
      await import('../../src/games/ramrod/game-controller');

    // No activeContainer → L378 early return.
    startTutorial();
    expect(isTutorialActive()).toBe(false);

    const shell = mountAppShell();
    initGame(shell);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(shell.querySelector('.ramrod-game-area')).toBeTruthy();

    // Outer L384 false arm: step-changed is neither completed nor exited.
    const beforeIdx = tutorialManager.getCurrentStepIndex();
    const total = tutorialManager.getTotalSteps();
    expect(total).toBeGreaterThan(1);
    tutorialManager.nextStep();
    expect(isTutorialActive()).toBe(true);
    expect(tutorialManager.getCurrentStepIndex()).toBe(beforeIdx + 1);

    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(shell.querySelector('.ramrod-game-area')).toBeTruthy();

    // completed arm remounts (structure only).
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(shell.querySelector('.ramrod-status')).toBeTruthy();

    destroyGame();
  });

  it('human rod + valid slot clicks wire select/place through controller', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    const shell = mountAppShell();
    const ctrl = newGameVsHuman(shell);
    expect(ctrl.state.phase).toBe('selectingRod');

    const hand = shell.querySelector('.ramrod-player-player1');
    const rodWrap = hand?.querySelector(
      '.ramrod-rod-wrapper.selectable'
    ) as HTMLElement | null;
    expect(rodWrap).toBeTruthy();
    rodWrap!.click();
    expect(ctrl.state.phase).toBe('placingRod');
    expect(ctrl.state.selectedRod).toBeTruthy();
    expect(shell.querySelector('.ramrod-status.player1')).toBeTruthy();

    const valid = shell.querySelector(
      '.ramrod-slot.valid'
    ) as HTMLElement | null;
    expect(valid).toBeTruthy();
    valid!.click();
    expect(ctrl.state.phase).toBe('selectingRod');
    expect(ctrl.state.moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(ctrl.state.selectedRod).toBeNull();

    destroyGame();
  });

  it('rod/box click handlers soft-miss once computer turn becomes pending', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    const shell = mountAppShell();
    const ctrl = newGameVsHuman(shell);

    const rodWrap = shell.querySelector(
      '.ramrod-player-player1 .ramrod-rod-wrapper.selectable'
    ) as HTMLElement | null;
    expect(rodWrap).toBeTruthy();

    // Flip AI seat without re-paint → handleRodClick L301 return.
    ctrl.isAI = true;
    ctrl.aiPlayer = ctrl.state.currentPlayer;
    rodWrap!.click();
    expect(ctrl.state.selectedRod).toBeNull();
    expect(ctrl.state.phase).toBe('selectingRod');

    // Re-paint as human, enter placingRod, then flip AI again for box click.
    ctrl.isAI = false;
    ctrl.aiPlayer = null;
    const rodId = ctrl.state.playerRods.player1[0]!;
    ctrl.state = selectRod(ctrl.state, rodId);
    ctrl.update();
    const valid = shell.querySelector(
      '.ramrod-slot.valid'
    ) as HTMLElement | null;
    expect(valid).toBeTruthy();
    ctrl.isAI = true;
    ctrl.aiPlayer = ctrl.state.currentPlayer;
    valid!.click();
    expect(ctrl.state.selectedRod).toBe(rodId);
    expect(ctrl.state.moveHistory).toHaveLength(0);

    destroyGame();
  });

  it('clear-selection click soft-misses when computer turn becomes pending', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    const shell = mountAppShell();
    const ctrl = newGameVsHuman(shell);
    const rodId = ctrl.state.playerRods.player1[0]!;
    ctrl.state = selectRod(ctrl.state, rodId);
    ctrl.update();
    const clearBtn = shell.querySelector(
      '.ramrod-controls .ramrod-btn-secondary'
    ) as HTMLButtonElement | null;
    expect(clearBtn).toBeTruthy();

    // Paint had human chrome; flip AI seat without re-render → L255 return.
    ctrl.isAI = true;
    ctrl.aiPlayer = ctrl.state.currentPlayer;
    clearBtn!.click();
    expect(ctrl.state.selectedRod).toBe(rodId);
    expect(ctrl.state.phase).toBe('placingRod');

    destroyGame();
  });

  it('pass-turn click soft-misses when computer turn becomes pending', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    const shell = mountAppShell();
    const ctrl = newGameVsHuman(shell);
    ctrl.state = {
      ...ctrl.state,
      playerRods: { ...ctrl.state.playerRods, player1: [] },
      phase: 'selectingRod',
      selectedRod: null,
    };
    ctrl.update();
    const passBtn = shell.querySelector(
      '.ramrod-controls .ramrod-btn-secondary'
    ) as HTMLButtonElement | null;
    expect(passBtn).toBeTruthy();

    ctrl.isAI = true;
    ctrl.aiPlayer = ctrl.state.currentPlayer;
    const seatBefore = ctrl.state.currentPlayer;
    passBtn!.click();
    expect(ctrl.state.currentPlayer).toBe(seatBefore);

    destroyGame();
  });

  it('stubbed null getAIMove schedules pass path (no move-choice assert)', async () => {
    const { newGameVsAI, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    vi.spyOn(ramrodAi, 'getAIMove').mockReturnValue(null);

    const shell = mountAppShell();
    const ctrl = newGameVsAI(shell, 'easy');
    // Force AI seat without relying on a human placement product path.
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'selectingRod',
      selectedRod: null,
    };
    ctrl.update();
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    await vi.advanceTimersByTimeAsync(800);
    // Null AI → passTurn; seat flips structurally. No rod/box choice assert.
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.phase).toBe('selectingRod');
    expect(shell.querySelector('.ramrod-game-area')).toBeTruthy();

    destroyGame();
  });

  it('makeAIMove early-returns on gameOver before consulting AI', async () => {
    const { newGameVsAI, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    const aiSpy = vi.spyOn(ramrodAi, 'getAIMove').mockReturnValue(null);

    const shell = mountAppShell();
    const ctrl = newGameVsAI(shell, 'medium');
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'gameOver',
      winner: 'player1',
    };
    ctrl.update();
    // gameOver skips scheduleAI entirely.
    expect(vi.getTimerCount()).toBe(0);
    expect(aiSpy).not.toHaveBeenCalled();
    expect(shell.querySelector('.ramrod-winner-banner')).toBeTruthy();

    destroyGame();
  });

  it('makeAIMove soft-misses when aiPlayer is cleared after schedule', async () => {
    const { newGameVsAI, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    const aiSpy = vi.spyOn(ramrodAi, 'getAIMove').mockReturnValue(null);

    const shell = mountAppShell();
    const ctrl = newGameVsAI(shell, 'easy');
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'selectingRod',
      selectedRod: null,
    };
    ctrl.update();
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    // Clear seat after schedule → L333–334 !aiPlayer arm (no product AI call).
    ctrl.aiPlayer = null;
    await vi.advanceTimersByTimeAsync(800);
    expect(aiSpy).not.toHaveBeenCalled();
    expect(ctrl.state.currentPlayer).toBe('player2');

    destroyGame();
  });

  it('player2 hand click wires when it is Red selectingRod', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    const shell = mountAppShell();
    const ctrl = newGameVsHuman(shell);
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'selectingRod',
      selectedRod: null,
    };
    ctrl.update();
    const redWrap = shell.querySelector(
      '.ramrod-player-player2 .ramrod-rod-wrapper.selectable'
    ) as HTMLElement | null;
    expect(redWrap).toBeTruthy();
    redWrap!.click();
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.phase).toBe('placingRod');
    expect(ctrl.state.selectedRod).toBeTruthy();
    expect(shell.querySelector('.ramrod-status.player2')).toBeTruthy();

    destroyGame();
  });

  it('capture history mounts when moveHistory has capturedBox entries', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    const shell = mountAppShell();
    const ctrl = newGameVsHuman(shell);
    const historyState: RamrodState = {
      ...ctrl.state,
      moveHistory: [
        forgeMove({ capturedBox: true, player: 'player1', pointsScored: 8 }),
        forgeMove({
          capturedBox: false,
          player: 'player2',
          pointsScored: 0,
          moveNumber: 2,
        }),
        forgeMove({
          capturedBox: true,
          player: 'player2',
          pointsScored: 6,
          moveNumber: 3,
        }),
      ],
    };
    ctrl.state = historyState;
    ctrl.update();
    expect(shell.querySelector('.ramrod-history')).toBeTruthy();
    expect(shell.querySelectorAll('.ramrod-history-move')).toHaveLength(2);

    destroyGame();
  });

  it('tie gameOver paints winner banner without winner seat', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/ramrod/game-controller');
    const shell = mountAppShell();
    const ctrl = newGameVsHuman(shell);
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: null,
      scores: { player1: 12, player2: 12 },
    };
    ctrl.update();
    expect(shell.querySelector('.ramrod-winner-banner')).toBeTruthy();
    expect(shell.querySelector('.ramrod-status')).toBeTruthy();
    // No controls when gameOver with no selection / valid-move chrome.
    expect(shell.querySelector('.ramrod-controls')).toBeNull();

    destroyGame();
  });
});
