/**
 * Overnight TOKENMAXX — findNodesAtDistance beyond diameter is empty;
 * within-distance always includes start.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import {
  findNodesAtDistance,
  findNodesWithinDistance,
} from '../../src/core/graph/algorithms';
import { createTrackGraph, createStarGraph } from '../../src/core/graph/types';

describe('Overnight core graph — far distance empty', () => {
  it('track length 4: distance 10 empty; within 0 is start only', () => {
    const g = createTrackGraph(4);
    expect(findNodesAtDistance(g, 't0', 10)).toEqual([]);
    expect(findNodesWithinDistance(g, 't0', 0)).toEqual(['t0']);
    expect(findNodesAtDistance(g, 't0', 3)).toEqual(['t3']);
  });

  it('star leaves are distance 2 from each other via center', () => {
    const g = createStarGraph(5);
    expect(findNodesAtDistance(g, 'n0', 2).sort()).toEqual(
      ['n1', 'n2', 'n3', 'n4'].sort()
    );
    expect(findNodesAtDistance(g, 'n0', 1)).toEqual(['center']);
  });
});
