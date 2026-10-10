/**
 * q-mp-596 / UI coverage round 60 — prime-gold board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields / call counts.
 * No player-facing copy body asserts. No aria/label string pins.
 * No AI move-choice, timing, scoring, or legal-move outcome asserts.
 * Stub AI / 3D loaders only. Hex Hard 450ms untouched. Zero src product edits.
 *
 * Live tip post1012 residual arms (remeasured; prior dedicated ui-cov r18/r34/r41
 * already on tip — board-ui at 100% lines/branches; controller soft-fail leftovers):
 * context-lost with cleared host/controller; ensureBoard3d already-mounted /
 * missing-host re-entry; tutorial step-changed soft-miss; status fall-through
 * for non-painting phase; createPrimeGoldBoard3D throw → 2D catch; loader
 * import smoke (board-3d-loader).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell } from './helpers/dom';
import { createInitialState, rollDice } from '../../src/games/prime-gold/rules';
import type { PrimeGoldState } from '../../src/games/prime-gold/types';
import {
  injectPrimeGoldStyles,
  renderBoard,
  renderDice,
  renderExpressions,
  renderMoveHistory,
  renderScores,
} from '../../src/games/prime-gold/board-ui';
import * as featureFlags from '../../src/core/feature-flags';
import * as primeGoldLoader from '../../src/games/prime-gold/board-3d-loader';
import * as primeAi from '../../src/games/prime-gold/ai';
import * as tabletGl from '../../src/ui/three/tablet-gl';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  fakeTimers: true,
  styleIds: ['prime-gold-styles'],
});

afterEach(async () => {
  try {
    vi.clearAllTimers();
  } catch {
    // ignore
  }
  vi.restoreAllMocks();
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
  try {
    const mod = await import('../../src/games/prime-gold/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
});

function seededPlacing(): PrimeGoldState {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  return rollDice(createInitialState());
}

function fakeBoard3dModule() {
  const unmount = vi.fn();
  const update = vi.fn();
  const createPrimeGoldBoard3D = vi.fn(
    async (
      host: HTMLElement,
      _onPlace?: (value: number, expr: string) => void
    ) => {
      const canvas = document.createElement('canvas');
      canvas.setAttribute('data-mp3d', 'prime-gold');
      host.appendChild(canvas);
      return { update, unmount, canvas };
    }
  );
  return { createPrimeGoldBoard3D, update, unmount };
}

describe('q-mp-596 ui-cov-r60 prime-gold board-ui residuals', () => {
  it('board-ui chrome matrix: owned/valid/history/scores/dice (class only)', () => {
    const state = seededPlacing();
    for (const [, cell] of state.cells) {
      if (cell.isPrime) {
        cell.owner = 'player2';
        break;
      }
    }
    state.moveHistory = [
      {
        player: 'player1',
        dice: { die1: 1, die2: 2, die3: 3 },
        expression: '1+2',
        result: 3,
        row: 0,
        col: 0,
      },
    ];

    const board = renderBoard(state, () => undefined, { allowInput: true });
    expect(board.classList.contains('pg-board-container')).toBe(true);
    expect(board.querySelector('.pg-board')).toBeTruthy();
    expect(board.querySelector('.pg-cell.player2')).toBeTruthy();
    expect(board.querySelector('.pg-cell.valid')).toBeTruthy();

    const thinking = renderExpressions(state, () => undefined, {
      allowInput: false,
    });
    expect(thinking.classList.contains('pg-expressions')).toBe(true);
    expect(thinking.querySelector('.pg-computer-thinking')).toBeTruthy();
    expect(thinking.querySelectorAll('.pg-expr-item')).toHaveLength(0);

    const exprs = renderExpressions(state, () => undefined, {
      allowInput: true,
    });
    expect(exprs.querySelectorAll('.pg-expr-item').length).toBeGreaterThan(0);

    const dice = renderDice(state, () => undefined, { allowInput: true });
    expect(dice.querySelectorAll('.pg-die')).toHaveLength(3);
    expect(dice.querySelector('.pg-roll-btn')).toBeNull();

    const scores = renderScores(state);
    expect(scores.querySelectorAll('.pg-score')).toHaveLength(2);
    expect(scores.querySelector('.pg-score.player2')).toBeTruthy();

    const hist = renderMoveHistory(state);
    expect(hist.classList.contains('pg-move-history')).toBe(true);
    expect(hist.querySelectorAll('.pg-move-item')).toHaveLength(1);

    injectPrimeGoldStyles();
    expect(document.getElementById('prime-gold-styles')).toBeTruthy();
  });
});

describe('q-mp-596 ui-cov-r60 prime-gold controller residuals', () => {
  it('context-lost soft-misses when destroy clears host + controller mid-handler', async () => {
    const fake = fakeBoard3dModule();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(primeGoldLoader, 'loadPrimeGoldBoard3DModule').mockResolvedValue({
      createPrimeGoldBoard3D: fake.createPrimeGoldBoard3D,
    } as never);

    const markSpy = vi.spyOn(tabletGl, 'markBoard3dWebGlFallback');

    const {
      initGame,
      destroyGame,
      whenBoard3dReady,
      isUsingBoard3d,
      getGameState,
    } = await import('../../src/games/prime-gold/game-controller');

    const root = mountAppShell();
    initGame(root, false);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);

    const host = root.querySelector('.pg-board-host') as HTMLElement;
    expect(host).toBeTruthy();

    // Mid context-lost: destroy clears activeController before the handler's
    // activeController.update() arm — soft-miss (structure only).
    markSpy.mockImplementation(() => {
      destroyGame();
    });

    host.dispatchEvent(new CustomEvent('mp3d-context-lost'));
    expect(isUsingBoard3d()).toBe(false);
    // destroyGame clears controller mounts but leaves last-painted chrome.
    expect(getGameState()).toBeNull();
  });

  it('captured context-lost handler soft-misses after destroy (null host)', async () => {
    const fake = fakeBoard3dModule();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(primeGoldLoader, 'loadPrimeGoldBoard3DModule').mockResolvedValue({
      createPrimeGoldBoard3D: fake.createPrimeGoldBoard3D,
    } as never);

    let lostHandler: EventListener | null = null;
    const addSpy = vi
      .spyOn(HTMLElement.prototype, 'addEventListener')
      .mockImplementation(function (
        this: HTMLElement,
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
      ) {
        if (type === 'mp3d-context-lost' && typeof listener === 'function') {
          lostHandler = listener as EventListener;
        }
        return EventTarget.prototype.addEventListener.call(
          this,
          type,
          listener,
          options
        );
      });

    const { initGame, destroyGame, whenBoard3dReady, isUsingBoard3d } =
      await import('../../src/games/prime-gold/game-controller');

    const root = mountAppShell();
    initGame(root, false);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);
    expect(lostHandler).toEqual(expect.any(Function));

    destroyGame();
    expect(isUsingBoard3d()).toBe(false);

    // Handler re-entry with boardHostEl + activeController already cleared.
    expect(() => lostHandler!(new Event('mp3d-context-lost'))).not.toThrow();
    addSpy.mockRestore();
  });

  it('createPrimeGoldBoard3D throw → 2D catch + overlapping remount race', async () => {
    const fake = fakeBoard3dModule();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);

    let resolveLoad:
      | ((mod: {
          createPrimeGoldBoard3D: typeof fake.createPrimeGoldBoard3D;
        }) => void)
      | null = null;
    let loadCount = 0;
    vi.spyOn(primeGoldLoader, 'loadPrimeGoldBoard3DModule').mockImplementation(
      () => {
        loadCount += 1;
        if (loadCount === 1) {
          return new Promise((resolve) => {
            resolveLoad = resolve;
          });
        }
        return Promise.resolve({
          createPrimeGoldBoard3D: fake.createPrimeGoldBoard3D,
        }) as never;
      }
    );

    const { initGame, destroyGame, whenBoard3dReady, isUsingBoard3d } =
      await import('../../src/games/prime-gold/game-controller');

    const root = mountAppShell();

    // Overlapping remount while load #1 is pending — post-await soft arms
    // (activeController / board3dEnabled) must not throw.
    initGame(root, false);
    const pending1 = whenBoard3dReady();
    initGame(root, false);
    const pending2 = whenBoard3dReady();
    resolveLoad?.({ createPrimeGoldBoard3D: fake.createPrimeGoldBoard3D });
    await Promise.all([pending1, pending2]);
    expect(root.querySelector('.pg-board-host')).toBeTruthy();
    destroyGame();

    // createPrimeGoldBoard3D throw → catch disables 3D, 2D board paints.
    vi.spyOn(primeGoldLoader, 'loadPrimeGoldBoard3DModule').mockResolvedValue({
      createPrimeGoldBoard3D: async () => {
        throw new Error('WebGLRenderer failed');
      },
    } as never);
    initGame(root, false);
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(false);
    expect(root.querySelector('.pg-board')).toBeTruthy();
    expect(root.querySelector('.pg-board-host')).toBeNull();
    destroyGame();
  });

  it('status fall-through + tutorial step-changed soft-miss + stub AI roll', async () => {
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(false);
    vi.spyOn(primeAi, 'getAIPlacement').mockReturnValue(null);

    const {
      initGame,
      destroyGame,
      startTutorial,
      isTutorialActive,
      getGameState,
    } = await import('../../src/games/prime-gold/game-controller');

    const root = mountAppShell();
    const ctrl = initGame(root, false);

    // Non-painting phase: no winner / not gameOver / not AI / not rolling|placing
    // — status shell still mounts (class only; no copy pin).
    ctrl.state = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: null,
      // Force fall-through past tie arm by using a non-gameOver phase value
      // that is not rolling/placing (cast for soft residual only).
      ...({
        phase: 'paused' as PrimeGoldState['phase'],
      } as Pick<PrimeGoldState, 'phase'>),
    };
    ctrl.update();
    expect(root.querySelector('.pg-status')).toBeTruthy();
    expect(root.querySelector('.status-ai-thinking')).toBeNull();
    expect(root.querySelector('.pg-winner-banner')).toBeNull();

    // Tutorial step-changed events must not remount (only completed/exited).
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(root.querySelector('.pg-game-area')).toBeTruthy();
    tutorialManager.nextStep();
    expect(isTutorialActive()).toBe(true);
    expect(root.querySelector('.pg-game-area')).toBeTruthy();
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);

    // Stubbed AI computer seat: thinking chrome + roll path (no move-quality).
    const ai = initGame(root, true, 'easy');
    ai.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'rolling',
    };
    ai.update();
    expect(root.querySelector('.status-ai-thinking')).toBeTruthy();
    await vi.advanceTimersByTimeAsync(900);
    expect(getGameState()?.phase).toBeTruthy();
    destroyGame();
  });

  it('3d live update with AI thinking locks placement handler', async () => {
    const fake = fakeBoard3dModule();
    vi.spyOn(featureFlags, 'isBoard3dEnabled').mockReturnValue(true);
    vi.spyOn(primeGoldLoader, 'loadPrimeGoldBoard3DModule').mockResolvedValue({
      createPrimeGoldBoard3D: fake.createPrimeGoldBoard3D,
    } as never);
    vi.spyOn(primeAi, 'getAIPlacement').mockReturnValue(null);

    const { initGame, destroyGame, whenBoard3dReady, isUsingBoard3d } =
      await import('../../src/games/prime-gold/game-controller');

    const root = mountAppShell();
    const ctrl = initGame(root, true, 'medium');
    await whenBoard3dReady();
    expect(isUsingBoard3d()).toBe(true);

    const placing = seededPlacing();
    ctrl.state = { ...placing, currentPlayer: 'player2' };
    fake.update.mockClear();
    ctrl.update();
    expect(root.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(fake.update).toHaveBeenCalled();
    const args = fake.update.mock.calls.at(-1);
    // AI thinking → placement callback omitted (structure / arity only).
    expect(args?.[1]).toBeUndefined();

    destroyGame();
    expect(fake.unmount).toHaveBeenCalled();
  });

  it('board-3d-loader import smoke (unmocked dynamic gate)', async () => {
    const { loadPrimeGoldBoard3DModule } =
      await import('../../src/games/prime-gold/board-3d-loader');
    const mod = await loadPrimeGoldBoard3DModule();
    expect(mod).toBeTruthy();
    expect(typeof mod.createPrimeGoldBoard3D).toBe('function');
  });
});
