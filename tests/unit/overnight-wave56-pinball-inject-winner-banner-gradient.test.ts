/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball winner banner full gradient.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball inject — winner banner gradient', () => {
  it('winner banner uses gold gradient leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('linear-gradient(135deg, #ffd700, #ffb700)');
  });
});
