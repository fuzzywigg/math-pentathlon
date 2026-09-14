/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact inject CSS residual.
 * Wave55–57 locked flashier chrome; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 58 frac inject — feedback padding', () => {
  it('includes .frac-feedback padding 20px 40px leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-feedback\s*\{[\s\S]*?padding:\s*20px 40px/);
  });
});
