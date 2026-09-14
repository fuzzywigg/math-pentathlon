/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball feedback.correct color.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball inject — feedback correct color', () => {
  it('correct feedback includes color #2e7d32 leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-feedback.correct');
    expect(css).toContain('color: #2e7d32');
  });
});
