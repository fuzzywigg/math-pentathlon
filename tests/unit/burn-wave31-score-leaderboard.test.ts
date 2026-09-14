/**
 * Wave 31 — leaderboard ranking / current-player flag / getLeader.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addScore,
  getLeaderboard,
  getLeader,
  setScore,
} from '../../src/core/timer-scoring';

describe('Wave 31 scoring — leaderboard highest default', () => {
  it('ranks descending and assigns dense ranks 1..n', () => {
    let state = createScoringState({}, ['a', 'b', 'c', 'd'], {
      a: 'A',
      b: 'B',
      c: 'C',
      d: 'D',
    });
    state = addScore(state, 'a', 10);
    state = addScore(state, 'b', 40);
    state = addScore(state, 'c', 40);
    state = addScore(state, 'd', 5);

    const lb = getLeaderboard(state);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3, 4]);
    expect(lb[0].total).toBe(40);
    expect(lb[1].total).toBe(40);
    expect(lb[2].playerId).toBe('a');
    expect(lb[3].playerId).toBe('d');
    // stable-ish: equal scores keep relative insertion order from sort stability
    expect(new Set(lb.slice(0, 2).map((e) => e.playerId))).toEqual(
      new Set(['b', 'c'])
    );
  });

  it('flags only the requested currentPlayerId', () => {
    let state = createScoringState({}, ['p1', 'p2', 'p3']);
    state = addScore(state, 'p1', 1);
    state = addScore(state, 'p2', 2);
    state = addScore(state, 'p3', 3);
    const lb = getLeaderboard(state, 'p2');
    expect(lb.every((e) => e.isCurrentPlayer === (e.playerId === 'p2'))).toBe(
      true
    );
  });

  it('empty roster yields empty leaderboard and null leader', () => {
    const state = createScoringState();
    expect(getLeaderboard(state)).toEqual([]);
    expect(getLeader(state)).toBeNull();
  });
});

describe('Wave 31 scoring — lowest winCondition ranking', () => {
  it('sorts ascending when winCondition is lowest', () => {
    let state = createScoringState(
      { winCondition: { type: 'lowest' } },
      ['p1', 'p2', 'p3'],
      { p1: 'One', p2: 'Two', p3: 'Three' }
    );
    state = setScore(state, 'p1', 30);
    state = setScore(state, 'p2', 10);
    state = setScore(state, 'p3', 20);

    const lb = getLeaderboard(state, 'p3');
    expect(lb.map((e) => e.playerId)).toEqual(['p2', 'p3', 'p1']);
    expect(getLeader(state)?.playerId).toBe('p2');
    expect(getLeader(state)?.playerName).toBe('Two');
    expect(lb.find((e) => e.playerId === 'p3')?.isCurrentPlayer).toBe(true);
  });

  it('target/exact/highest all use descending leaderboard sort', () => {
    for (const type of ['highest', 'target', 'exact'] as const) {
      let state = createScoringState({ winCondition: { type, value: 100 } }, [
        'x',
        'y',
      ]);
      state = setScore(state, 'x', 5);
      state = setScore(state, 'y', 9);
      expect(getLeaderboard(state)[0].playerId).toBe('y');
      expect(getLeader(state)?.playerId).toBe('y');
    }
  });
});

describe('Wave 31 scoring — leaderboard name passthrough', () => {
  it('preserves playerName on entries', () => {
    let state = createScoringState({}, ['id1'], { id1: 'Display' });
    state = addScore(state, 'id1', 1);
    expect(getLeaderboard(state)[0].playerName).toBe('Display');
  });
});
