/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball choice hover fill colors.
 * Wave55 asserted hover selector only. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 pinball inject — choice hover fill', () => {
  it('hover uses #2196F3 border and #e3f2fd fill leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-choice-btn:hover');
    expect(css).toContain('border-color: #2196F3');
    expect(css).toContain('background: #e3f2fd');
  });
});
