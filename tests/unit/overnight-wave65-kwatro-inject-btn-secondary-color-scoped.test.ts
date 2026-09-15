/**
 * Wave 65 leftover after tip/#315 — Kwatro secondary btn color #333 scoped.
 * Fill/hover covered; deepen color leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 65 kwatro — inject btn secondary color scoped', () => {
  it('secondary btn text is #333', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn-secondary\s*\{[\s\S]*?color:\s*#333/);
  });
});
