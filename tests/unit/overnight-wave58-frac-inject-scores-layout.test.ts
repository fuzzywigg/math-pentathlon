/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact inject CSS residual.
 * Wave55–57 locked flashier chrome; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 58 frac inject — scores layout', () => {
  it('includes scores space-between + player-score #f5f5f5 leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-scores\s*\{[\s\S]*?justify-content:\s*space-between/);
    expect(css).toMatch(/\.frac-player-score\s*\{[\s\S]*?background:\s*#f5f5f5/);
  });
});
