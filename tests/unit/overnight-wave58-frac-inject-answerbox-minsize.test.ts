/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact inject CSS residual.
 * Wave55–57 locked flashier chrome; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 58 frac inject — answer-box min size', () => {
  it('includes .frac-answer-box min-width 80px / min-height 90px leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-answer-box');
    expect(css).toMatch(/\.frac-answer-box\s*\{[\s\S]*?min-width:\s*80px/);
    expect(css).toMatch(/\.frac-answer-box\s*\{[\s\S]*?min-height:\s*90px/);
  });
});
