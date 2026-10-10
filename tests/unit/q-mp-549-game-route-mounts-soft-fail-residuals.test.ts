/**
 * q-mp-549 — Characterize `game-route-mounts` soft-fail residuals (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post949` @ `701cba47`):
 *   `game-route-mounts.ts` **1961** LOC (backlog stamp **1962** ≈ live)
 *   Dedicated `*game-route-mounts*` files before this suite: **2**
 *     (`burn-1007`, `q-mp-353`) — backlog “9 test-name matches” counted
 *     broader `*mounts*` handshake filenames; residual soft-fail matrix
 *     after those two is still thin.
 *   Overlay nnnull residual **28** (`shell!.board!` ×14 sites) — main cold
 *     UI surface; do **not** clear (leave ceiling owners / soft-fail HOLD).
 *   `if (shell.board && shell.status)` guards **10**; board-only
 *     `if (shell.board)` guards **10**; null-shell early returns **20**.
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   `#921` / `#459` nullish mounts clear — leave open **contained**
 *   `q-mp-548` mutation host — keep this file on soft-fail / skip arms only
 *   `q-mp-353` / `burn-1007` — prior soft-fail + happy-path matrix; this
 *     suite owns residuals those left thin (board-only family expand,
 *     board&&status family expand, pre-commit stale no-recovery,
 *     nnnull onStartGame keep-sites, init `false` second-arg soft pins)
 *
 * Constraints: tests only; zero `src/` edits; no nullish/nnnull ceiling
 * write; no AI / rules / scoring / copy / aria pins; Hex Hard 450ms;
 * no network; no ratchet JSON.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { nextRouteGeneration } from '../../src/core/route-generation';
import type {
  GameShellElements,
  GameShellOptions,
} from '../../src/ui/components/game-shell';

const MOUNTS_SRC = readFileSync(
  resolve(process.cwd(), 'src/ui/game-route-mounts.ts'),
  'utf8'
);

const { mocks, MOCK_BY_ID } = vi.hoisted(() => {
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

  const MOCK_BY_ID = {
    'kings-quadraphages': mocks.kings,
    hex: mocks.hex,
    'star-track': mocks.starTrack,
    'hex-a-gone': mocks.hexAGone,
    calla: mocks.calla,
    fiar: mocks.fiar,
    'queens-guards': mocks.queens,
    'contig-60': mocks.contig,
    juggle: mocks.juggle,
    'fab-a-diffy': mocks.fab,
    'sum-dominoes': mocks.sumDominoes,
    'par-55': mocks.par55,
    ramrod: mocks.ramrod,
    'kwatro-sinko': mocks.kwatro,
    'stars-bars': mocks.stars,
    'prime-gold': mocks.primeGold,
    'pent-em-in': mocks.pent,
    'frac-fact': mocks.fracFact,
    'remainder-islands': mocks.remainder,
    'fraction-pinball': mocks.pinball,
  } as const;

  return { mocks, MOCK_BY_ID };
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

/** Board+status init guard family (q-mp-353 covered hex + calla only). */
const BOARD_AND_STATUS_RESIDUALS = [
  'star-track',
  'hex-a-gone',
  'fiar',
  'queens-guards',
  'contig-60',
  'juggle',
  'pent-em-in',
  'kings-quadraphages',
] as const;

/** Board-only init guard family (q-mp-353 covered fab-a-diffy only). */
const BOARD_ONLY_RESIDUALS = [
  'sum-dominoes',
  'par-55',
  'ramrod',
  'kwatro-sinko',
  'prime-gold',
  'frac-fact',
  'remainder-islands',
  'fraction-pinball',
  'stars-bars',
] as const;

/** onStartGame sites that nnnull through `shell!.board!` (overlay ×14). */
const NNNULL_BOARD_START_GAMES = [
  'fab-a-diffy',
  'sum-dominoes',
  'par-55',
  'ramrod',
  'kwatro-sinko',
  'prime-gold',
  'stars-bars',
] as const;

/** Controllers that pass `false` as initGame's second arg when board present. */
const INIT_FALSE_SECOND_ARG = [
  'fab-a-diffy',
  'sum-dominoes',
  'par-55',
  'ramrod',
  'kwatro-sinko',
  'prime-gold',
  'stars-bars',
] as const;

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

// =============================================================================
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-549 game-route-mounts — source soft-fail keep-sites', () => {
  it('keeps clobber-recovery coalesce + newer-mount skip arms', () => {
    expect(MOUNTS_SRC).toMatch(
      /if\s*\(\s*clobberRecoveryQueued\s*\)\s*\{\s*return;/
    );
    expect(MOUNTS_SRC).toMatch(
      /if\s*\(\s*lastShellCommitGen\s*===\s*getRouteGeneration\(\)\s*\)\s*\{\s*return;/
    );
    expect(MOUNTS_SRC).toMatch(/queueMicrotask\(\s*\(\)\s*=>\s*\{/);
    expect(MOUNTS_SRC).toContain('handleRoute()');
  });

  it('keeps mountGameShellForRoute pre/post-await stale soft-returns', () => {
    expect(MOUNTS_SRC).toMatch(
      /if\s*\(\s*!isCurrentRouteGeneration\(routeGen\)\s*\)\s*\{\s*return\s*null;/
    );
    expect(MOUNTS_SRC).toMatch(
      /shell\.cleanup\(\);\s*queueClobberRecovery\(\);/
    );
    expect(MOUNTS_SRC).toMatch(/return\s*null;/);
  });

  it('keeps initGameWithRouteCleanup destroy-swallow + cleanup clear', () => {
    expect(MOUNTS_SRC).toMatch(
      /catch\s*\{\s*\/\/ Destroy during aborted init is best-effort/
    );
    expect(MOUNTS_SRC).toMatch(/setCurrentCleanup\(null\);\s*throw err;/);
    expect(MOUNTS_SRC).toMatch(
      /try\s*\{\s*destroyGame\(\);\s*\}\s*finally\s*\{\s*shell\.cleanup\(\);/
    );
  });

  it('keeps board&&status vs board-only init soft-skip families', () => {
    const both =
      MOUNTS_SRC.match(/if \(shell\.board && shell\.status\)/g) ?? [];
    const boardOnly = MOUNTS_SRC.match(/if \(shell\.board\) \{/g) ?? [];
    const nullShell = MOUNTS_SRC.match(/if \(!shell\) \{\s*return;/g) ?? [];
    expect(both).toHaveLength(10);
    expect(boardOnly).toHaveLength(10);
    expect(nullShell).toHaveLength(20);
  });

  it('keeps nnnull shell!.board! onStartGame residual (overlay 28 / 14 sites)', () => {
    const sites = MOUNTS_SRC.match(/shell!\.board!/g) ?? [];
    expect(sites).toHaveLength(14);
    // Each site is two assertions (shell! + board!) → overlay residual 28.
    // Do not count bare `board!` — help HTML contains "…board!" prose.
    expect((MOUNTS_SRC.match(/shell!/g) ?? []).length).toBe(14);
  });

  it('keeps unknown-id default throw + exhaustive void soft arm', () => {
    expect(MOUNTS_SRC).toMatch(
      /const _exhaustive:\s*string\s*=\s*gameId;\s*void _exhaustive;/
    );
    expect(MOUNTS_SRC).toMatch(
      /throw new Error\(`Unknown game id: \$\{gameId\}`\);/
    );
  });
});

// =============================================================================
// 2. Behavioral soft-fail residuals
// =============================================================================

describe('q-mp-549 game-route-mounts soft-fail residuals', () => {
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
      <label><input type="radio" name="frac-difficulty" value="hard"></label>
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

  describe('board&&status init soft-skips (residual family)', () => {
    it.each([...BOARD_AND_STATUS_RESIDUALS])(
      '%s skips init when board+status missing; cleanup still registered',
      async (gameId) => {
        shell = makeShell({ board: null, status: null });
        wireDeps(async (_c, options) => {
          lastOptions = options;
          return shell;
        });

        await mountGameById(gameId, nextRouteGeneration());
        const ctrl = MOCK_BY_ID[gameId];
        expect(ctrl.initGame).not.toHaveBeenCalled();
        expect(lastCleanup).toBeTypeOf('function');
        lastCleanup!();
        expect(ctrl.destroyGame).toHaveBeenCalled();
        expect(shell.cleanup).toHaveBeenCalled();
        lastCleanup = null;
      }
    );

    it.each([...BOARD_AND_STATUS_RESIDUALS])(
      '%s skips init when only status is missing',
      async (gameId) => {
        shell = makeShell({ status: null });
        wireDeps(async (_c, options) => {
          lastOptions = options;
          return shell;
        });

        await mountGameById(gameId, nextRouteGeneration());
        expect(MOCK_BY_ID[gameId].initGame).not.toHaveBeenCalled();
        expect(lastCleanup).toBeTypeOf('function');
        lastCleanup = null;
      }
    );
  });

  describe('board-only init soft-skips (residual family)', () => {
    it.each([...BOARD_ONLY_RESIDUALS])(
      '%s skips init when board missing; cleanup still registered',
      async (gameId) => {
        shell = makeShell({ board: null });
        wireDeps(async (_c, options) => {
          lastOptions = options;
          return shell;
        });

        await mountGameById(gameId, nextRouteGeneration());
        const ctrl = MOCK_BY_ID[gameId];
        expect(ctrl.initGame).not.toHaveBeenCalled();
        expect(lastCleanup).toBeTypeOf('function');
        lastCleanup!();
        expect(ctrl.destroyGame).toHaveBeenCalled();
        expect(shell.cleanup).toHaveBeenCalled();
        lastCleanup = null;
      }
    );

    it.each([...BOARD_ONLY_RESIDUALS])(
      '%s still inits when status is null (board-only asymmetry)',
      async (gameId) => {
        shell = makeShell({ status: null });
        wireDeps(async (_c, options) => {
          lastOptions = options;
          return shell;
        });

        await mountGameById(gameId, nextRouteGeneration());
        expect(MOCK_BY_ID[gameId].initGame).toHaveBeenCalledTimes(1);
        expect(MOCK_BY_ID[gameId].initGame.mock.calls[0]![0]).toBe(shell.board);
      }
    );
  });

  describe('pre-commit stale soft-return (no clobber recovery)', () => {
    it('post-import stale does not queue handleRoute (never committed shell)', async () => {
      const stale = nextRouteGeneration();
      nextRouteGeneration();
      await mountGameById('stars-bars', stale);
      expect(lastOptions).toBeNull();
      expect(mocks.stars.initGame).not.toHaveBeenCalled();
      await Promise.resolve();
      expect(handleRoute).not.toHaveBeenCalled();
    });

    it('post-import stale across board&&status host also skips recovery', async () => {
      const stale = nextRouteGeneration();
      nextRouteGeneration();
      await mountGameById('queens-guards', stale);
      expect(lastOptions).toBeNull();
      expect(mocks.queens.initGame).not.toHaveBeenCalled();
      await Promise.resolve();
      expect(handleRoute).not.toHaveBeenCalled();
    });
  });

  describe('nnnull onStartGame board! residual contracts', () => {
    it.each([...NNNULL_BOARD_START_GAMES])(
      '%s onStartGame forwards shell.board after successful mount',
      async (gameId) => {
        await mountGameById(gameId, nextRouteGeneration());
        expect(lastOptions).toBeTruthy();
        const ctrl = MOCK_BY_ID[gameId];

        lastOptions!.onStartGame('human-vs-ai', 'hard');
        expect(ctrl.newGameVsAI).toHaveBeenCalledWith(shell.board, 'hard');

        lastOptions!.onStartGame('human-vs-human', 'easy');
        expect(ctrl.newGameVsHuman).toHaveBeenCalledWith(shell.board);
      }
    );

    it.each([...NNNULL_BOARD_START_GAMES])(
      '%s onStartGame forwards null board at runtime (nnnull is type-level only)',
      async (gameId) => {
        // `shell!.board!` erases at emit — runtime still passes null through.
        // Document CURRENT soft-fail HOLD; do not “fix” via product edits.
        shell = makeShell({ board: null });
        wireDeps(async (_c, options) => {
          lastOptions = options;
          return shell;
        });

        await mountGameById(gameId, nextRouteGeneration());
        expect(MOCK_BY_ID[gameId].initGame).not.toHaveBeenCalled();
        expect(lastOptions).toBeTruthy();
        lastOptions!.onStartGame('human-vs-human', 'easy');
        expect(MOCK_BY_ID[gameId].newGameVsHuman).toHaveBeenCalledWith(null);
        lastCleanup = null;
      }
    );
  });

  describe('init second-arg + frac/kings start soft edges', () => {
    it.each([...INIT_FALSE_SECOND_ARG])(
      '%s initGame soft-passes false as second arg when board present',
      async (gameId) => {
        await mountGameById(gameId, nextRouteGeneration());
        const ctrl = MOCK_BY_ID[gameId];
        expect(ctrl.initGame).toHaveBeenCalledTimes(1);
        expect(ctrl.initGame.mock.calls[0]![0]).toBe(shell.board);
        expect(ctrl.initGame.mock.calls[0]![1]).toBe(false);
      }
    );

    it('frac-fact AI start uses problem difficulty + resolved AI difficulty', async () => {
      const hard = container.querySelector(
        'input[name="frac-difficulty"][value="hard"]'
      ) as HTMLInputElement;
      hard.checked = true;

      await mountGameById('frac-fact', nextRouteGeneration());
      lastOptions!.onStartGame('human-vs-ai', 'easy');
      expect(mocks.fracFact.newGameVsAI).toHaveBeenCalledWith('hard', 'easy');
    });

    it('kings AI start soft-passes true as second arg (seat flag)', async () => {
      await mountGameById('kings-quadraphages', nextRouteGeneration());
      lastOptions!.onStartGame('human-vs-ai', 'hard');
      expect(mocks.kings.newGameVsAI).toHaveBeenCalledWith('hard', true);
    });

    it('remainder/pinball inits with board only (no second arg)', async () => {
      await mountGameById('remainder-islands', nextRouteGeneration());
      expect(mocks.remainder.initGame).toHaveBeenCalledWith(shell.board);

      // Remount pinball on a fresh gen.
      shell = makeShell();
      wireDeps(async (_c, options) => {
        lastOptions = options;
        return shell;
      });
      await mountGameById('fraction-pinball', nextRouteGeneration());
      expect(mocks.pinball.initGame).toHaveBeenCalledWith(shell.board);
    });
  });

  describe('init abort destroy-swallow residual (non-hex host)', () => {
    it('swallows destroy throw on stars-bars init abort; keeps original error', async () => {
      mocks.stars.initGame.mockImplementation(() => {
        throw new Error('stars init exploded');
      });
      mocks.stars.destroyGame.mockImplementation(() => {
        throw new Error('stars destroy also exploded');
      });

      await expect(
        mountGameById('stars-bars', nextRouteGeneration())
      ).rejects.toThrow(/stars init exploded/);

      expect(mocks.stars.destroyGame).toHaveBeenCalled();
      expect(shell.cleanup).toHaveBeenCalled();
      expect(lastCleanup).toBeNull();
    });

    it('swallows destroy throw on sum-dominoes init abort', async () => {
      mocks.sumDominoes.initGame.mockImplementation(() => {
        throw new Error('sd init exploded');
      });
      mocks.sumDominoes.destroyGame.mockImplementation(() => {
        throw new Error('sd destroy also exploded');
      });

      await expect(
        mountGameById('sum-dominoes', nextRouteGeneration())
      ).rejects.toThrow(/sd init exploded/);

      expect(mocks.sumDominoes.destroyGame).toHaveBeenCalled();
      expect(shell.cleanup).toHaveBeenCalled();
      expect(lastCleanup).toBeNull();
    });
  });

  describe('clobber recovery residual hosts', () => {
    it('queues recovery for board-only host when shell commits then gen advances', async () => {
      let resolveShell: ((s: GameShellElements) => void) | null = null;
      wireDeps(
        () =>
          new Promise<GameShellElements>((resolve) => {
            resolveShell = resolve;
          })
      );

      const stale = nextRouteGeneration();
      const pending = mountGameById('prime-gold', stale);
      await vi.waitFor(() => {
        expect(resolveShell).toBeTypeOf('function');
      });
      nextRouteGeneration();
      resolveShell!(shell);
      await pending;

      expect(shell.cleanup).toHaveBeenCalled();
      expect(mocks.primeGold.initGame).not.toHaveBeenCalled();
      expect(lastCleanup).toBeNull();

      await Promise.resolve();
      expect(handleRoute).toHaveBeenCalledTimes(1);
    });
  });
});
