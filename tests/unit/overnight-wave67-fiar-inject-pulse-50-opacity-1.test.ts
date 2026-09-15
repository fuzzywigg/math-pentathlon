/**
 * Wave 67 leftover after tip/#316 — FIAR pulse 50% opacity 1.
 * Wave65 opacity pair soft; dedicated 50% opacity 1 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — inject pulse 50% opacity 1', () => {
  it('fiar-pulse 50% reaches opacity 1', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('50% { opacity: 1; }');
  });
});
