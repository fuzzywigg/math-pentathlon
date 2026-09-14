/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball board CSS box-shadow.
 * SVG fill/rx covered earlier; CSS shadow never. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 pinball inject — board boxshadow', () => {
  it('includes .pinball-board box-shadow leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-board');
    expect(css).toContain('box-shadow: 0 4px 20px rgba(0,0,0,0.3)');
  });
});
