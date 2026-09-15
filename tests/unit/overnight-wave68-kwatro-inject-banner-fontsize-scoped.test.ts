/**
 * Wave 68 leftover after tip/#336 — Kwatro banner fontsize scoped.
 * Wave63 soft fontsize; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject banner fontsize scoped', () => {
  it('winner banner uses font-size 1.5rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[\s\S]*?font-size:\s*1\.5rem/);
  });
});
