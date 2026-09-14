/**
 * Wave 59 leftover after #272 — Pinball inject player-score #f5f5f5.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 59 pinball — inject player-score-fill', () => {
  it('locks leftover CSS token', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toMatch(/\.pinball-player-score\s*\{[\s\S]*?background:\s*#f5f5f5/);
  });
});
