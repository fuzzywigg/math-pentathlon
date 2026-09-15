/**
 * Wave 68 leftover after tip/#336 — Kwatro banner animation scoped.
 * Wave63 soft anim; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject banner animation scoped', () => {
  it('winner banner uses kwa-glow animation', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[\s\S]*?animation:\s*kwa-glow 1s ease-in-out infinite alternate/);
  });
});
