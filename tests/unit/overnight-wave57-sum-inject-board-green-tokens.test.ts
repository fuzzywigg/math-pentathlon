/**
 * Wave 57 leftover after #267 — Sum board green inject tokens. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 57 sum — inject board green tokens', () => {
  it('pins board/cell greens + 22px cell size', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('#2d5a27');
    expect(css).toContain('#3d7a37');
    expect(css).toContain('#1a3a17');
    expect(css).toContain('22px');
  });
});
