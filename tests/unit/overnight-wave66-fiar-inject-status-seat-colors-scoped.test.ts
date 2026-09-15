/**
 * Wave 66 leftover after tip/#316 — FIAR status seat color vars scoped.
 * Soft seat classes existed; lock .fiar-status.player1/2 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 66 fiar — inject status seat colors scoped', () => {
  it('status seats use player1/2 CSS color vars', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-status\.player1\s*\{[\s\S]*?color:\s*var\(--color-player1, #2196f3\)/
    );
    expect(css).toMatch(
      /\.fiar-status\.player2\s*\{[\s\S]*?color:\s*var\(--color-player2, #f44336\)/
    );
  });
});
