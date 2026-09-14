/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — FIAR banner font-size.
 * Wave59 pins bold/margin; deepen 1.5rem leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 61 fiar — inject banner fontsize', () => {
  it('winner banner is 1.5rem', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-winner-banner');
    expect(css).toContain('font-size: 1.5rem');
  });
});
