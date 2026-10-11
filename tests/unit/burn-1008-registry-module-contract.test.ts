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
 *
 * q-mp-1188: catalog / menu / assets shard. Per-game import + destroyGame
 * asserts live in sibling games-a/b/c/d/e files for parallel wall trim.
 */
import { existsSync, readdirSync } from 'node:fs';
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
import { canPrefetchGame } from '../../src/ui/game-prefetch';
import { renderGameSelector } from '../../src/ui/game-selector';
import {
  EXPECTED_GAME_COUNT,
  GAMES_ROOT,
  INIT_FAMILY,
  PUBLIC_ROOT,
  boardUiLoaders,
  controllerLoaders,
  metadataPublicAssets,
  mountSwitchIds,
  prefetchLoaderIds,
  registryIds,
  rulesLoaders,
  tutorialLoaders,
} from './burn-1008-registry-module-contract.shared';

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

    const cards = [...container.querySelectorAll<HTMLElement>('.game-card')];
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
    expect(divisionAttrs.sort()).toEqual(DIVISIONS.map((d) => d.name).sort());
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
