/**
 * Wave 68 leftover after tip/#336 — Kwatro banner gradient scoped.
 * Wave60 soft gradient; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject banner gradient scoped', () => {
  it('winner banner uses gold gradient', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[\s\S]*?linear-gradient\(135deg, #ffd700, #ffec8b\)/);
  });
});
