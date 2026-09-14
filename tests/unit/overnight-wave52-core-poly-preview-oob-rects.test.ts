/**
 * Overnight HEAVY leftover after #234 — OOB preview still emits one rect per cell with invalidColor.
 * Distinct from burn-wave35-poly-ui-preview-matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  renderPlacementPreview,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 52 core poly — preview oob rects', () => {
  it('negative anchor draws rects filled with invalidColor (#f44336)', () => {
    const board = createBoard(4, 4);
    const shape = SIMPLE_SHAPES.find((s) => s.cells.length >= 2)!;
    const group = renderPlacementPreview(board, shape, { row: -1, col: -1 });
    const rects = group.querySelectorAll('rect');
    expect(rects.length).toBe(shape.cells.length);
    expect([...rects].every((r) => r.getAttribute('fill') === '#f44336')).toBe(
      true
    );
  });
});
