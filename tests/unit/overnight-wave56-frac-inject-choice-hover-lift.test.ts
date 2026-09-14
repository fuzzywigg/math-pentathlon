/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact choice hover lift -2px.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac inject — choice hover lift', () => {
  it('choice hover uses translateY(-2px) leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-choice-btn:hover');
    expect(css).toContain('transform: translateY(-2px)');
  });
});
