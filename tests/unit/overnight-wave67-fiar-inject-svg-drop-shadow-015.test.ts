/**
 * Wave 67 leftover after tip/#336 — FIAR svg drop-shadow 0.15.
 * Soft svg filter; lock drop-shadow 0.15 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — inject svg drop-shadow 0.15', () => {
  it('board svg uses drop-shadow 0.15', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-board-container svg\s*\{[\s\S]*?filter:\s*drop-shadow\(0 4px 8px rgba\(0,0,0,0\.15\)\)/
    );
  });
});
