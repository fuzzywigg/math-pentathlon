/**
 * Wave 68 leftover after tip/#336 — Kwatro btn radius 6 scoped.
 * Wave63 soft radius; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject btn radius 6 scoped', () => {
  it('btn uses border-radius 6px', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn\s*\{[\s\S]*?border-radius:\s*6px/);
  });
});
