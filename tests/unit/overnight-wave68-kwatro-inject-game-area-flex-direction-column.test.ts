/**
 * Wave 68 leftover after tip/#336 — Kwatro game-area flex-direction column scoped.
 * Wave63 soft column; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject game area flex direction column', () => {
  it('game-area uses flex-direction column', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-game-area\s*\{[\s\S]*?flex-direction:\s*column/);
  });
});
