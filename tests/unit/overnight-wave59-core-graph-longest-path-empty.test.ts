/**
 * Overnight HEAVY leftover after #280 — findLongestPlayerPath with no owners.
 * Distinct from wave58 regions-empty-player leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createTrackGraph,
  findLongestPlayerPath,
  type GraphBoard,
} from '../../src/core/graph';

describe('Wave 59 core graph — longest path empty', () => {
  it('no owned nodes yields empty path', () => {
    const board: GraphBoard = {
      graph: createTrackGraph(3),
      nodeStates: new Map(),
    };
    expect(findLongestPlayerPath(board, 1)).toEqual([]);
  });
});
