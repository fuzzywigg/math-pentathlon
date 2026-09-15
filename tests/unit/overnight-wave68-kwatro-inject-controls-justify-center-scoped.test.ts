/**
 * Wave 68 leftover after tip/#336 — Kwatro controls justify center scoped.
 * Wave63 soft justify; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject controls justify center scoped', () => {
  it('controls uses justify-content center', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-controls\s*\{[\s\S]*?justify-content:\s*center/);
  });
});
