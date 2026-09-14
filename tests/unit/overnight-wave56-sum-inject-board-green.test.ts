/**
 * Wave 56 leftover after #243 — Sum Dominoes inject board green residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Wave 56 sum — inject board green', () => {
  it('pins .sd-board/#2d5a27 and .sd-cell/#3d7a37', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')!.textContent!;
    expect(css).toContain('.sd-board');
    expect(css).toContain('#2d5a27');
    expect(css).toContain('#3d7a37');
  });
});
