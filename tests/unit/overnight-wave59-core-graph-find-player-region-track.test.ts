/**
 * Overnight HEAVY leftover after #280 — findPlayerRegion contiguous track.
 * Distinct from wave58 regions-empty-player leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createTrackGraph,
  findPlayerRegion,
  type GraphBoard,
} from '../../src/core/graph';

describe('Wave 59 core graph — find player region track', () => {
  it('returns owned contiguous segment from mid start', () => {
    const graph = createTrackGraph(5);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([
        ['t1', { owner: 1 }],
        ['t2', { owner: 1 }],
        ['t3', { owner: 1 }],
        ['t4', { owner: 2 }],
      ]),
    };
    const region = findPlayerRegion(board, 't2', 1);
    expect(region.sort()).toEqual(['t1', 't2', 't3']);
  });
});
