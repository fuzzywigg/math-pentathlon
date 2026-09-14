/**
 * Overnight TOKENMAXX — leaderboard / ranking / standings rank edges.
 * Slice: ties, rank gaps (dense renumber), empty boards, score-update races.
 * Existing module only: src/core/timer-scoring.ts. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  createScoringState,
  addPlayer,
  removePlayer,
  addScore,
  subtractScore,
  setScore,
  resetScores,
  getLeaderboard,
  getLeader,
  calculateGameResult,
  getPlayerScore,
  getScoreDifference,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_700_000_000_000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Wave 41 leaderboard — mid-pack and bottom ties (dense ranks)', () => {
  it('mid-pack equal totals still get contiguous ranks 1..n (not olympic)', () => {
    let state = createScoringState({}, ['a', 'b', 'c', 'd', 'e'], {
      a: 'A',
      b: 'B',
      c: 'C',
      d: 'D',
      e: 'E',
    });
    state = setScore(state, 'a', 50);
    state = setScore(state, 'b', 20);
    state = setScore(state, 'c', 20);
    state = setScore(state, 'd', 20);
    state = setScore(state, 'e', 5);

    const lb = getLeaderboard(state);
    expect(lb.map((e) => e.total)).toEqual([50, 20, 20, 20, 5]);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3, 4, 5]);
    expect(new Set(lb.slice(1, 4).map((e) => e.playerId))).toEqual(
      new Set(['b', 'c', 'd'])
    );
    // Dense: no shared rank numbers, no gap after the tied cluster
    expect(new Set(lb.map((e) => e.rank)).size).toBe(5);
  });

  it('bottom-pack zero ties keep dense ranks under highest winCondition', () => {
    let state = createScoringState({}, ['lead', 'x', 'y', 'z']);
    state = setScore(state, 'lead', 9);
    // x/y/z remain 0
    const lb = getLeaderboard(state);
    expect(lb[0]?.playerId).toBe('lead');
    expect(lb[0]?.rank).toBe(1);
    expect(lb.slice(1).every((e) => e.total === 0)).toBe(true);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3, 4]);
  });

  it('all-zero roster is a full tie for calculateGameResult', () => {
    const state = createScoringState({}, ['p1', 'p2', 'p3'], {
      p1: 'One',
      p2: 'Two',
      p3: 'Three',
    });
    const lb = getLeaderboard(state);
    expect(lb.every((e) => e.total === 0)).toBe(true);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3]);
    const result = calculateGameResult(state, 10);
    expect(result.isTie).toBe(true);
    expect(result.winnerId).toBeNull();
    expect(result.tiedPlayerIds.sort()).toEqual(['p1', 'p2', 'p3']);
  });

  it('negative totals tie on highest sort (no minScore)', () => {
    let state = createScoringState({}, ['a', 'b', 'c']);
    state = setScore(state, 'a', -3);
    state = setScore(state, 'b', -3);
    state = setScore(state, 'c', -10);
    const lb = getLeaderboard(state);
    expect(lb.map((e) => e.total)).toEqual([-3, -3, -10]);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3]);
    const result = calculateGameResult(state, 1);
    expect(result.isTie).toBe(true);
    expect(result.tiedPlayerIds.sort()).toEqual(['a', 'b']);
  });

  it('lowest winCondition: mid-pack high ties do not affect top rank', () => {
    let state = createScoringState({ winCondition: { type: 'lowest' } }, [
      'lo',
      'm1',
      'm2',
      'hi',
    ]);
    state = setScore(state, 'lo', 1);
    state = setScore(state, 'm1', 8);
    state = setScore(state, 'm2', 8);
    state = setScore(state, 'hi', 20);
    const lb = getLeaderboard(state);
    expect(lb[0]?.playerId).toBe('lo');
    expect(lb[0]?.rank).toBe(1);
    expect(lb.map((e) => e.total)).toEqual([1, 8, 8, 20]);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3, 4]);
    expect(calculateGameResult(state, 0).winnerId).toBe('lo');
  });

  it('lowest winCondition: shared lowest totals produce a top tie', () => {
    let state = createScoringState({ winCondition: { type: 'lowest' } }, [
      'a',
      'b',
      'c',
    ]);
    state = setScore(state, 'a', 4);
    state = setScore(state, 'b', 4);
    state = setScore(state, 'c', 12);
    const result = calculateGameResult(state, 3);
    expect(result.isTie).toBe(true);
    expect(result.tiedPlayerIds.sort()).toEqual(['a', 'b']);
    expect(getLeaderboard(state).map((e) => e.rank)).toEqual([1, 2, 3]);
  });
});

describe('Wave 41 leaderboard — rank gaps after score chasms and removals', () => {
  it('large score gaps never invent olympic-style skipped ranks', () => {
    let state = createScoringState({}, ['a', 'b', 'c']);
    state = setScore(state, 'a', 1_000_000);
    state = setScore(state, 'b', 1);
    state = setScore(state, 'c', -500);
    const lb = getLeaderboard(state);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3]);
    expect(lb[0]!.total - lb[1]!.total).toBe(999_999);
    expect(lb[1]!.total - lb[2]!.total).toBe(501);
  });

  it('removePlayer renumbers ranks without holes', () => {
    let state = createScoringState({}, ['a', 'b', 'c', 'd']);
    state = setScore(state, 'a', 40);
    state = setScore(state, 'b', 30);
    state = setScore(state, 'c', 20);
    state = setScore(state, 'd', 10);
    expect(getLeaderboard(state).map((e) => e.rank)).toEqual([1, 2, 3, 4]);

    state = removePlayer(state, 'b');
    const lb = getLeaderboard(state);
    expect(lb.map((e) => e.playerId)).toEqual(['a', 'c', 'd']);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3]);
    expect(getLeader(state)?.playerId).toBe('a');
  });

  it('setScore reshuffle keeps dense 1..n after leapfrog', () => {
    let state = createScoringState({}, ['a', 'b', 'c']);
    state = setScore(state, 'a', 10);
    state = setScore(state, 'b', 20);
    state = setScore(state, 'c', 30);
    expect(getLeaderboard(state).map((e) => e.playerId)).toEqual([
      'c',
      'b',
      'a',
    ]);

    state = setScore(state, 'a', 100);
    const lb = getLeaderboard(state);
    expect(lb.map((e) => e.playerId)).toEqual(['a', 'c', 'b']);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3]);
  });

  it('resetScores collapses everyone to tied zeros with ranks 1..n', () => {
    let state = createScoringState({}, ['a', 'b', 'c']);
    state = setScore(state, 'a', 99);
    state = setScore(state, 'b', 50);
    state = resetScores(state);
    const lb = getLeaderboard(state);
    expect(lb.every((e) => e.total === 0)).toBe(true);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3]);
    expect(calculateGameResult(state, 0).isTie).toBe(true);
  });

  it('subtractScore can open a rank gap in totals without rank-number holes', () => {
    let state = createScoringState({}, ['a', 'b', 'c']);
    state = setScore(state, 'a', 10);
    state = setScore(state, 'b', 10);
    state = setScore(state, 'c', 10);
    state = subtractScore(state, 'b', 7);
    const lb = getLeaderboard(state);
    expect(lb.map((e) => e.total)).toEqual([10, 10, 3]);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3]);
    expect(getScoreDifference(state, 'a', 'b')).toBe(7);
  });
});

describe('Wave 41 leaderboard — empty and near-empty boards', () => {
  it('empty createScoringState → empty board, null leader, non-tie result', () => {
    const state = createScoringState();
    expect(getLeaderboard(state)).toEqual([]);
    expect(getLeaderboard(state, 'anyone')).toEqual([]);
    expect(getLeader(state)).toBeNull();
    const result = calculateGameResult(state, 42);
    expect(result).toEqual({
      winnerId: null,
      winnerName: null,
      isTie: false,
      tiedPlayerIds: [],
      totalDuration: 42,
      finalScores: {},
    });
  });

  it('removing every seat yields an empty board again', () => {
    let state = createScoringState({}, ['a', 'b']);
    state = addScore(state, 'a', 5);
    state = removePlayer(state, 'a');
    state = removePlayer(state, 'b');
    expect(state.players).toHaveLength(0);
    expect(getLeaderboard(state)).toEqual([]);
    expect(getLeader(state)).toBeNull();
    expect(calculateGameResult(state, 7).finalScores).toEqual({});
  });

  it('single player is sole rank-1 winner (not a tie)', () => {
    let state = createScoringState({}, ['solo'], { solo: 'Solo' });
    state = addScore(state, 'solo', 0);
    const lb = getLeaderboard(state, 'solo');
    expect(lb).toHaveLength(1);
    expect(lb[0]).toMatchObject({
      playerId: 'solo',
      rank: 1,
      total: 0,
      isCurrentPlayer: true,
    });
    const result = calculateGameResult(state, 1);
    expect(result.isTie).toBe(false);
    expect(result.winnerId).toBe('solo');
    expect(result.winnerName).toBe('Solo');
  });

  it('unknown currentPlayerId flags nobody on a non-empty board', () => {
    let state = createScoringState({}, ['a', 'b']);
    state = setScore(state, 'a', 2);
    state = setScore(state, 'b', 1);
    const lb = getLeaderboard(state, 'ghost');
    expect(lb.every((e) => e.isCurrentPlayer === false)).toBe(true);
  });

  it('re-add after empty restores ranks from zero', () => {
    let state = createScoringState({}, ['a']);
    state = removePlayer(state, 'a');
    state = addPlayer(state, 'z', 'Zed');
    state = addScore(state, 'z', 3);
    const lb = getLeaderboard(state);
    expect(lb).toEqual([
      {
        playerId: 'z',
        playerName: 'Zed',
        total: 3,
        rank: 1,
        isCurrentPlayer: false,
      },
    ]);
  });
});

describe('Wave 41 leaderboard — score update races (immutable forks)', () => {
  it('forked updates from one snapshot do not cross-contaminate totals', () => {
    const base = createScoringState({}, ['a', 'b', 'c']);
    const forkA = addScore(base, 'a', 10);
    const forkB = addScore(base, 'b', 15);

    expect(getPlayerScore(base, 'a')).toBe(0);
    expect(getPlayerScore(base, 'b')).toBe(0);
    expect(getLeaderboard(base).every((e) => e.total === 0)).toBe(true);

    expect(getLeaderboard(forkA)[0]?.playerId).toBe('a');
    expect(getLeaderboard(forkB)[0]?.playerId).toBe('b');
    expect(getPlayerScore(forkA, 'b')).toBe(0);
    expect(getPlayerScore(forkB, 'a')).toBe(0);
  });

  it('stale leaderboard snapshot stays frozen after later mutations', () => {
    let state = createScoringState({}, ['a', 'b']);
    state = setScore(state, 'a', 5);
    state = setScore(state, 'b', 3);
    const staleLb = getLeaderboard(state);
    const staleLeader = getLeader(state);

    const next = setScore(state, 'b', 99);
    expect(staleLb.map((e) => e.playerId)).toEqual(['a', 'b']);
    expect(staleLb[0]?.total).toBe(5);
    expect(staleLeader?.playerId).toBe('a');
    expect(getLeaderboard(next)[0]?.playerId).toBe('b');
    expect(getLeader(next)?.total).toBe(99);
  });

  it('racing subtract vs add forks: each branch ranks from its own ledger', () => {
    let base = createScoringState({}, ['a', 'b']);
    base = setScore(base, 'a', 20);
    base = setScore(base, 'b', 20);

    const penalizeA = subtractScore(base, 'a', 15);
    const boostB = addScore(base, 'b', 15);

    expect(getLeaderboard(penalizeA).map((e) => e.playerId)).toEqual([
      'b',
      'a',
    ]);
    expect(getLeaderboard(penalizeA).map((e) => e.total)).toEqual([20, 5]);

    expect(getLeaderboard(boostB).map((e) => e.playerId)).toEqual(['b', 'a']);
    expect(getLeaderboard(boostB).map((e) => e.total)).toEqual([35, 20]);

    // base unchanged — race loser if someone applied both without merging
    expect(getLeaderboard(base).map((e) => e.total)).toEqual([20, 20]);
    expect(calculateGameResult(base, 0).isTie).toBe(true);
  });

  it('sequential merge of both race forks matches applying both updates', () => {
    let base = createScoringState({}, ['a', 'b']);
    base = setScore(base, 'a', 10);
    base = setScore(base, 'b', 10);

    const afterA = addScore(base, 'a', 5);
    const merged = subtractScore(afterA, 'b', 3);

    let sequential = addScore(base, 'a', 5);
    sequential = subtractScore(sequential, 'b', 3);

    expect(getLeaderboard(merged)).toEqual(getLeaderboard(sequential));
    expect(getLeaderboard(merged).map((e) => e.total)).toEqual([15, 7]);
    expect(getLeaderboard(merged).map((e) => e.rank)).toEqual([1, 2]);
  });

  it('rapid alternating updates: leaderboard always reflects latest state only', () => {
    let state = createScoringState({}, ['a', 'b']);
    const snapshots: string[] = [];

    for (let i = 0; i < 8; i++) {
      const id = i % 2 === 0 ? 'a' : 'b';
      state = addScore(state, id, 3);
      snapshots.push(getLeaderboard(state)[0]!.playerId);
    }

    expect(getPlayerScore(state, 'a')).toBe(12);
    expect(getPlayerScore(state, 'b')).toBe(12);
    expect(snapshots[0]).toBe('a');
    expect(snapshots[1]).toBe('a'); // tied after b's first 3; stable sort favors a
    expect(calculateGameResult(state, 8).isTie).toBe(true);
    expect(getLeaderboard(state).map((e) => e.rank)).toEqual([1, 2]);
  });

  it('lowest race fork: boosting leader can hand the lead to the other seat', () => {
    let base = createScoringState({ winCondition: { type: 'lowest' } }, [
      'a',
      'b',
    ]);
    base = setScore(base, 'a', 5);
    base = setScore(base, 'b', 8);
    expect(getLeader(base)?.playerId).toBe('a');

    const race = addScore(base, 'a', 10); // a → 15, now worse under lowest
    expect(getLeaderboard(race).map((e) => e.playerId)).toEqual(['b', 'a']);
    expect(getLeader(race)?.playerId).toBe('b');
    expect(getLeader(base)?.playerId).toBe('a');
  });
});
