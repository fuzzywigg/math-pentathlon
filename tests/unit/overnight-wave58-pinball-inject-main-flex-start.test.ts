/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Fraction Pinball inject CSS residual.
 * Wave55–57 locked banners/hovers; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 58 pinball inject — main flex-start', () => {
  it('includes .pinball-main align-items flex-start leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-main');
    expect(css).toMatch(
      /\.pinball-main\s*\{[\s\S]*?align-items:\s*flex-start/
    );
  });
});
