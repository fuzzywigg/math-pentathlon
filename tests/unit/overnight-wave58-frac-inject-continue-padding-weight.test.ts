/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact inject CSS residual.
 * Wave55–57 locked flashier chrome; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 58 frac inject — continue padding weight', () => {
  it('includes continue padding 12px 32px + font-weight 600 leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-continue-btn\s*\{[\s\S]*?padding:\s*12px 32px/);
    expect(css).toMatch(/\.frac-continue-btn\s*\{[\s\S]*?font-weight:\s*600/);
    expect(css).toMatch(/\.frac-choice-btn\s*\{[\s\S]*?border:\s*2px solid #ddd/);
  });
});
