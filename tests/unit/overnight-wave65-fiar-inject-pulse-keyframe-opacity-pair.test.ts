/**
 * Wave 65 leftover after tip/#305 — FIAR pulse keyframe opacity pair exact.
 * Soft opacity 0.5/1 exists; lock 0%/100% + 50% body pair leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 65 fiar — inject pulse keyframe opacity pair', () => {
  it('fiar-pulse keyframes use 0%/100% 0.5 and 50% 1', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('0%, 100% { opacity: 0.5; }');
    expect(css).toContain('50% { opacity: 1; }');
  });
});
