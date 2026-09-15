/**
 * Wave 66 leftover after tip/#316 — Kwatro inject banner radius 12 scoped.
 * Soft toContain existed; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject banner radius 12 scoped', () => {
  it('locks .kwa-winner-banner border-radius:s*12px', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[\s\S]*?border-radius:\s*12px/);
  });
});
