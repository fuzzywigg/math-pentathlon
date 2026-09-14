/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact default answer-box dashed border.
 * Wave55/56 covered correct/incorrect fills only. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 57 frac inject — answer box dashed', () => {
  it('default .frac-answer-box uses dashed #ccc leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('border: 3px dashed #ccc');
    expect(css).toContain('color: #999');
  });
});
