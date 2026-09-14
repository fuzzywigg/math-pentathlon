/**
 * Overnight TOKENMAXX — barrel exports smoke for graph + hex cores.
 * Avoids dice/frac/fab/pinball. Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import * as graph from '../../src/core/graph';
import * as hex from '../../src/core/hex';

describe('Overnight core handshake — graph/hex exports', () => {
  it('graph barrel exposes algos, templates, and ui', () => {
    expect(typeof graph.bfs).toBe('function');
    expect(typeof graph.dijkstra).toBe('function');
    expect(typeof graph.createGridGraph).toBe('function');
    expect(typeof graph.renderGraph).toBe('function');
    expect(typeof graph.injectGraphStyles).toBe('function');
    expect(graph.DEFAULT_GRAPH_CONFIG.nodeRadius).toBeGreaterThan(0);
  });

  it('hex barrel exposes coords, types, and ui', () => {
    expect(typeof hex.hexDistance).toBe('function');
    expect(typeof hex.hexRing).toBe('function');
    expect(typeof hex.createAxial).toBe('function');
    expect(typeof hex.renderHexGrid).toBe('function');
    expect(typeof hex.injectHexStyles).toBe('function');
    expect(hex.AXIAL_DIRECTIONS).toHaveLength(6);
  });

  it('tiny coexistence: grid BFS + hex spiral', () => {
    const g = graph.createTrackGraph(3);
    expect(graph.bfs(g, 't0', 't2').distance).toBe(2);
    expect(hex.hexSpiral(hex.createAxial(0, 0), 1)).toHaveLength(7);
  });
});
