/**
 * Wave 68 leftover after tip/#336 — Kwatro status pad 1rem scoped.
 * Wave63 soft pad; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject status pad 1rem scoped', () => {
  it('status uses padding 1rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-status\s*\{[\s\S]*?padding:\s*1rem/);
  });
});
