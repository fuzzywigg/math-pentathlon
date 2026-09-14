/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact answer-box min size.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac inject — answer-box minsize', () => {
  it('includes min-width 80px and min-height 90px leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('min-width: 80px');
    expect(css).toContain('min-height: 90px');
  });
});
