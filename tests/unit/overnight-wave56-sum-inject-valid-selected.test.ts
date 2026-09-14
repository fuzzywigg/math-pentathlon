/**
 * Wave 56 leftover after #243 — Sum Dominoes inject valid/selected colors residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Wave 56 sum — inject valid selected', () => {
  it('includes valid greens and selected orange', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')!.textContent!;
    expect(css).toContain('#81c784');
    expect(css).toContain('#4caf50');
    expect(css).toContain('#ff9800');
    expect(css).toContain('.sd-cell-valid');
    expect(css).toContain('.sd-hand-domino-selected');
  });
});
