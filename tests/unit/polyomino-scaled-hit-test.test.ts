import { describe, it, expect } from 'vitest';
import { createBoard } from '../../src/core/polyomino/placement';
import {
  getCellFromMouseEvent,
  renderBoard,
} from '../../src/core/polyomino/polyomino-ui';

describe('polyomino getCellFromMouseEvent under CSS scale', () => {
  it('maps the same cell when the SVG is drawn at 50% CSS size', () => {
    const board = createBoard(3, 3);
    const svg = renderBoard(board, [], { cellSize: 20, padding: 4 });
    // Intrinsic viewBox is 68×68; CSS rect is half that.
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 34, height: 34 }),
    });

    // Cell (1,2) center in user units: x=4+40+10=54, y=4+20+10=34
    // At 50% CSS: client (27, 17)
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 27, clientY: 17 }),
        svg,
        { cellSize: 20, padding: 4 }
      )
    ).toEqual({ row: 1, col: 2 });
  });

  it('still maps 1:1 when CSS size matches viewBox', () => {
    const board = createBoard(3, 3);
    const svg = renderBoard(board, [], { cellSize: 20, padding: 4 });
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 10, top: 10, width: 68, height: 68 }),
    });
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 55, clientY: 35 }),
        svg,
        { cellSize: 20, padding: 4 }
      )
    ).toEqual({ row: 1, col: 2 });
  });
});
