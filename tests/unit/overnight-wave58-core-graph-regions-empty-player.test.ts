/**
 * Overnight HEAVY leftover after #274 — findAllPlayerRegions for absent owner.
 * Distinct from overnight-core wrong-start length. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createTrackGraph,
  findAllPlayerRegions,
  type GraphBoard,
} from '../../src/core/graph';

describe('Wave 58 core graph — regions empty player', () => {
  it('player 9 with no owned nodes returns []', () => {
    const board: GraphBoard = {
      graph: createTrackGraph(3),
      nodeStates: new Map([
        ['t0', { owner: 1 }],
        ['t1', { owner: 2 }],
      ]),
    };
    expect(findAllPlayerRegions(board, 9)).toEqual([]);
  });
});
