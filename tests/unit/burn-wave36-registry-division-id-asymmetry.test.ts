/**
 * Wave 36 — getGamesByDivision / getDivisionInfo name vs id asymmetry.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  DIVISIONS,
  GAMES,
  getGamesByDivision,
  getDivisionInfo,
  getAvailableGames,
} from '../../src/core/game-registry';

describe('Wave 36 registry — division id/name asymmetry', () => {
  it('lookup by display name works; by id returns empty/undefined', () => {
    for (const d of DIVISIONS) {
      const byName = getGamesByDivision(d.name);
      expect(byName.length).toBe(5);
      expect(getGamesByDivision(d.id)).toEqual([]);
      expect(getDivisionInfo(d.name)?.id).toBe(d.id);
      expect(getDivisionInfo(d.id)).toBeUndefined();
    }
  });

  it('every game.division matches a DIVISIONS name', () => {
    const names = new Set(DIVISIONS.map((d) => d.name));
    for (const g of GAMES) {
      expect(names.has(g.division)).toBe(true);
    }
  });

  it('getAvailableGames length equals GAMES when all available', () => {
    expect(getAvailableGames().length).toBe(GAMES.filter((g) => g.available).length);
  });
});
