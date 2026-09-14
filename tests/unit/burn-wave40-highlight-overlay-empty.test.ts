/**
 * Wave 40 — highlight empty overlay + custom styles/animate + createAlignmentHighlight leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createHighlightOverlay,
  createAlignmentHighlight,
  createAlignmentLine,
  HIGHLIGHT_STYLES,
  injectHighlightStyles,
  getHighlightStyles,
} from '../../src/core/alignment';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('alignment-highlight-styles')?.remove();
});

const cellToPixel = (row: number, col: number) => ({
  x: col * 20,
  y: row * 20,
});

describe('Wave 40 highlight — empty overlay + custom animate', () => {
  it('empty positions yield empty alignment-highlight group', () => {
    const g = createHighlightOverlay([], cellToPixel, {
      width: 18,
      height: 18,
    });
    expect(g.classList.contains('alignment-highlight')).toBe(true);
    expect(g.querySelectorAll('rect')).toHaveLength(0);
  });

  it('custom style colors and className apply to overlay rects', () => {
    const g = createHighlightOverlay(
      [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
      ],
      cellToPixel,
      { width: 16, height: 16 },
      {
        fillColor: '#112233',
        fillOpacity: 0.5,
        strokeColor: '#abcdef',
        strokeWidth: 4,
        className: 'highlight-custom-w40',
        animate: true,
      }
    );
    expect(g.classList.contains('highlight-custom-w40')).toBe(true);
    const rects = [...g.querySelectorAll('rect')];
    expect(rects).toHaveLength(2);
    expect(rects[0].getAttribute('fill')).toBe('#112233');
    expect(rects[0].getAttribute('fill-opacity')).toBe('0.5');
    expect(rects[0].getAttribute('stroke')).toBe('#abcdef');
    expect(rects[0].getAttribute('stroke-width')).toBe('4');
  });

  it('createAlignmentHighlight nests overlay + animated line', () => {
    const alignment = {
      value: 'X',
      length: 3,
      direction: 'horizontal' as const,
      start: { row: 0, col: 0 },
      end: { row: 0, col: 2 },
      positions: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
    };
    const g = createAlignmentHighlight(
      alignment,
      cellToPixel,
      { width: 18, height: 18 },
      { ...HIGHLIGHT_STYLES.winning, animate: true }
    );
    expect(g.classList.contains('highlight-winning')).toBe(true);
    expect(g.querySelectorAll('rect').length).toBeGreaterThanOrEqual(3);
    const line = g.querySelector('line');
    expect(line?.classList.contains('animated')).toBe(true);
    expect(line?.getAttribute('x1')).toBe('0');
    expect(line?.getAttribute('x2')).toBe('40');
  });

  it('createAlignmentLine without animate omits animated class', () => {
    const line = createAlignmentLine(
      {
        value: 1,
        length: 2,
        direction: 'vertical',
        start: { row: 0, col: 0 },
        end: { row: 1, col: 0 },
        positions: [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
        ],
      },
      cellToPixel,
      { ...HIGHLIGHT_STYLES.selected, animate: false }
    );
    expect(line.classList.contains('animated')).toBe(false);
  });

  it('injectHighlightStyles idempotent; getHighlightStyles has keyframes', () => {
    injectHighlightStyles();
    injectHighlightStyles();
    expect(document.querySelectorAll('#alignment-highlight-styles')).toHaveLength(
      1
    );
    const css = getHighlightStyles();
    expect(css).toContain('@keyframes pulse-win');
    expect(css).toContain('.highlight-threat');
  });
});
