/**
 * Wave 59 leftover after #272 — Pinball inject challenge box-shadow.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 59 pinball — inject challenge-boxshadow', () => {
  it('locks leftover CSS token', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toMatch(
      /\.pinball-challenge\s*\{[\s\S]*?box-shadow:\s*0 4px 12px rgba\(0,0,0,0\.1\)/
    );
  });
});
