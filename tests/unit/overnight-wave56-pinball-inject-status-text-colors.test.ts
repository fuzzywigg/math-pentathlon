/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball status text colors.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball inject — status text colors', () => {
  it('status.player1 uses color #1565c0 leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-status.player1');
    expect(css).toContain('color: #1565c0');
  });
});
