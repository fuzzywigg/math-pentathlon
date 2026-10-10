/**
 * q-mp-548 mutation audit UI wave 19 — game-route-mounts first-20 re-pins.
 * Happy-path / shell-option / init wiring only — no soft-fail arms owned by
 * q-mp-353 / future char 549. No player-facing copy asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

import { navigate } from '../../src/core/router';
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

describe('mutation-ui19 game-route-mounts', () => {
  let container: HTMLElement;
  let lastCleanup: (() => void) | null;
  let lastOptions: GameShellOptions | null;
  let shell: GameShellElements;
  let resolveDiffCalls: Array<string | undefined>;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);

    lastCleanup = null;
    lastOptions = null;
    shell = makeShell();
    resolveDiffCalls = [];

    for (const m of Object.values(mocks)) {
      m.initGame.mockReset();
      m.destroyGame.mockReset();
      m.newGameVsHuman.mockReset();
      m.newGameVsAI.mockReset();
      m.startTutorial.mockReset();
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
      resolveAIDifficulty: (d) => {
        resolveDiffCalls.push(d);
        return d ?? 'medium';
      },
    });
  });

  afterEach(() => {
    lastCleanup?.();
    lastCleanup = null;
    container.remove();
    vi.clearAllMocks();
  });

  it('throws when deps are null (kills L29 remove !)', async () => {
    initGameMountDeps(null as unknown as never);
    await expect(mountGameById('hex', nextRouteGeneration())).rejects.toThrow(
      /deps not initialized/i
    );
  });

  it('kings shell pins showTutorial/MoveHistory/Difficulty true + defaultMode', async () => {
    await mountGameById('kings-quadraphages', nextRouteGeneration());
    expect(lastOptions).toBeTruthy();
    expect(lastOptions!.showTutorial).toBe(true);
    expect(lastOptions!.showMoveHistory).toBe(true);
    expect(lastOptions!.showDifficulty).toBe(true);
    expect(lastOptions!.defaultMode).toBe('human-vs-ai');
    expect(mocks.kings.initGame).toHaveBeenCalledTimes(1);
  });

  it('kings onStartGame human-vs-ai resolves difficulty and passes true', async () => {
    await mountGameById('kings-quadraphages', nextRouteGeneration());
    lastOptions!.onStartGame('human-vs-ai', 'hard');
    expect(resolveDiffCalls).toContain('hard');
    expect(mocks.kings.newGameVsAI).toHaveBeenCalledWith('hard', true);
    expect(mocks.kings.newGameVsHuman).not.toHaveBeenCalled();

    lastOptions!.onStartGame('human-vs-human', 'easy');
    expect(mocks.kings.newGameVsHuman).toHaveBeenCalledTimes(1);
    expect(mocks.kings.newGameVsAI).toHaveBeenCalledTimes(1);
  });

  it('kings init passes historyContent and newGameBtn via || undefined arms', async () => {
    await mountGameById('kings-quadraphages', nextRouteGeneration());
    expect(mocks.kings.initGame).toHaveBeenCalledWith(
      shell.board,
      shell.status,
      shell.historyContent,
      shell.newGameBtn
    );
  });

  it('kings skips init when board or status missing (&& gate)', async () => {
    shell = makeShell({ board: null, status: null });
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
    await mountGameById('kings-quadraphages', nextRouteGeneration());
    expect(lastOptions).toBeTruthy();
    expect(mocks.kings.initGame).not.toHaveBeenCalled();
  });

  it('hex showTutorial true (kills L275 true→false)', async () => {
    await mountGameById('hex', nextRouteGeneration());
    expect(lastOptions!.showTutorial).toBe(true);
    expect(lastOptions!.showDifficulty).toBe(true);
    expect(mocks.hex.initGame).toHaveBeenCalled();
  });

  it('stale routeGen before shell mount skips options (kills L89/L160/L239 !)', async () => {
    const stale = nextRouteGeneration();
    nextRouteGeneration();
    await mountGameById('kings-quadraphages', stale);
    expect(lastOptions).toBeNull();
    expect(mocks.kings.initGame).not.toHaveBeenCalled();
  });
});
