/**
 * Overnight HEAVY leftover after #280 — createInteractiveGraph mouseleave null.
 * Opposite of wave58 hover-enter leftover. Tests-only.
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

describe('Wave 59 core graph-ui — interactive hover leave', () => {
  it('mouseleave on a node fires onNodeHover(null)', () => {
    const graph = createTrackGraph(2);
    const board: GraphBoard = { graph, nodeStates: new Map() };
    const onClick = vi.fn();
    const onHover = vi.fn();
    const el = createInteractiveGraph(board, onClick, onHover);
    document.body.appendChild(el);
    const node = el.querySelector(
      'circle[data-node-id="t0"]'
    ) as SVGCircleElement;
    node.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(onHover).toHaveBeenCalledWith(null);
    expect(onClick).not.toHaveBeenCalled();
  });
});
