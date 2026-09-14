/**
 * Wave 59 leftover after #272 — Pinball inject feedback-icon 48px.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 59 pinball — inject feedback-icon-fontsize', () => {
  it('locks leftover CSS token', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toMatch(/\.pinball-feedback-icon\s*\{[\s\S]*?font-size:\s*48px/);
  });
});
