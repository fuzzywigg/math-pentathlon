/**
 * Wave 68 leftover after tip/#336 — Kwatro board gradient scoped.
 * Wave60 soft gradient; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject board gradient scoped', () => {
  it('board uses linear-gradient 135deg e8d4b8', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-board\s*\{[\s\S]*?linear-gradient\(135deg, #e8d4b8, #d4c4a8\)/);
  });
});
