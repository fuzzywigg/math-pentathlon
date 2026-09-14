/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Fraction Pinball inject CSS residual.
 * Wave55–57 locked banners/hovers; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 58 pinball inject — choice btn chrome', () => {
  it('includes choice-btn font-size 20px + padding 16px 24px leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toMatch(/\.pinball-choice-btn\s*\{[\s\S]*?font-size:\s*20px/);
    expect(css).toMatch(/\.pinball-choice-btn\s*\{[\s\S]*?padding:\s*16px 24px/);
  });
});
