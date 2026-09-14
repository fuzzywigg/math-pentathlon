/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Fraction Pinball inject CSS residual.
 * Wave55–57 locked banners/hovers; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 58 pinball inject — round label CSS', () => {
  it('includes round-label 12px #999 uppercase leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toMatch(/\.pinball-round-label\s*\{[\s\S]*?font-size:\s*12px/);
    expect(css).toMatch(/\.pinball-round-label\s*\{[\s\S]*?color:\s*#999/);
    expect(css).toMatch(
      /\.pinball-round-label\s*\{[\s\S]*?text-transform:\s*uppercase/
    );
  });
});
