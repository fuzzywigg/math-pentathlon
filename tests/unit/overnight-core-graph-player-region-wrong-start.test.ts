/**
 * Overnight TOKENMAXX — findPlayerRegion returns [] when start is wrong owner.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { findPlayerRegion, findAllPlayerRegions } from '../../src/core/graph/algorithms';
import { createTrackGraph, type GraphBoard } from '../../src/core/graph/types';

describe('Overnight core graph — region wrong start', () => {
  it('start owned by other player → empty region', () => {
    const board: GraphBoard = {
      graph: createTrackGraph(4),
      nodeStates: new Map([
        ['t0', { owner: 1 }],
        ['t1', { owner: 1 }],
        ['t2', { owner: 2 }],
        ['t3', { owner: 2 }],
      ]),
    };
    expect(findPlayerRegion(board, 't2', 1)).toEqual([]);
    expect(findPlayerRegion(board, 't0', 2)).toEqual([]);
    expect(findPlayerRegion(board, 't0', 1).sort()).toEqual(['t0', 't1']);
    expect(findAllPlayerRegions(board, 1)).toHaveLength(1);
    expect(findAllPlayerRegions(board, 2)).toHaveLength(1);
  });

  it('unowned start → empty', () => {
    const board: GraphBoard = {
      graph: createTrackGraph(2),
      nodeStates: new Map([['t0', { owner: 1 }]]),
    };
    expect(findPlayerRegion(board, 't1', 1)).toEqual([]);
  });
});
