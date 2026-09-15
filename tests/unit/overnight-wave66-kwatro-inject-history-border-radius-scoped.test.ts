/**
 * Wave 66 leftover after tip/#316 — Kwatro inject history border-radius scoped.
 * Soft toContain existed; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject history border-radius scoped', () => {
  it('locks .kwa-history border-radius:s*8px', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-history\s*\{[\s\S]*?border-radius:\s*8px/);
  });
});
