/**
 * Wave 67 leftover after tip/#324 — Kwatro history panel border-radius scoped.
 * Max-width/bg covered; deepen radius leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject history border-radius scoped', () => {
  it('history panel uses border-radius 8px', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-history\s*\{[\s\S]*?border-radius:\s*8px/);
  });
});
