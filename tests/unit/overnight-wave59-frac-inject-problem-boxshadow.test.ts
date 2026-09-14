/**
 * Wave 59 leftover after #272 — Frac Fact inject problem box-shadow.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 59 frac — inject problem-boxshadow', () => {
  it('locks leftover CSS token', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(
      /\.frac-problem\s*\{[\s\S]*?box-shadow:\s*0 4px 12px rgba\(0,0,0,0\.1\)/
    );
  });
});
