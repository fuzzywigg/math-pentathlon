/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact feedback.correct color.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac inject — feedback correct color', () => {
  it('feedback.correct uses #2e7d32 leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-feedback.correct');
    expect(css).toContain('color: #2e7d32');
  });
});
