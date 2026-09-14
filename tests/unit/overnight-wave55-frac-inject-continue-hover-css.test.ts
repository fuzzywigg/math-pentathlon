/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact continue hover CSS.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 55 frac inject — continue hover', () => {
  it('includes continue hover darken leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-continue-btn:hover');
    expect(css).toContain('#1976d2');
    expect(css).toContain('transform: translateY(-1px)');
  });
});
