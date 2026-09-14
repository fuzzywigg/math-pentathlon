/**
 * Wave 35 — createInteractiveGraph hover null on leave leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createCircularGraph,
  createInteractiveGraph,
  type GraphBoard,
} from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 35 graph-ui-hover — leave clears hover', () => {
  it('mouseenter then mouseleave emits id then null', () => {
    const graph = createCircularGraph(4);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const clicks: string[] = [];
    const hovers: Array<string | null> = [];
    const el = createInteractiveGraph(
      board,
      (id) => clicks.push(id),
      (id) => hovers.push(id)
    );
    document.body.appendChild(el);
    const node = el.querySelector('.graph-node') as SVGElement;
    expect(node).toBeTruthy();
    node.dispatchEvent(new Event('mouseenter'));
    node.dispatchEvent(new Event('mouseleave'));
    node.dispatchEvent(new Event('click'));
    expect(hovers[0]).toBe(node.dataset.nodeId);
    expect(hovers[1]).toBeNull();
    expect(clicks).toEqual([node.dataset.nodeId]);
  });
});
