/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball choice hover CSS values.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball inject — choice hover values', () => {
  it('choice hover includes border/bg/lift leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-choice-btn:hover');
    expect(css).toContain('border-color: #2196F3');
    expect(css).toContain('background: #e3f2fd');
    expect(css).toContain('transform: translateY(-2px)');
  });
});
