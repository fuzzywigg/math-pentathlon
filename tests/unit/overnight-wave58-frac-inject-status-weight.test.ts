/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact inject CSS residual.
 * Wave55–57 locked flashier chrome; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 58 frac inject — status weight', () => {
  it('includes .frac-status font-weight 500 + padding 8px 16px leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-status\s*\{[\s\S]*?font-weight:\s*500/);
    expect(css).toMatch(/\.frac-status\s*\{[\s\S]*?padding:\s*8px 16px/);
  });
});
