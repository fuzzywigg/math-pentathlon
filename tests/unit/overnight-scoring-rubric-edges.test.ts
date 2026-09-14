/**
 * Overnight TOKENMAXX — scoring / rubric edges on existing timer-scoring.
 * Boundary scores, partial-credit pointValues paths, tie-break rules,
 * invalid answer stubs. Tests-only. No product inventing.
 * Avoids game-engine / attr-align-owl / wave41 leftovers.
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
  getPlayerScore,
  getPlayerData,
  getLeaderboard,
  getLeader,
  checkWinCondition,
  addMultiplier,
  removeMultiplier,
  startNewRound,
  getScoreDifference,
  getRecentEntries,
  calculateGameResult,
  getPointValue,
  setPointValues,
} from '../../src/core/timer-scoring';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(10_000);
});

afterEach(() => {
  vi.useRealTimers();
});

/** Rubric-style point catalog already supported via pointValues. */
const RUBRIC = {
  exact: 10,
  near: 5,
  partial: 2,
  miss: 0,
  default: 1,
} as const;

describe('Overnight scoring-rubric — boundary scores at min/max band', () => {
  it('landing exactly on maxScore is accepted; further adds stay pinned', () => {
    let state = createScoringState({ maxScore: 100 }, ['p1']);
    state = addScore(state, 'p1', 100, 'exact-cap');
    expect(getPlayerScore(state, 'p1')).toBe(100);
    state = addScore(state, 'p1', 1, 'over');
    expect(getPlayerScore(state, 'p1')).toBe(100);
    expect(getRecentEntries(state, 'p1', 1)[0]).toMatchObject({
      amount: 1,
      reason: 'over',
    });
  });

  it('landing exactly on minScore is accepted; further subtracts stay pinned', () => {
    let state = createScoringState({ minScore: -5 }, ['p1']);
    state = setScore(state, 'p1', -5);
    expect(getPlayerScore(state, 'p1')).toBe(-5);
    state = subtractScore(state, 'p1', 3, 'deeper');
    expect(getPlayerScore(state, 'p1')).toBe(-5);
    expect(getRecentEntries(state, 'p1', 1)[0]).toMatchObject({
      amount: -3,
      reason: 'deeper',
    });
  });

  it('zero-width band (min===max) forces every mutation onto that value', () => {
    let state = createScoringState({ minScore: 7, maxScore: 7 }, ['p1']);
    state = addScore(state, 'p1', 100);
    expect(getPlayerScore(state, 'p1')).toBe(7);
    state = setScore(state, 'p1', 0);
    expect(getPlayerScore(state, 'p1')).toBe(7);
    state = subtractScore(state, 'p1', 50);
    expect(getPlayerScore(state, 'p1')).toBe(7);
  });

  it('addScore of 0 is a ledger no-op on total but still records an entry', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 4, 'base');
    state = addScore(state, 'p1', 0, 'zero');
    expect(getPlayerScore(state, 'p1')).toBe(4);
    expect(getRecentEntries(state, 'p1', 1)[0]).toMatchObject({
      amount: 0,
      reason: 'zero',
    });
  });

  it('setScore to current total records a zero delta with reason set', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 12);
    state = setScore(state, 'p1', 12);
    expect(getPlayerScore(state, 'p1')).toBe(12);
    expect(getRecentEntries(state, 'p1', 1)[0]).toMatchObject({
      amount: 0,
      reason: 'set',
    });
  });

  it('setScore above max records post-clamp delta (clamped - previous)', () => {
    let state = createScoringState({ maxScore: 50 }, ['p1']);
    state = setScore(state, 'p1', 40);
    state = setScore(state, 'p1', 999);
    expect(getPlayerScore(state, 'p1')).toBe(50);
    expect(getRecentEntries(state, 'p1', 1)[0].amount).toBe(10); // 50 - 40
  });

  it('setScore below min records post-clamp delta', () => {
    let state = createScoringState({ minScore: 0 }, ['p1']);
    state = setScore(state, 'p1', 8);
    state = setScore(state, 'p1', -20);
    expect(getPlayerScore(state, 'p1')).toBe(0);
    expect(getRecentEntries(state, 'p1', 1)[0].amount).toBe(-8); // 0 - 8
  });

  it('negative boundary with minScore absent allows deep negatives', () => {
    let state = createScoringState({}, ['p1']);
    state = subtractScore(state, 'p1', 25, 'penalty');
    expect(getPlayerScore(state, 'p1')).toBe(-25);
    expect(getRecentEntries(state, 'p1', 1)[0].amount).toBe(-25);
  });
});

describe('Overnight scoring-rubric — partial credit via pointValues', () => {
  it('exact / near / partial / miss keys form a graded credit ladder', () => {
    let state = createScoringState({ pointValues: { ...RUBRIC } }, ['p1']);
    const ladder = ['exact', 'near', 'partial', 'miss'] as const;
    for (const key of ladder) {
      const credit = getPointValue(state, key);
      state = addScore(state, 'p1', credit, key);
    }
    // 10 + 5 + 2 + 0
    expect(getPlayerScore(state, 'p1')).toBe(17);
    expect(getPlayerData(state, 'p1')!.entries.map((e) => e.reason)).toEqual([
      ...ladder,
    ]);
    expect(getPlayerData(state, 'p1')!.entries.map((e) => e.amount)).toEqual([
      10, 5, 2, 0,
    ]);
  });

  it('unknown answer key falls back to default partial credit of 1', () => {
    const state = createScoringState({ pointValues: { ...RUBRIC } });
    expect(getPointValue(state, 'typo-answer')).toBe(1);
    expect(getPointValue(state, '')).toBe(1);
  });

  it('miss key is explicit zero; absent catalog yields zero for any key', () => {
    const graded = createScoringState({ pointValues: { ...RUBRIC } });
    expect(getPointValue(graded, 'miss')).toBe(0);

    const bare = createScoringState({});
    expect(getPointValue(bare, 'exact')).toBe(0);
    expect(getPointValue(bare, 'default')).toBe(0);
  });

  it('partial credit amount can be scaled by fractional multipliers', () => {
    let state = createScoringState({ pointValues: { ...RUBRIC } }, ['p1']);
    state = addMultiplier(state, {
      id: 'half',
      name: 'Half credit',
      multiplier: 0.5,
    });
    const near = getPointValue(state, 'near'); // 5
    state = addScore(state, 'p1', near, 'near-half');
    expect(getPlayerScore(state, 'p1')).toBe(2.5);
    expect(getRecentEntries(state, 'p1', 1)[0].amount).toBe(2.5);
  });

  it('setPointValues can rewrite partial rung without wiping miss/exact', () => {
    let state = createScoringState({ pointValues: { ...RUBRIC } });
    state = setPointValues(state, { partial: 3, near: 6 });
    expect(getPointValue(state, 'exact')).toBe(10);
    expect(getPointValue(state, 'near')).toBe(6);
    expect(getPointValue(state, 'partial')).toBe(3);
    expect(getPointValue(state, 'miss')).toBe(0);
    expect(getPointValue(state, 'default')).toBe(1);
  });

  it('applying miss then exact keeps ledger ordered and totals only exact', () => {
    let state = createScoringState({ pointValues: { ...RUBRIC } }, ['p1']);
    state = addScore(state, 'p1', getPointValue(state, 'miss'), 'miss');
    vi.setSystemTime(11_000);
    state = addScore(state, 'p1', getPointValue(state, 'exact'), 'exact');
    expect(getPlayerScore(state, 'p1')).toBe(10);
    expect(getRecentEntries(state, 'p1', 2).map((e) => e.reason)).toEqual([
      'exact',
      'miss',
    ]);
  });

  it('multi-seat independent partial credit does not bleed totals', () => {
    let state = createScoringState({ pointValues: { ...RUBRIC } }, [
      'a',
      'b',
      'c',
    ]);
    state = addScore(state, 'a', getPointValue(state, 'exact'), 'a-exact');
    state = addScore(state, 'b', getPointValue(state, 'partial'), 'b-partial');
    state = addScore(state, 'c', getPointValue(state, 'miss'), 'c-miss');
    expect(getPlayerScore(state, 'a')).toBe(10);
    expect(getPlayerScore(state, 'b')).toBe(2);
    expect(getPlayerScore(state, 'c')).toBe(0);
  });
});

describe('Overnight scoring-rubric — tie-break rules', () => {
  it('equal tops under highest → isTie with both ids; dense ranks 1..n', () => {
    let state = createScoringState(
      { winCondition: { type: 'highest' } },
      ['p1', 'p2', 'p3'],
      { p1: 'A', p2: 'B', p3: 'C' }
    );
    state = setScore(state, 'p1', 15);
    state = setScore(state, 'p2', 15);
    state = setScore(state, 'p3', 4);
    const lb = getLeaderboard(state);
    expect(lb.map((e) => e.total)).toEqual([15, 15, 4]);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3]);
    const result = calculateGameResult(state, 3_000);
    expect(result.isTie).toBe(true);
    expect(result.winnerId).toBeNull();
    expect(result.winnerName).toBeNull();
    expect(result.tiedPlayerIds.sort()).toEqual(['p1', 'p2']);
    expect(result.finalScores).toEqual({ p1: 15, p2: 15, p3: 4 });
  });

  it('lowest winCondition ties only the shared lowest totals', () => {
    let state = createScoringState({ winCondition: { type: 'lowest' } }, [
      'x',
      'y',
      'z',
    ]);
    state = setScore(state, 'x', 1);
    state = setScore(state, 'y', 1);
    state = setScore(state, 'z', 9);
    const result = calculateGameResult(state, 1);
    expect(result.isTie).toBe(true);
    expect(result.tiedPlayerIds.sort()).toEqual(['x', 'y']);
    expect(getLeader(state)?.total).toBe(1);
  });

  it('maxScore clamp can force a tie from unequal raw adds', () => {
    let state = createScoringState({ maxScore: 10 }, ['a', 'b']);
    state = addScore(state, 'a', 10);
    state = addScore(state, 'b', 50); // clamps to 10
    const result = calculateGameResult(state, 50);
    expect(getPlayerScore(state, 'a')).toBe(10);
    expect(getPlayerScore(state, 'b')).toBe(10);
    expect(result.isTie).toBe(true);
    expect(result.tiedPlayerIds.sort()).toEqual(['a', 'b']);
  });

  it('minScore clamp can force a lowest-mode tie', () => {
    let state = createScoringState(
      { minScore: 0, winCondition: { type: 'lowest' } },
      ['a', 'b', 'c']
    );
    state = setScore(state, 'a', 5);
    state = subtractScore(state, 'a', 100); // → 0
    state = setScore(state, 'b', 0);
    state = setScore(state, 'c', 3);
    const result = calculateGameResult(state, 9);
    expect(result.isTie).toBe(true);
    expect(result.tiedPlayerIds.sort()).toEqual(['a', 'b']);
  });

  it('all-zero roster is a full tie under highest', () => {
    const state = createScoringState({}, ['p1', 'p2', 'p3']);
    const result = calculateGameResult(state, 0);
    expect(result.isTie).toBe(true);
    expect(result.winnerId).toBeNull();
    expect(result.tiedPlayerIds.sort()).toEqual(['p1', 'p2', 'p3']);
    expect(result.finalScores).toEqual({ p1: 0, p2: 0, p3: 0 });
  });

  it('sole survivor after removePlayer breaks a former tie', () => {
    let state = createScoringState({}, ['a', 'b']);
    state = setScore(state, 'a', 8);
    state = setScore(state, 'b', 8);
    expect(calculateGameResult(state, 1).isTie).toBe(true);
    state = removePlayer(state, 'b');
    const result = calculateGameResult(state, 2);
    expect(result.isTie).toBe(false);
    expect(result.winnerId).toBe('a');
    expect(result.tiedPlayerIds).toEqual([]);
  });

  it('three-way equal tops list all tiedPlayerIds; leaderboard still dense', () => {
    let state = createScoringState({}, ['a', 'b', 'c']);
    state = setScore(state, 'a', 4);
    state = setScore(state, 'b', 4);
    state = setScore(state, 'c', 4);
    const lb = getLeaderboard(state);
    expect(lb.map((e) => e.rank)).toEqual([1, 2, 3]);
    const result = calculateGameResult(state, 7);
    expect(result.tiedPlayerIds.sort()).toEqual(['a', 'b', 'c']);
  });

  it('checkWinCondition first-roster exact does not break calculateGameResult ties', () => {
    let state = createScoringState(
      { winCondition: { type: 'exact', value: 5 } },
      ['early', 'late']
    );
    state = setScore(state, 'early', 5);
    state = setScore(state, 'late', 5);
    expect(checkWinCondition(state)).toBe('early');
    const result = calculateGameResult(state, 1);
    expect(result.isTie).toBe(true);
    expect(result.winnerId).toBeNull();
  });
});

describe('Overnight scoring-rubric — invalid answer / ghost stubs', () => {
  it('addScore / subtractScore / setScore on unknown id leave roster untouched', () => {
    let state = createScoringState({}, ['p1'], { p1: 'Ada' });
    state = addScore(state, 'p1', 3);
    const afterAdd = addScore(state, 'ghost', 99, 'invalid');
    const afterSub = subtractScore(state, 'ghost', 1);
    const afterSet = setScore(state, 'ghost', 50);
    for (const next of [afterAdd, afterSub, afterSet]) {
      expect(next.players).toHaveLength(1);
      expect(getPlayerScore(next, 'p1')).toBe(3);
      expect(getPlayerData(next, 'ghost')).toBeUndefined();
      expect(getPlayerScore(next, 'ghost')).toBe(0);
    }
  });

  it('getRecentEntries / getPlayerData / getPointValue tolerate empty & ghost keys', () => {
    const state = createScoringState({ pointValues: { ...RUBRIC } }, ['p1']);
    expect(getRecentEntries(state, 'ghost', 5)).toEqual([]);
    expect(getRecentEntries(state, '', 3)).toEqual([]);
    expect(getPlayerData(state, '')).toBeUndefined();
    expect(getPointValue(state, 'not-a-rung')).toBe(1);
  });

  it('exact win with undefined value never fires (invalid config stub)', () => {
    let state = createScoringState({ winCondition: { type: 'exact' } }, [
      'p1',
    ]);
    state = setScore(state, 'p1', 0);
    expect(checkWinCondition(state)).toBeNull();
    state = setScore(state, 'p1', 42);
    expect(checkWinCondition(state)).toBeNull();
  });

  it('target win with undefined value never fires', () => {
    let state = createScoringState({ winCondition: { type: 'target' } }, [
      'p1',
    ]);
    state = setScore(state, 'p1', 1_000);
    expect(checkWinCondition(state)).toBeNull();
  });

  it('exact value 0 treats opening totals as immediate winners (roster order)', () => {
    const state = createScoringState(
      { winCondition: { type: 'exact', value: 0 } },
      ['p1', 'p2']
    );
    expect(checkWinCondition(state)).toBe('p1');
  });

  it('target value 0 treats any non-negative opening total as win', () => {
    const state = createScoringState(
      { winCondition: { type: 'target', value: 0 } },
      ['p1', 'p2']
    );
    expect(checkWinCondition(state)).toBe('p1');
  });

  it('removeMultiplier / removePlayer unknown ids are structural no-ops', () => {
    let state = createScoringState({}, ['p1']);
    state = addMultiplier(state, { id: 'x2', name: 'D', multiplier: 2 });
    const afterMul = removeMultiplier(state, 'nope');
    expect(afterMul.multipliers).toHaveLength(1);
    const afterPlayer = removePlayer(state, 'nope');
    expect(afterPlayer.players).toHaveLength(1);
  });

  it('empty roster calculateGameResult is non-tie with null winner', () => {
    const result = calculateGameResult(createScoringState(), 42);
    expect(result).toEqual({
      winnerId: null,
      winnerName: null,
      isTie: false,
      tiedPlayerIds: [],
      totalDuration: 42,
      finalScores: {},
    });
  });

  it('getLeaderboard currentPlayerId that is missing still ranks others', () => {
    let state = createScoringState({}, ['a', 'b']);
    state = setScore(state, 'a', 2);
    state = setScore(state, 'b', 9);
    const lb = getLeaderboard(state, 'ghost');
    expect(lb.every((e) => e.isCurrentPlayer === false)).toBe(true);
    expect(lb[0].playerId).toBe('b');
  });
});

describe('Overnight scoring-rubric — win boundaries vs overshoot', () => {
  it('target fires at exact threshold and above; one below stays null', () => {
    let state = createScoringState(
      { winCondition: { type: 'target', value: 20 } },
      ['p1']
    );
    state = addScore(state, 'p1', 19);
    expect(checkWinCondition(state)).toBeNull();
    state = addScore(state, 'p1', 1);
    expect(checkWinCondition(state)).toBe('p1');
    state = addScore(state, 'p1', 5);
    expect(checkWinCondition(state)).toBe('p1');
  });

  it('exact wins only on equality; overshoot and undershoot miss', () => {
    let state = createScoringState(
      { winCondition: { type: 'exact', value: 7 } },
      ['p1']
    );
    for (const n of [6, 8, 0, 70]) {
      state = setScore(state, 'p1', n);
      expect(checkWinCondition(state)).toBeNull();
    }
    state = setScore(state, 'p1', 7);
    expect(checkWinCondition(state)).toBe('p1');
  });

  it('clamp can prevent reaching exact when raw add would overshoot', () => {
    let state = createScoringState(
      { maxScore: 9, winCondition: { type: 'exact', value: 10 } },
      ['p1']
    );
    state = addScore(state, 'p1', 10); // clamps to 9
    expect(getPlayerScore(state, 'p1')).toBe(9);
    expect(checkWinCondition(state)).toBeNull();
  });

  it('partial credit ladder can reach target without a single exact hit', () => {
    let state = createScoringState(
      {
        pointValues: { ...RUBRIC },
        winCondition: { type: 'target', value: 12 },
      },
      ['p1']
    );
    // near(5) + near(5) + partial(2) = 12
    state = addScore(state, 'p1', getPointValue(state, 'near'), 'n1');
    expect(checkWinCondition(state)).toBeNull();
    state = addScore(state, 'p1', getPointValue(state, 'near'), 'n2');
    expect(checkWinCondition(state)).toBeNull();
    state = addScore(state, 'p1', getPointValue(state, 'partial'), 'p');
    expect(checkWinCondition(state)).toBe('p1');
    expect(getPlayerScore(state, 'p1')).toBe(12);
  });
});

describe('Overnight scoring-rubric — rounds / diff / immutability edges', () => {
  it('startNewRound preserves scores, multipliers, and pointValues', () => {
    let state = createScoringState({ pointValues: { ...RUBRIC } }, ['p1']);
    state = addMultiplier(state, { id: 'x2', name: 'D', multiplier: 2 });
    state = addScore(state, 'p1', getPointValue(state, 'partial')); // 2*2=4
    state = startNewRound(state);
    state = startNewRound(state);
    expect(state.currentRound).toBe(3);
    expect(getPlayerScore(state, 'p1')).toBe(4);
    expect(state.multipliers).toHaveLength(1);
    expect(getPointValue(state, 'exact')).toBe(10);
  });

  it('resetScores clears totals/entries but keeps rubric config and roster', () => {
    let state = createScoringState({ pointValues: { ...RUBRIC } }, [
      'p1',
      'p2',
    ]);
    state = addScore(state, 'p1', 10, 'exact');
    state = addScore(state, 'p2', 2, 'partial');
    state = resetScores(state);
    expect(getPlayerScore(state, 'p1')).toBe(0);
    expect(getPlayerScore(state, 'p2')).toBe(0);
    expect(getPlayerData(state, 'p1')!.entries).toEqual([]);
    expect(getPointValue(state, 'exact')).toBe(10);
    expect(state.players).toHaveLength(2);
  });

  it('getScoreDifference with ghosts treats missing totals as 0', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', getPointValue(
      createScoringState({ pointValues: { ...RUBRIC } }),
      'near'
    ));
    expect(getScoreDifference(state, 'p1', 'ghost')).toBe(5);
    expect(getScoreDifference(state, 'ghost', 'p1')).toBe(-5);
    expect(getScoreDifference(state, 'ghost', 'specter')).toBe(0);
  });

  it('scoring ops do not mutate prior state objects', () => {
    const base = createScoringState({ pointValues: { ...RUBRIC } }, ['p1']);
    const scored = addScore(base, 'p1', 10, 'exact');
    expect(getPlayerScore(base, 'p1')).toBe(0);
    expect(getPlayerScore(scored, 'p1')).toBe(10);
    expect(scored).not.toBe(base);
    expect(scored.players).not.toBe(base.players);

    const reset = resetScores(scored);
    expect(getPlayerScore(scored, 'p1')).toBe(10);
    expect(getPlayerScore(reset, 'p1')).toBe(0);
  });

  it('duplicate addPlayer is a no-op; names fallback to id', () => {
    let state = createScoringState();
    state = addPlayer(state, 'solo');
    expect(state.players[0].playerName).toBe('solo');
    const again = addPlayer(state, 'solo', 'Ignored');
    expect(again.players).toHaveLength(1);
    expect(again.players[0].playerName).toBe('solo');
  });
});

describe('Overnight scoring-rubric — leaderboard / result stress matrix', () => {
  it('lowest ranking reverses order while highest uses descending totals', () => {
    let hi = createScoringState({ winCondition: { type: 'highest' } }, [
      'a',
      'b',
      'c',
    ]);
    hi = setScore(hi, 'a', 1);
    hi = setScore(hi, 'b', 9);
    hi = setScore(hi, 'c', 5);
    expect(getLeaderboard(hi).map((e) => e.playerId)).toEqual(['b', 'c', 'a']);

    let lo = createScoringState({ winCondition: { type: 'lowest' } }, [
      'a',
      'b',
      'c',
    ]);
    lo = setScore(lo, 'a', 1);
    lo = setScore(lo, 'b', 9);
    lo = setScore(lo, 'c', 5);
    expect(getLeaderboard(lo).map((e) => e.playerId)).toEqual(['a', 'c', 'b']);
    expect(calculateGameResult(lo, 1).winnerId).toBe('a');
  });

  it('partial credit then clamp then result preserves finalScores map', () => {
    let state = createScoringState(
      { maxScore: 12, pointValues: { ...RUBRIC } },
      ['p1', 'p2']
    );
    state = addScore(state, 'p1', getPointValue(state, 'exact')); // 10
    state = addScore(state, 'p1', getPointValue(state, 'near')); // 15 → 12
    state = addScore(state, 'p2', getPointValue(state, 'partial')); // 2
    expect(getPlayerScore(state, 'p1')).toBe(12);
    const result = calculateGameResult(state, 88);
    expect(result.winnerId).toBe('p1');
    expect(result.finalScores).toEqual({ p1: 12, p2: 2 });
    expect(result.isTie).toBe(false);
  });

  it('timestamps advance on successive rubric credits under fake timers', () => {
    let state = createScoringState({ pointValues: { ...RUBRIC } }, ['p1']);
    state = addScore(state, 'p1', getPointValue(state, 'partial'), 't0');
    vi.setSystemTime(20_000);
    state = addScore(state, 'p1', getPointValue(state, 'near'), 't1');
    const entries = getPlayerData(state, 'p1')!.entries;
    expect(entries[0].timestamp).toBe(10_000);
    expect(entries[1].timestamp).toBe(20_000);
  });
});

describe('Overnight scoring-rubric — negative / penalty credit paths', () => {
  it('negative pointValues act as coded penalty credit', () => {
    let state = createScoringState(
      {
        minScore: -50,
        pointValues: { foul: -4, default: 0 },
      },
      ['p1']
    );
    state = addScore(state, 'p1', 10, 'start');
    state = addScore(state, 'p1', getPointValue(state, 'foul'), 'foul');
    expect(getPlayerScore(state, 'p1')).toBe(6);
    expect(getRecentEntries(state, 'p1', 1)[0].amount).toBe(-4);
  });

  it('penalty credit clamps at minScore band edge', () => {
    let state = createScoringState(
      {
        minScore: 0,
        pointValues: { foul: -10 },
      },
      ['p1']
    );
    state = addScore(state, 'p1', 3);
    state = addScore(state, 'p1', getPointValue(state, 'foul'), 'foul');
    expect(getPlayerScore(state, 'p1')).toBe(0);
    expect(getRecentEntries(state, 'p1', 1)[0].amount).toBe(-10);
  });

  it('stacked multipliers scale negative penalties before clamp', () => {
    let state = createScoringState({ minScore: -100 }, ['p1']);
    state = addScore(state, 'p1', 20);
    state = addMultiplier(state, { id: 'x2', name: 'D', multiplier: 2 });
    state = subtractScore(state, 'p1', 5, 'pen'); // effective -10
    expect(getPlayerScore(state, 'p1')).toBe(10);
    expect(getRecentEntries(state, 'p1', 1)[0].amount).toBe(-10);
  });
});

describe('Overnight scoring-rubric — tie-break after credit churn', () => {
  it('one near-credit breaks an all-zero tie', () => {
    let state = createScoringState({ pointValues: { ...RUBRIC } }, [
      'a',
      'b',
    ]);
    expect(calculateGameResult(state, 1).isTie).toBe(true);
    state = addScore(state, 'a', getPointValue(state, 'near'), 'near');
    const result = calculateGameResult(state, 2);
    expect(result.isTie).toBe(false);
    expect(result.winnerId).toBe('a');
    expect(result.winnerName).toBe('a');
  });

  it('matching partial credits re-tie after a temporary lead', () => {
    let state = createScoringState({ pointValues: { ...RUBRIC } }, [
      'a',
      'b',
    ]);
    state = addScore(state, 'a', getPointValue(state, 'partial'));
    expect(calculateGameResult(state, 1).winnerId).toBe('a');
    state = addScore(state, 'b', getPointValue(state, 'partial'));
    const result = calculateGameResult(state, 2);
    expect(result.isTie).toBe(true);
    expect(result.tiedPlayerIds.sort()).toEqual(['a', 'b']);
  });

  it('getLeader under a two-way tie returns the first leaderboard seat', () => {
    let state = createScoringState({}, ['a', 'b']);
    state = setScore(state, 'a', 6);
    state = setScore(state, 'b', 6);
    const lb = getLeaderboard(state);
    expect(lb[0].total).toBe(6);
    expect(getLeader(state)?.playerId).toBe(lb[0].playerId);
  });

  it('lowest-mode: higher partial credit loses; equal partials tie', () => {
    let state = createScoringState(
      {
        pointValues: { ...RUBRIC },
        winCondition: { type: 'lowest' },
      },
      ['a', 'b']
    );
    state = addScore(state, 'a', getPointValue(state, 'exact')); // 10
    state = addScore(state, 'b', getPointValue(state, 'partial')); // 2
    expect(calculateGameResult(state, 1).winnerId).toBe('b');
    state = addScore(state, 'b', 8); // now both 10
    expect(calculateGameResult(state, 2).isTie).toBe(true);
  });
});

describe('Overnight scoring-rubric — invalid stub matrix expansion', () => {
  it('createScoringState with empty names map falls back to ids', () => {
    const state = createScoringState({}, ['x', 'y'], {});
    expect(state.players.map((p) => p.playerName)).toEqual(['x', 'y']);
  });

  it('setPointValues empty object is identity merge', () => {
    let state = createScoringState({ pointValues: { ...RUBRIC } });
    state = setPointValues(state, {});
    expect(getPointValue(state, 'exact')).toBe(10);
    expect(state.config.pointValues).toEqual({ ...RUBRIC });
  });

  it('highest/lowest mid-game never auto-win even at band edges', () => {
    let hi = createScoringState(
      { maxScore: 5, winCondition: { type: 'highest' } },
      ['a', 'b']
    );
    hi = addScore(hi, 'a', 100);
    expect(getPlayerScore(hi, 'a')).toBe(5);
    expect(checkWinCondition(hi)).toBeNull();

    let lo = createScoringState(
      { minScore: 0, winCondition: { type: 'lowest' } },
      ['a', 'b']
    );
    lo = subtractScore(lo, 'a', 50);
    expect(getPlayerScore(lo, 'a')).toBe(0);
    expect(checkWinCondition(lo)).toBeNull();
  });

  it('target first-roster winner can differ from leaderboard leader', () => {
    let state = createScoringState(
      { winCondition: { type: 'target', value: 5 } },
      ['slow', 'fast']
    );
    state = setScore(state, 'fast', 20);
    state = setScore(state, 'slow', 5);
    expect(checkWinCondition(state)).toBe('slow');
    expect(getLeaderboard(state)[0].playerId).toBe('fast');
    expect(calculateGameResult(state, 1).winnerId).toBe('fast');
  });

  it('addScore reason may be omitted; entry still stores amount', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 3);
    const entry = getRecentEntries(state, 'p1', 1)[0];
    expect(entry.amount).toBe(3);
    expect(entry.reason).toBeUndefined();
  });
});

describe('Overnight scoring-rubric — boundary matrix min/max combos', () => {
  it.each([
    { min: 0, max: 10, add: 10, expectTotal: 10 },
    { min: 0, max: 10, add: 11, expectTotal: 10 },
    { min: -5, max: 5, add: -100, expectTotal: -5 },
    { min: -5, max: 5, add: 100, expectTotal: 5 },
    { min: 0, max: 0, add: 7, expectTotal: 0 },
  ])(
    'add $add with band [$min,$max] → $expectTotal',
    ({ min, max, add, expectTotal }) => {
      let state = createScoringState(
        { minScore: min, maxScore: max },
        ['p1']
      );
      state = addScore(state, 'p1', add);
      expect(getPlayerScore(state, 'p1')).toBe(expectTotal);
    }
  );

  it.each([
    { value: -1, min: 0, max: 10, expectTotal: 0 },
    { value: 5, min: 0, max: 10, expectTotal: 5 },
    { value: 99, min: 0, max: 10, expectTotal: 10 },
  ])(
    'setScore($value) in [$min,$max] → $expectTotal',
    ({ value, min, max, expectTotal }) => {
      let state = createScoringState(
        { minScore: min, maxScore: max },
        ['p1']
      );
      state = setScore(state, 'p1', value);
      expect(getPlayerScore(state, 'p1')).toBe(expectTotal);
    }
  );
});
