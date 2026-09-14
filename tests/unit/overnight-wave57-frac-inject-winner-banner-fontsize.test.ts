/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact winner banner font-size.
 * Wave55 covered gold gradient; font-size 36px unasserted. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 57 frac inject — winner banner fontsize', () => {
  it('includes .frac-winner-banner font-size 36px leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-winner-banner');
    expect(css).toMatch(/\.frac-winner-banner\s*\{[\s\S]*?font-size:\s*36px/);
  });
});
