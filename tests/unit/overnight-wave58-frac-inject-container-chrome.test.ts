/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact inject CSS residual.
 * Wave55–57 locked flashier chrome; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 58 frac inject — container chrome', () => {
  it('includes container margin auto + problem border-radius 12px leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-game-container\s*\{[\s\S]*?margin:\s*0 auto/);
    expect(css).toMatch(/\.frac-problem\s*\{[\s\S]*?border-radius:\s*12px/);
    expect(css).toContain('.frac-final-scores');
    expect(css).toContain('.frac-final-name');
  });
});
