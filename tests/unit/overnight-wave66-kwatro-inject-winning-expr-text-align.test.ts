/**
 * Wave 66 leftover after tip/#316 — Kwatro inject winning-expr text-align.
 * Soft toContain existed; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject winning-expr text-align', () => {
  it('locks .kwa-winning-expr text-align:s*center', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winning-expr\s*\{[\s\S]*?text-align:\s*center/);
  });
});
