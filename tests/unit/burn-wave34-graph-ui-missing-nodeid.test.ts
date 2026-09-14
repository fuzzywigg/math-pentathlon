/**
 * Wave 34 — graph-ui interactive early-return when data-node-id missing.
 * Injects a stray .graph-node without id after render wiring baseline.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createTrackGraph,
  type GraphBoard,
  type NodeId,
} from '../../src/core/graph/types';
import { createInteractiveGraph } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 34 graph-ui-missing-nodeid — interactive wiring', () => {
  it('baseline track clicks still fire after an anonymous node is injected', () => {
    const graph = createTrackGraph(3);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const clicks: NodeId[] = [];
    const el = createInteractiveGraph(
      board,
      (id) => clicks.push(id),
      () => {}
    );
    const svg = el.querySelector('svg')!;
    const stray = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    stray.classList.add('graph-node');
    // intentionally no data-node-id
    svg.querySelector('.nodes')?.appendChild(stray);

    // Re-bind would skip; existing listeners still work
    const t0 = el.querySelector(
      'circle[data-node-id="t0"]'
    ) as SVGElement;
    t0.dispatchEvent(new Event('click'));
    expect(clicks).toEqual(['t0']);

    stray.dispatchEvent(new Event('click'));
    expect(clicks).toEqual(['t0']);
  });
});
