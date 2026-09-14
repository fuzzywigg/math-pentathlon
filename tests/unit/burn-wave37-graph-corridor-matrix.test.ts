/**
 * Wave 37 — graph playerConnectsSets corridor matrix on grids.
 * Beyond wave 34 corridor smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGridGraph,
  playerConnectsSets,
  findAllPlayerRegions,
  findLongestPlayerPath,
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

describe('Wave 37 graph-corridor — left-right / top-bottom connects', () => {
  it('full middle row connects left edge to right edge', () => {
    const g = createGridGraph(5, 5);
    const owners: Record<string, number> = {};
    for (let c = 0; c < 5; c++) owners[`2-${c}`] = 1;
    const left = ['2-0'];
    const right = ['2-4'];
    expect(playerConnectsSets(boardFrom(g, owners), 1, left, right)).toBe(true);
  });

  it('column corridor connects top to bottom', () => {
    const g = createGridGraph(4, 4);
    const owners: Record<string, number> = {};
    for (let r = 0; r < 4; r++) owners[`${r}-1`] = 2;
    expect(
      playerConnectsSets(boardFrom(g, owners), 2, ['0-1'], ['3-1'])
    ).toBe(true);
    expect(findLongestPlayerPath(boardFrom(g, owners), 2)).toHaveLength(4);
  });

  it('diagonal-only ownership does not connect (4-way graph)', () => {
    const g = createGridGraph(3, 3);
    const board = boardFrom(g, {
      '0-0': 1,
      '1-1': 1,
      '2-2': 1,
    });
    expect(findAllPlayerRegions(board, 1)).toHaveLength(3);
    expect(playerConnectsSets(board, 1, ['0-0'], ['2-2'])).toBe(false);
  });

  it.each([
    [true, [0, 1, 2, 3, 4]],
    [false, [0, 1, 3, 4]], // gap at col 2
  ] as const)(
    'row connect=%s for owned cols %j',
    (expected, cols) => {
      const g = createGridGraph(1, 5);
      const owners: Record<string, number> = {};
      for (const c of cols) owners[`0-${c}`] = 1;
      expect(
        playerConnectsSets(boardFrom(g, owners), 1, ['0-0'], ['0-4'])
      ).toBe(expected);
    }
  );
});
