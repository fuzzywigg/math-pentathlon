/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Fraction Pinball inject CSS residual.
 * Wave55–57 locked banners/hovers; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 58 pinball inject — feedback text font-size', () => {
  it('includes .pinball-feedback-text font-size 24px leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toMatch(
      /\.pinball-feedback-text\s*\{[\s\S]*?font-size:\s*24px/
    );
  });
});
