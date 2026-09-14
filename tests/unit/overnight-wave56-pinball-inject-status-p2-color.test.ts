/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball status p2 #c62828 CSS.
 * Wave55 asserted #e3f2fd/#ffebee only. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 56 pinball inject — status p2 color', () => {
  beforeEach(() => document.getElementById('fraction-pinball-styles')?.remove());

  it('includes #c62828 leftover on .pinball-status.player2', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-status.player2');
    expect(css).toContain('color: #c62828');
    expect(css).toContain('.pinball-player-score.player2 .pinball-player-name');
  });
});
