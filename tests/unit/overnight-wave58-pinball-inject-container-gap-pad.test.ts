/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Fraction Pinball inject CSS residual.
 * Wave55–57 locked banners/hovers; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 58 pinball inject — container gap pad', () => {
  it('includes container gap 16px padding 16px margin auto leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toMatch(
      /\.pinball-game-container\s*\{[\s\S]*?gap:\s*16px/
    );
    expect(css).toMatch(
      /\.pinball-game-container\s*\{[\s\S]*?padding:\s*16px/
    );
    expect(css).toMatch(
      /\.pinball-game-container\s*\{[\s\S]*?margin:\s*0 auto/
    );
  });
});
