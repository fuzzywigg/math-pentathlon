/**
 * Wave 40 — registry catalog invariants (4×5, unique ids, available, difficulty, case).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  DIVISIONS,
  GAMES,
  getGameById,
  getAvailableGames,
  getGamesByDivision,
  getDivisionInfo,
} from '../../src/core/game-registry';

describe('Wave 40 registry — catalog invariants', () => {
  it('catalog is 4 divisions × 5 games = 20', () => {
    expect(DIVISIONS).toHaveLength(4);
    expect(GAMES).toHaveLength(20);
    for (const div of DIVISIONS) {
      expect(getGamesByDivision(div.name)).toHaveLength(5);
    }
  });

  it('game ids are unique and every entry is available', () => {
    const ids = GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(20);
    expect(GAMES.every((g) => g.available)).toBe(true);
    expect(getAvailableGames()).toHaveLength(20);
  });

  it('difficulty enums stay within beginner|intermediate|advanced', () => {
    const allowed = new Set(['beginner', 'intermediate', 'advanced']);
    for (const game of GAMES) {
      expect(allowed.has(game.difficulty)).toBe(true);
    }
  });

  it('getGameById is case-sensitive; uppercase miss returns undefined', () => {
    const sample = GAMES[0];
    expect(getGameById(sample.id)).toEqual(sample);
    expect(getGameById(sample.id.toUpperCase())).toBeUndefined();
    expect(getGameById(sample.id.toLowerCase() === sample.id ? 'HEX' : 'Hex')).toBeUndefined();
  });

  it('division name lookups are exact; lowercase miss fails', () => {
    expect(getDivisionInfo('Division I')?.id).toBe('division-1');
    expect(getDivisionInfo('division i')).toBeUndefined();
    expect(getGamesByDivision('division i')).toEqual([]);
    expect(getGamesByDivision('Division I').map((g) => g.id)).toEqual(
      expect.arrayContaining(['hex', 'calla'])
    );
  });
});
