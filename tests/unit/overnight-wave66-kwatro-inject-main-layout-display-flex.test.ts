/**
 * Wave 66 leftover after tip/#316 — Kwatro inject main-layout display flex.
 * Soft toContain existed; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject main-layout display flex', () => {
  it('locks .kwa-main-layout display:s*flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-main-layout\s*\{[\s\S]*?display:\s*flex/);
  });
});
