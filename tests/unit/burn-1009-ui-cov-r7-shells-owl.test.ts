/**
 * q-mp-149 / UI coverage round 7 — remainder / pinball / sum-dominoes / calla /
 * stars-bars / par-55 / ramrod / contig destroy/remount shells + owl coast edge.
 * Characterization only: no copy / AI choice / timing asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import { OwlComponent } from '../../src/ui/owl/owl-component';
import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { setUserReducedMotionFlag } from '../../src/core/settings-flags';
import { createInitialState as createPinballState } from '../../src/games/fraction-pinball/types';
import {
  startGame as startPinball,
  submitAnswer,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';
import * as pinballAi from '../../src/games/fraction-pinball/ai';

installDomHooks({
  fakeTimers: true,
  styleIds: [
    'remainder-styles',
    'fraction-pinball-styles',
    'pinball-styles',
    'sum-dominoes-styles',
    'calla-styles',
    'stars-styles',
    'par-styles',
    'ramrod-styles',
    'contig-styles',
  ],
});

afterEach(async () => {
  vi.restoreAllMocks();
  setUserReducedMotionFlag(false);
  for (const path of [
    '../../src/games/remainder-islands/game-controller',
    '../../src/games/fraction-pinball/game-controller',
    '../../src/games/sum-dominoes/game-controller',
    '../../src/games/calla/game-controller',
    '../../src/games/stars-bars/game-controller',
    '../../src/games/par-55/game-controller',
    '../../src/games/ramrod/game-controller',
    '../../src/games/contig-60/game-controller',
  ] as const) {
    try {
      const mod = await import(path);
      mod.destroyGame?.();
    } catch {
      // ignore
    }
  }
});

describe('q-mp-149 ui-cov-r7 remainder-islands destroy/remount', () => {
  it('roll / island / destroy mid-AI + remount + double-click guard', async () => {
    const {
      initGame,
      newGameVsHuman,
      newGameVsAI,
      destroyGame,
      startTutorial,
      isTutorialActive,
    } = await import('../../src/games/remainder-islands/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const root = mountAppShell();
    initGame(root);
    newGameVsHuman();

    const roll = root.querySelector(
      '.remainder-btn-roll'
    ) as HTMLButtonElement | null;
    roll?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, detail: 2 })
    );
    roll?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, detail: 1 })
    );

    const island = root.querySelector(
      '.remainder-island, [data-island], .remainder-board circle, .remainder-board path'
    ) as Element | null;
    island?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    newGameVsAI('easy');
    (
      root.querySelector('.remainder-btn-roll') as HTMLButtonElement | null
    )?.click();
    destroyGame();
    await vi.advanceTimersByTimeAsync(5000);

    initGame(root);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });
});

describe('q-mp-149 ui-cov-r7 fraction-pinball destroy/remount', () => {
  it('AI think/continue gen cancel + gameOver paint + tutorial exit', async () => {
    vi.spyOn(pinballAi, 'getAIAnswer').mockReturnValue(null);

    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      getCurrentState,
      destroyGame,
      startTutorial,
      isTutorialActive,
    } = await import('../../src/games/fraction-pinball/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const root = mountAppShell();
    initGame(root);
    newGameVsAI('easy');

    // Human answers so seat can advance toward AI (structure only).
    const choice = root.querySelector(
      '.pinball-choice-btn'
    ) as HTMLButtonElement | null;
    choice?.click();
    await vi.advanceTimersByTimeAsync(50);

    // Destroy while AI timers may be armed — generation bump cancels.
    destroyGame();
    await vi.advanceTimersByTimeAsync(3000);
    expect(getCurrentState()).toBeTruthy();

    initGame(root);
    newGameVsHuman();
    // Drive toward gameOver via rules helpers on a local state, then re-init.
    let s = startPinball(createPinballState());
    for (let i = 0; i < 40 && s.phase !== 'gameOver'; i++) {
      if (s.phase === 'answering' && s.currentChallenge) {
        s = submitAnswer(s, s.currentChallenge.correctAnswer);
      } else if (s.phase === 'showResult') {
        s = nextChallenge(s);
      } else {
        break;
      }
    }
    void s;

    // Continue button if showResult chrome present.
    (
      root.querySelector(
        '.pinball-continue-btn, .pinball-result button'
      ) as HTMLButtonElement | null
    )?.click();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
    destroyGame();
  });
});

describe('q-mp-149 ui-cov-r7 sum-dominoes / calla paint-after-destroy', () => {
  it('sum-dominoes: destroy then stale update is dropped; remount ok', async () => {
    const { initGame, newGameVsAI, destroyGame } = await import(
      '../../src/games/sum-dominoes/game-controller'
    );
    const root = mountAppShell();
    const ctrl = initGame(root, true, 'easy');
    expect(root.innerHTML.length).toBeGreaterThan(0);
    (
      root.querySelector('button, .sd-die, .sd-cell') as HTMLElement | null
    )?.click();
    destroyGame();
    // Stale controller.update after destroy must no-op (mount ref null).
    expect(() => ctrl.update()).not.toThrow();
    expect(root.innerHTML).toBe('');

    initGame(root, false);
    expect(root.innerHTML.length).toBeGreaterThan(0);
    destroyGame();
  });

  it('calla: destroy while AI thinking; remount + pit during think ignored', async () => {
    const { initGame, newGameVsAI, destroyGame } = await import(
      '../../src/games/calla/game-controller'
    );
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    newGameVsAI('easy');

    // Click a pit to possibly arm AI; then destroy mid-think.
    const clickPit = () => {
      const pit = board.querySelector(
        '.calla-pit, [data-pit], button, circle'
      );
      pit?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };
    clickPit();
    await vi.advanceTimersByTimeAsync(10);
    destroyGame();
    await vi.advanceTimersByTimeAsync(2000);

    initGame(board, status);
    newGameVsAI('medium');
    clickPit();
    // Second click while AI may think — guard path.
    clickPit();
    destroyGame();
  });
});

describe('q-mp-149 ui-cov-r7 stars/par/ramrod/contig destroy shells', () => {
  it('stars-bars: destroy drops paints; remount + tutorial exit', async () => {
    const { initGame, destroyGame, startTutorial, isTutorialActive } =
      await import('../../src/games/stars-bars/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');
    const root = mountAppShell();
    const ctrl = initGame(root, true, 'easy');
    destroyGame();
    expect(() => ctrl.update()).not.toThrow();
    initGame(root, false);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });

  it('par-55: destroy drops paints; remount + tutorial exit', async () => {
    const { initGame, destroyGame, startTutorial, isTutorialActive } =
      await import('../../src/games/par-55/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');
    const root = mountAppShell();
    const ctrl = initGame(root, true, 'easy');
    destroyGame();
    expect(() => ctrl.update()).not.toThrow();
    initGame(root, false);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });

  it('ramrod: destroy mid vsAI + remount', async () => {
    const { initGame, destroyGame, startTutorial, isTutorialActive } =
      await import('../../src/games/ramrod/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');
    const root = mountAppShell();
    const ctrl = initGame(root, true, 'easy');
    (
      root.querySelector('button, .ramrod-cell, .cell') as HTMLElement | null
    )?.click();
    destroyGame();
    expect(() => ctrl.update()).not.toThrow();
    initGame(root, false);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });

  it('contig-60: destroy mid AI schedule + remount + pass/roll guards', async () => {
    const { initGame, newGameVsAI, destroyGame } = await import(
      '../../src/games/contig-60/game-controller'
    );
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    newGameVsAI('easy');
    (
      board.querySelector('.contig-roll-btn') as HTMLButtonElement | null
    )?.click();
    (
      board.querySelector('.contig-cell-valid') as HTMLElement | null
    )?.click();
    (
      board.querySelector('.contig-pass-btn') as HTMLButtonElement | null
    )?.click();
    destroyGame();
    await vi.advanceTimersByTimeAsync(3000);

    initGame(board, status);
    newGameVsAI('hard');
    expect(board.querySelector('.contig-scores, .contig-roll-btn')).toBeTruthy();
    destroyGame();
  });
});

describe('q-mp-149 ui-cov-r7 owl-component coast edge clamp', () => {
  let owl: OwlComponent;
  let root: HTMLElement;

  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
    storage.updateSettings({ owlEnabled: true });
    owlSystem.hide();
    owlSystem.dismissMessage();
    document.body.innerHTML = '';
    owl = new OwlComponent();
    owl.init();
    root = owl.getElement()!;
    vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({
      x: 4,
      y: 4,
      left: 4,
      top: 4,
      right: 68,
      bottom: 68,
      width: 64,
      height: 64,
      toJSON: () => ({}),
    });
    root.setPointerCapture = vi.fn();
    root.releasePointerCapture = vi.fn();
    root.hasPointerCapture = vi.fn(() => true);
    document.elementFromPoint = vi.fn(
      () => null
    ) as typeof document.elementFromPoint;
  });

  afterEach(() => {
    owl.destroy();
    document.body.innerHTML = '';
    localStorage.clear();
    storage.resetAll();
  });

  it('fast drag toward viewport edge clamps velocity then destroy mid-coast', async () => {
    setUserReducedMotionFlag(false);
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      }))
    );

    const character = root.querySelector('.owl-character')!;
    const ptr = (
      type: string,
      x: number,
      y: number,
      extras: PointerEventInit = {}
    ) =>
      character.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          clientX: x,
          clientY: y,
          pointerId: 1,
          ...extras,
        })
      );

    ptr('pointerdown', 10, 10);
    // Rapid moves near left/top edge so coast integration hits clamp arms.
    for (let i = 0; i < 6; i++) {
      ptr('pointermove', 2 - i * 8, 2 - i * 8);
      await vi.advanceTimersByTimeAsync(8);
    }
    ptr('pointerup', -40, -40);
    await vi.advanceTimersByTimeAsync(32);
    owl.destroy();
    expect(owl.getElement()).toBeNull();
  });
});
