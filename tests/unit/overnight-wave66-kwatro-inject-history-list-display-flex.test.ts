/**
 * Wave 66 leftover after tip/#316 — Kwatro inject history-list display flex.
 * Soft toContain existed; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject history-list display flex', () => {
  it('locks .kwa-history-list display:s*flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-history-list\s*\{[\s\S]*?display:\s*flex/);
  });
});
