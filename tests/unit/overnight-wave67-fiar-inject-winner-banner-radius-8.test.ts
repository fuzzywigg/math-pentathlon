/**
 * Wave 67 leftover after tip/#316 — FIAR winner-banner radius 8px.
 * Wave58 soft radius; lock border-radius 8px leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — inject winner-banner radius 8', () => {
  it('winner-banner uses border-radius 8px', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-winner-banner\s*\{[\s\S]*?border-radius:\s*8px/
    );
  });
});
