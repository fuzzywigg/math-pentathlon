/**
 * Wave 67 leftover after tip/#336 — FIAR pulse-highlight animation name.
 * Wave65 opacity pair; lock animation: fiar-pulse leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — inject pulse-highlight anim name', () => {
  it('pulse-highlight runs fiar-pulse infinite', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.pulse-highlight\s*\{[\s\S]*?animation:\s*fiar-pulse 1s ease-in-out infinite/
    );
  });
});
