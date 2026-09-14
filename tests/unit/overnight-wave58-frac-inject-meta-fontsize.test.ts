/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact inject CSS residual.
 * Wave55–57 locked flashier chrome; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 58 frac inject — meta font chrome', () => {
  it('includes player-name 14px uppercase + final-name 18px leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-player-name\s*\{[\s\S]*?font-size:\s*14px/);
    expect(css).toMatch(/\.frac-player-name\s*\{[\s\S]*?text-transform:\s*uppercase/);
    expect(css).toMatch(/\.frac-final-name\s*\{[\s\S]*?font-size:\s*18px/);
  });
});
