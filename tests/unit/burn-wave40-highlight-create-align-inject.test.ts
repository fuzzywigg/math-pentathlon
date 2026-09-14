/**
 * Wave 40 — createAlignmentHighlight + injectHighlightStyles leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';

import {
  createAlignmentHighlight,
  injectHighlightStyles,
  HIGHLIGHT_STYLES,
} from '../../src/core/alignment/highlight-ui';
import { DIRECTIONS } from '../../src/core/alignment/types';

describe('Wave 40 highlight — create align / inject', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('injectHighlightStyles is idempotent', () => {
    injectHighlightStyles();
    injectHighlightStyles();
    expect(
      document.querySelectorAll('#alignment-highlight-styles').length
    ).toBe(1);
  });

  it('createAlignmentHighlight builds group with overlay + line', () => {
    const alignment = {
      value: 'X',
      start: { row: 0, col: 0 },
      end: { row: 0, col: 2 },
      positions: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
      direction: DIRECTIONS.HORIZONTAL,
      length: 3,
    };
    const g = createAlignmentHighlight(
      alignment,
      (r, c) => ({ x: c * 20, y: r * 20 }),
      { width: 18, height: 18 },
      HIGHLIGHT_STYLES.winning
    );
    expect(g.tagName.toLowerCase()).toBe('g');
    expect(g.classList.contains('alignment-highlight')).toBe(true);
    expect(g.childNodes.length).toBeGreaterThanOrEqual(2);
  });
});
