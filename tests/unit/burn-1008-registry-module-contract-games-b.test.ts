/**
 * burn-1008 registry module contract — games shard b (q-mp-1188).
 * Registry ids.slice(4, 8): dynamic-import + destroyGame asserts
 * (coverage-identical). Siblings: games-a/games-c/games-d/games-e. Catalog/menu/assets stay in
 * burn-1008-registry-module-contract.test.ts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CONTROLLER_EXPORTS,
  callInit,
  importBoardUi,
  importController,
  importRules,
  importTutorial,
  isTutorialConfig,
  registryIds,
} from './burn-1008-registry-module-contract.shared';

const GAME_IDS = registryIds().slice(4, 8);

describe('burn-1008 registry module contract — dynamic import + required exports', () => {
  it.each(GAME_IDS)(
    '%s controller loads with shell-required exports',
    async (gameId) => {
      const mod = await importController(gameId);
      for (const name of CONTROLLER_EXPORTS) {
        expect(typeof mod[name], `${gameId}.${name}`).toBe('function');
      }
    }
  );

  it.each(GAME_IDS)(
    '%s board-ui loads with at least one render/inject export',
    async (gameId) => {
      const mod = await importBoardUi(gameId);
      const uiFns = Object.entries(mod).filter(
        ([name, value]) =>
          typeof value === 'function' &&
          (/^render/i.test(name) ||
            /^inject/i.test(name) ||
            name === 'handleCellClick')
      );
      expect(uiFns.length, `${gameId} board-ui render surface`).toBeGreaterThan(
        0
      );
    }
  );

  it.each(GAME_IDS)(
    '%s rules engine module loads with function exports',
    async (gameId) => {
      const mod = await importRules(gameId);
      const fns = Object.values(mod).filter((v) => typeof v === 'function');
      expect(fns.length, `${gameId} rules functions`).toBeGreaterThan(0);
    }
  );

  it.each(GAME_IDS)(
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

describe('burn-1008 registry module contract — destroyGame idempotency', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it.each(GAME_IDS)(
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

  it.each(GAME_IDS)(
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
