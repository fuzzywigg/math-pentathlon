/**
 * Wave 68 leftover after tip/#336 — Kwatro board shadow scoped.
 * Wave60 soft shadow; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject board shadow scoped', () => {
  it('board uses box-shadow 0 4px 12px', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-board\s*\{[\s\S]*?box-shadow:\s*0 4px 12px rgba\(0,0,0,0\.2\)/);
  });
});
