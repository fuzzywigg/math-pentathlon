/**
 * Wave 33 — graph-ui showLabels / showWeights / value indicators.
 * Deepens wave 22 (showWeights:false only) into toggle matrix.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createCircularGraph,
  createTrackGraph,
  type Graph,
  type GraphEdge,
  type NodeState,
} from '../../src/core/graph/types';
import { renderGraph } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

function weightedTrack(): Graph {
  const graph = createTrackGraph(3, 60);
  graph.edges = graph.edges.map(
    (e, i): GraphEdge => ({ ...e, weight: (i + 1) * 10 })
  );
  return graph;
}

describe('Wave 33 graph-ui-labels — labels × weights × values', () => {
  it('showLabels true draws node labels; false omits them', () => {
    const graph = createCircularGraph(4);
    const withLabels = renderGraph(graph, undefined, { showLabels: true });
    // each node has a label → one text per node in nodes group (no weights)
    expect(withLabels.querySelectorAll('.nodes text')).toHaveLength(4);
    expect(
      [...withLabels.querySelectorAll('.nodes text')].map((t) => t.textContent)
    ).toEqual(['1', '2', '3', '4']);

    const noLabels = renderGraph(graph, undefined, { showLabels: false });
    expect(noLabels.querySelectorAll('.nodes text')).toHaveLength(0);
  });

  it('showWeights true emits mid-edge weight text for every weighted edge', () => {
    const graph = weightedTrack();
    const svg = renderGraph(graph, undefined, {
      showWeights: true,
      showLabels: false,
    });
    const weightTexts = [...svg.querySelectorAll('.edges text')].map(
      (t) => t.textContent
    );
    expect(weightTexts.sort()).toEqual(['10', '20']);

    const off = renderGraph(graph, undefined, {
      showWeights: false,
      showLabels: false,
    });
    expect(off.querySelectorAll('.edges text')).toHaveLength(0);
  });

  it('state.value renders a secondary value text under the node', () => {
    const graph = createTrackGraph(2);
    const states = new Map<string, NodeState>([
      ['t0', { value: 7 }],
      ['t1', { value: 42, owner: 1 }],
    ]);
    const svg = renderGraph(graph, states, { showLabels: false });
    const values = [...svg.querySelectorAll('.nodes text')].map(
      (t) => t.textContent
    );
    expect(values.sort()).toEqual(['42', '7']);
  });

  it('owned label fill is white; unowned label fill is #333', () => {
    const graph = createCircularGraph(2);
    // n=2 does not close ring (n>2 required) — still has labels
    const states = new Map<string, NodeState>([['n0', { owner: 1 }]]);
    const svg = renderGraph(graph, states, { showLabels: true });
    const owned = svg.querySelectorAll('.nodes text')[0];
    const free = svg.querySelectorAll('.nodes text')[1];
    // order follows Map insertion: n0 then n1
    expect(owned?.getAttribute('fill')).toBe('white');
    expect(free?.getAttribute('fill')).toBe('#333');
  });
});
