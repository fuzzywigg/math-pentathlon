/**
 * Overnight HEAVY leftover after #229 — Pent interaction click/hover callbacks. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';

describe('Wave 50 pent — click/hover', () => {
  it('fires onCellClick and onCellHover enter/leave', () => {
    const onClick = vi.fn();
    const onHover = vi.fn();
    const svg = renderBoard(createInitialState(), onClick, onHover);
    const cell = svg.querySelector('.interaction [data-row="2"][data-col="3"]') as SVGElement;
    expect(cell).toBeTruthy();
    cell.dispatchEvent(new Event('click'));
    expect(onClick).toHaveBeenCalledWith({ row: 2, col: 3 });
    cell.dispatchEvent(new Event('mouseenter'));
    expect(onHover).toHaveBeenCalledWith({ row: 2, col: 3 });
    cell.dispatchEvent(new Event('mouseleave'));
    expect(onHover).toHaveBeenCalledWith(null);
  });
});
