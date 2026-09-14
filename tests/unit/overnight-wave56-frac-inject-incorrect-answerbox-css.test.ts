/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact incorrect answer-box CSS.
 * Wave54 asserted class name; fill leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac inject — incorrect answer box', () => {
  it('includes incorrect answer-box border/fill leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-answer-box.incorrect');
    expect(css).toContain('border-color: #f44336');
    expect(css).toContain('background: #ffebee');
    expect(css).toContain('.frac-feedback.incorrect');
    expect(css).toContain('color: #c62828');
  });
});
