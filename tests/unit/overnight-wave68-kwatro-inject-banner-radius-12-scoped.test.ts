/**
 * Wave 68 leftover after tip/#336 — Kwatro banner radius 12 scoped.
 * Wave63 soft radius; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject banner radius 12 scoped', () => {
  it('winner banner uses border-radius 12px', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[\s\S]*?border-radius:\s*12px/);
  });
});
