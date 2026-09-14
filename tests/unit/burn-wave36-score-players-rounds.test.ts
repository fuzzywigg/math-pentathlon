/**
 * Wave 36 — scoring roster / rounds / difference leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addPlayer,
  removePlayer,
  startNewRound,
  getScoreDifference,
  getPlayerData,
  getLeader,
  resetScores,
  setScore,
  calculateGameResult,
} from '../../src/core/timer-scoring';

describe('Wave 36 score-players — roster edges', () => {
  it('addPlayer is idempotent for duplicate ids', () => {
    let state = createScoringState({}, ['a']);
    state = addPlayer(state, 'a', 'Alias');
    expect(state.players).toHaveLength(1);
    expect(state.players[0]!.playerName).toBe('a'); // original kept
  });

  it('addPlayer defaults name to id', () => {
    let state = createScoringState();
    state = addPlayer(state, 'solo');
    expect(getPlayerData(state, 'solo')).toEqual({
      playerId: 'solo',
      playerName: 'solo',
      total: 0,
      entries: [],
    });
  });

  it('removePlayer drops scores and getLeader updates', () => {
    let state = createScoringState({}, ['a', 'b'], { a: 'A', b: 'B' });
    state = setScore(state, 'a', 10);
    state = setScore(state, 'b', 20);
    expect(getLeader(state)?.playerId).toBe('b');
    state = removePlayer(state, 'b');
    expect(getLeader(state)?.playerId).toBe('a');
    expect(getPlayerData(state, 'b')).toBeUndefined();
  });

  it('empty roster: getLeader null and empty game result', () => {
    const state = createScoringState();
    expect(getLeader(state)).toBeNull();
    const result = calculateGameResult(state, 500);
    expect(result).toEqual({
      winnerId: null,
      winnerName: null,
      isTie: false,
      tiedPlayerIds: [],
      totalDuration: 500,
      finalScores: {},
    });
  });
});

describe('Wave 36 score-players — rounds and differences', () => {
  it('startNewRound increments from 1', () => {
    let state = createScoringState({}, ['p']);
    expect(state.currentRound).toBe(1);
    state = startNewRound(state);
    state = startNewRound(state);
    expect(state.currentRound).toBe(3);
  });

  it('getScoreDifference handles missing players as 0', () => {
    let state = createScoringState({}, ['a'], { a: 'A' });
    state = setScore(state, 'a', 15);
    expect(getScoreDifference(state, 'a', 'ghost')).toBe(15);
    expect(getScoreDifference(state, 'ghost', 'a')).toBe(-15);
    expect(getScoreDifference(state, 'ghost', 'ghost2')).toBe(0);
  });

  it('resetScores clears totals and entries but keeps roster/round', () => {
    let state = createScoringState({}, ['a', 'b']);
    state = setScore(state, 'a', 9);
    state = startNewRound(state);
    state = resetScores(state);
    expect(state.currentRound).toBe(2);
    expect(state.players.every((p) => p.total === 0 && p.entries.length === 0)).toBe(
      true
    );
  });
});
