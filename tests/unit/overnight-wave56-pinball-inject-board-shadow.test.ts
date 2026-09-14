/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball board shadow CSS.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball inject — board shadow', () => {
  it('board uses border-radius 12px and deep shadow leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-board');
    expect(css).toContain('border-radius: 12px');
    expect(css).toContain('box-shadow: 0 4px 20px rgba(0,0,0,0.3)');
  });
});
