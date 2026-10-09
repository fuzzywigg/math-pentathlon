/**
 * Overnight TOKENMAXX — deep-import exports smoke for graph + hex cores.
 * Avoids dice/frac/fab/pinball. Tests-only. After #214/#215.
 * (Former barrel imports rewritten for q-mp-104.)
 */
import { describe, it, expect } from 'vitest';
import * as graphTypes from '../../src/core/graph/types';
import * as graphAlgos from '../../src/core/graph/algorithms';
import * as graphUi from '../../src/core/graph/graph-ui';
import * as hexTypes from '../../src/core/hex/types';
import * as hexCoords from '../../src/core/hex/coordinates';
import * as hexUi from '../../src/core/hex/hex-ui';

const graph = { ...graphTypes, ...graphAlgos, ...graphUi };
const hex = { ...hexTypes, ...hexCoords, ...hexUi };

describe('Overnight core handshake — graph/hex exports', () => {
  it('graph modules expose algos, templates, and ui', () => {
    expect(typeof graph.bfs).toBe('function');
    expect(typeof graph.dijkstra).toBe('function');
    expect(typeof graph.createGridGraph).toBe('function');
    expect(typeof graph.renderGraph).toBe('function');
    expect(typeof graph.injectGraphStyles).toBe('function');
    expect(graph.DEFAULT_GRAPH_CONFIG.nodeRadius).toBeGreaterThan(0);
  });

  it('hex modules expose coords, types, and ui', () => {
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
