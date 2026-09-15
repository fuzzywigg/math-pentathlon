/**
 * Wave 68 leftover after tip/#336 — Kwatro game-area align-items center scoped.
 * Wave63 soft align; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject game area align items center', () => {
  it('game-area uses align-items center', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-game-area\s*\{[\s\S]*?align-items:\s*center/);
  });
});
