/**
 * Overnight HEAVY leftover after #234 — playerConnectsSets blocked by foe-owned corridor.
 * Distinct from overnight-core-graph-player-shared-endpoint / player-region-wrong-start. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { playerConnectsSets } from '../../src/core/graph/algorithms';
import type { Graph, GraphBoard, NodeState } from '../../src/core/graph/types';

describe('Wave 52 core graph — connect foe block', () => {
  it('P1 owns ends but P2 middle → connects false', () => {
    const graph: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['m', { id: 'm', position: { x: 1, y: 0 } }],
        ['b', { id: 'b', position: { x: 2, y: 0 } }],
      ]),
      directed: false,
      edges: [
        { from: 'a', to: 'm', weight: 1 },
        { from: 'm', to: 'b', weight: 1 },
      ],
    };
    const nodeStates = new Map<string, NodeState>([
      ['a', { owner: 1 }],
      ['m', { owner: 2 }],
      ['b', { owner: 1 }],
    ]);
    const board: GraphBoard = { graph, nodeStates };
    expect(playerConnectsSets(board, 1, ['a'], ['b'])).toBe(false);
  });
});
