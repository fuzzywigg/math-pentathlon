/**
 * Wave 38 — findAllPaths maxDepth cut leftovers.
 * Beyond wave 34 all-paths enumerate. Tests-only.
 * Note: maxDepth compares path.length (node count), so a 2-node hop needs maxDepth>=2.
 */
import { describe, it, expect } from 'vitest';

import {
  createGridGraph,
  createCompleteGraph,
  findAllPaths,
} from '../../src/core/graph';

describe('Wave 38 graph-paths — maxDepth', () => {
  it('maxDepth=0 rejects even the trivial start=end path (length 1)', () => {
    const g = createGridGraph(2, 2);
    expect(findAllPaths(g, '0-0', '0-0', 0)).toEqual([]);
    expect(findAllPaths(g, '0-0', '1-1', 0)).toEqual([]);
  });

  it('maxDepth=1 allows only the trivial start=end singleton', () => {
    const g = createGridGraph(3, 3);
    expect(findAllPaths(g, '1-1', '1-1', 1)).toEqual([
      { nodes: ['1-1'], totalWeight: 0 },
    ]);
    // neighbor hop is path length 2 → cut
    expect(findAllPaths(g, '1-1', '1-2', 1)).toEqual([]);
  });

  it('maxDepth=2 unlocks single-edge neighbor paths', () => {
    const g = createGridGraph(3, 3);
    const paths = findAllPaths(g, '1-1', '1-2', 2);
    expect(paths.length).toBe(1);
    expect(paths[0].nodes).toEqual(['1-1', '1-2']);
    expect(findAllPaths(g, '0-0', '2-2', 2)).toEqual([]);
  });

  it('deeper maxDepth unlocks longer routes on grid', () => {
    const g = createGridGraph(2, 3);
    const shallow = findAllPaths(g, '0-0', '0-2', 3);
    const deep = findAllPaths(g, '0-0', '0-2', 5);
    expect(deep.length).toBeGreaterThanOrEqual(shallow.length);
    expect(
      deep.every((p) => p.nodes[0] === '0-0' && p.nodes.at(-1) === '0-2')
    ).toBe(true);
  });

  it('complete K3 with ample depth enumerates simple paths', () => {
    const g = createCompleteGraph(3);
    const paths = findAllPaths(g, 'n0', 'n2', 3);
    expect(paths.length).toBeGreaterThan(0);
    expect(paths.every((p) => new Set(p.nodes).size === p.nodes.length)).toBe(
      true
    );
  });
});
