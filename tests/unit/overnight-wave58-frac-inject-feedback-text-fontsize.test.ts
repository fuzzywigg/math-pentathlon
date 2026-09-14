/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact inject CSS residual.
 * Wave55–57 locked flashier chrome; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 58 frac inject — feedback text font-size', () => {
  it('includes .frac-feedback-text font-size 24px leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-feedback-text');
    expect(css).toMatch(/\.frac-feedback-text\s*\{[\s\S]*?font-size:\s*24px/);
  });
});
