/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact answer-box.incorrect colors.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac inject — answer-box incorrect', () => {
  it('includes #f44336 and #ffebee leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-answer-box.incorrect');
    expect(css).toContain('#f44336');
    expect(css).toContain('#ffebee');
  });
});
