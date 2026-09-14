/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball choice hover CSS.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 55 pinball inject — choice hover', () => {
  beforeEach(() => document.getElementById('fraction-pinball-styles')?.remove());

  it('includes choice hover leftover', () => {
    injectFractionPinballStyles();
    const css = document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-choice-btn:hover');
    expect(css).toContain('.pinball-continue-btn:hover');
    expect(css).toContain('grid-template-columns: repeat(2, 1fr)');
  });
});
