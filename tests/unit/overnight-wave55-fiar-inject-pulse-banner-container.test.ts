/**
 * Wave 55 leftover after #249/#250 — FIAR pulse / banner / container CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 55 fiar — inject pulse banner container', () => {
  it('includes pulse keyframes, winner banner, board container, chip-count', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('@keyframes fiar-pulse');
    expect(css).toContain('.pulse-highlight');
    expect(css).toContain('.fiar-winner-banner');
    expect(css).toContain('.fiar-board-container');
    expect(css).toContain('.fiar-chip-count');
  });
});
