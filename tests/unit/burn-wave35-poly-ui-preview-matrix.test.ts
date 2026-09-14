/**
 * Wave 35 — placement preview valid/invalid + rotation leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  SIMPLE_SHAPES,
  createBoard,
  placePolyomino,
  renderPlacementPreview,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
});

const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
const trominoL = SIMPLE_SHAPES.find((s) => s.id === 'tromino-L')!;

describe('Wave 35 poly-ui-preview — validation colors', () => {
  it('valid placement uses highlightColor on every ghost cell', () => {
    const board = createBoard(3, 3);
    const g = renderPlacementPreview(
      board,
      trominoL,
      { row: 0, col: 0 },
      0,
      false,
      { highlightColor: '#00aa00', invalidColor: '#aa0000', cellSize: 10 }
    );
    expect(g.classList.contains('placement-preview')).toBe(true);
    const rects = [...g.querySelectorAll('rect')];
    expect(rects).toHaveLength(3);
    for (const r of rects) {
      expect(r.getAttribute('fill')).toBe('#00aa00');
      expect(r.getAttribute('stroke-dasharray')).toBe('4,4');
      expect(r.getAttribute('fill-opacity')).toBe('0.4');
    }
  });

  it('overlap yields invalidColor', () => {
    let board = createBoard(2, 2);
    board = placePolyomino(board, mono, { row: 0, col: 0 });
    const g = renderPlacementPreview(
      board,
      mono,
      { row: 0, col: 0 },
      0,
      false,
      { highlightColor: '#0f0', invalidColor: '#f00' }
    );
    expect(g.querySelector('rect')?.getAttribute('fill')).toBe('#f00');
  });

  it('out-of-bounds placement is invalid', () => {
    const board = createBoard(2, 2);
    const g = renderPlacementPreview(
      board,
      domino,
      { row: 0, col: 1 },
      0,
      false,
      { highlightColor: '#0f0', invalidColor: '#abc123' }
    );
    expect(g.querySelector('rect')?.getAttribute('fill')).toBe('#abc123');
  });

  it.each([0, 90, 180, 270] as const)(
    'domino rotation %i preview has 2 cells when in-bounds',
    (rot) => {
      const board = createBoard(4, 4);
      const g = renderPlacementPreview(
        board,
        domino,
        { row: 1, col: 1 },
        rot,
        false,
        { cellSize: 8, padding: 1 }
      );
      expect(g.querySelectorAll('rect')).toHaveLength(2);
    }
  );

  it('flipped tromino-L preview still three cells', () => {
    const board = createBoard(4, 4);
    const g = renderPlacementPreview(
      board,
      trominoL,
      { row: 0, col: 0 },
      0,
      true
    );
    expect(g.querySelectorAll('rect')).toHaveLength(3);
  });
});
