/**
 * Wave 60 leftover after tip/#279 — Ramrod glow animation name on winner banner.
 * Wave55 locked @keyframes only. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 60 ramrod — inject glow anim name', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('applies animation: ramrod-glow on winner banner', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.ramrod-winner-banner\s*\{[^}]*animation:\s*ramrod-glow/
    );
  });
});
