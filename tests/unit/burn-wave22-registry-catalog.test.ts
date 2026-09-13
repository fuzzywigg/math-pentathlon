/**
 * Wave 22 — registry catalog ↔ on-disk games / tutorial modules / partitions.
 * Distinct from game-registry.test.ts smoke and wave 20 controller matrices.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
  DIVISIONS,
  GAMES,
  getGameById,
  getAvailableGames,
  getGamesByDivision,
  getDivisionInfo,
} from '../../src/core/game-registry';

const ROOT = join(process.cwd(), 'src', 'games');

describe('Wave 22 registry-catalog — GAMES ↔ filesystem', () => {
  it('every registry id has a game folder with controller + tutorial', () => {
    expect(GAMES.length).toBe(20);
    for (const game of GAMES) {
      const dir = join(ROOT, game.id);
      expect(existsSync(dir), `missing folder for ${game.id}`).toBe(true);
      expect(existsSync(join(dir, 'game-controller.ts')), game.id).toBe(true);
      expect(existsSync(join(dir, 'tutorial.ts')), game.id).toBe(true);
    }
  });

  it('every on-disk game folder is registered exactly once', () => {
    const folders = readdirSync(ROOT, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
    const ids = GAMES.map((g) => g.id).sort();
    expect(ids).toEqual(folders);
  });
});

describe('Wave 22 registry-catalog — lookup + availability', () => {
  it('getGameById hits every id and misses junk', () => {
    for (const game of GAMES) {
      const found = getGameById(game.id);
      expect(found).toBeDefined();
      expect(found!.name).toBe(game.name);
      expect(found!.available).toBe(true);
    }
    expect(getGameById('')).toBeUndefined();
    expect(getGameById('hex-typo')).toBeUndefined();
  });

  it('getAvailableGames equals full catalog while all available', () => {
    const available = getAvailableGames();
    expect(available).toHaveLength(GAMES.length);
    expect(available.every((g) => g.available)).toBe(true);
    expect(new Set(available.map((g) => g.id)).size).toBe(GAMES.length);
  });
});

describe('Wave 22 registry-catalog — division partitions', () => {
  it('DIVISIONS partition GAMES without overlap or orphans', () => {
    expect(DIVISIONS).toHaveLength(4);
    const byDiv = DIVISIONS.map((d) => ({
      name: d.name,
      games: getGamesByDivision(d.name),
    }));

    const seen = new Set<string>();
    let total = 0;
    for (const bucket of byDiv) {
      expect(bucket.games.length).toBeGreaterThan(0);
      for (const g of bucket.games) {
        expect(g.division).toBe(bucket.name);
        expect(seen.has(g.id)).toBe(false);
        seen.add(g.id);
        total++;
      }
      expect(getDivisionInfo(bucket.name)?.name).toBe(bucket.name);
    }
    expect(total).toBe(GAMES.length);
    expect(seen.size).toBe(GAMES.length);
    expect(getGamesByDivision('Division IX')).toEqual([]);
    expect(getDivisionInfo('Division IX')).toBeUndefined();
  });

  it('difficulty / playerCount / gradeRange stay within known unions', () => {
    const difficulties = new Set(['beginner', 'intermediate', 'advanced']);
    for (const game of GAMES) {
      expect(difficulties.has(game.difficulty)).toBe(true);
      expect(game.playerCount.length).toBeGreaterThan(0);
      expect(game.gradeRange).toMatch(/Grades /);
      expect(game.description.length).toBeGreaterThan(10);
      expect(game.icon.length).toBeGreaterThan(0);
    }
  });
});

describe('Wave 22 registry-catalog — stable known anchors', () => {
  it('Division I includes kings/hex/calla; Division IV includes frac/pinball', () => {
    const d1 = getGamesByDivision('Division I').map((g) => g.id);
    expect(d1).toEqual(
      expect.arrayContaining([
        'kings-quadraphages',
        'hex',
        'star-track',
        'hex-a-gone',
        'calla',
      ])
    );
    const d4 = getGamesByDivision('Division IV').map((g) => g.id);
    expect(d4).toEqual(
      expect.arrayContaining([
        'frac-fact',
        'fraction-pinball',
        'prime-gold',
        'pent-em-in',
        'remainder-islands',
      ])
    );
  });
});
