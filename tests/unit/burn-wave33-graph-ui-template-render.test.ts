/**
 * Wave 33 — each topology template renders matching node/edge counts.
 * Cross-cuts wave 27 topology invariants with graph-ui. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createCircularGraph,
  createCompleteGraph,
  createGridGraph,
  createHexLatticeGraph,
  createStarGraph,
  createTrackGraph,
  type Graph,
} from '../../src/core/graph/types';
import { renderGraph } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

function assertRenderCounts(graph: Graph): void {
  const svg = renderGraph(graph, undefined, {
    showLabels: false,
    showWeights: false,
  });
  expect(svg.querySelectorAll('.graph-node')).toHaveLength(graph.nodes.size);
  expect(svg.querySelectorAll('.edges line')).toHaveLength(graph.edges.length);
  expect(svg.classList.contains('graph-view')).toBe(true);
  expect(svg.querySelector('.edges')).toBeTruthy();
  expect(svg.querySelector('.nodes')).toBeTruthy();
}

describe('Wave 33 graph-ui-template-render — topology × DOM counts', () => {
  it('track lengths 1..8', () => {
    for (let n = 1; n <= 8; n++) {
      assertRenderCounts(createTrackGraph(n));
    }
  });

  it('star outer counts 1..7', () => {
    for (let n = 1; n <= 7; n++) {
      assertRenderCounts(createStarGraph(n));
    }
  });

  it('circular n=3..10', () => {
    for (let n = 3; n <= 10; n++) {
      assertRenderCounts(createCircularGraph(n));
    }
  });

  it('grid sizes 1×1 through 4×3', () => {
    for (let r = 1; r <= 4; r++) {
      for (let c = 1; c <= 3; c++) {
        assertRenderCounts(createGridGraph(r, c));
      }
    }
  });

  it('complete graphs n=4..6 denser than circular; n=3 equals ring', () => {
    // createCompleteGraph(3) adds no chords (only the skip of the existing ring edge)
    expect(createCompleteGraph(3).edges.length).toBe(
      createCircularGraph(3).edges.length
    );
    assertRenderCounts(createCompleteGraph(3));
    for (let n = 4; n <= 6; n++) {
      const complete = createCompleteGraph(n);
      const circular = createCircularGraph(n);
      expect(complete.edges.length).toBeGreaterThan(circular.edges.length);
      assertRenderCounts(complete);
    }
  });

  it('hex lattice rings 0..2', () => {
    for (let rings = 0; rings <= 2; rings++) {
      assertRenderCounts(createHexLatticeGraph(rings));
    }
  });
});
