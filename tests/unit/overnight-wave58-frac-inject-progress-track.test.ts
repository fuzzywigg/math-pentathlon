/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact inject CSS residual.
 * Wave55–57 locked flashier chrome; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 58 frac inject — progress track', () => {
  it('includes progress max-width 200px + bar height 8px #e0e0e0 leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-progress\s*\{[\s\S]*?max-width:\s*200px/);
    expect(css).toMatch(/\.frac-progress-bar\s*\{[\s\S]*?height:\s*8px/);
    expect(css).toMatch(/\.frac-progress-bar\s*\{[\s\S]*?background:\s*#e0e0e0/);
  });
});
