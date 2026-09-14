/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Fraction Pinball inject CSS residual.
 * Wave55–57 locked banners/hovers; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 58 pinball inject — choices display grid', () => {
  it('includes .pinball-choices display grid leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toMatch(/\.pinball-choices\s*\{[\s\S]*?display:\s*grid/);
  });
});
