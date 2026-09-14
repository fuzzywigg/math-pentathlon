/**
 * Overnight HEAVY leftover after #280 — findLongestPlayerPath on owned chain.
 * Distinct from wave58 find-reachable-leaf leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createTrackGraph,
  findLongestPlayerPath,
  type GraphBoard,
} from '../../src/core/graph';

describe('Wave 59 core graph — longest path line', () => {
  it('owned track chain length equals longest path', () => {
    const graph = createTrackGraph(4);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([
        ['t0', { owner: 1 }],
        ['t1', { owner: 1 }],
        ['t2', { owner: 1 }],
      ]),
    };
    expect(findLongestPlayerPath(board, 1)).toHaveLength(3);
  });
});
