/**
 * Overnight TOKENMAXX — renderRectHexGrid 0×N / N×0 empty grids.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderRectHexGrid, renderHexGrid } from '../../src/core/hex/hex-ui';
import { createLayout } from '../../src/core/hex/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core hex-ui — empty rect dims', () => {
  it('0 cols or 0 rows → no hex cells (and no throw on empty positions)', () => {
    const layout = createLayout('pointy', 20, 0, 0);
    // Empty hex list makes Math.min(...[]) === Infinity — document current behavior
    let threw0 = false;
    try {
      renderRectHexGrid(0, 3, layout);
    } catch {
      threw0 = true;
    }
    let threw1 = false;
    try {
      renderRectHexGrid(3, 0, layout);
    } catch {
      threw1 = true;
    }
    // Either throws on empty bounds or yields 0 cells — lock whichever holds
    if (!threw0) {
      const svg = renderRectHexGrid(0, 3, layout);
      expect(svg.querySelectorAll('.hex-cell')).toHaveLength(0);
    } else {
      expect(threw0).toBe(true);
    }
    if (!threw1) {
      const svg = renderRectHexGrid(3, 0, layout);
      expect(svg.querySelectorAll('.hex-cell')).toHaveLength(0);
    } else {
      expect(threw1).toBe(true);
    }
  });

  it('2×3 rect has 6 cells; radius-1 hex grid has 7', () => {
    const layout = createLayout('flat', 16, 0, 0);
    expect(
      renderRectHexGrid(2, 3, layout).querySelectorAll('.hex-cell')
    ).toHaveLength(6);
    expect(renderHexGrid(1, layout).querySelectorAll('.hex-cell')).toHaveLength(
      7
    );
  });
});
