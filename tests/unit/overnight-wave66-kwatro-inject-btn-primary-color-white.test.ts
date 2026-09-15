/**
 * Wave 66 leftover after tip/#316 — Kwatro inject btn-primary color white.
 * Soft toContain existed; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject btn-primary color white', () => {
  it('locks .kwa-btn-primary color:s*white', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn-primary\s*\{[\s\S]*?color:\s*white/);
  });
});
