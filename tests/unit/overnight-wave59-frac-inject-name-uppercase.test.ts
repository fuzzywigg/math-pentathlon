/**
 * Wave 59 leftover after #272 — Frac Fact inject player-name uppercase.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 59 frac — inject name-uppercase', () => {
  it('locks leftover CSS token', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-player-name\s*\{[\s\S]*?text-transform:\s*uppercase/);
  });
});
