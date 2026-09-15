/**
 * Wave 68 leftover after tip/#336 — Kwatro status text-align scoped.
 * Wave63 soft align; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject status text align scoped', () => {
  it('status uses text-align center', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-status\s*\{[^}]*text-align:\s*center/);
  });
});
