/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Fraction Pinball inject CSS residual.
 * Wave55–57 locked banners/hovers; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 58 pinball inject — active shadow fill', () => {
  it('includes player-score #f5f5f5 + active shadow leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toMatch(
      /\.pinball-player-score\s*\{[\s\S]*?background:\s*#f5f5f5/
    );
    expect(css).toContain('box-shadow: 0 4px 12px rgba(0,0,0,0.15)');
    expect(css).toContain('box-shadow: 0 4px 12px rgba(0,0,0,0.1)');
  });
});
