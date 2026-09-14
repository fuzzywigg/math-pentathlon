/**
 * Overnight HEAVY leftover after #250 — renderBoard skips unknown shapeId placements.
 * Distinct from wave53 selector/drag hover chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  createBoard,
  placePolyomino,
  renderBoard,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 core poly-ui — unknown placement skip', () => {
  it('ghost shapeId does not add extra colored rects beyond the grid', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    let board = placePolyomino(createBoard(2, 2), mono, { row: 0, col: 0 });
    board = {
      ...board,
      placements: [
        ...board.placements,
        {
          shapeId: 'not-in-catalog',
          position: { row: 1, col: 1 },
          rotation: 0,
          flipped: false,
        },
      ],
    };
    const svg = renderBoard(board, [mono], { cellSize: 10, padding: 0 });
    document.body.appendChild(svg);
    // 4 grid cells + 1 placed mono (in-bounds overlay) — ghost skipped
    expect(svg.querySelectorAll('rect').length).toBe(1 + 4 + 1);
  });
});
