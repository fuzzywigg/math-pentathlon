/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact choice hover transform/border.
 * Wave54 asserted selector string only. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 57 frac inject — choice hover transform', () => {
  it('includes translateY(-2px) and #2196F3 hover leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-choice-btn:hover');
    expect(css).toContain('transform: translateY(-2px)');
    expect(css).toContain('border-color: #2196F3');
  });
});
