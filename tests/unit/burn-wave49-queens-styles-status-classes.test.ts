/**
 * Wave 49 — Queens styles status/banner classes leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectQGStyles } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — style classes', () => {
  beforeEach(() => {
    document.getElementById('qg-styles')?.remove();
  });
  it('declares status and winner banner classes', () => {
    injectQGStyles();
    const css = document.getElementById('qg-styles')!.textContent || '';
    expect(css).toMatch(/\.qg-status/);
    expect(css).toMatch(/\.qg-winner-banner/);
    expect(css).toMatch(/@keyframes qg-glow/);
  });
});
