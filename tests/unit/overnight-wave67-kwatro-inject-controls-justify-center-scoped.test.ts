/**
 * Wave 67 leftover after tip/#324 — Kwatro controls justify-content scoped.
 * Wave63 soft toContain; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject controls justify center scoped', () => {
  it('locks scoped .kwa-controls justify-content center', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-controls\s*\{[\s\S]*?justify-content:\s*center/);
  });
});
