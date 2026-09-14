/**
 * Wave 35 — getFractionBarStyles content + injectFractionBarStyles idempotency.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  getFractionBarStyles,
  injectFractionBarStyles,
} from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document
    .querySelectorAll('#fraction-bar-styles')
    .forEach((el) => el.remove());
});

describe('Wave 35 frac-bar-styles-inject', () => {
  it('stylesheet string includes key selectors', () => {
    const css = getFractionBarStyles();
    for (const needle of [
      '.fraction-bar',
      '.fraction-bar-piece',
      '.fraction-bar-piece:hover',
      '.fraction-bar-piece.selected',
      '.interactive-fraction-bar .fraction-segment:hover',
      '.fraction-comparison',
      '.fraction-comparison .operator',
    ]) {
      expect(css).toContain(needle);
    }
  });

  it('inject once, then idempotent on repeat', () => {
    injectFractionBarStyles();
    injectFractionBarStyles();
    injectFractionBarStyles();
    const nodes = document.querySelectorAll('#fraction-bar-styles');
    expect(nodes).toHaveLength(1);
    expect(nodes[0].textContent).toContain('.fraction-bar');
  });

  it('re-injects after removal', () => {
    injectFractionBarStyles();
    document.getElementById('fraction-bar-styles')?.remove();
    expect(document.getElementById('fraction-bar-styles')).toBeNull();
    injectFractionBarStyles();
    expect(document.getElementById('fraction-bar-styles')).toBeTruthy();
  });
});

