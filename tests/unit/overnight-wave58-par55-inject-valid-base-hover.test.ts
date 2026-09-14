/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Par 55 valid-base hover fill.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 58 par55 — inject valid-base hover', () => {
  it('valid base hover fills #c8e6c9 !important leftover', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toContain('.par55-valid-base:hover');
    expect(css).toContain('fill: #c8e6c9 !important');
  });
});
