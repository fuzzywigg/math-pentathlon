/**
 * Wave 67 leftover after tip/#324 — Kwatro btn-secondary hover #bdbdbd scoped.
 * Wave60 soft toContain; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject secondary hover bdbdbd scoped', () => {
  it('locks scoped .kwa-btn-secondary:hover background #bdbdbd', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn-secondary:hover\s*\{[\s\S]*?background:\s*#bdbdbd/);
  });
});
