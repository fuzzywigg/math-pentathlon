/**
 * Wave 68 leftover after tip/#336 — Kwatro history max-width 250 scoped.
 * Soft max-width; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject history max width 250 scoped', () => {
  it('history uses max-width 250px', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-history\s*\{[\s\S]*?max-width:\s*250px/);
  });
});
