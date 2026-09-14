/**
 * Overnight HEAVY leftover after #274 — interactive board cell click callback.
 * Distinct from wave55 mouseleave-null leftover. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createBoard,
  createInteractiveBoard,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 core poly-ui — interactive click cell', () => {
  it('clicking a grid rect fires onCellClick with row/col', () => {
    const onClick = vi.fn();
    const onHover = vi.fn();
    const el = createInteractiveBoard(
      createBoard(3, 3),
      SIMPLE_SHAPES.slice(0, 1),
      onClick,
      onHover
    );
    document.body.appendChild(el);
    const cell = el.querySelector(
      'rect[data-row="1"][data-col="2"]'
    ) as SVGRectElement;
    expect(cell).toBeTruthy();
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledWith({ row: 1, col: 2 });
  });
});
