/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball status p1 text color.
 * Wave56 asserted p2 #c62828; p1 #1565c0 text unasserted. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 pinball inject — status p1 color', () => {
  it('includes .pinball-status.player1 color #1565c0 leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-status.player1');
    expect(css).toContain('color: #1565c0');
  });
});
