/**
 * Wave 39 — game-registry available/division matrix leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  GAMES,
  DIVISIONS,
  getGameById,
  getAvailableGames,
  getGamesByDivision,
  getDivisionInfo,
} from '../../src/core/game-registry';

describe('Wave 39 registry — available division matrix', () => {
  it('every GAMES id round-trips getGameById', () => {
    for (const g of GAMES) {
      expect(getGameById(g.id)?.id).toBe(g.id);
      expect(getGameById(g.id)?.name).toBe(g.name);
    }
    expect(getGameById('__missing__')).toBeUndefined();
  });

  it('getAvailableGames only available', () => {
    const avail = getAvailableGames();
    expect(avail.every((g) => g.available)).toBe(true);
    expect(avail.length).toBe(GAMES.filter((g) => g.available).length);
  });

  it('divisions resolve info by name and games by id', () => {
    expect(DIVISIONS.length).toBeGreaterThan(0);
    for (const d of DIVISIONS) {
      const info = getDivisionInfo(d.name);
      expect(info?.id).toBe(d.id);
      const games = getGamesByDivision(d.id);
      expect(Array.isArray(games)).toBe(true);
    }
  });

  it('thin engines under test are registered available', () => {
    for (const id of [
      'star-track',
      'frac-fact',
      'fraction-pinball',
      'contig-60',
      'sum-dominoes',
    ]) {
      expect(getGameById(id)?.available).toBe(true);
    }
  });
});
