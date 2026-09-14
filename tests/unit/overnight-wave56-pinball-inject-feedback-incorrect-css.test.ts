/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball feedback.incorrect CSS.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball inject — feedback incorrect', () => {
  it('incorrect feedback uses #ffebee / #c62828 leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-feedback.incorrect');
    expect(css).toContain('background: #ffebee');
    expect(css).toContain('color: #c62828');
  });
});
