/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Fraction Pinball inject CSS residual.
 * Wave55–57 locked banners/hovers; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 58 pinball inject — meta font sizes', () => {
  it('includes player-name 14px + continue 18px leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toMatch(/\.pinball-player-name\s*\{[\s\S]*?font-size:\s*14px/);
    expect(css).toMatch(/\.pinball-continue-btn\s*\{[\s\S]*?font-size:\s*18px/);
    expect(css).toMatch(/\.pinball-final-stats\s*\{[\s\S]*?font-size:\s*14px/);
  });
});
