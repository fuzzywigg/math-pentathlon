/**
 * Overnight HEAVY leftover after #241 — showValidMoves on an isolated node.
 * Distinct from wave52 owner:0 dash leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderGraph, showValidMoves } from '../../src/core/graph/graph-ui';
import type { Graph, GraphBoard } from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 53 core graph-ui — isolated valid moves', () => {
  it('node with no edges leaves all circles undashed', () => {
    const graph: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 40, y: 0 } }],
      ]),
      directed: false,
      edges: [],
    };
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const svg = renderGraph(graph);
    showValidMoves(svg, graph, 'a', board);
    expect(
      svg.querySelector('circle[data-node-id="b"]')?.getAttribute(
        'stroke-dasharray'
      )
    ).toBeNull();
    expect(
      svg.querySelector('circle[data-node-id="a"]')?.getAttribute(
        'stroke-dasharray'
      )
    ).toBeNull();
  });
});
