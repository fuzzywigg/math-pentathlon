/**
 * Wave 68 leftover after tip/#336 — Kwatro banner pad 1.5rem scoped.
 * Wave63 soft pad; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject banner pad 1 5rem scoped', () => {
  it('winner banner uses padding 1.5rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[\s\S]*?padding:\s*1\.5rem/);
  });
});
