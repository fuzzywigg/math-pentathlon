/**
 * Wave 66 leftover after tip/#316 — FIAR board svg drop-shadow scoped.
 * Wave54 soft drop-shadow; lock svg filter leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 66 fiar — inject svg drop-shadow scoped', () => {
  it('board svg uses drop-shadow filter', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-board-container svg\s*\{[\s\S]*?filter:\s*drop-shadow\(0 4px 8px rgba\(0,0,0,0\.15\)\)/
    );
  });
});
