/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball incorrect feedback CSS.
 * Wave55 covered .pinball-feedback.correct gradient. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 56 pinball inject — incorrect feedback', () => {
  beforeEach(() => document.getElementById('fraction-pinball-styles')?.remove());

  it('includes incorrect feedback #ffebee leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-feedback.incorrect');
    expect(css).toContain('background: #ffebee');
    expect(css).toContain('color: #c62828');
  });
});
