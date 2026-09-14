/**
 * Wave 38 — handshake: path counts score via timer-scoring.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createGridGraph, findAllPaths } from '../../src/core/graph';
import {
  createScoringState,
  addPlayer,
  setScore,
  getPlayerScore,
  getScoreDifference,
} from '../../src/core/timer-scoring';

describe('Wave 38 handshake — graph paths → score', () => {
  it('path count becomes player score delta', () => {
    const g = createGridGraph(2, 2);
    const paths = findAllPaths(g, '0-0', '1-1', 4);
    let state = createScoringState();
    state = addPlayer(state, 'p1', 'Pathfinder');
    state = addPlayer(state, 'p2', 'Rival');
    state = setScore(state, 'p1', paths.length);
    state = setScore(state, 'p2', 0);
    expect(getPlayerScore(state, 'p1')).toBe(paths.length);
    expect(getScoreDifference(state, 'p1', 'p2')).toBe(paths.length);
    expect(paths.length).toBeGreaterThan(0);
  });
});
