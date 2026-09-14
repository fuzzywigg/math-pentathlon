/**
 * Overnight HEAVY leftover after #264 — renderPlacementPreview valid → green.
 * Distinct from wave52 OOB invalid red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  renderPlacementPreview,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 57 core poly-ui — preview valid green', () => {
  it('valid domino preview uses highlight green', () => {
    const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    const preview = renderPlacementPreview(
      createBoard(4, 4),
      domino,
      { row: 0, col: 0 }
    );
    const rect = preview.querySelector('rect') as SVGRectElement;
    expect(rect.getAttribute('fill')).toBe('#4caf50');
    expect(preview.querySelectorAll('rect')).toHaveLength(2);
  });
});
