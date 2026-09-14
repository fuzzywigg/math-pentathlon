/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball continue hover #1976d2.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball inject — continue hover blue', () => {
  it('continue hover uses #1976d2 leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-continue-btn:hover');
    expect(css).toContain('background: #1976d2');
  });
});
