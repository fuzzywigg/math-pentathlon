/**
 * Overnight HEAVY leftover after #274 — invalid preview uses custom invalidColor.
 * Distinct from wave57 valid green leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  renderPlacementPreview,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 58 core poly-ui — preview invalid custom', () => {
  it('OOB monomino preview fill uses override invalidColor', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const preview = renderPlacementPreview(
      createBoard(2, 2),
      mono,
      { row: 5, col: 5 },
      0,
      false,
      { invalidColor: '#abc123' }
    );
    const rect = preview.querySelector('rect') as SVGRectElement;
    expect(rect.getAttribute('fill')).toBe('#abc123');
  });
});
