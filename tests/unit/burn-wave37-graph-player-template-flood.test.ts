/**
 * Wave 37 — player region/connect/longest-path on template graphs.
 * Distinct from wave 34 small exhaustives. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGridGraph,
  createTrackGraph,
  createStarGraph,
  createCircularGraph,
  createHexLatticeGraph,
  findPlayerRegion,
  findAllPlayerRegions,
  playerConnectsSets,
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

describe('Wave 37 graph-player — grid corridor floods', () => {
  it('row ownership forms one region; column check connects left-right', () => {
    const g = createGridGraph(3, 4);
    const owners: Record<string, number> = {};
    for (let c = 0; c < 4; c++) owners[`1-${c}`] = 1;
    const board = boardFrom(g, owners);
    const region = findPlayerRegion(board, '1-0', 1);
    expect(region.sort()).toEqual(['1-0', '1-1', '1-2', '1-3'].sort());
    expect(findAllPlayerRegions(board, 1)).toHaveLength(1);
    expect(
      playerConnectsSets(board, 1, ['1-0'], ['1-3'])
    ).toBe(true);
  });

  it('broken middle cell splits regions and blocks connect', () => {
    const g = createGridGraph(1, 5);
    const board = boardFrom(g, {
      '0-0': 1,
      '0-1': 1,
      '0-3': 1,
      '0-4': 1,
    });
    expect(findAllPlayerRegions(board, 1)).toHaveLength(2);
    expect(playerConnectsSets(board, 1, ['0-0'], ['0-4'])).toBe(false);
    expect(findLongestPlayerPath(board, 1)).toHaveLength(2);
  });

  it('full 3x3 ownership longest path length is 9', () => {
    const g = createGridGraph(3, 3);
    const owners: Record<string, number> = {};
    for (const id of g.nodes.keys()) owners[id] = 1;
    expect(findLongestPlayerPath(boardFrom(g, owners), 1)).toHaveLength(9);
  });
});

describe('Wave 37 graph-player — star / circle / hex ownership', () => {
  it('star leaf-only ownership never connects distinct leaves', () => {
    const g = createStarGraph(6);
    const owners: Record<string, number> = {};
    for (let i = 0; i < 6; i++) owners[`n${i}`] = 1;
    const board = boardFrom(g, owners);
    expect(findAllPlayerRegions(board, 1)).toHaveLength(6);
    expect(playerConnectsSets(board, 1, ['n0'], ['n3'])).toBe(false);
  });

  it('star with center connects any leaf pair', () => {
    const g = createStarGraph(5);
    const owners: Record<string, number> = { center: 1 };
    for (let i = 0; i < 5; i++) owners[`n${i}`] = 1;
    const board = boardFrom(g, owners);
    expect(playerConnectsSets(board, 1, ['n0'], ['n4'])).toBe(true);
    expect(findAllPlayerRegions(board, 1)).toHaveLength(1);
  });

  it('circular half-arc ownership connects endpoints along the arc', () => {
    const g = createCircularGraph(8);
    const owners: Record<string, number> = {};
    for (let i = 0; i <= 4; i++) owners[`n${i}`] = 1;
    const board = boardFrom(g, owners);
    expect(playerConnectsSets(board, 1, ['n0'], ['n4'])).toBe(true);
    expect(findLongestPlayerPath(board, 1)).toHaveLength(5);
  });

  it('hex ring-1 full ownership is one region; diameter path length 3', () => {
    const g = createHexLatticeGraph(1);
    const owners: Record<string, number> = {};
    for (const id of g.nodes.keys()) owners[id] = 1;
    const board = boardFrom(g, owners);
    expect(findAllPlayerRegions(board, 1)).toHaveLength(1);
    expect(findLongestPlayerPath(board, 1).length).toBeGreaterThanOrEqual(3);
  });
});

describe('Wave 37 graph-player — track end-to-end connect', () => {
  it('full track connects ends; missing middle does not', () => {
    const g = createTrackGraph(6);
    const full: Record<string, number> = {};
    for (const id of g.nodes.keys()) full[id] = 2;
    expect(playerConnectsSets(boardFrom(g, full), 2, ['t0'], ['t5'])).toBe(
      true
    );

    const gap = { ...full };
    delete gap['t3'];
    expect(playerConnectsSets(boardFrom(g, gap), 2, ['t0'], ['t5'])).toBe(
      false
    );
  });

  it('wrong player id never connects even on full ownership', () => {
    const g = createTrackGraph(4);
    const owners: Record<string, number> = {
      t0: 1,
      t1: 1,
      t2: 1,
      t3: 1,
    };
    expect(playerConnectsSets(boardFrom(g, owners), 2, ['t0'], ['t3'])).toBe(
      false
    );
  });
});
