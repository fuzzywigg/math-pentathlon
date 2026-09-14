/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact winner-banner gold CSS.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 55 frac inject — winner banner', () => {
  it('includes gold gradient leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-winner-banner');
    expect(css).toContain('linear-gradient(135deg, #ffd700, #ffb700)');
  });
});
