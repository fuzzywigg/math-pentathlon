/**
 * Overnight HEAVY leftover after #264 — createInteractiveGraph click callback.
 * Distinct from overnight hover-null leftover. Tests-only.
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

describe('Wave 57 core graph-ui — interactive click', () => {
  it('clicking a node fires onNodeClick with id', () => {
    const graph = createTrackGraph(2);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const onClick = vi.fn();
    const onHover = vi.fn();
    const el = createInteractiveGraph(board, onClick, onHover);
    document.body.appendChild(el);
    const node = el.querySelector(
      'circle[data-node-id="t0"]'
    ) as SVGCircleElement;
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledWith('t0');
  });
});
