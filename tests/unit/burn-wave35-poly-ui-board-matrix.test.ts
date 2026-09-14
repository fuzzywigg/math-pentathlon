/**
 * Wave 35 — renderBoard occupancy / missing-shape / grid leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  SIMPLE_SHAPES,
  createBoard,
  placePolyomino,
  renderBoard,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
const trominoI = SIMPLE_SHAPES.find((s) => s.id === 'tromino-I')!;

describe('Wave 35 poly-ui-board — empty / filled / multi-placement', () => {
  it('empty board: 1 bg + rows*cols grid rects', () => {
    const board = createBoard(4, 3);
    const svg = renderBoard(board, [], { cellSize: 8, padding: 1 });
    expect(svg.classList.contains('polyomino-board')).toBe(true);
    expect(svg.querySelectorAll('rect')).toHaveLength(1 + 4 * 3);
    expect(svg.querySelector('[data-row="3"][data-col="2"]')).toBeTruthy();
    expect(svg.getAttribute('width')).toBe(String(3 * 8 + 2));
    expect(svg.getAttribute('height')).toBe(String(4 * 8 + 2));
  });

  it('occupied cells use #e0e0e0 fill on grid layer', () => {
    let board = createBoard(2, 2);
    board = placePolyomino(board, mono, { row: 0, col: 1 });
    const svg = renderBoard(board, [mono], { cellSize: 10, padding: 0 });
    const cell = svg.querySelector(
      '[data-row="0"][data-col="1"]'
    ) as SVGRectElement;
    expect(cell.getAttribute('fill')).toBe('#e0e0e0');
    const empty = svg.querySelector(
      '[data-row="1"][data-col="0"]'
    ) as SVGRectElement;
    expect(empty.getAttribute('fill')).toBe('#fff');
  });

  it('placed shapes overlay colored rects when shapes catalog provided', () => {
    let board = createBoard(3, 3);
    board = placePolyomino(board, mono, { row: 1, col: 1 });
    board = placePolyomino(board, mono, { row: 0, col: 0 });
    const withShapes = renderBoard(board, [mono], { cellSize: 10, padding: 0 });
    // bg + 9 grid + 2 overlays
    expect(withShapes.querySelectorAll('rect').length).toBe(1 + 9 + 2);

    const missingCatalog = renderBoard(board, [], { cellSize: 10, padding: 0 });
    // placement skipped when shape not found → bg + 9 only
    expect(missingCatalog.querySelectorAll('rect').length).toBe(1 + 9);
  });

  it('domino placement overlays two colored cells', () => {
    let board = createBoard(2, 3);
    board = placePolyomino(board, domino, { row: 0, col: 0 });
    const svg = renderBoard(board, [domino], { cellSize: 12, padding: 0 });
    const colored = [...svg.querySelectorAll('rect')].filter(
      (r) => r.getAttribute('fill') === domino.color
    );
    expect(colored).toHaveLength(2);
  });

  it('background rect spans full svg', () => {
    const board = createBoard(2, 2);
    const svg = renderBoard(board, [], { cellSize: 15, padding: 3 });
    const bg = svg.querySelector('rect')!;
    expect(bg.getAttribute('fill')).toBe('#f5f5f5');
    expect(bg.getAttribute('width')).toBe(svg.getAttribute('width'));
    expect(bg.getAttribute('height')).toBe(svg.getAttribute('height'));
  });

  it('tromino-I vertical placement still renders three overlays', () => {
    let board = createBoard(4, 2);
    board = placePolyomino(board, trominoI, { row: 0, col: 0 }, 90);
    const svg = renderBoard(board, [trominoI], { cellSize: 10, padding: 0 });
    const overlays = [...svg.querySelectorAll('rect')].filter(
      (r) => r.getAttribute('fill') === trominoI.color
    );
    expect(overlays.length).toBe(3);
  });
});
