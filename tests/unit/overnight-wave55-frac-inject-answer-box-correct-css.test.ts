/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact answer-box.correct CSS.
 * Wave54 sampled incorrect only. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 55 frac inject — answer-box correct', () => {
  it('includes correct border/background leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-answer-box.correct');
    expect(css).toContain('#4caf50');
    expect(css).toContain('#e8f5e9');
  });
});
