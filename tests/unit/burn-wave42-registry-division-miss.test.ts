/**
 * Wave 42 — registry division miss / unknown id leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  DIVISIONS,
  GAMES,
  getGameById,
  getGamesByDivision,
  getDivisionInfo,
  getAvailableGames,
} from '../../src/core/game-registry';

describe('Wave 42 registry — division miss', () => {
  it('unknown game id returns undefined', () => {
    expect(getGameById('___nope___')).toBeUndefined();
  });

  it('unknown division name returns empty games', () => {
    expect(getGamesByDivision('Not A Division')).toEqual([]);
  });

  it('unknown division info is undefined', () => {
    expect(getDivisionInfo('Not A Division')).toBeUndefined();
  });

  it('every available game is in GAMES and getAvailableGames', () => {
    const avail = getAvailableGames();
    expect(avail.every((g) => g.available)).toBe(true);
    for (const g of avail) {
      expect(getGameById(g.id)?.id).toBe(g.id);
    }
  });

  it('DIVISIONS length matches unique game.division values', () => {
    const names = new Set(GAMES.map((g) => g.division));
    expect(names.size).toBe(DIVISIONS.length);
  });

  it('lookup by division id (not name) misses', () => {
    for (const d of DIVISIONS) {
      expect(getGamesByDivision(d.id)).toEqual([]);
    }
  });
});
