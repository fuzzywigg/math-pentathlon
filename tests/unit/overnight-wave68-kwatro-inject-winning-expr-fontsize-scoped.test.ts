/**
 * Wave 68 leftover after tip/#336 — Kwatro winning-expr fontsize scoped.
 * Wave60 soft fontsize; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject winning expr fontsize scoped', () => {
  it('winning-expr uses font-size 1.3rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winning-expr\s*\{[\s\S]*?font-size:\s*1\.3rem/);
  });
});
