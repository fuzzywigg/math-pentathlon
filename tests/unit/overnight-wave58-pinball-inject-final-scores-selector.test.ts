/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Fraction Pinball inject CSS residual.
 * Wave55–57 locked banners/hovers; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 58 pinball inject — final scores selectors', () => {
  it('includes final-scores + final-name 18px/600 leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-final-scores');
    expect(css).toMatch(/\.pinball-final-name\s*\{[\s\S]*?font-size:\s*18px/);
    expect(css).toMatch(/\.pinball-final-name\s*\{[\s\S]*?font-weight:\s*600/);
  });
});
