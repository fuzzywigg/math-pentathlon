/**
 * Overnight HEAVY leftover after #241 — playerConnectsSets empty setA / unowned starts.
 * Distinct from wave52 foe-blocked corridor. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { playerConnectsSets } from '../../src/core/graph/algorithms';
import { createTrackGraph, type GraphBoard, type NodeState } from '../../src/core/graph/types';

describe('Wave 53 core graph — connects empty sets', () => {
  it('empty setA is false even when player owns the track', () => {
    const graph = createTrackGraph(3);
    const nodeStates = new Map<string, NodeState>([
      ['t0', { owner: 1 }],
      ['t1', { owner: 1 }],
      ['t2', { owner: 1 }],
    ]);
    const board: GraphBoard = { graph, nodeStates };
    expect(playerConnectsSets(board, 1, [], ['t2'])).toBe(false);
    expect(playerConnectsSets(board, 1, ['t0'], [])).toBe(false);
    expect(playerConnectsSets(board, 1, ['ghost'], ['t2'])).toBe(false);
    expect(playerConnectsSets(board, 2, ['t0'], ['t2'])).toBe(false);
  });
});
