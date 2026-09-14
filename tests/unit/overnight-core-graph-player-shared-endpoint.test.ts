/**
 * Overnight TOKENMAXX — playerConnectsSets when setA∩setB share an owned node.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import {
  playerConnectsSets,
  findLongestPlayerPath,
  findPlayerRegion,
} from '../../src/core/graph/algorithms';
import { createTrackGraph, createGridGraph, type GraphBoard } from '../../src/core/graph/types';

describe('Overnight core graph — shared endpoint connect', () => {
  it('single owned node in both sets connects', () => {
    const graph = createTrackGraph(1);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([['t0', { owner: 1 }]]),
    };
    expect(playerConnectsSets(board, 1, ['t0'], ['t0'])).toBe(true);
    expect(findLongestPlayerPath(board, 1)).toEqual(['t0']);
    expect(findPlayerRegion(board, 't0', 1)).toEqual(['t0']);
  });

  it('unowned shared id does not connect', () => {
    const graph = createTrackGraph(3);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([
        ['t0', { owner: 1 }],
        ['t2', { owner: 1 }],
      ]),
    };
    expect(playerConnectsSets(board, 1, ['t1'], ['t1'])).toBe(false);
    expect(playerConnectsSets(board, 1, ['t0'], ['t2'])).toBe(false);
  });

  it('corridor through owned nodes connects distinct endpoint sets', () => {
    const graph = createGridGraph(1, 3);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([
        ['0-0', { owner: 2 }],
        ['0-1', { owner: 2 }],
        ['0-2', { owner: 2 }],
      ]),
    };
    expect(playerConnectsSets(board, 2, ['0-0'], ['0-2'])).toBe(true);
    expect(findLongestPlayerPath(board, 2)).toHaveLength(3);
  });
});
