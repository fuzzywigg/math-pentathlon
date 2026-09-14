/**
 * Wave 59 leftover after #272 — Frac Fact inject final-value 28px.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 59 frac — inject final-value-fontsize', () => {
  it('locks leftover CSS token', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-final-value\s*\{[\s\S]*?font-size:\s*28px/);
  });
});
