/**
 * Game Registry Unit Tests
 * Covers src/core/game-registry.ts (#9 infrastructure gap)
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

describe('game registry', () => {
  it('defines four divisions with unique ids', () => {
    expect(DIVISIONS).toHaveLength(4);
    const ids = DIVISIONS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('registers games with unique ids and known divisions', () => {
    const ids = GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    const divisionNames = new Set(DIVISIONS.map((d) => d.name));
    for (const game of GAMES) {
      expect(divisionNames.has(game.division)).toBe(true);
      expect(game.name.length).toBeGreaterThan(0);
    }
  });

  it('looks up games by id', () => {
    expect(getGameById('kings-quadraphages')?.name).toBe('Kings & Quadraphages');
    expect(getGameById('does-not-exist')).toBeUndefined();
  });

  it('filters available games', () => {
    const available = getAvailableGames();
    expect(available.length).toBeGreaterThan(0);
    expect(available.every((g) => g.available)).toBe(true);
    expect(available.length).toBe(GAMES.filter((g) => g.available).length);
  });

  it('filters games by division name', () => {
    const div1 = getGamesByDivision('Division I');
    expect(div1.length).toBeGreaterThan(0);
    expect(div1.every((g) => g.division === 'Division I')).toBe(true);
    expect(getGamesByDivision('Division IX')).toEqual([]);
  });

  it('looks up division info by name', () => {
    expect(getDivisionInfo('Division II')?.gradeRange).toBe('Grades 2-3');
    expect(getDivisionInfo('Unknown')).toBeUndefined();
  });
});
