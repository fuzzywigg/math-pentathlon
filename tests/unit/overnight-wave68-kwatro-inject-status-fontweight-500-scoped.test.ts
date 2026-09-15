/**
 * Wave 68 leftover after tip/#336 — Kwatro status font-weight 500 scoped.
 * Wave60 soft weight; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject status fontweight 500 scoped', () => {
  it('status uses font-weight 500', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-status\s*\{[\s\S]*?font-weight:\s*500/);
  });
});
