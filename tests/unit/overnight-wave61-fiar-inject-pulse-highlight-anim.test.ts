/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — FIAR pulse-highlight anim.
 * Wave58 pins opacity keyframes; deepen .pulse-highlight leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 61 fiar — inject pulse-highlight anim', () => {
  it('pulse-highlight uses fiar-pulse infinite', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.pulse-highlight');
    expect(css).toContain('animation: fiar-pulse 1s ease-in-out infinite');
  });
});
