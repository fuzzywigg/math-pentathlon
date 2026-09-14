/**
 * Overnight HEAVY leftover after #256 — getCellFromMouseEvent in-bounds cell.
 * Distinct from wave40 negative OOB null. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createBoard,
  renderBoard,
  getCellFromMouseEvent,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 56 core poly-ui — mouse in-bounds cell', () => {
  it('client coords map to row/col with padding', () => {
    const svg = renderBoard(createBoard(4, 4), [], {
      cellSize: 10,
      padding: 2,
    });
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 44, height: 44 }),
    });
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 2 + 15, clientY: 2 + 25 }),
        svg,
        { cellSize: 10, padding: 2 }
      )
    ).toEqual({ row: 2, col: 1 });
  });
});
