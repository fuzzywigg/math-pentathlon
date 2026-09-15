/**
 * Wave 65 leftover after tip/#315 — Kwatro btn font-weight bold scoped.
 * Global bold may exist; deepen .kwa-btn scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 65 kwatro — inject btn font-weight bold scoped', () => {
  it('kwa-btn uses font-weight bold', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn\s*\{[\s\S]*?font-weight:\s*bold/);
  });
});
