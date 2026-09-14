/**
 * Overnight HEAVY leftover after #274 — createInteractiveGraph mouseenter fires id.
 * Distinct from wave57 click-only leftover. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createTrackGraph,
  createInteractiveGraph,
  type GraphBoard,
} from '../../src/core/graph';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 core graph-ui — interactive hover enter', () => {
  it('mouseenter on a node fires onNodeHover with id', () => {
    const graph = createTrackGraph(2);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const onClick = vi.fn();
    const onHover = vi.fn();
    const el = createInteractiveGraph(board, onClick, onHover);
    document.body.appendChild(el);
    const node = el.querySelector(
      'circle[data-node-id="t0"]'
    ) as SVGCircleElement;
    node.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(onHover).toHaveBeenCalledWith('t0');
    expect(onClick).not.toHaveBeenCalled();
  });
});
