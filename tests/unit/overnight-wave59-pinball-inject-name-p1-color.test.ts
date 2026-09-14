/**
 * Wave 59 leftover after #272 — Pinball inject p1 name #1565c0.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 59 pinball — inject name-p1-color', () => {
  it('locks leftover CSS token', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toMatch(
      /\.pinball-player-score\.player1 \.pinball-player-name\s*\{[\s\S]*?color:\s*#1565c0/
    );
  });
});
