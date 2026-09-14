/**
 * Wave 39 — handshake: graph bfs distance → expr target after #172/#173.
 * Distinct from wave38 graph→timer. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createGridGraph, bfs } from '../../src/core/graph';
import {
  evaluate,
  validateSolution,
  createTargetChallenge,
} from '../../src/core/expressions';

describe('Wave 39 handshake — expr ← graph distance', () => {
  it('bfs distance feeds evaluate / validateSolution target', () => {
    const g = createGridGraph(3, 3);
    const path = bfs(g, '0-0', '0-2');
    expect(path.found).toBe(true);
    expect(path.distance).toBe(2);

    const challenge = createTargetChallenge([1, 1], path.distance, {
      operators: ['+'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(evaluate('1+1').value).toBe(path.distance);
    expect(validateSolution('1+1', challenge).valid).toBe(true);
  });

  it('miss path distance -1 fails validate against that target', () => {
    const g = createGridGraph(2, 2);
    const miss = bfs(g, '0-0', 'ghost');
    expect(miss.found).toBe(false);
    expect(miss.distance).toBe(-1);
    const challenge = createTargetChallenge([1], miss.distance, {
      useAllNumbers: false,
      useEachOnce: false,
    });
    expect(validateSolution('1', challenge).valid).toBe(false);
  });
});
