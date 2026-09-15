/**
 * Wave 67 leftover after tip/#324 — Kwatro inject main-layout display flex.
 * Soft toContain existed; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject main-layout display flex', () => {
  it('locks scoped main-layout display flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-main-layout\s*\{[\s\S]*?display:\s*flex/);
  });
});
