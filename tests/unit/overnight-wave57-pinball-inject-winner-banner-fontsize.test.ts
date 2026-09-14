/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball winner banner font-size.
 * Frac twin is 36px; pinball uses 32px. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 pinball inject — winner banner fontsize', () => {
  it('includes .pinball-winner-banner font-size 32px leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-winner-banner');
    expect(css).toMatch(
      /\.pinball-winner-banner\s*\{[\s\S]*?font-size:\s*32px/
    );
  });
});
