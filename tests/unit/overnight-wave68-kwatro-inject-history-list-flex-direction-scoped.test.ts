/**
 * Wave 68 leftover after tip/#336 — Kwatro history-list flex-direction scoped.
 * Wave63 soft flex-dir; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject history list flex direction scoped', () => {
  it('history-list uses flex-direction column', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-history-list\s*\{[\s\S]*?flex-direction:\s*column/);
  });
});
