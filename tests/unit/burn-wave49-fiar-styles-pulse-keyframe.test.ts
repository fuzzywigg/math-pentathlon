/**
 * Wave 49 — FIAR styles include pulse keyframe leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — pulse css', () => {
  beforeEach(() => {
    document.getElementById('fiar-styles')?.remove();
  });
  it('style sheet declares pulse-highlight animation', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(/\.pulse-highlight/);
    expect(css).toMatch(/@keyframes fiar-pulse/);
    expect(css).toMatch(/\.fiar-winner-banner/);
  });
});
