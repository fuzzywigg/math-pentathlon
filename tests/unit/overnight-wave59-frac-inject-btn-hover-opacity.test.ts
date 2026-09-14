/**
 * Wave 59 leftover after #272 — Frac Fact inject btn:hover opacity.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 59 frac — inject btn-hover-opacity', () => {
  it('locks leftover CSS token', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-btn:hover\s*\{[\s\S]*?opacity:\s*0\.9/);
  });
});
