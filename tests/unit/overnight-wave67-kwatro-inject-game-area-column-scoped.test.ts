/**
 * Wave 67 leftover after tip/#324 — Kwatro game-area column flex scoped.
 * Wave63 soft flex-direction; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject game-area column scoped', () => {
  it('locks scoped .kwa-game-area flex-direction column', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-game-area\s*\{[\s\S]*?flex-direction:\s*column/);
  });
});
