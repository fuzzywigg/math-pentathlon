/**
 * Wave 67 leftover after tip/#324 — Kwatro inject btn-secondary color scoped.
 * Soft toContain existed; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject btn-secondary color scoped', () => {
  it('locks scoped btn-secondary color scoped', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn-secondary\s*\{[\s\S]*?color:\s*#333/);
  });
});
