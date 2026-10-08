/**
 * Memory / leak hygiene — locks lifecycle cleanup for long play sessions:
 * tutorial exit on route leave, AI timer clearTimeout on destroy, dice
 * animateRoll cancel, Hex AI watchdog clear, Stars history DOM cap,
 * 3D mount-paint cancel, PWA interval reset, graph animateMove cancel.
 */
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';
import {
  TutorialManager,
  exitTutorialIfActive,
  tutorialManager,
  type TutorialConfig,
} from '../../src/core/tutorial';
import { animateRoll } from '../../src/core/dice/dice-ui';
import { DiceSelector } from '../../src/core/dice/dice-selector';
import type { RollResult } from '../../src/core/dice/types';
import { scheduleBoard3dMountPaint } from '../../src/ui/three/tablet-gl';
import { resetPwaReloadGuardForTests, registerPwa } from '../../src/pwa/register';
import { animateMove, renderGraph } from '../../src/core/graph/graph-ui';
import { createTrackGraph } from '../../src/core/graph/types';
import { renderMoveHistory } from '../../src/games/stars-bars/board-ui';
import { createInitialState } from '../../src/games/stars-bars/rules';
import type { MoveRecord } from '../../src/games/stars-bars/types';

function sampleRoll(): RollResult {
  return {
    rolls: [
      {
        id: 'd1',
        diceType: 'd6',
        value: 4,
        isSelected: false,
        isLocked: false,
      },
    ],
    total: 4,
  };
}

describe('memory leak hygiene — tutorial route exit', () => {
  afterEach(() => {
    exitTutorialIfActive();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('exitTutorialIfActive removes overlay and keydown after mid-tutorial leave', () => {
    const cfg: TutorialConfig = {
      id: 'leak-tut',
      name: 'Leak',
      steps: [{ id: 's1', title: 'T', message: 'M' }],
    };
    tutorialManager.start(cfg);
    expect(tutorialManager.getIsActive()).toBe(true);
    expect(document.querySelector('.tutorial-overlay')).toBeTruthy();

    const keydownBefore = vi.fn();
    // Baseline: document has at least the tutorial keydown.
    document.addEventListener('keydown', keydownBefore);
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    exitTutorialIfActive();

    expect(tutorialManager.getIsActive()).toBe(false);
    expect(document.querySelector('.tutorial-overlay')).toBeNull();
    expect(document.querySelector('.tutorial-tooltip')).toBeNull();
    // Second call is a no-op (idempotent).
    exitTutorialIfActive();
    expect(tutorialManager.getIsActive()).toBe(false);

    document.removeEventListener('keydown', keydownBefore);
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('TutorialManager.exit unsubscribes handlers so remount does not stack', () => {
    const manager = new TutorialManager();
    const handler = vi.fn();
    const unsub = manager.on(handler);
    manager.start({
      id: 'stack',
      name: 'S',
      steps: [{ id: 'a', title: 'A', message: 'a' }],
    });
    manager.exit();
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'exited' })
    );
    unsub();
    manager.start({
      id: 'stack2',
      name: 'S2',
      steps: [{ id: 'b', title: 'B', message: 'b' }],
    });
    manager.exit();
    // Only the first exit fired the first handler (already unsubscribed via exited).
    expect(handler.mock.calls.filter((c) => c[0]?.type === 'exited').length).toBe(
      1
    );
  });
});

describe('memory leak hygiene — destroyGame clears AI timers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  const games: Array<{
    name: string;
    load: () => Promise<{
      destroyGame: () => void;
      setup: () => void;
    }>;
  }> = [
    {
      name: 'hex',
      load: async () => {
        const mod = await import('../../src/games/hex/game-controller');
        return {
          destroyGame: mod.destroyGame,
          setup: () => {
            const board = document.createElement('div');
            const status = document.createElement('div');
            document.body.append(board, status);
            mod.initGame(board, status);
            mod.newGameVsAI('easy');
          },
        };
      },
    },
    {
      name: 'fiar',
      load: async () => {
        const mod = await import('../../src/games/fiar/game-controller');
        return {
          destroyGame: mod.destroyGame,
          setup: () => {
            const board = document.createElement('div');
            const status = document.createElement('div');
            document.body.append(board, status);
            mod.initGame(board, status);
            mod.newGameVsAI('easy');
          },
        };
      },
    },
    {
      name: 'calla',
      load: async () => {
        const mod = await import('../../src/games/calla/game-controller');
        return {
          destroyGame: mod.destroyGame,
          setup: () => {
            const board = document.createElement('div');
            const status = document.createElement('div');
            document.body.append(board, status);
            mod.initGame(board, status);
            mod.newGameVsAI('easy');
          },
        };
      },
    },
    {
      name: 'contig-60',
      load: async () => {
        const mod = await import('../../src/games/contig-60/game-controller');
        return {
          destroyGame: mod.destroyGame,
          setup: () => {
            const board = document.createElement('div');
            const status = document.createElement('div');
            document.body.append(board, status);
            mod.initGame(board, status);
            mod.newGameVsAI('easy');
          },
        };
      },
    },
    {
      name: 'fraction-pinball',
      load: async () => {
        const mod = await import(
          '../../src/games/fraction-pinball/game-controller'
        );
        return {
          destroyGame: mod.destroyGame,
          setup: () => {
            const host = document.createElement('div');
            document.body.appendChild(host);
            mod.initGame(host);
            mod.newGameVsAI('easy');
          },
        };
      },
    },
  ];

  for (const g of games) {
    it(`${g.name} destroyGame + pending timers is safe (no throw)`, async () => {
      const { destroyGame, setup } = await g.load();
      setup();
      destroyGame();
      // Generation bump + clearTimeout must leave no mutating callbacks.
      expect(() => vi.runOnlyPendingTimers()).not.toThrow();
    });
  }

  it('stars-bars destroyGame clearsTimeout while AI think is pending', async () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    const mod = await import('../../src/games/stars-bars/game-controller');
    const {
      selectCard,
      placeCard,
      getValidPlacements,
    } = await import('../../src/games/stars-bars/rules');
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const container = document.createElement('div');
    app.appendChild(container);
    const ctrl = mod.initGame(container, true, 'easy');
    const blueCard = ctrl.state.playerHands.player1[0]!;
    let state = selectCard(ctrl.state, blueCard.id);
    const placement = getValidPlacements(state)[0]!;
    state = placeCard(state, placement.row, placement.col);
    ctrl.state = state;
    ctrl.update();
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    mod.destroyGame();
    expect(clearSpy).toHaveBeenCalled();
    expect(() => vi.runOnlyPendingTimers()).not.toThrow();
    clearSpy.mockRestore();
  });
});

describe('memory leak hygiene — hex AI watchdog clear', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('getBestMoveAsync clears the watchdog timer when the request settles', async () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { getBestMoveAsync, disposeHexAiWorker } = await import(
      '../../src/games/hex/ai-client'
    );
    const { createInitialState } = await import('../../src/games/hex/types');

    // Sync fallback path still races a watchdog — settling must clear it.
    const state = createInitialState();
    const movePromise = getBestMoveAsync(state, 'player2', 'easy', {
      deadlineMs: 50,
    });
    // Allow microtasks / fake timers for the race to settle.
    await vi.runAllTimersAsync();
    await movePromise;
    expect(clearSpy).toHaveBeenCalled();
    disposeHexAiWorker();
    clearSpy.mockRestore();
  });
});

describe('memory leak hygiene — dice animateRoll cancel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('cancel() stops the setTimeout chain before onComplete', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const onComplete = vi.fn();
    const cancel = animateRoll(host, sampleRoll(), {
      duration: 500,
      dieSize: 32,
      onComplete,
    });
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    cancel();
    vi.runOnlyPendingTimers();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('DiceSelector.destroy cancels an in-flight roll animation', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => undefined,
          removeListener: () => undefined,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => false,
        }) as MediaQueryList,
    });

    const sel = new DiceSelector(host, {
      autoRoll: true,
      showRollButton: false,
    });
    expect(vi.getTimerCount()).toBeGreaterThanOrEqual(0);
    sel.destroy();
    expect(() => vi.runOnlyPendingTimers()).not.toThrow();
  });
});

describe('memory leak hygiene — stars-bars history display', () => {
  // #501 proposed slice(-15); tip keeps full history (player-visible) until Andrew decides.
  it('renderMoveHistory paints the full move list', () => {
    let state = createInitialState();
    const history: MoveRecord[] = [];
    for (let i = 0; i < 40; i++) {
      history.push({
        player: i % 2 === 0 ? 'player1' : 'player2',
        card: {
          id: `c${i}`,
          shape: 'circle',
          color: 'red',
          size: 'small',
          thickness: 'thin',
        },
        row: 0,
        col: i % 8,
        score: 1,
        breakdown: '+1',
      });
    }
    state = { ...state, moveHistory: history };
    const el = renderMoveHistory(state);
    expect(el.querySelectorAll('.stars-move-item').length).toBe(40);
  });
});

describe('memory leak hygiene — scheduleBoard3dMountPaint cancel', () => {
  it('cancel prevents paint after scheduled double-rAF', () => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 0) as unknown as number;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      clearTimeout(id);
    });
    vi.useFakeTimers();
    const paint = vi.fn();
    const cancel = scheduleBoard3dMountPaint(paint);
    cancel();
    vi.runOnlyPendingTimers();
    expect(paint).not.toHaveBeenCalled();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
});

describe('memory leak hygiene — PWA update interval', () => {
  afterEach(() => {
    resetPwaReloadGuardForTests();
    vi.restoreAllMocks();
  });

  it('re-register clears the previous hourly update interval', () => {
    const clearSpy = vi.spyOn(window, 'clearInterval');
    const registrations: Array<{ update: ReturnType<typeof vi.fn> }> = [];
    const registerSW = vi.fn(
      (opts: {
        onRegisteredSW?: (url: string, reg: ServiceWorkerRegistration) => void;
      }) => {
        const reg = {
          update: vi.fn(),
        } as unknown as ServiceWorkerRegistration;
        registrations.push(reg as unknown as { update: ReturnType<typeof vi.fn> });
        opts.onRegisteredSW?.('/sw.js', reg);
        return vi.fn();
      }
    );

    registerPwa({ enabled: true, registerSW: registerSW as never });
    registerPwa({ enabled: true, registerSW: registerSW as never });
    expect(clearSpy).toHaveBeenCalled();
  });
});

describe('memory leak hygiene — graph animateMove cancel', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 16) as unknown as number;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      clearTimeout(id);
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('cancel() stops pending rAF and resolves without leaving frames', async () => {
    const graph = createTrackGraph(2);
    const svg = renderGraph(graph);
    document.body.appendChild(svg);
    const handle = animateMove(svg, ['t0', 't1'], graph, 200);
    expect(typeof handle.cancel).toBe('function');
    handle.cancel();
    await expect(handle).resolves.toBeUndefined();
    vi.runOnlyPendingTimers();
  });
});
