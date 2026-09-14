/**
 * Wave 33 — createInteractiveGraph click/hover matrix across templates.
 * Deepens wave 22 single-star interactive smoke. Tests-only.
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
  type GraphBoard,
  type NodeId,
} from '../../src/core/graph/types';
import { createInteractiveGraph } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

function boardOf(graph: Graph): GraphBoard {
  return { graph, nodeStates: new Map() };
}

describe('Wave 33 graph-ui-interactive — template click matrix', () => {
  const factories: Array<[string, () => Graph]> = [
    ['track', () => createTrackGraph(4)],
    ['star', () => createStarGraph(3)],
    ['circular', () => createCircularGraph(5)],
    ['grid', () => createGridGraph(2, 2)],
    ['complete', () => createCompleteGraph(3)],
    ['hex', () => createHexLatticeGraph(1)],
  ];

  it('every template wires pointer cursor and fires click + hover once', () => {
    for (const [, factory] of factories) {
      const graph = factory();
      const clicks: NodeId[] = [];
      const hovers: Array<NodeId | null> = [];
      const el = createInteractiveGraph(
        boardOf(graph),
        (id) => clicks.push(id),
        (id) => hovers.push(id)
      );
      expect(el.classList.contains('graph-container')).toBe(true);
      const nodes = el.querySelectorAll('.graph-node') as NodeListOf<SVGElement>;
      expect(nodes.length).toBe(graph.nodes.size);

      const first = nodes[0];
      const id = first.dataset.nodeId!;
      expect(first.style.cursor).toBe('pointer');
      first.dispatchEvent(new Event('click'));
      first.dispatchEvent(new Event('mouseenter'));
      first.dispatchEvent(new Event('mouseleave'));
      expect(clicks).toEqual([id]);
      expect(hovers).toEqual([id, null]);
      clicks.length = 0;
      hovers.length = 0;
    }
  });

  it('clicking every node on a track records each id exactly once', () => {
    const graph = createTrackGraph(5);
    const clicks: NodeId[] = [];
    const el = createInteractiveGraph(boardOf(graph), (id) => clicks.push(id), () => {});
    el.querySelectorAll('.graph-node').forEach((n) => {
      n.dispatchEvent(new Event('click'));
    });
    expect(clicks.sort()).toEqual(['t0', 't1', 't2', 't3', 't4']);
  });
});
