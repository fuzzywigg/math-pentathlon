/**
 * Wave 55 leftover after #250 — Ramrod inject 768px layout + glow keyframes.
 * Distinct from wave52 inject ids. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 55 ramrod — inject media 768', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('embeds 768px wrap, glow keyframes, and valid-slot hover', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toMatch(/@media \(max-width: 768px\)/);
    expect(css).toMatch(/@keyframes ramrod-glow/);
    expect(css).toMatch(/\.ramrod-slot\.valid:hover/);
    expect(css).toMatch(/\.ramrod-winner-banner/);
    expect(css).toMatch(/flex-direction: row/);
  });
});
