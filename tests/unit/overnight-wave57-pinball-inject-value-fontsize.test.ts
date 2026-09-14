/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball .pinball-value font-size.
 * Wave55 covered Times/.pinball-fraction; size never. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 pinball inject — value fontsize', () => {
  it('includes .pinball-value font-size 48px leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-value');
    expect(css).toContain('font-size: 48px');
  });
});
