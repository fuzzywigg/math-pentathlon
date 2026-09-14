/**
 * Wave 39 — graph empty player sets leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGridGraph,
  playerConnectsSets,
  findLongestPlayerPath,
  findAllPlayerRegions,
  type GraphBoard,
} from '../../src/core/graph';

function emptyBoard(): GraphBoard {
  return {
    graph: createGridGraph(2, 2),
    nodeStates: new Map(),
  };
}

describe('Wave 39 graph — player empty sets', () => {
  it('empty setA/setB never connect', () => {
    const board = emptyBoard();
    expect(playerConnectsSets(board, 1, [], [])).toBe(false);
    expect(playerConnectsSets(board, 1, ['0-0'], [])).toBe(false);
    expect(playerConnectsSets(board, 1, [], ['0-1'])).toBe(false);
  });

  it('empty ownership → longest path [] and regions []', () => {
    const board = emptyBoard();
    expect(findLongestPlayerPath(board, 1)).toEqual([]);
    expect(findAllPlayerRegions(board, 1)).toEqual([]);
  });
});
