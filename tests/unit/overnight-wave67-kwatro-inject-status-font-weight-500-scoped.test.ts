/**
 * Wave 67 leftover after tip/#324 — Kwatro status font-weight 500 scoped.
 * Wave60 soft toContain; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject status font-weight 500 scoped', () => {
  it('locks scoped .kwa-status font-weight 500', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-status\s*\{[\s\S]*?font-weight:\s*500/);
  });
});
