/**
 * q-mp-507 mutation audit UI wave 17 — kill / re-pin first-20 survivors in
 * core/alignment/highlight-ui. Numeric / boolean / SVG geometry pins only —
 * no player-facing copy asserts.
 *
 * Baseline first-20 on tip post914: strokeWidth / threat+path animate literals
 * and createHighlightOverlay `x - width/2` / `y - height/2` arithmetic.
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  HIGHLIGHT_STYLES,
  createHighlightOverlay,
} from '../../src/core/alignment/highlight-ui';
import type { GridPosition } from '../../src/core/alignment/types';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#alignment-highlight-styles')
    .forEach((el) => el.remove());
});

describe('mutation-ui17 highlight-ui', () => {
  it('pins exact strokeWidth integers for all catalog styles', () => {
    // Survivors m1/m2/m4/m5/m7/m8/m10/m11: NumericBoundary on strokeWidth.
    expect(HIGHLIGHT_STYLES.winning.strokeWidth).toBe(3);
    expect(HIGHLIGHT_STYLES.selected.strokeWidth).toBe(2);
    expect(HIGHLIGHT_STYLES.threat.strokeWidth).toBe(2);
    expect(HIGHLIGHT_STYLES.path.strokeWidth).toBe(2);
  });

  it('pins threat/path animate booleans (winning/selected already covered)', () => {
    // Survivors m9/m12: threat.animate true→false, path.animate false→true.
    expect(HIGHLIGHT_STYLES.winning.animate).toBe(true);
    expect(HIGHLIGHT_STYLES.selected.animate).toBe(false);
    expect(HIGHLIGHT_STYLES.threat.animate).toBe(true);
    expect(HIGHLIGHT_STYLES.path.animate).toBe(false);
  });

  it('createHighlightOverlay centers rects with width/2 and height/2', () => {
    // Survivors m13–m20: flip -→+ / /→* and 2→3/1 on L162–L163.
    const positions: GridPosition[] = [{ row: 1, col: 2 }];
    const cellToPixel = (row: number, col: number) => ({
      x: col * 40 + 20,
      y: row * 40 + 20,
    });
    const cellSize = { width: 36, height: 24 };
    const group = createHighlightOverlay(
      positions,
      cellToPixel,
      cellSize,
      HIGHLIGHT_STYLES.selected
    );
    const rect = group.querySelector('rect');
    expect(rect).not.toBeNull();
    // cellToPixel(1,2) → {x:100,y:60}; x-18=82, y-12=48.
    expect(rect!.getAttribute('x')).toBe('82');
    expect(rect!.getAttribute('y')).toBe('48');
    expect(rect!.getAttribute('width')).toBe('36');
    expect(rect!.getAttribute('height')).toBe('24');
    expect(rect!.getAttribute('stroke-width')).toBe('2');
  });
});
