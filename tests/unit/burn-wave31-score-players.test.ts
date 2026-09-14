/**
 * Wave 31 — scoring player add/remove / createScoringState isolation.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addPlayer,
  removePlayer,
  addScore,
  getPlayerScore,
  getPlayerData,
  getLeader,
} from '../../src/core/timer-scoring';

describe('Wave 31 scoring — createScoringState players', () => {
  it('seeds players with names fallback to id', () => {
    const state = createScoringState({}, ['a', 'b'], { a: 'Ada' });
    expect(state.players.map((p) => p.playerId)).toEqual(['a', 'b']);
    expect(state.players[0].playerName).toBe('Ada');
    expect(state.players[1].playerName).toBe('b');
    expect(state.players.every((p) => p.total === 0)).toBe(true);
    expect(state.players.every((p) => p.entries.length === 0)).toBe(true);
    expect(state.currentRound).toBe(1);
    expect(state.multipliers).toEqual([]);
  });

  it('does not share player array across creates', () => {
    const a = createScoringState({}, ['p1']);
    const b = createScoringState({}, ['p1']);
    expect(a.players).not.toBe(b.players);
    a.players.push({
      playerId: 'ghost',
      playerName: 'Ghost',
      total: 9,
      entries: [],
    });
    expect(b.players).toHaveLength(1);
  });
});

describe('Wave 31 scoring — addPlayer / removePlayer matrix', () => {
  it('addPlayer is idempotent for duplicate ids', () => {
    let state = createScoringState();
    state = addPlayer(state, 'p1', 'One');
    const again = addPlayer(state, 'p1', 'Renamed');
    expect(again).toBe(state);
    expect(again.players).toHaveLength(1);
    expect(again.players[0].playerName).toBe('One');
  });

  it('addPlayer without name uses playerId', () => {
    const state = addPlayer(createScoringState(), 'solo');
    expect(state.players[0].playerName).toBe('solo');
  });

  it('removePlayer is a no-op for unknown ids but returns new state', () => {
    const base = createScoringState({}, ['p1', 'p2']);
    const next = removePlayer(base, 'missing');
    expect(next).not.toBe(base);
    expect(next.players.map((p) => p.playerId)).toEqual(['p1', 'p2']);
  });

  it('removePlayer drops scores for that seat only', () => {
    let state = createScoringState({}, ['p1', 'p2', 'p3'], {
      p1: 'A',
      p2: 'B',
      p3: 'C',
    });
    state = addScore(state, 'p1', 10);
    state = addScore(state, 'p2', 20);
    state = addScore(state, 'p3', 30);
    state = removePlayer(state, 'p2');
    expect(state.players.map((p) => p.playerId)).toEqual(['p1', 'p3']);
    expect(getPlayerScore(state, 'p1')).toBe(10);
    expect(getPlayerScore(state, 'p3')).toBe(30);
    expect(getPlayerScore(state, 'p2')).toBe(0);
    expect(getPlayerData(state, 'p2')).toBeUndefined();
  });
});

describe('Wave 31 scoring — unknown player score ops', () => {
  it('addScore on missing player leaves roster unchanged', () => {
    const state = createScoringState({}, ['p1']);
    const next = addScore(state, 'ghost', 50, 'nope');
    expect(next.players).toHaveLength(1);
    expect(getPlayerScore(next, 'ghost')).toBe(0);
    expect(getLeader(next)?.playerId).toBe('p1');
  });
});
