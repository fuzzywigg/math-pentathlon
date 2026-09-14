/**
 * Wave 34 — playerConnectsSets corridor / block / overlap matrices.
 * Deepens wave 27 player-connect. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  playerConnectsSets,
  createGridGraph,
  createTrackGraph,
  createStarGraph,
  type Graph,
  type GraphBoard,
  type NodeId,
  type NodeState,
} from '../../src/core/graph';

function boardFrom(
  graph: Graph,
  owners: Record<string, number | undefined>
): GraphBoard {
  const nodeStates = new Map<NodeId, NodeState>();
  for (const id of graph.nodes.keys()) {
    const owner = owners[id];
    nodeStates.set(id, owner === undefined ? {} : { owner });
  }
  return { graph, nodeStates };
}

describe('Wave 34 graph-player-connect — corridors', () => {
  it('owns full track ⇒ endpoints connect', () => {
    const g = createTrackGraph(5);
    const owners: Record<string, number> = {};
    for (const id of g.nodes.keys()) owners[id] = 1;
    const board = boardFrom(g, owners);
    expect(playerConnectsSets(board, 1, ['t0'], ['t4'])).toBe(true);
    expect(playerConnectsSets(board, 2, ['t0'], ['t4'])).toBe(false);
  });

  it('gap in the middle breaks connection', () => {
    const g = createTrackGraph(5);
    const board = boardFrom(g, {
      t0: 1,
      t1: 1,
      t2: 2,
      t3: 1,
      t4: 1,
    });
    expect(playerConnectsSets(board, 1, ['t0'], ['t4'])).toBe(false);
    expect(playerConnectsSets(board, 1, ['t0'], ['t1'])).toBe(true);
    expect(playerConnectsSets(board, 1, ['t3'], ['t4'])).toBe(true);
  });

  it('grid: left column to right column via owned middle row', () => {
    const g = createGridGraph(3, 3);
    const owners: Record<string, number | undefined> = {
      '0-0': 1,
      '1-0': 1,
      '2-0': 1,
      '1-1': 1,
      '0-2': 1,
      '1-2': 1,
      '2-2': 1,
    };
    const board = boardFrom(g, owners);
    expect(
      playerConnectsSets(board, 1, ['0-0', '1-0', '2-0'], ['0-2', '1-2', '2-2'])
    ).toBe(true);
    // remove bridge
    owners['1-1'] = undefined;
    const broken = boardFrom(g, owners);
    expect(
      playerConnectsSets(broken, 1, ['0-0', '1-0', '2-0'], ['0-2', '1-2', '2-2'])
    ).toBe(false);
  });

  it('star: leaves connect only through owned center', () => {
    const g = createStarGraph(4);
    const withCenter = boardFrom(g, {
      center: 1,
      n0: 1,
      n1: 1,
      n2: 2,
      n3: 2,
    });
    expect(playerConnectsSets(withCenter, 1, ['n0'], ['n1'])).toBe(true);
    const noCenter = boardFrom(g, { n0: 1, n1: 1 });
    expect(playerConnectsSets(noCenter, 1, ['n0'], ['n1'])).toBe(false);
  });

  it('overlapping setA/setB on same owned node is true', () => {
    const g = createTrackGraph(3);
    const board = boardFrom(g, { t1: 1 });
    expect(playerConnectsSets(board, 1, ['t1'], ['t1'])).toBe(true);
  });
});
