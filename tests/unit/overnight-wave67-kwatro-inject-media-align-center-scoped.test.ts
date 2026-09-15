/**
 * Wave 67 leftover after tip/#324 — Kwatro media align-items center scoped.
 * Wave63 soft toContain; deepen media-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject media align center scoped', () => {
  it('768px media centers main-layout items', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/@media \(max-width: 768px\)\s*\{[\s\S]*?\.kwa-main-layout\s*\{[\s\S]*?align-items:\s*center/);
  });
});
