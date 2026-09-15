/**
 * Wave 68 leftover after tip/#336 — Kwatro game-area gap 1rem scoped.
 * Wave63 soft gap; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject game area gap 1rem scoped', () => {
  it('game-area uses gap 1rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-game-area\s*\{[\s\S]*?gap:\s*1rem/);
  });
});
