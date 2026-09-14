/**
 * Overnight TOKENMAXX — findLongestPlayerPath on forked ownership.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { findLongestPlayerPath, findAllPlayerRegions } from '../../src/core/graph/algorithms';
import { createStarGraph, type GraphBoard } from '../../src/core/graph/types';

describe('Overnight core graph — longest fork', () => {
  it('empty ownership → empty longest path', () => {
    const board: GraphBoard = {
      graph: createStarGraph(3),
      nodeStates: new Map(),
    };
    expect(findLongestPlayerPath(board, 1)).toEqual([]);
    expect(findAllPlayerRegions(board, 1)).toEqual([]);
  });

  it('star: center+two leaves owned → longest length 3 (leaf-center-leaf)', () => {
    const graph = createStarGraph(4);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([
        ['center', { owner: 1 }],
        ['n0', { owner: 1 }],
        ['n2', { owner: 1 }],
        ['n1', { owner: 2 }],
      ]),
    };
    const longest = findLongestPlayerPath(board, 1);
    expect(longest).toHaveLength(3);
    expect(longest).toContain('center');
    expect(longest.filter((n) => n.startsWith('n'))).toHaveLength(2);
    expect(findAllPlayerRegions(board, 1)).toHaveLength(1);
    expect(findAllPlayerRegions(board, 2)).toHaveLength(1);
  });

  it('wrong-owner start region is empty; longest ignores other player', () => {
    const graph = createStarGraph(2);
    const board: GraphBoard = {
      graph,
      nodeStates: new Map([
        ['center', { owner: 1 }],
        ['n0', { owner: 1 }],
      ]),
    };
    expect(findLongestPlayerPath(board, 2)).toEqual([]);
  });
});
