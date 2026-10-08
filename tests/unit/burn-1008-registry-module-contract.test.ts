/**
 * burn-1008-mp-registry-contract
 *
 * Contract tests for the live game registry ↔ mounts ↔ prefetch ↔ menu ↔
 * per-game module shape. Distinct from:
 * - #482 engine edge-case suite
 * - #465 state round-trip fuzz
 * - #510 UI coverage (mocked mounts)
 * - #518 UI helper dedupe
 * - wave22/40 catalog smoke (filesystem / lookup only)
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DIVISIONS,
  GAMES,
  getAvailableGames,
  getGameById,
  type GameInfo,
} from '../../src/core/game-registry';
import { getPathParams } from '../../src/core/router';
import type { TutorialConfig } from '../../src/core/tutorial';
import { canPrefetchGame } from '../../src/ui/game-prefetch';
import { renderGameSelector } from '../../src/ui/game-selector';

const ROOT = process.cwd();
const GAMES_ROOT = join(ROOT, 'src', 'games');
const PUBLIC_ROOT = join(ROOT, 'public');

const CONTROLLER_EXPORTS = [
  'initGame',
  'destroyGame',
  'newGameVsHuman',
  'newGameVsAI',
  'startTutorial',
] as const;

/** Live mount/init families from game-route-mounts.ts call sites. */
type InitFamily = 'board-status' | 'container-vsai' | 'container-only';

const INIT_FAMILY: Record<string, InitFamily> = {
  calla: 'board-status',
  'contig-60': 'board-status',
  fiar: 'board-status',
  hex: 'board-status',
  'hex-a-gone': 'board-status',
  juggle: 'board-status',
  'kings-quadraphages': 'board-status',
  'pent-em-in': 'board-status',
  'queens-guards': 'board-status',
  'star-track': 'board-status',
  'fab-a-diffy': 'container-vsai',
  'kwatro-sinko': 'container-vsai',
  'par-55': 'container-vsai',
  'prime-gold': 'container-vsai',
  ramrod: 'container-vsai',
  'stars-bars': 'container-vsai',
  'sum-dominoes': 'container-vsai',
  'frac-fact': 'container-only',
  'fraction-pinball': 'container-only',
  'remainder-islands': 'container-only',
};

const EXPECTED_GAME_COUNT = 20;

function registryIds(): string[] {
  return GAMES.map((g) => g.id);
}

function readUtf8(relPath: string): string {
  return readFileSync(join(ROOT, relPath), 'utf8');
}

/** case 'id': arms inside mountGameById switch. */
function mountSwitchIds(): string[] {
  const src = readUtf8('src/ui/game-route-mounts.ts');
  const fnStart = src.indexOf('export async function mountGameById');
  expect(fnStart).toBeGreaterThanOrEqual(0);
  const switchSlice = src.slice(fnStart);
  const ids = [...switchSlice.matchAll(/case\s+'([^']+)':/g)].map((m) => m[1]!);
  return ids;
}

/** Keys of the prefetch loaders Record. */
function prefetchLoaderIds(): string[] {
  const src = readUtf8('src/ui/game-prefetch.ts');
  const start = src.indexOf('const loaders:');
  expect(start).toBeGreaterThanOrEqual(0);
  const brace = src.indexOf('{', start);
  const end = src.indexOf('};', brace);
  const body = src.slice(brace, end + 1);
  const ids = [...body.matchAll(/^\s*(?:'([^']+)'|([A-Za-z0-9_-]+))\s*:/gm)]
    .map((m) => m[1] ?? m[2]!)
    .filter((id) => id !== 'Record' && id !== 'string');
  return ids;
}

/** Asset paths under public/ referenced by index.html + vite PWA manifest. */
function metadataPublicAssets(): string[] {
  const indexHtml = readUtf8('index.html');
  const viteConfig = readUtf8('vite.config.ts');
  const fromIndex = [
    ...indexHtml.matchAll(
      /(?:href|src)=["'](\/(?:favicon[^"']*|icons\/[^"']*|fonts\/[^"']*))["']/g
    ),
  ].map((m) => m[1]!);

  const fromManifest = [
    ...viteConfig.matchAll(
      /src:\s*['"](\/(?:favicon[^'"]*|icons\/[^'"]*))['"]/g
    ),
  ].map((m) => m[1]!);

  const includeAssets = [
    ...viteConfig.matchAll(
      /['"](favicon[^'"]*|icons\/\*\.png|fonts\/[^'"]*|health\.txt|CNAME)['"]/g
    ),
  ].map((m) => m[1]!);

  const expandedIncludes: string[] = [];
  for (const entry of includeAssets) {
    if (entry.includes('*')) {
      const dir = join(PUBLIC_ROOT, 'icons');
      if (existsSync(dir)) {
        for (const name of readdirSync(dir)) {
          if (name.endsWith('.png')) expandedIncludes.push(`/icons/${name}`);
        }
      }
    } else {
      expandedIncludes.push(entry.startsWith('/') ? entry : `/${entry}`);
    }
  }

  return [...new Set([...fromIndex, ...fromManifest, ...expandedIncludes])];
}

function isTutorialConfig(value: unknown): value is TutorialConfig {
  if (!value || typeof value !== 'object') return false;
  const cfg = value as TutorialConfig;
  return (
    typeof cfg.id === 'string' &&
    typeof cfg.name === 'string' &&
    Array.isArray(cfg.steps) &&
    cfg.steps.length > 0
  );
}

/** Static import map so Vite/Vitest emit real chunks (no template dynamic import). */
const controllerLoaders: Record<string, () => Promise<Record<string, unknown>>> =
  {
    'kings-quadraphages': () =>
      import('../../src/games/kings-quadraphages/game-controller'),
    hex: () => import('../../src/games/hex/game-controller'),
    'star-track': () => import('../../src/games/star-track/game-controller'),
    'hex-a-gone': () => import('../../src/games/hex-a-gone/game-controller'),
    calla: () => import('../../src/games/calla/game-controller'),
    fiar: () => import('../../src/games/fiar/game-controller'),
    'queens-guards': () =>
      import('../../src/games/queens-guards/game-controller'),
    'contig-60': () => import('../../src/games/contig-60/game-controller'),
    juggle: () => import('../../src/games/juggle/game-controller'),
    'fab-a-diffy': () => import('../../src/games/fab-a-diffy/game-controller'),
    'sum-dominoes': () => import('../../src/games/sum-dominoes/game-controller'),
    'par-55': () => import('../../src/games/par-55/game-controller'),
    ramrod: () => import('../../src/games/ramrod/game-controller'),
    'kwatro-sinko': () => import('../../src/games/kwatro-sinko/game-controller'),
    'stars-bars': () => import('../../src/games/stars-bars/game-controller'),
    'prime-gold': () => import('../../src/games/prime-gold/game-controller'),
    'pent-em-in': () => import('../../src/games/pent-em-in/game-controller'),
    'frac-fact': () => import('../../src/games/frac-fact/game-controller'),
    'remainder-islands': () =>
      import('../../src/games/remainder-islands/game-controller'),
    'fraction-pinball': () =>
      import('../../src/games/fraction-pinball/game-controller'),
  };

const boardUiLoaders: Record<string, () => Promise<Record<string, unknown>>> = {
  'kings-quadraphages': () =>
    import('../../src/games/kings-quadraphages/board-ui'),
  hex: () => import('../../src/games/hex/board-ui'),
  'star-track': () => import('../../src/games/star-track/board-ui'),
  'hex-a-gone': () => import('../../src/games/hex-a-gone/board-ui'),
  calla: () => import('../../src/games/calla/board-ui'),
  fiar: () => import('../../src/games/fiar/board-ui'),
  'queens-guards': () => import('../../src/games/queens-guards/board-ui'),
  'contig-60': () => import('../../src/games/contig-60/board-ui'),
  juggle: () => import('../../src/games/juggle/board-ui'),
  'fab-a-diffy': () => import('../../src/games/fab-a-diffy/board-ui'),
  'sum-dominoes': () => import('../../src/games/sum-dominoes/board-ui'),
  'par-55': () => import('../../src/games/par-55/board-ui'),
  ramrod: () => import('../../src/games/ramrod/board-ui'),
  'kwatro-sinko': () => import('../../src/games/kwatro-sinko/board-ui'),
  'stars-bars': () => import('../../src/games/stars-bars/board-ui'),
  'prime-gold': () => import('../../src/games/prime-gold/board-ui'),
  'pent-em-in': () => import('../../src/games/pent-em-in/board-ui'),
  'frac-fact': () => import('../../src/games/frac-fact/board-ui'),
  'remainder-islands': () =>
    import('../../src/games/remainder-islands/board-ui'),
  'fraction-pinball': () =>
    import('../../src/games/fraction-pinball/board-ui'),
};

const rulesLoaders: Record<string, () => Promise<Record<string, unknown>>> = {
  'kings-quadraphages': () =>
    import('../../src/games/kings-quadraphages/rules'),
  hex: () => import('../../src/games/hex/rules'),
  'star-track': () => import('../../src/games/star-track/rules'),
  'hex-a-gone': () => import('../../src/games/hex-a-gone/rules'),
  calla: () => import('../../src/games/calla/rules'),
  fiar: () => import('../../src/games/fiar/rules'),
  'queens-guards': () => import('../../src/games/queens-guards/rules'),
  'contig-60': () => import('../../src/games/contig-60/rules'),
  juggle: () => import('../../src/games/juggle/rules'),
  'fab-a-diffy': () => import('../../src/games/fab-a-diffy/rules'),
  'sum-dominoes': () => import('../../src/games/sum-dominoes/rules'),
  'par-55': () => import('../../src/games/par-55/rules'),
  ramrod: () => import('../../src/games/ramrod/rules'),
  'kwatro-sinko': () => import('../../src/games/kwatro-sinko/rules'),
  'stars-bars': () => import('../../src/games/stars-bars/rules'),
  'prime-gold': () => import('../../src/games/prime-gold/rules'),
  'pent-em-in': () => import('../../src/games/pent-em-in/rules'),
  'frac-fact': () => import('../../src/games/frac-fact/rules'),
  'remainder-islands': () => import('../../src/games/remainder-islands/rules'),
  'fraction-pinball': () => import('../../src/games/fraction-pinball/rules'),
};

const tutorialLoaders: Record<string, () => Promise<Record<string, unknown>>> =
  {
    'kings-quadraphages': () =>
      import('../../src/games/kings-quadraphages/tutorial'),
    hex: () => import('../../src/games/hex/tutorial'),
    'star-track': () => import('../../src/games/star-track/tutorial'),
    'hex-a-gone': () => import('../../src/games/hex-a-gone/tutorial'),
    calla: () => import('../../src/games/calla/tutorial'),
    fiar: () => import('../../src/games/fiar/tutorial'),
    'queens-guards': () => import('../../src/games/queens-guards/tutorial'),
    'contig-60': () => import('../../src/games/contig-60/tutorial'),
    juggle: () => import('../../src/games/juggle/tutorial'),
    'fab-a-diffy': () => import('../../src/games/fab-a-diffy/tutorial'),
    'sum-dominoes': () => import('../../src/games/sum-dominoes/tutorial'),
    'par-55': () => import('../../src/games/par-55/tutorial'),
    ramrod: () => import('../../src/games/ramrod/tutorial'),
    'kwatro-sinko': () => import('../../src/games/kwatro-sinko/tutorial'),
    'stars-bars': () => import('../../src/games/stars-bars/tutorial'),
    'prime-gold': () => import('../../src/games/prime-gold/tutorial'),
    'pent-em-in': () => import('../../src/games/pent-em-in/tutorial'),
    'frac-fact': () => import('../../src/games/frac-fact/tutorial'),
    'remainder-islands': () =>
      import('../../src/games/remainder-islands/tutorial'),
    'fraction-pinball': () =>
      import('../../src/games/fraction-pinball/tutorial'),
  };

async function importController(
  gameId: string
): Promise<Record<string, unknown>> {
  const load = controllerLoaders[gameId];
  expect(load, `controller loader for ${gameId}`).toBeTypeOf('function');
  return load!();
}

async function importBoardUi(gameId: string): Promise<Record<string, unknown>> {
  const load = boardUiLoaders[gameId];
  expect(load, `board-ui loader for ${gameId}`).toBeTypeOf('function');
  return load!();
}

async function importRules(gameId: string): Promise<Record<string, unknown>> {
  const load = rulesLoaders[gameId];
  expect(load, `rules loader for ${gameId}`).toBeTypeOf('function');
  return load!();
}

async function importTutorial(
  gameId: string
): Promise<Record<string, unknown>> {
  const load = tutorialLoaders[gameId];
  expect(load, `tutorial loader for ${gameId}`).toBeTypeOf('function');
  return load!();
}

function callInit(mod: Record<string, unknown>, gameId: string): void {
  const initGame = mod.initGame as (...args: unknown[]) => void;
  const family = INIT_FAMILY[gameId];
  expect(family, `missing INIT_FAMILY for ${gameId}`).toBeTruthy();

  if (family === 'board-status') {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    return;
  }

  const host = document.createElement('div');
  document.body.appendChild(host);
  if (family === 'container-vsai') {
    initGame(host, false);
  } else {
    initGame(host);
  }
}

describe('burn-1008 registry module contract — catalog identity', () => {
  it(`registers exactly ${EXPECTED_GAME_COUNT} games with unique stable ids`, () => {
    expect(GAMES).toHaveLength(EXPECTED_GAME_COUNT);
    const ids = registryIds();
    expect(new Set(ids).size).toBe(EXPECTED_GAME_COUNT);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(getGameById(id)?.id).toBe(id);
    }
  });

  it('exposes a stable /game/:id route for every registry id', () => {
    for (const game of GAMES) {
      const path = `/game/${game.id}`;
      const params = getPathParams('/game/:id', path);
      expect(params.id).toBe(game.id);
      expect(`#${path}`).toBe(`#/game/${game.id}`);
    }
  });

  it('keeps required GameInfo metadata (players, difficulty/mode signal, icon)', () => {
    const difficulties = new Set(['beginner', 'intermediate', 'advanced']);
    for (const game of GAMES) {
      expect(game.name.length).toBeGreaterThan(0);
      expect(game.playerCount.length).toBeGreaterThan(0);
      expect(game.playerCount).toMatch(/Player/);
      expect(difficulties.has(game.difficulty)).toBe(true);
      expect(game.icon.length).toBeGreaterThan(0);
      // Live convention: emoji / glyph icons, not public/ paths.
      expect(game.icon.includes('/')).toBe(false);
      expect(game.icon.startsWith('http')).toBe(false);
      expect(game.available).toBe(true);
      expect(game.division.length).toBeGreaterThan(0);
      expect(game.gradeRange).toMatch(/Grades /);
    }
    expect(getAvailableGames()).toHaveLength(EXPECTED_GAME_COUNT);
  });
});

describe('burn-1008 registry module contract — three-way id handshake', () => {
  it('registry ids === mountGameById cases === prefetch loaders', () => {
    const registry = [...registryIds()].sort();
    const mounts = [...mountSwitchIds()].sort();
    const prefetch = [...prefetchLoaderIds()].sort();

    expect(mounts).toEqual(registry);
    expect(prefetch).toEqual(registry);

    for (const id of registry) {
      expect(canPrefetchGame(id)).toBe(true);
    }
    expect(canPrefetchGame('not-a-game')).toBe(false);

    // Test import maps stay aligned with the live catalog too.
    expect(Object.keys(controllerLoaders).sort()).toEqual(registry);
    expect(Object.keys(boardUiLoaders).sort()).toEqual(registry);
    expect(Object.keys(rulesLoaders).sort()).toEqual(registry);
    expect(Object.keys(tutorialLoaders).sort()).toEqual(registry);
    expect(Object.keys(INIT_FAMILY).sort()).toEqual(registry);
  });
});

describe('burn-1008 registry module contract — filesystem module layout', () => {
  it('every registry id has controller, board-ui, rules, tutorial modules', () => {
    for (const game of GAMES) {
      const dir = join(GAMES_ROOT, game.id);
      expect(existsSync(dir), `missing folder ${game.id}`).toBe(true);
      for (const file of [
        'game-controller.ts',
        'board-ui.ts',
        'rules.ts',
        'tutorial.ts',
      ]) {
        expect(existsSync(join(dir, file)), `${game.id}/${file}`).toBe(true);
      }
    }
  });

  it('on-disk game folders bijection with registry (no orphans)', () => {
    const folders = readdirSync(GAMES_ROOT, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
    expect(folders).toEqual([...registryIds()].sort());
  });
});

describe('burn-1008 registry module contract — dynamic import + required exports', () => {
  it.each(registryIds())(
    '%s controller loads with shell-required exports',
    async (gameId) => {
      const mod = await importController(gameId);
      for (const name of CONTROLLER_EXPORTS) {
        expect(typeof mod[name], `${gameId}.${name}`).toBe('function');
      }
    }
  );

  it.each(registryIds())(
    '%s board-ui loads with at least one render/inject export',
    async (gameId) => {
      const mod = await importBoardUi(gameId);
      const uiFns = Object.entries(mod).filter(
        ([name, value]) =>
          typeof value === 'function' &&
          (/^render/i.test(name) || /^inject/i.test(name) || name === 'handleCellClick')
      );
      expect(uiFns.length, `${gameId} board-ui render surface`).toBeGreaterThan(
        0
      );
    }
  );

  it.each(registryIds())(
    '%s rules engine module loads with function exports',
    async (gameId) => {
      const mod = await importRules(gameId);
      const fns = Object.values(mod).filter((v) => typeof v === 'function');
      expect(fns.length, `${gameId} rules functions`).toBeGreaterThan(0);
    }
  );

  it.each(registryIds())(
    '%s tutorial entry exports TutorialConfig with id/name/steps',
    async (gameId) => {
      const mod = await importTutorial(gameId);
      const tutorials = Object.entries(mod).filter(([, value]) =>
        isTutorialConfig(value)
      );
      expect(tutorials.length, `${gameId} tutorial export`).toBe(1);
      const [, cfg] = tutorials[0]!;
      expect(cfg!.id).toBe(`${gameId}-basics`);
      expect(cfg!.name.length).toBeGreaterThan(0);
      expect(cfg!.steps.length).toBeGreaterThanOrEqual(1);
      for (const step of cfg!.steps) {
        expect(step.id.length).toBeGreaterThan(0);
        expect(step.title.length).toBeGreaterThan(0);
        expect(step.message.length).toBeGreaterThan(0);
      }
    }
  );
});

describe('burn-1008 registry module contract — menu tiles ↔ registry', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    Element.prototype.scrollIntoView = vi.fn();
    window.location.hash = '';
  });

  afterEach(() => {
    container.remove();
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('every menu tile maps to a registry entry and vice versa', () => {
    renderGameSelector(container);

    const cards = [
      ...container.querySelectorAll<HTMLElement>('.game-card'),
    ];
    expect(cards).toHaveLength(EXPECTED_GAME_COUNT);

    const tileNames = cards
      .map((card) => card.querySelector('.game-card-title')?.textContent ?? '')
      .sort();
    const registryNames = GAMES.map((g) => g.name).sort();
    expect(tileNames).toEqual(registryNames);

    for (const game of GAMES) {
      const card = cards.find(
        (c) => c.querySelector('.game-card-title')?.textContent === game.name
      );
      expect(card, `tile for ${game.id}`).toBeTruthy();
      expect(card!.getAttribute('aria-label')).toContain(game.name);
      expect(card!.querySelector('.game-card-icon')?.textContent).toBe(
        game.icon
      );
      expect(card!.querySelector('.game-card-players')?.textContent).toBe(
        game.playerCount
      );
      const diff = card!.querySelector('.game-card-difficulty')?.textContent;
      expect(diff?.toLowerCase()).toBe(game.difficulty);
    }

    const divisionAttrs = [
      ...container.querySelectorAll('.division-accordion'),
    ].map((el) => el.getAttribute('data-division'));
    expect(divisionAttrs.sort()).toEqual(
      DIVISIONS.map((d) => d.name).sort()
    );
  });

  it('clicking each available tile navigates to #/game/<id>', () => {
    renderGameSelector(container);

    for (const game of GAMES) {
      window.location.hash = '';
      const card = [
        ...container.querySelectorAll<HTMLElement>('.game-card'),
      ].find(
        (c) => c.querySelector('.game-card-title')?.textContent === game.name
      );
      expect(card).toBeTruthy();
      card!.click();
      expect(window.location.hash).toBe(`#/game/${game.id}`);
    }
  });
});

describe('burn-1008 registry module contract — destroyGame idempotency', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it.each(registryIds())(
    '%s destroyGame is safe when never mounted (double call)',
    async (gameId) => {
      const mod = await importController(gameId);
      const destroyGame = mod.destroyGame as () => void;
      expect(() => {
        destroyGame();
        destroyGame();
      }).not.toThrow();
    }
  );

  it.each(registryIds())(
    '%s destroyGame after init is idempotent',
    async (gameId) => {
      vi.useFakeTimers();
      const mod = await importController(gameId);
      const destroyGame = mod.destroyGame as () => void;

      callInit(mod, gameId);
      expect(() => {
        destroyGame();
        destroyGame();
      }).not.toThrow();
      expect(() => vi.runOnlyPendingTimers()).not.toThrow();
    }
  );
});

describe('burn-1008 registry module contract — public assets for metadata', () => {
  it('every asset path referenced by index.html / PWA manifest exists under public/', () => {
    const assets = metadataPublicAssets();
    expect(assets.length).toBeGreaterThan(0);

    for (const assetPath of assets) {
      const onDisk = join(PUBLIC_ROOT, assetPath.replace(/^\//, ''));
      expect(existsSync(onDisk), `missing public asset ${assetPath}`).toBe(
        true
      );
    }

    // Registry icons are glyphs; no per-game public/games/<id> requirement.
    for (const game of GAMES) {
      expect((game as GameInfo).icon.includes('public/')).toBe(false);
    }
  });
});
