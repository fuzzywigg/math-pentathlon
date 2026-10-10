/**
 * q-mp-677 — Close `game-route-mounts` residual branches (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1059`):
 *   isolated mounts suites (`burn-1007` + `q-mp-353`):
 *     **90.16%** lines (330/366) / **75.57%** branches (164/217)
 *   Uncovered branch clusters: post-import stale returns, null-shell
 *     early returns after mid-mount stale, and `mountGameShellForRoute`
 *     pre-await stale (L89) which callers normally skip synchronously.
 *
 * Ownership: leave `#1006`/`549` soft-fail char + mounts nnnull HOLD
 * with **contained** (this ticket is branch coverage, not soft-fail
 * inventory). Zero `src/` edits; no copy / aria pins; no ratchet JSON;
 * no AI / rules / scoring; Hex Hard 450ms untouched; no network.
 *
 * Isolated: hoisted controller mocks must not leak into unit-shared.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as routeGeneration from '../../src/core/route-generation';
import {
  getRouteGeneration,
  isCurrentRouteGeneration,
  nextRouteGeneration,
} from '../../src/core/route-generation';
import type {
  GameShellElements,
  GameShellOptions,
} from '../../src/ui/components/game-shell';

const { mocks, GAME_IDS, MOCK_BY_ID } = vi.hoisted(() => {
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

  return { mocks, GAME_IDS, MOCK_BY_ID };
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

describe('q-mp-677 game-route-mounts residual branches', () => {
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

  describe('post-import stale soft-return (per-game residual)', () => {
    it.each([...GAME_IDS])(
      '%s returns before shell options when routeGen is already stale',
      async (gameId) => {
        const stale = nextRouteGeneration();
        nextRouteGeneration();
        await mountGameById(gameId, stale);

        expect(lastOptions).toBeNull();
        expect(MOCK_BY_ID[gameId].initGame).not.toHaveBeenCalled();
        expect(lastCleanup).toBeNull();
        await Promise.resolve();
        expect(handleRoute).not.toHaveBeenCalled();
      }
    );
  });

  describe('null-shell after mid-mount stale (per-game residual)', () => {
    it.each([...GAME_IDS])(
      '%s skips init when shell commit is clobbered mid-await',
      async (gameId) => {
        let resolveShell: ((s: GameShellElements) => void) | null = null;
        wireDeps(
          () =>
            new Promise<GameShellElements>((resolve) => {
              resolveShell = resolve;
            })
        );

        const stale = nextRouteGeneration();
        const pending = mountGameById(gameId, stale);
        await vi.waitFor(() => {
          expect(resolveShell).toBeTypeOf('function');
        });
        nextRouteGeneration();
        resolveShell!(shell);
        await pending;

        expect(MOCK_BY_ID[gameId].initGame).not.toHaveBeenCalled();
        expect(shell.cleanup).toHaveBeenCalled();
        expect(lastCleanup).toBeNull();
        await Promise.resolve();
        expect(handleRoute).toHaveBeenCalled();
      }
    );
  });

  describe('mountGameShellForRoute pre-await stale (L89 keep-path)', () => {
    it('returns null when gen flips between caller guard and ForRoute check', async () => {
      // Callers check isCurrentRouteGeneration synchronously before
      // mountGameShellForRoute; L89 is unreachable without a flip between
      // those two checks. Spy once so the ForRoute pre-await arm is cold-hit.
      const spy = vi.spyOn(routeGeneration, 'isCurrentRouteGeneration');
      let forRouteChecks = 0;
      spy.mockImplementation((gen: number) => {
        // First check after dynamic import: allow through.
        // Second check (ForRoute pre-await): force stale.
        forRouteChecks += 1;
        if (forRouteChecks === 2) {
          return false;
        }
        return getRouteGeneration() === gen;
      });

      try {
        const gen = nextRouteGeneration();
        await mountGameById('hex', gen);

        expect(forRouteChecks).toBeGreaterThanOrEqual(2);
        expect(lastOptions).toBeNull();
        expect(mocks.hex.initGame).not.toHaveBeenCalled();
        expect(lastCleanup).toBeNull();
      } finally {
        spy.mockRestore();
      }
      expect(isCurrentRouteGeneration(getRouteGeneration())).toBe(true);
    });
  });
});
