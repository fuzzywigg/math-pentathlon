/**
 * Wave 59 leftover after #272 — Pinball inject score-value 32px.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 59 pinball — inject score-value-fontsize', () => {
  it('locks leftover CSS token', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toMatch(/\.pinball-score-value\s*\{[\s\S]*?font-size:\s*32px/);
  });
});
