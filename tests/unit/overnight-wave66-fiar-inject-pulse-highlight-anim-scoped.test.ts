/**
 * Wave 66 leftover after tip/#316 — FIAR pulse-highlight anim name scoped.
 * Soft keyframes existed; lock .pulse-highlight leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 66 fiar — inject pulse-highlight anim scoped', () => {
  it('pulse-highlight uses fiar-pulse animation', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.pulse-highlight\s*\{[\s\S]*?animation:\s*fiar-pulse 1s ease-in-out infinite/
    );
  });
});
