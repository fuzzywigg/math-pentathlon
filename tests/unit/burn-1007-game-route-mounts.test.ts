/**
 * burn-1007 — UI route-mount wiring (shell chrome + controller handoff).
 * Controllers are mocked; engines stay out of scope.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  nextRouteGeneration,
} from '../../src/core/route-generation';
import type {
  GameShellElements,
  GameShellOptions,
} from '../../src/ui/components/game-shell';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

const controllerFns = () => ({
  initGame: vi.fn(),
  destroyGame: vi.fn(),
  newGameVsHuman: vi.fn(),
  newGameVsAI: vi.fn(),
  startTutorial: vi.fn(),
});

vi.mock('../../src/games/kings-quadraphages/game-controller', () =>
  controllerFns()
);
vi.mock('../../src/games/hex/game-controller', () => controllerFns());
vi.mock('../../src/games/star-track/game-controller', () => controllerFns());
vi.mock('../../src/games/hex-a-gone/game-controller', () => controllerFns());
vi.mock('../../src/games/calla/game-controller', () => controllerFns());
vi.mock('../../src/games/fiar/game-controller', () => controllerFns());
vi.mock('../../src/games/queens-guards/game-controller', () => controllerFns());
vi.mock('../../src/games/contig-60/game-controller', () => controllerFns());
vi.mock('../../src/games/juggle/game-controller', () => controllerFns());
vi.mock('../../src/games/fab-a-diffy/game-controller', () => controllerFns());
vi.mock('../../src/games/sum-dominoes/game-controller', () => controllerFns());
vi.mock('../../src/games/par-55/game-controller', () => controllerFns());
vi.mock('../../src/games/ramrod/game-controller', () => controllerFns());
vi.mock('../../src/games/kwatro-sinko/game-controller', () => controllerFns());
vi.mock('../../src/games/prime-gold/game-controller', () => controllerFns());
vi.mock('../../src/games/pent-em-in/game-controller', () => controllerFns());
vi.mock('../../src/games/frac-fact/game-controller', () => controllerFns());
vi.mock('../../src/games/remainder-islands/game-controller', () =>
  controllerFns()
);
vi.mock('../../src/games/fraction-pinball/game-controller', () =>
  controllerFns()
);
vi.mock('../../src/games/stars-bars/game-controller', () => controllerFns());

import { navigate } from '../../src/core/router';
import {
  initGameMountDeps,
  mountGameById,
  resetGameMountDepsForTests,
} from '../../src/ui/game-route-mounts';

const GAME_IDS = [
  'kings-quadraphages',
  'hex',
  'star-track',
  'hex-a-gone',
  'calla',
  'fiar',
  'queens-guards',
  'contig-60',
  'juggle',
  'fab-a-diffy',
  'sum-dominoes',
  'par-55',
  'ramrod',
  'kwatro-sinko',
  'stars-bars',
  'prime-gold',
  'pent-em-in',
  'frac-fact',
  'remainder-islands',
  'fraction-pinball',
] as const;

function fakeShell(): GameShellElements {
  const board = document.createElement('div');
  board.id = 'board';
  const status = document.createElement('div');
  status.id = 'status';
  const historyContent = document.createElement('div');
  const newGameBtn = document.createElement('button');
  return {
    board,
    status,
    historyContent,
    moveHistoryPanel: null,
    newGameBtn,
    tutorialBtn: null,
    helpBtn: null,
    helpModal: null,
    newGameModal: null,
    backBtn: null,
    cleanup: vi.fn(),
  };
}

describe('burn-1007 game-route-mounts', () => {
  let container: HTMLElement;
  let lastCleanup: (() => void) | null;
  let lastOptions: GameShellOptions | null;
  let mountShell: ReturnType<typeof vi.fn>;
  let shell: GameShellElements;

  beforeEach(() => {
    resetGameMountDepsForTests();
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);
    // Frac-fact reads problem difficulty from a live radio.
    const fracRadio = document.createElement('input');
    fracRadio.type = 'radio';
    fracRadio.name = 'frac-difficulty';
    fracRadio.value = 'easy';
    fracRadio.checked = true;
    document.body.appendChild(fracRadio);

    lastCleanup = null;
    lastOptions = null;
    shell = fakeShell();
    mountShell = vi.fn(async (_c: HTMLElement, options: GameShellOptions) => {
      lastOptions = options;
      return shell;
    });

    initGameMountDeps({
      container,
      setCleanup: (fn) => {
        lastCleanup = fn;
      },
      mountGameShell: mountShell,
      resolveAIDifficulty: (d) => d ?? 'medium',
    });
  });

  afterEach(() => {
    lastCleanup?.();
    lastCleanup = null;
    resetGameMountDepsForTests();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('throws when mount deps were never initialized', async () => {
    resetGameMountDepsForTests();
    await expect(
      mountGameById('hex', nextRouteGeneration())
    ).rejects.toThrow(/Game mount deps not initialized/);
  });

  it('throws on unknown game id', async () => {
    await expect(
      mountGameById('not-a-real-game', nextRouteGeneration())
    ).rejects.toThrow(/Unknown game id/);
  });

  it('skips shell mount when the route generation is stale', async () => {
    const stale = nextRouteGeneration();
    nextRouteGeneration();
    await mountGameById('hex', stale);
    expect(mountShell).not.toHaveBeenCalled();
  });

  it.each(GAME_IDS)(
    'mounts %s, wires start/tutorial/home, and cleans up',
    async (gameId) => {
      const gen = nextRouteGeneration();
      await mountGameById(gameId, gen);

      expect(mountShell).toHaveBeenCalledTimes(1);
      expect(lastOptions?.title).toBeTruthy();
      expect(lastOptions?.helpContentHtml).toContain('<h3>');
      expect(lastCleanup).toBeTypeOf('function');

      lastOptions?.onNavigateHome();
      expect(navigate).toHaveBeenCalledWith('/');

      lastOptions?.onStartGame('human-vs-human');
      lastOptions?.onStartGame('human-vs-ai', 'hard');
      lastOptions?.onTutorial?.();

      const cleanupFn = lastCleanup!;
      cleanupFn();
      expect(shell.cleanup).toHaveBeenCalled();
    }
  );
});
