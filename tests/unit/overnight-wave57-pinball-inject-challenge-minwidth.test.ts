/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball challenge min-width CSS.
 * Distinct from max-width container. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 pinball inject — challenge minwidth', () => {
  it('includes .pinball-challenge min-width 300px leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-challenge');
    expect(css).toContain('min-width: 300px');
  });
});
