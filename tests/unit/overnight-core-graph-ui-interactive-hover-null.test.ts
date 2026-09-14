/**
 * Overnight TOKENMAXX — createInteractiveGraph mouseleave hovers null.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInteractiveGraph } from '../../src/core/graph/graph-ui';
import { createTrackGraph, type GraphBoard } from '../../src/core/graph/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core graph-ui — interactive hover null', () => {
  it('click + enter + leave sequence', () => {
    const board: GraphBoard = {
      graph: createTrackGraph(3),
      nodeStates: new Map(),
    };
    const clicks: string[] = [];
    const hovers: Array<string | null> = [];
    const el = createInteractiveGraph(
      board,
      (id) => clicks.push(id),
      (id) => hovers.push(id)
    );
    document.body.appendChild(el);
    const node = el.querySelector('.graph-node') as SVGElement;
    node.dispatchEvent(new Event('click'));
    node.dispatchEvent(new Event('mouseenter'));
    node.dispatchEvent(new Event('mouseleave'));
    expect(clicks).toEqual([node.dataset.nodeId]);
    expect(hovers[0]).toBe(node.dataset.nodeId);
    expect(hovers[1]).toBeNull();
  });
});
