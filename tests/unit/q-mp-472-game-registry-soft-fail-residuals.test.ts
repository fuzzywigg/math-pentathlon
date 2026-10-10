/**
 * q-mp-472 — Characterize `game-registry` soft-fail residuals (tests-only).
 *
 * Structural / soft-miss asserts only. No player-facing copy-body pins. No
 * `src/` product edits. No AI / rules / scoring / timing paths. Hex Hard
 * 450ms untouched. Keep mutation `478` hosts disjoint (owl/graph/register).
 *
 * Live tip re-measure (`cursor/mp-tip-post914` @ `753052a6`):
 * - `src/core/game-registry.ts` **323** LOC (matches backlog)
 * - Dedicated `*game-registry*` suite: **1** file / **6** `it`
 * - Related catalog suites (wave22/36/40) already cover happy-path lookups,
 *   4×5 partition, id/name asymmetry, and case-sensitive misses
 * - Combined coverage before this file: stmts/lines **100%** (10/10, 6/6);
 *   v8 reports **0** branches — residual work is soft-miss / filter edges
 *   not yet characterized (whitespace, unavailable filter, return isolation)
 *
 * Narrowed vs open drafts:
 * - `#927`/`453` prefetch, `#932`/`454` selector, `#925`/`455` storage —
 *   leave open (`contained`); this suite owns `game-registry.ts` only
 * - Unfolded `#935`/`456` engine r15 into post898 — leave open (`contained`);
 *   host excluded
 * - Mutation `478` keeps owl/graph/register — this file does not touch them
 *
 * Listed in `vitest.config.ts` `isolatedFiles` so temporary `available`
 * flips cannot leak into unit-shared under `isolate: false`.
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  DIVISIONS,
  GAMES,
  getAvailableGames,
  getDivisionInfo,
  getGameById,
  getGamesByDivision,
  type GameInfo,
} from '../../src/core/game-registry';

const ID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIVISION_ID = /^division-[1-4]$/;
const DIFFICULTIES = new Set(['beginner', 'intermediate', 'advanced']);

afterEach(() => {
  // Belt-and-suspenders: restore any temporary availability flips.
  for (const game of GAMES) {
    game.available = true;
  }
});

describe('q-mp-472 game-registry — soft-miss lookups', () => {
  it('getGameById soft-misses on whitespace, padding, and near-miss ids', () => {
    const sample = GAMES[0]!;
    expect(getGameById(sample.id)).toBe(sample);

    expect(getGameById(` ${sample.id}`)).toBeUndefined();
    expect(getGameById(`${sample.id} `)).toBeUndefined();
    expect(getGameById(`\t${sample.id}`)).toBeUndefined();
    expect(getGameById(`${sample.id}\n`)).toBeUndefined();
    expect(getGameById(`${sample.id}-`)).toBeUndefined();
    expect(getGameById(`-${sample.id}`)).toBeUndefined();
    expect(getGameById(sample.id.replace('-', '_'))).toBeUndefined();
    expect(getGameById('does-not-exist')).toBeUndefined();
  });

  it('division lookups soft-miss on whitespace, padding, and id tokens', () => {
    for (const division of DIVISIONS) {
      expect(getDivisionInfo(division.name)?.id).toBe(division.id);
      expect(getGamesByDivision(division.name)).toHaveLength(5);

      expect(getDivisionInfo(` ${division.name}`)).toBeUndefined();
      expect(getDivisionInfo(`${division.name} `)).toBeUndefined();
      expect(getDivisionInfo(division.id)).toBeUndefined();
      expect(getDivisionInfo(division.id.toUpperCase())).toBeUndefined();

      expect(getGamesByDivision(` ${division.name}`)).toEqual([]);
      expect(getGamesByDivision(`${division.name} `)).toEqual([]);
      expect(getGamesByDivision(division.id)).toEqual([]);
      expect(getGamesByDivision('')).toEqual([]);
    }
  });
});

describe('q-mp-472 game-registry — unavailable filter soft residual', () => {
  it('getAvailableGames drops unavailable entries without throwing', () => {
    const probe = GAMES[3]!;
    expect(probe.available).toBe(true);
    probe.available = false;

    const available = getAvailableGames();
    expect(available).toHaveLength(GAMES.length - 1);
    expect(available.every((g) => g.available)).toBe(true);
    expect(available.some((g) => g.id === probe.id)).toBe(false);

    // Lookup by id still returns the unavailable catalog entry (no throw).
    expect(getGameById(probe.id)).toBe(probe);
    expect(getGameById(probe.id)?.available).toBe(false);
  });

  it('getGamesByDivision does not gate on available (soft residual)', () => {
    const probe = GAMES.find((g) => g.division === DIVISIONS[0]!.name)!;
    probe.available = false;

    const bucket = getGamesByDivision(DIVISIONS[0]!.name);
    expect(bucket).toHaveLength(5);
    expect(bucket.some((g) => g.id === probe.id && g.available === false)).toBe(
      true
    );
    // Available filter still excludes it from the global available list.
    expect(getAvailableGames().some((g) => g.id === probe.id)).toBe(false);
  });
});

describe('q-mp-472 game-registry — return isolation + identity', () => {
  it('filter helpers return new arrays; caller mutation does not alter catalog', () => {
    const beforeLen = GAMES.length;
    const available = getAvailableGames();
    const byDiv = getGamesByDivision(DIVISIONS[1]!.name);

    expect(available).not.toBe(GAMES);
    expect(byDiv).not.toBe(GAMES);

    available.pop();
    byDiv.pop();
    available.push({
      id: 'q472-probe-should-not-stick',
      name: 'probe',
      division: DIVISIONS[0]!.name,
      gradeRange: 'x',
      description: 'x',
      playerCount: 'x',
      difficulty: 'beginner',
      icon: 'x',
      available: true,
    } satisfies GameInfo);

    expect(GAMES).toHaveLength(beforeLen);
    expect(GAMES.some((g) => g.id === 'q472-probe-should-not-stick')).toBe(
      false
    );
    expect(getGamesByDivision(DIVISIONS[1]!.name)).toHaveLength(5);
  });

  it('getGameById returns the live catalog object identity', () => {
    for (const game of GAMES) {
      expect(getGameById(game.id)).toBe(game);
    }
  });
});

describe('q-mp-472 game-registry — structural soft invariants', () => {
  it('catalog stays 4×5 with slug ids and known difficulty union', () => {
    expect(DIVISIONS).toHaveLength(4);
    expect(GAMES).toHaveLength(20);

    const divisionNames = new Set(DIVISIONS.map((d) => d.name));
    for (const division of DIVISIONS) {
      expect(division.id).toMatch(DIVISION_ID);
      expect(division.name.length).toBeGreaterThan(0);
      expect(division.gradeRange.length).toBeGreaterThan(0);
      expect(division.description.length).toBeGreaterThan(0);
      expect(getGamesByDivision(division.name)).toHaveLength(5);
    }

    const ids = GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const game of GAMES) {
      expect(game.id).toMatch(ID_SLUG);
      expect(DIFFICULTIES.has(game.difficulty)).toBe(true);
      expect(divisionNames.has(game.division)).toBe(true);
      expect(typeof game.available).toBe('boolean');
      expect(game.icon.length).toBeGreaterThan(0);
      expect(game.playerCount.length).toBeGreaterThan(0);
      expect(game.name.length).toBeGreaterThan(0);
      expect(game.description.length).toBeGreaterThan(0);
      expect(game.gradeRange.length).toBeGreaterThan(0);
    }
  });

  it('each game gradeRange aligns with its division gradeRange (structural)', () => {
    const gradeByDivisionName = new Map(
      DIVISIONS.map((d) => [d.name, d.gradeRange] as const)
    );
    for (const game of GAMES) {
      expect(game.gradeRange).toBe(gradeByDivisionName.get(game.division));
    }
  });
});
