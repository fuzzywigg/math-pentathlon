/**
 * Wave 39 — removePlayer / resetScores ghost leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addPlayer,
  addScore,
  removePlayer,
  resetScores,
  getPlayerScore,
  getPlayerData,
} from '../../src/core/timer-scoring';

describe('Wave 39 score — remove/reset ghost', () => {
  it('removePlayer ghost is no-op; known id drops', () => {
    let state = createScoringState();
    state = addPlayer(state, 'p1', 'A');
    state = addPlayer(state, 'p2', 'B');
    state = addScore(state, 'p1', 4);
    const before = state.players.length;
    state = removePlayer(state, 'ghost');
    expect(state.players).toHaveLength(before);
    state = removePlayer(state, 'p1');
    expect(state.players.map((p) => p.playerId)).toEqual(['p2']);
    expect(getPlayerScore(state, 'p1')).toBe(0);
  });

  it('resetScores clears totals and entries', () => {
    let state = createScoringState();
    state = addPlayer(state, 'p1');
    state = addScore(state, 'p1', 10, 'bonus');
    state = resetScores(state);
    expect(getPlayerScore(state, 'p1')).toBe(0);
    expect(getPlayerData(state, 'p1')!.entries).toEqual([]);
  });
});
