/**
 * burn-1007 — game-route-mounts wiring (shell deps, per-game mount, stale gen).
 * Mocks every game-controller so we exercise mount chrome without engines.
 * Isolated: hoisted controller mocks must not leak into shared pool.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { nextRouteGeneration } from '../../src/core/route-generation';
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

vi.mock('../../src/games/kings-quadraphages/game-controller', () => mocks.kings);
vi.mock('../../src/games/hex/game-controller', () => mocks.hex);
vi.mock('../../src/games/star-track/game-controller', () => mocks.starTrack);
vi.mock('../../src/games/hex-a-gone/game-controller', () => mocks.hexAGone);
vi.mock('../../src/games/calla/game-controller', () => mocks.calla);
vi.mock('../../src/games/fiar/game-controller', () => mocks.fiar);
vi.mock('../../src/games/queens-guards/game-controller', () => mocks.queens);
vi.mock('../../src/games/contig-60/game-controller', () => mocks.contig);
vi.mock('../../src/games/juggle/game-controller', () => mocks.juggle);
vi.mock('../../src/games/fab-a-diffy/game-controller', () => mocks.fab);
vi.mock('../../src/games/sum-dominoes/game-controller', () => mocks.sumDominoes);
vi.mock('../../src/games/par-55/game-controller', () => mocks.par55);
vi.mock('../../src/games/ramrod/game-controller', () => mocks.ramrod);
vi.mock('../../src/games/kwatro-sinko/game-controller', () => mocks.kwatro);
vi.mock('../../src/games/prime-gold/game-controller', () => mocks.primeGold);
vi.mock('../../src/games/pent-em-in/game-controller', () => mocks.pent);
vi.mock('../../src/games/frac-fact/game-controller', () => mocks.fracFact);
vi.mock('../../src/games/remainder-islands/game-controller', () => mocks.remainder);
vi.mock('../../src/games/fraction-pinball/game-controller', () => mocks.pinball);
vi.mock('../../src/games/stars-bars/game-controller', () => mocks.stars);

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { navigate } from '../../src/core/router';
import {
  initGameMountDeps,
  mountGameById,
} from '../../src/ui/game-route-mounts';

function makeShell(): GameShellElements {
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
  };
}

describe('burn-1007 game-route-mounts', () => {
  let container: HTMLElement;
  let lastCleanup: (() => void) | null;
  let lastOptions: GameShellOptions | null;
  let shell: GameShellElements;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);
    // Frac Fact reads problem difficulty from the document.
    container.innerHTML = `
      <label><input type="radio" name="frac-difficulty" value="easy"></label>
      <label><input type="radio" name="frac-difficulty" value="medium" checked></label>
    `;

    lastCleanup = null;
    lastOptions = null;
    shell = makeShell();

    for (const m of Object.values(mocks)) {
      m.initGame.mockClear();
      m.destroyGame.mockClear();
      m.newGameVsHuman.mockClear();
      m.newGameVsAI.mockClear();
      m.startTutorial.mockClear();
    }
    vi.mocked(navigate).mockClear();

    initGameMountDeps({
      container,
      setCleanup: (fn) => {
        lastCleanup = fn;
      },
      mountGameShell: async (_c, options) => {
        lastOptions = options;
        return shell;
      },
      resolveAIDifficulty: (d) => d ?? 'medium',
    });
  });

  afterEach(() => {
    lastCleanup?.();
    lastCleanup = null;
    container.remove();
    vi.clearAllMocks();
  });

  it('throws when deps are not initialized', async () => {
    initGameMountDeps(null as unknown as never);
    await expect(mountGameById('hex', nextRouteGeneration())).rejects.toThrow(
      /deps not initialized/i
    );
    initGameMountDeps({
      container,
      setCleanup: (fn) => {
        lastCleanup = fn;
      },
      mountGameShell: async (_c, options) => {
        lastOptions = options;
        return shell;
      },
      resolveAIDifficulty: (d) => d ?? 'medium',
    });
  });

  it('throws on unknown game id', async () => {
    await expect(
      mountGameById('not-a-real-game', nextRouteGeneration())
    ).rejects.toThrow(/Unknown game id/i);
  });

  it('skips shell mount when route generation is stale after import', async () => {
    const stale = nextRouteGeneration();
    nextRouteGeneration(); // bump so stale !== current
    await mountGameById('hex', stale);
    expect(lastOptions).toBeNull();
    expect(mocks.hex.initGame).not.toHaveBeenCalled();
  });

  it.each([...GAME_IDS])(
    'mounts %s: wires init, AI/human start, tutorial, home, cleanup',
    async (gameId) => {
      const gen = nextRouteGeneration();
      await mountGameById(gameId, gen);

      expect(lastOptions).toBeTruthy();
      expect(lastOptions!.title.length).toBeGreaterThan(0);
      expect(lastOptions!.helpContentHtml.length).toBeGreaterThan(20);
      expect(typeof lastOptions!.onStartGame).toBe('function');
      expect(typeof lastOptions!.onNavigateHome).toBe('function');

      const ctrl = MOCK_BY_ID[gameId];
      expect(ctrl.initGame).toHaveBeenCalled();

      lastOptions!.onNavigateHome();
      expect(navigate).toHaveBeenCalledWith('/');

      if (lastOptions!.onTutorial) {
        lastOptions!.onTutorial();
        expect(ctrl.startTutorial).toHaveBeenCalled();
      }

      lastOptions!.onStartGame('human-vs-ai', 'hard');
      expect(ctrl.newGameVsAI).toHaveBeenCalled();
      lastOptions!.onStartGame('human-vs-human', 'easy');
      expect(ctrl.newGameVsHuman).toHaveBeenCalled();

      expect(lastCleanup).toBeTypeOf('function');
      lastCleanup!();
      expect(ctrl.destroyGame).toHaveBeenCalled();
      expect(shell.cleanup).toHaveBeenCalled();
      lastCleanup = null;
    }
  );
});
