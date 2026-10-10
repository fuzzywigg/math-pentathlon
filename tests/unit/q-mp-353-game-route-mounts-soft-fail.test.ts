/**
 * q-mp-353 — Characterize game-route-mounts soft-fail / mount / dependency edges.
 *
 * Tests only. Structural asserts (null shell skip, missing board/status init
 * skip, clobber-recovery microtask, nested destroy swallow). No player-facing
 * copy pins, no src edits.
 *
 * Narrowed vs open drafts: #809 owns main.ts soft-fail; #813 owl UI cov;
 * #822 no-shadow controllers; burn-1007 covers happy-path mount matrix —
 * this file targets the residual soft-fail matrix (clobber recovery,
 * missing chrome, init+destroy dual throw, frac difficulty fallback).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { nextRouteGeneration } from '../../src/core/route-generation';
import type {
  GameShellElements,
  GameShellOptions,
} from '../../src/ui/components/game-shell';

const { mocks } = vi.hoisted(() => {
  const controllerFns = () => ({
    initGame: vi.fn(),
    destroyGame: vi.fn(),
    newGameVsHuman: vi.fn(),
    newGameVsAI: vi.fn(),
    startTutorial: vi.fn(),
  });

  const mocks = {
    kings: controllerFns(),
    hex: controllerFns(),
    starTrack: controllerFns(),
    hexAGone: controllerFns(),
    calla: controllerFns(),
    fiar: controllerFns(),
    queens: controllerFns(),
    contig: controllerFns(),
    juggle: controllerFns(),
    fab: controllerFns(),
    sumDominoes: controllerFns(),
    par55: controllerFns(),
    ramrod: controllerFns(),
    kwatro: controllerFns(),
    primeGold: controllerFns(),
    pent: controllerFns(),
    fracFact: controllerFns(),
    remainder: controllerFns(),
    pinball: controllerFns(),
    stars: controllerFns(),
  };

  return { mocks };
});

vi.mock(
  '../../src/games/kings-quadraphages/game-controller',
  () => mocks.kings
);
vi.mock('../../src/games/hex/game-controller', () => mocks.hex);
vi.mock('../../src/games/star-track/game-controller', () => mocks.starTrack);
vi.mock('../../src/games/hex-a-gone/game-controller', () => mocks.hexAGone);
vi.mock('../../src/games/calla/game-controller', () => mocks.calla);
vi.mock('../../src/games/fiar/game-controller', () => mocks.fiar);
vi.mock('../../src/games/queens-guards/game-controller', () => mocks.queens);
vi.mock('../../src/games/contig-60/game-controller', () => mocks.contig);
vi.mock('../../src/games/juggle/game-controller', () => mocks.juggle);
vi.mock('../../src/games/fab-a-diffy/game-controller', () => mocks.fab);
vi.mock(
  '../../src/games/sum-dominoes/game-controller',
  () => mocks.sumDominoes
);
vi.mock('../../src/games/par-55/game-controller', () => mocks.par55);
vi.mock('../../src/games/ramrod/game-controller', () => mocks.ramrod);
vi.mock('../../src/games/kwatro-sinko/game-controller', () => mocks.kwatro);
vi.mock('../../src/games/prime-gold/game-controller', () => mocks.primeGold);
vi.mock('../../src/games/pent-em-in/game-controller', () => mocks.pent);
vi.mock('../../src/games/frac-fact/game-controller', () => mocks.fracFact);
vi.mock(
  '../../src/games/remainder-islands/game-controller',
  () => mocks.remainder
);
vi.mock(
  '../../src/games/fraction-pinball/game-controller',
  () => mocks.pinball
);
vi.mock('../../src/games/stars-bars/game-controller', () => mocks.stars);

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
  handleRoute: vi.fn(),
}));

import { handleRoute, navigate } from '../../src/core/router';
import {
  initGameMountDeps,
  mountGameById,
} from '../../src/ui/game-route-mounts';

function makeShell(
  overrides: Partial<GameShellElements> = {}
): GameShellElements {
  const board = document.createElement('div');
  board.id = 'board';
  const status = document.createElement('div');
  status.id = 'status';
  return {
    board,
    status,
    historyContent: document.createElement('div'),
    moveHistoryPanel: null,
    newGameBtn: document.createElement('button'),
    tutorialBtn: null,
    helpBtn: null,
    helpModal: null,
    newGameModal: null,
    backBtn: null,
    cleanup: vi.fn(),
    ...overrides,
  };
}

describe('q-mp-353 game-route-mounts soft-fail residuals', () => {
  let container: HTMLElement;
  let lastCleanup: (() => void) | null;
  let lastOptions: GameShellOptions | null;
  let shell: GameShellElements;

  function wireDeps(
    mountGameShell: (
      c: HTMLElement,
      options: GameShellOptions
    ) => Promise<GameShellElements>
  ): void {
    initGameMountDeps({
      container,
      setCleanup: (fn) => {
        lastCleanup = fn;
      },
      mountGameShell,
      resolveAIDifficulty: (d) => d ?? 'medium',
    });
  }

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);
    container.innerHTML = `
      <label><input type="radio" name="frac-difficulty" value="easy"></label>
      <label><input type="radio" name="frac-difficulty" value="medium" checked></label>
    `;

    lastCleanup = null;
    lastOptions = null;
    shell = makeShell();

    for (const m of Object.values(mocks)) {
      m.initGame.mockReset();
      m.destroyGame.mockReset();
      m.newGameVsHuman.mockReset();
      m.newGameVsAI.mockReset();
      m.startTutorial.mockReset();
    }
    vi.mocked(navigate).mockClear();
    vi.mocked(handleRoute).mockClear();

    wireDeps(async (_c, options) => {
      lastOptions = options;
      return shell;
    });
  });

  afterEach(() => {
    lastCleanup?.();
    lastCleanup = null;
    container.remove();
    vi.clearAllMocks();
  });

  describe('clobber-recovery soft paths', () => {
    it('queues handleRoute when shell commits then route gen advances', async () => {
      let resolveShell: ((s: GameShellElements) => void) | null = null;
      wireDeps(
        () =>
          new Promise<GameShellElements>((resolve) => {
            resolveShell = resolve;
          })
      );

      const stale = nextRouteGeneration();
      const pending = mountGameById('hex', stale);
      await vi.waitFor(() => {
        expect(resolveShell).toBeTypeOf('function');
      });
      nextRouteGeneration();
      resolveShell!(shell);
      await pending;

      expect(shell.cleanup).toHaveBeenCalled();
      expect(mocks.hex.initGame).not.toHaveBeenCalled();
      expect(lastCleanup).toBeNull();

      await Promise.resolve(); // flush queueMicrotask
      expect(handleRoute).toHaveBeenCalledTimes(1);
    });

    it('skips remount when a newer mount already rewrote #app', async () => {
      const resolvers: Array<(s: GameShellElements) => void> = [];

      wireDeps(
        () =>
          new Promise<GameShellElements>((resolve) => {
            resolvers.push(resolve);
          })
      );

      const staleGen = nextRouteGeneration();
      const stalePending = mountGameById('hex', staleGen);
      await vi.waitFor(() => {
        expect(resolvers.length).toBe(1);
      });

      const freshGen = nextRouteGeneration();
      const freshShell = makeShell();
      const freshPending = mountGameById('calla', freshGen);
      await vi.waitFor(() => {
        expect(resolvers.length).toBe(2);
      });

      // Resolve stale first (queues recovery), then fresh so its ForRoute
      // continuation runs before the recovery microtask and updates
      // lastShellCommitGen to the current generation — recovery no-ops.
      resolvers[0]!(shell);
      resolvers[1]!(freshShell);

      await Promise.all([stalePending, freshPending]);
      expect(shell.cleanup).toHaveBeenCalled();
      expect(mocks.calla.initGame).toHaveBeenCalled();

      await Promise.resolve();
      expect(handleRoute).not.toHaveBeenCalled();
    });

    it('coalesces at most one clobber recovery per turn', async () => {
      const resolvers: Array<(s: GameShellElements) => void> = [];

      wireDeps(
        () =>
          new Promise<GameShellElements>((resolve) => {
            resolvers.push(resolve);
          })
      );

      // Same routeGen so both pass the post-import guard before we bump.
      const sharedGen = nextRouteGeneration();
      const pendingA = mountGameById('hex', sharedGen);
      await vi.waitFor(() => {
        expect(resolvers.length).toBe(1);
      });
      const pendingB = mountGameById('star-track', sharedGen);
      await vi.waitFor(() => {
        expect(resolvers.length).toBe(2);
      });

      nextRouteGeneration();

      const shellA = makeShell();
      const shellB = makeShell();
      resolvers[0]!(shellA);
      resolvers[1]!(shellB);
      await Promise.all([pendingA, pendingB]);

      expect(shellA.cleanup).toHaveBeenCalled();
      expect(shellB.cleanup).toHaveBeenCalled();

      await Promise.resolve();
      // Second queueClobberRecovery hits the in-flight flag and no-ops.
      expect(handleRoute).toHaveBeenCalledTimes(1);
    });
  });

  describe('missing chrome / soft init skips', () => {
    it('skips init when board+status missing (hex-shaped guard)', async () => {
      shell = makeShell({ board: null, status: null });
      wireDeps(async (_c, options) => {
        lastOptions = options;
        return shell;
      });

      await mountGameById('hex', nextRouteGeneration());
      expect(mocks.hex.initGame).not.toHaveBeenCalled();
      expect(lastCleanup).toBeTypeOf('function');
      lastCleanup!();
      expect(mocks.hex.destroyGame).toHaveBeenCalled();
      expect(shell.cleanup).toHaveBeenCalled();
      lastCleanup = null;
    });

    it('skips init when only board is missing (fab-shaped guard)', async () => {
      shell = makeShell({ board: null });
      wireDeps(async (_c, options) => {
        lastOptions = options;
        return shell;
      });

      await mountGameById('fab-a-diffy', nextRouteGeneration());
      expect(mocks.fab.initGame).not.toHaveBeenCalled();
      expect(lastCleanup).toBeTypeOf('function');
      lastCleanup!();
      expect(mocks.fab.destroyGame).toHaveBeenCalled();
      lastCleanup = null;
    });

    it('skips init when status missing but board present (calla guard)', async () => {
      shell = makeShell({ status: null });
      wireDeps(async (_c, options) => {
        lastOptions = options;
        return shell;
      });

      await mountGameById('calla', nextRouteGeneration());
      expect(mocks.calla.initGame).not.toHaveBeenCalled();
      expect(lastCleanup).toBeTypeOf('function');
      lastCleanup = null;
    });

    it('kings init soft-passes undefined history/newGame when chrome null', async () => {
      shell = makeShell({ historyContent: null, newGameBtn: null });
      wireDeps(async (_c, options) => {
        lastOptions = options;
        return shell;
      });

      await mountGameById('kings-quadraphages', nextRouteGeneration());
      expect(mocks.kings.initGame).toHaveBeenCalledTimes(1);
      const args = mocks.kings.initGame.mock.calls[0]!;
      expect(args[0]).toBe(shell.board);
      expect(args[1]).toBe(shell.status);
      expect(args[2]).toBeUndefined();
      expect(args[3]).toBeUndefined();
    });
  });

  describe('init abort + destroy soft-fail', () => {
    it('swallows destroy throw during aborted init; keeps original error', async () => {
      mocks.hex.initGame.mockImplementation(() => {
        throw new Error('init exploded');
      });
      mocks.hex.destroyGame.mockImplementation(() => {
        throw new Error('destroy also exploded');
      });

      await expect(mountGameById('hex', nextRouteGeneration())).rejects.toThrow(
        /init exploded/
      );

      expect(mocks.hex.destroyGame).toHaveBeenCalled();
      expect(shell.cleanup).toHaveBeenCalled();
      expect(lastCleanup).toBeNull();
    });

    it('null-shell after stale mount skips init for non-hex game', async () => {
      let resolveShell: ((s: GameShellElements) => void) | null = null;
      wireDeps(
        () =>
          new Promise<GameShellElements>((resolve) => {
            resolveShell = resolve;
          })
      );

      const stale = nextRouteGeneration();
      const pending = mountGameById('remainder-islands', stale);
      await vi.waitFor(() => {
        expect(resolveShell).toBeTypeOf('function');
      });
      nextRouteGeneration();
      resolveShell!(shell);
      await pending;

      expect(mocks.remainder.initGame).not.toHaveBeenCalled();
      expect(shell.cleanup).toHaveBeenCalled();
      expect(lastCleanup).toBeNull();
      await Promise.resolve();
      expect(handleRoute).toHaveBeenCalledTimes(1);
    });
  });

  describe('dependency / fallback edges', () => {
    it('frac-fact falls back to medium when no difficulty radio is checked', async () => {
      for (const el of container.querySelectorAll(
        'input[name="frac-difficulty"]'
      )) {
        (el as HTMLInputElement).checked = false;
      }

      await mountGameById('frac-fact', nextRouteGeneration());
      expect(lastOptions).toBeTruthy();
      lastOptions!.onStartGame('human-vs-human', 'easy');
      expect(mocks.fracFact.newGameVsHuman).toHaveBeenCalledWith('medium');
    });

    it('resolveAIDifficulty undefined → medium on human-vs-ai start', async () => {
      await mountGameById('hex', nextRouteGeneration());
      lastOptions!.onStartGame('human-vs-ai', undefined);
      expect(mocks.hex.newGameVsAI).toHaveBeenCalledWith('medium');
    });

    it('post-import stale gen soft-returns before shell options for calla', async () => {
      const stale = nextRouteGeneration();
      nextRouteGeneration();
      await mountGameById('calla', stale);
      expect(lastOptions).toBeNull();
      expect(mocks.calla.initGame).not.toHaveBeenCalled();
      expect(handleRoute).not.toHaveBeenCalled();
    });
  });
});
