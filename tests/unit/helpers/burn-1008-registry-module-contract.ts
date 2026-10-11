/**
 * Shared fixtures for burn-1008 registry module contract shards (q-mp-1188).
 * Static Vite import maps + init helpers stay identical across parallel files.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect } from 'vitest';

import { GAMES } from '../../../src/core/game-registry';
import type { TutorialConfig } from '../../../src/core/tutorial';
import { mountPair } from '../../helpers/mount-pair';

export const ROOT = process.cwd();
export const GAMES_ROOT = join(ROOT, 'src', 'games');
export const PUBLIC_ROOT = join(ROOT, 'public');

export const CONTROLLER_EXPORTS = [
  'initGame',
  'destroyGame',
  'newGameVsHuman',
  'newGameVsAI',
  'startTutorial',
] as const;

/** Live mount/init families from game-route-mounts.ts call sites. */
export type InitFamily = 'board-status' | 'container-vsai' | 'container-only';

export const INIT_FAMILY: Record<string, InitFamily> = {
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

export const EXPECTED_GAME_COUNT = 20;

export function registryIds(): string[] {
  return GAMES.map((g) => g.id);
}

export function readUtf8(relPath: string): string {
  return readFileSync(join(ROOT, relPath), 'utf8');
}

/** case 'id': arms inside mountGameById switch. */
export function mountSwitchIds(): string[] {
  const src = readUtf8('src/ui/game-route-mounts.ts');
  const fnStart = src.indexOf('export async function mountGameById');
  expect(fnStart).toBeGreaterThanOrEqual(0);
  const switchSlice = src.slice(fnStart);
  const ids = [...switchSlice.matchAll(/case\s+'([^']+)':/g)].map((m) => m[1]!);
  return ids;
}

/** Keys of the prefetch loaders Record. */
export function prefetchLoaderIds(): string[] {
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
export function metadataPublicAssets(): string[] {
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

export function isTutorialConfig(value: unknown): value is TutorialConfig {
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
export const controllerLoaders: Record<
  string,
  () => Promise<Record<string, unknown>>
> = {
  'kings-quadraphages': () =>
    import('../../../src/games/kings-quadraphages/game-controller'),
  hex: () => import('../../../src/games/hex/game-controller'),
  'star-track': () => import('../../../src/games/star-track/game-controller'),
  'hex-a-gone': () => import('../../../src/games/hex-a-gone/game-controller'),
  calla: () => import('../../../src/games/calla/game-controller'),
  fiar: () => import('../../../src/games/fiar/game-controller'),
  'queens-guards': () =>
    import('../../../src/games/queens-guards/game-controller'),
  'contig-60': () => import('../../../src/games/contig-60/game-controller'),
  juggle: () => import('../../../src/games/juggle/game-controller'),
  'fab-a-diffy': () => import('../../../src/games/fab-a-diffy/game-controller'),
  'sum-dominoes': () =>
    import('../../../src/games/sum-dominoes/game-controller'),
  'par-55': () => import('../../../src/games/par-55/game-controller'),
  ramrod: () => import('../../../src/games/ramrod/game-controller'),
  'kwatro-sinko': () =>
    import('../../../src/games/kwatro-sinko/game-controller'),
  'stars-bars': () => import('../../../src/games/stars-bars/game-controller'),
  'prime-gold': () => import('../../../src/games/prime-gold/game-controller'),
  'pent-em-in': () => import('../../../src/games/pent-em-in/game-controller'),
  'frac-fact': () => import('../../../src/games/frac-fact/game-controller'),
  'remainder-islands': () =>
    import('../../../src/games/remainder-islands/game-controller'),
  'fraction-pinball': () =>
    import('../../../src/games/fraction-pinball/game-controller'),
};

export const boardUiLoaders: Record<
  string,
  () => Promise<Record<string, unknown>>
> = {
  'kings-quadraphages': () =>
    import('../../../src/games/kings-quadraphages/board-ui'),
  hex: () => import('../../../src/games/hex/board-ui'),
  'star-track': () => import('../../../src/games/star-track/board-ui'),
  'hex-a-gone': () => import('../../../src/games/hex-a-gone/board-ui'),
  calla: () => import('../../../src/games/calla/board-ui'),
  fiar: () => import('../../../src/games/fiar/board-ui'),
  'queens-guards': () => import('../../../src/games/queens-guards/board-ui'),
  'contig-60': () => import('../../../src/games/contig-60/board-ui'),
  juggle: () => import('../../../src/games/juggle/board-ui'),
  'fab-a-diffy': () => import('../../../src/games/fab-a-diffy/board-ui'),
  'sum-dominoes': () => import('../../../src/games/sum-dominoes/board-ui'),
  'par-55': () => import('../../../src/games/par-55/board-ui'),
  ramrod: () => import('../../../src/games/ramrod/board-ui'),
  'kwatro-sinko': () => import('../../../src/games/kwatro-sinko/board-ui'),
  'stars-bars': () => import('../../../src/games/stars-bars/board-ui'),
  'prime-gold': () => import('../../../src/games/prime-gold/board-ui'),
  'pent-em-in': () => import('../../../src/games/pent-em-in/board-ui'),
  'frac-fact': () => import('../../../src/games/frac-fact/board-ui'),
  'remainder-islands': () =>
    import('../../../src/games/remainder-islands/board-ui'),
  'fraction-pinball': () =>
    import('../../../src/games/fraction-pinball/board-ui'),
};

export const rulesLoaders: Record<
  string,
  () => Promise<Record<string, unknown>>
> = {
  'kings-quadraphages': () =>
    import('../../../src/games/kings-quadraphages/rules'),
  hex: () => import('../../../src/games/hex/rules'),
  'star-track': () => import('../../../src/games/star-track/rules'),
  'hex-a-gone': () => import('../../../src/games/hex-a-gone/rules'),
  calla: () => import('../../../src/games/calla/rules'),
  fiar: () => import('../../../src/games/fiar/rules'),
  'queens-guards': () => import('../../../src/games/queens-guards/rules'),
  'contig-60': () => import('../../../src/games/contig-60/rules'),
  juggle: () => import('../../../src/games/juggle/rules'),
  'fab-a-diffy': () => import('../../../src/games/fab-a-diffy/rules'),
  'sum-dominoes': () => import('../../../src/games/sum-dominoes/rules'),
  'par-55': () => import('../../../src/games/par-55/rules'),
  ramrod: () => import('../../../src/games/ramrod/rules'),
  'kwatro-sinko': () => import('../../../src/games/kwatro-sinko/rules'),
  'stars-bars': () => import('../../../src/games/stars-bars/rules'),
  'prime-gold': () => import('../../../src/games/prime-gold/rules'),
  'pent-em-in': () => import('../../../src/games/pent-em-in/rules'),
  'frac-fact': () => import('../../../src/games/frac-fact/rules'),
  'remainder-islands': () =>
    import('../../../src/games/remainder-islands/rules'),
  'fraction-pinball': () => import('../../../src/games/fraction-pinball/rules'),
};

export const tutorialLoaders: Record<
  string,
  () => Promise<Record<string, unknown>>
> = {
  'kings-quadraphages': () =>
    import('../../../src/games/kings-quadraphages/tutorial'),
  hex: () => import('../../../src/games/hex/tutorial'),
  'star-track': () => import('../../../src/games/star-track/tutorial'),
  'hex-a-gone': () => import('../../../src/games/hex-a-gone/tutorial'),
  calla: () => import('../../../src/games/calla/tutorial'),
  fiar: () => import('../../../src/games/fiar/tutorial'),
  'queens-guards': () => import('../../../src/games/queens-guards/tutorial'),
  'contig-60': () => import('../../../src/games/contig-60/tutorial'),
  juggle: () => import('../../../src/games/juggle/tutorial'),
  'fab-a-diffy': () => import('../../../src/games/fab-a-diffy/tutorial'),
  'sum-dominoes': () => import('../../../src/games/sum-dominoes/tutorial'),
  'par-55': () => import('../../../src/games/par-55/tutorial'),
  ramrod: () => import('../../../src/games/ramrod/tutorial'),
  'kwatro-sinko': () => import('../../../src/games/kwatro-sinko/tutorial'),
  'stars-bars': () => import('../../../src/games/stars-bars/tutorial'),
  'prime-gold': () => import('../../../src/games/prime-gold/tutorial'),
  'pent-em-in': () => import('../../../src/games/pent-em-in/tutorial'),
  'frac-fact': () => import('../../../src/games/frac-fact/tutorial'),
  'remainder-islands': () =>
    import('../../../src/games/remainder-islands/tutorial'),
  'fraction-pinball': () =>
    import('../../../src/games/fraction-pinball/tutorial'),
};

export async function importController(
  gameId: string
): Promise<Record<string, unknown>> {
  const load = controllerLoaders[gameId];
  expect(load, `controller loader for ${gameId}`).toBeTypeOf('function');
  return load!();
}

export async function importBoardUi(
  gameId: string
): Promise<Record<string, unknown>> {
  const load = boardUiLoaders[gameId];
  expect(load, `board-ui loader for ${gameId}`).toBeTypeOf('function');
  return load!();
}

export async function importRules(
  gameId: string
): Promise<Record<string, unknown>> {
  const load = rulesLoaders[gameId];
  expect(load, `rules loader for ${gameId}`).toBeTypeOf('function');
  return load!();
}

export async function importTutorial(
  gameId: string
): Promise<Record<string, unknown>> {
  const load = tutorialLoaders[gameId];
  expect(load, `tutorial loader for ${gameId}`).toBeTypeOf('function');
  return load!();
}

export function callInit(mod: Record<string, unknown>, gameId: string): void {
  const initGame = mod.initGame as (...args: unknown[]) => void;
  const family = INIT_FAMILY[gameId];
  expect(family, `missing INIT_FAMILY for ${gameId}`).toBeTruthy();

  if (family === 'board-status') {
    const { board, status } = mountPair();
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
