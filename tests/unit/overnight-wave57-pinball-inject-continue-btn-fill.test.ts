/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball continue button fill CSS.
 * Wave55 covered hover; base #2196F3 fill unasserted. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 pinball inject — continue btn fill', () => {
  it('includes .pinball-continue-btn background #2196F3 leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-continue-btn');
    expect(css).toMatch(
      /\.pinball-continue-btn\s*\{[\s\S]*?background:\s*#2196F3/
    );
  });
});
