/**
 * Wave 68 leftover after tip/#336 — Kwatro status fontsize scoped.
 * Wave60 soft fontsize; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject status fontsize scoped', () => {
  it('status uses font-size 1.2rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-status\s*\{[\s\S]*?font-size:\s*1\.2rem/);
  });
});
