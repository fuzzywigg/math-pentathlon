/**
 * Wave 67 leftover after tip/#324 — Kwatro btn-primary hover translate scoped.
 * Wave60 soft translateY; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject primary hover translate scoped', () => {
  it('locks scoped .kwa-btn-primary:hover translateY(-2px)', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn-primary:hover\s*\{[\s\S]*?transform:\s*translateY\(-2px\)/);
  });
});
