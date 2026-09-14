/**
 * Wave 24 — timer-scoring edges (clamp / multipliers / win conditions / format).
 * Distinct from wave 15 game-clock helpers and waves 19–23 persist/AI/UI toolkit burns.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createTimer,
  startTimer,
  pauseTimer,
  stopTimer,
  resetTimer,
  getTimerValue,
  isTimerWarning,
  isTimerCritical,
  isTimerComplete,
  addTime,
  formatTime,
  parseTime,
  getTimerProgress,
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
  vi.setSystemTime(new Date('2026-09-14T12:00:00.000Z'));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 24 timer — pause/resume identity and display value', () => {
  it('pause on non-running is identity; start then pause stamps pauseTime', () => {
    const stopped = createTimer({ initialTime: 30_000 });
    expect(pauseTimer(stopped)).toBe(stopped);

    let t = startTimer(stopped);
    expect(t.state).toBe('running');
    expect(t.startTime).toBe(Date.now());
    expect(startTimer(t)).toBe(t);

    t = pauseTimer(t);
    expect(t.state).toBe('paused');
    expect(t.pauseTime).toBe(Date.now());
  });

  it('stop/reset clear elapsed and restore remaining; getTimerValue respects direction', () => {
    let down = startTimer(createTimer({ direction: 'down', initialTime: 10_000 }));
    down = { ...down, remaining: 2500, elapsed: 7500 };
    const stopped = stopTimer(down);
    expect(stopped.state).toBe('stopped');
    expect(stopped.remaining).toBe(10_000);
    expect(stopped.elapsed).toBe(0);
    expect(stopped.startTime).toBeNull();
    expect(resetTimer(down)).toEqual(stopped);

    const up = createTimer({ direction: 'up', initialTime: 60_000 });
    expect(getTimerValue({ ...up, elapsed: 1234, remaining: 0 })).toBe(1234);
    expect(getTimerValue({ ...down, remaining: 4242 })).toBe(4242);
  });

  it('warning/critical/complete thresholds and addTime clamp', () => {
    const base = createTimer({
      direction: 'down',
      initialTime: 60_000,
      warningThreshold: 10_000,
      criticalThreshold: 3_000,
    });
    expect(isTimerWarning({ ...base, remaining: 10_000 })).toBe(true);
    expect(isTimerWarning({ ...base, remaining: 3_000 })).toBe(false);
    expect(isTimerWarning({ ...base, remaining: 2_999 })).toBe(false);
    expect(isTimerCritical({ ...base, remaining: 3_000 })).toBe(true);
    expect(isTimerCritical({ ...base, remaining: 3_001 })).toBe(false);
    expect(isTimerComplete({ ...base, remaining: 0 })).toBe(true);
    expect(isTimerComplete({ ...base, remaining: 1 })).toBe(false);

    const up = createTimer({ direction: 'up', initialTime: 5_000 });
    expect(isTimerComplete(up)).toBe(false);
    expect(isTimerWarning(createTimer({ initialTime: 5_000 }))).toBe(false);
    expect(isTimerCritical(createTimer({ initialTime: 5_000 }))).toBe(false);

    expect(addTime(base, -100_000).remaining).toBe(0);
    expect(addTime(base, 500).remaining).toBe(60_500);
  });

  it('format/parse round-trip and progress edges', () => {
    expect(formatTime(65_000)).toBe('01:05');
    expect(formatTime(65_430, { showMilliseconds: true })).toBe('01:05.43');
    expect(
      formatTime(5_000, { padMinutes: false, padSeconds: false, separator: '-' })
    ).toBe('0-5');
    expect(parseTime('01:05')).toBe(65_000);
    expect(parseTime('01:05.43')).toBe(65_430);
    expect(parseTime('1:02:03')).toBe((1 * 3600 + 2 * 60 + 3) * 1000);

    const down = createTimer({ initialTime: 100 });
    expect(getTimerProgress({ ...down, remaining: 50 })).toBe(50);
    expect(getTimerProgress({ ...down, remaining: 200 })).toBe(100);
    expect(getTimerProgress(createTimer({ initialTime: 0 }))).toBe(0);

    const up = createTimer({ direction: 'up', initialTime: 100 });
    expect(getTimerProgress({ ...up, elapsed: 25 })).toBe(25);
    expect(getTimerProgress({ ...up, elapsed: 250 })).toBe(100);
  });
});

describe('Wave 24 scoring — clamp, multipliers, ledger', () => {
  it('addPlayer is idempotent; removePlayer drops seat', () => {
    let state = createScoringState({}, ['p1'], { p1: 'Ada' });
    expect(state.players).toHaveLength(1);
    expect(addPlayer(state, 'p1', 'Ada')).toBe(state);
    state = addPlayer(state, 'p2', 'Ben');
    expect(state.players.map((p) => p.playerId)).toEqual(['p1', 'p2']);
    state = removePlayer(state, 'p1');
    expect(state.players.map((p) => p.playerId)).toEqual(['p2']);
    expect(getPlayerScore(state, 'missing')).toBe(0);
    expect(getPlayerData(state, 'missing')).toBeUndefined();
  });

  it('multipliers stack on add/subtract; max/min clamp on add and set', () => {
    let state = createScoringState(
      { maxScore: 20, minScore: 0, pointValues: { hit: 3, default: 1 } },
      ['p1', 'p2']
    );
    state = addMultiplier(state, { id: 'x2', name: 'Double', multiplier: 2 });
    state = addScore(state, 'p1', 5, 'base');
    expect(getPlayerScore(state, 'p1')).toBe(10);
    expect(getPlayerData(state, 'p1')!.entries[0]).toMatchObject({
      amount: 10,
      reason: 'base',
    });

    state = addMultiplier(state, { id: 'x2', name: 'Triple', multiplier: 3 });
    expect(state.multipliers).toHaveLength(1);
    expect(state.multipliers[0].multiplier).toBe(3);

    state = addScore(state, 'p1', 5);
    expect(getPlayerScore(state, 'p1')).toBe(20);

    state = removeMultiplier(state, 'x2');
    state = subtractScore(state, 'p1', 100, 'floor');
    expect(getPlayerScore(state, 'p1')).toBe(0);

    state = setScore(state, 'p1', 50);
    expect(getPlayerScore(state, 'p1')).toBe(20);
    expect(getRecentEntries(state, 'p1', 2)[0].reason).toBe('set');
  });

  it('point values merge + fallback; reset clears ledger; rounds advance', () => {
    let state = createScoringState({ pointValues: { a: 2 } }, ['p1']);
    expect(getPointValue(state, 'a')).toBe(2);
    expect(getPointValue(state, 'missing')).toBe(0);
    state = setPointValues(state, { default: 7, b: 9 });
    expect(getPointValue(state, 'b')).toBe(9);
    expect(getPointValue(state, 'ghost')).toBe(7);
    expect(getPointValue(createScoringState({}, ['p1']), 'x')).toBe(0);

    state = addScore(state, 'p1', 4, 'keep');
    state = resetScores(state);
    expect(getPlayerScore(state, 'p1')).toBe(0);
    expect(getPlayerData(state, 'p1')!.entries).toEqual([]);
    expect(startNewRound(state).currentRound).toBe(2);
  });
});

describe('Wave 24 scoring — leaderboard / win / result', () => {
  it('leaderboard sorts highest by default and lowest when configured', () => {
    let state = createScoringState({}, ['a', 'b', 'c'], {
      a: 'A',
      b: 'B',
      c: 'C',
    });
    state = setScore(state, 'a', 10);
    state = setScore(state, 'b', 30);
    state = setScore(state, 'c', 20);
    const high = getLeaderboard(state, 'c');
    expect(high.map((e) => e.playerId)).toEqual(['b', 'c', 'a']);
    expect(high[1].isCurrentPlayer).toBe(true);
    expect(getLeader(state)?.playerId).toBe('b');
    expect(getScoreDifference(state, 'b', 'a')).toBe(20);

    state = {
      ...state,
      config: { winCondition: { type: 'lowest' } },
    };
    expect(getLeaderboard(state).map((e) => e.playerId)).toEqual([
      'a',
      'c',
      'b',
    ]);
    expect(getLeader(createScoringState())).toBeNull();
  });

  it('checkWinCondition target/exact; calculateGameResult ties and empty', () => {
    let state = createScoringState(
      { winCondition: { type: 'target', value: 15 } },
      ['p1', 'p2']
    );
    expect(checkWinCondition(state)).toBeNull();
    state = setScore(state, 'p2', 15);
    expect(checkWinCondition(state)).toBe('p2');

    state = createScoringState(
      { winCondition: { type: 'exact', value: 7 } },
      ['p1']
    );
    state = setScore(state, 'p1', 8);
    expect(checkWinCondition(state)).toBeNull();
    state = setScore(state, 'p1', 7);
    expect(checkWinCondition(state)).toBe('p1');
    expect(checkWinCondition(createScoringState({}, ['p1']))).toBeNull();

    let tied = createScoringState({}, ['x', 'y'], { x: 'X', y: 'Y' });
    tied = setScore(tied, 'x', 5);
    tied = setScore(tied, 'y', 5);
    const tieResult = calculateGameResult(tied, 999);
    expect(tieResult.isTie).toBe(true);
    expect(tieResult.winnerId).toBeNull();
    expect(tieResult.tiedPlayerIds.sort()).toEqual(['x', 'y']);
    expect(tieResult.totalDuration).toBe(999);

    let solo = createScoringState({}, ['solo'], { solo: 'Solo' });
    solo = setScore(solo, 'solo', 3);
    const win = calculateGameResult(solo, 10);
    expect(win.isTie).toBe(false);
    expect(win.winnerId).toBe('solo');
    expect(win.winnerName).toBe('Solo');
    expect(win.finalScores.solo).toBe(3);

    const empty = calculateGameResult(createScoringState(), 0);
    expect(empty.winnerId).toBeNull();
    expect(empty.tiedPlayerIds).toEqual([]);
  });

  it('getRecentEntries returns newest-first slice; unknown player empty', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 1, 'one');
    vi.setSystemTime(new Date('2026-09-14T12:00:01.000Z'));
    state = addScore(state, 'p1', 2, 'two');
    vi.setSystemTime(new Date('2026-09-14T12:00:02.000Z'));
    state = addScore(state, 'p1', 3, 'three');
    expect(getRecentEntries(state, 'p1', 2).map((e) => e.reason)).toEqual([
      'three',
      'two',
    ]);
    expect(getRecentEntries(state, 'ghost', 5)).toEqual([]);
  });
});
